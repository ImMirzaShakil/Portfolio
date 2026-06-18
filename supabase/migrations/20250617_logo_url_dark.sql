-- Dark mode site logo for navbar
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS logo_url_dark TEXT;
