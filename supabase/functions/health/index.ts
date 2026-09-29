import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js'

serve(async () => {
  const sql = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '', { max: 1 })

  try {
    const [{ stations }] = await sql`SELECT COUNT(*)::int AS stations FROM metro.stations`
    const [{ lines }]    = await sql`SELECT COUNT(*)::int AS lines    FROM metro.lines`

    await sql.end()

    return new Response(
      JSON.stringify({
        status:    'ok',
        version:   '0.1.0-r0',
        timestamp: new Date().toISOString(),
        db: { stations, lines },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    await sql.end()
    return new Response(
      JSON.stringify({ status: 'error', message: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
