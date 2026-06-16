"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectPublishedAction,
} from "@/app/admin/projects/actions";
import type { Project } from "@/lib/types";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects: initialProjects }: ProjectsTableProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleFeaturedToggle = async (project: Project, checked: boolean) => {
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id ? { ...item, is_featured: checked } : item
      )
    );

    const { error } = await toggleProjectFeaturedAction(project.id, checked);

    if (error) {
      setProjects((current) =>
        current.map((item) =>
          item.id === project.id
            ? { ...item, is_featured: project.is_featured }
            : item
        )
      );
      return;
    }

    router.refresh();
  };

  const handlePublishedToggle = async (project: Project, checked: boolean) => {
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id ? { ...item, is_published: checked } : item
      )
    );

    const { error } = await toggleProjectPublishedAction(project.id, checked);

    if (error) {
      setProjects((current) =>
        current.map((item) =>
          item.id === project.id
            ? { ...item, is_published: project.is_published }
            : item
        )
      );
      return;
    }

    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const { error } = await deleteProjectAction(deleteTarget.id);
    setDeleting(false);

    if (error) {
      return;
    }

    setProjects((current) =>
      current.filter((item) => item.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
    router.refresh();
  };

  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        No projects yet. Create your first project to get started.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="relative size-14 overflow-hidden rounded-lg bg-muted">
                      {project.cover_image_url ? (
                        <Image
                          src={project.cover_image_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    {project.status ? (
                      <Badge variant="outline">{project.status}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <Switch
                        checked={project.is_published}
                        onCheckedChange={(checked) =>
                          handlePublishedToggle(project, checked)
                        }
                        aria-label={`Toggle published state for ${project.title}`}
                      />
                      <span
                        className={
                          project.is_published
                            ? "text-sm font-medium text-foreground"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {project.is_published ? "Published" : "Draft"}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <Switch
                        checked={project.is_featured}
                        onCheckedChange={(checked) =>
                          handleFeaturedToggle(project, checked)
                        }
                        aria-label={`Toggle featured state for ${project.title}`}
                      />
                      <span
                        className={
                          project.is_featured
                            ? "text-sm font-medium text-foreground"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {project.is_featured ? "Featured" : "Hidden"}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.year ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(project)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.title}
              </span>{" "}
              and all of its case study sections.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
