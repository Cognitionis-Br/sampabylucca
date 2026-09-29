import { navigate } from '../modules/router.js'

export function renderRouteDetail(el, state = {}) {
  const route = state.route ?? null

  if (!route) {
    el.innerHTML = `
      <div style="padding:40px;text-align:center;color:#64748b">
        <p>Nenhuma rota selecionada.</p>
        <button class="btn-primary" style="margin-top:16px" onclick="history.back()">Voltar</button>
      </div>`
    return
  }

  const steps = route.steps ?? []

  el.innerHTML = `
    <div class="rd-screen">
      <div class="rd-header">
        <button class="rd-back" onclick="history.back()">←</button>
        <div class="rd-title-block">
          <span class="rd-title">${route.origin ?? 'Origem'} → ${route.destination ?? 'Destino'}</span>
          <span class="rd-meta">${route.totalMinutes} min · R$ ${route.fare?.toFixed(2)}</span>
        </div>
        <button class="rd-share" title="Compartilhar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      <!-- Barra de progresso -->
      <div class="rd-progress">
        <div class="rd-progress-bar" id="rd-bar" style="width:0%"></div>
      </div>

      <!-- Passo atual em destaque -->
      <div class="rd-current" id="rd-current"></div>

      <!-- Timeline completa -->
      <div class="rd-timeline" id="rd-timeline"></div>

      <!-- Botão finalizar -->
      <div class="rd-footer">
        <button class="btn-primary rd-finish" id="rd-finish">Finalizar navegação</button>
      </div>
    </div>
  `

  el.querySelector('#rd-finish')?.addEventListener('click', () => navigate('/home'))

  renderTimeline(el, steps)
  activateStep(el, steps, 0)
}

function renderTimeline(el, steps) {
  const timeline = el.querySelector('#rd-timeline')
  if (!timeline) return

  timeline.innerHTML = steps.map((s, i) => `
    <div class="rd-step" id="step-${i}" data-index="${i}">
      <div class="rd-step-icon">
        ${stepIcon(s)}
      </div>
      <div class="rd-step-body">
        ${stepBody(s)}
      </div>
    </div>
  `).join('')

  timeline.querySelectorAll('.rd-step').forEach(item => {
    item.addEventListener('click', () => {
      const i = parseInt(item.dataset.index)
      activateStep(el, steps, i)
    })
  })
}

function stepIcon(s) {
  if (s.type === 'walk')     return `<span style="font-size:1.2rem">🚶</span>`
  if (s.type === 'transfer') return `<span style="font-size:1.2rem">↔</span>`
  return `<span class="rd-line-dot" style="background:${s.lineColor}"></span>`
}

function stepBody(s) {
  if (s.type === 'walk')
    return `<strong>Caminhe</strong> ${s.estimatedMinutes} min (${s.meters ?? '~200'}m)`

  if (s.type === 'transfer')
    return `<strong>Baldeação</strong> · ${Math.round((s.walkSeconds ?? 120) / 60)} min a pé`

  return `
    <strong style="color:${s.lineColor}">${s.lineName}</strong>
    <span>${s.from} → ${s.to}</span>
    <small>${s.stationCount} estações · ${s.estimatedMinutes} min</small>
  `
}

function activateStep(el, steps, index) {
  // Highlight na timeline
  el.querySelectorAll('.rd-step').forEach((item, i) => {
    item.classList.toggle('active',   i === index)
    item.classList.toggle('done',     i < index)
  })

  // Atualiza destaque principal
  const current = el.querySelector('#rd-current')
  const s = steps[index]
  if (!s || !current) return

  current.innerHTML = `
    <div class="rd-current-inner">
      <div class="rd-current-icon">${currentIcon(s)}</div>
      <div class="rd-current-text">
        <h3>${currentTitle(s)}</h3>
        <p>${currentDesc(s)}</p>
      </div>
      ${index < steps.length - 1
        ? `<button class="rd-next" id="rd-next">Próximo →</button>`
        : `<span class="rd-done-badge">✓ Chegou!</span>`}
    </div>
  `

  el.querySelector('#rd-next')?.addEventListener('click', () => {
    if (index < steps.length - 1) activateStep(el, steps, index + 1)
  })

  // Atualiza progresso
  const bar = el.querySelector('#rd-bar')
  if (bar) bar.style.width = `${((index + 1) / steps.length) * 100}%`
}

function currentIcon(s) {
  if (s.type === 'walk')     return '🚶'
  if (s.type === 'transfer') return '↔'
  return `<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${s.lineColor}"></span>`
}

function currentTitle(s) {
  if (s.type === 'walk')     return 'Caminhe'
  if (s.type === 'transfer') return 'Faça a baldeação'
  return s.lineName ?? 'Embarque'
}

function currentDesc(s) {
  if (s.type === 'walk')     return `${s.estimatedMinutes ?? 2} min a pé`
  if (s.type === 'transfer') return `Troca de linha · ${Math.round((s.walkSeconds ?? 120) / 60)} min`
  return `${s.from} → ${s.to} · ${s.stationCount} estações`
}

export const routeDetailCSS = `
.rd-screen { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.rd-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-bottom: 1px solid #f1f5f9;
}
.rd-back { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; padding: 4px 8px; }
.rd-title-block { flex: 1; display: flex; flex-direction: column; }
.rd-title { font-size: .9rem; font-weight: 700; color: #0f172a; }
.rd-meta  { font-size: .78rem; color: #64748b; }
.rd-share { background: none; border: none; cursor: pointer; color: #64748b; }

.rd-progress { height: 4px; background: #f1f5f9; }
.rd-progress-bar { height: 100%; background: #0f2d52; transition: width .3s ease; }

.rd-current {
  padding: 20px 16px; border-bottom: 1px solid #f1f5f9;
  background: #f8fafc; flex-shrink: 0;
}
.rd-current-inner {
  display: flex; align-items: center; gap: 16px;
}
.rd-current-icon { font-size: 2rem; flex-shrink: 0; }
.rd-current-text { flex: 1; }
.rd-current-text h3 { margin: 0 0 4px; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
.rd-current-text p  { margin: 0; font-size: .9rem; color: #64748b; }
.rd-next {
  flex-shrink: 0; background: #0f2d52; color: #fff;
  border: none; border-radius: 10px; padding: 10px 16px;
  font-size: .85rem; font-weight: 700; cursor: pointer;
  white-space: nowrap;
}
.rd-done-badge {
  flex-shrink: 0; background: #dcfce7; color: #16a34a;
  font-size: .85rem; font-weight: 700; padding: 8px 14px;
  border-radius: 10px;
}

.rd-timeline { flex: 1; padding: 8px 16px 80px; overflow-y: auto; }
.rd-step {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid #f8fafc;
  cursor: pointer; transition: background .1s;
}
.rd-step.active { background: #eff6ff; margin: 0 -16px; padding-left: 16px; padding-right: 16px; border-radius: 10px; }
.rd-step.done .rd-step-icon { opacity: .4; }
.rd-step.done .rd-step-body { opacity: .5; }
.rd-step-icon {
  width: 28px; height: 28px; display: flex; align-items: center;
  justify-content: center; flex-shrink: 0; margin-top: 2px;
}
.rd-line-dot { width: 14px; height: 14px; border-radius: 50%; }
.rd-step-body {
  flex: 1; display: flex; flex-direction: column; gap: 3px;
  font-size: .88rem; color: #374151; line-height: 1.4;
}
.rd-step-body strong { font-weight: 700; color: #0f172a; }
.rd-step-body small  { color: #94a3b8; font-size: .78rem; }

.rd-footer {
  position: fixed; bottom: 0; left: 0; right: 0;
  padding: 12px 16px; padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: #fff; border-top: 1px solid #f1f5f9;
}
`
