import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
readFileSync(envPath, "utf8")
  .split("\n")
  .forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });

const projectRef = "onwbzlclskcbvbnlicfm";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260620_about_redesign.sql"),
  "utf8"
);

async function run() {
  // Try Supabase Management API (requires management API token, not service role)
  // Fall back to REST RPC if available
  try {
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ query: sql }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      console.log("Migration applied via Management API.");
      return;
    }

    if (data?.message?.includes("Unauthorized") || res.status === 401) {
      console.log(
        "Management API requires a personal access token, not a service role key."
      );
    } else {
      console.log("Management API response:", JSON.stringify(data).slice(0, 200));
    }
  } catch (err) {
    console.log("Management API not reachable:", err.message?.slice(0, 100));
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ACTION REQUIRED: Apply migration manually in Supabase");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1. Go to https://supabase.com/dashboard/project/onwbzlclskcbvbnlicfm/sql");
  console.log("2. Paste and run the SQL from:");
  console.log("   supabase/migrations/20260620_about_redesign.sql");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

run();
