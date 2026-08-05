import Image from "next/image";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import type { Project, ProjectSection } from "@/lib/types";

interface ProjectCaseStudyProps {
  project: Project;
  sections: ProjectSection[];
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-bold text-foreground">{label}</p>
      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

export function ProjectCaseStudy({ project, sections }: ProjectCaseStudyProps) {
  const contentSections = sections.filter(
    (section) => section.section_type !== "quickfact"
  );

  const problem = project.problem_text?.trim() || null;
  const outcome = project.outcome_text?.trim() || null;
  const problemLabel = project.problem_label?.trim() || "Problem";
  const outcomeLabel = project.outcome_label?.trim() || "Outcome";
  const impact = project.impact_text?.trim() || null;
  const role = project.role_text?.trim() || null;
  const timeline = project.timeline_text?.trim() || null;
  const team = project.team_text?.trim() || null;
  const subtitle = project.subtitle?.trim() || null;
  const summary = project.summary?.trim() || null;

  const showSidebar = Boolean(role || timeline || team);
  const showProblemOutcome = Boolean(problem || outcome);

  return (
    <article className="space-y-12">
      {project.cover_image_url ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>
      ) : null}

      <header
        className={
          showSidebar
            ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(200px,280px)] lg:gap-14 xl:gap-20"
            : "space-y-6"
        }
      >
        <div className="min-w-0 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>
            {subtitle ? (
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                {subtitle}
              </p>
            ) : null}
          </div>

          {summary ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {summary}
            </p>
          ) : null}

          {showProblemOutcome ? (
            <div className="grid gap-8 border-t border-border pt-6 sm:grid-cols-2 sm:gap-10">
              {problem ? (
                <div className="space-y-2">
                  <h2 className="text-base font-bold">{problemLabel}</h2>
                  <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {problem}
                  </p>
                </div>
              ) : null}
              {outcome ? (
                <div className="space-y-2">
                  <h2 className="text-base font-bold">{outcomeLabel}</h2>
                  <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {outcome}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {impact ? (
            <div className="space-y-2 border-t border-border pt-6">
              <h2 className="text-base font-bold">Impact</h2>
              <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {impact}
              </p>
            </div>
          ) : null}
        </div>

        {showSidebar ? (
          <aside className="space-y-6 lg:pt-2">
            {role ? <MetaBlock label="Role" value={role} /> : null}
            {timeline ? <MetaBlock label="Timeline" value={timeline} /> : null}
            {team ? <MetaBlock label="Team" value={team} /> : null}
          </aside>
        ) : null}
      </header>

      <div className="space-y-16 md:space-y-20">
        {contentSections.map((section) => (
          <CaseStudySection key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}
