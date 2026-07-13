"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createEmptySectionItem,
  FEATURE_LAYOUT_OPTIONS,
  getSectionTypeConfig,
  SECTION_TYPE_CONFIG,
  type FeatureLayout,
  type ProjectSectionType,
  type SectionListItem,
} from "@/lib/project-sections";
import { cn } from "@/lib/utils";

export interface SectionFormItem {
  clientId: string;
  section_type: ProjectSectionType | string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  layout: string;
  media_urls: string[];
  items: SectionListItem[];
}

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
    video_url: null,
    layout: "grid-2",
    media_urls: [],
    items: [],
  };
}

function FieldHint({ children }: { children: string }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

export function SectionBuilder({ sections, onChange }: SectionBuilderProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  const moveSectionTo = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= sections.length ||
      toIndex >= sections.length
    ) {
      return;
    }

    const next = [...sections];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    moveSectionTo(index, direction === "up" ? index - 1 : index + 1);
  };

  const handleTypeChange = (clientId: string, nextType: string) => {
    const config = getSectionTypeConfig(nextType);
    const section = sections.find((item) => item.clientId === clientId);
    if (!section) return;

    updateSection(clientId, {
      section_type: nextType,
      items:
        config.supportsItems && section.items.length === 0
          ? [createEmptySectionItem(config.itemKind)]
          : section.items,
      media_urls: config.supportsMediaGallery ? section.media_urls : [],
      layout: config.supportsMediaGallery
        ? section.layout || "grid-2"
        : section.layout,
      image_url: config.supportsImage ? section.image_url : null,
      video_url: config.supportsVideo ? section.video_url : null,
    });
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<SectionListItem>
  ) => {
    const section = sections.find((item) => item.clientId === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      items: section.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  const addItem = (sectionId: string, kind: "process" | "stats") => {
    const section = sections.find((item) => item.clientId === sectionId);
    if (!section) return;
    updateSection(sectionId, {
      items: [...section.items, createEmptySectionItem(kind)],
    });
  };

  const removeItem = (sectionId: string, itemId: string) => {
    const section = sections.find((item) => item.clientId === sectionId);
    if (!section) return;
    updateSection(sectionId, {
      items: section.items.filter((item) => item.id !== itemId),
    });
  };

  const updateMediaUrl = (
    sectionId: string,
    index: number,
    url: string | null
  ) => {
    const section = sections.find((item) => item.clientId === sectionId);
    if (!section) return;

    const next = [...section.media_urls];
    if (!url) {
      next.splice(index, 1);
    } else {
      next[index] = url;
    }
    updateSection(sectionId, { media_urls: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Case study sections</h2>
          <FieldHint>
            Build the page top-to-bottom. Drag the handle, use Up/Down, or pick
            a position to reorder. Include Custom HTML for one-off layouts.
          </FieldHint>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...sections, createEmptySection()])}
        >
          Add section
        </Button>
      </div>

      {sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No sections yet. Start with Quick facts (Role, Time, Team…), then a
          Media hero, Process timeline, Research stats, Feature showcase, or
          Custom HTML blocks.
        </p>
      ) : null}

      {sections.map((section, index) => {
        const config = getSectionTypeConfig(section.section_type);
        const isHtml = Boolean(config.supportsHtml);
        const isDragging = draggingId === section.clientId;
        const isDragOver =
          dragOverId === section.clientId && draggingId !== section.clientId;

        return (
          <div
            key={section.clientId}
            draggable={false}
            onDragOver={(event) => {
              event.preventDefault();
              if (draggingId && draggingId !== section.clientId) {
                setDragOverId(section.clientId);
              }
            }}
            onDragLeave={() => {
              if (dragOverId === section.clientId) {
                setDragOverId(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!draggingId) return;
              const fromIndex = sections.findIndex(
                (item) => item.clientId === draggingId
              );
              moveSectionTo(fromIndex, index);
              setDraggingId(null);
              setDragOverId(null);
            }}
            className={cn(
              "space-y-4 rounded-2xl border bg-card p-6 transition-colors",
              isDragOver
                ? "border-foreground border-dashed"
                : "border-border",
              isDragging && "opacity-60"
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", section.clientId);
                    setDraggingId(section.clientId);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDragOverId(null);
                  }}
                  className="mt-0.5 inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted active:cursor-grabbing"
                  aria-label={`Drag to reorder section ${index + 1}`}
                  title="Drag to reorder"
                >
                  <GripVertical className="size-4" />
                </button>
                <div className="min-w-0">
                  <p className="font-medium">
                    Section {index + 1}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      · {config.label}
                    </span>
                  </p>
                  <FieldHint>{config.description}</FieldHint>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveSection(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="size-4" />
                  Up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveSection(index, "down")}
                  disabled={index === sections.length - 1}
                >
                  <ArrowDown className="size-4" />
                  Down
                </Button>
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="whitespace-nowrap">Move to</span>
                  <select
                    value={index}
                    onChange={(event) =>
                      moveSectionTo(index, Number(event.target.value))
                    }
                    className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label={`Move section ${index + 1} to position`}
                  >
                    {sections.map((_, position) => (
                      <option key={position} value={position}>
                        #{position + 1}
                      </option>
                    ))}
                  </select>
                </label>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSection(section.clientId)}
                >
                  <Trash2 className="size-4" />
                  Delete
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
                    handleTypeChange(section.clientId, event.target.value)
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {SECTION_TYPE_CONFIG.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`section-title-${section.clientId}`}>
                  {section.section_type === "quickfact"
                    ? "Fact label"
                    : section.section_type === "feature"
                      ? "Feature title / eyebrow"
                      : isHtml
                        ? "Optional title"
                        : "Title"}
                </Label>
                <Input
                  id={`section-title-${section.clientId}`}
                  value={section.title}
                  onChange={(event) =>
                    updateSection(section.clientId, {
                      title: event.target.value,
                    })
                  }
                  placeholder={
                    section.section_type === "quickfact"
                      ? "Role"
                      : section.section_type === "feature"
                        ? "Feature #1 — Mentorship"
                        : isHtml
                          ? "Leave blank if the HTML includes its own heading"
                          : "Section heading"
                  }
                />
                <FieldHint>
                  {section.section_type === "quickfact"
                    ? "Short label shown above the value (Role, Time, Team, Problem…)."
                    : section.section_type === "feature"
                      ? "Shown as the feature heading. Use “Feature #1 Mentorship” style."
                      : isHtml
                        ? "Optional. If set, shown above your HTML as an H2."
                        : "Main heading for this block on the public page."}
                </FieldHint>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`section-content-${section.clientId}`}>
                {section.section_type === "quickfact"
                  ? "Fact value"
                  : isHtml
                    ? "HTML content"
                    : "Content"}
              </Label>
              <Textarea
                id={`section-content-${section.clientId}`}
                value={section.content}
                onChange={(event) =>
                  updateSection(section.clientId, {
                    content: event.target.value,
                  })
                }
                rows={isHtml ? 12 : section.section_type === "quickfact" ? 2 : 5}
                className={cn(isHtml && "font-mono text-xs leading-relaxed")}
                placeholder={
                  section.section_type === "quickfact"
                    ? "Product designer & developer"
                    : isHtml
                      ? `<div class="my-block">\n  <p>Custom markup here…</p>\n</div>`
                      : "Write the body copy. Separate paragraphs with a blank line."
                }
              />
              <FieldHint>
                {section.section_type === "quickfact"
                  ? "The value under the label in the Quick Facts bar."
                  : isHtml
                    ? "Rendered as HTML on the live page. Scripts and inline event handlers are stripped for safety. You can use tags like div, p, img, a, ul, table, iframe."
                    : "Body text for this section. Blank lines split into paragraphs."}
              </FieldHint>
            </div>

            {config.supportsItems && config.itemKind === "process" ? (
              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Timeline steps</p>
                    <FieldHint>
                      Numbered phases like Week 1 / Research & Design. Label =
                      number or short tag, Title = step name, Description =
                      details.
                    </FieldHint>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(section.clientId, "process")}
                  >
                    Add step
                  </Button>
                </div>
                {section.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[100px_1fr_auto]"
                  >
                    <div className="space-y-1.5">
                      <Label>Label</Label>
                      <Input
                        value={item.label}
                        onChange={(event) =>
                          updateItem(section.clientId, item.id, {
                            label: event.target.value,
                          })
                        }
                        placeholder={String(itemIndex + 1).padStart(2, "0")}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label>Step title</Label>
                        <Input
                          value={item.title}
                          onChange={(event) =>
                            updateItem(section.clientId, item.id, {
                              title: event.target.value,
                            })
                          }
                          placeholder="Week 1 — Research & Design"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(event) =>
                            updateItem(section.clientId, item.id, {
                              description: event.target.value,
                            })
                          }
                          rows={2}
                          placeholder="What happened in this phase…"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeItem(section.clientId, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {config.supportsItems && config.itemKind === "stats" ? (
              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Stat callouts</p>
                    <FieldHint>
                      Big number/value, short headline, and supporting sentence
                      (e.g. 87% — of survey takers ask friends for help…).
                    </FieldHint>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(section.clientId, "stats")}
                  >
                    Add stat
                  </Button>
                </div>
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="space-y-1.5">
                      <Label>Value</Label>
                      <Input
                        value={item.label}
                        onChange={(event) =>
                          updateItem(section.clientId, item.id, {
                            label: event.target.value,
                          })
                        }
                        placeholder="87%"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label>Headline</Label>
                        <Input
                          value={item.title}
                          onChange={(event) =>
                            updateItem(section.clientId, item.id, {
                              title: event.target.value,
                            })
                          }
                          placeholder="of survey takers ask friends for help"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Details</Label>
                        <Textarea
                          value={item.description}
                          onChange={(event) =>
                            updateItem(section.clientId, item.id, {
                              description: event.target.value,
                            })
                          }
                          rows={2}
                          placeholder="Extra context for this finding…"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeItem(section.clientId, item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {config.supportsMediaGallery ? (
              <div className="space-y-4 rounded-xl border border-border p-4">
                <div className="space-y-2">
                  <Label htmlFor={`layout-${section.clientId}`}>
                    Image layout
                  </Label>
                  <select
                    id={`layout-${section.clientId}`}
                    value={section.layout || "grid-2"}
                    onChange={(event) =>
                      updateSection(section.clientId, {
                        layout: event.target.value as FeatureLayout,
                      })
                    }
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:max-w-xs"
                  >
                    {FEATURE_LAYOUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldHint>
                    {FEATURE_LAYOUT_OPTIONS.find(
                      (option) => option.value === (section.layout || "grid-2")
                    )?.description ?? "Choose how feature images are arranged."}
                  </FieldHint>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Feature images</p>
                      <FieldHint>
                        Upload 1–4 screenshots or mockups for this feature.
                      </FieldHint>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateSection(section.clientId, {
                          media_urls: [...section.media_urls, ""],
                        })
                      }
                    >
                      Add image slot
                    </Button>
                  </div>

                  {section.media_urls.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No images yet. Add slots, then upload into each one.
                    </p>
                  ) : null}

                  {section.media_urls.map((url, mediaIndex) => (
                    <div
                      key={`${section.clientId}-media-${mediaIndex}`}
                      className="rounded-lg border border-border p-3"
                    >
                      <ImageUpload
                        label={`Image ${mediaIndex + 1}`}
                        value={url || null}
                        onChange={(nextUrl) =>
                          updateMediaUrl(
                            section.clientId,
                            mediaIndex,
                            nextUrl
                          )
                        }
                        requirementsKind="image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {config.supportsImage ? (
              <ImageUpload
                label={
                  section.section_type === "media-hero" ||
                  section.section_type === "video"
                    ? "Poster / background image"
                    : "Section image"
                }
                value={section.image_url}
                onChange={(url) =>
                  updateSection(section.clientId, { image_url: url })
                }
                requirementsKind="image"
              />
            ) : null}

            {config.supportsVideo ? (
              <VideoUpload
                label="Section video"
                value={section.video_url}
                onChange={(url) =>
                  updateSection(section.clientId, { video_url: url })
                }
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
