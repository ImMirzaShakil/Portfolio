"use client";

import { useId, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UploadRequirementsHint,
  UploadRequirementsText,
} from "@/components/admin/UploadRequirementsHint";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export function VideoUpload({
  value,
  onChange,
  label = "Video",
}: VideoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "project-images");
      formData.append("mediaType", "video");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        setError(result.error ?? "Upload failed.");
        return;
      }

      onChange(result.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{label}</p>
          <UploadRequirementsHint kind="video" />
        </div>
        <UploadRequirementsText kind="video" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${inputId}-url`}>Video URL</Label>
        <Input
          id={`${inputId}-url`}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value.trim() || null)}
          placeholder="https://…/demo.mp4"
        />
        <p className="text-xs text-muted-foreground">
          Paste a direct video link, or upload a file below.
        </p>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <video
            src={value}
            controls
            className="max-h-64 w-full object-contain"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          onChange={handleFileChange}
          className="sr-only"
          disabled={uploading}
        />
        <label
          htmlFor={inputId}
          className={cn(
            buttonVariants({ variant: "outline" }),
            uploading ? "pointer-events-none opacity-50" : "cursor-pointer"
          )}
        >
          {uploading ? "Uploading…" : value ? "Replace video file" : "Upload video"}
        </label>
        {value ? (
          <button
            type="button"
            className={cn(buttonVariants({ variant: "ghost" }))}
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
