import type { SupabaseClient } from "@supabase/supabase-js";
import type { Experience, FeaturedIn, Writing } from "@/lib/types";
import { revalidatePath } from "next/cache";

const DUMMY_UUID = "00000000-0000-0000-0000-000000000000";

type AboutUpdate = Record<string, unknown>;

export async function ensureAboutId(
  admin: SupabaseClient,
  id?: string
): Promise<string> {
  if (id) {
    return id;
  }

  const { data: existing } = await admin
    .from("about_content")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

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

export async function updateAboutContent(
  admin: SupabaseClient,
  aboutId: string,
  fields: AboutUpdate
) {
  const { error } = await admin
    .from("about_content")
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq("id", aboutId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveFeaturedIn(
  admin: SupabaseClient,
  items: FeaturedIn[]
) {
  const { error: deleteError } = await admin
    .from("featured_in")
    .delete()
    .neq("id", DUMMY_UUID);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows = items
    .filter((item) => item.title.trim() && item.year.trim())
    .map((item, index) => ({
      id: item.id,
      year: item.year.trim(),
      title: item.title.trim(),
      url: item.url?.trim() || null,
      publication: item.publication?.trim() || null,
      content_type: item.content_type?.trim() || null,
      is_visible: item.is_visible !== false,
      order_index: index,
    }));

  if (rows.length === 0) {
    return;
  }

  const { error } = await admin.from("featured_in").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveExperiences(
  admin: SupabaseClient,
  items: Experience[]
) {
  const { error: deleteError } = await admin
    .from("experiences")
    .delete()
    .neq("id", DUMMY_UUID);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows = items
    .filter((item) => item.organization.trim() && item.role.trim())
    .map((item, index) => ({
      id: item.id,
      year_range: item.year_range.trim(),
      organization: item.organization.trim(),
      role: item.role.trim(),
      description: item.description?.trim() || null,
      type: item.type,
      is_visible: item.is_visible !== false,
      order_index: index,
    }));

  if (rows.length === 0) {
    return;
  }

  const { error } = await admin.from("experiences").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveWritings(admin: SupabaseClient, items: Writing[]) {
  const { error: deleteError } = await admin
    .from("writings")
    .delete()
    .neq("id", DUMMY_UUID);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows = items
    .filter((item) => item.title.trim())
    .map((item, index) => ({
      id: item.id,
      title: item.title.trim(),
      url: item.url?.trim() || "",
      publication: item.publication?.trim() || null,
      year: item.year?.trim() || null,
      description: item.description?.trim() || null,
      is_visible: item.is_visible !== false,
      order_index: index,
    }));

  if (rows.length === 0) {
    return;
  }

  const { error } = await admin.from("writings").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export function revalidateAboutPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");
}
