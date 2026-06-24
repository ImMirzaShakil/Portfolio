"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { prepareImageForUpload } from "@/lib/prepare-image-upload";
import { cn } from "@/lib/utils";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  label?: string;
}

export function GalleryUpload({
  value,
  onChange,
  bucket = "project-images",
  label = "Gallery photos",
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const uploaded: string[] = [];

      for (const file of files) {
        let uploadFile: File;

        try {
          uploadFile = await prepareImageForUpload(file);
        } catch (conversionError) {
          const message =
            conversionError instanceof Error
              ? conversionError.message
              : "Could not process image.";
          setError(message);
          continue;
        }

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("bucket", bucket);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const result = (await response.json()) as {
          url?: string;
          error?: string;
        };

        if (!response.ok || !result.url) {
          setError(result.error ?? "One or more uploads failed.");
          continue;
        }

        uploaded.push(result.url);
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">
        Upload photos for the gallery strip on the About page. Drag to reorder.
        Supports JPG, PNG, WebP, GIF, and iPhone HEIC (auto-converted to JPG).
        Max 20 MB per image.
      </p>

      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((src, index) => (
            <div key={src + index} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border">
                <Image
                  src={src}
                  alt={`Gallery photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 200px"
                />
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => index > 0 && moveImage(index, index - 1)}
                  disabled={index === 0}
                  className="flex-1 rounded border border-border px-2 py-1 text-xs disabled:opacity-30 hover:bg-muted"
                  title="Move left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="flex-1 rounded border border-border px-2 py-1 text-xs text-destructive hover:bg-muted"
                  title="Remove"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() =>
                    index < value.length - 1 && moveImage(index, index + 1)
                  }
                  disabled={index === value.length - 1}
                  className="flex-1 rounded border border-border px-2 py-1 text-xs disabled:opacity-30 hover:bg-muted"
                  title="Move right"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No gallery photos yet. Upload some to show a photo strip on your
            About page.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="sr-only"
          id="gallery-upload-input"
          disabled={uploading}
        />
        <label
          htmlFor="gallery-upload-input"
          className={cn(
            buttonVariants({ variant: "outline" }),
            uploading ? "pointer-events-none opacity-50" : "cursor-pointer"
          )}
        >
          {uploading ? "Uploading..." : "Add photos"}
        </label>
        {value.length > 0 ? (
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost" }), "text-destructive")}
            onClick={() => onChange([])}
          >
            Clear all
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
