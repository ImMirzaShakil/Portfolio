-- Separate homepage intro from about-page intro
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS home_intro_text TEXT;

-- Backfill so the homepage keeps showing existing copy until edited separately
UPDATE about_content
SET home_intro_text = intro_text
WHERE home_intro_text IS NULL
  AND intro_text IS NOT NULL;
