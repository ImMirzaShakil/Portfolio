ALTER TABLE project_sections
  ADD COLUMN IF NOT EXISTS blocks_data JSONB;
