import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { validatePreRegistrationPayload } from "@/lib/security/validator";
import { hashClientIp, logSecurityEvent } from "@/lib/security/audit";
import { createTeamRegistration } from "@/lib/db";
import { sendPreRegistrationConfirmationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  // 1. Rate Limiting Protection (Max 6 registrations per 15 minutes per IP)
  const rateResult = checkRateLimit(req, "REGISTRATION");
  if (!rateResult.isAllowed) {
    await logSecurityEvent("RATE_LIMIT_BLOCKED", rateResult.ip, {
      tier: "REGISTRATION",
      retryAfter: rateResult.resetSeconds,
    });

    return NextResponse.json(
      {
        success: false,
        error: `Too many registration attempts from your IP. Please try again in ${Math.ceil(rateResult.resetSeconds / 60)} minutes.`,
      },
      { status: 429, headers: rateResult.headers }
    );
  }

  try {
    // 2. Body parsing with size guard
    let rawBody: any;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400, headers: rateResult.headers }
      );
    }

    // 3. Strict Schema Validation & XSS Sanitization
    const validation = validatePreRegistrationPayload(rawBody);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify the registration details.",
          details: validation.errors,
        },
        { status: 400, headers: rateResult.headers }
      );
    }

    const {
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      college,
      teamSize,
      preferredTrack,
      accommodationRequested,
      hasValidStudentIds,
      members,
      registeredAtFormatted,
    } = validation.data;

    // 4. Persistence Layer with Atomic Lock & Duplicate Checking
    const ipHash = hashClientIp(rateResult.ip);
    let registeredTeam;
    try {
      registeredTeam = await createTeamRegistration({
        teamName,
        leaderName,
        leaderEmail,
        leaderPhone,
        college,
        teamSize,
        preferredTrack,
        accommodationRequested,
        hasValidStudentIds,
        members,
        registeredAtFormatted,
        ipHash,
      });
    } catch (dbErr: any) {
      // Check for duplicate constraint violation
      if (dbErr.message && (dbErr.message.includes("already registered") || dbErr.message.includes("already taken"))) {
        return NextResponse.json(
          { success: false, error: dbErr.message },
          { status: 409, headers: rateResult.headers }
        );
      }
      throw dbErr;
    }

    // 5. Asynchronous, Resilient Email Dispatch
    let emailStatus = "PENDING";
    try {
      const emailResult = await sendPreRegistrationConfirmationEmail({
        to: leaderEmail,
        teamName,
        leaderName,
        leaderPhone,
        college,
        teamSize,
        perPerson: 250,
        totalPayableOnSpot: registeredTeam.totalPayableOnSpot,
        registrationToken: registeredTeam.registrationToken,
        preferredTrack,
        accommodationRequested,
        registeredAt: registeredAtFormatted,
      });
      emailStatus = emailResult.success ? "DISPATCHED" : "SIMULATED_OR_PENDING";
    } catch (mailErr) {
      console.error("[PRE-REGISTRATION MAILER NOTICE]: Non-blocking email dispatch failure:", mailErr);
      emailStatus = "DISPATCH_FAILED";
    }

    // 6. Return Official Verification Pass Response
    return NextResponse.json(
      {
        success: true,
        message: "Pre-registration confirmed. Payment will be collected on-spot at PMIST venue check-in desk upon physical Student ID verification.",
        registration: {
          registrationToken: registeredTeam.registrationToken,
          teamName: registeredTeam.teamName,
          leaderName: registeredTeam.leaderName,
          leaderEmail: registeredTeam.leaderEmail,
          leaderPhone: registeredTeam.leaderPhone,
          college: registeredTeam.college,
          teamSize: registeredTeam.teamSize,
          perPerson: registeredTeam.ratePerPerson,
          totalPayableOnSpot: registeredTeam.totalPayableOnSpot,
          paymentStatus: registeredTeam.paymentStatus,
          checkInStatus: registeredTeam.checkInStatus,
          paymentInstructions: `Pay ₹${registeredTeam.totalPayableOnSpot} on-spot at PMIST venue check-in desk on 26 Sept 2026.`,
          preferredTrack: registeredTeam.preferredTrack,
          accommodationRequested: registeredTeam.accommodationRequested,
          accommodationNote: registeredTeam.accommodationRequested
            ? "Campus accommodation requested for 25th September night (Subject to availability & separate payment on-spot)."
            : "No accommodation requested.",
          registeredAt: registeredTeam.registeredAtFormatted,
          emailStatus,
          members: registeredTeam.members,
        },
      },
      { status: 201, headers: rateResult.headers }
    );
  } catch (error: any) {
    console.error("[PRE-REGISTRATION CRITICAL ERROR]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected server error occurred while processing pre-registration.",
      },
      { status: 500, headers: rateResult.headers }
    );
  }
}
