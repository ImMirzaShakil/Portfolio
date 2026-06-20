import Image from "next/image";
import type { FunProject } from "@/lib/types";

interface FunProjectCardProps {
  project: FunProject;
}

export function FunProjectCard({ project }: FunProjectCardProps) {
  const content = (
    <>
      {project.cover_image_url ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-muted" />
      )}

      <div className="space-y-3 p-6">
        <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
        {project.description ? (
          <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        ) : null}
      </div>
    </>
  );

  const className =
    "group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} (opens in new tab)`}
        className={className}
      >
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
}
