import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'

const SEV_LABEL = { low: 'Leve', medium: 'Moderado', high: 'Grave', critical: 'Crítico' }
const SEV_COLOR = { low: '#16a34a', medium: '#f59e0b', high: '#ef4444', critical: '#7f1d1d' }
const SEV_BG    = { low: '#dcfce7', medium: '#fef3c7', high: '#fee2e2', critical: '#fca5a5' }

export async function renderDisruptions(el) {
  el.innerHTML = `
    <div class="dis-screen">
      <div class="dis-header">
        <button class="dis-back" onclick="history.back()">←</button>
        <h2>Ao Vivo</h2>
        <button class="dis-refresh" id="dis-refresh" title="Atualizar">↻</button>
      </div>

      <div class="dis-tabs">
        <button class="dis-tab active" data-filter="all">Todas</button>
        <button class="dis-tab" data-filter="critical">Críticas</button>
        <button class="dis-tab" data-filter="high">Graves</button>
      </div>

      <div class="dis-list" id="dis-list">
        <div class="dis-loading">Carregando ocorrências...</div>
      </div>

      <!-- Bottom Nav compartilhado -->
      <nav class="bottom-nav">
        <button class="nav-item" data-route="/home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Explorar</span>
        </button>
        <button class="nav-item" data-route="/route">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 0 1 4-4h4"/><path d="M14 21h4a2 2 0 0 0 0-4h-4"/></svg>
          <span>Rotas</span>
        </button>
        <button class="nav-item active" data-route="/disruptions">
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

  let currentFilter = 'all'

  const load = async () => {
    const list = el.querySelector('#dis-list')
    list.innerHTML = '<div class="dis-loading">Carregando...</div>'
    try {
      let q = supabase
        .schema('metro')
        .from('disruptions')
        .select('id, title, description, severity, line_id, starts_at, ends_at')
        .is('ends_at', null)
        .order('starts_at', { ascending: false })
        .limit(30)

      if (currentFilter !== 'all') {
        q = q.eq('severity', currentFilter)
      }

      const { data, error } = await q
      if (error) throw error
      renderList(list, data ?? [])
    } catch (err) {
      list.innerHTML = `<div class="dis-error">Erro ao carregar. Verifique a conexão.</div>`
    }
  }

  el.querySelector('#dis-refresh')?.addEventListener('click', load)

  el.querySelectorAll('.dis-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      el.querySelectorAll('.dis-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      currentFilter = tab.dataset.filter
      load()
    })
  })

  await load()
}

function renderList(el, items) {
  if (!items.length) {
    el.innerHTML = `
      <div class="dis-empty">
        <span class="dis-empty-icon">✅</span>
        <p>Nenhuma ocorrência ativa.<br>Todas as linhas operando normalmente.</p>
      </div>`
    return
  }

  el.innerHTML = items.map(d => {
    const color = SEV_COLOR[d.severity] ?? '#64748b'
    const bg    = SEV_BG[d.severity]   ?? '#f1f5f9'
    const label = SEV_LABEL[d.severity] ?? d.severity
    const when  = formatRelTime(d.starts_at)
    return `
      <div class="dis-card">
        <div class="dis-card-top">
          <span class="dis-sev" style="background:${bg};color:${color}">${label}</span>
          <span class="dis-when">${when}</span>
        </div>
        <h4 class="dis-title">${d.title}</h4>
        ${d.description ? `<p class="dis-desc">${d.description}</p>` : ''}
        ${d.line_id ? `<span class="dis-line">Linha ${d.line_id}</span>` : ''}
      </div>`
  }).join('')
}

function formatRelTime(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  if (min < 60)   return `há ${min} min`
  const hrs = Math.floor(min / 60)
  if (hrs < 24)   return `há ${hrs}h`
  return `há ${Math.floor(hrs / 24)} dia(s)`
}

export const disruptionsCSS = `
.dis-screen { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.dis-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; border-bottom: 1px solid #f1f5f9;
}
.dis-back { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; padding: 4px 8px; }
.dis-header h2 { flex: 1; margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.dis-refresh { background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #0f2d52; }

.dis-tabs {
  display: flex; gap: 8px; padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9; overflow-x: auto; scrollbar-width: none;
}
.dis-tabs::-webkit-scrollbar { display: none; }
.dis-tab {
  flex-shrink: 0; background: #f1f5f9; border: none;
  border-radius: 20px; padding: 7px 16px; font-size: .85rem;
  color: #64748b; cursor: pointer; transition: all .15s;
}
.dis-tab.active { background: #0f2d52; color: #fff; }

.dis-list { flex: 1; padding: 16px; padding-bottom: 80px; overflow-y: auto; }
.dis-loading { text-align: center; color: #94a3b8; padding: 40px 0; }
.dis-error   { text-align: center; color: #ef4444;  padding: 24px; }
.dis-empty   { text-align: center; padding: 48px 24px; }
.dis-empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
.dis-empty p { color: #64748b; font-size: .9rem; line-height: 1.6; margin: 0; }

.dis-card {
  border: 1.5px solid #e2e8f0; border-radius: 14px;
  padding: 14px 16px; margin-bottom: 12px;
}
.dis-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.dis-sev {
  font-size: .7rem; font-weight: 700; padding: 3px 10px;
  border-radius: 8px; text-transform: uppercase; letter-spacing: .5px;
}
.dis-when { font-size: .75rem; color: #94a3b8; }
.dis-title { margin: 0 0 6px; font-size: .95rem; font-weight: 700; color: #0f172a; }
.dis-desc  { margin: 0 0 8px; font-size: .85rem; color: #64748b; line-height: 1.5; }
.dis-line  {
  display: inline-block; font-size: .75rem; font-weight: 600;
  background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 6px;
}
`
