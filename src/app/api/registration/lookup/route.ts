import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { getTeamByToken, getTeamByPhone, getTeamByEmail } from "@/lib/db";
import { sanitizeString } from "@/lib/security/validator";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const rateResult = checkRateLimit(req, "LOOKUP");
  if (!rateResult.isAllowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many lookup requests. Please wait a moment before trying again.",
      },
      { status: 429, headers: rateResult.headers }
    );
  }

  const { searchParams } = new URL(req.url);
  const token = sanitizeString(searchParams.get("token") || "");
  const phone = sanitizeString(searchParams.get("phone") || "");
  const email = sanitizeString(searchParams.get("email") || "");

  if (!token && !phone && !email) {
    return NextResponse.json(
      {
        success: false,
        error: "Please provide a registration token, phone number, or email to look up registration status.",
      },
      { status: 400, headers: rateResult.headers }
    );
  }

  try {
    let team = null;
    if (token) {
      team = await getTeamByToken(token);
    } else if (phone) {
      team = await getTeamByPhone(phone);
    } else if (email) {
      team = await getTeamByEmail(email);
    }

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          error: "No pre-registration record found with the provided details. Please check your Team Code or register online.",
        },
        { status: 404, headers: rateResult.headers }
      );
    }

    // Return sanitized public delegate summary
    return NextResponse.json(
      {
        success: true,
        registration: {
          registrationToken: team.registrationToken,
          teamName: team.teamName,
          leaderName: team.leaderName,
          college: team.college,
          teamSize: team.teamSize,
          preferredTrack: team.preferredTrack,
          paymentStatus: team.paymentStatus,
          checkInStatus: team.checkInStatus,
          totalPayableOnSpot: team.totalPayableOnSpot,
          ratePerPerson: team.ratePerPerson,
          accommodationRequested: team.accommodationRequested,
          registeredAt: team.registeredAtFormatted,
          hasValidStudentIds: team.hasValidStudentIds,
          receiptNo: team.paymentReceipt?.receiptNo,
          members: team.members.map((m) => ({
            name: m.name,
            role: m.role,
          })),
        },
      },
      { status: 200, headers: rateResult.headers }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to look up registration record." },
      { status: 500, headers: rateResult.headers }
    );
  }
}
