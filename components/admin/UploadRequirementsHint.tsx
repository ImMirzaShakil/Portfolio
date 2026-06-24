"use client";

import { Info } from "lucide-react";
import { useId } from "react";
import {
  getUploadRequirements,
  type UploadKind,
} from "@/lib/upload-requirements";
import { cn } from "@/lib/utils";

interface UploadRequirementsHintProps {
  kind: UploadKind;
  className?: string;
}

export function UploadRequirementsHint({
  kind,
  className,
}: UploadRequirementsHintProps) {
  const tooltipId = useId();
  const requirements = getUploadRequirements(kind);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <button
        type="button"
        className="group relative inline-flex rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-describedby={tooltipId}
        aria-label="Upload file requirements"
      >
        <Info className="size-4" aria-hidden="true" />
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span className="block font-semibold">Supported formats</span>
          <span className="block">{requirements.formats}</span>
          <span className="mt-2 block font-semibold">Max file size</span>
          <span className="block">{requirements.maxSizeLabel}</span>
          {requirements.notes.map((note) => (
            <span key={note} className="mt-2 block text-muted-foreground">
              {note}
            </span>
          ))}
        </span>
      </button>
    </span>
  );
}

export function UploadRequirementsText({ kind }: { kind: UploadKind }) {
  const requirements = getUploadRequirements(kind);

  return (
    <p className="text-xs text-muted-foreground">
      {requirements.formats} · max {requirements.maxSizeLabel}
    </p>
  );
}
