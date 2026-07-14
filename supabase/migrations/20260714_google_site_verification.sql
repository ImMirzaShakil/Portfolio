-- Google Search Console / site verification (rendered in <head> server-side)

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS google_site_verification text;

COMMENT ON COLUMN site_settings.google_site_verification IS
  'Google Search Console verification content token (or full meta tag). Rendered in HTML head.';
