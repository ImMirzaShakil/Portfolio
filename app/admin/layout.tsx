import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const adminClient = createAdminClient();
  const { data: settings } = await adminClient
    .from("site_settings")
    .select("site_title")
    .limit(1)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-background md:flex">
      <AdminSidebar siteTitle={settings?.site_title} />
      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
