"use client";

import Image from "next/image";
import { HeroHeading } from "@/components/home/HeroHeading";
import { RotatingHeroLines } from "@/components/home/RotatingHeroLines";
import { SocialLinks } from "@/components/social/SocialLinks";
import type { AboutContent } from "@/lib/types";

interface HeroSectionProps {
  name?: string | null;
  heroHeading?: string | null;
  profileImageUrl?: string | null;
  about?: AboutContent | null;
  funFacts: string[];
}

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

            <SocialLinks
              about={about}
              placement="hero"
              className="flex items-center justify-center gap-4 lg:justify-start"
              linkClassName="text-foreground transition-opacity hover:opacity-70"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
