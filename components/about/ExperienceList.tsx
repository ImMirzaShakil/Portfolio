import type { Experience } from "@/lib/types";

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {experiences.map((experience) => (
        <article
          key={experience.id}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr] sm:gap-6"
        >
          <p className="shrink-0 text-sm text-meta">{experience.year_range}</p>
          <div>
            <p className="font-bold leading-snug">{experience.organization}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {experience.role}
            </p>
            {experience.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {experience.description}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
