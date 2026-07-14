"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProjectShareButtonProps {
  url: string;
  title: string;
  summary?: string | null;
  className?: string;
}

export function ProjectShareButton({
  url,
  title,
  summary,
  className,
}: ProjectShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title,
          text: summary?.trim() || title,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied");
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Could not share this project.");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      title="Share project"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Share2 className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
