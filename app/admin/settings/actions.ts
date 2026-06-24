"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { NavItem, CustomScript } from "@/lib/types";
import { revalidatePath } from "next/cache";

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
  google_analytics_snippet: string;
  meta_pixel_snippet: string;
  hotjar_snippet: string;
  custom_scripts: CustomScript[];
  greeting_text: string;
  fun_facts: string[];
}

export async function saveSiteSettingsAction(
  payload: SiteSettingsPayload
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save settings." };
  }

  const admin = createAdminClient();

  if (payload.settings_id) {
    const { error } = await admin
      .from("site_settings")
      .update({
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
        google_analytics_snippet:
          payload.google_analytics_snippet.trim() || null,
        meta_pixel_snippet: payload.meta_pixel_snippet.trim() || null,
        hotjar_snippet: payload.hotjar_snippet.trim() || null,
        custom_scripts: payload.custom_scripts
          .filter((script) => script.code.trim())
          .map((script) => ({
            id: script.id,
            label: script.label.trim() || "Custom script",
            code: script.code.trim(),
          })),
        nav_items: payload.nav_items.map((item, index) => ({
          ...item,
          order_index: index,
        })),
      })
      .eq("id", payload.settings_id);

    if (error) return { error: error.message };
  }

  // Save greeting_text and fun_facts back to about_content
  const aboutUpdate = {
    greeting_text: payload.greeting_text.trim() || null,
    fun_facts: payload.fun_facts.map((f) => f.trim()).filter(Boolean),
    updated_at: new Date().toISOString(),
  };

  if (payload.about_id) {
    const { error } = await admin
      .from("about_content")
      .update(aboutUpdate)
      .eq("id", payload.about_id);
    if (error) return { error: error.message };
  } else {
    // No about row yet — upsert a new one
    const { error } = await admin.from("about_content").upsert(aboutUpdate);
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/admin/settings");

  return { error: null };
}
