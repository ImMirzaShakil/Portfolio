import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createUnlockToken,
  getProjectUnlockCookieName,
  PROJECT_UNLOCK_MAX_AGE_SECONDS,
  verifyProjectPassword,
} from "@/lib/project-password";

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function POST(request: Request, { params }: RouteContext) {
  let password = "";

  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: project } = await supabase
    .from("projects")
    .select("slug, is_password_protected, password_hash, is_published")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!project?.is_published) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  if (!project.is_password_protected || !project.password_hash) {
    return NextResponse.json(
      { error: "This project is not password protected." },
      { status: 400 }
    );
  }

  const isValid = await verifyProjectPassword(password, project.password_hash);

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createUnlockToken(project.slug);
  const response = NextResponse.json({ success: true });

  response.cookies.set(getProjectUnlockCookieName(project.slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PROJECT_UNLOCK_MAX_AGE_SECONDS,
    path: `/projects/${project.slug}`,
  });

  return response;
}
