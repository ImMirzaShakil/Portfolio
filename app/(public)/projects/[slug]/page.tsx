import Image from "next/image";
import { notFound } from "next/navigation";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

async function getProject(slug: string) {
  const supabase = createAdminClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !project || !project.is_published) {
    return null;
  }

  const { data: sections } = await supabase
    .from("project_sections")
    .select("*")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  return { project, sections: sections ?? [] };
}

export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_published", true);

  return (projects ?? []).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const data = await getProject(params.slug);

  if (!data) {
    return {
      title: "Project not found",
    };
  }

  const { project } = data;
  const description = project.subtitle ?? project.summary ?? undefined;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      images: project.cover_image_url
        ? [{ url: project.cover_image_url }]
        : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const data = await getProject(params.slug);

  if (!data) {
    notFound();
  }

  const { project, sections } = data;
  const quickFacts = sections.filter(
    (section) => section.section_type === "quickfact"
  );
  const contentSections = sections.filter(
    (section) => section.section_type !== "quickfact"
  );

  return (
    <article className="space-y-12">
      {project.cover_image_url ? (
        <div className="relative left-1/2 aspect-[21/9] w-screen max-w-none -translate-x-1/2 overflow-hidden">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      ) : null}

      <header className="space-y-4">
        <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>
        {project.subtitle ? (
          <p className="text-lg text-muted-foreground">{project.subtitle}</p>
        ) : null}
        {project.summary ? (
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        ) : null}
      </header>

      {quickFacts.length > 0 ? (
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Facts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {quickFacts.map((fact) => (
              <div key={fact.id} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {fact.title}
                </p>
                <p className="text-base">{fact.content}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="space-y-16">
        {contentSections.map((section) => (
          <CaseStudySection
            key={section.id}
            title={section.title}
            content={section.content}
            image_url={section.image_url}
            section_type={section.section_type}
          />
        ))}
      </div>
    </article>
  );
}
