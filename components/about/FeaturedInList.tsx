import { ArrowUpRight } from "lucide-react";
import type { FeaturedIn } from "@/lib/types";

interface FeaturedInListProps {
  items: FeaturedIn[];
}

export function FeaturedInList({ items }: FeaturedInListProps) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[80px_1fr_auto] sm:items-baseline sm:gap-6 first:pt-0 last:pb-0"
        >
          <p className="text-sm text-meta">{item.year}</p>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1 font-semibold transition-colors hover:text-muted-foreground"
            >
              {item.title}
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 opacity-60" />
            </a>
          ) : (
            <p className="font-semibold">{item.title}</p>
          )}
          {(item.publication || item.content_type) ? (
            <p className="text-sm text-meta">
              {[item.publication, item.content_type].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
