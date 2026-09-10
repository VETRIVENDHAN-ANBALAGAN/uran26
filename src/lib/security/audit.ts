import crypto from "crypto";
import { recordAuditLog } from "../db";
import { AuditLogRecord } from "../db/types";

const HASH_SALT = process.env.AUDIT_SALT || "uran26_audit_security_salt_2026";

export function hashClientIp(ip: string): string {
  return crypto
    .createHmac("sha256", HASH_SALT)
    .update(ip || "unknown")
    .digest("hex")
    .slice(0, 16);
}

export async function logSecurityEvent(
  action: AuditLogRecord["action"],
  ip: string,
  details: Record<string, any>,
  targetToken?: string
): Promise<void> {
  const actor = `IP-${hashClientIp(ip)}`;
  try {
    await recordAuditLog(action, actor, details, targetToken);
  } catch (err) {
    console.error("[AUDIT LOG FAILURE]:", err);
  }
}
