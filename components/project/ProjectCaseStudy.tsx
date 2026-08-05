import Image from "next/image";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import {
  isHtmlSectionContent,
  sanitizeAdminHtml,
} from "@/lib/project-sections";
import type { Project, ProjectSection } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const quickFacts = sections.filter(
    (section) =>
      section.section_type === "quickfact" &&
      (section.title?.trim() || section.content?.trim())
  );
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
  const showSummaryRow = showProblemOutcome || showSidebar || Boolean(impact);

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

      <header className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>
          {subtitle ? (
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          ) : null}
        </div>

        {summary ? (
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            {summary}
          </p>
        ) : null}

        {showSummaryRow ? (
          <div
            className={cn(
              showSidebar &&
                "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(200px,280px)] lg:gap-14 xl:gap-20"
            )}
          >
            <div className="min-w-0 space-y-6">
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
              <aside
                className={cn(
                  "space-y-6",
                  showProblemOutcome || impact ? "border-t border-border pt-6" : null
                )}
              >
                {role ? <MetaBlock label="Role" value={role} /> : null}
                {timeline ? (
                  <MetaBlock label="Timeline" value={timeline} />
                ) : null}
                {team ? <MetaBlock label="Team" value={team} /> : null}
              </aside>
            ) : null}
          </div>
        ) : null}
      </header>

      {quickFacts.length > 0 ? (
        <div className="flex flex-wrap gap-x-10 gap-y-6 border-y border-border py-6">
          {quickFacts.map((fact) => {
            const asHtml = isHtmlSectionContent(
              fact.section_type,
              fact.content_format
            );
            const html = asHtml
              ? sanitizeAdminHtml(fact.content ?? "").trim()
              : "";

            return (
              <div key={fact.id} className="min-w-[8rem] max-w-xs space-y-1">
                {fact.title?.trim() ? (
                  <p className="text-sm font-bold text-foreground">
                    {fact.title.trim()}
                  </p>
                ) : null}
                {asHtml && html ? (
                  <div
                    className="case-study-html text-sm leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ) : fact.content?.trim() ? (
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {fact.content.trim()}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-16 md:space-y-20">
        {contentSections.map((section) => (
          <CaseStudySection key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}
