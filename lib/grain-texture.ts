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

/**
 * Maps admin 0–100 to CSS opacity vars.
 * Blend modes (multiply / screen) are set in CSS — they vary by light/dark theme.
 */
export function getGrainCssVars(
  settings?: Pick<SiteSettings, "grain_opacity"> | null,
  strengthPercent = getGrainOpacity(settings)
) {
  const opacity = strengthPercent / 100;

  return {
    "--grain-opacity": String(opacity),
  } as const;
}
