import { getSiteContext, getSiteUrl } from "@/lib/metadata";

function guessContentType(url: string) {
  if (url.endsWith(".svg")) return "image/svg+xml";
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

export async function fetchSiteIconResponse() {
  const { settings } = await getSiteContext();
  const logoUrl = settings?.logo_url?.trim();

  if (logoUrl) {
    const response = await fetch(logoUrl, { cache: "no-store" });

    if (response.ok) {
      const contentType =
        response.headers.get("content-type") ?? guessContentType(logoUrl);

      return new Response(await response.arrayBuffer(), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }
  }

  const fallback = await fetch(`${getSiteUrl()}/favicon.svg`, {
    cache: "no-store",
  });

  return new Response(await fallback.arrayBuffer(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
