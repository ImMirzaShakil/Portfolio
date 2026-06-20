"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { NavItem } from "@/lib/types";
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
