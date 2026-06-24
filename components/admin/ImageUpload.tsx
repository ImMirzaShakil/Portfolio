"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { prepareImageForUpload } from "@/lib/prepare-image-upload";
import type { UploadKind } from "@/lib/upload-requirements";
import { cn } from "@/lib/utils";
import {
  UploadRequirementsHint,
  UploadRequirementsText,
} from "@/components/admin/UploadRequirementsHint";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  label?: string;
  previewClassName?: string;
  requirementsKind?: UploadKind;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "project-images",
  label = "Image",
  previewClassName = "aspect-[16/9] max-w-md",
  requirementsKind = "image",
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(10);
    setProgress(40);

    try {
      const uploadFile = await prepareImageForUpload(file);

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
        setError(result.error ?? "Upload failed.");
        return;
      }

      setProgress(100);
      onChange(result.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setProgress(0);
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
          <UploadRequirementsHint kind={requirementsKind} />
        </div>
        <UploadRequirementsText kind={requirementsKind} />
      </div>

      {value ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-border",
            previewClassName
          )}
        >
          {value.split("?")[0].toLowerCase().endsWith(".gif") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Uploaded preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={value}
              alt="Uploaded preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*,.heic,.heif"
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
          {uploading ? `Uploading ${progress}%` : value ? "Replace image" : "Upload image"}
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

      {uploading ? (
        <p className="text-xs text-muted-foreground">
          Keep this tab open while your file uploads.
        </p>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
