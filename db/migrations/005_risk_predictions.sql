CREATE TABLE IF NOT EXISTS risk_predictions (
  task_id TEXT PRIMARY KEY,
  model_version TEXT NOT NULL,
  input_snapshot JSONB NOT NULL,
  result JSONB NOT NULL,
  actual_sla_breach BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS risk_predictions_updated_at_idx ON risk_predictions(updated_at DESC);
