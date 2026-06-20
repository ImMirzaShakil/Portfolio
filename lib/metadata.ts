import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";

const FALLBACK_SITE_NAME = "Mirza Md Shakil";
const FALLBACK_DESCRIPTION =
  "Portfolio of Mirza Md Shakil — software engineer building thoughtful digital experiences.";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function getIconVersion(logoUrl?: string | null) {
  if (!logoUrl) return "";

  const filename = logoUrl.split("/").pop() ?? logoUrl;
  return `?v=${encodeURIComponent(filename)}`;
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
  const iconVersion = getIconVersion(settings?.logo_url);
  const iconPath = `/icon${iconVersion}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    icons: {
      icon: [{ url: iconPath, type: "image/png", sizes: "32x32" }],
      shortcut: [{ url: iconPath, type: "image/png" }],
      apple: [{ url: `/apple-icon${iconVersion}`, type: "image/png", sizes: "180x180" }],
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
