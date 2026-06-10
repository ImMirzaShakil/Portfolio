import { AboutForm } from "@/components/admin/AboutForm";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminAboutPage() {
  const supabase = createAdminClient();

  const [{ data: about }, { data: settings }] = await Promise.all([
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);

  return <AboutForm about={about} settings={settings} />;
}
