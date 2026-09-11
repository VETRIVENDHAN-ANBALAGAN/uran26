import crypto from "crypto";
import { getAdminsCollection, isMongoConfigured } from "../db/mongodb";

export const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
export const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || "uran26@admin";
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || "uran26_pmist_secure_session_salt_2026";

// Generates an HMAC SHA-256 signed session token valid for 24 hours
export function createAdminSessionToken(username: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = Buffer.from(JSON.stringify({ u: username, exp: expiresAt })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

// Validates the HMAC signature and expiration of the session token
export function verifyAdminSessionToken(token: string): boolean {
  if (!token || !token.includes(".")) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSig) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (decoded.exp && decoded.exp > Date.now()) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

// Validates username and password against environment configuration and MongoDB admins collection
export async function validateAdminCredentials(username: string, pass: string): Promise<boolean> {
  const cleanUser = (username || "").trim().toLowerCase();
  const cleanPass = pass || "";

  // 1. Primary check against configured environment credentials
  if (cleanUser === DEFAULT_ADMIN_USER.toLowerCase() && cleanPass === DEFAULT_ADMIN_PASS) {
    return true;
  }

  // 2. Fallback check against legacy secret key
  if (cleanPass === DEFAULT_ADMIN_PASS || (process.env.ADMIN_SECRET_KEY && cleanPass === process.env.ADMIN_SECRET_KEY)) {
    if (cleanUser === "admin" || cleanUser === "organizer") {
      return true;
    }
  }

  // 3. Check MongoDB admins collection if configured
  if (isMongoConfigured()) {
    try {
      const adminsCol = await getAdminsCollection();
      if (adminsCol) {
        const adminDoc = await adminsCol.findOne({
          username: { $regex: new RegExp(`^${cleanUser}$`, "i") },
        });
        if (adminDoc && adminDoc.passwordHash === cleanPass) {
          return true;
        }
      }
    } catch (err) {
      console.error("[ADMIN AUTH MONGODB CHECK ERROR]:", err);
    }
  }

  return false;
}

export function verifyAdminAuth(req: Request): boolean {
  // 1. Check Bearer Token in Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (verifyAdminSessionToken(token) || token === DEFAULT_ADMIN_PASS || (process.env.ADMIN_SECRET_KEY && token === process.env.ADMIN_SECRET_KEY)) {
      return true;
    }
  }

  // 2. Check 'x-admin-key' custom header
  const adminHeader = req.headers.get("x-admin-key");
  if (adminHeader) {
    if (
      verifyAdminSessionToken(adminHeader) ||
      adminHeader === DEFAULT_ADMIN_PASS ||
      (process.env.ADMIN_SECRET_KEY && adminHeader === process.env.ADMIN_SECRET_KEY)
    ) {
      return true;
    }
  }

  // 3. Check cookie (for browser session access in admin panel)
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, v] = c.trim().split("=");
        return [k, v];
      })
    );

    const tokenFromCookie = cookies["uran26_admin_token"] || cookies["uran26_admin_pass"];
    if (tokenFromCookie) {
      if (
        verifyAdminSessionToken(tokenFromCookie) ||
        tokenFromCookie === DEFAULT_ADMIN_PASS ||
        (process.env.ADMIN_SECRET_KEY && tokenFromCookie === process.env.ADMIN_SECRET_KEY)
      ) {
        return true;
      }
    }
  }

  return false;
}
