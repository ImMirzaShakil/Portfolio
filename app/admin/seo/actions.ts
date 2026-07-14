"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  compactSitePageSeo,
  type SitePageSeo,
} from "@/lib/seo";

export interface SavePageSeoPayload {
  settings_id?: string;
  page_seo: SitePageSeo;
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

export async function savePageSeoAction(
  payload: SavePageSeoPayload
): Promise<{ error: string | null }> {
  try {
    await requireAdminUser();
  } catch {
    return { error: "You must be logged in to save SEO settings." };
  }

  const admin = createAdminClient();
  const pageSeo = compactSitePageSeo(payload.page_seo);

  if (payload.settings_id) {
    const { error } = await admin
      .from("site_settings")
      .update({ page_seo: pageSeo })
      .eq("id", payload.settings_id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { data: existing } = await admin
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await admin
        .from("site_settings")
        .update({ page_seo: pageSeo })
        .eq("id", existing.id);

      if (error) {
        return { error: error.message };
      }
    } else {
      const { error } = await admin.from("site_settings").insert({
        site_title: "Portfolio",
        page_seo: pageSeo,
      });

      if (error) {
        return { error: error.message };
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/fun");
  revalidatePath("/admin/seo");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  revalidatePath("/llms.txt");

  return { error: null };
}
