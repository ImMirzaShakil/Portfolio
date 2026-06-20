-- Add home page profile image to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
