import Image from "next/image";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import type { Project, ProjectSection } from "@/lib/types";

interface ProjectCaseStudyProps {
  project: Project;
  sections: ProjectSection[];
}

export function ProjectCaseStudy({ project, sections }: ProjectCaseStudyProps) {
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
          <h2 className="mb-6 text-base font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Facts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {quickFacts.map((fact) => (
              <div key={fact.id} className="space-y-2">
                <p className="text-base font-medium text-muted-foreground">
                  {fact.title}
                </p>
                <p className="text-lg">{fact.content}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="space-y-16 md:space-y-20">
        {contentSections.map((section) => (
          <CaseStudySection key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}
