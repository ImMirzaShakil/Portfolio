export const DEFAULT_THUMBNAIL_ASPECT = "4/3";

export const THUMBNAIL_ASPECT_OPTIONS = [
  {
    value: "4/3",
    label: "4:3 — landscape (default)",
    className: "aspect-[4/3]",
  },
  {
    value: "16/9",
    label: "16:9 — widescreen",
    className: "aspect-[16/9]",
  },
  {
    value: "3/2",
    label: "3:2 — classic photo",
    className: "aspect-[3/2]",
  },
  {
    value: "1/1",
    label: "1:1 — square",
    className: "aspect-[1/1]",
  },
  {
    value: "3/4",
    label: "3:4 — portrait",
    className: "aspect-[3/4]",
  },
  {
    value: "4/5",
    label: "4:5 — tall",
    className: "aspect-[4/5]",
  },
] as const;

export type ThumbnailAspectRatio =
  (typeof THUMBNAIL_ASPECT_OPTIONS)[number]["value"];

export function normalizeThumbnailAspectRatio(
  value?: string | null
): ThumbnailAspectRatio {
  const match = THUMBNAIL_ASPECT_OPTIONS.find(
    (option) => option.value === value
  );
  return match?.value ?? DEFAULT_THUMBNAIL_ASPECT;
}

export function getThumbnailAspectClass(value?: string | null): string {
  const ratio = normalizeThumbnailAspectRatio(value);
  return (
    THUMBNAIL_ASPECT_OPTIONS.find((option) => option.value === ratio)
      ?.className ?? "aspect-[4/3]"
  );
}
