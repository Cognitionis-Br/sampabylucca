import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'

export async function renderNearby(el) {
  el.innerHTML = `
    <div class="nearby-screen">
      <div class="nearby-header">
        <button class="nearby-back" onclick="history.back()">←</button>
        <h2>Perto de você</h2>
        <button class="nearby-refresh" id="nearby-refresh" title="Atualizar">↻</button>
      </div>

      <div class="nearby-status" id="nearby-status">
        <div class="nearby-locating">
          <span class="nearby-locating-icon">📍</span>
          <p>Obtendo sua localização...</p>
        </div>
      </div>

      <div class="nearby-list" id="nearby-list" hidden></div>

      <nav class="bottom-nav">
        <button class="nav-item" data-route="/home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Explorar</span>
        </button>
        <button class="nav-item" data-route="/route">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 0 1 4-4h4"/><path d="M14 21h4a2 2 0 0 0 0-4h-4"/></svg>
          <span>Rotas</span>
        </button>
        <button class="nav-item active" data-route="/nearby">
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

  const load = () => locate(el)
  el.querySelector('#nearby-refresh')?.addEventListener('click', load)
  load()
}

function locate(el) {
  const status = el.querySelector('#nearby-status')
  const list   = el.querySelector('#nearby-list')

  status.hidden = false
  list.hidden   = true
  status.innerHTML = `
    <div class="nearby-locating">
      <span class="nearby-locating-icon">📍</span>
      <p>Obtendo sua localização...</p>
    </div>`

  if (!navigator.geolocation) {
    showError(status, 'Geolocalização não disponível neste dispositivo.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    pos => fetchNearby(el, pos.coords.latitude, pos.coords.longitude),
    err => {
      const msgs = {
        1: 'Permissão de localização negada. Ative nas configurações do navegador.',
        2: 'Localização indisponível. Verifique o GPS.',
        3: 'Tempo esgotado. Tente novamente.',
      }
      showError(status, msgs[err.code] ?? 'Erro ao obter localização.')
    },
    { timeout: 10000, maximumAge: 60000 }
  )
}

async function fetchNearby(el, lat, lng) {
  const status = el.querySelector('#nearby-status')
  const list   = el.querySelector('#nearby-list')

  try {
    // Busca estações com lat/lng e calcula distância no cliente
    const { data: stations, error } = await supabase
      .from('metro_stations')
      .select('id, name, lat, lng')
      .not('lat', 'is', null)

    if (error) throw error

    // Calcula distância haversine e ordena
    const withDist = stations
      .map(s => ({ ...s, dist: haversine(lat, lng, s.lat, s.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 8)

    status.hidden = true
    list.hidden   = false
    renderList(list, withDist, lat, lng)
  } catch {
    showError(status, 'Erro ao carregar estações. Verifique a conexão.')
  }
}

function renderList(el, stations, userLat, userLng) {
  el.innerHTML = `
    <div class="nearby-intro">
      <span class="nearby-pin">📍</span>
      <span>Estações mais próximas de você</span>
    </div>
    ${stations.map((s, i) => `
      <div class="nearby-item">
        <div class="nearby-rank">${i + 1}</div>
        <div class="nearby-info">
          <span class="nearby-name">${s.name}</span>
          <span class="nearby-dist">${formatDist(s.dist)}</span>
        </div>
        <button class="nearby-go" data-dest="${s.name}" title="Ir até ${s.name}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/>
            <path d="M6 17V9a4 4 0 0 1 4-4h4"/>
            <path d="M14 21h4a2 2 0 0 0 0-4h-4"/>
          </svg>
        </button>
      </div>
    `).join('')}
  `

  el.querySelectorAll('.nearby-go').forEach(btn => {
    btn.addEventListener('click', () =>
      navigate('/route', { destination: btn.dataset.dest })
    )
  })
}

function showError(el, msg) {
  el.innerHTML = `
    <div class="nearby-locating">
      <span class="nearby-locating-icon">⚠️</span>
      <p>${msg}</p>
    </div>`
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000 // metros
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function formatDist(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export const nearbyCSS = `
.nearby-screen { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.nearby-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; border-bottom: 1px solid #f1f5f9;
}
.nearby-back { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; padding: 4px 8px; }
.nearby-header h2 { flex: 1; margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.nearby-refresh { background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #0f2d52; }

.nearby-status { flex: 1; display: flex; align-items: center; justify-content: center; }
.nearby-locating { text-align: center; padding: 40px 24px; }
.nearby-locating-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
.nearby-locating p { color: #64748b; font-size: .9rem; margin: 0; }

.nearby-list { flex: 1; padding: 0 0 80px; overflow-y: auto; }

.nearby-intro {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 16px; font-size: .8rem; color: #64748b;
  border-bottom: 1px solid #f1f5f9;
}
.nearby-pin { font-size: 1rem; }

.nearby-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-bottom: 1px solid #f8fafc;
}
.nearby-rank {
  width: 28px; height: 28px; background: #f1f5f9;
  border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: .78rem; font-weight: 700;
  color: #64748b; flex-shrink: 0;
}
.nearby-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.nearby-name { font-size: .9rem; font-weight: 600; color: #0f172a; }
.nearby-dist { font-size: .78rem; color: #64748b; }
.nearby-go {
  background: #eff6ff; border: none; border-radius: 10px;
  width: 38px; height: 38px; display: flex; align-items: center;
  justify-content: center; cursor: pointer; color: #0f2d52;
  flex-shrink: 0;
}
`
