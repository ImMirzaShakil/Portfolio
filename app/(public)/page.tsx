import { FeaturedInList } from "@/components/about/FeaturedInList";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeVideoSection } from "@/components/home/HomeVideoSection";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { getFunFacts } from "@/lib/homepage";
import { getSiteContext, getSiteUrl } from "@/lib/metadata";
import { PROJECT_WITH_STATUS_SELECT } from "@/lib/project-queries";
import {
  buildPageMetadata,
  normalizeSharedSeo,
  type StaticSeoPageId,
} from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { about, settings, siteName } = await getSiteContext();
  const role = about?.currently_role ?? "Software Engineer";
  const company = about?.currently_company
    ? ` at ${about.currently_company}`
    : "";
  const title = settings?.site_title ?? siteName;
  const description =
    about?.home_intro_text?.trim().slice(0, 160) ??
    `${role}${company} — portfolio and selected work.`;
  const images = settings?.profile_image_url
    ? settings.profile_image_url
    : about?.profile_image_url;
  const pageSeo = settings?.page_seo?.[
    "home" as StaticSeoPageId
  ];

  return buildPageMetadata(normalizeSharedSeo(pageSeo), {
    title,
    description,
    image: images,
    url: getSiteUrl(),
    siteName,
  });
}

export default async function HomePage() {
  const supabase = createAdminClient();

  const [
    { data: about },
    { data: settings },
    { data: projects },
    { data: featuredIn },
  ] = await Promise.all([
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase
      .from("projects")
      .select(PROJECT_WITH_STATUS_SELECT)
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("order_index", { ascending: true }),
    supabase
      .from("featured_in")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  const showHomeVideo =
    settings?.show_home_video === true &&
    Boolean(getYouTubeEmbedUrl(settings?.home_video_youtube_url));

  const visibleFeaturedIn = (featuredIn ?? []).filter(
    (item) => item.is_visible !== false
  );
  const showFeaturedInHome =
    about?.show_featured_in_home === true && visibleFeaturedIn.length > 0;

  return (
    <div className="space-y-20">
      <HeroSection
        name={settings?.site_title}
        heroHeading={settings?.hero_heading}
        profileImageUrl={settings?.profile_image_url}
        about={about}
        funFacts={getFunFacts(about)}
      />
      <ProjectGrid
        projects={projects ?? []}
        emptyMessage="No featured projects yet. Mark projects as featured in the admin panel."
      />
      {showHomeVideo ? (
        <HomeVideoSection
          sectionTitle={settings?.home_video_section_title}
          youtubeUrl={settings?.home_video_youtube_url}
          title={settings?.home_video_title}
          subtitle={settings?.home_video_subtitle}
        />
      ) : null}
      {showFeaturedInHome ? (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Featured in</h2>
          <FeaturedInList items={visibleFeaturedIn} />
        </section>
      ) : null}
    </div>
  );
}
