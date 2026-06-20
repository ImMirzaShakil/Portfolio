import { fetchSiteIconResponse } from "@/lib/site-icon";

export const dynamic = "force-dynamic";

export async function GET() {
  return fetchSiteIconResponse();
}
