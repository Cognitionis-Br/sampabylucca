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
    const { origin, destination } = await req.json()

    if (!origin || !destination) {
      return new Response(JSON.stringify({ error: 'origin and destination required' }), { status: 400, headers: CORS })
    }

    // Load stations + lines + transfers
    const stations  = await sql`SELECT id, name FROM metro.stations`
    const lineLinks = await sql`SELECT station_id, line_id, position FROM metro.station_lines ORDER BY line_id, position`
    const transfers = await sql`
      SELECT station_from, station_to, walk_time_s
      FROM metro.transfers`
    const lines = await sql`SELECT id, name, color_hex FROM metro.lines`

    await sql.end()

    // Build adjacency: for each station, list edges {to, lineId, walkSecs}
    const adj: Record<string, {to: string, lineId?: string, walkSecs: number}[]> = {}
    const stationLine: Record<string, string[]> = {}
    const lineColor: Record<string, string> = {}
    const lineName:  Record<string, string> = {}

    for (const l of lines) {
      lineColor[l.id] = l.color_hex ?? '#888'
      lineName[l.id]  = l.name
    }
    for (const lk of lineLinks) {
      stationLine[lk.station_id] = stationLine[lk.station_id] ?? []
      stationLine[lk.station_id].push(lk.line_id)
    }

    // Within each line, connect adjacent stations in position order
    const byLine: Record<string, string[]> = {}
    for (const lk of lineLinks) {
      byLine[lk.line_id] = byLine[lk.line_id] ?? []
      byLine[lk.line_id].push(lk.station_id)
    }
    for (const [lid, sids] of Object.entries(byLine)) {
      for (let i = 0; i < sids.length - 1; i++) {
        const a = sids[i], b = sids[i + 1]
        adj[a] = adj[a] ?? []; adj[b] = adj[b] ?? []
        adj[a].push({ to: b, lineId: lid, walkSecs: 120 })
        adj[b].push({ to: a, lineId: lid, walkSecs: 120 })
      }
    }
    // Add transfer edges
    for (const t of transfers) {
      const a = t.station_from, b = t.station_to
      adj[a] = adj[a] ?? []; adj[b] = adj[b] ?? []
      adj[a].push({ to: b, walkSecs: t.walk_time_s })
      adj[b].push({ to: a, walkSecs: t.walk_time_s })
    }

    // Dijkstra
    const dist: Record<string, number> = {}
    const prev: Record<string, {from: string, lineId?: string, walkSecs: number} | null> = {}
    const visited = new Set<string>()
    for (const s of stations) dist[s.id] = Infinity
    dist[origin] = 0
    prev[origin] = null

    const pq: [number, string][] = [[0, origin]]
    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0])
      const [d, u] = pq.shift()!
      if (visited.has(u)) continue
      visited.add(u)
      for (const edge of adj[u] ?? []) {
        const nd = d + edge.walkSecs
        if (nd < (dist[edge.to] ?? Infinity)) {
          dist[edge.to] = nd
          prev[edge.to] = { from: u, lineId: edge.lineId, walkSecs: edge.walkSecs }
          pq.push([nd, edge.to])
        }
      }
    }

    if (dist[destination] === Infinity) {
      return new Response(JSON.stringify({ routes: [] }), { headers: CORS })
    }

    // Reconstruct path
    const path: {stationId: string, lineId?: string}[] = []
    let cur: string | null = destination
    while (cur) {
      const p = prev[cur]
      path.unshift({ stationId: cur, lineId: p?.lineId })
      cur = p?.from ?? null
    }

    const stationById: Record<string, string> = {}
    for (const s of stations) stationById[s.id] = s.name

    // Build steps
    const steps: object[] = []
    let i = 0
    while (i < path.length - 1) {
      const lid = path[i + 1].lineId
      if (!lid) {
        const walkSecs = transfers.find(
          (t: {station_from: string; station_to: string}) =>
            (t.station_from === path[i].stationId && t.station_to === path[i+1].stationId) ||
            (t.station_to === path[i].stationId && t.station_from === path[i+1].stationId)
        )?.walk_time_s ?? 180
        steps.push({ type: 'transfer', walkSeconds: walkSecs })
        i++
        continue
      }
      let j = i + 1
      while (j < path.length && path[j].lineId === lid) j++
      // segment i..j on same line
      const count = j - i
      const secs  = count * 120
      steps.push({
        type:             'ride',
        line:             lid,
        lineName:         lineName[lid] ?? lid,
        lineColor:        lineColor[lid] ?? '#888',
        from:             stationById[path[i].stationId],
        to:               stationById[path[j - 1].stationId],
        stationCount:     count,
        estimatedMinutes: Math.round(secs / 60),
      })
      i = j - 1
      i++
    }

    const totalSecs = dist[destination]
    const fare = 5.00

    return new Response(JSON.stringify({
      routes: [{
        totalMinutes: Math.round(totalSecs / 60),
        fare,
        steps,
      }]
    }), { headers: CORS })

  } catch (err) {
    try { await sql.end() } catch { /* ignore */ }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS })
  }
})
