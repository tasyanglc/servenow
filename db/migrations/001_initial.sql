CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  name TEXT NOT NULL,
  scope TEXT,
  workflow_ids JSONB NOT NULL DEFAULT '[]',
  task_ids JSONB NOT NULL DEFAULT '[]',
  milestones JSONB NOT NULL DEFAULT '[]',
  sla_id TEXT,
  status TEXT NOT NULL DEFAULT 'In progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sla_rules (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  default_sla INTEGER NOT NULL CHECK (default_sla > 0),
  threshold INTEGER NOT NULL CHECK (threshold BETWEEN 1 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escalation_rules (
  id TEXT PRIMARY KEY,
  condition TEXT NOT NULL,
  threshold TEXT NOT NULL,
  level TEXT NOT NULL,
  recipient TEXT NOT NULL,
  trigger TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interventions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Monitoring',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS interventions_task_id_idx ON interventions(task_id);
