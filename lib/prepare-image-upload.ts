import { MAX_IMAGE_UPLOAD_BYTES } from "@/lib/upload-requirements";

const HEIC_EXTENSIONS = new Set(["heic", "heif"]);
const HEIC_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

export function isHeicFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime = file.type.toLowerCase();

  return HEIC_EXTENSIONS.has(extension) || HEIC_MIME_TYPES.has(mime);
}

export function validateImageUpload(file: File) {
  if (!file.type.startsWith("image/") && !isHeicFile(file)) {
    return "Only image files are supported.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Image must be 20 MB or smaller.";
  }

  return null;
}

/** Converts iPhone HEIC/HEIF to JPEG so uploads and browsers work everywhere. */
export async function prepareImageForUpload(file: File): Promise<File> {
  const validationError = validateImageUpload(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (!isHeicFile(file)) {
    return file;
  }

  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;
  const baseName = file.name.replace(/\.[^.]+$/i, "") || "photo";

  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
