import { ProjectGrid } from "@/components/home/ProjectGrid";
import { getSiteContext, getSiteUrl } from "@/lib/metadata";
import { PROJECT_WITH_STATUS_SELECT } from "@/lib/project-queries";
import {
  buildPageMetadata,
  normalizeSharedSeo,
  type StaticSeoPageId,
} from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { about, settings, siteName } = await getSiteContext();
  const role = about?.currently_role ?? "Software Engineer";
  const company = about?.currently_company
    ? ` at ${about.currently_company}`
    : "";
  const title = `Work · ${settings?.site_title ?? siteName}`;
  const description =
    about?.intro_text?.trim().slice(0, 160) ??
    `${role}${company} — portfolio and selected work.`;

  return buildPageMetadata(
    normalizeSharedSeo(settings?.page_seo?.["work" as StaticSeoPageId]),
    {
      title,
      description,
      image: about?.profile_image_url,
      url: `${getSiteUrl()}/work`,
      siteName,
    }
  );
}

export default async function WorkPage() {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from("projects")
    .select(PROJECT_WITH_STATUS_SELECT)
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  return (
    <ProjectGrid
      projects={projects ?? []}
      title="All work"
      emptyMessage="No published projects yet."
    />
  );
}
