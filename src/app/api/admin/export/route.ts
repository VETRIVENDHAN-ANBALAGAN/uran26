import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/security/admin-auth";
import { getAllRegistrations } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access: Valid organizer credentials required." },
      { status: 401 }
    );
  }

  try {
    const teams = await getAllRegistrations();

    // CSV Header row
    const headers = [
      "Team Token",
      "Team Name",
      "Leader Name",
      "Leader Phone",
      "Leader Email",
      "College / University",
      "Team Size",
      "Preferred Track",
      "Accommodation (25th Sept)",
      "Check-In Status",
      "Payment Status",
      "Total Fee (₹)",
      "Amount Paid (₹)",
      "Payment Mode",
      "Receipt No",
      "Registered At",
      "All Squad Member Names",
    ];

    const escapeCsv = (str: unknown) => {
      const val = str === null || str === undefined ? "" : String(str);
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows = teams.map((t) => {
      const memberNames = (t.members || []).map((m) => m.name).join("; ");
      return [
        escapeCsv(t.registrationToken),
        escapeCsv(t.teamName),
        escapeCsv(t.leaderName),
        escapeCsv(t.leaderPhone),
        escapeCsv(t.leaderEmail),
        escapeCsv(t.college),
        escapeCsv(t.teamSize),
        escapeCsv(t.preferredTrack),
        escapeCsv(t.accommodationRequested ? "YES" : "NO"),
        escapeCsv(t.checkInStatus),
        escapeCsv(t.paymentStatus),
        escapeCsv(t.totalPayableOnSpot),
        escapeCsv(t.paymentReceipt?.amountPaid || 0),
        escapeCsv(t.paymentReceipt?.paymentMode || "N/A"),
        escapeCsv(t.paymentReceipt?.receiptNo || "N/A"),
        escapeCsv(t.registeredAtFormatted),
        escapeCsv(memberNames),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="uran26_registrations_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate CSV export." },
      { status: 500 }
    );
  }
}
