"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";

export interface SectionFormItem {
  clientId: string;
  section_type: string;
  title: string;
  content: string;
  image_url: string | null;
}

const sectionTypes = [
  "overview",
  "research",
  "insights",
  "problem",
  "solution",
  "testing",
  "outcome",
  "quickfact",
  "custom",
] as const;

interface SectionBuilderProps {
  sections: SectionFormItem[];
  onChange: (sections: SectionFormItem[]) => void;
}

function createEmptySection(): SectionFormItem {
  return {
    clientId: crypto.randomUUID(),
    section_type: "overview",
    title: "",
    content: "",
    image_url: null,
  };
}

export function SectionBuilder({ sections, onChange }: SectionBuilderProps) {
  const updateSection = (
    clientId: string,
    updates: Partial<SectionFormItem>
  ) => {
    onChange(
      sections.map((section) =>
        section.clientId === clientId ? { ...section, ...updates } : section
      )
    );
  };

  const removeSection = (clientId: string) => {
    onChange(sections.filter((section) => section.clientId !== clientId));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const next = [...sections];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Case study sections</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...sections, createEmptySection()])}
        >
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No sections yet. Add overview, quick facts, and supporting content blocks.
        </p>
      ) : null}

      {sections.map((section, index) => (
        <div
          key={section.clientId}
          className="space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium">Section {index + 1}</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => moveSection(index, "up")}
                disabled={index === 0}
                aria-label="Move section up"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => moveSection(index, "down")}
                disabled={index === sections.length - 1}
                aria-label="Move section down"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                onClick={() => removeSection(section.clientId)}
                aria-label="Delete section"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`section-type-${section.clientId}`}>
                Section type
              </Label>
              <select
                id={`section-type-${section.clientId}`}
                value={section.section_type}
                onChange={(event) =>
                  updateSection(section.clientId, {
                    section_type: event.target.value,
                  })
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {sectionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`section-title-${section.clientId}`}>Title</Label>
              <Input
                id={`section-title-${section.clientId}`}
                value={section.title}
                onChange={(event) =>
                  updateSection(section.clientId, { title: event.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`section-content-${section.clientId}`}>Content</Label>
            <Textarea
              id={`section-content-${section.clientId}`}
              value={section.content}
              onChange={(event) =>
                updateSection(section.clientId, { content: event.target.value })
              }
              rows={6}
            />
          </div>

          <ImageUpload
            label="Section image"
            value={section.image_url}
            onChange={(url) =>
              updateSection(section.clientId, { image_url: url })
            }
          />
        </div>
      ))}
    </div>
  );
}
