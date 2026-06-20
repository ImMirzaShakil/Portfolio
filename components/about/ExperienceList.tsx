import type { Experience } from "@/lib/types";

interface ExperienceListProps {
  title: string;
  experiences: Experience[];
}

export function ExperienceList({ title, experiences }: ExperienceListProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="space-y-8">
        {experiences.map((experience) => (
          <article key={experience.id} className="space-y-2 border-b border-border pb-8 last:border-b-0 last:pb-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-xl font-semibold">{experience.role}</h3>
              <p className="text-base text-muted-foreground">{experience.year_range}</p>
            </div>
            <p className="text-lg font-medium">{experience.organization}</p>
            {experience.description ? (
              <p className="text-base leading-relaxed text-muted-foreground">
                {experience.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
