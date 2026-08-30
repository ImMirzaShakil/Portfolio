"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const LuthorEditorInner = dynamic(
  () =>
    import("@/components/admin/luthor/LuthorEditor").then(
      (mod) => mod.LuthorEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        Loading visual editor…
      </div>
    ),
  }
);

export function LuthorEditorClient(
  props: ComponentProps<typeof LuthorEditorInner>
) {
  return <LuthorEditorInner {...props} />;
}
