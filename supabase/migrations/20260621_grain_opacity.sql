-- Grain texture visibility (0–100, admin slider)
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS grain_opacity INTEGER DEFAULT 55;
