"use server";

import { revalidatePath } from "next/cache";
import {
  cloneCanvasDocument,
  normalizeCanvasDocument,
  type CanvasDocument,
} from "@/lib/canvas-document";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { SectionTemplate } from "@/lib/types";

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

export async function listSectionTemplatesAction(): Promise<{
  templates: SectionTemplate[];
  error: string | null;
}> {
  try {
    await requireAdminUser();
  } catch {
    return { templates: [], error: "Unauthorized" };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("section_templates")
    .select("*")
    .eq("section_kind", "canvas")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return { templates: [], error: error.message };
  }

  return { templates: (data ?? []) as SectionTemplate[], error: null };
}

export async function saveSectionTemplateAction(payload: {
  name: string;
  document: CanvasDocument;
  thumbnail_url?: string | null;
}): Promise<{ template: SectionTemplate | null; error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { template: null, error: "Unauthorized" };
  }

  const name = payload.name.trim();
  if (!name) {
    return { template: null, error: "Template name is required." };
  }

  const admin = createAdminClient();
  const document = normalizeCanvasDocument(payload.document);

  const { data, error } = await admin
    .from("section_templates")
    .insert({
      name,
      section_kind: "canvas",
      document,
      thumbnail_url: payload.thumbnail_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) {
    return { template: null, error: error?.message ?? "Failed to save template." };
  }

  revalidatePath("/admin/projects");
  return { template: data as SectionTemplate, error: null };
}

export async function deleteSectionTemplateAction(
  templateId: string
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "Unauthorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("section_templates")
    .delete()
    .eq("id", templateId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  return { error: null };
}

export function documentFromTemplate(template: SectionTemplate): CanvasDocument {
  const doc = cloneCanvasDocument(normalizeCanvasDocument(template.document));
  doc.templateId = template.id;
  return doc;
}
