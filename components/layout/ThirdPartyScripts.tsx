import { ScriptInjector } from "@/components/layout/ScriptInjector";
import { isGoogleVerificationOnlySnippet } from "@/lib/site-verification";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CustomScript } from "@/lib/types";

export async function ThirdPartyScripts() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select(
      "google_analytics_snippet, meta_pixel_snippet, hotjar_snippet, custom_scripts"
    )
    .limit(1)
    .maybeSingle();

  if (!settings) {
    return null;
  }

  const customScripts = (settings.custom_scripts as CustomScript[] | null) ?? [];
  const snippets = [
    settings.google_analytics_snippet,
    settings.meta_pixel_snippet,
    settings.hotjar_snippet,
    ...customScripts.map((script) => script.code),
  ].filter((snippet): snippet is string => {
    if (!snippet?.trim()) return false;
    // Verification meta must be in SSR <head>, not injected after JS loads.
    if (isGoogleVerificationOnlySnippet(snippet)) return false;
    return true;
  });

  if (snippets.length === 0) {
    return null;
  }

  return <ScriptInjector snippets={snippets} />;
}
