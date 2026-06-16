-- Site logo for navbar
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT;
