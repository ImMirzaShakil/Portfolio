-- Password protection for project case studies
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS is_password_protected BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS password_hash TEXT;
