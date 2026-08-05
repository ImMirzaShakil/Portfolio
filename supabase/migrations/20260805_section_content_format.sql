-- Per-section body format: plain text or HTML
ALTER TABLE project_sections
  ADD COLUMN IF NOT EXISTS content_format TEXT DEFAULT 'text';
