"use client";

import { useEffect, useRef, useState } from "react";

interface StoryZoomImageProps {
  src: string;
  alt: string;
}

/**
 * Natural-ratio image that opens full screen on click (like react-medium-image-zoom).
 * The zoomed view is a modal <dialog>, so it renders in the browser's top layer,
 * above the site-wide grain texture and any other fixed overlay.
 */
export function StoryZoomImage({ src, alt }: StoryZoomImageProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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
      <dialog
        ref={dialogRef}
        className="story-zoom-overlay"
        aria-label={alt || "Zoomed image"}
        onClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        {open ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} />
        ) : null}
      </dialog>
    </>
  );
}
