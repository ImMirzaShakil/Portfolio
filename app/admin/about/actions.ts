"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { FeaturedIn } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface AboutFormPayload {
  id?: string;
  profile_image_url: string | null;
  gallery_images: string[];
  pronunciation: string;
  intro_text: string;
  greeting_text: string;
  fun_facts: string[];
  day_job_description: string;
  currently_role: string;
  currently_company: string;
  out_of_office_text: string;
  previously_companies: string;
  internships_description: string;
  show_currently: boolean;
  show_previously: boolean;
  currently_label: string;
  previously_label: string;
  visible_social_links: string[];
  superpower_1: string;
  superpower_1_desc: string;
  superpower_2: string;
  superpower_2_desc: string;
  superpower_3: string;
  superpower_3_desc: string;
  superpower_4: string;
  superpower_4_desc: string;
  twitter_url: string;
  linkedin_url: string;
  github_url: string;
  email: string;
  featured_in: FeaturedIn[];
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
    gallery_images: payload.gallery_images,
    pronunciation: payload.pronunciation.trim() || null,
    intro_text: payload.intro_text.trim() || null,
    greeting_text: payload.greeting_text.trim() || null,
    fun_facts: payload.fun_facts.map((f) => f.trim()).filter(Boolean),
    day_job_description: payload.day_job_description.trim() || null,
    currently_role: payload.currently_role.trim() || null,
    currently_company: payload.currently_company.trim() || null,
    out_of_office_text: payload.out_of_office_text.trim() || null,
    previously_companies: payload.previously_companies.trim() || null,
    internships_description: payload.internships_description.trim() || null,
    show_currently: payload.show_currently,
    show_previously: payload.show_previously,
    currently_label: payload.currently_label.trim() || "Currently",
    previously_label: payload.previously_label.trim() || "Previously at",
    visible_social_links: payload.visible_social_links,
    superpower_1: payload.superpower_1.trim() || null,
    superpower_1_desc: payload.superpower_1_desc.trim() || null,
    superpower_2: payload.superpower_2.trim() || null,
    superpower_2_desc: payload.superpower_2_desc.trim() || null,
    superpower_3: payload.superpower_3.trim() || null,
    superpower_3_desc: payload.superpower_3_desc.trim() || null,
    superpower_4: payload.superpower_4.trim() || null,
    superpower_4_desc: payload.superpower_4_desc.trim() || null,
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

  // Sync featured_in: delete all then re-insert in order
  const { error: deleteError } = await admin
    .from("featured_in")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all rows

  if (deleteError) {
    return { error: deleteError.message };
  }

  if (payload.featured_in.length > 0) {
    const rows = payload.featured_in
      .filter((item) => item.title.trim() && item.year.trim())
      .map((item, index) => ({
        id: item.id,
        year: item.year.trim(),
        title: item.title.trim(),
        url: item.url?.trim() || null,
        publication: item.publication?.trim() || null,
        content_type: item.content_type?.trim() || null,
        order_index: index,
      }));

    if (rows.length > 0) {
      const { error: insertError } = await admin
        .from("featured_in")
        .insert(rows);

      if (insertError) {
        return { error: insertError.message };
      }
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { error: null };
}
