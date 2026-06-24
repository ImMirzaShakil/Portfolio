import Image from "next/image";
import { Mail } from "lucide-react";
import { ExperienceList } from "@/components/about/ExperienceList";
import { WritingList } from "@/components/about/WritingList";
import { FeaturedInList } from "@/components/about/FeaturedInList";
import { GalleryStrip } from "@/components/about/GalleryStrip";
import {
  buildOpenGraph,
  buildTwitter,
  getSiteContext,
  getSiteUrl,
} from "@/lib/metadata";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { about, siteName } = await getSiteContext();
  const title = `About ${siteName}`;
  const description =
    about?.intro_text?.trim().slice(0, 160) ??
    `Learn more about ${siteName}.`;
  const images = about?.profile_image_url
    ? [about.profile_image_url]
    : undefined;

  return {
    title,
    description,
    openGraph: buildOpenGraph({
      title,
      description,
      images,
      url: `${getSiteUrl()}/about`,
    }),
    twitter: buildTwitter({ title, description, images }),
  };
}

export default async function AboutPage() {
  const supabase = createAdminClient();

  const [
    { data: about },
    { data: settings },
    { data: experiences },
    { data: writings },
    { data: featuredIn },
  ] = await Promise.all([
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
    supabase.from("site_settings").select("site_title").limit(1).maybeSingle(),
    supabase
      .from("experiences")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("writings")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("featured_in")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  const jobs = (experiences ?? []).filter((item) => item.type === "job");
  const internships = (experiences ?? []).filter(
    (item) => item.type === "internship"
  );
  const education = (experiences ?? []).filter(
    (item) => item.type === "education"
  );

  const name = settings?.site_title ?? "Me";

  const superpowers = [
    about?.superpower_1
      ? { title: about.superpower_1, desc: about.superpower_1_desc }
      : null,
    about?.superpower_2
      ? { title: about.superpower_2, desc: about.superpower_2_desc }
      : null,
    about?.superpower_3
      ? { title: about.superpower_3, desc: about.superpower_3_desc }
      : null,
    about?.superpower_4
      ? { title: about.superpower_4, desc: about.superpower_4_desc }
      : null,
  ].filter((item): item is { title: string; desc: string | null } =>
    item !== null
  );

  const dayJobText = about?.day_job_description
    ? about.day_job_description
    : about?.currently_role && about?.currently_company
    ? `${about.currently_role} at ${about.currently_company}.`
    : about?.currently_role ?? about?.currently_company ?? null;

  const outOfOfficeText =
    about?.out_of_office_text ?? about?.previously_companies ?? null;

  const galleryImages = about?.gallery_images ?? [];

  const visibleLinks = about?.visible_social_links ?? ["twitter", "linkedin", "email"];

  return (
    <div className="py-8 md:py-12">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-8 md:flex-row md:items-start md:gap-14 pb-12 md:pb-16">
        {about?.profile_image_url ? (
          <div
            className="relative mx-auto shrink-0 overflow-hidden md:mx-0"
            style={{ width: 300, height: 416 }}
          >
            <Image
              src={about.profile_image_url}
              alt={name ? `Photo of ${name}` : "Profile photo"}
              fill
              className="object-cover"
              sizes="300px"
              priority
            />
          </div>
        ) : null}

        <div className="space-y-6">
          <div>
            <h1 className="font-hero text-6xl font-bold leading-tight md:text-7xl">
              Hello,
            </h1>
            <p className="font-sans text-6xl font-bold leading-tight text-muted-foreground md:text-7xl">
              I&apos;m {name}
            </p>
          </div>

          {about?.pronunciation ? (
            <p className="text-lg text-muted-foreground">
              {about.pronunciation}
            </p>
          ) : null}

          {about?.intro_text ? (
            <p className="max-w-xl text-lg leading-relaxed">
              {about.intro_text}
            </p>
          ) : null}

          {(dayJobText || outOfOfficeText) ? (
            <div className="grid grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-2">
              {dayJobText ? (
                <div>
                  <p className="mb-2 text-base font-semibold">Day job</p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {dayJobText}
                  </p>
                </div>
              ) : null}
              {outOfOfficeText ? (
                <div>
                  <p className="mb-2 text-base font-semibold">Out of office</p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {outOfOfficeText}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Social links */}
          <div className="flex items-center gap-4 pt-1">
            {about?.twitter_url && visibleLinks.includes("twitter") ? (
              <a
                href={about.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                <XIcon className="size-6" />
              </a>
            ) : null}
            {about?.linkedin_url && visibleLinks.includes("linkedin") ? (
              <a
                href={about.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                <LinkedInIcon className="size-6" />
              </a>
            ) : null}
            {about?.github_url && visibleLinks.includes("github") ? (
              <a
                href={about.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                <GitHubIcon className="size-6" />
              </a>
            ) : null}
            {about?.email && visibleLinks.includes("email") ? (
              <a
                href={`mailto:${about.email}`}
                aria-label="Email"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                <Mail className="size-6" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── My super powers ──────────────────────────────── */}
      {superpowers.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">My super powers</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {superpowers.map((sp) => (
              <div key={sp.title}>
                <p className="font-semibold">{sp.title}</p>
                {sp.desc ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {sp.desc}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Gallery strip ────────────────────────────────── */}
      {galleryImages.length > 0 ? (
        <GalleryStrip images={galleryImages} />
      ) : null}

      {/* ── Featured in ──────────────────────────────────── */}
      {(featuredIn ?? []).length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Featured in</h2>
          </div>
          <FeaturedInList items={featuredIn ?? []} />
        </section>
      ) : null}

      {/* ── Experience ───────────────────────────────────── */}
      {jobs.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>
          <ExperienceList experiences={jobs} />
        </section>
      ) : null}

      {/* ── Internships ──────────────────────────────────── */}
      {internships.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Internships</h2>
            {about?.internships_description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {about.internships_description}
              </p>
            ) : null}
          </div>
          <ExperienceList experiences={internships} />
        </section>
      ) : null}

      {/* ── Writing ──────────────────────────────────────── */}
      {(writings ?? []).length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Writing</h2>
          </div>
          <WritingList writings={writings ?? []} />
        </section>
      ) : null}

      {/* ── Education ────────────────────────────────────── */}
      {education.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Education</h2>
          </div>
          <ExperienceList experiences={education} />
        </section>
      ) : null}
    </div>
  );
}
