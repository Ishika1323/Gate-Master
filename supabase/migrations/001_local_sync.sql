-- Local-first app sync: snapshot row + optional client IDs for upserts.
-- Run in Supabase SQL editor or via CLI migrations.

CREATE TABLE IF NOT EXISTS app_progress_snapshots (
    id TEXT PRIMARY KEY DEFAULT 'default',
    plan_progress JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_pyq_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS local_id BIGINT;
CREATE UNIQUE INDEX IF NOT EXISTS tasks_local_id_key ON tasks (local_id)
WHERE local_id IS NOT NULL;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_type TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS reattempt_required BOOLEAN DEFAULT FALSE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS exam_weight TEXT;

ALTER TABLE pyq_attempts ADD COLUMN IF NOT EXISTS local_id BIGINT;
CREATE UNIQUE INDEX IF NOT EXISTS pyq_attempts_local_id_key ON pyq_attempts (local_id)
WHERE local_id IS NOT NULL;

ALTER TABLE mistakes ADD COLUMN IF NOT EXISTS local_id BIGINT;
CREATE UNIQUE INDEX IF NOT EXISTS mistakes_local_id_key ON mistakes (local_id)
WHERE local_id IS NOT NULL;

ALTER TABLE mistakes ADD COLUMN IF NOT EXISTS reattempted BOOLEAN DEFAULT FALSE;
ALTER TABLE mistakes ADD COLUMN IF NOT EXISTS reattempt_scheduled TIMESTAMPTZ;

