import type { Metadata } from "next";
import {
  buildOpenGraph,
  buildTwitter,
  getSiteUrl,
} from "@/lib/metadata";

export const STATIC_SEO_PAGES = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "work",
    label: "Work",
    path: "/work",
  },
  {
    id: "about",
    label: "About",
    path: "/about",
  },
  {
    id: "fun",
    label: "Fun",
    path: "/fun",
  },
] as const;

export type StaticSeoPageId = (typeof STATIC_SEO_PAGES)[number]["id"];

/** One shared SEO block used for Google + all social platforms. */
export interface SharedSeoFields {
  title?: string | null;
  description?: string | null;
  image_url?: string | null;
  /** Keywords / tags for search and social context. */
  tags?: string[] | null;
}

export type SitePageSeo = Partial<Record<StaticSeoPageId, SharedSeoFields>>;

/** @deprecated Use SharedSeoFields — kept for reading old per-platform saves. */
export type PagePlatformSeo = SharedSeoFields;

function trimOrNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizeTags(value?: string[] | string | null): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((tag) => tag.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function tagsToInputValue(tags?: string[] | null) {
  return (tags ?? []).join(", ");
}

/**
 * Accept new flat SEO shape, or coalesce legacy per-platform saves
 * ({ facebook: {...}, google: {...} }) into one shared block.
 */
export function normalizeSharedSeo(value?: unknown): SharedSeoFields {
  if (!value || typeof value !== "object") {
    return {
      title: "",
      description: "",
      image_url: "",
      tags: [],
    };
  }

  const record = value as Record<string, unknown>;

  // New flat shape
  if (
    "title" in record ||
    "description" in record ||
    "image_url" in record ||
    "tags" in record
  ) {
    const hasNestedPlatform =
      typeof record.facebook === "object" ||
      typeof record.google === "object" ||
      typeof record.twitter === "object";

    if (!hasNestedPlatform) {
      return {
        title: typeof record.title === "string" ? record.title : "",
        description:
          typeof record.description === "string" ? record.description : "",
        image_url:
          typeof record.image_url === "string" ? record.image_url : "",
        tags: normalizeTags(record.tags as string[] | string | null),
      };
    }
  }

  // Legacy per-platform shape — prefer first filled platform
  const legacyOrder = [
    "google",
    "facebook",
    "linkedin",
    "twitter",
    "whatsapp",
    "instagram",
    "github",
    "google_scholar",
  ] as const;

  for (const platform of legacyOrder) {
    const fields = record[platform];
    if (!fields || typeof fields !== "object") continue;

    const legacy = fields as Record<string, unknown>;
    const title = typeof legacy.title === "string" ? legacy.title.trim() : "";
    const description =
      typeof legacy.description === "string" ? legacy.description.trim() : "";
    const image_url =
      typeof legacy.image_url === "string" ? legacy.image_url.trim() : "";

    if (title || description || image_url) {
      return {
        title,
        description,
        image_url,
        tags: [],
      };
    }
  }

  return {
    title: "",
    description: "",
    image_url: "",
    tags: [],
  };
}

/** @deprecated Alias for normalizeSharedSeo */
export function normalizePagePlatformSeo(value?: unknown): SharedSeoFields {
  return normalizeSharedSeo(value);
}

export function normalizeSitePageSeo(value?: SitePageSeo | null): SitePageSeo {
  const result: SitePageSeo = {};
  const source = (value ?? {}) as Record<string, unknown>;

  for (const page of STATIC_SEO_PAGES) {
    result[page.id] = normalizeSharedSeo(source[page.id]);
  }

  return result;
}

export function compactSharedSeo(value?: SharedSeoFields | null): SharedSeoFields {
  const compact: SharedSeoFields = {};
  const title = trimOrNull(value?.title);
  const description = trimOrNull(value?.description);
  const image_url = trimOrNull(value?.image_url);
  const tags = normalizeTags(value?.tags);

  if (title) compact.title = title;
  if (description) compact.description = description;
  if (image_url) compact.image_url = image_url;
  if (tags.length > 0) compact.tags = tags;

  return compact;
}

/** @deprecated Alias for compactSharedSeo */
export function compactPagePlatformSeo(
  value?: SharedSeoFields | null
): SharedSeoFields {
  return compactSharedSeo(value);
}

export function compactSitePageSeo(value?: SitePageSeo | null): SitePageSeo {
  const result: SitePageSeo = {};

  for (const page of STATIC_SEO_PAGES) {
    const compacted = compactSharedSeo(
      normalizeSharedSeo(value?.[page.id] as unknown)
    );
    if (Object.keys(compacted).length > 0) {
      result[page.id] = compacted;
    }
  }

  return result;
}

export function sharedSeoHasContent(value?: SharedSeoFields | null) {
  const seo = normalizeSharedSeo(value);
  return Boolean(
    seo.title?.trim() ||
      seo.description?.trim() ||
      seo.image_url?.trim() ||
      (seo.tags && seo.tags.length > 0)
  );
}

export interface SeoFallbacks {
  title: string;
  description: string;
  image?: string | null;
  url: string;
  siteName?: string;
}

/**
 * Build Next.js Metadata from one shared SEO block + content fallbacks.
 * Same title/description/image apply to Google, Open Graph, and Twitter.
 */
export function buildPageMetadata(
  seoInput: SharedSeoFields | null | undefined,
  fallbacks: SeoFallbacks
): Metadata {
  const seo = normalizeSharedSeo(seoInput);
  const title = trimOrNull(seo.title) ?? fallbacks.title;
  const description = trimOrNull(seo.description) ?? fallbacks.description;
  const image =
    trimOrNull(seo.image_url) ?? trimOrNull(fallbacks.image) ?? undefined;
  const images = image ? [image] : undefined;
  const keywords = normalizeTags(seo.tags);

  return {
    title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    openGraph: buildOpenGraph({
      title,
      description,
      images,
      url: fallbacks.url,
      siteName: fallbacks.siteName,
    }),
    twitter: buildTwitter({
      title,
      description,
      images,
    }),
  };
}

export function getPublicProjectUrl(slug: string) {
  return `${getSiteUrl()}/projects/${slug}`;
}
