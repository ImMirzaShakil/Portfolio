-- Luthor visual-editor state for Content sections (Lexical JSON + markdown).
ALTER TABLE project_sections
  ADD COLUMN IF NOT EXISTS luthor_data JSONB;
