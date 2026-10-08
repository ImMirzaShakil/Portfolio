"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { StorySection } from "@/components/project/story/StorySection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createStoryListItem,
  createStoryMedia,
  isStorySplitBody,
  STORY_BAND_OPTIONS,
  STORY_BODY_OPTIONS,
  STORY_HEADER_OPTIONS,
  STORY_PRESETS,
  storyBodyAllowsVideo,
  storyBodyUsesCaptions,
  storyBodyUsesMedia,
  type StoryBody,
  type StoryDocument,
  type StoryHeader,
  type StoryListItem,
  type StoryMedia,
  type StoryMediaSide,
  type StoryPreset,
} from "@/lib/story-section";
import { cn } from "@/lib/utils";

interface StoryEditorProps {
  value: StoryDocument;
  onChange: (doc: StoryDocument) => void;
}

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

/** Tiny wireframe of a preset so picking a layout is visual. */
function PresetThumb({
  header,
  body,
  side = "left",
}: {
  header: StoryHeader;
  body: StoryBody;
  side?: StoryMediaSide;
}) {
  const bar = "rounded-[2px] bg-current";
  const box = "rounded-[2px] bg-current opacity-30";
  if (isStorySplitBody(body)) {
    const media = (
      <div className={cn(box, body === "split-half" ? "w-1/2" : "w-1/3")} />
    );
    const text = (
      <div className="flex-1 space-y-1 pt-1">
        <div className={cn(bar, "h-1.5 w-4/5")} />
        <div className={cn(bar, "h-1.5 w-3/5 opacity-50")} />
        <div className={cn(bar, "h-1 w-full opacity-50")} />
        <div className={cn(bar, "h-1 w-4/5 opacity-50")} />
      </div>
    );
    return (
      <div className="flex h-16 w-full gap-2 rounded-md bg-[#252525] p-2 text-white">
        {side === "left" ? media : text}
        {side === "left" ? text : media}
      </div>
    );
  }
  return (
    <div className="flex h-16 w-full flex-col gap-1 rounded-md bg-[#252525] p-2 text-white">
      {header === "horizontal" ? (
        <div className="flex gap-2">
          <div className="flex-1 space-y-0.5">
            <div className={cn(bar, "h-1.5 w-4/5")} />
            <div className={cn(bar, "h-1.5 w-3/5 opacity-50")} />
          </div>
          <div className="flex-1 space-y-0.5 opacity-50">
            <div className={cn(bar, "h-1 w-full")} />
            <div className={cn(bar, "h-1 w-4/5")} />
          </div>
        </div>
      ) : null}
      {header === "vertical" ? (
        <div className="flex flex-1 gap-2">
          <div className="w-2/5 space-y-0.5">
            <div className={cn(bar, "h-1.5 w-4/5")} />
            <div className={cn(bar, "h-1.5 w-3/5 opacity-50")} />
            <div className={cn(bar, "h-1 w-full opacity-50")} />
          </div>
          <div className="flex-1 space-y-1">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex gap-1">
                <div className={cn(bar, "h-1.5 w-2")} />
                <div className={cn(bar, "h-1.5 flex-1 opacity-50")} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {header === "statement" ? (
        <div className="space-y-1 pt-1">
          <div className={cn(bar, "h-1 w-1/4")} />
          <div className={cn(bar, "h-2 w-full opacity-50")} />
          <div className={cn(bar, "h-2 w-3/4 opacity-50")} />
        </div>
      ) : null}
      {header === "quote" ? (
        <div className="mx-auto w-3/4 space-y-1 pt-1">
          <div className="text-xs leading-none opacity-50">&ldquo;</div>
          <div className={cn(bar, "h-1.5 w-full opacity-50")} />
          <div className={cn(bar, "h-1 w-1/3")} />
        </div>
      ) : null}
      {body !== "none" ? (
        <div className="flex flex-1 gap-1">
          {body === "grid-2" || body === "before-after" || body === "compare" ? (
            <>
              <div className={cn(box, "flex-1")} />
              <div className={cn(box, "flex-1")} />
            </>
          ) : body === "grid-1-2" ? (
            <>
              <div className={cn(box, "w-1/3")} />
              <div className={cn(box, "flex-1")} />
            </>
          ) : body === "showcase" ? (
            <>
              <div className={cn(box, "w-3/4")} />
              <div className="flex-1 space-y-0.5 self-end">
                <div className={cn(bar, "h-1 w-full")} />
                <div className={cn(bar, "h-1 w-3/4 opacity-50")} />
              </div>
            </>
          ) : body === "marquee" ? (
            <>
              {[0, 1, 2, 3].map((cell) => (
                <div key={cell} className={cn(box, "w-1/3 shrink-0")} />
              ))}
            </>
          ) : body === "backdrop-video" ? (
            <div className="flex flex-1 items-center justify-center rounded-[2px] bg-gradient-to-br from-amber-300/60 to-sky-500/60">
              <div className="h-3/4 w-3/5 rounded-[2px] bg-white/70" />
            </div>
          ) : (
            <div className={cn(box, "flex-1")} />
          )}
        </div>
      ) : null}
    </div>
  );
}

export function StoryEditor({ value: doc, onChange }: StoryEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const update = (updates: Partial<StoryDocument>) =>
    onChange({ ...doc, ...updates });

  const applyPreset = (preset: StoryPreset) => {
    const isEmpty = !doc.top && !doc.bottom && !doc.text;
    const next: StoryDocument = {
      ...doc,
      header: preset.header,
      body: preset.body,
      ...(preset.side ? { mediaSide: preset.side } : {}),
      ...(isEmpty ? preset.sample : {}),
    };
    if (preset.header === "vertical" && doc.items.length === 0) {
      next.items =
        preset.id === "stats"
          ? [createStoryListItem("67%"), createStoryListItem("57%")]
          : [createStoryListItem("01"), createStoryListItem("02"), createStoryListItem("03")];
    }
    if (preset.body === "before-after" && doc.media.length === 0) {
      next.media = [
        createStoryMedia({ title: "Before" }),
        createStoryMedia({ title: "After" }),
      ];
    }
    onChange(next);
  };

  // ---- list items -------------------------------------------------------
  const updateItem = (id: string, updates: Partial<StoryListItem>) =>
    update({
      items: doc.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  const moveItem = (index: number, delta: number) => {
    const next = [...doc.items];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ items: next });
  };

  // ---- media ------------------------------------------------------------
  const updateMedia = (id: string, updates: Partial<StoryMedia>) =>
    update({
      media: doc.media.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  const moveMedia = (index: number, delta: number) => {
    const next = [...doc.media];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ media: next });
  };

  const isStatement = doc.header === "statement";
  const isQuote = doc.header === "quote";
  const usesMedia = storyBodyUsesMedia(doc.body);
  const allowsVideo = storyBodyAllowsVideo(doc.body);
  const usesCaptions = storyBodyUsesCaptions(doc.body);
  const headerOption = STORY_HEADER_OPTIONS.find((option) => option.value === doc.header);
  const bodyOption = STORY_BODY_OPTIONS.find((option) => option.value === doc.body);
  const singleMediaOnly = doc.body === "backdrop-video";
  const isSplit = isStorySplitBody(doc.body);
  const isHtmlText = doc.textFormat === "html";

  const mediaTitleLabel =
    doc.body === "before-after"
      ? "Label (Before / After)"
      : doc.body === "showcase"
        ? "Feature heading"
        : "Caption heading (optional)";

  return (
    <div className="space-y-6">
      {/* Presets ------------------------------------------------------- */}
      <div className="space-y-2">
        <Label>Quick layout</Label>
        <Hint>
          Pick the look first. It sets the heading style and media layout; you
          can fine-tune both below.
        </Hint>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {STORY_PRESETS.map((preset) => {
            const active =
              doc.header === preset.header &&
              doc.body === preset.body &&
              (!preset.side || preset.side === doc.mediaSide);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  "space-y-1.5 rounded-lg border p-2 text-left transition-colors hover:border-foreground",
                  active ? "border-foreground ring-2 ring-foreground/20" : "border-border"
                )}
                title={preset.description}
              >
                <PresetThumb
                  header={preset.header}
                  body={preset.body}
                  side={preset.side}
                />
                <p className="text-xs font-semibold leading-tight">{preset.label}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings ------------------------------------------------------ */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label>Background band</Label>
          <div className="flex gap-1">
            {STORY_BAND_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => update({ band: option.value })}
                title={option.label}
                className={cn(
                  "h-8 flex-1 rounded-lg border text-xs font-semibold capitalize",
                  doc.band === option.value
                    ? "border-foreground"
                    : "border-border text-muted-foreground",
                  option.value === "dark" && "bg-[#252525] text-white",
                  option.value === "light" && "bg-[#f1f1ee] text-black"
                )}
              >
                {option.value}
              </button>
            ))}
          </div>
          <Hint>Alternate dark and light between sections.</Hint>
        </div>
        <div className="space-y-2">
          <Label>Heading style</Label>
          <select
            className={selectClass}
            value={doc.header}
            onChange={(event) => update({ header: event.target.value as StoryHeader })}
          >
            {STORY_HEADER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {headerOption ? <Hint>{headerOption.description}</Hint> : null}
        </div>
        <div className="space-y-2">
          <Label>Media layout</Label>
          <select
            className={selectClass}
            value={doc.body}
            onChange={(event) => update({ body: event.target.value as StoryBody })}
          >
            {STORY_BODY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {bodyOption ? <Hint>{bodyOption.description}</Hint> : null}
          {isSplit ? (
            <div className="flex gap-1 pt-1">
              {(["left", "right"] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => update({ mediaSide: side })}
                  className={cn(
                    "h-8 flex-1 rounded-lg border text-xs font-semibold",
                    doc.mediaSide === side
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground"
                  )}
                >
                  Image {side}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>Side menu label</Label>
          <Input
            value={doc.menuLabel}
            onChange={(event) => update({ menuLabel: event.target.value })}
            placeholder="e.g. Research"
          />
          <Hint>Fill on 2+ sections to show the sticky section menu.</Hint>
        </div>
      </div>

      {/* Text ---------------------------------------------------------- */}
      {doc.header !== "none" ? (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                {isStatement ? "Small label" : isQuote ? "Person / role" : "Heading line 1 (black)"}
              </Label>
              <Input
                value={doc.top}
                onChange={(event) => update({ top: event.target.value })}
                placeholder={
                  isStatement ? "Problem statement" : isQuote ? "Operations Director" : "User research"
                }
              />
            </div>
            {!isStatement ? (
              <div className="space-y-2">
                <Label>{isQuote ? "Company (optional)" : "Heading line 2 (grey)"}</Label>
                <Input
                  value={doc.bottom}
                  onChange={(event) => update({ bottom: event.target.value })}
                  placeholder={isQuote ? "Blueprint" : "results & insights"}
                />
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <Label>
                {isStatement ? "Statement" : isQuote ? "Quote" : "Paragraph"}
              </Label>
              <div className="inline-flex rounded-lg border border-border p-0.5">
                {(["text", "html"] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => update({ textFormat: format })}
                    className={cn(
                      "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                      doc.textFormat === format
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {format === "text" ? "Plain text" : "HTML"}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              value={doc.text}
              onChange={(event) => update({ text: event.target.value })}
              rows={isHtmlText ? 8 : isStatement || isQuote ? 3 : 4}
              className={cn(isHtmlText && "font-mono text-xs leading-relaxed")}
              placeholder={
                isHtmlText
                  ? "<p>Paste HTML here, e.g. <strong>bold</strong>, <a href=…>links</a>, <ul><li>lists</li></ul></p>"
                  : isStatement
                  ? "One big sentence that frames the problem."
                  : isQuote
                    ? "What they said about working with you."
                    : doc.header === "vertical" || isSplit
                      ? "Shown under the heading. Blank line = new paragraph."
                      : "Shown to the right of the heading. Blank line = new paragraph."
              }
            />
            {isHtmlText ? (
              <Hint>
                Rendered as HTML on the live page and styled to match the
                section. Scripts and inline event handlers are removed.
              </Hint>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Numbered list -------------------------------------------------- */}
      {doc.header === "vertical" || (isSplit && doc.header !== "none") ? (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {isSplit
                  ? "Numbered list under the text (optional)"
                  : "Numbered list (right column)"}
              </p>
              <Hint>Label is the big number: 01, 02… or a stat like 67%.</Hint>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                update({
                  items: [
                    ...doc.items,
                    createStoryListItem(String(doc.items.length + 1).padStart(2, "0")),
                  ],
                })
              }
            >
              Add row
            </Button>
          </div>
          {doc.items.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[90px_1fr_auto]"
            >
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input
                  value={item.label}
                  onChange={(event) => updateItem(item.id, { label: event.target.value })}
                  placeholder={String(index + 1).padStart(2, "0")}
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={item.title}
                  onChange={(event) => updateItem(item.id, { title: event.target.value })}
                  placeholder="Bold title"
                />
                <Textarea
                  value={item.description}
                  onChange={(event) => updateItem(item.id, { description: event.target.value })}
                  rows={2}
                  placeholder="Grey description (optional)"
                />
              </div>
              <div className="flex gap-1 md:flex-col">
                <Button type="button" variant="ghost" size="sm" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label="Move row up">
                  <ArrowUp className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => moveItem(index, 1)} disabled={index === doc.items.length - 1} aria-label="Move row down">
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update({ items: doc.items.filter((row) => row.id !== item.id) })}
                  aria-label="Remove row"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Media ---------------------------------------------------------- */}
      {doc.body === "embed" ? (
        <div className="space-y-2 rounded-xl border border-border p-4">
          <Label>Video URL</Label>
          <Input
            value={doc.embedUrl}
            onChange={(event) => update({ embedUrl: event.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
          />
          <Hint>YouTube, Vimeo or Loom links are converted to an embedded player.</Hint>
        </div>
      ) : null}

      {doc.body === "backdrop-video" ? (
        <div className="rounded-xl border border-border p-4">
          <ImageUpload
            label="Backdrop wallpaper"
            value={doc.backdropUrl || null}
            onChange={(url) => update({ backdropUrl: url ?? "" })}
            requirementsKind="image"
          />
        </div>
      ) : null}

      {usesMedia ? (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {doc.body === "backdrop-video" ? "Video on the backdrop" : "Media"}
              </p>
              <Hint>
                Images keep their natural size (no cropping) and zoom on click.
                {doc.body === "before-after"
                  ? " Add in pairs: Before, After, Before, After…"
                  : null}
              </Hint>
            </div>
            {!singleMediaOnly || doc.media.length === 0 ? (
              <div className="flex flex-wrap gap-2">
                {doc.body !== "backdrop-video" && doc.body !== "video" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      update({
                        media: [
                          ...doc.media,
                          createStoryMedia(
                            doc.body === "before-after"
                              ? { title: doc.media.length % 2 === 0 ? "Before" : "After" }
                              : undefined
                          ),
                        ],
                      })
                    }
                  >
                    Add image
                  </Button>
                ) : null}
                {allowsVideo ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      update({ media: [...doc.media, createStoryMedia({ kind: "video" })] })
                    }
                  >
                    Add video
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {doc.media.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_auto]"
            >
              <div className="space-y-3">
                {item.kind === "video" ? (
                  <VideoUpload
                    label={`Video ${index + 1}`}
                    value={item.url || null}
                    onChange={(url) => updateMedia(item.id, { url: url ?? "" })}
                  />
                ) : (
                  <ImageUpload
                    label={`Image ${index + 1}`}
                    value={item.url || null}
                    onChange={(url) => updateMedia(item.id, { url: url ?? "" })}
                    previewClassName="max-w-xs aspect-[16/10]"
                    requirementsKind="image"
                  />
                )}
                {usesCaptions ? (
                  <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                    <div className="space-y-1.5">
                      <Label>{mediaTitleLabel}</Label>
                      <Input
                        value={item.title}
                        onChange={(event) => updateMedia(item.id, { title: event.target.value })}
                        placeholder={
                          doc.body === "before-after"
                            ? index % 2 === 0
                              ? "Before"
                              : "After"
                            : doc.body === "showcase"
                              ? "Interactive scavenger hunts"
                              : "Existing:"
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{doc.body === "showcase" ? "Feature text" : "Caption"}</Label>
                      <Textarea
                        value={item.caption}
                        onChange={(event) => updateMedia(item.id, { caption: event.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex gap-1 md:flex-col">
                <Button type="button" variant="ghost" size="sm" onClick={() => moveMedia(index, -1)} disabled={index === 0} aria-label="Move media up">
                  <ArrowUp className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => moveMedia(index, 1)} disabled={index === doc.media.length - 1} aria-label="Move media down">
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => update({ media: doc.media.filter((media) => media.id !== item.id) })}
                  aria-label="Remove media"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {!singleMediaOnly ? (
            <GalleryUpload
              label="Bulk upload images"
              hint="Select several images at once; each one is added as a media slot above."
              emptyText={null}
              value={[]}
              onChange={(urls) =>
                update({
                  media: [
                    ...doc.media,
                    ...urls.map((url) => createStoryMedia({ url })),
                  ],
                })
              }
            />
          ) : null}
        </div>
      ) : null}

      {/* Preview -------------------------------------------------------- */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview((open) => !open)}
        >
          {showPreview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {showPreview ? "Hide preview" : "Preview section"}
        </Button>
        {showPreview ? (
          <div className="story-page story-preview overflow-hidden rounded-xl border border-border">
            <StorySection id="story-preview" doc={doc} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
