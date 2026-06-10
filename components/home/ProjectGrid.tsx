import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Selected work</h2>
        <p className="text-muted-foreground">No published projects yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold">Selected work</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
