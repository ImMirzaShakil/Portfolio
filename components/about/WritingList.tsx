import type { Writing } from "@/lib/types";

interface WritingListProps {
  writings: Writing[];
}

export function WritingList({ writings }: WritingListProps) {
  if (writings.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Writing</h2>
      <div className="space-y-4">
        {writings.map((writing) => (
          <article key={writing.id} className="flex flex-col gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between">
            <a
              href={writing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium transition-colors hover:text-muted-foreground"
            >
              {writing.title}
            </a>
            <p className="text-base text-muted-foreground">
              {[writing.publication, writing.year].filter(Boolean).join(" · ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
