CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  owner_initials TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  deadline DATE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tasks_owner_initials_idx ON tasks(owner_initials);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_deadline_idx ON tasks(deadline);

CREATE TABLE IF NOT EXISTS operational_records (
  domain TEXT NOT NULL,
  id TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (domain, id)
);

CREATE INDEX IF NOT EXISTS operational_records_domain_idx ON operational_records(domain);
