import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/project/ProjectCaseStudy";
import { ProjectPasswordGate } from "@/components/project/ProjectPasswordGate";
import { getSiteContext, getSiteUrl } from "@/lib/metadata";
import {
  getProjectUnlockCookieName,
  hasProjectUnlockAccess,
} from "@/lib/project-password";
import { buildPageMetadata, type PagePlatformSeo } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  const supabase = createAdminClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !project || !project.is_published) {
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
}: ProjectPageProps): Promise<Metadata> {
  const data = await getProject(params.slug);

  if (!data) {
    return {
      title: "Project not found",
    };
  }

  const { project } = data;

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

  return buildPageMetadata(project.seo as PagePlatformSeo | null, {
    title: project.title,
    description,
    image: project.cover_image_url,
    url: `${getSiteUrl()}/projects/${project.slug}`,
    siteName,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const data = await getProject(params.slug);

  if (!data) {
    notFound();
  }

  const { project, sections } = data;

  if (project.is_password_protected && !hasUnlockAccess(project.slug)) {
    return <ProjectPasswordGate slug={project.slug} />;
  }

  return <ProjectCaseStudy project={project} sections={sections} />;
}
