import { HeroSection } from "@/components/home/HeroSection";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { getFunFacts } from "@/lib/homepage";
import {
  buildOpenGraph,
  buildTwitter,
  getSiteContext,
  getSiteUrl,
} from "@/lib/metadata";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { about, settings, siteName } = await getSiteContext();
  const role = about?.currently_role ?? "Software Engineer";
  const company = about?.currently_company
    ? ` at ${about.currently_company}`
    : "";
  const title = settings?.site_title ?? siteName;
  const description =
    about?.intro_text?.trim().slice(0, 160) ??
    `${role}${company} — portfolio and selected work.`;
  const images = about?.profile_image_url
    ? [about.profile_image_url]
    : undefined;

  return {
    title,
    description,
    openGraph: buildOpenGraph({
      title,
      description,
      images,
      url: getSiteUrl(),
    }),
    twitter: buildTwitter({ title, description, images }),
  };
}

export default async function HomePage() {
  const supabase = createAdminClient();

  const [{ data: about }, { data: settings }, { data: projects }] =
    await Promise.all([
      supabase.from("about_content").select("*").limit(1).maybeSingle(),
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true }),
    ]);

  return (
    <div className="space-y-20">
      <HeroSection
        name={settings?.site_title}
        about={about}
        funFacts={getFunFacts(about)}
      />
      <ProjectGrid projects={projects ?? []} />
    </div>
  );
}
