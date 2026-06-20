import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();

  const [{ data: settings }, { data: about }] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase
      .from("about_content")
      .select("id, greeting_text, fun_facts")
      .limit(1)
      .maybeSingle(),
  ]);

  return <SiteSettingsForm settings={settings} about={about} />;
}
