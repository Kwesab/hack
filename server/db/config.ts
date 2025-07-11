import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Database connection configuration
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npt_et9px1jafc1bg@ep-green-block-a04142t3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test database connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Export pool for direct queries if needed
export { pool };
