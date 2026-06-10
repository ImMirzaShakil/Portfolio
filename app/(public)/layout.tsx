import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const [{ data: settings }, { data: about }] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar siteTitle={settings?.site_title} resumeUrl={settings?.resume_url} />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-12 md:px-12">
        {children}
      </main>
      <Footer settings={settings} about={about} />
    </div>
  );
}
