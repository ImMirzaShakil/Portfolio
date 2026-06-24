"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Experience, FeaturedIn, Writing } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface AboutFormPayload {
  id?: string;
  profile_image_url: string | null;
  gallery_images: string[];
  pronunciation: string;
  intro_text: string;
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
  show_experience: boolean;
  show_internships: boolean;
  show_education: boolean;
  show_writing: boolean;
  show_featured_in: boolean;
  featured_in: FeaturedIn[];
  experiences: Experience[];
  writings: Writing[];
}

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

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

  // ── about_content ────────────────────────────────────────────────
  const { error: aboutError } = await admin.from("about_content").upsert({
    ...(payload.id ? { id: payload.id } : {}),
    profile_image_url: payload.profile_image_url,
    gallery_images: payload.gallery_images,
    pronunciation: payload.pronunciation.trim() || null,
    intro_text: payload.intro_text.trim() || null,
    day_job_description: payload.day_job_description.trim() || null,
    currently_role: payload.currently_role.trim() || null,
    currently_company: payload.currently_company.trim() || null,
    out_of_office_text: payload.out_of_office_text.trim() || null,
    previously_companies: payload.previously_companies.trim() || null,
    internships_description: payload.internships_description.trim() || null,
    show_currently: payload.show_currently,
    show_previously: payload.show_previously,
    currently_label: payload.currently_label || "Currently",
    previously_label: payload.previously_label || "Previously at",
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
    show_experience: payload.show_experience,
    show_internships: payload.show_internships,
    show_education: payload.show_education,
    show_writing: payload.show_writing,
    show_featured_in: payload.show_featured_in,
    updated_at: new Date().toISOString(),
  });
  if (aboutError) return { error: aboutError.message };

  // ── featured_in ──────────────────────────────────────────────────
  const { error: fDelErr } = await admin
    .from("featured_in")
    .delete()
    .neq("id", DUMMY_UUID);
  if (fDelErr) return { error: fDelErr.message };

  const featuredRows = payload.featured_in
    .filter((i) => i.title.trim() && i.year.trim())
    .map((i, idx) => ({
      id: i.id,
      year: i.year.trim(),
      title: i.title.trim(),
      url: i.url?.trim() || null,
      publication: i.publication?.trim() || null,
      content_type: i.content_type?.trim() || null,
      is_visible: i.is_visible !== false,
      order_index: idx,
    }));
  if (featuredRows.length > 0) {
    const { error } = await admin.from("featured_in").insert(featuredRows);
    if (error) return { error: error.message };
  }

  // ── experiences ──────────────────────────────────────────────────
  const { error: expDelErr } = await admin
    .from("experiences")
    .delete()
    .neq("id", DUMMY_UUID);
  if (expDelErr) return { error: expDelErr.message };

  const expRows = payload.experiences
    .filter((e) => e.organization.trim() && e.role.trim())
    .map((e, idx) => ({
      id: e.id,
      year_range: e.year_range.trim(),
      organization: e.organization.trim(),
      role: e.role.trim(),
      description: e.description?.trim() || null,
      type: e.type,
      is_visible: e.is_visible !== false,
      order_index: idx,
    }));
  if (expRows.length > 0) {
    const { error } = await admin.from("experiences").insert(expRows);
    if (error) return { error: error.message };
  }

  // ── writings ─────────────────────────────────────────────────────
  const { error: wrDelErr } = await admin
    .from("writings")
    .delete()
    .neq("id", DUMMY_UUID);
  if (wrDelErr) return { error: wrDelErr.message };

  const wrRows = payload.writings
    .filter((w) => w.title.trim())
    .map((w, idx) => ({
      id: w.id,
      title: w.title.trim(),
      url: w.url?.trim() || "",
      publication: w.publication?.trim() || null,
      year: w.year?.trim() || null,
      description: w.description?.trim() || null,
      is_visible: w.is_visible !== false,
      order_index: idx,
    }));
  if (wrRows.length > 0) {
    const { error } = await admin.from("writings").insert(wrRows);
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { error: null };
}
