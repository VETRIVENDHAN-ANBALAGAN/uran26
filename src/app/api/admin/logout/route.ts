import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully." });
  response.cookies.delete("uran26_admin_token");
  response.cookies.delete("uran26_admin_pass");
  return response;
}
