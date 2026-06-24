-- Per-placement social link visibility + Facebook / Instagram
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS visible_social_links_hero TEXT[],
  ADD COLUMN IF NOT EXISTS visible_social_links_footer TEXT[];

-- Copy legacy visibility into both placements (including empty arrays)
UPDATE about_content
SET visible_social_links_hero = visible_social_links
WHERE visible_social_links_hero IS NULL
  AND visible_social_links IS NOT NULL;

UPDATE about_content
SET visible_social_links_footer = visible_social_links
WHERE visible_social_links_footer IS NULL
  AND visible_social_links IS NOT NULL;
