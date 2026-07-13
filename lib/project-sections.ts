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
  | "custom";

export type FeatureLayout = "grid-2" | "grid-1-2" | "stack";

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
  itemKind?: "process" | "stats";
}

export const FEATURE_LAYOUT_OPTIONS: Array<{
  value: FeatureLayout;
  label: string;
  description: string;
}> = [
  {
    value: "grid-2",
    label: "2 equal images",
    description: "Side-by-side pair — good for before/after or two screens.",
  },
  {
    value: "grid-1-2",
    label: "1 + wide image",
    description: "Narrow image beside a wider one — matches Menti feature layouts.",
  },
  {
    value: "stack",
    label: "Stacked full width",
    description: "Each image spans the full content width.",
  },
];

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
      "One metadata chip in the Quick Facts bar (Role, Time, Team, Problem, Outcome, etc.). Title = label, Content = value.",
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
      "One product feature: eyebrow/title, body copy, and a multi-image gallery with layout choices.",
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
