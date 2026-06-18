import { fetchSiteIconResponse } from "@/lib/site-icon";

export const dynamic = "force-dynamic";
export const size = { width: 180, height: 180 };

export default async function AppleIcon() {
  return fetchSiteIconResponse();
}
