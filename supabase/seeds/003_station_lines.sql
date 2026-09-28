-- Relacionamento estação↔linha (posição na linha = ordem de inserção)
-- Usado pelo BFS para construir o grafo

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
