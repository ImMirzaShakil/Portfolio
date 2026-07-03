-- Dynamic project status catalog

CREATE TABLE IF NOT EXISTS project_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS project_statuses_label_unique
  ON project_statuses (lower(trim(label)));

INSERT INTO project_statuses (label, order_index)
SELECT label, order_index
FROM (VALUES
  ('SHIPPED', 0),
  ('ACQUIRED', 1),
  ('WIP', 2),
  ('CONCEPT', 3)
) AS defaults(label, order_index)
WHERE NOT EXISTS (SELECT 1 FROM project_statuses LIMIT 1);

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS status_id UUID REFERENCES project_statuses(id) ON DELETE SET NULL;

UPDATE projects p
SET status_id = ps.id
FROM project_statuses ps
WHERE p.status_id IS NULL
  AND p.status IS NOT NULL
  AND lower(trim(p.status)) = lower(trim(ps.label));

ALTER TABLE projects DROP COLUMN IF EXISTS status;

ALTER TABLE project_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read project statuses"
  ON project_statuses FOR SELECT
  USING (true);

CREATE POLICY "Authenticated manage project statuses"
  ON project_statuses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
