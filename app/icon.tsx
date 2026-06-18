import { fetchSiteIconResponse } from "@/lib/site-icon";

export const dynamic = "force-dynamic";
export const size = { width: 32, height: 32 };

export default async function Icon() {
  return fetchSiteIconResponse();
}
