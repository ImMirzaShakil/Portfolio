import { MAX_RESUME_UPLOAD_BYTES } from "@/lib/upload-requirements";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function getStoragePathFromPublicUrl(url: string | null | undefined) {
  if (!url) return null;

  try {
    const pathname = new URL(url).pathname;
    const marker = "/storage/v1/object/public/resume/";
    const index = pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(pathname.slice(index + marker.length));
  } catch {
    return null;
  }
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

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_RESUME_UPLOAD_BYTES) {
    return Response.json({ error: "PDF must be 10 MB or smaller." }, { status: 400 });
  }

  const admin = createAdminClient();
  const path = `resume-${Date.now()}.pdf`;

  const { data: settings } = await admin
    .from("site_settings")
    .select("id, resume_url")
    .limit(1)
    .maybeSingle();

  const { error: uploadError } = await admin.storage
    .from("resume")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/pdf",
    });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  // Cache-bust so browsers/CDNs don't keep serving the previous PDF
  const resumeUrl = `${getPublicImageUrl("resume", path)}?v=${Date.now()}`;

  if (settings?.id) {
    const { error: updateError } = await admin
      .from("site_settings")
      .update({ resume_url: resumeUrl })
      .eq("id", settings.id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }
  }

  const oldPath = getStoragePathFromPublicUrl(settings?.resume_url);
  if (oldPath && oldPath !== path) {
    await admin.storage.from("resume").remove([oldPath]);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/resume");

  return Response.json({
    url: resumeUrl,
    filename: path,
    uploadedAt: new Date().toISOString(),
  });
}
