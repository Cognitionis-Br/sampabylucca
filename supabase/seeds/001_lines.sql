-- Linhas do Metrô SP e CPTM
-- Fonte: dados do POC sampa-metro/index.html
INSERT INTO metro.lines (id, name, nickname, color_hex, text_color, operator, type) VALUES
  ('L1',  'Linha 1',  'Azul',      '#1566b0', '#ffffff', 'Metrô SP',       'metro'),
  ('L2',  'Linha 2',  'Verde',     '#007a3d', '#ffffff', 'Metrô SP',       'metro'),
  ('L3',  'Linha 3',  'Vermelha',  '#cc2926', '#ffffff', 'Metrô SP',       'metro'),
  ('L4',  'Linha 4',  'Amarela',   '#ffd500', '#000000', 'ViaQuatro',      'metro'),
  ('L5',  'Linha 5',  'Lilás',     '#9b2d82', '#ffffff', 'ViaMobilidade',  'metro'),
  ('L7',  'Linha 7',  'Rubi',      '#c8102e', '#ffffff', 'CPTM',           'cptm'),
  ('L8',  'Linha 8',  'Diamante',  '#686868', '#ffffff', 'ViaMobilidade',  'cptm'),
  ('L9',  'Linha 9',  'Esmeralda', '#01a651', '#ffffff', 'ViaMobilidade',  'cptm'),
  ('L10', 'Linha 10', 'Turquesa',  '#009aba', '#ffffff', 'CPTM',           'cptm'),
  ('L11', 'Linha 11', 'Coral',     '#f77f00', '#ffffff', 'CPTM',           'cptm'),
  ('L12', 'Linha 12', 'Safira',    '#003087', '#ffffff', 'CPTM',           'cptm'),
  ('L13', 'Linha 13', 'Jade',      '#00a78e', '#ffffff', 'ViaMobilidade',  'cptm'),
  ('L15', 'Linha 15', 'Prata',     '#9d9d9c', '#ffffff', 'Metrô SP',       'metro')
ON CONFLICT (id) DO NOTHING;
