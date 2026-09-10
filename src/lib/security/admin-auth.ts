export const DEFAULT_ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "uran26_pmist_organizer_secret_key";

export function verifyAdminAuth(req: Request): boolean {
  // Check header 'x-admin-key'
  const adminHeader = req.headers.get("x-admin-key");
  if (adminHeader && adminHeader === DEFAULT_ADMIN_KEY) {
    return true;
  }

  // Check Bearer Token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token === DEFAULT_ADMIN_KEY) {
      return true;
    }
  }

  // Check cookie (for browser session access in admin panel)
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, v] = c.trim().split("=");
        return [k, v];
      })
    );
    if (cookies["uran26_admin_pass"] === DEFAULT_ADMIN_KEY) {
      return true;
    }
  }

  return false;
}
