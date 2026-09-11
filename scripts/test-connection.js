// scripts/test-connection.js
// Test your MongoDB connection and view collections directly

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// Simple .env.local parser without needing external packages
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

async function testConnection() {
  const env = loadEnv();
  const uri = process.env.MONGODB_URI || env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || env.MONGODB_DB || "pmu";

  console.log("\n=======================================================");
  console.log("🚀 URAN’26 — STANDALONE MONGODB CONNECTION TEST");
  console.log("=======================================================\n");

  if (!uri || uri.includes("<db_password>")) {
    console.log("⚠️  MONGODB_URI is not set or still contains '<db_password>'.");
    console.log("👉 Please open .env.local and replace <db_password> with your actual MongoDB password.\n");
    process.exit(1);
  }

  console.log("📡 Target Database:", dbName);
  console.log("🔄 Connecting to MongoDB Atlas cluster...");

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!\n");

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log("📦 Collections found in '" + dbName + "':");
    if (collections.length === 0) {
      console.log("   (No collections yet — they will be automatically created on first registration!)");
    } else {
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log("   • " + col.name + " (" + count + " documents)");
      }
    }

    console.log("\n🎉 Your backend is 100% connected and ready for production registrations!\n");
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED:", error.message);
    console.log("\n💡 Common troubleshooting tips:");
    console.log("   1. Check your password in .env.local.");
    console.log("   2. In MongoDB Atlas -> Network Access, make sure '0.0.0.0/0' is added to allow access from anywhere.");
    console.log("   3. Check user permissions under Database Access in MongoDB Atlas.\n");
  } finally {
    await client.close();
  }
}

testConnection();
