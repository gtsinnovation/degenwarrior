-- Degen Warrior marketing site — schema
-- Separate database (degen_warrior_site) from the Degen Sentinel trading tool,
-- reusing the same Postgres/Redis instances in this environment but keeping
-- the two products' data fully isolated.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Singleton row (id always 1) holding the pre-launch/launch toggle.
CREATE TABLE IF NOT EXISTS site_config (
  id             INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  launch_live    BOOLEAN NOT NULL DEFAULT FALSE,
  token_address  TEXT,
  buy_link       TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO site_config (id, launch_live) VALUES (1, FALSE) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS roadmap_phases (
  id            TEXT PRIMARY KEY,
  position      INTEGER NOT NULL,
  title         TEXT NOT NULL,
  bullets       JSONB NOT NULL DEFAULT '[]'::jsonb,
  status        TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'completed')),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  excerpt       TEXT NOT NULL,
  body          TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  published     BOOLEAN NOT NULL DEFAULT FALSE,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published, published_at DESC);

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  source        TEXT,
  ip_address    TEXT,
  user_agent    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'flagged', 'rejected')),
  flag_reason   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_ip ON waitlist_signups (ip_address);

CREATE TABLE IF NOT EXISTS activity_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at DESC);
