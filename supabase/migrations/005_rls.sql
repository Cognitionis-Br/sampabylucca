-- ══════════════════════════════════════════════
-- Row Level Security — políticas por schema
-- ══════════════════════════════════════════════

-- Função auxiliar: retorna role do usuário logado
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM users.profiles WHERE id = auth.uid()
$$;

-- ── metro: leitura pública, escrita apenas admin/operador ─
ALTER TABLE metro.lines        ENABLE ROW LEVEL SECURITY;
ALTER TABLE metro.stations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE metro.station_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE metro.segments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE metro.transfers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE metro.disruptions  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "metro_read_all"  ON metro.lines        FOR SELECT USING (true);
CREATE POLICY "metro_read_all"  ON metro.stations     FOR SELECT USING (true);
CREATE POLICY "metro_read_all"  ON metro.station_lines FOR SELECT USING (true);
CREATE POLICY "metro_read_all"  ON metro.segments     FOR SELECT USING (true);
CREATE POLICY "metro_read_all"  ON metro.transfers    FOR SELECT USING (true);
CREATE POLICY "metro_read_all"  ON metro.disruptions  FOR SELECT USING (true);

CREATE POLICY "metro_write_admin" ON metro.lines       FOR ALL USING (public.user_role() IN ('admin','operador'));
CREATE POLICY "metro_write_admin" ON metro.stations    FOR ALL USING (public.user_role() IN ('admin','operador'));
CREATE POLICY "metro_write_admin" ON metro.disruptions FOR ALL USING (public.user_role() IN ('admin','operador'));

-- ── fares: leitura pública, escrita admin ─────────────────
ALTER TABLE fares.ticket_types  ENABLE ROW LEVEL SECURITY;
ALTER TABLE fares.tariff_rules  ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fares_read_all"  ON fares.ticket_types FOR SELECT USING (true);
CREATE POLICY "fares_read_all"  ON fares.tariff_rules FOR SELECT USING (true);
CREATE POLICY "fares_write_admin" ON fares.tariff_rules FOR ALL USING (public.user_role() = 'admin');

-- ── users: cada usuário vê apenas seus próprios dados ──────
ALTER TABLE users.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE users.favorite_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own"  ON users.profiles        FOR ALL USING (id = auth.uid());
CREATE POLICY "users_own"  ON users.favorite_routes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_see_all" ON users.profiles     FOR SELECT USING (public.user_role() IN ('admin','operador'));

-- ── places: cache e sponsored públicos ────────────────────
ALTER TABLE places.poi_cache     ENABLE ROW LEVEL SECURITY;
ALTER TABLE places.sponsored_pois ENABLE ROW LEVEL SECURITY;
CREATE POLICY "places_read_all" ON places.poi_cache      FOR SELECT USING (true);
CREATE POLICY "places_read_all" ON places.sponsored_pois FOR SELECT USING (active = true);
CREATE POLICY "places_write_admin" ON places.sponsored_pois FOR ALL USING (public.user_role() IN ('admin','conteudo','parceiro'));

-- ── journeys: próprio usuário ─────────────────────────────
ALTER TABLE journeys.journey_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journeys_own" ON journeys.journey_history FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_see_all" ON journeys.journey_history FOR SELECT USING (public.user_role() IN ('admin','operador'));

-- ── content: leitura pública, escrita admin/conteudo ──────
ALTER TABLE content.stories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content.badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE content.user_badges  ENABLE ROW LEVEL SECURITY;
ALTER TABLE content.points_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_read_all"  ON content.stories      FOR SELECT USING (active = true);
CREATE POLICY "content_read_all"  ON content.badges       FOR SELECT USING (true);
CREATE POLICY "content_own"       ON content.user_badges  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "content_own"       ON content.points_ledger FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "content_write_admin" ON content.stories    FOR ALL USING (public.user_role() IN ('admin','conteudo'));
