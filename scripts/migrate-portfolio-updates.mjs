import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
readFileSync(envPath, "utf8")
  .split("\n")
  .forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const defaultNavItems = [
  { id: "work", label: "Work", href: "/work", is_visible: true, order_index: 0 },
  { id: "about", label: "About", href: "/about", is_visible: true, order_index: 1 },
];

async function migrate() {
  console.log("Checking portfolio schema...\n");

  const { error: featuredCheckError } = await supabase
    .from("projects")
    .select("is_featured")
    .limit(1);

  if (featuredCheckError) {
    console.error("Missing database columns.");
    console.error("Run this SQL in Supabase → SQL Editor:");
    console.error("  supabase/migrations/20250616_portfolio_updates.sql\n");
    console.error(featuredCheckError.message);
    process.exit(1);
  }

  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("id, nav_items")
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    console.error(settingsError.message);
    process.exit(1);
  }

  if (
    settings &&
    (!settings.nav_items ||
      (Array.isArray(settings.nav_items) && settings.nav_items.length === 0))
  ) {
    const { error } = await supabase
      .from("site_settings")
      .update({ nav_items: defaultNavItems })
      .eq("id", settings.id);

    if (error) {
      console.error("Failed to seed nav_items:", error.message);
      process.exit(1);
    }

    console.log("✓ Default nav items set");
  }

  const { error: featuredUpdateError } = await supabase
    .from("projects")
    .update({ is_featured: true })
    .eq("is_published", true)
    .eq("is_featured", false);

  if (featuredUpdateError) {
    console.error(featuredUpdateError.message);
    process.exit(1);
  }

  console.log("✓ Published projects marked as featured");
  console.log("✓ Migration complete");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
