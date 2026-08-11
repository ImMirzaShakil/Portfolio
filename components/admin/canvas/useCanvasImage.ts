"use client";

import { useEffect, useState } from "react";
import type { Image as KonvaImageType } from "konva/lib/shapes/Image";

/** Load an image URL for react-konva Image nodes. */
export function useCanvasImage(url?: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.onerror = () => {
      if (!cancelled) setImage(null);
    };
    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return image as unknown as KonvaImageType | undefined;
}
