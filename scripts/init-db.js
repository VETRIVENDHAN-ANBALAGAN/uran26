// scripts/init-db.js
// Initialize MongoDB Atlas collections, indexes, and seed records for URAN’26

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  }
  return env;
}

async function initDatabase() {
  const env = loadEnv();
  const uri = process.env.MONGODB_URI || env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || env.MONGODB_DB || "pmu";

  console.log("\n=======================================================");
  console.log("⚡ URAN’26 — MONGODB ATLAS DATABASE INITIALIZER");
  console.log("=======================================================\n");

  if (!uri || uri.includes("<db_password>")) {
    console.error("❌ ERROR: MONGODB_URI is not configured in .env.local.");
    console.error("👉 Please replace '<db_password>' in .env.local with your actual MongoDB Atlas password.\n");
    process.exit(1);
  }

  console.log("📡 Connecting to MongoDB Atlas cluster...");
  console.log(`🎯 Database: "${dbName}"\n`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas cluster!\n");

    const db = client.db(dbName);

    // 1. Collections Setup
    const collectionsToEnsure = ["teams", "audit_logs", "admins"];
    const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

    for (const colName of collectionsToEnsure) {
      if (!existingCollections.includes(colName)) {
        await db.createCollection(colName);
        console.log(`📁 Created collection: "${colName}"`);
      } else {
        console.log(`✔ Collection already exists: "${colName}"`);
      }
    }

    // 2. Indexes Setup
    console.log("\n⚡ Creating database indexes...");
    const teamsCol = db.collection("teams");
    await teamsCol.createIndex({ registrationToken: 1 }, { unique: true });
    await teamsCol.createIndex({ leaderEmail: 1 });
    await teamsCol.createIndex({ teamNameNormalized: 1 });
    await teamsCol.createIndex({ leaderPhone: 1 });
    await teamsCol.createIndex({ createdAt: -1 });
    await teamsCol.createIndex({ checkInStatus: 1 });
    console.log("   ✔ Indexes ensured for 'teams' (unique registrationToken, leaderEmail, teamNameNormalized, etc.)");

    const auditCol = db.collection("audit_logs");
    await auditCol.createIndex({ timestamp: -1 });
    await auditCol.createIndex({ action: 1 });
    await auditCol.createIndex({ ipHash: 1 });
    console.log("   ✔ Indexes ensured for 'audit_logs' (timestamp, action, ipHash)");

    const adminCol = db.collection("admins");
    await adminCol.createIndex({ username: 1 }, { unique: true });
    console.log("   ✔ Indexes ensured for 'admins' (unique username)");

    // 3. Seed Existing Data from data/uran26_db.json if empty
    console.log("\n🌱 Checking data seeding...");
    const localDbPath = path.join(process.cwd(), "data", "uran26_db.json");
    let localData = null;

    if (fs.existsSync(localDbPath)) {
      try {
        localData = JSON.parse(fs.readFileSync(localDbPath, "utf-8"));
      } catch (err) {
        console.warn("⚠️  Could not read local data/uran26_db.json:", err.message);
      }
    }

    const teamCount = await teamsCol.countDocuments();
    if (teamCount === 0 && localData && Array.isArray(localData.teams) && localData.teams.length > 0) {
      console.log(`📦 Seeding ${localData.teams.length} existing teams from local file to MongoDB...`);
      await teamsCol.insertMany(localData.teams);
      console.log("   ✔ Teams seeded successfully!");
    } else {
      console.log(`   ✔ Teams collection currently has ${teamCount} records.`);
    }

    const auditCount = await auditCol.countDocuments();
    if (auditCount === 0 && localData && Array.isArray(localData.auditLogs) && localData.auditLogs.length > 0) {
      console.log(`📦 Seeding ${localData.auditLogs.length} audit logs from local file to MongoDB...`);
      await auditCol.insertMany(localData.auditLogs);
      console.log("   ✔ Audit logs seeded successfully!");
    } else {
      console.log(`   ✔ Audit logs collection currently has ${auditCount} records.`);
    }

    // 4. Seed Admin Account if not present
    const adminUsername = env.ADMIN_USERNAME || "admin";
    const existingAdmin = await adminCol.findOne({ username: adminUsername });
    if (!existingAdmin) {
      await adminCol.insertOne({
        username: adminUsername,
        name: "PMIST Hackathon Director",
        role: "ORGANIZER_SUPERADMIN",
        createdAt: new Date().toISOString(),
      });
      console.log(`   ✔ Admin user "${adminUsername}" initialized.`);
    } else {
      console.log(`   ✔ Admin user "${adminUsername}" is configured.`);
    }

    console.log("\n=======================================================");
    console.log("🎉 MongoDB Atlas database build & initialization complete!");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("\n❌ Database initialization failed:", err.message);
    console.error("\n💡 Please check:");
    console.error("   1. Password in .env.local is accurate.");
    console.error("   2. In MongoDB Atlas Network Access, IP 0.0.0.0/0 is whitelisted.");
    console.error("   3. Database user has read/write permissions for database '" + dbName + "'.\n");
    process.exit(1);
  } finally {
    await client.close();
  }
}

initDatabase();
