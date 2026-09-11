import { NextResponse } from "next/server";
import { validateAdminCredentials, createAdminSessionToken } from "@/lib/security/admin-auth";
import { sanitizeString } from "@/lib/security/validator";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { logSecurityEvent } from "@/lib/security/audit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Rate limit protection on login endpoint (uses ADMIN tier: max 150/min)
  const rateResult = checkRateLimit(req, "ADMIN");
  if (!rateResult.isAllowed) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please wait a moment." },
      { status: 429, headers: rateResult.headers }
    );
  }

  try {
    const body = await req.json();
    const username = sanitizeString(body.username || "");
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both Login ID / Username and Password." },
        { status: 400, headers: rateResult.headers }
      );
    }

    const isValid = await validateAdminCredentials(username, password);
    if (!isValid) {
      await logSecurityEvent("UNAUTHORIZED_ADMIN_ATTEMPT", rateResult.ip, {
        attemptedUser: username,
      });

      return NextResponse.json(
        { success: false, error: "Invalid Login ID or Password. Access denied." },
        { status: 401, headers: rateResult.headers }
      );
    }

    // Generate signed HMAC session token
    const token = createAdminSessionToken(username);

    const response = NextResponse.json(
      {
        success: true,
        message: "Organizer authentication successful.",
        token,
        user: {
          username,
          role: "ORGANIZER_ADMIN",
        },
      },
      { status: 200, headers: rateResult.headers }
    );

    // Set secure cookie for browser sessions
    response.cookies.set("uran26_admin_token", token, {
      httpOnly: false, // Accessible to client-side scripts to facilitate header attachment
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process login." },
      { status: 500, headers: rateResult.headers }
    );
  }
}
