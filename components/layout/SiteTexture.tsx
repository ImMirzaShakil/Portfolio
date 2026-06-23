import { getGrainOpacityDecimal } from "@/lib/grain-texture";
import { createAdminClient } from "@/lib/supabase/admin";

export async function SiteTexture() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("grain_opacity")
    .limit(1)
    .maybeSingle();

  const opacity = getGrainOpacityDecimal(settings);

  return (
    <div
      className="site-texture"
      aria-hidden="true"
      style={
        {
          "--grain-opacity": opacity,
          "--grain-opacity-dark": opacity * 0.8,
        } as React.CSSProperties
      }
    />
  );
}
