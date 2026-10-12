import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/project/ProjectCaseStudy";
import { ProjectPasswordGate } from "@/components/project/ProjectPasswordGate";
import { getSiteContext, getSiteUrl } from "@/lib/metadata";
import {
  getProjectUnlockCookieName,
  hasProjectUnlockAccess,
} from "@/lib/project-password";
import { buildPageMetadata, normalizeSharedSeo } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    preview?: string;
  };
}

export const dynamic = "force-dynamic";

/** `?preview=1` from a logged-in admin shows drafts and skips the password gate. */
async function isAdminPreview(searchParams?: ProjectPageProps["searchParams"]) {
  if (searchParams?.preview !== "1") return false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

async function getProject(slug: string, allowDraft = false) {
  const supabase = createAdminClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !project || (!project.is_published && !allowDraft)) {
    return null;
  }

  const { data: sections } = await supabase
    .from("project_sections")
    .select("*")
    .eq("project_id", project.id)
    .order("order_index", { ascending: true });

  return { project, sections: sections ?? [] };
}

function hasUnlockAccess(slug: string) {
  const cookieStore = cookies();
  const token = cookieStore.get(getProjectUnlockCookieName(slug))?.value;
  return hasProjectUnlockAccess(slug, token);
}

export async function generateStaticParams() {
  const supabase = createStaticClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_published", true);

  return (projects ?? []).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ProjectPageProps): Promise<Metadata> {
  const preview = await isAdminPreview(searchParams);
  const data = await getProject(params.slug, preview);

  if (!data) {
    return {
      title: "Project not found",
    };
  }

  const { project } = data;

  if (preview) {
    return {
      title: `Preview: ${project.title}`,
      robots: { index: false, follow: false },
    };
  }

  if (project.is_password_protected && !hasUnlockAccess(project.slug)) {
    return {
      title: "Password protected",
      description: "This project requires a password to view.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    project.subtitle ?? project.summary ?? `Case study: ${project.title}`;
  const { siteName } = await getSiteContext();

  return buildPageMetadata(normalizeSharedSeo(project.seo), {
    title: project.title,
    description,
    image: project.cover_image_url,
    url: `${getSiteUrl()}/projects/${project.slug}`,
    siteName,
  });
}

export default async function ProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  const preview = await isAdminPreview(searchParams);
  const data = await getProject(params.slug, preview);

  if (!data) {
    notFound();
  }

  const { project, sections } = data;

  if (
    !preview &&
    project.is_password_protected &&
    !hasUnlockAccess(project.slug)
  ) {
    return <ProjectPasswordGate slug={project.slug} />;
  }

  return (
    <>
      {preview ? (
        <div className="fixed left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full border border-border bg-background/90 px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur">
          {project.is_published ? "Admin preview" : "Draft preview"} · only you
          can see this
        </div>
      ) : null}
      <ProjectCaseStudy project={project} sections={sections} />
    </>
  );
}
