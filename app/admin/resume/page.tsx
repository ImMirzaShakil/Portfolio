import { ResumeUpload } from "@/components/admin/ResumeUpload";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminResumePage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("resume_url")
    .limit(1)
    .maybeSingle();

  return <ResumeUpload initialResumeUrl={settings?.resume_url} />;
}
