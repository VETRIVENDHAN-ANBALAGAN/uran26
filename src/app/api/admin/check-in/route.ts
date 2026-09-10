import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/security/admin-auth";
import { validateCheckInPayload } from "@/lib/security/validator";
import { checkInAndCollectPayment, getTeamByToken } from "@/lib/db";

export async function POST(req: Request) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access: Valid organizer credentials required." },
      { status: 401 }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = validateCheckInPayload(rawBody);

    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", details: validation.errors },
        { status: 400 }
      );
    }

    const { token, amountPaid, paymentMode, collectedBy, notes } = validation.data;

    // Verify team exists
    const existing = await getTeamByToken(token);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Team with code "${token}" was not found in database.` },
        { status: 404 }
      );
    }

    if (existing.checkInStatus === "CHECKED_IN") {
      return NextResponse.json(
        {
          success: false,
          error: `Team "${existing.teamName}" has already checked in with receipt #${existing.paymentReceipt?.receiptNo}.`,
          team: existing,
        },
        { status: 409 }
      );
    }

    // Execute check-in and mark on-spot payment
    const updatedTeam = await checkInAndCollectPayment(token, {
      amountPaid,
      paymentMode,
      collectedBy,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: `Team "${updatedTeam.teamName}" successfully checked in. Receipt #${updatedTeam.paymentReceipt?.receiptNo} generated.`,
      team: updatedTeam,
      receipt: updatedTeam.paymentReceipt,
    });
  } catch (error: any) {
    console.error("[ADMIN CHECK-IN ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process on-spot check-in." },
      { status: 500 }
    );
  }
}
