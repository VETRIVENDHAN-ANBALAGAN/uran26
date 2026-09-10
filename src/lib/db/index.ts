import fs from "fs";
import path from "path";
import crypto from "crypto";
import { 
  TeamRegistration, 
  AuditLogRecord, 
  DatabaseSchema, 
  AdminStats, 
  PaymentMode,
  PaymentReceipt
} from "./types";

const IS_VERCEL = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
// On Vercel, only /tmp is writable; locally, use persistent data directory
const DATA_DIR = IS_VERCEL ? path.join("/tmp", "uran26_data") : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "uran26_db.json");
const SEED_FILE = path.join(process.cwd(), "data", "uran26_db.json");

// Optional Cloud KV (Upstash Redis / Vercel KV REST) for global cross-region persistence
const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Simple async lock mechanism to serialize concurrent write operations
class AsyncLock {
  private promise: Promise<void> = Promise.resolve();

  async acquire<T>(fn: () => Promise<T> | T): Promise<T> {
    const next = this.promise.then(fn, fn);
    this.promise = next.then(() => {}, () => {});
    return next;
  }
}

const dbLock = new AsyncLock();

// Memory Cache & Indexes for ultra-fast O(1) reads
let isInitialized = false;
let teamsCache: TeamRegistration[] = [];
let auditLogsCache: AuditLogRecord[] = [];

const tokenIndex = new Map<string, TeamRegistration>();
const emailIndex = new Map<string, string>(); // normalizedEmail -> token
const teamNameIndex = new Map<string, string>(); // normalizedTeamName -> token
const phoneIndex = new Map<string, string>(); // normalizedPhone -> token

function normalizeString(str: string): string {
  return (str || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhone(phone: string): string {
  return (phone || "").replace(/\D/g, "").slice(-10);
}

function rebuildIndexes() {
  tokenIndex.clear();
  emailIndex.clear();
  teamNameIndex.clear();
  phoneIndex.clear();

  for (const team of teamsCache) {
    tokenIndex.set(team.registrationToken.toUpperCase(), team);
    if (team.leaderEmail) {
      emailIndex.set(normalizeString(team.leaderEmail), team.registrationToken);
    }
    if (team.teamName) {
      teamNameIndex.set(normalizeString(team.teamName), team.registrationToken);
    }
    if (team.leaderPhone) {
      phoneIndex.set(normalizePhone(team.leaderPhone), team.registrationToken);
    }
  }
}

function ensureDbFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      // If deployed on Vercel and a seed file is available in the repository root, copy it over
      if (IS_VERCEL && fs.existsSync(SEED_FILE)) {
        try {
          const seedContent = fs.readFileSync(SEED_FILE, "utf-8");
          fs.writeFileSync(DB_FILE, seedContent, "utf-8");
          return;
        } catch (copyErr) {
          console.warn("[DB SEED NOTICE] Could not copy seed from root, creating fresh DB:", copyErr);
        }
      }

      const initialSchema: DatabaseSchema = {
        version: 1,
        lastUpdated: new Date().toISOString(),
        teams: [],
        auditLogs: [
          {
            id: `AUDIT-INIT-${Date.now()}`,
            action: "PRE_REGISTRATION_CREATED",
            actor: "SYSTEM",
            timestamp: new Date().toISOString(),
            details: { message: "URAN’26 database initialized (Cloud / Vercel ready)." },
          },
        ],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[DB ERROR] Error ensuring db file:", err);
  }
}

function loadDatabase(): void {
  ensureDbFile();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data: DatabaseSchema = JSON.parse(raw);
      teamsCache = data.teams || [];
      auditLogsCache = data.auditLogs || [];
      rebuildIndexes();
      isInitialized = true;
    }
  } catch (err) {
    console.error("[DB ERROR] Failed to load database, recovering from memory:", err);
    if (!isInitialized) {
      teamsCache = [];
      auditLogsCache = [];
      isInitialized = true;
    }
  }
}

// Atomic file writer: Writes to temp file then atomically renames to avoid partial corruptions
function persistDatabaseSync(): void {
  ensureDbFile();
  const tempFile = `${DB_FILE}.tmp.${process.pid}.${Date.now()}`;
  const schema: DatabaseSchema = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    teams: teamsCache,
    auditLogs: auditLogsCache,
  };

  try {
    fs.writeFileSync(tempFile, JSON.stringify(schema, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch {}
    }
    console.error("[DB ERROR] Failed atomic write to database:", err);
  }

  // Cloud KV background sync if configured
  if (KV_URL && KV_TOKEN) {
    fetch(`${KV_URL}/set/uran26_schema`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schema),
    }).catch((kvErr) => console.warn("[KV SYNC WARNING]:", kvErr));
  }
}

function initIfRequired() {
  if (!isInitialized) {
    loadDatabase();
  }
}

// ---------------------- PUBLIC API METHODS ---------------------- //

export async function getTeamByToken(token: string): Promise<TeamRegistration | null> {
  initIfRequired();
  const clean = (token || "").trim().toUpperCase();
  return tokenIndex.get(clean) || null;
}

export async function getTeamByEmail(email: string): Promise<TeamRegistration | null> {
  initIfRequired();
  const normalized = normalizeString(email);
  const token = emailIndex.get(normalized);
  if (!token) return null;
  return tokenIndex.get(token) || null;
}

export async function getTeamByPhone(phone: string): Promise<TeamRegistration | null> {
  initIfRequired();
  const normalized = normalizePhone(phone);
  const token = phoneIndex.get(normalized);
  if (!token) return null;
  return tokenIndex.get(token) || null;
}

export async function checkDuplicate(email: string, teamName: string): Promise<{ isDuplicate: boolean; reason?: string }> {
  initIfRequired();
  const normEmail = normalizeString(email);
  const normTeam = normalizeString(teamName);

  if (emailIndex.has(normEmail)) {
    return { isDuplicate: true, reason: `A team with leader email "${email}" is already registered.` };
  }
  if (teamNameIndex.has(normTeam)) {
    return { isDuplicate: true, reason: `The team name "${teamName}" is already taken.` };
  }
  return { isDuplicate: false };
}

export async function createTeamRegistration(
  data: Omit<
    TeamRegistration,
    "id" | "registrationToken" | "teamNameNormalized" | "createdAt" | "updatedAt" | "paymentStatus" | "checkInStatus" | "ratePerPerson" | "totalPayableOnSpot"
  >
): Promise<TeamRegistration> {
  return dbLock.acquire(async () => {
    initIfRequired();

    const dupCheck = await checkDuplicate(data.leaderEmail, data.teamName);
    if (dupCheck.isDuplicate) {
      throw new Error(dupCheck.reason || "Duplicate registration detected.");
    }

    const id = `reg_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
    const token = `URAN26-TEAM-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const parsedSize = Math.min(Math.max(Number(data.teamSize) || 4, 3), 5);
    const ratePerPerson = 250;
    const totalPayableOnSpot = parsedSize * ratePerPerson;

    const newRecord: TeamRegistration = {
      ...data,
      id,
      registrationToken: token,
      teamNameNormalized: normalizeString(data.teamName),
      teamSize: parsedSize,
      ratePerPerson,
      totalPayableOnSpot,
      paymentStatus: "PENDING_ON_SPOT",
      checkInStatus: "NOT_CHECKED_IN",
      createdAt: now,
      updatedAt: now,
    };

    teamsCache.unshift(newRecord);
    rebuildIndexes();

    // Audit log
    auditLogsCache.unshift({
      id: `AUDIT-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      action: "PRE_REGISTRATION_CREATED",
      actor: data.ipHash || "CLIENT_WEB",
      targetToken: token,
      timestamp: now,
      details: {
        teamName: data.teamName,
        leaderName: data.leaderName,
        teamSize: parsedSize,
        college: data.college,
        track: data.preferredTrack,
        totalPayableOnSpot,
      },
    });

    persistDatabaseSync();
    return newRecord;
  });
}

export async function checkInAndCollectPayment(
  token: string,
  paymentData: {
    amountPaid: number;
    paymentMode: PaymentMode;
    collectedBy: string;
    notes?: string;
  }
): Promise<TeamRegistration> {
  return dbLock.acquire(async () => {
    initIfRequired();
    const cleanToken = (token || "").trim().toUpperCase();
    const team = tokenIndex.get(cleanToken);

    if (!team) {
      throw new Error(`Team with code "${token}" was not found.`);
    }

    if (team.checkInStatus === "CHECKED_IN") {
      throw new Error(`Team "${team.teamName}" (${token}) has already completed on-spot check-in.`);
    }

    const now = new Date().toISOString();
    const receiptNo = `PMIST-REC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

    const receipt: PaymentReceipt = {
      receiptNo,
      amountPaid: paymentData.amountPaid,
      paymentMode: paymentData.paymentMode,
      collectedBy: paymentData.collectedBy || "PMIST Check-in Desk Staff",
      paidAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }),
      notes: paymentData.notes,
    };

    team.paymentStatus = "PAID_ON_SPOT";
    team.checkInStatus = "CHECKED_IN";
    team.paymentReceipt = receipt;
    team.updatedAt = now;

    auditLogsCache.unshift({
      id: `AUDIT-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      action: "CHECKIN_VERIFIED",
      actor: paymentData.collectedBy,
      targetToken: cleanToken,
      timestamp: now,
      details: {
        amountPaid: paymentData.amountPaid,
        mode: paymentData.paymentMode,
        receiptNo,
        teamName: team.teamName,
        membersCount: team.teamSize,
      },
    });

    persistDatabaseSync();
    return team;
  });
}

export async function updateTeamRegistration(
  token: string,
  updates: Partial<Pick<TeamRegistration, "teamName" | "leaderName" | "leaderPhone" | "college" | "preferredTrack" | "accommodationRequested" | "members">>
): Promise<TeamRegistration> {
  return dbLock.acquire(async () => {
    initIfRequired();
    const cleanToken = (token || "").trim().toUpperCase();
    const team = tokenIndex.get(cleanToken);

    if (!team) {
      throw new Error(`Team with token "${token}" was not found.`);
    }

    if (updates.teamName && normalizeString(updates.teamName) !== team.teamNameNormalized) {
      const dup = teamNameIndex.get(normalizeString(updates.teamName));
      if (dup && dup !== cleanToken) {
        throw new Error(`The team name "${updates.teamName}" is already taken by another team.`);
      }
      team.teamName = updates.teamName;
      team.teamNameNormalized = normalizeString(updates.teamName);
    }

    if (updates.leaderName) team.leaderName = updates.leaderName;
    if (updates.leaderPhone) team.leaderPhone = updates.leaderPhone;
    if (updates.college) team.college = updates.college;
    if (updates.preferredTrack) team.preferredTrack = updates.preferredTrack;
    if (typeof updates.accommodationRequested === "boolean") team.accommodationRequested = updates.accommodationRequested;
    if (Array.isArray(updates.members)) team.members = updates.members;

    team.updatedAt = new Date().toISOString();
    rebuildIndexes();

    auditLogsCache.unshift({
      id: `AUDIT-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      action: "TEAM_UPDATED",
      actor: "ORGANIZER_ADMIN",
      targetToken: cleanToken,
      timestamp: team.updatedAt,
      details: { updates },
    });

    persistDatabaseSync();
    return team;
  });
}

export async function disqualifyTeam(token: string, reason: string, adminUser: string): Promise<TeamRegistration> {
  return dbLock.acquire(async () => {
    initIfRequired();
    const cleanToken = (token || "").trim().toUpperCase();
    const team = tokenIndex.get(cleanToken);

    if (!team) {
      throw new Error(`Team with token "${token}" was not found.`);
    }

    team.checkInStatus = "DISQUALIFIED";
    team.updatedAt = new Date().toISOString();

    auditLogsCache.unshift({
      id: `AUDIT-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
      action: "TEAM_DISQUALIFIED",
      actor: adminUser || "ORGANIZER_ADMIN",
      targetToken: cleanToken,
      timestamp: team.updatedAt,
      details: { reason },
    });

    persistDatabaseSync();
    return team;
  });
}

export async function getAllRegistrations(filters?: {
  track?: string;
  checkInStatus?: string;
  paymentStatus?: string;
  search?: string;
}): Promise<TeamRegistration[]> {
  initIfRequired();
  let list = [...teamsCache];

  if (!filters) return list;

  if (filters.track && filters.track !== "ALL") {
    list = list.filter((t) => t.preferredTrack.includes(filters.track!));
  }

  if (filters.checkInStatus && filters.checkInStatus !== "ALL") {
    list = list.filter((t) => t.checkInStatus === filters.checkInStatus);
  }

  if (filters.paymentStatus && filters.paymentStatus !== "ALL") {
    list = list.filter((t) => t.paymentStatus === filters.paymentStatus);
  }

  if (filters.search) {
    const q = normalizeString(filters.search);
    list = list.filter(
      (t) =>
        normalizeString(t.teamName).includes(q) ||
        normalizeString(t.leaderName).includes(q) ||
        normalizeString(t.leaderEmail).includes(q) ||
        normalizePhone(t.leaderPhone).includes(q) ||
        t.registrationToken.toLowerCase().includes(q) ||
        normalizeString(t.college).includes(q)
    );
  }

  return list;
}

export async function getAdminStats(): Promise<AdminStats> {
  initIfRequired();

  const totalTeams = teamsCache.length;
  let totalParticipants = 0;
  let checkedInTeams = 0;
  let checkedInParticipants = 0;
  let totalRevenueCollected = 0;
  let totalRevenueProjected = 0;
  let accommodationRequestsCount = 0;
  const trackDistribution: Record<string, number> = {
    "EdTech & Inclusive Innovation": 0,
    "AgriTech & Rural Innovation": 0,
    "FinTech & Digital Economy": 0,
    "CyberTech & Digital Trust": 0,
    "HealthTech & Well-being": 0,
  };

  for (const team of teamsCache) {
    const size = team.teamSize || 4;
    totalParticipants += size;
    totalRevenueProjected += team.totalPayableOnSpot || (size * 250);

    if (team.checkInStatus === "CHECKED_IN") {
      checkedInTeams += 1;
      checkedInParticipants += size;
      totalRevenueCollected += team.paymentReceipt?.amountPaid || (size * 250);
    }

    if (team.accommodationRequested) {
      accommodationRequestsCount += 1;
    }

    for (const trackKey of Object.keys(trackDistribution)) {
      if (team.preferredTrack && team.preferredTrack.includes(trackKey)) {
        trackDistribution[trackKey] += 1;
      }
    }
  }

  const lastReg = teamsCache.length > 0 ? teamsCache[0].createdAt : null;

  return {
    totalTeams,
    totalParticipants,
    checkedInTeams,
    checkedInParticipants,
    pendingCheckIns: totalTeams - checkedInTeams,
    totalRevenueCollected,
    totalRevenueProjected,
    accommodationRequestsCount,
    trackDistribution,
    lastRegistrationAt: lastReg,
  };
}

export async function recordAuditLog(
  action: AuditLogRecord["action"],
  actor: string,
  details: Record<string, any>,
  targetToken?: string
): Promise<void> {
  initIfRequired();
  auditLogsCache.unshift({
    id: `AUDIT-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
    action,
    actor,
    targetToken,
    timestamp: new Date().toISOString(),
    details,
  });

  // Keep last 1000 logs in memory/disk to prevent unlimited growth
  if (auditLogsCache.length > 1000) {
    auditLogsCache = auditLogsCache.slice(0, 1000);
  }

  persistDatabaseSync();
}

export async function getAuditLogs(limit = 100): Promise<AuditLogRecord[]> {
  initIfRequired();
  return auditLogsCache.slice(0, limit);
}
