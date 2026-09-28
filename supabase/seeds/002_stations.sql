-- Estações — dados do POC sampa-metro/index.html
-- Coordenadas: lat/lng reais (GEO object do POC)
-- SVG x/y: posições no mapa esquemático (viewBox 0 0 1400 900)

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
