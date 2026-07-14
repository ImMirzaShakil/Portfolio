"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SEO_PLATFORMS,
  type PagePlatformSeo,
  type PlatformSeoFields,
  type SeoPlatformId,
  normalizePagePlatformSeo,
} from "@/lib/seo";

interface SeoPlatformFieldsEditorProps {
  value?: PagePlatformSeo | null;
  onChange: (value: PagePlatformSeo) => void;
  /** Optional placeholders shown under empty fields (e.g. project title). */
  placeholders?: {
    title?: string;
    description?: string;
    image_url?: string;
  };
  /** Collapse to only Google by default when true; platforms start closed via details. */
  defaultOpenPlatform?: SeoPlatformId;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

export function SeoPlatformFieldsEditor({
  value,
  onChange,
  placeholders,
  defaultOpenPlatform = "google",
}: SeoPlatformFieldsEditorProps) {
  const seo = normalizePagePlatformSeo(value);

  const updatePlatform = (
    platformId: SeoPlatformId,
    patch: Partial<PlatformSeoFields>
  ) => {
    onChange({
      ...seo,
      [platformId]: {
        ...seo[platformId],
        ...patch,
      },
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Leave fields blank to use page/project defaults. Facebook, LinkedIn,
        WhatsApp, Instagram, and GitHub share Open Graph tags — fill the first
        one you care about, or customize several (priority: Facebook → LinkedIn →
        WhatsApp → Instagram → GitHub).
      </p>

      {SEO_PLATFORMS.map((platform) => {
        const fields = seo[platform.id] ?? {};
        const isScholar = platform.id === "google_scholar";

        return (
          <details
            key={platform.id}
            className="rounded-xl border border-border"
            open={platform.id === defaultOpenPlatform}
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>{platform.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Expand
                </span>
              </span>
            </summary>

            <div className="space-y-4 border-t border-border px-4 pb-4 pt-3">
              <FieldHint>{platform.hint}</FieldHint>

              <div className="space-y-2">
                <Label htmlFor={`seo-${platform.id}-title`}>Title</Label>
                <Input
                  id={`seo-${platform.id}-title`}
                  value={fields.title ?? ""}
                  onChange={(event) =>
                    updatePlatform(platform.id, { title: event.target.value })
                  }
                  placeholder={placeholders?.title || "Use default title"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`seo-${platform.id}-description`}>
                  Description
                </Label>
                <Textarea
                  id={`seo-${platform.id}-description`}
                  value={fields.description ?? ""}
                  onChange={(event) =>
                    updatePlatform(platform.id, {
                      description: event.target.value,
                    })
                  }
                  rows={3}
                  placeholder={
                    placeholders?.description || "Use default description"
                  }
                />
              </div>

              {isScholar ? (
                <div className="space-y-2">
                  <Label htmlFor={`seo-${platform.id}-author`}>
                    Citation author
                  </Label>
                  <Input
                    id={`seo-${platform.id}-author`}
                    value={fields.scholar_author ?? ""}
                    onChange={(event) =>
                      updatePlatform(platform.id, {
                        scholar_author: event.target.value,
                      })
                    }
                    placeholder="Author name for Google Scholar"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <ImageUpload
                  label={
                    isScholar ? "Preview image (optional)" : "Preview image"
                  }
                  value={fields.image_url || null}
                  onChange={(url) =>
                    updatePlatform(platform.id, { image_url: url })
                  }
                  requirementsKind="image"
                  previewClassName="aspect-[1.91/1] max-w-sm"
                />
                <FieldHint>
                  {placeholders?.image_url
                    ? `Blank = ${placeholders.image_url}`
                    : "Recommended ~1200×630 for social previews."}
                </FieldHint>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
