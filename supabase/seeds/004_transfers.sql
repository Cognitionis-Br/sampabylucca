-- Transferências — mesma estação em múltiplas linhas (baldeações físicas)
-- walk_time_s: tempo médio estimado de caminhada na baldeação

INSERT INTO metro.transfers (station_from, station_to, line_from, line_to, walk_time_s, is_intermodal) VALUES
-- Sé: L1 ↔ L3
('se', 'se', 'L1', 'L3', 60,  false),
('se', 'se', 'L3', 'L1', 60,  false),
-- Luz: L1 ↔ L3 ↔ L4 ↔ L7 ↔ L11
('luz', 'luz', 'L1', 'L3', 90,  false),
('luz', 'luz', 'L3', 'L1', 90,  false),
('luz', 'luz', 'L1', 'L4', 120, false),
('luz', 'luz', 'L4', 'L1', 120, false),
('luz', 'luz', 'L1', 'L7', 120, false),
('luz', 'luz', 'L7', 'L1', 120, false),
('luz', 'luz', 'L1', 'L11',120, false),
('luz', 'luz', 'L11','L1', 120, false),
('luz', 'luz', 'L3', 'L4', 90,  false),
('luz', 'luz', 'L4', 'L3', 90,  false),
('luz', 'luz', 'L3', 'L7', 90,  false),
('luz', 'luz', 'L7', 'L3', 90,  false),
('luz', 'luz', 'L4', 'L7', 60,  false),
('luz', 'luz', 'L7', 'L4', 60,  false),
-- Paraíso: L1 ↔ L2
('paraiso', 'paraiso', 'L1', 'L2', 90,  false),
('paraiso', 'paraiso', 'L2', 'L1', 90,  false),
-- Ana Rosa: L1 ↔ L2
('ana-rosa', 'ana-rosa', 'L1', 'L2', 90,  false),
('ana-rosa', 'ana-rosa', 'L2', 'L1', 90,  false),
-- Santa Cruz: L1 ↔ L5
('santa-cruz', 'santa-cruz', 'L1', 'L5', 90,  false),
('santa-cruz', 'santa-cruz', 'L5', 'L1', 90,  false),
-- República: L3 ↔ L4
('republica', 'republica', 'L3', 'L4', 90,  false),
('republica', 'republica', 'L4', 'L3', 90,  false),
-- Chácara Klabin: L2 ↔ L5
('chacara-klabin', 'chacara-klabin', 'L2', 'L5', 90,  false),
('chacara-klabin', 'chacara-klabin', 'L5', 'L2', 90,  false),
-- Tamanduateí: L2 ↔ L10
('tamanduatei', 'tamanduatei', 'L2', 'L10', 90, false),
('tamanduatei', 'tamanduatei', 'L10','L2',  90, false),
-- Vila Prudente: L2 ↔ L15
('vila-prudente', 'vila-prudente', 'L2', 'L15', 90, false),
('vila-prudente', 'vila-prudente', 'L15','L2',  90, false),
-- Palmeiras-BF: L3 ↔ L7 ↔ L8
('palmeiras-bf', 'palmeiras-bf', 'L3', 'L7', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L7', 'L3', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L3', 'L8', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L8', 'L3', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L7', 'L8', 60,  false),
('palmeiras-bf', 'palmeiras-bf', 'L8', 'L7', 60,  false),
-- Júlio Prestes: L7 ↔ L8
('julio-prestes', 'julio-prestes', 'L7', 'L8', 60, false),
('julio-prestes', 'julio-prestes', 'L8', 'L7', 60, false),
-- Brás: L3 ↔ L10 ↔ L11 ↔ L12
('bras', 'bras', 'L3', 'L10', 90, false),
('bras', 'bras', 'L10','L3',  90, false),
('bras', 'bras', 'L3', 'L11', 90, false),
('bras', 'bras', 'L11','L3',  90, false),
('bras', 'bras', 'L3', 'L12', 90, false),
('bras', 'bras', 'L12','L3',  90, false),
-- Tatuapé: L3 ↔ L11 ↔ L12
('tatupae', 'tatupae', 'L3', 'L11', 90, false),
('tatupae', 'tatupae', 'L11','L3',  90, false),
('tatupae', 'tatupae', 'L3', 'L12', 90, false),
('tatupae', 'tatupae', 'L12','L3',  90, false),
-- Eng. Goulart: L12 ↔ L13
('eng-goulart', 'eng-goulart', 'L12', 'L13', 90, false),
('eng-goulart', 'eng-goulart', 'L13', 'L12', 90, false),
-- Intermodais (estações fisicamente adjacentes)
('osasco-l9',     'osasco',     'L9', 'L8', 180, true),  -- Osasco L9 ↔ L8
('osasco',        'osasco-l9',  'L8', 'L9', 180, true),
('pinheiros',     'faria-lima', 'L9', 'L4', 300, true),  -- Pinheiros ↔ Faria Lima (a pé ~5 min)
('faria-lima',    'pinheiros',  'L4', 'L9', 300, true),
('santo-amaro-l9','santo-amaro','L9', 'L5', 180, true),  -- Santo Amaro L9 ↔ L5
('santo-amaro',   'santo-amaro-l9','L5','L9',180, true),
('jurubatuba',    'santo-amaro','L9', 'L5', 240, true)   -- Jurubatuba ↔ Santo Amaro L5
ON CONFLICT DO NOTHING;
