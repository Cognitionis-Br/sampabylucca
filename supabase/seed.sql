-- ══════════════════════════════════════════════
-- Seed completo: linhas, estações, station_lines, transfers, fares
-- ══════════════════════════════════════════════

-- Linhas do Metrô SP e CPTM
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

-- Estações
INSERT INTO metro.stations (id, name, is_hub, special_icon, fact, svg_x, svg_y, geom) VALUES

-- ── Linha 1 Azul ─────────────────────────────────────────────────────────────
('tucuruvi',          'Tucuruvi',              false, null,       null, 680, 60,  ST_SetSRID(ST_MakePoint(-46.6339, -23.4749), 4326)),
('parada-inglesa',    'Parada Inglesa',         false, null,       null, 680, 93,  ST_SetSRID(ST_MakePoint(-46.6339, -23.4835), 4326)),
('jardim-sp',         'Jardim São Paulo',        false, null,       null, 680, 126, ST_SetSRID(ST_MakePoint(-46.6339, -23.4920), 4326)),
('carandiru',         'Carandiru',              false, null,       null, 680, 159, ST_SetSRID(ST_MakePoint(-46.6339, -23.5005), 4326)),
('santana',           'Santana',                false, null,       null, 680, 192, ST_SetSRID(ST_MakePoint(-46.6339, -23.5020), 4326)),
('tiete',             'Tietê',                  false, null,       null, 680, 225, ST_SetSRID(ST_MakePoint(-46.6268, -23.5165), 4326)),
('portuguesa-tiete',  'Portuguesa-Tietê',       false, null,       null, 680, 258, ST_SetSRID(ST_MakePoint(-46.6268, -23.5215), 4326)),
('armenia',           'Armênia',                false, null,       null, 680, 291, ST_SetSRID(ST_MakePoint(-46.6268, -23.5280), 4326)),
('tiradentes',        'Tiradentes',             false, null,       null, 680, 324, ST_SetSRID(ST_MakePoint(-46.6335, -23.5340), 4326)),
('luz',               'Luz',                    true,  'museum',   'Maior hub do sistema — integra L1, L3, L4 (Metrô) e L7, L11 (CPTM).', 680, 357, ST_SetSRID(ST_MakePoint(-46.6348, -23.5357), 4326)),
('sao-bento',         'São Bento',              false, null,       null, 680, 390, ST_SetSRID(ST_MakePoint(-46.6335, -23.5404), 4326)),
('se',                'Sé',                     true,  null,       'Coração de São Paulo — integra L1 Azul e L3 Vermelha. Inaugurada em 1978.', 680, 423, ST_SetSRID(ST_MakePoint(-46.6339, -23.5504), 4326)),
('liberdade',         'Liberdade',              false, null,       null, 680, 456, ST_SetSRID(ST_MakePoint(-46.6360, -23.5605), 4326)),
('sao-joaquim',       'São Joaquim',            false, null,       null, 680, 489, ST_SetSRID(ST_MakePoint(-46.6380, -23.5670), 4326)),
('vergueiro',         'Vergueiro',              false, null,       null, 680, 522, ST_SetSRID(ST_MakePoint(-46.6408, -23.5730), 4326)),
('paraiso',           'Paraíso',                true,  null,       'Integra L1 e L2. Próxima à Av. Paulista.', 680, 555, ST_SetSRID(ST_MakePoint(-46.6461, -23.5752), 4326)),
('ana-rosa',          'Ana Rosa',               true,  null,       null, 680, 588, ST_SetSRID(ST_MakePoint(-46.6408, -23.5891), 4326)),
('vila-mariana',      'Vila Mariana',           false, null,       null, 680, 621, ST_SetSRID(ST_MakePoint(-46.6380, -23.5950), 4326)),
('santa-cruz',        'Santa Cruz',             true,  null,       null, 680, 654, ST_SetSRID(ST_MakePoint(-46.6476, -23.5904), 4326)),
('praca-arvore',      'Praça da Árvore',        false, null,       null, 680, 687, ST_SetSRID(ST_MakePoint(-46.6476, -23.5970), 4326)),
('saude',             'Saúde',                  false, null,       null, 680, 720, ST_SetSRID(ST_MakePoint(-46.6359, -23.6043), 4326)),
('sao-judas',         'São Judas',              false, null,       null, 680, 753, ST_SetSRID(ST_MakePoint(-46.6339, -23.6130), 4326)),
('jabaquara',         'Jabaquara',              false, null,       null, 680, 786, ST_SetSRID(ST_MakePoint(-46.6339, -23.6229), 4326)),

-- ── Linha 2 Verde ────────────────────────────────────────────────────────────
('vila-madalena',     'Vila Madalena',          false, null,       null, 170, 502, ST_SetSRID(ST_MakePoint(-46.7020, -23.5470), 4326)),
('sumare',            'Sumaré',                 false, null,       null, 253, 502, ST_SetSRID(ST_MakePoint(-46.6880, -23.5490), 4326)),
('clinicas',          'Clínicas',               false, null,       null, 333, 502, ST_SetSRID(ST_MakePoint(-46.6700, -23.5520), 4326)),
('consolacao',        'Consolação',             false, null,       null, 413, 502, ST_SetSRID(ST_MakePoint(-46.6592, -23.5549), 4326)),
('trianon-masp',      'Trianon-MASP',           false, 'museum',   null, 490, 502, ST_SetSRID(ST_MakePoint(-46.6561, -23.5614), 4326)),
('brigadeiro',        'Brigadeiro',             false, null,       null, 565, 512, ST_SetSRID(ST_MakePoint(-46.6502, -23.5680), 4326)),
('chacara-klabin',    'Chácara Klabin',         true,  null,       null, 748, 600, ST_SetSRID(ST_MakePoint(-46.6240, -23.5921), 4326)),
('santos-imigrantes', 'Santos-Imigrantes',      false, null,       null, 808, 607, ST_SetSRID(ST_MakePoint(-46.6100, -23.5940), 4326)),
('alto-ipiranga',     'Alto do Ipiranga',       false, null,       null, 858, 614, ST_SetSRID(ST_MakePoint(-46.6085, -23.5900), 4326)),
('sacoma',            'Sacomã',                 false, null,       null, 908, 619, ST_SetSRID(ST_MakePoint(-46.5970, -23.5990), 4326)),
('tamanduatei',       'Tamanduateí',            true,  null,       null, 958, 622, ST_SetSRID(ST_MakePoint(-46.6038, -23.5907), 4326)),
('vila-prudente',     'Vila Prudente',          true,  null,       null, 1015, 622, ST_SetSRID(ST_MakePoint(-46.5753, -23.5930), 4326)),

-- ── Linha 3 Vermelha ─────────────────────────────────────────────────────────
('palmeiras-bf',      'Palmeiras-Barra Funda',  true,  'stadium',  'Integra L3 (Metrô) com L8 e L9 (CPTM) e terminal rodoviário.', 360, 423, ST_SetSRID(ST_MakePoint(-46.6557, -23.5265), 4326)),
('marechal-deodoro',  'Marechal Deodoro',       false, null,       null, 407, 423, ST_SetSRID(ST_MakePoint(-46.6490, -23.5330), 4326)),
('santa-cecilia',     'Santa Cecília',          false, null,       null, 454, 423, ST_SetSRID(ST_MakePoint(-46.6453, -23.5380), 4326)),
('republica',         'República',              true,  null,       null, 501, 423, ST_SetSRID(ST_MakePoint(-46.6432, -23.5433), 4326)),
('anhangabau',        'Anhangabaú',             false, null,       null, 548, 423, ST_SetSRID(ST_MakePoint(-46.6380, -23.5440), 4326)),
('pedro-ii',          'Pedro II',               false, null,       null, 727, 423, ST_SetSRID(ST_MakePoint(-46.6270, -23.5440), 4326)),
('bras',              'Brás',                   true,  null,       'Hub da Zona Leste — integra L3 com CPTM L10, L11 e L12.', 774, 423, ST_SetSRID(ST_MakePoint(-46.6138, -23.5450), 4326)),
('bresser-mooca',     'Bresser-Mooca',          false, null,       null, 821, 423, ST_SetSRID(ST_MakePoint(-46.6020, -23.5460), 4326)),
('belem',             'Belém',                  false, null,       null, 868, 423, ST_SetSRID(ST_MakePoint(-46.5910, -23.5460), 4326)),
('tatupae',           'Tatuapé',                true,  null,       null, 915, 423, ST_SetSRID(ST_MakePoint(-46.5760, -23.5448), 4326)),
('carrao',            'Carrão',                 false, null,       null, 962, 423, ST_SetSRID(ST_MakePoint(-46.5630, -23.5440), 4326)),
('penha',             'Penha',                  false, null,       null, 1009, 423, ST_SetSRID(ST_MakePoint(-46.5490, -23.5430), 4326)),
('vila-matilde',      'Vila Matilde',           false, null,       null, 1056, 423, ST_SetSRID(ST_MakePoint(-46.5360, -23.5440), 4326)),
('guilhermina',       'Guilhermina-Esperança',  false, null,       null, 1103, 423, ST_SetSRID(ST_MakePoint(-46.5230, -23.5440), 4326)),
('patriarca',         'Patriarca',              false, null,       null, 1150, 423, ST_SetSRID(ST_MakePoint(-46.5100, -23.5443), 4326)),
('arthur-alvim',      'Arthur Alvim',           false, null,       null, 1197, 423, ST_SetSRID(ST_MakePoint(-46.4970, -23.5447), 4326)),
('corinthians',       'Corinthians-Itaquera',   false, 'stadium',  null, 1244, 423, ST_SetSRID(ST_MakePoint(-46.4730, -23.5455), 4326)),

-- ── Linha 4 Amarela ──────────────────────────────────────────────────────────
('higienopolis-mack', 'Higienópolis-Mackenzie', false, null,       null, 614, 390, ST_SetSRID(ST_MakePoint(-46.6530, -23.5380), 4326)),
('paulista',          'Paulista',               false, null,       null, 453, 460, ST_SetSRID(ST_MakePoint(-46.6560, -23.5612), 4326)),
('oscar-freire',      'Oscar Freire',           false, null,       null, 405, 492, ST_SetSRID(ST_MakePoint(-46.6720, -23.5640), 4326)),
('faria-lima',        'Faria Lima',             false, null,       null, 343, 528, ST_SetSRID(ST_MakePoint(-46.6893, -23.5691), 4326)),
('butanta',           'Butantã',                false, null,       null, 279, 560, ST_SetSRID(ST_MakePoint(-46.7128, -23.5670), 4326)),
('morumbi',           'São Paulo-Morumbi',      false, null,       null, 217, 592, ST_SetSRID(ST_MakePoint(-46.7200, -23.5870), 4326)),
('giovanni-gronchi',  'Giovanni Gronchi',       false, null,       null, 157, 624, ST_SetSRID(ST_MakePoint(-46.7350, -23.6040), 4326)),
('vila-sonia',        'Vila Sônia',             false, null,       null, 97,  656, ST_SetSRID(ST_MakePoint(-46.7480, -23.6150), 4326)),

-- ── Linha 5 Lilás ────────────────────────────────────────────────────────────
('capao-redondo',     'Capão Redondo',          false, null,       null, 90,  818, ST_SetSRID(ST_MakePoint(-46.7786, -23.6700), 4326)),
('campo-limpo',       'Campo Limpo',            false, null,       null, 163, 802, ST_SetSRID(ST_MakePoint(-46.7650, -23.6640), 4326)),
('vila-belezas',      'Vila das Belezas',       false, null,       null, 234, 784, ST_SetSRID(ST_MakePoint(-46.7500, -23.6560), 4326)),
('giovanni-l5',       'Giovanni Gronchi',       false, null,       null, 302, 764, ST_SetSRID(ST_MakePoint(-46.7350, -23.6460), 4326)),
('santo-amaro',       'Santo Amaro',            true,  null,       null, 370, 742, ST_SetSRID(ST_MakePoint(-46.7003, -23.6540), 4326)),
('largo-treze',       'Largo Treze',            false, null,       null, 436, 720, ST_SetSRID(ST_MakePoint(-46.6900, -23.6440), 4326)),
('adolfo-pinheiro',   'Adolfo Pinheiro',        false, null,       null, 498, 698, ST_SetSRID(ST_MakePoint(-46.6790, -23.6340), 4326)),
('alto-boa-vista',    'Alto da Boa Vista',      false, null,       null, 554, 678, ST_SetSRID(ST_MakePoint(-46.6700, -23.6240), 4326)),
('borba-gato',        'Borba Gato',             false, null,       null, 578, 718, ST_SetSRID(ST_MakePoint(-46.6740, -23.6290), 4326)),
('brooklin',          'Brooklin',               false, null,       null, 596, 748, ST_SetSRID(ST_MakePoint(-46.6760, -23.6310), 4326)),
('rep-libano',        'República do Líbano',    false, null,       null, 616, 738, ST_SetSRID(ST_MakePoint(-46.6730, -23.6300), 4326)),
('campo-belo',        'Campo Belo',             false, null,       null, 634, 722, ST_SetSRID(ST_MakePoint(-46.6702, -23.6218), 4326)),
('eucaliptos',        'Eucaliptos',             false, null,       null, 648, 706, ST_SetSRID(ST_MakePoint(-46.6680, -23.6130), 4326)),
('moema',             'Moema',                  false, null,       null, 658, 690, ST_SetSRID(ST_MakePoint(-46.6672, -23.6054), 4326)),
('aacd',              'AACD-Servidor',          false, 'hospital', null, 665, 673, ST_SetSRID(ST_MakePoint(-46.6500, -23.6020), 4326)),
('hospital-sp',       'Hospital São Paulo',     false, 'hospital', null, 671, 658, ST_SetSRID(ST_MakePoint(-46.6490, -23.5916), 4326)),

-- ── Linha 15 Prata (monotrilho) ──────────────────────────────────────────────
('sapopemba',         'Sapopemba',              false, null,       null, 1060, 648, ST_SetSRID(ST_MakePoint(-46.5340, -23.6050), 4326)),
('fazenda-juta',      'Fazenda da Juta',        false, null,       null, 1100, 663, ST_SetSRID(ST_MakePoint(-46.5220, -23.6110), 4326)),
('sao-lucas',         'São Lucas',              false, null,       null, 1135, 643, ST_SetSRID(ST_MakePoint(-46.5140, -23.6060), 4326)),
('camilo-haddad',     'Camilo Haddad',          false, null,       null, 1163, 620, ST_SetSRID(ST_MakePoint(-46.5060, -23.5980), 4326)),
('vila-tolerosa',     'Vila Tolerosa',          false, null,       null, 1190, 598, ST_SetSRID(ST_MakePoint(-46.4980, -23.5910), 4326)),
('jd-colonial',       'Jardim Colonial',        false, null,       null, 1217, 576, ST_SetSRID(ST_MakePoint(-46.4900, -23.5840), 4326)),
('oratorio',          'Oratório',               false, null,       null, 1243, 555, ST_SetSRID(ST_MakePoint(-46.4830, -23.5770), 4326)),
('sitio-vianas',      'Sítio dos Vianas',       false, null,       null, 1265, 534, ST_SetSRID(ST_MakePoint(-46.4770, -23.5710), 4326)),
('jd-planalto',       'Jardim Planalto',        false, null,       null, 1285, 514, ST_SetSRID(ST_MakePoint(-46.4710, -23.5650), 4326)),
('sao-mateus',        'São Mateus',             false, null,       null, 1305, 494, ST_SetSRID(ST_MakePoint(-46.4660, -23.5600), 4326)),

-- ── CPTM L7 Rubi ─────────────────────────────────────────────────────────────
('julio-prestes',     'Júlio Prestes',          true,  'museum',   null, 610, 357, ST_SetSRID(ST_MakePoint(-46.6379, -23.5348), 4326)),
('lapa',              'Lapa',                   false, null,       null, 270, 340, ST_SetSRID(ST_MakePoint(-46.7120, -23.5260), 4326)),
('pirituba',          'Pirituba',               false, null,       null, 180, 314, ST_SetSRID(ST_MakePoint(-46.7530, -23.5070), 4326)),
('francisco-morato',  'Francisco Morato',       false, null,       null, 62,  278, ST_SetSRID(ST_MakePoint(-47.0000, -23.2800), 4326)),

-- ── CPTM L8 Diamante ─────────────────────────────────────────────────────────
('osasco',            'Osasco',                 true,  null,       null, 218, 423, ST_SetSRID(ST_MakePoint(-46.7917, -23.5325), 4326)),
('amador-bueno',      'Amador Bueno',           false, null,       null, 52,  423, ST_SetSRID(ST_MakePoint(-46.8800, -23.5330), 4326)),
('presidente-altino-l8', 'Presidente Altino',  false, null,       null, 310, 423, ST_SetSRID(ST_MakePoint(-46.7650, -23.5310), 4326)),
('quitauna',          'Quitaúna',               false, null,       null, 272, 423, ST_SetSRID(ST_MakePoint(-46.8000, -23.5320), 4326)),
('gral-miguel-costa', 'General Miguel Costa',   false, null,       null, 238, 423, ST_SetSRID(ST_MakePoint(-46.8200, -23.5320), 4326)),
('dom-bosco',         'Dom Bosco',              false, null,       null, 204, 423, ST_SetSRID(ST_MakePoint(-46.8400, -23.5320), 4326)),
('jd-silveira',       'Jardim Silveira',        false, null,       null, 174, 423, ST_SetSRID(ST_MakePoint(-46.8550, -23.5320), 4326)),
('jd-belval',         'Jardim Belval',          false, null,       null, 144, 423, ST_SetSRID(ST_MakePoint(-46.8680, -23.5330), 4326)),
('barueri',           'Barueri',                false, null,       null, 118, 423, ST_SetSRID(ST_MakePoint(-46.8750, -23.5320), 4326)),
('antonio-joao',      'Antônio João',           false, null,       null, 88,  423, ST_SetSRID(ST_MakePoint(-46.8830, -23.5330), 4326)),

-- ── CPTM L9 Esmeralda ────────────────────────────────────────────────────────
('osasco-l9',         'Osasco',                 false, null,       null, 120, 476, ST_SetSRID(ST_MakePoint(-46.7917, -23.5325), 4326)),
('presidente-altino', 'Presidente Altino',      false, null,       null, 152, 490, ST_SetSRID(ST_MakePoint(-46.7650, -23.5310), 4326)),
('ceasa',             'CEASA',                  false, null,       null, 188, 505, ST_SetSRID(ST_MakePoint(-46.7400, -23.5360), 4326)),
('villa-lobos',       'Villa-Lobos-Jaguaré',    false, null,       null, 220, 517, ST_SetSRID(ST_MakePoint(-46.7300, -23.5390), 4326)),
('cidade-univ',       'Cidade Universitária',   false, null,       null, 248, 527, ST_SetSRID(ST_MakePoint(-46.7180, -23.5420), 4326)),
('pinheiros',         'Pinheiros',              false, null,       null, 266, 534, ST_SetSRID(ST_MakePoint(-46.6990, -23.5671), 4326)),
('hebraica',          'Hebraica-Rebouças',      false, null,       null, 228, 568, ST_SetSRID(ST_MakePoint(-46.7013, -23.5750), 4326)),
('butanta-l9',        'Butantã',                false, null,       null, 198, 601, ST_SetSRID(ST_MakePoint(-46.7128, -23.5670), 4326)),
('morumbi-l9',        'Morumbi',                false, null,       null, 238, 630, ST_SetSRID(ST_MakePoint(-46.7164, -23.6063), 4326)),
('granja-julieta',    'Granja Julieta',         false, null,       null, 280, 658, ST_SetSRID(ST_MakePoint(-46.7200, -23.6250), 4326)),
('santo-amaro-l9',    'Santo Amaro',            false, null,       null, 340, 702, ST_SetSRID(ST_MakePoint(-46.7003, -23.6540), 4326)),
('jurubatuba',        'Jurubatuba',             false, null,       null, 395, 736, ST_SetSRID(ST_MakePoint(-46.6946, -23.6674), 4326)),
('autodromo',         'Autódromo',              false, null,       null, 440, 762, ST_SetSRID(ST_MakePoint(-46.6980, -23.6850), 4326)),
('primavera-interlagos', 'Primavera-Interlagos', false, null,      null, 482, 788, ST_SetSRID(ST_MakePoint(-46.7020, -23.7000), 4326)),
('assistencia',       'Assistência',            false, null,       null, 512, 806, ST_SetSRID(ST_MakePoint(-46.6990, -23.7100), 4326)),
('graja',             'Grajaú',                 false, null,       null, 530, 820, ST_SetSRID(ST_MakePoint(-46.6980, -23.6816), 4326)),

-- ── CPTM L10 Turquesa ────────────────────────────────────────────────────────
('rio-grande-serra',  'Rio Grande da Serra',    false, null,       null, 1200, 778, ST_SetSRID(ST_MakePoint(-46.3980, -23.7450), 4326)),

-- ── CPTM L11 Coral ───────────────────────────────────────────────────────────
('estudantes',        'Estudantes',             false, null,       null, 1350, 390, ST_SetSRID(ST_MakePoint(-45.9500, -23.5500), 4326)),

-- ── CPTM L12 Safira ──────────────────────────────────────────────────────────
('eng-goulart',       'Engenheiro Goulart',     true,  null,       null, 1002, 382, ST_SetSRID(ST_MakePoint(-46.4650, -23.5140), 4326)),
('calmon-viana',      'Calmon Viana',           false, null,       null, 1350, 356, ST_SetSRID(ST_MakePoint(-46.1530, -23.4500), 4326)),

-- ── CPTM L13 Jade ────────────────────────────────────────────────────────────
('aeroporto',         'Aeroporto Guarulhos',    false, 'airport',  'Linha 13-Jade: expresso ao GRU em ~25 min por R$ 38,40.', 1350, 322, ST_SetSRID(ST_MakePoint(-46.4780, -23.4320), 4326))

ON CONFLICT (id) DO NOTHING;

-- Station↔Line
INSERT INTO metro.station_lines (station_id, line_id, position) VALUES
-- L1 Azul
('tucuruvi',         'L1', 1), ('parada-inglesa',  'L1', 2),  ('jardim-sp',       'L1', 3),
('carandiru',        'L1', 4), ('santana',         'L1', 5),  ('tiete',           'L1', 6),
('portuguesa-tiete', 'L1', 7), ('armenia',         'L1', 8),  ('tiradentes',      'L1', 9),
('luz',              'L1',10), ('sao-bento',       'L1',11),  ('se',              'L1',12),
('liberdade',        'L1',13), ('sao-joaquim',     'L1',14),  ('vergueiro',       'L1',15),
('paraiso',          'L1',16), ('ana-rosa',        'L1',17),  ('vila-mariana',    'L1',18),
('santa-cruz',       'L1',19), ('praca-arvore',    'L1',20),  ('saude',           'L1',21),
('sao-judas',        'L1',22), ('jabaquara',       'L1',23),
-- L2 Verde
('vila-madalena',    'L2', 1), ('sumare',          'L2', 2),  ('clinicas',        'L2', 3),
('consolacao',       'L2', 4), ('trianon-masp',    'L2', 5),  ('brigadeiro',      'L2', 6),
('paraiso',          'L2', 7), ('ana-rosa',        'L2', 8),  ('chacara-klabin',  'L2', 9),
('santos-imigrantes','L2',10), ('alto-ipiranga',   'L2',11),  ('sacoma',          'L2',12),
('tamanduatei',      'L2',13), ('vila-prudente',   'L2',14),
-- L3 Vermelha
('palmeiras-bf',     'L3', 1), ('marechal-deodoro','L3', 2),  ('santa-cecilia',   'L3', 3),
('republica',        'L3', 4), ('anhangabau',      'L3', 5),  ('se',              'L3', 6),
('pedro-ii',         'L3', 7), ('bras',            'L3', 8),  ('bresser-mooca',   'L3', 9),
('belem',            'L3',10), ('tatupae',         'L3',11),  ('carrao',          'L3',12),
('penha',            'L3',13), ('vila-matilde',    'L3',14),  ('guilhermina',     'L3',15),
('patriarca',        'L3',16), ('arthur-alvim',    'L3',17),  ('corinthians',     'L3',18),
-- L4 Amarela
('luz',              'L4', 1), ('higienopolis-mack','L4',2),  ('republica',       'L4', 3),
('paulista',         'L4', 4), ('oscar-freire',    'L4', 5),  ('faria-lima',      'L4', 6),
('butanta',          'L4', 7), ('morumbi',         'L4', 8),  ('giovanni-gronchi','L4', 9),
('vila-sonia',       'L4',10),
-- L5 Lilás
('capao-redondo',    'L5', 1), ('campo-limpo',     'L5', 2),  ('vila-belezas',    'L5', 3),
('giovanni-l5',      'L5', 4), ('santo-amaro',     'L5', 5),  ('largo-treze',     'L5', 6),
('adolfo-pinheiro',  'L5', 7), ('alto-boa-vista',  'L5', 8),  ('borba-gato',      'L5', 9),
('brooklin',         'L5',10), ('rep-libano',      'L5',11),  ('campo-belo',      'L5',12),
('eucaliptos',       'L5',13), ('moema',           'L5',14),  ('aacd',            'L5',15),
('hospital-sp',      'L5',16), ('santa-cruz',      'L5',17),  ('chacara-klabin',  'L5',18),
-- L7 Rubi
('luz',              'L7', 1), ('julio-prestes',   'L7', 2),  ('palmeiras-bf',    'L7', 3),
('lapa',             'L7', 4), ('pirituba',        'L7', 5),  ('francisco-morato','L7', 6),
-- L8 Diamante
('julio-prestes',    'L8', 1), ('palmeiras-bf',    'L8', 2),  ('presidente-altino-l8','L8',3),
('quitauna',         'L8', 4), ('gral-miguel-costa','L8',5),  ('dom-bosco',       'L8', 6),
('jd-silveira',      'L8', 7), ('jd-belval',       'L8', 8),  ('barueri',         'L8', 9),
('antonio-joao',     'L8',10), ('osasco',          'L8',11),  ('amador-bueno',    'L8',12),
-- L9 Esmeralda
('osasco-l9',        'L9', 1), ('presidente-altino','L9',2),  ('ceasa',           'L9', 3),
('villa-lobos',      'L9', 4), ('cidade-univ',     'L9', 5),  ('pinheiros',       'L9', 6),
('hebraica',         'L9', 7), ('butanta-l9',      'L9', 8),  ('morumbi-l9',      'L9', 9),
('granja-julieta',   'L9',10), ('santo-amaro-l9',  'L9',11),  ('jurubatuba',      'L9',12),
('autodromo',        'L9',13), ('primavera-interlagos','L9',14),('assistencia',    'L9',15),
('graja',            'L9',16),
-- L10 Turquesa
('bras',             'L10',1), ('tamanduatei',     'L10',2),  ('rio-grande-serra','L10',3),
-- L11 Coral
('luz',              'L11',1), ('bras',            'L11',2),  ('tatupae',         'L11',3),
('estudantes',       'L11',4),
-- L12 Safira
('bras',             'L12',1), ('tatupae',         'L12',2),  ('eng-goulart',     'L12',3),
('calmon-viana',     'L12',4),
-- L13 Jade
('eng-goulart',      'L13',1), ('aeroporto',       'L13',2),
-- L15 Prata
('vila-prudente',    'L15',1), ('sapopemba',       'L15',2),  ('fazenda-juta',    'L15',3),
('sao-lucas',        'L15',4), ('camilo-haddad',   'L15',5),  ('vila-tolerosa',   'L15',6),
('jd-colonial',      'L15',7), ('oratorio',        'L15',8),  ('sitio-vianas',    'L15',9),
('jd-planalto',      'L15',10),('sao-mateus',      'L15',11)
ON CONFLICT DO NOTHING;

-- Transferências
INSERT INTO metro.transfers (station_from, station_to, line_from, line_to, walk_time_s, is_intermodal) VALUES
('se', 'se', 'L1', 'L3', 60,  false),
('se', 'se', 'L3', 'L1', 60,  false),
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
('paraiso', 'paraiso', 'L1', 'L2', 90,  false),
('paraiso', 'paraiso', 'L2', 'L1', 90,  false),
('ana-rosa', 'ana-rosa', 'L1', 'L2', 90,  false),
('ana-rosa', 'ana-rosa', 'L2', 'L1', 90,  false),
('santa-cruz', 'santa-cruz', 'L1', 'L5', 90,  false),
('santa-cruz', 'santa-cruz', 'L5', 'L1', 90,  false),
('republica', 'republica', 'L3', 'L4', 90,  false),
('republica', 'republica', 'L4', 'L3', 90,  false),
('chacara-klabin', 'chacara-klabin', 'L2', 'L5', 90,  false),
('chacara-klabin', 'chacara-klabin', 'L5', 'L2', 90,  false),
('tamanduatei', 'tamanduatei', 'L2', 'L10', 90, false),
('tamanduatei', 'tamanduatei', 'L10','L2',  90, false),
('vila-prudente', 'vila-prudente', 'L2', 'L15', 90, false),
('vila-prudente', 'vila-prudente', 'L15','L2',  90, false),
('palmeiras-bf', 'palmeiras-bf', 'L3', 'L7', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L7', 'L3', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L3', 'L8', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L8', 'L3', 90,  false),
('palmeiras-bf', 'palmeiras-bf', 'L7', 'L8', 60,  false),
('palmeiras-bf', 'palmeiras-bf', 'L8', 'L7', 60,  false),
('julio-prestes', 'julio-prestes', 'L7', 'L8', 60, false),
('julio-prestes', 'julio-prestes', 'L8', 'L7', 60, false),
('bras', 'bras', 'L3', 'L10', 90, false),
('bras', 'bras', 'L10','L3',  90, false),
('bras', 'bras', 'L3', 'L11', 90, false),
('bras', 'bras', 'L11','L3',  90, false),
('bras', 'bras', 'L3', 'L12', 90, false),
('bras', 'bras', 'L12','L3',  90, false),
('tatupae', 'tatupae', 'L3', 'L11', 90, false),
('tatupae', 'tatupae', 'L11','L3',  90, false),
('tatupae', 'tatupae', 'L3', 'L12', 90, false),
('tatupae', 'tatupae', 'L12','L3',  90, false),
('eng-goulart', 'eng-goulart', 'L12', 'L13', 90, false),
('eng-goulart', 'eng-goulart', 'L13', 'L12', 90, false),
('osasco-l9',     'osasco',     'L9', 'L8', 180, true),
('osasco',        'osasco-l9',  'L8', 'L9', 180, true),
('pinheiros',     'faria-lima', 'L9', 'L4', 300, true),
('faria-lima',    'pinheiros',  'L4', 'L9', 300, true),
('santo-amaro-l9','santo-amaro','L9', 'L5', 180, true),
('santo-amaro',   'santo-amaro-l9','L5','L9',180, true),
('jurubatuba',    'santo-amaro','L9', 'L5', 240, true)
ON CONFLICT DO NOTHING;

-- Tipos de bilhete e tarifas
INSERT INTO fares.ticket_types (id, name, description) VALUES
  ('comum',      'Comum',      'Tarifa padrão sem benefício'),
  ('estudante',  'Estudante',  'Meia-entrada com cartão estudantil válido'),
  ('idoso',      'Idoso',      'Gratuidade para maiores de 65 anos'),
  ('vt',         'Vale-Transporte', 'Bilhete benefício empresa'),
  ('gratuidade', 'Gratuidade', 'PCD, acompanhante, policiais')
ON CONFLICT (id) DO NOTHING;

INSERT INTO fares.tariff_rules (ticket_type, operator, description, price_brl, integration_with) VALUES
  ('comum',     null,  'Tarifa única metrô/CPTM',         5.00, ARRAY['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13','L15']),
  ('comum',     null,  'Integração metrô + ônibus (SPTM)', 8.50, ARRAY['bus']),
  ('estudante', null,  'Meia-entrada metrô/CPTM',         2.50, ARRAY['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13','L15']),
  ('vt',        null,  'Vale-Transporte (desconto 6%)',   4.70, ARRAY['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13','L15']),
  ('idoso',     null,  'Gratuidade — sem cobrança',        0.00, ARRAY[]::TEXT[]),
  ('gratuidade',null,  'Gratuidade — sem cobrança',        0.00, ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;
