import { getGrainOpacity } from "@/lib/grain-texture";
import { createAdminClient } from "@/lib/supabase/admin";

export async function SiteTexture() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("grain_opacity")
    .limit(1)
    .maybeSingle();

  const opacity = getGrainOpacity(settings) / 100;

  if (opacity <= 0) return null;

  return (
    <svg
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        pointerEvents: "none",
        opacity,
      }}
    >
      <filter id="grain-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  );
}
