-- Rich case-study section fields for Menti-style layouts
ALTER TABLE project_sections
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS layout TEXT,
  ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::JSONB;
