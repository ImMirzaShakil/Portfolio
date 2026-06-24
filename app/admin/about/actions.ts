"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Experience, FeaturedIn, Writing } from "@/lib/types";
import {
  ensureAboutId,
  revalidateAboutPaths,
  saveExperiences,
  saveFeaturedIn,
  saveWritings,
  updateAboutContent,
} from "@/lib/about-save-helpers";

export type AboutSectionId =
  | "profile"
  | "intro"
  | "day-job"
  | "currently-previously"
  | "superpowers"
  | "gallery"
  | "experience"
  | "internships-note"
  | "writing"
  | "featured-in"
  | "social";

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
  visible_social_links_hero: string[];
  visible_social_links_footer: string[];
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
  facebook_url: string;
  instagram_url: string;
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

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to save about content.");
  }
}

export async function saveAboutSectionAction(
  section: AboutSectionId,
  payload: AboutFormPayload
): Promise<{ error: string | null; aboutId?: string }> {
  try {
    await requireAdminUser();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const admin = createAdminClient();

  try {
    const aboutId = await ensureAboutId(admin, payload.id);

    switch (section) {
      case "profile":
        await updateAboutContent(admin, aboutId, {
          profile_image_url: payload.profile_image_url,
        });
        break;
      case "intro":
        await updateAboutContent(admin, aboutId, {
          pronunciation: payload.pronunciation.trim() || null,
          intro_text: payload.intro_text.trim() || null,
        });
        break;
      case "day-job":
        await updateAboutContent(admin, aboutId, {
          day_job_description: payload.day_job_description.trim() || null,
          out_of_office_text: payload.out_of_office_text.trim() || null,
        });
        break;
      case "currently-previously":
        await updateAboutContent(admin, aboutId, {
          currently_role: payload.currently_role.trim() || null,
          currently_company: payload.currently_company.trim() || null,
          previously_companies: payload.previously_companies.trim() || null,
          show_currently: payload.show_currently,
          show_previously: payload.show_previously,
          currently_label: payload.currently_label || "Currently",
          previously_label: payload.previously_label || "Previously at",
        });
        break;
      case "superpowers":
        await updateAboutContent(admin, aboutId, {
          superpower_1: payload.superpower_1.trim() || null,
          superpower_1_desc: payload.superpower_1_desc.trim() || null,
          superpower_2: payload.superpower_2.trim() || null,
          superpower_2_desc: payload.superpower_2_desc.trim() || null,
          superpower_3: payload.superpower_3.trim() || null,
          superpower_3_desc: payload.superpower_3_desc.trim() || null,
          superpower_4: payload.superpower_4.trim() || null,
          superpower_4_desc: payload.superpower_4_desc.trim() || null,
        });
        break;
      case "gallery":
        await updateAboutContent(admin, aboutId, {
          gallery_images: payload.gallery_images,
        });
        break;
      case "experience":
        await updateAboutContent(admin, aboutId, {
          show_experience: payload.show_experience,
          show_internships: payload.show_internships,
          show_education: payload.show_education,
        });
        await saveExperiences(admin, payload.experiences);
        break;
      case "internships-note":
        await updateAboutContent(admin, aboutId, {
          internships_description: payload.internships_description.trim() || null,
        });
        break;
      case "writing":
        await updateAboutContent(admin, aboutId, {
          show_writing: payload.show_writing,
        });
        await saveWritings(admin, payload.writings);
        break;
      case "featured-in":
        await updateAboutContent(admin, aboutId, {
          show_featured_in: payload.show_featured_in,
        });
        await saveFeaturedIn(admin, payload.featured_in);
        break;
      case "social":
        await updateAboutContent(admin, aboutId, {
          twitter_url: payload.twitter_url.trim() || null,
          linkedin_url: payload.linkedin_url.trim() || null,
          github_url: payload.github_url.trim() || null,
          facebook_url: payload.facebook_url.trim() || null,
          instagram_url: payload.instagram_url.trim() || null,
          email: payload.email.trim() || null,
          visible_social_links_hero: payload.visible_social_links_hero,
          visible_social_links_footer: payload.visible_social_links_footer,
        });
        break;
      default:
        return { error: "Unknown section." };
    }

    revalidateAboutPaths();
    return { error: null, aboutId };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save section.",
    };
  }
}

export async function saveAboutAction(
  payload: AboutFormPayload
): Promise<{ error: string | null; aboutId?: string }> {
  try {
    await requireAdminUser();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const admin = createAdminClient();

  try {
    const aboutId = await ensureAboutId(admin, payload.id);

    await updateAboutContent(admin, aboutId, {
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
      facebook_url: payload.facebook_url.trim() || null,
      instagram_url: payload.instagram_url.trim() || null,
      email: payload.email.trim() || null,
      visible_social_links_hero: payload.visible_social_links_hero,
      visible_social_links_footer: payload.visible_social_links_footer,
      show_experience: payload.show_experience,
      show_internships: payload.show_internships,
      show_education: payload.show_education,
      show_writing: payload.show_writing,
      show_featured_in: payload.show_featured_in,
    });

    await saveFeaturedIn(admin, payload.featured_in);
    await saveExperiences(admin, payload.experiences);
    await saveWritings(admin, payload.writings);

    revalidateAboutPaths();
    return { error: null, aboutId };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save about page.",
    };
  }
}
