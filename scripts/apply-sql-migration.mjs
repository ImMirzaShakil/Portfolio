import { readFileSync } from "fs";
import pg from "pg";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
readFileSync(envPath, "utf8")
  .split("\n")
  .forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20250616_portfolio_updates.sql"),
  "utf8"
);

const urls = [
  process.env.DATABASE_URL,
  `postgresql://postgres.onwbzlclskcbvbnlicfm:${key}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres:${key}@db.onwbzlclskcbvbnlicfm.supabase.co:5432/postgres`,
].filter(Boolean);

async function run() {
  for (const connectionString of urls) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log("Connected. Running migration...");
      await client.query(sql);
      await client.end();
      console.log("Migration applied successfully.");
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`Connection failed: ${message.slice(0, 120)}`);
      try {
        await client.end();
      } catch {
        // ignore
      }
    }
  }

  console.error(
    "\nCould not connect to Postgres. Add DATABASE_URL to .env.local from Supabase → Project Settings → Database, then rerun:\n  node scripts/apply-sql-migration.mjs"
  );
  process.exit(1);
}

run();
