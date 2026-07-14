"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProjectShareButtonProps {
  /** Absolute URL, or a site path like `/projects/slug`. Paths resolve from the current origin. */
  url: string;
  title: string;
  summary?: string | null;
  className?: string;
}

function resolveShareUrl(urlOrPath: string) {
  if (/^https?:\/\//i.test(urlOrPath)) {
    try {
      const parsed = new URL(urlOrPath);
      // Replace localhost/build fallbacks with the live page origin.
      if (
        typeof window !== "undefined" &&
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
      ) {
        return `${window.location.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      // fall through
    }
    return urlOrPath;
  }

  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
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

    const shareUrl = resolveShareUrl(url);

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title,
          text: summary?.trim() || title,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(shareUrl);
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
