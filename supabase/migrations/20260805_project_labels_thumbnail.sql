-- Editable Problem/Outcome labels + separate card thumbnail
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS problem_label TEXT DEFAULT 'Problem',
  ADD COLUMN IF NOT EXISTS outcome_label TEXT DEFAULT 'Outcome',
  ADD COLUMN IF NOT EXISTS thumbnail_image_url TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_aspect_ratio TEXT DEFAULT '4/3';
