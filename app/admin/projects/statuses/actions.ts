"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatusOption } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface ProjectStatusFormItem {
  id?: string;
  label: string;
}

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
}

export async function saveProjectStatusesAction(
  items: ProjectStatusFormItem[]
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "You must be logged in to manage project statuses." };
  }

  const admin = createAdminClient();

  const rows = items
    .map((item, index) => ({
      id: item.id,
      label: item.label.trim(),
      order_index: index,
    }))
    .filter((item) => item.label.length > 0);

  const labels = rows.map((row) => row.label.toLowerCase());
  if (new Set(labels).size !== labels.length) {
    return { error: "Each status label must be unique." };
  }

  const { data: existingStatuses, error: fetchError } = await admin
    .from("project_statuses")
    .select("id");

  if (fetchError) {
    return { error: fetchError.message };
  }

  const keptIds = new Set(
    rows.map((row) => row.id).filter((id): id is string => Boolean(id))
  );
  const idsToDelete = (existingStatuses ?? [])
    .map((status) => status.id)
    .filter((id) => !keptIds.has(id));

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await admin
      .from("project_statuses")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      return { error: deleteError.message };
    }
  }

  for (const row of rows) {
    if (row.id) {
      const { error } = await admin
        .from("project_statuses")
        .update({
          label: row.label,
          order_index: row.order_index,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      if (error) {
        return { error: error.message };
      }
      continue;
    }

    const { error } = await admin.from("project_statuses").insert({
      label: row.label,
      order_index: row.order_index,
    });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/projects/statuses");
  revalidatePath("/");
  revalidatePath("/work");

  return { error: null };
}

export async function fetchProjectStatuses(): Promise<ProjectStatusOption[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("project_statuses")
    .select("id, label, order_index")
    .order("order_index", { ascending: true });

  return data ?? [];
}
