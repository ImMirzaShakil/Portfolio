import { FunProjectCard } from "@/components/fun/FunProjectCard";
import { getSiteContext, getSiteUrl } from "@/lib/metadata";
import {
  buildPageMetadata,
  normalizeSharedSeo,
  type StaticSeoPageId,
} from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { about, settings, siteName } = await getSiteContext();

  return buildPageMetadata(
    normalizeSharedSeo(settings?.page_seo?.["fun" as StaticSeoPageId]),
    {
      title: `Fun · ${settings?.site_title ?? siteName}`,
      description: `Experimental work and side projects by ${siteName}.`,
      image: about?.profile_image_url,
      url: `${getSiteUrl()}/fun`,
      siteName,
    }
  );
}

export default async function FunPage() {
  const supabase = createAdminClient();

  const { data: funProjects } = await supabase
    .from("fun_projects")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold md:text-5xl">Fun</h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Experimental work, side projects, and playful ideas outside the day job.
        </p>
      </header>

      {funProjects && funProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {funProjects.map((project) => (
            <FunProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
          No fun projects published yet — check back soon.
        </p>
      )}
    </div>
  );
}
