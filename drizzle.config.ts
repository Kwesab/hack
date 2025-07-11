import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npt_et9px1jafc1bg@ep-green-block-a04142t3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
