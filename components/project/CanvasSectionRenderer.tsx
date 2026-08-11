import type { CSSProperties } from "react";
import Image from "next/image";
import {
  normalizeCanvasDocument,
  sortCanvasObjects,
  type CanvasObject,
} from "@/lib/canvas-document";

interface CanvasSectionRendererProps {
  title?: string | null;
  canvasData: unknown;
}

function isGifUrl(url: string) {
  return url.split("?")[0].toLowerCase().endsWith(".gif");
}

/** Scale a design-px value relative to artboard width using container query units. */
function cqw(value: number, artboardWidth: number) {
  return `${(value / Math.max(artboardWidth, 1)) * 100}cqw`;
}

function renderObject(
  obj: CanvasObject,
  artboardWidth: number,
  artboardHeight: number
) {
  if (obj.hidden) return null;

  const geometry: CSSProperties = {
    position: "absolute",
    left: `${(obj.x / artboardWidth) * 100}%`,
    top: `${(obj.y / artboardHeight) * 100}%`,
    width: `${(obj.width / artboardWidth) * 100}%`,
    height: `${(obj.height / artboardHeight) * 100}%`,
    opacity: obj.opacity,
    transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
    transformOrigin: "top left",
  };

  if (obj.type === "text") {
    return (
      <div
        key={obj.id}
        style={{
          ...geometry,
          color: obj.fill,
          // Scale with the canvas container width (not the viewport)
          fontSize: cqw(obj.fontSize, artboardWidth),
          fontFamily: obj.fontFamily,
          fontWeight: obj.fontStyle.includes("bold") ? 700 : 400,
          fontStyle: obj.fontStyle.includes("italic") ? "italic" : "normal",
          textAlign: obj.align,
          lineHeight: obj.lineHeight,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
        }}
      >
        {obj.text}
      </div>
    );
  }

  if (obj.type === "rect") {
    return (
      <div
        key={obj.id}
        style={{
          ...geometry,
          background: obj.fill,
          border:
            obj.strokeWidth > 0
              ? `${cqw(obj.strokeWidth, artboardWidth)} solid ${obj.stroke}`
              : undefined,
          borderRadius: cqw(obj.cornerRadius, artboardWidth),
        }}
      />
    );
  }

  if (obj.type === "ellipse") {
    return (
      <div
        key={obj.id}
        style={{
          ...geometry,
          background: obj.fill,
          border:
            obj.strokeWidth > 0
              ? `${cqw(obj.strokeWidth, artboardWidth)} solid ${obj.stroke}`
              : undefined,
          borderRadius: "50%",
        }}
      />
    );
  }

  if (obj.type === "image") {
    return (
      <div key={obj.id} style={{ ...geometry, overflow: "hidden" }}>
        {isGifUrl(obj.src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={obj.src} alt="" className="h-full w-full object-cover" />
        ) : (
          <Image
            src={obj.src}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        )}
      </div>
    );
  }

  return null;
}

export function CanvasSectionRenderer({
  title,
  canvasData,
}: CanvasSectionRendererProps) {
  const doc = normalizeCanvasDocument(canvasData);
  const objects = sortCanvasObjects(doc.objects).filter((obj) => !obj.hidden);

  if (objects.length === 0 && doc.background.type === "color") {
    if (!title?.trim()) return null;
  }

  return (
    <section className="min-w-0 space-y-6" data-section-type="canvas">
      {title?.trim() ? (
        <h2 className="text-2xl font-bold">{title.trim()}</h2>
      ) : null}
      <div
        className="relative w-full max-w-full overflow-hidden rounded-2xl border border-border"
        style={{
          aspectRatio: `${doc.width} / ${doc.height}`,
          containerType: "inline-size",
          background:
            doc.background.type === "color"
              ? doc.background.value
              : undefined,
        }}
      >
        {doc.background.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.background.value}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {objects.map((obj) => renderObject(obj, doc.width, doc.height))}
      </div>
    </section>
  );
}
