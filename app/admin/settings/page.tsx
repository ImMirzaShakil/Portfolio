import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return <SiteSettingsForm settings={settings} />;
}
