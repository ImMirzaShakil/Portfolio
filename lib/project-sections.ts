export type ProjectSectionType =
  | "overview"
  | "quickfact"
  | "media-hero"
  | "process"
  | "stats"
  | "feature"
  | "research"
  | "insights"
  | "problem"
  | "solution"
  | "testing"
  | "outcome"
  | "video"
  | "html"
  | "canvas"
  | "custom";

export type FeatureLayout =
  | "grid-2"
  | "grid-1-2"
  | "stack"
  | "feature-split-grid-2"
  | "feature-split-grid-1-2"
  | "feature-split-grid-3"
  | "feature-split-stack";

export type FeatureImageGrid = "grid-2" | "grid-1-2" | "grid-3" | "stack";

export interface SectionListItem {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface SectionTypeConfig {
  key: ProjectSectionType;
  label: string;
  description: string;
  supportsImage: boolean;
  supportsVideo: boolean;
  supportsMediaGallery: boolean;
  supportsItems: boolean;
  supportsHtml?: boolean;
  itemKind?: "process" | "stats";
}

export const FEATURE_LAYOUT_OPTIONS: Array<{
  value: FeatureLayout;
  label: string;
  description: string;
}> = [
  {
    value: "feature-split-grid-2",
    label: "Split text + 2 equal images",
    description:
      "Title left / body right, then two equal images below (reference feature style).",
  },
  {
    value: "feature-split-grid-1-2",
    label: "Split text + narrow & wide images",
    description:
      "Title left / body right, then narrow + wide image pair below.",
  },
  {
    value: "feature-split-grid-3",
    label: "Split text + 3 equal images",
    description:
      "Title left / body right, then three equal images in a row.",
  },
  {
    value: "feature-split-stack",
    label: "Split text + stacked images",
    description:
      "Title left / body right, then full-width stacked images.",
  },
  {
    value: "grid-2",
    label: "Stacked text + 2 equal images",
    description: "Legacy: text above, then side-by-side image pair.",
  },
  {
    value: "grid-1-2",
    label: "Stacked text + narrow & wide",
    description: "Legacy: text above, then narrow + wide images.",
  },
  {
    value: "stack",
    label: "Stacked text + full-width images",
    description: "Legacy: text above, then each image full width.",
  },
];

/** Whether the layout uses the split title/body text row. */
export function isFeatureSplitLayout(layout?: string | null): boolean {
  return (layout ?? "").startsWith("feature-split-");
}

/** Resolve which image grid to use for a feature layout preset. */
export function getFeatureImageGrid(layout?: string | null): FeatureImageGrid {
  switch (layout) {
    case "feature-split-grid-1-2":
    case "grid-1-2":
      return "grid-1-2";
    case "feature-split-grid-3":
      return "grid-3";
    case "feature-split-stack":
    case "stack":
      return "stack";
    case "feature-split-grid-2":
    case "grid-2":
    default:
      return "grid-2";
  }
}

/** Split feature title into optional eyebrow + heading (newline-separated). */
export function splitFeatureTitle(title?: string | null): {
  eyebrow: string | null;
  heading: string | null;
} {
  if (!title?.trim()) return { eyebrow: null, heading: null };
  const lines = title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return { eyebrow: null, heading: null };
  if (lines.length === 1) return { eyebrow: null, heading: lines[0] };
  return { eyebrow: lines[0], heading: lines.slice(1).join(" ") };
}

export const SECTION_TYPE_CONFIG: SectionTypeConfig[] = [
  {
    key: "overview",
    label: "Overview",
    description:
      "Opening narrative for the case study. Use for context, goals, and what you set out to build.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "quickfact",
    label: "Quick fact",
    description:
      "Label + value chip shown in the Quick facts row on the case study page (e.g. Client, Tools, Platform).",
    supportsImage: false,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "media-hero",
    label: "Media hero",
    description:
      "Full-bleed intro media under the project header — background image and/or looping product video (like Menti’s intro).",
    supportsImage: true,
    supportsVideo: true,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "process",
    label: "Process timeline",
    description:
      "Numbered phases (Week 1 / Research, Week 2 / Build…). Add steps below; title + content frame the section.",
    supportsImage: false,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: true,
    itemKind: "process",
  },
  {
    key: "stats",
    label: "Research stats",
    description:
      "Big callout numbers (87%, 15 people) with short explanations. Perfect for survey or research findings.",
    supportsImage: false,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: true,
    itemKind: "stats",
  },
  {
    key: "feature",
    label: "Feature showcase",
    description:
      "Product feature with selectable text+image layouts (split header + image grids).",
    supportsImage: false,
    supportsVideo: false,
    supportsMediaGallery: true,
    supportsItems: false,
  },
  {
    key: "research",
    label: "Research",
    description:
      "Research process write-up — methods, who you talked to, and what you learned.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "insights",
    label: "Insights",
    description:
      "Key takeaways that steered the design. Use after research, before features/solution.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "problem",
    label: "Problem",
    description:
      "The core problem or “how might we” statement you were solving.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "solution",
    label: "Solution",
    description:
      "How you solved it at a high level — before diving into individual features.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "testing",
    label: "Testing",
    description:
      "Usability tests, feedback rounds, or validation of the prototype.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "outcome",
    label: "Outcome",
    description:
      "Results, impact, or what shipped — metrics, acquisition, or reflection.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "video",
    label: "Video block",
    description:
      "Standalone video section (prototype walkthrough, whiteboard demo). Optional poster image behind the video.",
    supportsImage: true,
    supportsVideo: true,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "html",
    label: "Custom HTML",
    description:
      "Paste your own HTML markup for fully custom layouts, embeds, or one-off blocks. Use carefully — content is rendered as HTML on the public page.",
    supportsImage: false,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
    supportsHtml: true,
  },
  {
    key: "canvas",
    label: "Canvas design",
    description:
      "Free-layout slide with drag-and-drop text, images, and shapes. Save designs as reusable templates.",
    supportsImage: false,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
  {
    key: "custom",
    label: "Custom",
    description:
      "Anything that doesn’t fit a preset type — free title, body, and optional image.",
    supportsImage: true,
    supportsVideo: false,
    supportsMediaGallery: false,
    supportsItems: false,
  },
];

export function getSectionTypeConfig(type: string): SectionTypeConfig {
  return (
    SECTION_TYPE_CONFIG.find((item) => item.key === type) ??
    SECTION_TYPE_CONFIG.find((item) => item.key === "custom")!
  );
}

export function createEmptySectionItem(
  kind: "process" | "stats" = "process"
): SectionListItem {
  return {
    id: crypto.randomUUID(),
    label: kind === "stats" ? "" : "",
    title: "",
    description: "",
  };
}

export function normalizeSectionItems(value: unknown): SectionListItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        id:
          typeof record.id === "string" && record.id
            ? record.id
            : crypto.randomUUID(),
        label: typeof record.label === "string" ? record.label : "",
        title: typeof record.title === "string" ? record.title : "",
        description:
          typeof record.description === "string" ? record.description : "",
      };
    })
    .filter((item): item is SectionListItem => item !== null);
}

export function normalizeMediaUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export type SectionContentFormat = "text" | "html";

export function normalizeContentFormat(
  value?: string | null,
  sectionType?: string | null
): SectionContentFormat {
  if (sectionType === "html") return "html";
  return value === "html" ? "html" : "text";
}

export function isHtmlSectionContent(
  sectionType?: string | null,
  contentFormat?: string | null
): boolean {
  return normalizeContentFormat(contentFormat, sectionType) === "html";
}

/** Strip obvious script injection while keeping admin-authored layout HTML. */
export function sanitizeAdminHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?\s*object\b[^>]*>/gi, "")
    .replace(/<\/?\s*embed\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "");
}
