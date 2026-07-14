"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  normalizeSharedSeo,
  tagsToInputValue,
  type SharedSeoFields,
} from "@/lib/seo";

interface SeoFieldsEditorProps {
  value?: SharedSeoFields | null;
  onChange: (value: SharedSeoFields) => void;
  placeholders?: {
    title?: string;
    description?: string;
    image_url?: string;
  };
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

export function SeoFieldsEditor({
  value,
  onChange,
  placeholders,
}: SeoFieldsEditorProps) {
  const seo = normalizeSharedSeo(value);
  const [tagsInput, setTagsInput] = useState(() =>
    tagsToInputValue(normalizeSharedSeo(value).tags)
  );

  const update = (patch: Partial<SharedSeoFields>) => {
    onChange({
      ...seo,
      ...patch,
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        One title, description, image, and tags set is used everywhere — Google
        Search, Facebook, LinkedIn, Twitter/X, WhatsApp, and other link
        previews. Leave fields blank to use page/project defaults.
      </p>

      <div className="space-y-2">
        <Label htmlFor="seo-title">Meta title</Label>
        <Input
          id="seo-title"
          value={seo.title ?? ""}
          onChange={(event) => update({ title: event.target.value })}
          placeholder={placeholders?.title || "Use default title"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-description">Meta description</Label>
        <Textarea
          id="seo-description"
          value={seo.description ?? ""}
          onChange={(event) => update({ description: event.target.value })}
          rows={3}
          placeholder={placeholders?.description || "Use default description"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-tags">Tags</Label>
        <Input
          id="seo-tags"
          value={tagsInput}
          onChange={(event) => {
            const next = event.target.value;
            setTagsInput(next);
            update({
              tags: next
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            });
          }}
          placeholder="design, product, case study"
        />
        <FieldHint>
          Comma-separated keywords (e.g. UX, fintech, portfolio). Stored as SEO
          keywords meta tags.
        </FieldHint>
      </div>

      <div className="space-y-2">
        <ImageUpload
          label="Preview image"
          value={seo.image_url || null}
          onChange={(url) => update({ image_url: url })}
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
  );
}
