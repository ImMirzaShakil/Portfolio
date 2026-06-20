import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/favicon.ico") {
    return NextResponse.rewrite(new URL("/icon", request.url));
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const { supabaseResponse, user } = await updateSession(request);

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/favicon.ico", "/admin", "/admin/((?!login).*)"],
};
