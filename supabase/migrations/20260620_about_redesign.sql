-- About page redesign: new fields for richer content matching reference layout

-- Extend about_content table
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS pronunciation TEXT,
  ADD COLUMN IF NOT EXISTS day_job_description TEXT,
  ADD COLUMN IF NOT EXISTS out_of_office_text TEXT,
  ADD COLUMN IF NOT EXISTS superpower_1_desc TEXT,
  ADD COLUMN IF NOT EXISTS superpower_2_desc TEXT,
  ADD COLUMN IF NOT EXISTS superpower_3_desc TEXT,
  ADD COLUMN IF NOT EXISTS superpower_4 TEXT,
  ADD COLUMN IF NOT EXISTS superpower_4_desc TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS internships_description TEXT;

-- Add description/excerpt to writings
ALTER TABLE writings
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Featured In section table
CREATE TABLE IF NOT EXISTS featured_in (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  publication TEXT,
  content_type TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for featured_in
ALTER TABLE featured_in ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read featured_in" ON featured_in;
CREATE POLICY "Public read featured_in"
  ON featured_in FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated write featured_in" ON featured_in;
CREATE POLICY "Authenticated write featured_in"
  ON featured_in FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
