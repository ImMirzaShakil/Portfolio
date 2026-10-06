"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface StoryZoomImageProps {
  src: string;
  alt: string;
}

/** Natural-ratio image that opens full screen on click (like react-medium-image-zoom). */
export function StoryZoomImage({ src, alt }: StoryZoomImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="story-zoom-trigger"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Zoom image: ${alt}` : "Zoom image"}
      >
        {/* Plain <img> keeps natural aspect ratio and GIF animation. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="story-media" loading="lazy" />
      </button>
      {open
        ? createPortal(
            <div
              className="story-zoom-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={alt || "Zoomed image"}
              onClick={() => setOpen(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
