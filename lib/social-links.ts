import type { AboutContent } from "@/lib/types";

export type SocialLinkKey = "twitter" | "linkedin" | "github" | "email";

export const SOCIAL_LINK_CONFIG = [
  { key: "twitter" as const, field: "twitter_url" as const, label: "Twitter" },
  { key: "linkedin" as const, field: "linkedin_url" as const, label: "LinkedIn" },
  { key: "github" as const, field: "github_url" as const, label: "GitHub" },
  { key: "email" as const, field: "email" as const, label: "Email" },
] as const;

export const DEFAULT_VISIBLE_SOCIAL_LINKS: SocialLinkKey[] = [
  "twitter",
  "linkedin",
  "github",
  "email",
];

export function getVisibleSocialLinkKeys(
  about?: AboutContent | null
): SocialLinkKey[] {
  if (about?.visible_social_links?.length) {
    return about.visible_social_links.filter((key): key is SocialLinkKey =>
      DEFAULT_VISIBLE_SOCIAL_LINKS.includes(key as SocialLinkKey)
    );
  }

  return DEFAULT_VISIBLE_SOCIAL_LINKS;
}

export function isSocialLinkVisible(
  about: AboutContent | null | undefined,
  key: SocialLinkKey
) {
  return getVisibleSocialLinkKeys(about).includes(key);
}
