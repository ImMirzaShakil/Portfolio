"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const CanvasEditorInner = dynamic(
  () =>
    import("@/components/admin/canvas/CanvasEditor").then(
      (mod) => mod.CanvasEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        Loading canvas editor…
      </div>
    ),
  }
);

export function CanvasEditorClient(
  props: ComponentProps<typeof CanvasEditorInner>
) {
  return <CanvasEditorInner {...props} />;
}
