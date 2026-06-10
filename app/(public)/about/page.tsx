import Image from "next/image";
import { Rocket, Sparkles, Zap } from "lucide-react";
import { ExperienceList } from "@/components/about/ExperienceList";
import { WritingList } from "@/components/about/WritingList";
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

const superpowerIcons = [Zap, Sparkles, Rocket];

export default async function AboutPage() {
  const supabase = createAdminClient();

  const [{ data: about }, { data: settings }, { data: experiences }, { data: writings }] =
    await Promise.all([
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
    ]);

  const jobs = (experiences ?? []).filter((item) => item.type === "job");
  const internships = (experiences ?? []).filter(
    (item) => item.type === "internship"
  );
  const education = (experiences ?? []).filter(
    (item) => item.type === "education"
  );

  const superpowers = [
    about?.superpower_1,
    about?.superpower_2,
    about?.superpower_3,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="space-y-16">
      <section className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        {about?.profile_image_url ? (
          <div className="relative mx-auto size-40 shrink-0 overflow-hidden rounded-full border border-border md:mx-0 md:size-48">
            <Image
              src={about.profile_image_url}
              alt={
                settings?.site_title
                  ? `Profile photo of ${settings.site_title}`
                  : "Profile photo"
              }
              fill
              className="object-cover"
              sizes="(max-width: 768px) 160px, 192px"
              priority
            />
          </div>
        ) : null}

        <div className="space-y-4">
          <h1 className="text-4xl font-bold md:text-5xl">About</h1>
          {about?.intro_text ? (
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {about.intro_text}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Day job</h2>
        <p className="text-base">
          {about?.currently_role && about?.currently_company
            ? `${about.currently_role} @ ${about.currently_company}`
            : about?.currently_role ?? about?.currently_company ?? "—"}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Out of office</h2>
        <p className="text-base text-muted-foreground">
          {about?.previously_companies ?? "—"}
        </p>
      </section>

      {superpowers.length > 0 ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">My super powers</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {superpowers.map((superpower, index) => {
              const Icon = superpowerIcons[index] ?? Sparkles;

              return (
                <div
                  key={superpower}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <Icon className="mb-4 size-6 text-foreground" />
                  <p className="text-base leading-relaxed">{superpower}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <ExperienceList title="Experience" experiences={jobs} />
      <ExperienceList title="Internships" experiences={internships} />
      <WritingList writings={writings ?? []} />
      <ExperienceList title="Education" experiences={education} />
    </div>
  );
}
