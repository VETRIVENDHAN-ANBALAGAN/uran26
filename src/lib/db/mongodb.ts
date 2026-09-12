import { MongoClient, Db, Collection } from "mongodb";
import { TeamRegistration, AuditLogRecord } from "./types";

export interface AdminUserRecord {
  username: string;
  passwordHash?: string; // or plain password comparison fallback
  role: string;
  name: string;
  createdAt: string;
}

export interface MongoConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  database: string;
  pingMs?: number;
  collections?: string[];
  error?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoIndexesEnsured: boolean | undefined;
}

export function getMongoUri(): string | undefined {
  return process.env.MONGODB_URI;
}

export function getMongoDbName(): string {
  if (process.env.MONGODB_DB && process.env.MONGODB_DB.trim()) {
    return process.env.MONGODB_DB.trim();
  }
  const uri = getMongoUri();
  if (uri) {
    try {
      const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^\/]+\/([^?]+)/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch {}
  }
  return "pmu";
}

export function isMongoConfigured(): boolean {
  const uri = getMongoUri();
  return Boolean(uri && uri.trim().startsWith("mongodb") && !uri.includes("<db_password>"));
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const uri = getMongoUri()!;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    global._mongoClientPromise = client.connect().catch((err) => {
      // Clear cached promise on failure so subsequent requests can retry
      global._mongoClientPromise = undefined;
      console.error("[MONGODB INITIAL CONNECT FAILED]:", err.message);
      throw err;
    });
  }

  try {
    return await global._mongoClientPromise;
  } catch (err) {
    console.error("[MONGODB CONNECTION ERROR]:", err);
    return null;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  const client = await getMongoClient();
  if (!client) return null;
  return client.db(getMongoDbName());
}

export async function checkMongoConnection(): Promise<MongoConnectionStatus> {
  const isConfigured = isMongoConfigured();
  const dbName = getMongoDbName();

  if (!isConfigured) {
    return {
      isConfigured: false,
      isConnected: false,
      database: dbName,
      error: "MONGODB_URI is not configured in .env.local or still contains <db_password>",
    };
  }

  try {
    const client = await getMongoClient();
    if (!client) {
      return {
        isConfigured: true,
        isConnected: false,
        database: dbName,
        error: "Failed to establish MongoClient connection",
      };
    }

    const startTime = Date.now();
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    const pingMs = Date.now() - startTime;

    const collections = (await db.listCollections().toArray()).map((c) => c.name);

    return {
      isConfigured: true,
      isConnected: true,
      database: dbName,
      pingMs,
      collections,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      database: dbName,
      error: err.message || "Failed to ping MongoDB Atlas",
    };
  }
}

export async function getTeamsCollection(): Promise<Collection<TeamRegistration> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  const col = db.collection<TeamRegistration>("teams");

  // Ensure indexes once per process lifetime
  if (!global._mongoIndexesEnsured) {
    global._mongoIndexesEnsured = true;
    col.createIndex({ registrationToken: 1 }, { unique: true }).catch(() => {});
    col.createIndex({ leaderEmail: 1 }).catch(() => {});
    col.createIndex({ teamNameNormalized: 1 }).catch(() => {});
    col.createIndex({ leaderPhone: 1 }).catch(() => {});
  }

  return col;
}

export async function getAuditLogsCollection(): Promise<Collection<AuditLogRecord> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<AuditLogRecord>("audit_logs");
}

export async function getAdminsCollection(): Promise<Collection<AdminUserRecord> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  return db.collection<AdminUserRecord>("admins");
}
