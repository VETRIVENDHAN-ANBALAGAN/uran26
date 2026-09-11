import { MongoClient, Db, Collection } from "mongodb";
import { TeamRegistration, AuditLogRecord } from "./types";

export interface AdminUserRecord {
  username: string;
  passwordHash?: string; // or plain password comparison fallback
  role: string;
  name: string;
  createdAt: string;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "uran26";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.trim().startsWith("mongodb"));
}

if (isMongoConfigured() && uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured() || !clientPromise) {
    return null;
  }
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err) {
    console.error("[MONGODB CONNECTION ERROR]:", err);
    return null;
  }
}

export async function getTeamsCollection(): Promise<Collection<TeamRegistration> | null> {
  const db = await getMongoDb();
  if (!db) return null;
  const col = db.collection<TeamRegistration>("teams");
  // Ensure indexes for fast unique queries
  try {
    await col.createIndex({ registrationToken: 1 }, { unique: true });
    await col.createIndex({ leaderEmail: 1 });
    await col.createIndex({ teamNameNormalized: 1 });
  } catch {
    // Index may already exist
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
