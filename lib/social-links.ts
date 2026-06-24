import type { AboutContent } from "@/lib/types";

export type SocialLinkKey =
  | "twitter"
  | "linkedin"
  | "github"
  | "facebook"
  | "instagram"
  | "email";

export type SocialLinkPlacement = "hero" | "footer";

export const ALL_SOCIAL_LINK_KEYS: SocialLinkKey[] = [
  "twitter",
  "linkedin",
  "github",
  "facebook",
  "instagram",
  "email",
];

export const SOCIAL_LINK_CONFIG = [
  {
    key: "twitter" as const,
    field: "twitter_url" as const,
    label: "Twitter / X",
    placeholder: "https://twitter.com/you",
  },
  {
    key: "linkedin" as const,
    field: "linkedin_url" as const,
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/you",
  },
  {
    key: "github" as const,
    field: "github_url" as const,
    label: "GitHub",
    placeholder: "https://github.com/you",
  },
  {
    key: "facebook" as const,
    field: "facebook_url" as const,
    label: "Facebook",
    placeholder: "https://facebook.com/you",
  },
  {
    key: "instagram" as const,
    field: "instagram_url" as const,
    label: "Instagram",
    placeholder: "https://instagram.com/you",
  },
  {
    key: "email" as const,
    field: "email" as const,
    label: "Email",
    placeholder: "hello@example.com",
  },
] as const;

export const DEFAULT_VISIBLE_SOCIAL_LINKS: SocialLinkKey[] = [
  "twitter",
  "linkedin",
  "github",
  "email",
];

function filterValidSocialKeys(values: string[]): SocialLinkKey[] {
  return values.filter((key): key is SocialLinkKey =>
    ALL_SOCIAL_LINK_KEYS.includes(key as SocialLinkKey)
  );
}

function getStoredVisibility(
  about: AboutContent | null | undefined,
  placement: SocialLinkPlacement
): string[] | null | undefined {
  if (placement === "hero") {
    return about?.visible_social_links_hero;
  }

  return about?.visible_social_links_footer;
}

export function getVisibleSocialLinkKeys(
  about: AboutContent | null | undefined,
  placement: SocialLinkPlacement
): SocialLinkKey[] {
  const stored = getStoredVisibility(about, placement);

  if (stored !== null && stored !== undefined) {
    return filterValidSocialKeys(stored);
  }

  // Legacy column fallback before migration
  if (about?.visible_social_links !== null && about?.visible_social_links !== undefined) {
    return filterValidSocialKeys(about.visible_social_links);
  }

  return DEFAULT_VISIBLE_SOCIAL_LINKS;
}

export function isSocialLinkVisible(
  about: AboutContent | null | undefined,
  key: SocialLinkKey,
  placement: SocialLinkPlacement
) {
  return getVisibleSocialLinkKeys(about, placement).includes(key);
}

export function resolveInitialSocialVisibility(
  specific: string[] | null | undefined,
  legacy: string[] | null | undefined
): SocialLinkKey[] {
  if (specific !== null && specific !== undefined) {
    return filterValidSocialKeys(specific);
  }

  if (legacy !== null && legacy !== undefined) {
    return filterValidSocialKeys(legacy);
  }

  return DEFAULT_VISIBLE_SOCIAL_LINKS;
}
