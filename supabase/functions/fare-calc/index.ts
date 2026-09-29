import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const sql = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '', { max: 1 })

  try {
    const body = await req.json().catch(() => ({}))
    const { ticket_type = 'single', transfers = 0 } = body

    // Look up active tariff
    const [rule] = await sql`
      SELECT base_fare, transfer_discount
      FROM fares.tariff_rules
      WHERE valid_from <= CURRENT_DATE
        AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
      ORDER BY valid_from DESC
      LIMIT 1
    `
    await sql.end()

    if (!rule) {
      return new Response(JSON.stringify({ error: 'No active tariff found' }), { status: 404, headers: CORS })
    }

    const base: number = parseFloat(rule.base_fare)
    const discount: number = parseFloat(rule.transfer_discount ?? '0')

    let fare = base
    // Apply integration discount for transfers (same ticket)
    if (transfers > 0 && discount > 0) {
      fare = base * (1 - discount / 100)
    }
    // Student half-fare
    if (ticket_type === 'student') fare = fare / 2

    return new Response(JSON.stringify({
      fare:          parseFloat(fare.toFixed(2)),
      base_fare:     base,
      ticket_type,
      transfers_applied: transfers > 0,
      currency:      'BRL',
    }), { headers: CORS })

  } catch (err) {
    try { await sql.end() } catch { /* ignore */ }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS })
  }
})
