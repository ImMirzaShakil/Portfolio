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
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {children}
      </main>
      <Footer settings={settings} about={about} />
    </div>
  );
}
