import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

function formatMetadata(project: Project) {
  return [project.company, project.type, project.year]
    .filter(Boolean)
    .join(" · ");
}

export function ProjectCard({ project }: ProjectCardProps) {
  const metadata = formatMetadata(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
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
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-tight text-foreground">
            {project.title}
          </h3>
          {project.status ? (
            <Badge variant="outline" className="shrink-0">
              {project.status}
            </Badge>
          ) : null}
        </div>

        {project.summary ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-description">
            {project.summary}
          </p>
        ) : null}

        {metadata ? (
          <p className="text-sm text-meta">{metadata}</p>
        ) : null}
      </div>
    </Link>
  );
}
