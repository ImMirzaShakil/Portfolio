"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  SectionBuilder,
  type SectionFormItem,
} from "@/components/admin/SectionBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveProjectAction } from "@/app/admin/projects/actions";
import type { Project, ProjectSection, ProjectStatus } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

const statusOptions: Array<ProjectStatus | ""> = [
  "",
  "SHIPPED",
  "ACQUIRED",
  "WIP",
  "CONCEPT",
];

interface ProjectFormProps {
  project?: Project | null;
  sections?: ProjectSection[];
}

function mapSectionsToForm(sections: ProjectSection[]): SectionFormItem[] {
  return sections.map((section) => ({
    clientId: section.id,
    section_type: section.section_type,
    title: section.title ?? "",
    content: section.content ?? "",
    image_url: section.image_url,
  }));
}

export function ProjectForm({
  project,
  sections = [],
}: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(project?.id);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project?.slug));
  const [subtitle, setSubtitle] = useState(project?.subtitle ?? "");
  const [status, setStatus] = useState<ProjectStatus | "">(project?.status ?? "");
  const [company, setCompany] = useState(project?.company ?? "");
  const [type, setType] = useState(project?.type ?? "");
  const [year, setYear] = useState(project?.year ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    project?.cover_image_url ?? null
  );
  const [isPublished, setIsPublished] = useState(project?.is_published ?? false);
  const [orderIndex, setOrderIndex] = useState(
    project?.order_index?.toString() ?? "0"
  );
  const [sectionItems, setSectionItems] = useState<SectionFormItem[]>(
    mapSectionsToForm(sections)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slugTouched) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const parsedOrderIndex = Number.parseInt(orderIndex, 10);
    const result = await saveProjectAction({
      id: project?.id,
      title,
      slug,
      subtitle,
      status,
      company,
      type,
      year,
      summary,
      cover_image_url: coverImageUrl,
      is_published: isPublished,
      order_index: Number.isNaN(parsedOrderIndex) ? 0 : parsedOrderIndex,
      sections: sectionItems,
    });

    if (result.error) {
      setSaving(false);
      setError(result.error);
      return;
    }

    setSaving(false);
    toast.success(isEditing ? "Project updated." : "Project created.");
    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit project" : "New project"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update case study details and content sections."
            : "Create a new portfolio case study."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
          />
          <p className="text-sm text-muted-foreground">
            Preview: /projects/{slug || "your-project-slug"}
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectStatus | "")
            }
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {statusOptions.map((option) => (
              <option key={option || "none"} value={option}>
                {option || "None (hide badge)"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            placeholder="Case study"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={4}
          />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            label="Cover image"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-index">Order index</Label>
          <Input
            id="order-index"
            type="number"
            value={orderIndex}
            onChange={(event) => setOrderIndex(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            checked={isPublished}
            onCheckedChange={setIsPublished}
            aria-label="Published"
          />
          <Label>Published</Label>
        </div>
      </div>

      <SectionBuilder sections={sectionItems} onChange={setSectionItems} />

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Save changes" : "Create project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
