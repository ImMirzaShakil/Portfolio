import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/metadata";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const supabase = createStaticClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("is_published", true)
    .eq("is_password_protected", false);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fun`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = (projects ?? []).map(
    (project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updated_at
        ? new Date(project.updated_at)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...projectPages];
}
