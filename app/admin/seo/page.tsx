import { PageSeoForm } from "@/components/admin/PageSeoForm";
import { getSiteContext } from "@/lib/metadata";
import type { StaticSeoPageId } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSeoPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const { about, siteName } = await getSiteContext();
  const role = about?.currently_role ?? "Software Engineer";
  const company = about?.currently_company
    ? ` at ${about.currently_company}`
    : "";
  const profileImage = about?.profile_image_url ?? undefined;
  const homeImage =
    settings?.profile_image_url ?? profileImage ?? undefined;

  const placeholders: Record<
    StaticSeoPageId,
    { title: string; description: string; image_url?: string }
  > = {
    home: {
      title: settings?.site_title ?? siteName,
      description:
        about?.intro_text?.trim().slice(0, 160) ||
        `${role}${company} — portfolio and selected work.`,
      image_url: homeImage
        ? "home / about profile image"
        : "no image fallback",
    },
    work: {
      title: `Work · ${settings?.site_title ?? siteName}`,
      description:
        about?.intro_text?.trim().slice(0, 160) ||
        `${role}${company} — portfolio and selected work.`,
      image_url: profileImage
        ? "about profile image"
        : "no image fallback",
    },
    about: {
      title: `About ${siteName}`,
      description:
        about?.intro_text?.trim().slice(0, 160) ||
        `Learn more about ${siteName}.`,
      image_url: profileImage
        ? "about profile image"
        : "no image fallback",
    },
    fun: {
      title: `Fun · ${settings?.site_title ?? siteName}`,
      description: `Experimental work and side projects by ${siteName}.`,
      image_url: profileImage
        ? "about profile image"
        : "no image fallback",
    },
  };

  return <PageSeoForm settings={settings} placeholders={placeholders} />;
}
