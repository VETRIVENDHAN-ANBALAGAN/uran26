import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/security/admin-auth";
import { getAdminStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access: Valid organizer credentials required." },
      { status: 401 }
    );
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate admin stats." },
      { status: 500 }
    );
  }
}
