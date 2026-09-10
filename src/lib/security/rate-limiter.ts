interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

const CONFIGS: Record<"REGISTRATION" | "LOOKUP" | "ADMIN", RateLimitConfig> = {
  REGISTRATION: {
    limit: 6, // max 6 registrations
    windowSeconds: 15 * 60, // per 15 minutes
  },
  LOOKUP: {
    limit: 30, // max 30 lookup queries
    windowSeconds: 60, // per 1 minute
  },
  ADMIN: {
    limit: 150, // max 150 admin actions
    windowSeconds: 60, // per 1 minute
  },
};

// In-memory sliding window bucket
const bucket = new Map<string, RateLimitEntry>();

// Client IP resolver with proxy header inspection
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "127.0.0.1";
}

// Garbage collector to keep memory compact
let lastPrune = Date.now();
function pruneExpiredEntries() {
  const now = Date.now();
  if (now - lastPrune < 60 * 1000) return; // Prune at most once per minute
  lastPrune = now;

  const maxWindow = 15 * 60 * 1000;
  for (const [key, entry] of bucket.entries()) {
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < maxWindow);
    if (entry.timestamps.length === 0) {
      bucket.delete(key);
    }
  }
}

export interface RateLimitResult {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  ip: string;
  headers: Record<string, string>;
}

export function checkRateLimit(
  req: Request,
  tier: "REGISTRATION" | "LOOKUP" | "ADMIN"
): RateLimitResult {
  pruneExpiredEntries();

  const ip = getClientIp(req);
  const now = Date.now();
  const config = CONFIGS[tier];
  const windowMs = config.windowSeconds * 1000;
  const key = `${tier}:${ip}`;

  let entry = bucket.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    bucket.set(key, entry);
  }

  // Filter out timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  const isAllowed = entry.timestamps.length < config.limit;
  const remaining = Math.max(0, config.limit - entry.timestamps.length - (isAllowed ? 1 : 0));

  let oldestTimestamp = entry.timestamps[0] || now;
  const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

  if (isAllowed) {
    entry.timestamps.push(now);
  }

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(config.limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetSeconds),
  };

  if (!isAllowed) {
    headers["Retry-After"] = String(resetSeconds);
  }

  return {
    isAllowed,
    limit: config.limit,
    remaining,
    resetSeconds,
    ip,
    headers,
  };
}
