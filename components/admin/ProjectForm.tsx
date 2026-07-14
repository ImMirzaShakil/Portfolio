"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PasswordField } from "@/components/admin/PasswordField";
import {
  SectionBuilder,
  type SectionFormItem,
} from "@/components/admin/SectionBuilder";
import { SeoPlatformFieldsEditor } from "@/components/admin/SeoPlatformFieldsEditor";
import { AdminCollapsibleSection } from "@/components/admin/AdminCollapsibleSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveProjectAction } from "@/app/admin/projects/actions";
import {
  normalizeMediaUrls,
  normalizeSectionItems,
} from "@/lib/project-sections";
import {
  normalizePagePlatformSeo,
  type PagePlatformSeo,
} from "@/lib/seo";
import type { Project, ProjectSection, ProjectStatusOption } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

interface ProjectFormProps {
  project?: Project | null;
  sections?: ProjectSection[];
  initialPassword?: string;
  statusOptions?: ProjectStatusOption[];
}

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

function mapSectionsToForm(sections: ProjectSection[]): SectionFormItem[] {
  return sections.map((section) => ({
    clientId: section.id,
    section_type: section.section_type,
    title: section.title ?? "",
    content: section.content ?? "",
    image_url: section.image_url,
    video_url: section.video_url,
    layout: section.layout || "grid-2",
    media_urls: normalizeMediaUrls(section.media_urls),
    items: normalizeSectionItems(section.items),
  }));
}

export function ProjectForm({
  project,
  sections = [],
  initialPassword = "",
  statusOptions = [],
}: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(project?.id);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project?.slug));
  const [subtitle, setSubtitle] = useState(project?.subtitle ?? "");
  const [statusId, setStatusId] = useState(project?.status_id ?? "");
  const [company, setCompany] = useState(project?.company ?? "");
  const [type, setType] = useState(project?.type ?? "");
  const [year, setYear] = useState(project?.year ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    project?.cover_image_url ?? null
  );
  const [isPublished, setIsPublished] = useState(project?.is_published ?? false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    project?.is_password_protected ?? false
  );
  const [password, setPassword] = useState(initialPassword);
  const [orderIndex, setOrderIndex] = useState(
    project?.order_index?.toString() ?? "0"
  );
  const [sectionItems, setSectionItems] = useState<SectionFormItem[]>(
    mapSectionsToForm(sections)
  );
  const [seo, setSeo] = useState<PagePlatformSeo>(() =>
    normalizePagePlatformSeo(project?.seo)
  );
  const [showShareButton, setShowShareButton] = useState(
    project?.show_share_button !== false
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

    if (isPasswordProtected && !password.trim() && !initialPassword) {
      setSaving(false);
      setError("Set a password when enabling protection.");
      return;
    }

    const result = await saveProjectAction({
      id: project?.id,
      title,
      slug,
      subtitle,
      status_id: statusId,
      company,
      type,
      year,
      summary,
      cover_image_url: coverImageUrl,
      is_published: isPublished,
      is_password_protected: isPasswordProtected,
      password,
      order_index: Number.isNaN(parsedOrderIndex) ? 0 : parsedOrderIndex,
      sections: sectionItems.map((section) => ({
        section_type: section.section_type,
        title: section.title,
        content: section.content,
        image_url: section.image_url,
        video_url: section.video_url,
        layout: section.layout || null,
        media_urls: section.media_urls.filter((url) => url.trim().length > 0),
        items: section.items,
      })),
      seo,
      show_share_button: showShareButton,
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
            ? "Update case study details and rich content sections."
            : "Create a portfolio case study with flexible Menti-style sections."}
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
            placeholder="Menti"
          />
          <FieldHint>
            Project name shown on cards and as the case study H1.
          </FieldHint>
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
          <FieldHint>
            URL path segment. Preview: /projects/{slug || "your-project-slug"}
          </FieldHint>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            placeholder="Class project — a platform for designers to practice interviews…"
          />
          <FieldHint>
            One-line pitch under the title on the case study page.
          </FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={statusId}
            onChange={(event) => setStatusId(event.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">None (hide badge)</option>
            {statusOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldHint>
            Optional badge on project cards (Shipped, WIP…). Manage the list
            under Projects → Manage statuses. Default is hidden.
          </FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="2022"
          />
          <FieldHint>Shown in project card metadata.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company / context</Label>
          <Input
            id="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Side project"
          />
          <FieldHint>
            Organization or context (Meta, Side project, Class…).
          </FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            placeholder="Case study"
          />
          <FieldHint>
            Work type label — Case study, Product, Exploration, etc.
          </FieldHint>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="summary">Summary / intro blurb</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={4}
            placeholder="For a class during grad school, we designed and coded…"
          />
          <FieldHint>
            Longer intro under the subtitle. Also used as the card excerpt and
            SEO description fallback.
          </FieldHint>
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            label="Cover image"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            requirementsKind="project-cover"
          />
          <FieldHint>
            Hero / card thumbnail. Full-bleed on the case study top. GIF works
            on cards.
          </FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-index">Order index</Label>
          <Input
            id="order-index"
            type="number"
            value={orderIndex}
            onChange={(event) => setOrderIndex(event.target.value)}
          />
          <FieldHint>
            Lower numbers appear first on Home / Work. Use 0, 1, 2…
          </FieldHint>
        </div>

        <div className="flex items-start gap-3 pt-2">
          <Switch
            checked={isPublished}
            onCheckedChange={setIsPublished}
            aria-label="Published"
          />
          <div className="space-y-1">
            <Label>Published</Label>
            <FieldHint>
              Off = draft (admin only). On = visible on the public site when not
              password-locked.
            </FieldHint>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border p-5 md:col-span-2">
          <div className="flex items-start gap-3">
            <Switch
              checked={isPasswordProtected}
              onCheckedChange={setIsPasswordProtected}
              aria-label="Password protected"
            />
            <div>
              <Label>Password protected</Label>
              <FieldHint>
                Visitors must enter a password to open this case study, including
                direct links.
              </FieldHint>
            </div>
          </div>

          {isPasswordProtected ? (
            <div className="space-y-2">
              <Label htmlFor="project-password">Password</Label>
              <PasswordField
                id="project-password"
                value={password}
                onChange={setPassword}
                placeholder="Set a password"
              />
              <FieldHint>
                Use the eye icon to show/hide, and copy to share with clients.
              </FieldHint>
            </div>
          ) : null}
        </div>
      </div>

      <AdminCollapsibleSection
        title="SEO & social metadata"
        description="Customize how this project appears in Google and when shared on social platforms. Blank fields use the project title, summary/subtitle, and cover image."
        defaultOpen={false}
      >
        <div className="flex items-start gap-3 rounded-xl border border-border p-4">
          <Switch
            checked={showShareButton}
            onCheckedChange={setShowShareButton}
            aria-label="Show share button"
          />
          <div className="space-y-1">
            <Label>Show share button on project cards</Label>
            <FieldHint>
              Displays a share icon on Home / Work cards so visitors can share
              this project link.
            </FieldHint>
          </div>
        </div>

        <SeoPlatformFieldsEditor
          value={seo}
          onChange={setSeo}
          placeholders={{
            title: title || "Project title",
            description:
              summary || subtitle || "Project summary / subtitle",
            image_url: coverImageUrl
              ? "cover image"
              : "cover image (none set yet)",
          }}
        />
      </AdminCollapsibleSection>

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
