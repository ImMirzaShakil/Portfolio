export const DEFAULT_THUMBNAIL_ASPECT = "4/3";

export const THUMBNAIL_ASPECT_OPTIONS = [
  {
    value: "4/3",
    label: "4:3 — landscape (default)",
  },
  {
    value: "16/9",
    label: "16:9 — widescreen",
  },
  {
    value: "3/2",
    label: "3:2 — classic photo",
  },
  {
    value: "1/1",
    label: "1:1 — square",
  },
  {
    value: "3/4",
    label: "3:4 — portrait",
  },
  {
    value: "4/5",
    label: "4:5 — tall",
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

/** CSS `aspect-ratio` value — preferred over Tailwind classes so all ratios work. */
export function getThumbnailAspectRatio(
  value?: string | null
): ThumbnailAspectRatio {
  return normalizeThumbnailAspectRatio(value);
}
