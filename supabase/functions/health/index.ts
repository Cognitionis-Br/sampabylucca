import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { count: stations } = await supabase
    .from('metro.stations')
    .select('*', { count: 'exact', head: true })

  const { count: lines } = await supabase
    .from('metro.lines')
    .select('*', { count: 'exact', head: true })

  return new Response(
    JSON.stringify({
      status:    'ok',
      version:   '0.1.0-r0',
      timestamp: new Date().toISOString(),
      db: {
        stations: stations ?? 0,
        lines:    lines    ?? 0,
      },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
