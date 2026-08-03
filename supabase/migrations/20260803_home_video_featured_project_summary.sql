-- Homepage YouTube video section (site_settings)
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS home_video_section_title TEXT,
  ADD COLUMN IF NOT EXISTS home_video_youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS home_video_title TEXT,
  ADD COLUMN IF NOT EXISTS home_video_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS show_home_video BOOLEAN NOT NULL DEFAULT false;

-- Featured In on homepage toggle (about_content)
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS show_featured_in_home BOOLEAN NOT NULL DEFAULT false;

-- Blueprint-style project summary fields
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS problem_text TEXT,
  ADD COLUMN IF NOT EXISTS outcome_text TEXT,
  ADD COLUMN IF NOT EXISTS impact_text TEXT,
  ADD COLUMN IF NOT EXISTS role_text TEXT,
  ADD COLUMN IF NOT EXISTS timeline_text TEXT,
  ADD COLUMN IF NOT EXISTS team_text TEXT;
