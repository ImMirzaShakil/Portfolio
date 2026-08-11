"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminCollapsibleSection } from "@/components/admin/AdminCollapsibleSection";
import { BlocksEditor } from "@/components/admin/blocks/BlocksEditor";
import { CanvasEditorClient } from "@/components/admin/canvas/CanvasEditorClient";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteSectionTemplateAction,
  listSectionTemplatesAction,
  saveSectionTemplateAction,
} from "@/app/admin/section-templates/actions";
import {
  createEmptyBlocksDocument,
  normalizeBlocksDocument,
  type BlocksDocument,
} from "@/lib/blocks-document";
import {
  createEmptyCanvasDocument,
  documentFromTemplate,
  normalizeCanvasDocument,
  type CanvasDocument,
} from "@/lib/canvas-document";
import {
  createEmptySectionItem,
  FEATURE_LAYOUT_OPTIONS,
  getSectionTypeConfig,
  isHtmlSectionContent,
  normalizeContentFormat,
  SECTION_TYPE_CONFIG,
  type FeatureLayout,
  type ProjectSectionType,
  type SectionContentFormat,
  type SectionListItem,
} from "@/lib/project-sections";
import type { SectionTemplate } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface SectionFormItem {
  clientId: string;
  section_type: ProjectSectionType | string;
  title: string;
  content: string;
  content_format: SectionContentFormat;
  image_url: string | null;
  video_url: string | null;
  layout: string;
  media_urls: string[];
  items: SectionListItem[];
  canvas_data: CanvasDocument | null;
  blocks_data: BlocksDocument | null;
}

interface SectionBuilderProps {
  sections: SectionFormItem[];
  onChange: (sections: SectionFormItem[]) => void;
}

function createEmptySection(
  overrides?: Partial<SectionFormItem>
): SectionFormItem {
  return {
    clientId: crypto.randomUUID(),
    section_type: "overview",
    title: "",
    content: "",
    content_format: "text",
    image_url: null,
    video_url: null,
    layout: "feature-split-grid-2",
    media_urls: [],
    items: [],
    canvas_data: null,
    blocks_data: null,
    ...overrides,
  };
}

function FieldHint({ children }: { children: string }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

const TEMPLATE_PREFIX = "template:";

export function SectionBuilder({ sections, onChange }: SectionBuilderProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [templates, setTemplates] = useState<SectionTemplate[]>([]);
  const [savingTemplateId, setSavingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await listSectionTemplatesAction();
      if (!cancelled && !result.error) {
        setTemplates(result.templates);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    setExpandedIds((prev) => {
      if (!prev.has(clientId)) return prev;
      const next = new Set(prev);
      next.delete(clientId);
      return next;
    });
  };

  const addSection = () => {
    const next = createEmptySection();
    onChange([...sections, next]);
    setExpandedIds((prev) => new Set(prev).add(next.clientId));
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

  const handleTypeChange = (clientId: string, nextValue: string) => {
    const section = sections.find((item) => item.clientId === clientId);
    if (!section) return;

    if (nextValue.startsWith(TEMPLATE_PREFIX)) {
      const templateId = nextValue.slice(TEMPLATE_PREFIX.length);
      const template = templates.find((item) => item.id === templateId);
      if (!template) return;
      updateSection(clientId, {
        section_type: "canvas",
        title: template.name,
        content: "",
        content_format: "text",
        canvas_data: documentFromTemplate(template),
        blocks_data: null,
        image_url: null,
        video_url: null,
        media_urls: [],
        items: [],
      });
      return;
    }

    const config = getSectionTypeConfig(nextValue);
    updateSection(clientId, {
      section_type: nextValue,
      content_format: normalizeContentFormat(
        nextValue === "html" ? "html" : section.content_format,
        nextValue
      ),
      items:
        config.supportsItems && section.items.length === 0
          ? [createEmptySectionItem(config.itemKind)]
          : section.items,
      media_urls: config.supportsMediaGallery ? section.media_urls : [],
      layout: config.supportsMediaGallery
        ? section.layout || "feature-split-grid-2"
        : section.layout,
      image_url: config.supportsImage ? section.image_url : null,
      video_url: config.supportsVideo ? section.video_url : null,
      canvas_data:
        nextValue === "canvas"
          ? section.canvas_data ?? createEmptyCanvasDocument()
          : null,
      blocks_data:
        nextValue === "blocks"
          ? section.blocks_data ?? createEmptyBlocksDocument()
          : null,
    });
  };

  const handleSaveTemplate = async (clientId: string, doc: CanvasDocument) => {
    const name = window.prompt("Template name");
    if (!name?.trim()) return;

    setSavingTemplateId(clientId);
    const result = await saveSectionTemplateAction({
      name: name.trim(),
      document: doc,
    });
    setSavingTemplateId(null);

    if (result.error || !result.template) {
      toast.error(result.error ?? "Failed to save template.");
      return;
    }

    setTemplates((prev) => [result.template!, ...prev]);
    updateSection(clientId, {
      canvas_data: {
        ...normalizeCanvasDocument(doc),
        templateId: result.template.id,
      },
    });
    toast.success("Template saved. It will appear in the section type list.");
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm("Delete this template?")) return;
    const result = await deleteSectionTemplateAction(templateId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setTemplates((prev) => prev.filter((item) => item.id !== templateId));
    toast.success("Template deleted.");
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

  const setSectionExpanded = (clientId: string, open: boolean) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (open) {
        next.add(clientId);
      } else {
        next.delete(clientId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Case study sections</h2>
        <FieldHint>
          Build the page top-to-bottom. Drag the handle, use Up/Down, or pick a
          position to reorder. Use Canvas design for free-layout slides, or
          Custom HTML for one-off markup.
        </FieldHint>
      </div>

      {templates.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border p-3">
          <p className="text-sm font-medium">Saved canvas templates</p>
          {templates.map((template) => (
            <span
              key={template.id}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs"
            >
              {template.name}
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => void handleDeleteTemplate(template.id)}
                aria-label={`Delete template ${template.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No sections yet. Start with Blocks, Canvas design, Quick facts, Media
          hero, or Custom HTML.
        </p>
      ) : null}

      {sections.map((section, index) => {
        const config = getSectionTypeConfig(section.section_type);
        const isDedicatedHtml = section.section_type === "html";
        const isCanvas = section.section_type === "canvas";
        const isBlocks = section.section_type === "blocks";
        const isSpecialLayout = isCanvas || isBlocks;
        const isHtml = isHtmlSectionContent(
          section.section_type,
          section.content_format
        );
        const isDragging = draggingId === section.clientId;
        const isDragOver =
          dragOverId === section.clientId && draggingId !== section.clientId;
        const isExpanded = expandedIds.has(section.clientId);

        return (
          <div
            key={section.clientId}
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
            className={cn(isDragging && "opacity-60")}
          >
            <AdminCollapsibleSection
              title={`Section ${index + 1} · ${config.label}`}
              description={config.description}
              open={isExpanded}
              onOpenChange={(open) =>
                setSectionExpanded(section.clientId, open)
              }
              className={cn(isDragOver && "border-dashed border-foreground")}
              leading={
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
                  className="inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted active:cursor-grabbing"
                  aria-label={`Drag to reorder section ${index + 1}`}
                  title="Drag to reorder"
                >
                  <GripVertical className="size-4" />
                </button>
              }
              headerExtra={
                <>
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
                </>
              }
            >
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
                    {templates.length > 0 ? (
                      <optgroup label="Canvas templates">
                        {templates.map((template) => (
                          <option
                            key={template.id}
                            value={`${TEMPLATE_PREFIX}${template.id}`}
                          >
                            Template: {template.name}
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-title-${section.clientId}`}>
                    {isSpecialLayout
                      ? "Optional section title"
                      : section.section_type === "quickfact"
                        ? "Fact label"
                        : section.section_type === "feature"
                          ? "Feature title / eyebrow"
                          : isDedicatedHtml
                            ? "Optional title"
                            : "Title"}
                  </Label>
                  {section.section_type === "feature" ? (
                    <Textarea
                      id={`section-title-${section.clientId}`}
                      value={section.title}
                      onChange={(event) =>
                        updateSection(section.clientId, {
                          title: event.target.value,
                        })
                      }
                      rows={2}
                      placeholder={"Feature #1\nDigital waivers"}
                    />
                  ) : (
                    <Input
                      id={`section-title-${section.clientId}`}
                      value={section.title}
                      onChange={(event) =>
                        updateSection(section.clientId, {
                          title: event.target.value,
                        })
                      }
                      placeholder={
                        isSpecialLayout
                          ? "Shown above this section on the public page"
                          : section.section_type === "quickfact"
                            ? "Role"
                            : isDedicatedHtml
                              ? "Leave blank if the HTML includes its own heading"
                              : "Section heading"
                      }
                    />
                  )}
                </div>
              </div>

              {isCanvas ? (
                <CanvasEditorClient
                  value={section.canvas_data ?? createEmptyCanvasDocument()}
                  onChange={(doc) =>
                    updateSection(section.clientId, { canvas_data: doc })
                  }
                  onSaveTemplate={(doc) =>
                    handleSaveTemplate(section.clientId, doc)
                  }
                  savingTemplate={savingTemplateId === section.clientId}
                />
              ) : isBlocks ? (
                <BlocksEditor
                  value={
                    section.blocks_data ?? createEmptyBlocksDocument()
                  }
                  onChange={(doc) =>
                    updateSection(section.clientId, {
                      blocks_data: normalizeBlocksDocument(doc),
                    })
                  }
                />
              ) : (
                <>
                  <div className="space-y-2">
                    {isDedicatedHtml ? (
                      <Label htmlFor={`section-content-${section.clientId}`}>
                        HTML content
                      </Label>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(section.clientId, {
                              content_format: "text",
                            })
                          }
                          className={cn(
                            "text-sm transition-colors",
                            !isHtml
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {section.section_type === "quickfact"
                            ? "Fact value"
                            : "Content"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(section.clientId, {
                              content_format: "html",
                            })
                          }
                          className={cn(
                            "text-sm transition-colors",
                            isHtml
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Custom HTML
                        </button>
                      </div>
                    )}
                    <Textarea
                      id={`section-content-${section.clientId}`}
                      value={section.content}
                      onChange={(event) =>
                        updateSection(section.clientId, {
                          content: event.target.value,
                        })
                      }
                      rows={
                        isHtml
                          ? 12
                          : section.section_type === "quickfact"
                            ? 2
                            : 5
                      }
                      className={cn(
                        isHtml && "font-mono text-xs leading-relaxed"
                      )}
                      placeholder={
                        section.section_type === "quickfact" && !isHtml
                          ? "Product designer & developer"
                          : isHtml
                            ? `<div class="my-block">\n  <p>Custom markup here…</p>\n</div>`
                            : "Write the body copy. Separate paragraphs with a blank line."
                      }
                    />
                    <FieldHint>
                      {section.section_type === "quickfact" && !isHtml
                        ? "Value shown under the label in the Quick facts row on the case study page."
                        : section.section_type === "feature" && !isHtml
                          ? "Right-column body copy for split layouts (or full-width text for stacked layouts)."
                          : isHtml
                            ? "Rendered as HTML on the live page. Scripts and inline event handlers are stripped for safety."
                            : "Body text for this section. Blank lines split into paragraphs."}
                    </FieldHint>
                  </div>

                  {config.supportsItems && config.itemKind === "process" ? (
                    <div className="space-y-3 rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">Timeline steps</p>
                          <FieldHint>
                            Numbered phases like Week 1 / Research & Design.
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
                              placeholder={String(itemIndex + 1).padStart(
                                2,
                                "0"
                              )}
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
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              removeItem(section.clientId, item.id)
                            }
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
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              removeItem(section.clientId, item.id)
                            }
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
                          Text + image layout
                        </Label>
                        <select
                          id={`layout-${section.clientId}`}
                          value={section.layout || "feature-split-grid-2"}
                          onChange={(event) =>
                            updateSection(section.clientId, {
                              layout: event.target.value as FeatureLayout,
                            })
                          }
                          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:max-w-md"
                        >
                          {FEATURE_LAYOUT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">Feature images</p>
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
                </>
              )}
            </AdminCollapsibleSection>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={addSection}>
        Add section
      </Button>
    </div>
  );
}
