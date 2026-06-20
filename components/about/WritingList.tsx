import { ArrowUpRight } from "lucide-react";
import type { Writing } from "@/lib/types";

interface WritingListProps {
  writings: Writing[];
}

export function WritingList({ writings }: WritingListProps) {
  if (writings.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-border">
      {writings.map((writing) => (
        <article
          key={writing.id}
          className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[80px_1fr] sm:gap-6 first:pt-0 last:pb-0"
        >
          <p className="shrink-0 text-sm text-meta">{writing.year}</p>
          <div>
            <a
              href={writing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1 font-semibold transition-colors hover:text-muted-foreground"
            >
              {writing.title}
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-60" />
            </a>
            {writing.publication ? (
              <p className="mt-0.5 text-xs text-meta">{writing.publication}</p>
            ) : null}
            {writing.description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {writing.description}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
