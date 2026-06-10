import { HeroSection } from "@/components/home/HeroSection";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { getFunFacts } from "@/lib/homepage";
import { createAdminClient } from "@/lib/supabase/admin";

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
