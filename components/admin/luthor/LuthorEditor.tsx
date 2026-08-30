"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import {
  ExtensiveEditor,
  type ExtensiveEditorRef,
} from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";
import { prepareImageForUpload } from "@/lib/prepare-image-upload";
import {
  normalizeLuthorDocument,
  type LuthorDocument,
} from "@/lib/luthor-document";
import { toast } from "sonner";

function markButtonsAsNonSubmit(root: HTMLElement) {
  root.querySelectorAll("button").forEach((button) => {
    if (!button.getAttribute("type")) {
      button.setAttribute("type", "button");
    }
  });
}

const VISUAL_EDITOR_ONLY = ["visual-editor"] as const;

const FONT_FAMILY_OPTIONS = [
  {
    value: "manrope",
    label: "Manrope",
    fontFamily: "var(--font-manrope), Manrope, system-ui, sans-serif",
  },
  {
    value: "inter",
    label: "Inter",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  {
    value: "georgia",
    label: "Georgia",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  {
    value: "monospace",
    label: "Monospace",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
] as const;

interface LuthorEditorProps {
  value: unknown;
  html?: string | null;
  onChange: (next: { document: LuthorDocument; html: string }) => void;
}

async function uploadEditorImage(file: File): Promise<string> {
  const uploadFile = await prepareImageForUpload(file);
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("bucket", "project-images");

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as {
    url?: string;
    error?: string;
  };

  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "Image upload failed.");
  }

  return result.url;
}

export function LuthorEditor({ value, html, onChange }: LuthorEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<ExtensiveEditorRef | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  // Freeze the first payload so parent autosave updates do not remount the editor.
  const initial = useMemo(
    () => ({
      document: normalizeLuthorDocument(value),
      html: html ?? "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only snapshot
    []
  );
  const hasJson = Boolean(initial.document.json.trim());
  const defaultContent = hasJson
    ? undefined
    : initial.document.markdown.trim() || initial.html.trim() || undefined;

  const publishSnapshot = useCallback(
    (source: ExtensiveEditorRef) => {
      onChange({
        document: {
          version: 1,
          markdown: source.getMarkdown(),
          json: source.getJSON(),
        },
        html: source.getHTML(),
      });
    },
    [onChange]
  );

  const handleReady = useCallback(
    (methods: ExtensiveEditorRef) => {
      editorRef.current = methods;

      if (hasJson) {
        methods.injectJSON(initial.document.json);
      }

      publishSnapshot(methods);
    },
    [hasJson, initial.document.json, publishSnapshot]
  );

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;

    markButtonsAsNonSubmit(node);
    const observer = new MutationObserver(() => markButtonsAsNonSubmit(node));
    observer.observe(node, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="luthor-editor-host overflow-visible rounded-xl border border-border"
      onMouseDownCapture={(event) => {
        const button = (event.target as HTMLElement).closest("button");
        if (
          button instanceof HTMLButtonElement &&
          !button.getAttribute("type")
        ) {
          button.setAttribute("type", "button");
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        event.stopPropagation();
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          event.preventDefault();
        }
      }}
    >
      <ExtensiveEditor
        placeholder="Write the content for this section…"
        availableModes={VISUAL_EDITOR_ONLY}
        initialMode="visual-editor"
        defaultEditorView="visual-editor"
        isEditorViewTabsVisible={false}
        isToolbarEnabled
        isToolbarPinned
        toolbarPosition="top"
        initialTheme={resolvedTheme === "dark" ? "dark" : "light"}
        defaultContent={defaultContent}
        fontFamilyOptions={FONT_FAMILY_OPTIONS}
        imageUploadHandler={async (file) => {
          try {
            return await uploadEditorImage(file);
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Image upload failed."
            );
            throw error;
          }
        }}
        gifUploadHandler={async (file) => uploadEditorImage(file)}
        onReady={handleReady}
        onChange={({ source }) => {
          if (source !== "user" || !editorRef.current) return;
          publishSnapshot(editorRef.current);
        }}
      />
    </div>
  );
}
