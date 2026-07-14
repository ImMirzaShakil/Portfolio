"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  UploadRequirementsHint,
  UploadRequirementsText,
} from "@/components/admin/UploadRequirementsHint";
import { Button } from "@/components/ui/button";
import { MAX_RESUME_UPLOAD_BYTES } from "@/lib/upload-requirements";

interface ResumeUploadProps {
  initialResumeUrl?: string | null;
}

function getFilename(url?: string | null) {
  if (!url) return null;
  try {
    return new URL(url).pathname.split("/").pop() ?? "resume.pdf";
  } catch {
    return "resume.pdf";
  }
}

export function ResumeUpload({ initialResumeUrl }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedAt, setUploadedAt] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_RESUME_UPLOAD_BYTES) {
      setError("PDF must be 10 MB or smaller.");
      return;
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/resume", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      url?: string;
      filename?: string;
      uploadedAt?: string;
      error?: string;
    };

    setUploading(false);

    if (!response.ok || !result.url) {
      setError(result.error ?? "Upload failed.");
      return;
    }

    setResumeUrl(result.url);
    setUploadedAt(result.uploadedAt ?? new Date().toISOString());
    toast.success("Resume uploaded successfully.");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const filename = getFilename(resumeUrl);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resume</h1>
        <p className="mt-2 text-muted-foreground">
          Upload the PDF linked from the navbar Resume item. Visibility of that
          menu link is controlled in Site Settings → Navigation.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Current resume</h2>
        {resumeUrl ? (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Filename:</span> {filename}
            </p>
            {uploadedAt ? (
              <p>
                <span className="text-muted-foreground">Last uploaded:</span>{" "}
                {new Date(uploadedAt).toLocaleString()}
              </p>
            ) : null}
            <Link
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-medium underline-offset-4 hover:underline"
            >
              View current resume
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No resume uploaded yet.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-muted p-4 text-sm text-muted-foreground">
        Uploading a new file will replace the current resume immediately.
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Upload resume</p>
            <UploadRequirementsHint kind="resume" />
          </div>
          <UploadRequirementsText kind="resume" />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleUpload}
          className="hidden"
          id="resume-upload"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "Upload new PDF"}
        </Button>
        {uploading ? (
          <p className="text-xs text-muted-foreground">
            Keep this tab open while your PDF uploads.
          </p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
