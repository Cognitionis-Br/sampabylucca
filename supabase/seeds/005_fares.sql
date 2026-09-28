-- Tipos de bilhete e tarifas iniciais (R1 — estáticas)
INSERT INTO fares.ticket_types (id, name, description) VALUES
  ('comum',      'Comum',      'Tarifa padrão sem benefício'),
  ('estudante',  'Estudante',  'Meia-entrada com cartão estudantil válido'),
  ('idoso',      'Idoso',      'Gratuidade para maiores de 65 anos'),
  ('vt',         'Vale-Transporte', 'Bilhete benefício empresa'),
  ('gratuidade', 'Gratuidade', 'PCD, acompanhante, policiais')
ON CONFLICT (id) DO NOTHING;

-- Tarifas vigentes (ajustar conforme tabela oficial SPTrans/Metrô)
INSERT INTO fares.tariff_rules (ticket_type, operator, description, price_brl, integration_with) VALUES
  ('comum',     null,  'Tarifa única metrô/CPTM',         5.00, ARRAY['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13','L15']),
  ('comum',     null,  'Integração metrô + ônibus (SPTM)', 8.50, ARRAY['bus']),
  ('estudante', null,  'Meia-entrada metrô/CPTM',         2.50, ARRAY['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13','L15']),
  ('vt',        null,  'Vale-Transporte (desconto 6%)',   4.70, ARRAY['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13','L15']),
  ('idoso',     null,  'Gratuidade — sem cobrança',        0.00, ARRAY[]::TEXT[]),
  ('gratuidade',null,  'Gratuidade — sem cobrança',        0.00, ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;
