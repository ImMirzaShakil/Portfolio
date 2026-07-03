"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { encryptPassword } from "@/lib/password-encryption";
import { hashProjectPassword } from "@/lib/project-password";
import { revalidatePath } from "next/cache";

export interface SectionFormPayload {
  section_type: string;
  title: string;
  content: string;
  image_url: string | null;
}

export interface ProjectFormPayload {
  id?: string;
  title: string;
  slug: string;
  subtitle: string;
  status_id: string;
  company: string;
  type: string;
  year: string;
  summary: string;
  cover_image_url: string | null;
  is_published: boolean;
  is_password_protected: boolean;
  password: string;
  order_index: number;
  sections: SectionFormPayload[];
}

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function saveProjectAction(
  payload: ProjectFormPayload
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "You must be logged in to save projects." };
  }

  const admin = createAdminClient();

  let passwordHash: string | null = null;
  let passwordEncrypted: string | null = null;

  if (payload.is_password_protected) {
    const password = payload.password.trim();

    if (password) {
      passwordHash = await hashProjectPassword(password);
      passwordEncrypted = encryptPassword(password);
    } else if (payload.id) {
      const { data: existing } = await admin
        .from("projects")
        .select("password_hash, password_encrypted")
        .eq("id", payload.id)
        .maybeSingle();

      passwordHash = existing?.password_hash ?? null;
      passwordEncrypted = existing?.password_encrypted ?? null;

      if (!passwordHash) {
        return { error: "Set a password when enabling protection." };
      }
    } else {
      return { error: "Set a password when enabling protection." };
    }
  }

  const projectPayload = {
    ...(payload.id ? { id: payload.id } : {}),
    title: payload.title.trim(),
    slug: payload.slug.trim(),
    subtitle: payload.subtitle.trim() || null,
    status_id: payload.status_id || null,
    company: payload.company.trim() || null,
    type: payload.type.trim() || null,
    year: payload.year.trim() || null,
    summary: payload.summary.trim() || null,
    cover_image_url: payload.cover_image_url,
    is_published: payload.is_published,
    is_password_protected: payload.is_password_protected,
    password_hash: passwordHash,
    password_encrypted: passwordEncrypted,
    order_index: payload.order_index,
    updated_at: new Date().toISOString(),
  };

  const { data: savedProject, error: saveError } = await admin
    .from("projects")
    .upsert(projectPayload)
    .select()
    .single();

  if (saveError || !savedProject) {
    return { error: saveError?.message ?? "Failed to save project." };
  }

  const { error: deleteError } = await admin
    .from("project_sections")
    .delete()
    .eq("project_id", savedProject.id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  if (payload.sections.length > 0) {
    const sectionsPayload = payload.sections.map((section, index) => ({
      project_id: savedProject.id,
      section_type: section.section_type,
      title: section.title.trim() || null,
      content: section.content.trim() || null,
      image_url: section.image_url,
      order_index: index,
    }));

    const { error: sectionsError } = await admin
      .from("project_sections")
      .insert(sectionsPayload);

    if (sectionsError) {
      return { error: sectionsError.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${savedProject.slug}`);

  return { error: null };
}

export async function toggleProjectPublishedAction(
  projectId: string,
  isPublished: boolean
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "Unauthorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update({ is_published: isPublished })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");

  return { error: null };
}

export async function toggleProjectFeaturedAction(
  projectId: string,
  isFeatured: boolean
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "Unauthorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .update({ is_featured: isFeatured })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");

  return { error: null };
}

export async function deleteProjectAction(
  projectId: string
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "Unauthorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("projects").delete().eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/projects");

  return { error: null };
}
