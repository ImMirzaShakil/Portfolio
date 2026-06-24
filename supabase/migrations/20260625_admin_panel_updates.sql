-- Encrypted password for admin display (verification still uses password_hash)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS password_encrypted TEXT;

-- About page section visibility
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS show_experience BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_internships BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_education BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_writing BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_featured_in BOOLEAN NOT NULL DEFAULT true;

-- Per-item visibility
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE writings
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE featured_in
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;

-- Analytics / tracking snippets
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS google_analytics_snippet TEXT,
  ADD COLUMN IF NOT EXISTS meta_pixel_snippet TEXT,
  ADD COLUMN IF NOT EXISTS hotjar_snippet TEXT,
  ADD COLUMN IF NOT EXISTS custom_scripts JSONB NOT NULL DEFAULT '[]'::jsonb;
