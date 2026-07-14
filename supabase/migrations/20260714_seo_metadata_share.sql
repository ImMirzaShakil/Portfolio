-- SEO metadata for static pages + projects, and share-button visibility

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS page_seo jsonb DEFAULT '{}'::jsonb;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{}'::jsonb;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS show_share_button boolean DEFAULT true;

COMMENT ON COLUMN site_settings.page_seo IS
  'Per-page SEO overrides keyed by page id (home, work, about, fun). Each page maps platforms to title/description/image.';

COMMENT ON COLUMN projects.seo IS
  'Per-project SEO overrides keyed by platform (google, facebook, twitter, etc.).';

COMMENT ON COLUMN projects.show_share_button IS
  'When true, show a share icon on project cards for this project.';
