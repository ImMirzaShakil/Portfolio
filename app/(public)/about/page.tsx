import Image from "next/image";
import { ExperienceList } from "@/components/about/ExperienceList";
import { WritingList } from "@/components/about/WritingList";
import { FeaturedInList } from "@/components/about/FeaturedInList";
import { GalleryStrip } from "@/components/about/GalleryStrip";
import { SocialLinks } from "@/components/social/SocialLinks";
import {
  buildOpenGraph,
  buildTwitter,
  getSiteContext,
  getSiteUrl,
} from "@/lib/metadata";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

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

  const jobs = (experiences ?? []).filter(
    (item) => item.type === "job" && item.is_visible !== false
  );
  const internships = (experiences ?? []).filter(
    (item) => item.type === "internship" && item.is_visible !== false
  );
  const education = (experiences ?? []).filter(
    (item) => item.type === "education" && item.is_visible !== false
  );
  const visibleFeaturedIn = (featuredIn ?? []).filter(
    (item) => item.is_visible !== false
  );
  const visibleWritings = (writings ?? []).filter(
    (item) => item.is_visible !== false
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

          <SocialLinks
            about={about}
            placement="hero"
            className="flex items-center gap-4 pt-1"
            iconClassName="size-6"
            linkClassName="text-foreground/60 transition-colors hover:text-foreground"
          />
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
      {about?.show_featured_in !== false && visibleFeaturedIn.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Featured in</h2>
          </div>
          <FeaturedInList items={visibleFeaturedIn} />
        </section>
      ) : null}

      {/* ── Experience ───────────────────────────────────── */}
      {about?.show_experience !== false && jobs.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>
          <ExperienceList experiences={jobs} />
        </section>
      ) : null}

      {/* ── Internships ──────────────────────────────────── */}
      {about?.show_internships !== false && internships.length > 0 ? (
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
      {about?.show_writing !== false && visibleWritings.length > 0 ? (
        <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[220px_1fr] md:py-16">
          <div>
            <h2 className="text-2xl font-bold">Writing</h2>
          </div>
          <WritingList writings={visibleWritings} />
        </section>
      ) : null}

      {/* ── Education ────────────────────────────────────── */}
      {about?.show_education !== false && education.length > 0 ? (
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
