import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/security/admin-auth";
import { getTeamByToken, updateTeamRegistration, disqualifyTeam } from "@/lib/db";
import { sanitizeString } from "@/lib/security/validator";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { token } = await params;
    const team = await getTeamByToken(token);
    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { token } = await params;
    const body = await req.json();
    const updated = await updateTeamRegistration(token, body);
    return NextResponse.json({ success: true, team: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { token } = await params;
    const { searchParams } = new URL(req.url);
    const reason = sanitizeString(searchParams.get("reason") || "Disqualified by organizer admin.");
    const disqualified = await disqualifyTeam(token, reason, "ORGANIZER_ADMIN");
    return NextResponse.json({ success: true, message: "Team status marked as DISQUALIFIED.", team: disqualified });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
