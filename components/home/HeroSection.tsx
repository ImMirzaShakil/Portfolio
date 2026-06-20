"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroHeading } from "@/components/home/HeroHeading";
import { RotatingHeroLines } from "@/components/home/RotatingHeroLines";
import {
  isSocialLinkVisible,
  type SocialLinkKey,
} from "@/lib/social-links";
import type { AboutContent } from "@/lib/types";

interface HeroSectionProps {
  name?: string | null;
  heroHeading?: string | null;
  profileImageUrl?: string | null;
  about?: AboutContent | null;
  funFacts: string[];
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialIcons: Record<
  Exclude<SocialLinkKey, "email">,
  { label: string; icon: typeof XIcon }
> = {
  twitter: { label: "Twitter", icon: XIcon },
  linkedin: { label: "LinkedIn", icon: LinkedInIcon },
  github: { label: "GitHub", icon: GitHubIcon },
};

const socialFields: Record<
  Exclude<SocialLinkKey, "email">,
  keyof Pick<AboutContent, "twitter_url" | "linkedin_url" | "github_url">
> = {
  twitter: "twitter_url",
  linkedin: "linkedin_url",
  github: "github_url",
};

function getHeroHeading(name?: string | null, heroHeading?: string | null) {
  if (heroHeading?.trim()) {
    return heroHeading.trim();
  }

  const displayName = name ?? "Mirza Md Shakil";
  const firstName = displayName.split(" ")[0] ?? displayName;
  return `Hello, I'm ${firstName}`;
}

export function HeroSection({ name, heroHeading, profileImageUrl, about, funFacts }: HeroSectionProps) {
  const displayName = name ?? "Mirza Md Shakil";
  const heading = getHeroHeading(name, heroHeading);
  const heroImage = profileImageUrl ?? about?.profile_image_url ?? null;
  const showCurrently = about?.show_currently !== false;
  const showPreviously = about?.show_previously !== false;

  const currently =
    about?.currently_role && about?.currently_company
      ? `${about.currently_role} @ ${about.currently_company}`
      : about?.currently_role ?? about?.currently_company ?? "—";

  return (
    <section className="space-y-10 sm:space-y-12">
      <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16 2xl:gap-20">
        <div className="min-w-0 flex-1 lg:max-w-[62%]">
          <HeroHeading>{heading}</HeroHeading>
          <RotatingHeroLines lines={funFacts} />

          {showCurrently || showPreviously ? (
            <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8">
              {showCurrently ? (
                <div>
                  <p className="text-sm font-bold sm:text-base">
                    {about?.currently_label ?? "Currently"}
                  </p>
                  <p className="mt-1 text-sm text-foreground sm:text-base">{currently}</p>
                </div>
              ) : null}
              {showPreviously ? (
                <div>
                  <p className="text-sm font-bold sm:text-base">
                    {about?.previously_label ?? "Previously at"}
                  </p>
                  <p className="mt-1 text-sm text-foreground sm:text-base">
                    {about?.previously_companies ?? "—"}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 lg:w-[34%] lg:max-w-md lg:shrink-0 xl:max-w-lg">
          {heroImage ? (
            <div className="relative mx-auto size-32 overflow-hidden rounded-full border border-border sm:size-40 lg:mx-0 lg:size-48">
              <Image
                src={heroImage}
                alt={displayName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                priority
              />
            </div>
          ) : null}

          <div className="mt-5 space-y-3 text-center sm:mt-6 sm:space-y-4 lg:text-left">
            <h2 className="text-xl font-bold sm:text-2xl">
              {about?.greeting_text ?? "Nice to meet you!"}
            </h2>
            {about?.intro_text ? (
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {about.intro_text}
              </p>
            ) : null}

            <div className="flex items-center justify-center gap-4 lg:justify-start">
              {(Object.keys(socialIcons) as Array<Exclude<SocialLinkKey, "email">>).map(
                (key) => {
                  if (!isSocialLinkVisible(about, key)) return null;

                  const field = socialFields[key];
                  const href = about?.[field];
                  if (!href) return null;

                  const { label, icon: Icon } = socialIcons[key];

                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-foreground transition-opacity hover:opacity-70"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                }
              )}
              {isSocialLinkVisible(about, "email") && about?.email ? (
                <Link
                  href={`mailto:${about.email}`}
                  aria-label="Email"
                  className="text-foreground transition-opacity hover:opacity-70"
                >
                  <Mail className="size-5" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
