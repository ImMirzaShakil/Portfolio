import { isHeicFile } from "@/lib/prepare-image-upload";
import {
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_BYTES,
} from "@/lib/upload-requirements";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/utils";

const ALLOWED_BUCKETS = ["project-images", "resume"] as const;

function isImageFile(file: File) {
  return file.type.startsWith("image/") || isHeicFile(file);
}

function isVideoFile(file: File) {
  return (
    file.type.startsWith("video/") ||
    /\.(mp4|webm|mov)$/i.test(file.name)
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = (formData.get("bucket") as string) || "project-images";
  const mediaType = (formData.get("mediaType") as string) || "image";

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_BUCKETS.includes(bucket as (typeof ALLOWED_BUCKETS)[number])) {
    return Response.json({ error: "Invalid storage bucket" }, { status: 400 });
  }

  if (bucket === "project-images") {
    if (mediaType === "video") {
      if (!isVideoFile(file)) {
        return Response.json(
          { error: "Only video files (MP4, WebM, MOV) are supported." },
          { status: 400 }
        );
      }

      if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
        return Response.json(
          { error: "Video must be 80 MB or smaller." },
          { status: 400 }
        );
      }
    } else if (!isImageFile(file)) {
      return Response.json(
        { error: "Only image files are supported." },
        { status: 400 }
      );
    } else if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      return Response.json(
        { error: "File must be 20 MB or smaller." },
        { status: 400 }
      );
    }
  } else if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return Response.json(
      { error: "File must be 20 MB or smaller." },
      { status: 400 }
    );
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const admin = createAdminClient();

  const { error } = await admin.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: bucket === "resume",
    contentType: file.type || undefined,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    url: getPublicImageUrl(bucket, path),
    path,
  });
}
