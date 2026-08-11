-- Canvas section document + reusable section templates
ALTER TABLE project_sections
  ADD COLUMN IF NOT EXISTS canvas_data JSONB;

CREATE TABLE IF NOT EXISTS section_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section_kind TEXT NOT NULL DEFAULT 'canvas',
  document JSONB NOT NULL DEFAULT '{}'::JSONB,
  thumbnail_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE section_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated manage section templates"
  ON public.section_templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
