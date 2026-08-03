import { readFileSync } from "fs";
import { resolve } from "path";

const sqlPath = resolve(
  process.cwd(),
  "supabase/migrations/20260803_home_video_featured_project_summary.sql"
);
const sql = readFileSync(sqlPath, "utf8");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("ACTION REQUIRED: Apply migration in Supabase SQL Editor");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(
  "1. Open https://supabase.com/dashboard/project/_/sql (your project)"
);
console.log("2. Paste and run:\n");
console.log(sql);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
