-- Views públicas para expor dados do schema metro via PostgREST
-- PostgREST só expõe o schema 'public' por padrão; views aqui resolvem isso sem alterar config.

CREATE OR REPLACE VIEW public.metro_stations AS
  SELECT id, name, is_hub, special_icon, accessibility,
         svg_x, svg_y, active,
         ST_X(geom) AS lng, ST_Y(geom) AS lat
  FROM metro.stations;

CREATE OR REPLACE VIEW public.metro_lines AS
  SELECT id, name, nickname, color_hex, text_color, operator, type, active
  FROM metro.lines;

CREATE OR REPLACE VIEW public.metro_disruptions AS
  SELECT id, line_id, station_id, title, message, severity, starts_at, ends_at
  FROM metro.disruptions;

CREATE OR REPLACE VIEW public.metro_station_lines AS
  SELECT station_id, line_id, position FROM metro.station_lines;

-- Permissões para anon e authenticated
GRANT SELECT ON public.metro_stations    TO anon, authenticated;
GRANT SELECT ON public.metro_lines       TO anon, authenticated;
GRANT SELECT ON public.metro_disruptions TO anon, authenticated;
GRANT SELECT ON public.metro_station_lines TO anon, authenticated;
