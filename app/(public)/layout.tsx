import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createAdminClient();

  const [{ data: settings }, { data: about }] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        siteTitle={settings?.site_title}
        logoUrl={settings?.logo_url}
        logoUrlDark={settings?.logo_url_dark}
        resumeUrl={settings?.resume_url}
        navItems={settings?.nav_items}
      />
      <main className="site-container flex-1 py-8 sm:py-10 lg:py-12">
        {children}
      </main>
      <Footer settings={settings} about={about} />
    </div>
  );
}
