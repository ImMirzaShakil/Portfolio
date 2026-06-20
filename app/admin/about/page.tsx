import { AboutForm } from "@/components/admin/AboutForm";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminAboutPage() {
  const supabase = createAdminClient();

  const [
    { data: about },
    { data: featuredIn },
    { data: experiences },
    { data: writings },
  ] = await Promise.all([
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
    supabase
      .from("featured_in")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("experiences")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("writings")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  return (
    <AboutForm
      about={about}
      featuredIn={featuredIn ?? []}
      experiences={experiences ?? []}
      writings={writings ?? []}
    />
  );
}
