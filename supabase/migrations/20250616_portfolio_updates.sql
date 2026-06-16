-- Portfolio updates: dynamic nav, featured projects, hero & section visibility

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS hero_heading TEXT,
  ADD COLUMN IF NOT EXISTS nav_items JSONB DEFAULT '[]'::jsonb;

ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS show_currently BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_previously BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS currently_label TEXT DEFAULT 'Currently',
  ADD COLUMN IF NOT EXISTS previously_label TEXT DEFAULT 'Previously at',
  ADD COLUMN IF NOT EXISTS visible_social_links TEXT[] DEFAULT ARRAY['twitter', 'linkedin', 'github', 'email']::TEXT[];

-- Default nav items (Work + About, no Fun)
UPDATE site_settings
SET nav_items = '[
  {"id": "work", "label": "Work", "href": "/work", "is_visible": true, "order_index": 0},
  {"id": "about", "label": "About", "href": "/about", "is_visible": true, "order_index": 1}
]'::jsonb
WHERE nav_items IS NULL OR nav_items = '[]'::jsonb;

-- Mark existing published projects as featured so home page keeps showing them
UPDATE projects SET is_featured = true WHERE is_published = true AND is_featured IS NOT true;
