import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: string): string {
  return year.trim();
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPublicImageUrl(bucket: string, path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const normalizedPath = path.replace(/^\/+/, "");

  return `${baseUrl}/storage/v1/object/public/${bucket}/${normalizedPath}`;
}
