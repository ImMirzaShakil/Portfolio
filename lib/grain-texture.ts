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

export function getGrainOpacityDecimal(
  settings?: Pick<SiteSettings, "grain_opacity"> | null
) {
  return getGrainOpacity(settings) / 100;
}
