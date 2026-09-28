-- ══════════════════════════════════════════════
-- Schemas R2–R6 — estrutura básica (tabelas
-- detalhadas adicionadas nos releases respectivos)
-- ══════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS places;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS journeys;
CREATE SCHEMA IF NOT EXISTS commercial;
CREATE SCHEMA IF NOT EXISTS analytics;

-- ── users (R2) ──────────────────────────────
CREATE TABLE users.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin' | 'operador' | 'conteudo' | 'parceiro'
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
-- Trigger: criar perfil automaticamente após cadastro
CREATE OR REPLACE FUNCTION users.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO users.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION users.handle_new_user();

-- ── places (R2) ─────────────────────────────
CREATE TABLE places.poi_cache (
  id          BIGSERIAL PRIMARY KEY,
  station_id  TEXT NOT NULL REFERENCES metro.stations(id),
  category    TEXT NOT NULL,
  results     JSONB NOT NULL DEFAULT '[]',
  cached_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '6 hours'
);
CREATE INDEX idx_poi_cache ON places.poi_cache(station_id, category, expires_at);

CREATE TABLE places.sponsored_pois (
  id          BIGSERIAL PRIMARY KEY,
  station_id  TEXT NOT NULL REFERENCES metro.stations(id),
  category    TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  address     TEXT,
  distance_m  INTEGER,
  logo_url    TEXT,
  campaign_id BIGINT,                   -- FK para commercial.campaigns (R5)
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── content (R3) ────────────────────────────
CREATE TABLE content.stories (
  id          BIGSERIAL PRIMARY KEY,
  station_id  TEXT REFERENCES metro.stations(id),
  title       TEXT,
  body        TEXT NOT NULL,
  generated   BOOLEAN NOT NULL DEFAULT false, -- true = gerada pelo Claude
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE content.badges (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  icon_url    TEXT,
  rule_type   TEXT NOT NULL,            -- 'journey_count' | 'station_count' | 'time_of_day' | 'manual'
  rule_value  JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE content.user_badges (
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  badge_id    TEXT NOT NULL REFERENCES content.badges(id),
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE content.points_ledger (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  amount      INTEGER NOT NULL,
  reason      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── journeys (R3) ───────────────────────────
CREATE TABLE journeys.journey_history (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  origin_id   TEXT NOT NULL REFERENCES metro.stations(id),
  dest_id     TEXT NOT NULL REFERENCES metro.stations(id),
  route       JSONB NOT NULL DEFAULT '[]',
  fare_brl    NUMERIC(8,2),
  started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed   BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_journey_user ON journeys.journey_history(user_id, started_at DESC);

CREATE TABLE users.favorite_routes (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  origin_id   TEXT NOT NULL REFERENCES metro.stations(id),
  dest_id     TEXT NOT NULL REFERENCES metro.stations(id),
  label       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── commercial (R5) ─────────────────────────
CREATE TABLE commercial.partners (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  logo_url    TEXT,
  contact_email TEXT,
  status      TEXT NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE commercial.campaigns (
  id          BIGSERIAL PRIMARY KEY,
  partner_id  BIGINT NOT NULL REFERENCES commercial.partners(id),
  name        TEXT NOT NULL,
  budget_brl  NUMERIC(10,2),
  starts_at   DATE,
  ends_at     DATE,
  status      TEXT NOT NULL DEFAULT 'draft',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── analytics (R6) ──────────────────────────
CREATE TABLE analytics.events (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID,
  session_id  TEXT,
  event_type  TEXT NOT NULL,
  properties  JSONB DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_type_time ON analytics.events(event_type, occurred_at DESC);
