import type { SiteSettings } from "@/lib/types";

export const DEFAULT_GRAIN_OPACITY = 55;
export const MIN_GRAIN_OPACITY = 0;
export const MAX_GRAIN_OPACITY = 100;

export function getGrainOpacity(settings?: Pick<SiteSettings, "grain_opacity"> | null) {
  const value = settings?.grain_opacity;

  if (value === null || value === undefined || Number.isNaN(value)) {
    return DEFAULT_GRAIN_OPACITY;
  }

  return Math.min(MAX_GRAIN_OPACITY, Math.max(MIN_GRAIN_OPACITY, Math.round(value)));
}

/** Maps admin 0–100 to overlay opacity + contrast (speckle strength, not page wash). */
export function getGrainCssVars(
  settings?: Pick<SiteSettings, "grain_opacity"> | null,
  strengthPercent = getGrainOpacity(settings)
) {
  const strength = strengthPercent / 100;

  if (strength <= 0) {
    return {
      "--grain-opacity": "0",
      "--grain-opacity-dark": "0",
      "--grain-contrast": "1",
    } as const;
  }

  const opacity = 0.08 + strength * 0.22;
  const contrast = 0.95 + strength * 1.55;

  return {
    "--grain-opacity": String(opacity),
    "--grain-opacity-dark": String(opacity * 0.88),
    "--grain-contrast": String(contrast),
  } as const;
}
