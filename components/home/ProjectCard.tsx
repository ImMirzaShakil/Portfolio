import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { getProjectStatusLabel } from "@/lib/project-queries";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

function formatMetadata(project: Project) {
  return [project.company, project.year].filter(Boolean).join(" · ");
}

function isGifUrl(url: string) {
  return url.split("?")[0].toLowerCase().endsWith(".gif");
}

export function ProjectCard({ project }: ProjectCardProps) {
  const metadata = formatMetadata(project);
  const statusLabel = getProjectStatusLabel(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      {project.cover_image_url ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          {isGifUrl(project.cover_image_url) ? (
            // Plain <img> preserves GIF animation; Next.js Image strips it
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>
      ) : (
        <div className="aspect-[4/3] rounded-2xl bg-muted" />
      )}

      {/* Card body — no border, no box */}
      <div className="space-y-2 px-1 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="text-xl font-bold leading-tight text-foreground">
              {project.title}
            </h3>
            {project.is_password_protected ? (
              <span
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-border p-1.5 text-muted-foreground"
                aria-label="Password protected"
                title="Password protected"
              >
                <Lock className="h-3 w-3" />
              </span>
            ) : null}
          </div>
          {statusLabel ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
              {statusLabel}
              <ArrowUpRight className="h-3 w-3" />
            </span>
          ) : null}
        </div>

        {project.summary ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-description">
            {project.summary}
          </p>
        ) : null}

        {metadata ? (
          <p className="text-sm font-bold text-foreground">{metadata}</p>
        ) : null}
      </div>
    </Link>
  );
}
