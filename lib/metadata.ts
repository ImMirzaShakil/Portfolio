import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";

const FALLBACK_SITE_NAME = "Mirza Md Shakil";
const FALLBACK_DESCRIPTION =
  "Portfolio of Mirza Md Shakil — software engineer building thoughtful digital experiences.";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function getSiteContext() {
  const supabase = createStaticClient();

  const [{ data: about }, { data: settings }] = await Promise.all([
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);

  const siteName = settings?.site_title ?? FALLBACK_SITE_NAME;
  const description =
    about?.intro_text?.trim().slice(0, 160) || FALLBACK_DESCRIPTION;

  return { about, settings, siteName, description };
}

export function buildOpenGraph({
  title,
  description,
  images,
  url,
}: {
  title: string;
  description: string;
  images?: string[];
  url?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url,
    siteName: title,
    type: "website",
    images: images?.length
      ? images.map((image) => ({ url: image }))
      : undefined,
  };
}

export function buildTwitter({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images?: string[];
}): NonNullable<Metadata["twitter"]> {
  return {
    card: images?.length ? "summary_large_image" : "summary",
    title,
    description,
    images,
  };
}

export async function getDefaultMetadata(): Promise<Metadata> {
  const { siteName, description, about, settings } = await getSiteContext();
  const siteUrl = getSiteUrl();
  const images = about?.profile_image_url
    ? [about.profile_image_url]
    : undefined;
  const logoUrl = settings?.logo_url?.trim();
  const logoUrlDark = settings?.logo_url_dark?.trim();
  const faviconUrl = logoUrl || "/favicon.svg";
  const faviconIcons =
    logoUrl && logoUrlDark
      ? [
          { url: logoUrl, media: "(prefers-color-scheme: light)" },
          { url: logoUrlDark, media: "(prefers-color-scheme: dark)" },
        ]
      : [{ url: faviconUrl }];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    icons: {
      icon: faviconIcons,
      shortcut: faviconIcons,
      apple: faviconIcons,
    },
    openGraph: buildOpenGraph({
      title: siteName,
      description,
      images,
      url: siteUrl,
    }),
    twitter: buildTwitter({
      title: siteName,
      description,
      images,
    }),
  };
}
