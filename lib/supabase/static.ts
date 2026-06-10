import { createAdminClient } from "@/lib/supabase/admin";

export function createStaticClient() {
  return createAdminClient();
}
