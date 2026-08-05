import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { ProjectShareButton } from "@/components/project/ProjectShareButton";
import { getProjectStatusLabel } from "@/lib/project-queries";
import { getThumbnailAspectRatio } from "@/lib/project-thumbnail";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

function formatMetadata(project: Project) {
  return [project.type, project.company, project.year]
    .filter(Boolean)
    .join(" · ");
}

function isGifUrl(url: string) {
  return url.split("?")[0].toLowerCase().endsWith(".gif");
}

export function ProjectCard({ project }: ProjectCardProps) {
  const metadata = formatMetadata(project);
  const statusLabel = getProjectStatusLabel(project);
  const showShare = project.show_share_button !== false;
  const projectPath = `/projects/${project.slug}`;
  const cardImageUrl =
    project.thumbnail_image_url?.trim() ||
    project.cover_image_url?.trim() ||
    null;
  const aspectRatio = getThumbnailAspectRatio(project.thumbnail_aspect_ratio);

  return (
    <div className="group relative">
      <Link
        href={`/projects/${project.slug}`}
        className="block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      >
        {cardImageUrl ? (
          <div
            className="relative overflow-hidden rounded-2xl bg-muted"
            style={{ aspectRatio }}
          >
            {isGifUrl(cardImageUrl) ? (
              // Plain <img> preserves GIF animation; Next.js Image strips it
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cardImageUrl}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <Image
                src={cardImageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl bg-muted"
            style={{ aspectRatio }}
          />
        )}

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

      {showShare ? (
        <div className="absolute right-3 top-3 z-10">
          <ProjectShareButton
            url={projectPath}
            title={project.title}
            summary={project.summary ?? project.subtitle}
          />
        </div>
      ) : null}
    </div>
  );
}
