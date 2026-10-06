/**
 * Story sections — the taamannae.dev-style case study building block.
 *
 * Each story section is a full-width colour band (dark / light) holding a
 * two-tone heading (black line + grey line), a body paragraph, and one media
 * preset below it. The whole document lives in `project_sections.blocks_data`
 * (section_type = "story") so no schema migration is needed.
 */

export type StoryBand = "dark" | "light" | "none";

export type StoryHeader =
  | "horizontal"
  | "vertical"
  | "statement"
  | "quote"
  | "none";

export type StoryBody =
  | "none"
  | "single"
  | "full-bleed"
  | "grid-2"
  | "grid-1-2"
  | "grid-2-wide"
  | "grid-3"
  | "compare"
  | "before-after"
  | "backdrop-video"
  | "video"
  | "showcase"
  | "marquee"
  | "embed";

export interface StoryListItem {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface StoryMedia {
  id: string;
  url: string;
  kind: "image" | "video";
  /** Before/After label, showcase heading, or compare caption heading. */
  title: string;
  caption: string;
}

export interface StoryDocument {
  kind: "story";
  version: 1;
  band: StoryBand;
  header: StoryHeader;
  body: StoryBody;
  /** Label for the sticky side menu. Leave blank to hide from the menu. */
  menuLabel: string;
  /** Black first heading line (or the small label for statement / quote). */
  top: string;
  /** Grey second heading line. */
  bottom: string;
  /** Body paragraph (statement text / quote text for those headers). */
  text: string;
  /** Numbered list shown beside a vertical header (01, 02… or 67%, 85%…). */
  items: StoryListItem[];
  media: StoryMedia[];
  /** Wallpaper behind the video for the backdrop-video preset. */
  backdropUrl: string;
  /** YouTube / Vimeo / Loom URL for the embed preset. */
  embedUrl: string;
}

export const STORY_BAND_OPTIONS: Array<{ value: StoryBand; label: string }> = [
  { value: "dark", label: "Dark band (#252525)" },
  { value: "light", label: "Light band (page background)" },
  { value: "none", label: "No band (tight spacing)" },
];

export const STORY_HEADER_OPTIONS: Array<{
  value: StoryHeader;
  label: string;
  description: string;
}> = [
  {
    value: "horizontal",
    label: "Horizontal",
    description: "Two-tone heading left, paragraph right.",
  },
  {
    value: "vertical",
    label: "Vertical + numbered list",
    description:
      "Heading and paragraph on the left, numbered list (01, 02… or 67%…) on the right.",
  },
  {
    value: "statement",
    label: "Problem statement",
    description: "Small label, then one large sentence.",
  },
  {
    value: "quote",
    label: "Quote",
    description: "Large quotation with the person's role underneath.",
  },
  { value: "none", label: "No heading", description: "Media only." },
];

export const STORY_BODY_OPTIONS: Array<{
  value: StoryBody;
  label: string;
  description: string;
}> = [
  { value: "none", label: "No media", description: "Text only." },
  {
    value: "single",
    label: "One image",
    description: "One image at content width (1100px).",
  },
  {
    value: "full-bleed",
    label: "One image, full width",
    description: "Edge-to-edge image inside the band.",
  },
  { value: "grid-2", label: "2 equal", description: "Two equal columns." },
  {
    value: "grid-1-2",
    label: "Narrow + wide",
    description: "1/3 and 2/3 columns.",
  },
  {
    value: "grid-2-wide",
    label: "2 equal + wide below",
    description: "Two equal images, then one full-width image.",
  },
  { value: "grid-3", label: "3 equal", description: "Three equal columns." },
  {
    value: "compare",
    label: "Side by side with captions",
    description: "Two columns, centred caption under each image.",
  },
  {
    value: "before-after",
    label: "Before / After",
    description:
      "Pairs with a red Before bar and a green After bar, caption under each.",
  },
  {
    value: "backdrop-video",
    label: "Video on backdrop",
    description:
      "Looping video centred on a wallpaper image. Great for final designs.",
  },
  {
    value: "video",
    label: "Full-width video",
    description: "Looping video edge to edge.",
  },
  {
    value: "showcase",
    label: "Showcase rows",
    description:
      "Alternating rows: big video/image with a heading + text beside it.",
  },
  {
    value: "marquee",
    label: "Image marquee",
    description: "Scrolling strip of images that pauses on hover.",
  },
  {
    value: "embed",
    label: "Video embed",
    description: "YouTube / Vimeo / Loom player at 16:9.",
  },
];

export interface StoryPreset {
  id: string;
  label: string;
  description: string;
  header: StoryHeader;
  body: StoryBody;
  /** Placeholder copy dropped in when the preset is applied to an empty section. */
  sample: { top: string; bottom: string; text: string };
}

/** One-click layouts that mirror the sections used across taamannae.dev. */
export const STORY_PRESETS: StoryPreset[] = [
  {
    id: "process",
    label: "Numbered list",
    description: "Design brief, process, research plan, reflections.",
    header: "vertical",
    body: "none",
    sample: {
      top: "Our design",
      bottom: "process",
      text: "A short paragraph introducing the steps.",
    },
  },
  {
    id: "stats",
    label: "Research stats",
    description: "Big numbers (67%) with a headline and detail.",
    header: "vertical",
    body: "none",
    sample: {
      top: "User research",
      bottom: "results & insights",
      text: "What the research told us.",
    },
  },
  {
    id: "single",
    label: "Text + image",
    description: "Persona, journey map, audit, timeline.",
    header: "horizontal",
    body: "single",
    sample: {
      top: "Introducing our",
      bottom: "persona",
      text: "Why this artefact mattered.",
    },
  },
  {
    id: "grid-2",
    label: "Text + 2 images",
    description: "Feature with two screens.",
    header: "horizontal",
    body: "grid-2",
    sample: { top: "Feature #1", bottom: "Feature name", text: "" },
  },
  {
    id: "grid-1-2",
    label: "Text + narrow & wide",
    description: "Mobile screen next to a desktop screen.",
    header: "horizontal",
    body: "grid-1-2",
    sample: { top: "Feature #2", bottom: "Feature name", text: "" },
  },
  {
    id: "grid-2-wide",
    label: "Text + 2 + wide",
    description: "Two details, then the full view.",
    header: "horizontal",
    body: "grid-2-wide",
    sample: { top: "A new logo", bottom: "system", text: "" },
  },
  {
    id: "before-after",
    label: "Before / After",
    description: "Usability test iterations.",
    header: "horizontal",
    body: "before-after",
    sample: {
      top: "Usability tests",
      bottom: "and iterations",
      text: "Who you tested with and what you were testing.",
    },
  },
  {
    id: "backdrop-video",
    label: "Final designs video",
    description: "Product video on a wallpaper.",
    header: "horizontal",
    body: "backdrop-video",
    sample: {
      top: "Final designs",
      bottom: "and solutions",
      text: "",
    },
  },
  {
    id: "showcase",
    label: "Showcase rows",
    description: "Alternating media + feature text.",
    header: "horizontal",
    body: "showcase",
    sample: { top: "Final designs", bottom: "and solutions", text: "" },
  },
  {
    id: "marquee",
    label: "Image marquee",
    description: "Brand kit, deck slides, explorations.",
    header: "horizontal",
    body: "marquee",
    sample: { top: "Building a", bottom: "brand identity", text: "" },
  },
  {
    id: "statement",
    label: "Problem statement",
    description: "One big sentence.",
    header: "statement",
    body: "none",
    sample: { top: "Problem statement", bottom: "", text: "" },
  },
  {
    id: "quote",
    label: "Quote",
    description: "Testimonial from a stakeholder.",
    header: "quote",
    body: "none",
    sample: { top: "Operations Director", bottom: "", text: "" },
  },
  {
    id: "embed",
    label: "Video embed",
    description: "YouTube walkthrough.",
    header: "horizontal",
    body: "embed",
    sample: { top: "Final VR", bottom: "experience", text: "" },
  },
];

/** Bodies that hold uploaded media in `media`. */
export function storyBodyUsesMedia(body: StoryBody): boolean {
  return !["none", "embed"].includes(body);
}

/** Bodies where each media item can be a video instead of an image. */
export function storyBodyAllowsVideo(body: StoryBody): boolean {
  return ["backdrop-video", "video", "showcase", "single", "grid-2", "grid-1-2", "full-bleed"].includes(body);
}

/** Bodies whose media items carry a title / caption. */
export function storyBodyUsesCaptions(body: StoryBody): boolean {
  return ["before-after", "compare", "showcase"].includes(body);
}

export function createStoryMedia(
  overrides?: Partial<StoryMedia>
): StoryMedia {
  return {
    id: crypto.randomUUID(),
    url: "",
    kind: "image",
    title: "",
    caption: "",
    ...overrides,
  };
}

export function createStoryListItem(label = ""): StoryListItem {
  return { id: crypto.randomUUID(), label, title: "", description: "" };
}

export function createEmptyStoryDocument(
  overrides?: Partial<StoryDocument>
): StoryDocument {
  return {
    kind: "story",
    version: 1,
    band: "dark",
    header: "horizontal",
    body: "single",
    menuLabel: "",
    top: "",
    bottom: "",
    text: "",
    items: [],
    media: [],
    backdropUrl: "",
    embedUrl: "",
    ...overrides,
  };
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

const BANDS = ["dark", "light", "none"] as const;
const HEADERS = ["horizontal", "vertical", "statement", "quote", "none"] as const;
const BODIES = STORY_BODY_OPTIONS.map((option) => option.value);

export function normalizeStoryDocument(value: unknown): StoryDocument {
  const record =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  const items = Array.isArray(record.items)
    ? record.items
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => ({
          id: str(item.id) || crypto.randomUUID(),
          label: str(item.label),
          title: str(item.title),
          description: str(item.description),
        }))
    : [];

  const media = Array.isArray(record.media)
    ? record.media
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => ({
          id: str(item.id) || crypto.randomUUID(),
          url: str(item.url),
          kind: item.kind === "video" ? ("video" as const) : ("image" as const),
          title: str(item.title),
          caption: str(item.caption),
        }))
    : [];

  return {
    kind: "story",
    version: 1,
    band: pick(record.band, BANDS, "dark"),
    header: pick(record.header, HEADERS, "horizontal"),
    body: pick(record.body, BODIES, "single"),
    menuLabel: str(record.menuLabel),
    top: str(record.top),
    bottom: str(record.bottom),
    text: str(record.text),
    items,
    media,
    backdropUrl: str(record.backdropUrl),
    embedUrl: str(record.embedUrl),
  };
}

/** Trim strings and drop empty list rows / media slots before saving. */
export function compactStoryDocument(doc: unknown): StoryDocument {
  const normalized = normalizeStoryDocument(doc);
  return {
    ...normalized,
    menuLabel: normalized.menuLabel.trim(),
    top: normalized.top.trim(),
    bottom: normalized.bottom.trim(),
    text: normalized.text.trim(),
    backdropUrl: normalized.backdropUrl.trim(),
    embedUrl: normalized.embedUrl.trim(),
    items: normalized.items
      .map((item) => ({
        ...item,
        label: item.label.trim(),
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.label || item.title || item.description),
    media: normalized.media
      .map((item) => ({
        ...item,
        url: item.url.trim(),
        title: item.title.trim(),
        caption: item.caption.trim(),
      }))
      .filter((item) => item.url || item.title || item.caption),
  };
}

/** Plain-text title kept in `project_sections.title` for listings / fallbacks. */
export function storyPlainTitle(doc: StoryDocument): string {
  return [doc.top, doc.bottom].map((line) => line.trim()).filter(Boolean).join(" ");
}

export function isStoryVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

/** Convert a YouTube / Vimeo / Loom share URL into an embeddable player URL. */
export function toEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (host.endsWith("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id =
        parsed.searchParams.get("v") ??
        parsed.pathname.match(/^\/(?:shorts|live)\/([^/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com") return url;
    if (host.endsWith("loom.com")) {
      return url.replace("/share/", "/embed/");
    }
    if (parsed.protocol === "https:") return url;
  } catch {
    return null;
  }
  return null;
}

/**
 * The taamannae.dev case-study running order. Used by the admin
 * "Start from Tammy-style template" button.
 */
export function createStoryTemplate(): StoryDocument[] {
  const make = (
    presetId: string,
    band: StoryBand,
    menuLabel: string,
    overrides?: Partial<StoryDocument>
  ) => {
    const preset = STORY_PRESETS.find((item) => item.id === presetId)!;
    return createEmptyStoryDocument({
      band,
      header: preset.header,
      body: preset.body,
      menuLabel,
      ...preset.sample,
      ...overrides,
    });
  };

  return [
    make("backdrop-video", "none", "", { top: "", bottom: "", header: "none" }),
    make("process", "dark", "Brief", {
      top: "Design brief",
      bottom: "What we set out to do",
      text: "How might we …?",
      items: [createStoryListItem("01"), createStoryListItem("02")],
    }),
    make("process", "light", "Research", {
      top: "User research",
      bottom: "process & plan",
      items: [createStoryListItem("01"), createStoryListItem("02"), createStoryListItem("03")],
    }),
    make("stats", "dark", "Findings", {
      items: [createStoryListItem("67%"), createStoryListItem("57%"), createStoryListItem("69%")],
    }),
    make("statement", "light", "Problem"),
    make("single", "dark", "Persona"),
    make("single", "light", "Journey map", { top: "Journey map", bottom: "for the current experience" }),
    make("grid-2", "dark", "Feature 1"),
    make("grid-1-2", "light", "Feature 2"),
    make("before-after", "light", "Usability", {
      media: [
        createStoryMedia({ title: "Before" }),
        createStoryMedia({ title: "After" }),
      ],
    }),
    make("backdrop-video", "dark", "Final designs", {
      top: "Final designs",
      bottom: "and hand-off",
    }),
  ];
}
