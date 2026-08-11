"use client";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clampCanvasSize,
  MAX_CANVAS_SIZE,
  MIN_CANVAS_HEIGHT,
  MIN_CANVAS_WIDTH,
} from "@/lib/canvas-document";
import type { CanvasBackground, CanvasDocument } from "@/lib/canvas-document";
import { cn } from "@/lib/utils";

const CANVAS_SIZE_PRESETS = [
  { label: "16:9", width: 1200, height: 675 },
  { label: "4:3", width: 1200, height: 900 },
  { label: "1:1", width: 1080, height: 1080 },
  { label: "21:9", width: 1440, height: 617 },
  { label: "3:4", width: 900, height: 1200 },
] as const;

interface CanvasToolbarProps {
  document: CanvasDocument;
  onBackgroundChange: (background: CanvasBackground) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onAddText: () => void;
  onAddRect: () => void;
  onAddEllipse: () => void;
  onAddImage: (url: string) => void;
  onSaveTemplate: () => void;
  savingTemplate?: boolean;
}

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", "project-images");

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? "Upload failed");
  }
  return payload.url;
}

export function CanvasToolbar({
  document,
  onBackgroundChange,
  onSizeChange,
  onAddText,
  onAddRect,
  onAddEllipse,
  onAddImage,
  onSaveTemplate,
  savingTemplate = false,
}: CanvasToolbarProps) {
  const bgColor =
    document.background.type === "color"
      ? document.background.value
      : "#ffffff";

  const matchedPreset = CANVAS_SIZE_PRESETS.find(
    (preset) =>
      preset.width === document.width && preset.height === document.height
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={onAddText}>
        Text
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onAddRect}>
        Rectangle
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onAddEllipse}>
        Ellipse
      </Button>
      <label
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "cursor-pointer"
        )}
      >
        Image
        <input
          type="file"
          accept="image/*,.heic,.heif"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
              const url = await uploadImageFile(file);
              onAddImage(url);
            } catch (error) {
              console.error(error);
              window.alert(
                error instanceof Error ? error.message : "Upload failed"
              );
            }
          }}
        />
      </label>

      <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

      <div className="flex items-center gap-2">
        <Label htmlFor="canvas-bg-color" className="text-xs whitespace-nowrap">
          Background
        </Label>
        <Input
          id="canvas-bg-color"
          type="color"
          value={bgColor}
          onChange={(event) =>
            onBackgroundChange({ type: "color", value: event.target.value })
          }
          className="h-8 w-12 cursor-pointer p-1"
        />
        <label
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "cursor-pointer"
          )}
        >
          BG image
          <input
            type="file"
            accept="image/*,.heic,.heif"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              try {
                const url = await uploadImageFile(file);
                onBackgroundChange({ type: "image", value: url });
              } catch (error) {
                console.error(error);
                window.alert(
                  error instanceof Error ? error.message : "Upload failed"
                );
              }
            }}
          />
        </label>
        {document.background.type === "image" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onBackgroundChange({ type: "color", value: bgColor || "#ffffff" })
            }
          >
            Clear BG image
          </Button>
        ) : null}
      </div>

      <div className="ml-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveTemplate}
          disabled={savingTemplate}
        >
          {savingTemplate ? "Saving…" : "Save as template"}
        </Button>
      </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 border-t border-border pt-3">
        <div className="space-y-1">
          <Label htmlFor="canvas-size-preset" className="text-xs">
            Canvas size
          </Label>
          <select
            id="canvas-size-preset"
            value={matchedPreset?.label ?? "custom"}
            onChange={(event) => {
              const preset = CANVAS_SIZE_PRESETS.find(
                (item) => item.label === event.target.value
              );
              if (preset) {
                onSizeChange({ width: preset.width, height: preset.height });
              }
            }}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {CANVAS_SIZE_PRESETS.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label} ({preset.width}×{preset.height})
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="canvas-width" className="text-xs">
            Width
          </Label>
          <Input
            id="canvas-width"
            type="number"
            min={MIN_CANVAS_WIDTH}
            max={MAX_CANVAS_SIZE}
            value={document.width}
            onChange={(event) => {
              const width = Number(event.target.value) || MIN_CANVAS_WIDTH;
              onSizeChange(
                clampCanvasSize(width, document.height)
              );
            }}
            className="h-8 w-24"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="canvas-height" className="text-xs">
            Height
          </Label>
          <Input
            id="canvas-height"
            type="number"
            min={MIN_CANVAS_HEIGHT}
            max={MAX_CANVAS_SIZE}
            value={document.height}
            onChange={(event) => {
              const height = Number(event.target.value) || MIN_CANVAS_HEIGHT;
              onSizeChange(
                clampCanvasSize(document.width, height)
              );
            }}
            className="h-8 w-24"
          />
        </div>
        <p className="pb-1 text-xs text-muted-foreground">
          Or drag the canvas edges/corner. Aspect is preserved on the public
          page at every screen size.
        </p>
      </div>
    </div>
  );
}
