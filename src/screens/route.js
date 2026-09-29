import { navigate }                     from '../modules/router.js'
import { supabase }                     from '../modules/supabase.js'
import { addFavorite, isFavorite }      from '../modules/favorites.js'

let origin = ''
let destination = ''

export async function renderRoute(el, state = {}) {
  if (state.origin)      origin      = state.origin
  if (state.destination) destination = state.destination

  el.innerHTML = `
    <div class="route-screen">
      <!-- Header -->
      <div class="route-header">
        <button class="route-back" onclick="history.back()">←</button>
        <h2>Como chegar</h2>
        <button class="route-share" title="Compartilhar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      </div>

      <!-- Campos OD -->
      <div class="route-od">
        <div class="od-field" id="od-origin">
          <span class="od-dot origin"></span>
          <input class="od-input" id="input-origin"
            placeholder="Origem" value="${origin}"
            autocomplete="off" spellcheck="false">
        </div>
        <button class="od-swap" id="btn-swap" title="Inverter">⇅</button>
        <div class="od-field" id="od-destination">
          <span class="od-dot dest"></span>
          <input class="od-input" id="input-dest"
            placeholder="Destino" value="${destination}"
            autocomplete="off" spellcheck="false">
        </div>
      </div>

      <!-- Autocomplete -->
      <div class="route-autocomplete" id="autocomplete" hidden></div>

      <!-- Modal de resultados -->
      <div class="route-results" id="route-results">
        ${origin && destination ? '<div class="loader">Calculando rotas...</div>' : renderEmpty()}
      </div>
    </div>
  `

  setupInputs(el)
  if (origin && destination) searchRoute(el)
}

function renderEmpty() {
  return `
    <div class="route-empty">
      <p>Digite origem e destino para ver as rotas disponíveis.</p>
    </div>
  `
}

function setupInputs(el) {
  let focused = null

  const originInput = el.querySelector('#input-origin')
  const destInput   = el.querySelector('#input-dest')
  const ac          = el.querySelector('#autocomplete')

  const onInput = async (e) => {
    const q = e.target.value.trim()
    if (q.length < 2) { ac.hidden = true; return }

    const { data } = await supabase
      .from('metro_stations')
      .select('id, name')
      .ilike('name', `%${q}%`)
      .limit(8)

    if (!data?.length) { ac.hidden = true; return }

    ac.hidden = false
    ac.innerHTML = data.map(s => `
      <button class="ac-item" data-id="${s.id}" data-name="${s.name}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f2d52" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5 8 14 8 14s8-9 8-14a8 8 0 0 0-8-8z"/></svg>
        ${s.name}
      </button>
    `).join('')

    ac.querySelectorAll('.ac-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (focused === 'origin') {
          origin = btn.dataset.name
          originInput.value = origin
        } else {
          destination = btn.dataset.name
          destInput.value = destination
        }
        ac.hidden = true
        if (origin && destination) searchRoute(el)
      })
    })
  }

  originInput.addEventListener('focus', () => { focused = 'origin' })
  destInput.addEventListener('focus',   () => { focused = 'dest' })
  originInput.addEventListener('input', onInput)
  destInput.addEventListener('input',   onInput)

  el.querySelector('#btn-swap')?.addEventListener('click', () => {
    ;[origin, destination] = [destination, origin]
    originInput.value = origin
    destInput.value   = destination
    if (origin && destination) searchRoute(el)
  })
}

async function searchRoute(el) {
  const results = el.querySelector('#route-results')
  results.innerHTML = '<div class="loader">Calculando rotas...</div>'

  try {
    const originId = await stationIdByName(origin)
    const destId   = await stationIdByName(destination)

    if (!originId || !destId) {
      results.innerHTML = `<div class="route-error">Estação não encontrada. Verifique origem/destino.</div>`
      return
    }

    // Chama Edge Function route-plan
    const res  = await fetch(`${__SUPABASE_URL__}/functions/v1/route-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${__SUPABASE_ANON_KEY__}`,
      },
      body: JSON.stringify({ origin: originId, destination: destId }),
    })

    const data = await res.json()

    if (!data.routes?.length) {
      results.innerHTML = `<div class="route-error">Nenhuma rota encontrada entre ${origin} e ${destination}.</div>`
      return
    }

    renderResults(results, data.routes)
  } catch (err) {
    results.innerHTML = `<div class="route-error">Erro ao calcular rota. Verifique sua conexão.</div>`
  }
}

async function stationIdByName(name) {
  const { data } = await supabase
    .from('metro_stations')
    .select('id')
    .ilike('name', name)
    .limit(1)
  return data?.[0]?.id ?? null
}

let _lastRoutes = []

function renderResults(el, routes) {
  _lastRoutes = routes
  el.innerHTML = routes.map((r, i) => `
    <div class="route-card${i === 0 ? ' best' : ''}">
      ${i === 0 ? '<span class="best-badge">Melhor opção</span>' : ''}
      <div class="route-card-top">
        <span class="route-time">${r.totalMinutes} min</span>
        <div class="route-modes">
          ${r.steps.filter(s => s.type === 'ride').map(s =>
            `<span class="mode-badge" style="background:${s.lineColor}20;color:${s.lineColor}">${s.line}</span>`
          ).join('')}
        </div>
        <span class="route-fare">R$ ${r.fare?.toFixed(2)}</span>
      </div>
      <div class="route-steps">
        ${r.steps.map(s => renderStep(s)).join('')}
      </div>
      <div class="route-card-actions">
        ${i === 0 ? `<button class="btn-primary route-start">Iniciar</button>` : ''}
        <button class="route-fav ${isFavorite(origin, destination) ? 'saved' : ''}"
          data-origin="${origin}" data-dest="${destination}"
          title="${isFavorite(origin, destination) ? 'Remover dos favoritos' : 'Salvar nos favoritos'}">
          ${isFavorite(origin, destination) ? '♥' : '♡'}
        </button>
      </div>
    </div>
  `).join('')

  el.querySelectorAll('.route-start').forEach((btn, i) => {
    btn.addEventListener('click', () => navigate('/route-detail', {
      route: { ..._lastRoutes[i] ?? _lastRoutes[0], origin, destination },
    }))
  })

  el.querySelectorAll('.route-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      const added = addFavorite({
        origin:      btn.dataset.origin,
        destination: btn.dataset.dest,
        label:       `${btn.dataset.origin} → ${btn.dataset.dest}`,
        icon:        '⭐',
      })
      btn.textContent = added ? '♥' : '♡'
      btn.classList.toggle('saved', added)
    })
  })
}

function renderStep(s) {
  if (s.type === 'walk') return `
    <div class="step step-walk">
      <span class="step-icon">🚶</span>
      <span>Caminhe ${s.estimatedMinutes} min (${s.meters}m)</span>
    </div>`

  if (s.type === 'transfer') return `
    <div class="step step-transfer">
      <span class="step-icon">↔</span>
      <span>Baldeação · ${Math.round(s.walkSeconds / 60)} min</span>
    </div>`

  return `
    <div class="step step-ride">
      <span class="step-dot" style="background:${s.lineColor}"></span>
      <div class="step-info">
        <span class="step-line" style="color:${s.lineColor}">${s.lineName}</span>
        <span class="step-detail">${s.from} → ${s.to} · ${s.stationCount} estações · ${s.estimatedMinutes} min</span>
      </div>
    </div>`
}

export const routeCSS = `
.route-screen { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.route-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; border-bottom: 1px solid #f1f5f9;
}
.route-back { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; padding: 4px 8px; }
.route-header h2 { flex: 1; margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.route-share { background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; }

.route-od {
  padding: 16px; display: flex; flex-direction: column;
  gap: 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  position: relative;
}
.od-field {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;
}
.od-field:focus-within { border-color: #0f2d52; }
.od-dot {
  width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
}
.od-dot.origin { background: #0f2d52; }
.od-dot.dest   { background: #ef4444; }
.od-input { flex: 1; border: none; outline: none; font-size: .95rem; color: #0f172a; background: transparent; }
.od-swap {
  position: absolute; right: 28px; top: 50%; transform: translateY(-50%);
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 50%;
  width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  color: #0f2d52; z-index: 2;
}

.route-autocomplete {
  margin: 0 16px; background: #fff;
  border: 1.5px solid #e2e8f0; border-radius: 12px;
  overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,.08);
}
.ac-item {
  width: 100%; padding: 12px 16px; text-align: left;
  background: none; border: none; border-bottom: 1px solid #f1f5f9;
  cursor: pointer; font-size: .9rem; color: #0f172a;
  display: flex; align-items: center; gap: 10px;
}
.ac-item:hover { background: #f8fafc; }
.ac-item:last-child { border-bottom: none; }

.route-results { flex: 1; padding: 16px; overflow-y: auto; }
.loader { text-align: center; color: #64748b; padding: 40px 0; }
.route-empty { color: #94a3b8; font-size: .9rem; text-align: center; padding: 40px 0; }
.route-error { color: #ef4444; font-size: .9rem; text-align: center; padding: 24px; }

.route-card {
  border: 1.5px solid #e2e8f0; border-radius: 16px;
  padding: 16px; margin-bottom: 12px; position: relative;
}
.route-card.best { border-color: #0f2d52; }
.best-badge {
  position: absolute; top: -10px; left: 16px;
  background: #0f2d52; color: #fff; font-size: .7rem;
  font-weight: 700; padding: 3px 10px; border-radius: 10px;
}
.route-card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.route-time { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
.route-modes { flex: 1; display: flex; gap: 6px; flex-wrap: wrap; }
.mode-badge { font-size: .7rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
.route-fare { font-size: .95rem; font-weight: 700; color: #0f2d52; white-space: nowrap; }

.route-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.step { display: flex; align-items: flex-start; gap: 10px; font-size: .85rem; color: #374151; }
.step-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
.step-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }
.step-info { display: flex; flex-direction: column; gap: 2px; }
.step-line { font-weight: 700; font-size: .85rem; }
.step-detail { color: #64748b; font-size: .8rem; }

.route-card-actions { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.route-start { flex: 1; }
.route-fav {
  background: none; border: 1.5px solid #e2e8f0; border-radius: 10px;
  width: 42px; height: 42px; font-size: 1.2rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #94a3b8; transition: all .15s; flex-shrink: 0;
}
.route-fav.saved { color: #ef4444; border-color: #fecaca; background: #fff5f5; }
`
