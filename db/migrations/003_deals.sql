CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  account TEXT NOT NULL,
  sector TEXT,
  owner TEXT NOT NULL,
  stage TEXT NOT NULL,
  value NUMERIC(14, 2) NOT NULL DEFAULT 0,
  probability NUMERIC(5, 4) NOT NULL DEFAULT 0,
  expected_revenue NUMERIC(14, 2) NOT NULL DEFAULT 0,
  next_action TEXT,
  next_action_deadline DATE,
  founder_involvement BOOLEAN NOT NULL DEFAULT FALSE,
  progressive_ownership TEXT NOT NULL DEFAULT 'Lead',
  customer_id TEXT,
  project_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS deals_stage_idx ON deals(stage);

INSERT INTO deals (id, account, sector, owner, stage, value, probability, expected_revenue, next_action, next_action_deadline, progressive_ownership)
VALUES
  ('DEAL-201', 'PT. Sejahtera Abadi', 'Manufacturing', 'Ricky Pratama', 'Lead', 450000000, 0.10, 45000000, 'Qualify operational need', '2026-08-22', 'Lead'),
  ('DEAL-202', 'Universitas Nusantara', 'Education', 'Dina Puspita', 'Lead', 350000000, 0.10, 35000000, 'Schedule discovery call', '2026-08-23', 'Lead'),
  ('DEAL-203', 'RS Mitra Sehat', 'Healthcare', 'Dina Puspita', 'Qualification', 1200000000, 0.25, 300000000, 'Validate implementation scope', '2026-08-20', 'Co-lead'),
  ('DEAL-204', 'PT. Global Teknologi', 'Technology', 'Ricky Pratama', 'Qualification', 900000000, 0.25, 225000000, 'Confirm stakeholders', '2026-08-21', 'Lead'),
  ('DEAL-205', 'Bank Central Asia', 'Banking', 'Ricky Pratama', 'Proposal', 2500000000, 0.50, 1250000000, 'Present service proposal', '2026-08-19', 'Lead'),
  ('DEAL-206', 'PT. Energi Nusantara', 'Energy', 'Dina Puspita', 'Proposal', 1800000000, 0.50, 900000000, 'Follow up proposal', '2026-08-24', 'Lead'),
  ('DEAL-207', 'Telkom Indonesia', 'Telecommunications', 'Ricky Pratama', 'Negotiation', 3000000000, 0.70, 2100000000, 'Agree commercial terms', '2026-08-18', 'Co-lead'),
  ('DEAL-208', 'PT. Maju Bersama', 'Logistics', 'Dina Puspita', 'Negotiation', 1800000000, 0.70, 1260000000, 'Review contract redlines', '2026-08-20', 'Lead'),
  ('DEAL-209', 'PT. Data Sinergi', 'Technology', 'Ricky Pratama', 'Closed Won', 1600000000, 1.00, 1600000000, 'Start implementation handoff', '2026-08-18', 'Own'),
  ('DEAL-210', 'PT. Andalan Makmur', 'Manufacturing', 'Dina Puspita', 'Closed Won', 1300000000, 1.00, 1300000000, 'Confirm project kick-off', '2026-08-21', 'Own')
ON CONFLICT (id) DO NOTHING;
