import Image from "next/image";
import { CaseStudySection } from "@/components/project/CaseStudySection";
import { StoryScrollMenu } from "@/components/project/story/StoryScrollMenu";
import { StorySection } from "@/components/project/story/StorySection";
import { normalizeStoryDocument } from "@/lib/story-section";
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
  if (sections.some((section) => section.section_type === "story")) {
    return <StoryCaseStudy project={project} sections={sections} />;
  }

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

function StoryInfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}

/**
 * taamannae.dev-style layout: rounded cover, 4-column info grid, then
 * full-width alternating dark / light bands with no gaps between them.
 */
function StoryCaseStudy({ project, sections }: ProjectCaseStudyProps) {
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
  const impact = project.impact_text?.trim() || null;
  const role = project.role_text?.trim() || null;
  const timeline = project.timeline_text?.trim() || null;
  const team = project.team_text?.trim() || null;
  const subtitle = project.subtitle?.trim() || null;
  const summary = project.summary?.trim() || null;

  const rendered = contentSections.map((section) => {
    const anchor = `section-${section.id}`;
    if (section.section_type === "story") {
      const doc = normalizeStoryDocument(section.blocks_data);
      return {
        anchor,
        menuLabel: doc.menuLabel.trim(),
        node: <StorySection key={section.id} id={anchor} doc={doc} />,
      };
    }
    return {
      anchor,
      menuLabel: "",
      node: (
        <section
          key={section.id}
          id={anchor}
          className="story-band story-band--light"
        >
          <div className="story-container">
            <CaseStudySection section={section} />
          </div>
        </section>
      ),
    };
  });

  const menuItems = rendered
    .filter((item) => item.menuLabel)
    .map((item) => ({ id: item.anchor, label: item.menuLabel }));
  const showMenu = menuItems.length >= 2;

  return (
    <article
      className={cn(
        "story-page -mb-8 sm:-mb-10 lg:-mb-12",
        showMenu && "story-page--with-menu"
      )}
    >
      {showMenu ? <StoryScrollMenu items={menuItems} /> : null}

      {project.cover_image_url ? (
        <header
          className="story-cover"
          style={{ backgroundImage: `url('${project.cover_image_url}')` }}
          role="img"
          aria-label={project.title}
        />
      ) : null}

      <div className="story-info">
        <div className="story-info-title">
          <h1>{project.title}</h1>
          {subtitle ? <h2 className="story-subtitle">{subtitle}</h2> : null}
        </div>
        <div className="story-info-body">
          {summary ? <p className="story-blurb whitespace-pre-wrap">{summary}</p> : null}
          {problem || outcome ? (
            <div className="story-info-pair">
              {problem ? (
                <StoryInfoBlock
                  label={project.problem_label?.trim() || "Problem"}
                  value={problem}
                />
              ) : null}
              {outcome ? (
                <StoryInfoBlock
                  label={project.outcome_label?.trim() || "Outcome"}
                  value={outcome}
                />
              ) : null}
            </div>
          ) : null}
          {impact ? <StoryInfoBlock label="Impact" value={impact} /> : null}
        </div>
        <div className="story-info-tools">
          {role ? <StoryInfoBlock label="Role" value={role} /> : null}
          {timeline ? <StoryInfoBlock label="Timeline" value={timeline} /> : null}
          {team ? <StoryInfoBlock label="Team" value={team} /> : null}
          {quickFacts.map((fact) => (
            <StoryInfoBlock
              key={fact.id}
              label={fact.title?.trim() ?? ""}
              value={
                isHtmlSectionContent(fact.section_type, fact.content_format)
                  ? (fact.content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
                  : fact.content?.trim() ?? ""
              }
            />
          ))}
        </div>
      </div>

      {rendered.map((item) => item.node)}
    </article>
  );
}
