-- ══════════════════════════════════════════════
-- Schema FARES — tarifas e tipos de bilhete
-- ══════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS fares;

CREATE TABLE fares.ticket_types (
  id          TEXT PRIMARY KEY,          -- 'comum', 'estudante', 'idoso', 'vt'
  name        TEXT NOT NULL,
  description TEXT,
  active      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE fares.tariff_rules (
  id            BIGSERIAL PRIMARY KEY,
  ticket_type   TEXT NOT NULL REFERENCES fares.ticket_types(id),
  operator      TEXT,                    -- NULL = vale para todos
  description   TEXT NOT NULL,
  price_brl     NUMERIC(8,2) NOT NULL,
  valid_from    DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until   DATE,
  integration_with TEXT[],              -- linhas que integram sem cobrar extra
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_tariff_active ON fares.tariff_rules(valid_from, valid_until) WHERE valid_until IS NULL OR valid_until >= CURRENT_DATE;
