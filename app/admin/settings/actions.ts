"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { NavItem, CustomScript } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type SettingsSectionId =
  | "identity"
  | "hero-heading"
  | "homepage-copy"
  | "navigation"
  | "grain"
  | "analytics"
  | "footer";

export interface SiteSettingsPayload {
  settings_id?: string;
  about_id?: string;
  site_title: string;
  profile_image_url: string | null;
  logo_url: string | null;
  logo_url_dark: string | null;
  hero_heading: string;
  nav_items: NavItem[];
  footer_tagline: string;
  grain_opacity: number;
  google_site_verification: string;
  google_analytics_snippet: string;
  meta_pixel_snippet: string;
  hotjar_snippet: string;
  custom_scripts: CustomScript[];
  greeting_text: string;
  home_intro_text: string;
  fun_facts: string[];
}

function revalidateSettingsPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
}

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to save settings.");
  }
}

function normalizeCustomScripts(scripts: CustomScript[]) {
  return scripts
    .filter((script) => script.code.trim())
    .map((script) => ({
      id: script.id,
      label: script.label.trim() || "Custom script",
      code: script.code.trim(),
    }));
}

function normalizeNavItems(items: NavItem[]) {
  return items.map((item, index) => ({
    ...item,
    order_index: index,
  }));
}

function homeIntroColumnError(message: string) {
  if (!message.includes("home_intro_text")) return null;
  return "Database is missing home_intro_text. Run supabase/migrations/20260803_home_intro_text.sql in the Supabase SQL editor, then try again.";
}

async function ensureSettingsId(
  admin: ReturnType<typeof createAdminClient>,
  id?: string
): Promise<string> {
  if (id) return id;

  const { data: existing } = await admin
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: inserted, error } = await admin
    .from("site_settings")
    .insert({ site_title: "Mirza Md Shakil" })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    throw new Error(error?.message ?? "Could not create site settings row.");
  }

  return inserted.id;
}

async function ensureAboutId(
  admin: ReturnType<typeof createAdminClient>,
  id?: string
): Promise<string> {
  if (id) return id;

  const { data: existing } = await admin
    .from("about_content")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: inserted, error } = await admin
    .from("about_content")
    .insert({ updated_at: new Date().toISOString() })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    throw new Error(error?.message ?? "Could not create about content row.");
  }

  return inserted.id;
}

async function updateSiteSettings(
  admin: ReturnType<typeof createAdminClient>,
  settingsId: string,
  fields: Record<string, unknown>
) {
  const { error } = await admin
    .from("site_settings")
    .update(fields)
    .eq("id", settingsId);

  if (error) throw new Error(error.message);
}

async function updateAboutHomepageCopy(
  admin: ReturnType<typeof createAdminClient>,
  aboutId: string,
  payload: Pick<
    SiteSettingsPayload,
    "greeting_text" | "home_intro_text" | "fun_facts"
  >
) {
  const { error } = await admin
    .from("about_content")
    .update({
      greeting_text: payload.greeting_text.trim() || null,
      home_intro_text: payload.home_intro_text.trim() || null,
      fun_facts: payload.fun_facts.map((f) => f.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    })
    .eq("id", aboutId);

  if (error) {
    throw new Error(homeIntroColumnError(error.message) ?? error.message);
  }
}

export async function saveSiteSettingsSectionAction(
  section: SettingsSectionId,
  payload: SiteSettingsPayload
): Promise<{ error: string | null; settingsId?: string; aboutId?: string }> {
  try {
    await requireAdminUser();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const admin = createAdminClient();

  try {
    let settingsId: string | undefined;
    let aboutId: string | undefined;

    switch (section) {
      case "identity": {
        settingsId = await ensureSettingsId(admin, payload.settings_id);
        await updateSiteSettings(admin, settingsId, {
          site_title: payload.site_title.trim() || "Mirza Md Shakil",
          profile_image_url: payload.profile_image_url,
          logo_url: payload.logo_url,
          logo_url_dark: payload.logo_url_dark,
        });
        break;
      }
      case "hero-heading": {
        settingsId = await ensureSettingsId(admin, payload.settings_id);
        await updateSiteSettings(admin, settingsId, {
          hero_heading: payload.hero_heading.trim() || null,
        });
        break;
      }
      case "homepage-copy": {
        aboutId = await ensureAboutId(admin, payload.about_id);
        await updateAboutHomepageCopy(admin, aboutId, payload);
        break;
      }
      case "navigation": {
        settingsId = await ensureSettingsId(admin, payload.settings_id);
        await updateSiteSettings(admin, settingsId, {
          nav_items: normalizeNavItems(payload.nav_items),
        });
        break;
      }
      case "grain": {
        settingsId = await ensureSettingsId(admin, payload.settings_id);
        await updateSiteSettings(admin, settingsId, {
          grain_opacity: Math.min(
            100,
            Math.max(0, Math.round(payload.grain_opacity))
          ),
        });
        break;
      }
      case "analytics": {
        settingsId = await ensureSettingsId(admin, payload.settings_id);
        await updateSiteSettings(admin, settingsId, {
          google_site_verification:
            payload.google_site_verification.trim() || null,
          google_analytics_snippet:
            payload.google_analytics_snippet.trim() || null,
          meta_pixel_snippet: payload.meta_pixel_snippet.trim() || null,
          hotjar_snippet: payload.hotjar_snippet.trim() || null,
          custom_scripts: normalizeCustomScripts(payload.custom_scripts),
        });
        break;
      }
      case "footer": {
        settingsId = await ensureSettingsId(admin, payload.settings_id);
        await updateSiteSettings(admin, settingsId, {
          footer_tagline: payload.footer_tagline.trim() || null,
        });
        break;
      }
      default:
        return { error: "Unknown section." };
    }

    revalidateSettingsPaths();
    return { error: null, settingsId, aboutId };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save section.",
    };
  }
}

export async function saveSiteSettingsAction(
  payload: SiteSettingsPayload
): Promise<{ error: string | null; settingsId?: string; aboutId?: string }> {
  try {
    await requireAdminUser();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const admin = createAdminClient();

  try {
    const settingsId = await ensureSettingsId(admin, payload.settings_id);
    const aboutId = await ensureAboutId(admin, payload.about_id);

    await updateSiteSettings(admin, settingsId, {
      site_title: payload.site_title.trim() || "Mirza Md Shakil",
      profile_image_url: payload.profile_image_url,
      logo_url: payload.logo_url,
      logo_url_dark: payload.logo_url_dark,
      hero_heading: payload.hero_heading.trim() || null,
      footer_tagline: payload.footer_tagline.trim() || null,
      grain_opacity: Math.min(
        100,
        Math.max(0, Math.round(payload.grain_opacity))
      ),
      google_site_verification:
        payload.google_site_verification.trim() || null,
      google_analytics_snippet:
        payload.google_analytics_snippet.trim() || null,
      meta_pixel_snippet: payload.meta_pixel_snippet.trim() || null,
      hotjar_snippet: payload.hotjar_snippet.trim() || null,
      custom_scripts: normalizeCustomScripts(payload.custom_scripts),
      nav_items: normalizeNavItems(payload.nav_items),
    });

    await updateAboutHomepageCopy(admin, aboutId, payload);

    revalidateSettingsPaths();
    return { error: null, settingsId, aboutId };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to save settings.",
    };
  }
}
