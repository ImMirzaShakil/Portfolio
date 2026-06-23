import { getGrainCssVars } from "@/lib/grain-texture";
import { createAdminClient } from "@/lib/supabase/admin";

export async function SiteTexture() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("grain_opacity")
    .limit(1)
    .maybeSingle();

  return (
    <div
      className="site-texture"
      aria-hidden="true"
      style={getGrainCssVars(settings) as React.CSSProperties}
    />
  );
}
