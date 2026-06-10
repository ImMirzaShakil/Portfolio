import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/utils";

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

  const admin = createAdminClient();
  const path = "resume.pdf";

  const { error: uploadError } = await admin.storage
    .from("resume")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  const resumeUrl = getPublicImageUrl("resume", path);
  const { data: settings } = await admin
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (settings?.id) {
    const { error: updateError } = await admin
      .from("site_settings")
      .update({ resume_url: resumeUrl })
      .eq("id", settings.id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }
  }

  return Response.json({
    url: resumeUrl,
    filename: path,
    uploadedAt: new Date().toISOString(),
  });
}
