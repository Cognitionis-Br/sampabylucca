import { navigate }  from '../modules/router.js'
import { supabase }  from '../modules/supabase.js'

let mapInstance = null

const LINE_COLORS = {
  L1: '#1566b0', L2: '#007a3d', L3: '#ef3e24', L4: '#ffd500',
  L5: '#9b2584', L7: '#c8962e', L8: '#97999b', L9: '#00a859',
  L10: '#007bc0', L11: '#f37021', L12: '#0087ca', L13: '#00bcd4',
  L15: '#ef3e24',
}

export async function renderMap(el) {
  el.innerHTML = `
    <div class="map-screen">
      <div class="map-header">
        <button class="map-back" onclick="history.back()">←</button>
        <h2>Mapa do Metro</h2>
        <button class="map-locate" id="map-locate" title="Minha localização">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
          </svg>
        </button>
      </div>
      <div id="leaflet-map" style="flex:1;min-height:0"></div>
      <div class="map-legend" id="map-legend"></div>

      <nav class="bottom-nav">
        <button class="nav-item active" data-route="/home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Explorar</span>
        </button>
        <button class="nav-item" data-route="/route">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 0 1 4-4h4"/><path d="M14 21h4a2 2 0 0 0 0-4h-4"/></svg>
          <span>Rotas</span>
        </button>
        <button class="nav-item" data-route="/disruptions">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Perto</span>
        </button>
        <button class="nav-item" data-route="/favorites">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>Favoritos</span>
        </button>
        <button class="nav-item" data-route="/more">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          <span>Mais</span>
        </button>
      </nav>
    </div>
  `

  el.querySelectorAll('.nav-item').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.route))
  )

  await loadLeaflet()
  await initMap(el)

  el.querySelector('#map-locate')?.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(pos => {
      if (mapInstance) mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 15)
    })
  })
}

function loadLeaflet() {
  if (window.L) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload  = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function initMap(el) {
  const mapEl = el.querySelector('#leaflet-map')
  if (!mapEl) return

  // São Paulo centro
  const map = window.L.map(mapEl, {
    center: [-23.55, -46.63],
    zoom: 12,
    zoomControl: false,
  })
  mapInstance = map

  window.L.control.zoom({ position: 'topright' }).addTo(map)

  window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  // Carrega estações + linhas
  const [{ data: stations }, { data: stLines }, { data: lines }] = await Promise.all([
    supabase.from('metro_stations').select('id, name, lat, lng').not('lat', 'is', null),
    supabase.from('metro_station_lines').select('station_id, line_id'),
    supabase.from('metro_lines').select('id, name, nickname, color_hex'),
  ])

  if (!stations?.length) return

  // Map station → lines
  const stationLineMap = {}
  for (const sl of stLines ?? []) {
    stationLineMap[sl.station_id] = stationLineMap[sl.station_id] ?? []
    stationLineMap[sl.station_id].push(sl.line_id)
  }

  const lineColorMap = {}
  for (const l of lines ?? []) lineColorMap[l.id] = l.color_hex

  // Desenha marcadores
  for (const s of stations) {
    if (!s.lat || !s.lng) continue
    const lineIds = stationLineMap[s.id] ?? []
    const color   = (lineIds.length ? lineColorMap[lineIds[0]] : null) ?? '#0f2d52'
    const isHub   = lineIds.length > 1

    const icon = window.L.divIcon({
      html: `<div class="map-marker${isHub ? ' hub' : ''}" style="background:${color};border-color:${color}"></div>`,
      className: '',
      iconSize:  isHub ? [14, 14] : [10, 10],
      iconAnchor: isHub ? [7, 7] : [5, 5],
    })

    window.L.marker([s.lat, s.lng], { icon })
      .bindPopup(`<strong>${s.name}</strong><br><small>${lineIds.join(', ')}</small>`)
      .addTo(map)
  }

  // Legenda de linhas
  const legend = el.querySelector('#map-legend')
  if (legend && lines?.length) {
    legend.innerHTML = lines.map(l =>
      `<span class="legend-item">
        <span class="legend-dot" style="background:${l.color_hex}"></span>
        <span>${l.nickname ?? l.name}</span>
      </span>`
    ).join('')
  }
}

export const mapCSS = `
.map-screen { display: flex; flex-direction: column; height: 100vh; background: #fff; }

.map-header {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0; z-index: 401;
}
.map-back { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; padding: 4px 8px; }
.map-header h2 { flex: 1; margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.map-locate {
  background: #f1f5f9; border: none; border-radius: 50%;
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #0f2d52;
}

#leaflet-map { flex: 1; min-height: 0; }

.map-legend {
  display: flex; gap: 8px; padding: 10px 16px; overflow-x: auto;
  border-top: 1px solid #f1f5f9; flex-shrink: 0;
  scrollbar-width: none; background: #fff;
}
.map-legend::-webkit-scrollbar { display: none; }
.legend-item { display: flex; align-items: center; gap: 5px; flex-shrink: 0; font-size: .75rem; color: #374151; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.map-marker {
  border-radius: 50%; border: 2px solid; opacity: .9;
}
.map-marker.hub {
  border-color: #fff !important;
  box-shadow: 0 0 0 2px var(--hub-color, #0f2d52);
}
`
