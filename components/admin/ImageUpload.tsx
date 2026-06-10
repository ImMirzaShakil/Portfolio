"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "project-images",
  label = "Image",
}: ImageUploadProps) {
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

    const formData = new FormData();
    formData.append("file", file);
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
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    onChange(result.url);
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>

      {value ? (
        <div className="relative aspect-[16/9] max-w-md overflow-hidden rounded-xl border border-border">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`image-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? `Uploading ${progress}%` : value ? "Replace image" : "Upload image"}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" onClick={() => onChange(null)}>
            Remove
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
