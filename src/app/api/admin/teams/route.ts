import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/security/admin-auth";
import { getAllRegistrations } from "@/lib/db";
import { sanitizeString } from "@/lib/security/validator";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access: Valid organizer key required." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const track = sanitizeString(searchParams.get("track") || "");
    const checkInStatus = sanitizeString(searchParams.get("checkInStatus") || "");
    const paymentStatus = sanitizeString(searchParams.get("paymentStatus") || "");
    const search = sanitizeString(searchParams.get("search") || "");

    const teams = await getAllRegistrations({
      track: track || undefined,
      checkInStatus: checkInStatus || undefined,
      paymentStatus: paymentStatus || undefined,
      search: search || undefined,
    });

    return NextResponse.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve teams." },
      { status: 500 }
    );
  }
}
