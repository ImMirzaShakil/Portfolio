"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { NavItem } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface AboutFormPayload {
  id?: string;
  profile_image_url: string | null;
  intro_text: string;
  greeting_text: string;
  fun_facts: string[];
  currently_role: string;
  currently_company: string;
  previously_companies: string;
  show_currently: boolean;
  show_previously: boolean;
  currently_label: string;
  previously_label: string;
  visible_social_links: string[];
  superpower_1: string;
  superpower_2: string;
  superpower_3: string;
  twitter_url: string;
  linkedin_url: string;
  github_url: string;
  email: string;
  footer_tagline: string;
  site_title: string;
  logo_url: string | null;
  hero_heading: string;
  nav_items: NavItem[];
  settings_id?: string;
}

export async function saveAboutAction(
  payload: AboutFormPayload
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save about content." };
  }

  const admin = createAdminClient();

  const aboutPayload = {
    ...(payload.id ? { id: payload.id } : {}),
    profile_image_url: payload.profile_image_url,
    intro_text: payload.intro_text.trim() || null,
    greeting_text: payload.greeting_text.trim() || null,
    fun_facts: payload.fun_facts.map((fact) => fact.trim()).filter(Boolean),
    currently_role: payload.currently_role.trim() || null,
    currently_company: payload.currently_company.trim() || null,
    previously_companies: payload.previously_companies.trim() || null,
    show_currently: payload.show_currently,
    show_previously: payload.show_previously,
    currently_label: payload.currently_label.trim() || "Currently",
    previously_label: payload.previously_label.trim() || "Previously at",
    visible_social_links: payload.visible_social_links,
    superpower_1: payload.superpower_1.trim() || null,
    superpower_2: payload.superpower_2.trim() || null,
    superpower_3: payload.superpower_3.trim() || null,
    twitter_url: payload.twitter_url.trim() || null,
    linkedin_url: payload.linkedin_url.trim() || null,
    github_url: payload.github_url.trim() || null,
    email: payload.email.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error: aboutError } = await admin
    .from("about_content")
    .upsert(aboutPayload);

  if (aboutError) {
    return { error: aboutError.message };
  }

  if (payload.settings_id) {
    const { error: settingsError } = await admin
      .from("site_settings")
      .update({
        site_title: payload.site_title.trim() || "Mirza Md Shakil",
        logo_url: payload.logo_url,
        hero_heading: payload.hero_heading.trim() || null,
        footer_tagline: payload.footer_tagline.trim() || null,
        nav_items: payload.nav_items.map((item, index) => ({
          ...item,
          order_index: index,
        })),
      })
      .eq("id", payload.settings_id);

    if (settingsError) {
      return { error: settingsError.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { error: null };
}
