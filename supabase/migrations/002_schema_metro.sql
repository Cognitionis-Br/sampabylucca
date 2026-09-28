-- ══════════════════════════════════════════════
-- Schema METRO — rede de transporte
-- ══════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS metro;

-- Linhas
CREATE TABLE metro.lines (
  id          TEXT PRIMARY KEY,          -- 'L1', 'L2', 'L3', 'L4', 'L5', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L15'
  name        TEXT NOT NULL,             -- 'Linha 1'
  nickname    TEXT NOT NULL,             -- 'Azul'
  color_hex   TEXT NOT NULL,             -- '#1566b0'
  text_color  TEXT NOT NULL DEFAULT '#ffffff',
  operator    TEXT NOT NULL,             -- 'Metrô SP', 'ViaQuatro', 'ViaMobilidade', 'CPTM'
  type        TEXT NOT NULL DEFAULT 'metro', -- 'metro' | 'cptm'
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Estações
CREATE TABLE metro.stations (
  id          TEXT PRIMARY KEY,          -- 'se', 'luz', 'pinheiros'
  name        TEXT NOT NULL,
  is_hub      BOOLEAN NOT NULL DEFAULT false,
  special_icon TEXT,                     -- 'airport', 'stadium', 'hospital', 'museum'
  fact        TEXT,                      -- curiosidade exibida pelo Lucca
  accessibility JSONB DEFAULT '{}',      -- {"elevator": true, "ramp": true}
  exits       JSONB DEFAULT '[]',        -- array de saídas
  geom        GEOMETRY(Point, 4326),     -- coordenadas WGS-84 (PostGIS)
  svg_x       NUMERIC,                   -- posição no mapa SVG
  svg_y       NUMERIC,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Índice espacial
CREATE INDEX idx_stations_geom ON metro.stations USING GIST(geom);
-- Índice de busca fuzzy no nome
CREATE INDEX idx_stations_name_trgm ON metro.stations USING GIN(name gin_trgm_ops);

-- Estação↔Linha (many-to-many)
CREATE TABLE metro.station_lines (
  station_id  TEXT NOT NULL REFERENCES metro.stations(id) ON DELETE CASCADE,
  line_id     TEXT NOT NULL REFERENCES metro.lines(id)    ON DELETE CASCADE,
  position    INTEGER NOT NULL,          -- ordem na linha (para exibição)
  PRIMARY KEY (station_id, line_id)
);

-- Segmentos entre estações consecutivas
CREATE TABLE metro.segments (
  id          BIGSERIAL PRIMARY KEY,
  line_id     TEXT NOT NULL REFERENCES metro.lines(id),
  from_id     TEXT NOT NULL REFERENCES metro.stations(id),
  to_id       TEXT NOT NULL REFERENCES metro.stations(id),
  travel_time_s INTEGER NOT NULL DEFAULT 90, -- segundos estimados
  distance_m  NUMERIC
);

-- Transferências entre linhas na mesma estação (ou adjacentes)
CREATE TABLE metro.transfers (
  id          BIGSERIAL PRIMARY KEY,
  station_from TEXT NOT NULL REFERENCES metro.stations(id),
  station_to  TEXT NOT NULL REFERENCES metro.stations(id),
  line_from   TEXT NOT NULL REFERENCES metro.lines(id),
  line_to     TEXT NOT NULL REFERENCES metro.lines(id),
  walk_time_s INTEGER NOT NULL DEFAULT 120, -- tempo de baldeação
  is_intermodal BOOLEAN NOT NULL DEFAULT false  -- estações fisicamente diferentes
);

-- Perturbações / alertas de rede
CREATE TABLE metro.disruptions (
  id          BIGSERIAL PRIMARY KEY,
  line_id     TEXT REFERENCES metro.lines(id),
  station_id  TEXT REFERENCES metro.stations(id),
  severity    TEXT NOT NULL DEFAULT 'info', -- 'info' | 'warning' | 'critical'
  title       TEXT NOT NULL,
  message     TEXT,
  starts_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at     TIMESTAMPTZ,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_disruptions_active ON metro.disruptions(ends_at) WHERE ends_at IS NULL OR ends_at > now();

-- Habilitar Realtime para disruptions
ALTER TABLE metro.disruptions REPLICA IDENTITY FULL;
