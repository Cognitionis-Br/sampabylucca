// Parser determinístico de intenções (R1)
// R3+ migra para Claude Haiku via Edge Function lucca-chat

const INTENTS = [
  { pattern: /^(ir|como chegar|rota para|preciso ir)\s+(?:para\s+)?(.+)/i, intent: 'ROUTE', extract: m => ({ destination: m[2] }) },
  { pattern: /^(de|saindo de|partindo de)\s+(.+)\s+(para|até|a)\s+(.+)/i, intent: 'ROUTE', extract: m => ({ origin: m[2], destination: m[4] }) },
  { pattern: /^(tarifa|preço|quanto custa|valor)/i, intent: 'FARE', extract: () => ({}) },
  { pattern: /^(ocorrência|problema|interrupção|aviso|alerta)/i, intent: 'DISRUPTION', extract: () => ({}) },
  { pattern: /^(perto de mim|próximo|restaurante|café|farmácia|hospital)/i, intent: 'NEARBY', extract: m => ({ query: m[0] }) },
  { pattern: /^(olá|oi|tudo bem|ajuda|o que você faz)/i, intent: 'GREET', extract: () => ({}) },
  { pattern: /^(linha|status)\s+(\d+)/i, intent: 'LINE_STATUS', extract: m => ({ line: `L${m[2]}` }) },
]

export function parseIntent(text) {
  const t = text.trim()
  for (const { pattern, intent, extract } of INTENTS) {
    const m = t.match(pattern)
    if (m) return { intent, ...extract(m), raw: t }
  }
  return { intent: 'UNKNOWN', raw: t }
}

export const RESPONSES = {
  GREET:      () => 'Olá! Sou a Lucca, sua guia do metrô de São Paulo. Para onde você quer ir?',
  FARE:       () => 'A tarifa padrão é R$ 5,00 (integração metrô + CPTM). Meia para estudantes: R$ 2,50.',
  DISRUPTION: () => 'Vou verificar as ocorrências em tempo real para você...',
  NEARBY:     ({ query }) => `Buscando ${query ?? 'lugares'} perto de você...`,
  UNKNOWN:    ({ raw }) => `Não entendi "${raw}". Tente: "ir para Sé", "quanto custa a passagem" ou "ocorrências linha 2".`,
}
