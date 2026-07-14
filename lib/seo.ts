import type { Metadata } from "next";
import {
  buildOpenGraph,
  buildTwitter,
  getSiteUrl,
} from "@/lib/metadata";

/** Platforms shown in admin; some share Open Graph tags in HTML. */
export const SEO_PLATFORMS = [
  {
    id: "google",
    label: "Google Search",
    hint: "Title and description in search results. Used as the default fallback for other platforms.",
  },
  {
    id: "facebook",
    label: "Facebook",
    hint: "Open Graph preview when a link is shared on Facebook.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    hint: "Open Graph preview when a link is shared on LinkedIn.",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    hint: "Twitter Card preview (separate from Open Graph).",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hint: "Uses Open Graph tags for link previews in chats.",
  },
  {
    id: "instagram",
    label: "Instagram",
    hint: "Link previews in bio / DMs use Open Graph when available.",
  },
  {
    id: "github",
    label: "GitHub",
    hint: "Open Graph preview when a link is pasted in issues, PRs, or READMEs.",
  },
  {
    id: "google_scholar",
    label: "Google Scholar",
    hint: "Optional citation meta tags for scholarly / publication-style pages.",
  },
] as const;

export type SeoPlatformId = (typeof SEO_PLATFORMS)[number]["id"];

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

export interface PlatformSeoFields {
  title?: string | null;
  description?: string | null;
  image_url?: string | null;
  /** Google Scholar citation author */
  scholar_author?: string | null;
}

export type PagePlatformSeo = Partial<
  Record<SeoPlatformId, PlatformSeoFields>
>;

export type SitePageSeo = Partial<Record<StaticSeoPageId, PagePlatformSeo>>;

export function emptyPlatformSeo(): PlatformSeoFields {
  return {
    title: "",
    description: "",
    image_url: "",
    scholar_author: "",
  };
}

export function emptyPagePlatformSeo(): PagePlatformSeo {
  return Object.fromEntries(
    SEO_PLATFORMS.map((platform) => [platform.id, emptyPlatformSeo()])
  ) as PagePlatformSeo;
}

export function normalizePlatformSeo(
  value?: PlatformSeoFields | null
): PlatformSeoFields {
  return {
    title: value?.title ?? "",
    description: value?.description ?? "",
    image_url: value?.image_url ?? "",
    scholar_author: value?.scholar_author ?? "",
  };
}

export function normalizePagePlatformSeo(
  value?: PagePlatformSeo | null
): PagePlatformSeo {
  const result = emptyPagePlatformSeo();
  for (const platform of SEO_PLATFORMS) {
    result[platform.id] = normalizePlatformSeo(value?.[platform.id]);
  }
  return result;
}

export function normalizeSitePageSeo(value?: SitePageSeo | null): SitePageSeo {
  const result: SitePageSeo = {};
  for (const page of STATIC_SEO_PAGES) {
    result[page.id] = normalizePagePlatformSeo(value?.[page.id]);
  }
  return result;
}

function trimOrNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Drop empty platform objects before saving. */
export function compactPagePlatformSeo(
  value?: PagePlatformSeo | null
): PagePlatformSeo {
  const result: PagePlatformSeo = {};

  for (const platform of SEO_PLATFORMS) {
    const fields = value?.[platform.id];
    if (!fields) continue;

    const compact: PlatformSeoFields = {};
    const title = trimOrNull(fields.title);
    const description = trimOrNull(fields.description);
    const image_url = trimOrNull(fields.image_url);
    const scholar_author = trimOrNull(fields.scholar_author);

    if (title) compact.title = title;
    if (description) compact.description = description;
    if (image_url) compact.image_url = image_url;
    if (scholar_author) compact.scholar_author = scholar_author;

    if (Object.keys(compact).length > 0) {
      result[platform.id] = compact;
    }
  }

  return result;
}

export function compactSitePageSeo(value?: SitePageSeo | null): SitePageSeo {
  const result: SitePageSeo = {};

  for (const page of STATIC_SEO_PAGES) {
    const compacted = compactPagePlatformSeo(value?.[page.id]);
    if (Object.keys(compacted).length > 0) {
      result[page.id] = compacted;
    }
  }

  return result;
}

export interface SeoFallbacks {
  title: string;
  description: string;
  image?: string | null;
  url: string;
  siteName?: string;
}

function pickFields(
  seo: PagePlatformSeo | null | undefined,
  platform: SeoPlatformId,
  fallbacks: SeoFallbacks
): { title: string; description: string; image?: string } {
  const fields = seo?.[platform];
  const title = trimOrNull(fields?.title) ?? fallbacks.title;
  const description = trimOrNull(fields?.description) ?? fallbacks.description;
  const image =
    trimOrNull(fields?.image_url) ??
    trimOrNull(fallbacks.image) ??
    undefined;

  return { title, description, image };
}

/** Open Graph platforms share one set of tags — pick first configured. */
const OG_PLATFORM_PRIORITY: SeoPlatformId[] = [
  "facebook",
  "linkedin",
  "whatsapp",
  "instagram",
  "github",
];

function resolveOpenGraphFields(
  seo: PagePlatformSeo | null | undefined,
  fallbacks: SeoFallbacks
) {
  for (const platform of OG_PLATFORM_PRIORITY) {
    const fields = seo?.[platform];
    if (
      trimOrNull(fields?.title) ||
      trimOrNull(fields?.description) ||
      trimOrNull(fields?.image_url)
    ) {
      return pickFields(seo, platform, fallbacks);
    }
  }

  return pickFields(seo, "google", fallbacks);
}

function buildScholarOther(seo: PagePlatformSeo | null | undefined) {
  const scholar = seo?.google_scholar;
  if (!scholar) return undefined;

  const title = trimOrNull(scholar.title);
  const author = trimOrNull(scholar.scholar_author);
  const description = trimOrNull(scholar.description);

  if (!title && !author && !description) return undefined;

  const other: Record<string, string> = {};
  if (title) other["citation_title"] = title;
  if (author) other["citation_author"] = author;
  if (description) other["citation_abstract"] = description;

  return other;
}

/**
 * Build Next.js Metadata from per-platform SEO overrides + content fallbacks.
 */
export function buildPageMetadata(
  seo: PagePlatformSeo | null | undefined,
  fallbacks: SeoFallbacks
): Metadata {
  const google = pickFields(seo, "google", fallbacks);
  const og = resolveOpenGraphFields(seo, fallbacks);
  const twitter = pickFields(
    seo,
    "twitter",
    {
      ...fallbacks,
      title: og.title,
      description: og.description,
      image: og.image,
    }
  );
  const images = og.image ? [og.image] : undefined;
  const twitterImages = twitter.image ? [twitter.image] : images;
  const scholarOther = buildScholarOther(seo);

  return {
    title: google.title,
    description: google.description,
    openGraph: buildOpenGraph({
      title: og.title,
      description: og.description,
      images,
      url: fallbacks.url,
      siteName: fallbacks.siteName,
    }),
    twitter: buildTwitter({
      title: twitter.title,
      description: twitter.description,
      images: twitterImages,
    }),
    ...(scholarOther ? { other: scholarOther } : {}),
  };
}

export function getPublicProjectUrl(slug: string) {
  return `${getSiteUrl()}/projects/${slug}`;
}
