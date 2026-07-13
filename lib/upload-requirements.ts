export const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 80 * 1024 * 1024;
export const MAX_RESUME_UPLOAD_BYTES = 10 * 1024 * 1024;

export const SUPPORTED_IMAGE_FORMATS =
  "JPG, PNG, WebP, GIF, HEIC/HEIF";

export type UploadKind =
  | "image"
  | "project-cover"
  | "gallery"
  | "logo"
  | "resume"
  | "video";

export interface UploadRequirements {
  formats: string;
  maxSizeLabel: string;
  notes: string[];
}

function formatMegabytes(bytes: number) {
  return `${bytes / (1024 * 1024)} MB`;
}

export function getUploadRequirements(kind: UploadKind): UploadRequirements {
  const imageMax = formatMegabytes(MAX_IMAGE_UPLOAD_BYTES);
  const videoMax = formatMegabytes(MAX_VIDEO_UPLOAD_BYTES);
  const resumeMax = formatMegabytes(MAX_RESUME_UPLOAD_BYTES);

  switch (kind) {
    case "project-cover":
      return {
        formats: SUPPORTED_IMAGE_FORMATS,
        maxSizeLabel: imageMax,
        notes: [
          "GIFs play as animated thumbnails on project cards.",
          "HEIC/HEIF from iPhone is auto-converted to JPG.",
        ],
      };
    case "gallery":
      return {
        formats: SUPPORTED_IMAGE_FORMATS,
        maxSizeLabel: imageMax,
        notes: [
          "Upload multiple photos at once.",
          "HEIC/HEIF from iPhone is auto-converted to JPG.",
        ],
      };
    case "logo":
      return {
        formats: "PNG, SVG, WebP, JPG",
        maxSizeLabel: imageMax,
        notes: ["Use a transparent PNG or SVG for best results."],
      };
    case "resume":
      return {
        formats: "PDF",
        maxSizeLabel: resumeMax,
        notes: ["Replaces the current resume linked in the navbar."],
      };
    case "video":
      return {
        formats: "MP4, WebM, MOV",
        maxSizeLabel: videoMax,
        notes: [
          "Prefer compressed MP4 for faster loading.",
          "You can also paste an external video URL instead of uploading.",
        ],
      };
    case "image":
    default:
      return {
        formats: SUPPORTED_IMAGE_FORMATS,
        maxSizeLabel: imageMax,
        notes: ["HEIC/HEIF from iPhone is auto-converted to JPG."],
      };
  }
}
