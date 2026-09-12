import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/security/admin-auth";
import { getAdminStats } from "@/lib/db";

import { checkMongoConnection } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access: Valid organizer credentials required." },
      { status: 401 }
    );
  }

  try {
    const [stats, mongoStatus] = await Promise.all([
      getAdminStats(),
      checkMongoConnection(),
    ]);

    stats.dbConnected = mongoStatus.isConnected;
    stats.dbMode = mongoStatus.isConnected ? "MONGODB_ATLAS" : "LOCAL_FILE_SYSTEM";

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
