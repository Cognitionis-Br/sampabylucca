import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import postgres   from 'https://deno.land/x/postgresjs@v3.4.4/mod.js'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Content-Type': 'application/json',
}

const SYSTEM = `Você é a Lucca, assistente de mobilidade urbana do metrô de São Paulo.

Regras:
- Responda sempre em português (pt-BR), de forma concisa (máx 2 frases).
- Foco em: rotas metrô/CPTM SP, tarifas, horários, ocorrências, acessibilidade, pontos de interesse próximos a estações.
- Tarifa vigente: R$ 5,00 (bilhete único). Integração ônibus na mesma viagem sem custo adicional em até 3h.
- Horário metrô: 4h40–0h (+weekdays), 4h40–1h (sexta/sábado).
- Se não souber algo específico, indique o site metro.sp.gov.br ou o app Metrô SP.
- Nunca invente nomes de estações ou linhas que não existam na rede SP.
- Tom: amigável, direto, útil.`

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500, headers: CORS })
  }

  try {
    const { message, history = [] } = await req.json()
    if (!message) {
      return new Response(JSON.stringify({ error: 'message required' }), { status: 400, headers: CORS })
    }

    // Opcional: enriquece contexto com disruptions ativas
    let disruptions = ''
    try {
      const sql = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '', { max: 1 })
      const rows = await sql`
        SELECT title FROM metro.disruptions
        WHERE ends_at IS NULL ORDER BY starts_at DESC LIMIT 3`
      await sql.end()
      if (rows.length) {
        disruptions = `\n\nOcorrências ativas agora: ${rows.map((r: {title: string}) => r.title).join('; ')}.`
      }
    } catch { /* ignora erros de BD — continua sem contexto */ }

    const systemWithContext = SYSTEM + disruptions

    // Monta histórico no formato Anthropic (máx 10 mensagens)
    const messages = [
      ...history.slice(-10).map((m: {role: string; content: string}) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 256,
        system:     systemWithContext,
        messages,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ error: err }), { status: res.status, headers: CORS })
    }

    const data = await res.json()
    const reply = data.content?.[0]?.text ?? 'Não consegui responder agora. Tente novamente.'

    return new Response(JSON.stringify({ reply }), { headers: CORS })

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS })
  }
})
