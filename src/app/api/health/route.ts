import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/db";

export const dynamic = "force-dynamic";

const START_TIME = Date.now();

export async function GET() {
  try {
    const stats = await getAdminStats();
    const memory = process.memoryUsage();

    return NextResponse.json({
      status: "healthy",
      service: "URAN’26 Hackathon Core Backend",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
      metrics: {
        totalRegisteredTeams: stats.totalTeams,
        totalParticipants: stats.totalParticipants,
        checkedInTeams: stats.checkedInTeams,
        memoryUsageMb: {
          rss: Math.round(memory.rss / (1024 * 1024)),
          heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
        },
      },
      engine: {
        database: "ATOMIC_FILE_SYSTEM_PERSISTENCE",
        rateLimiter: "SLIDING_WINDOW_IN_MEMORY",
        paymentModel: "ON_SPOT_AT_PMIST_CHECKIN",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "unhealthy", error: err.message },
      { status: 503 }
    );
  }
}
