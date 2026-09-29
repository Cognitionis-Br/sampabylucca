import { navigate }                        from '../modules/router.js'
import { getFavorites, removeFavorite }    from '../modules/favorites.js'

export function renderFavorites(el) {
  const list = getFavorites()

  el.innerHTML = `
    <div class="fav-screen">
      <div class="fav-header">
        <button class="fav-back" onclick="history.back()">←</button>
        <h2>Favoritos</h2>
        <span class="fav-count">${list.length}</span>
      </div>

      <div class="fav-list" id="fav-list">
        ${list.length ? renderList(list) : renderEmpty()}
      </div>

      <nav class="bottom-nav">
        <button class="nav-item" data-route="/home">
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
        <button class="nav-item active" data-route="/favorites">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
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

  bindActions(el)
}

function renderList(list) {
  return list.map(f => `
    <div class="fav-item" data-id="${f.id}">
      <div class="fav-icon">
        ${f.icon ?? '⭐'}
      </div>
      <div class="fav-info">
        <span class="fav-label">${f.label ?? `${f.origin} → ${f.destination}`}</span>
        <span class="fav-sub">${f.origin} → ${f.destination}</span>
      </div>
      <div class="fav-actions">
        <button class="fav-play" data-origin="${f.origin}" data-dest="${f.destination}" title="Calcular rota">▶</button>
        <button class="fav-del" data-id="${f.id}" title="Remover">✕</button>
      </div>
    </div>
  `).join('')
}

function renderEmpty() {
  return `
    <div class="fav-empty">
      <span class="fav-empty-icon">❤️</span>
      <p>Você ainda não tem favoritos.</p>
      <p class="fav-empty-hint">Ao calcular uma rota, toque em ♡ para salvar aqui.</p>
      <button class="btn-primary fav-cta" onclick="navigate('/route')">Buscar rota</button>
    </div>
  `
}

function bindActions(el) {
  el.querySelectorAll('.fav-play').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate('/route', { origin: btn.dataset.origin, destination: btn.dataset.dest })
    })
  })

  el.querySelectorAll('.fav-del').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(Number(btn.dataset.id))
      renderFavorites(el)
    })
  })
}

export const favoritesCSS = `
.fav-screen { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.fav-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; border-bottom: 1px solid #f1f5f9;
}
.fav-back { background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #0f172a; padding: 4px 8px; }
.fav-header h2 { flex: 1; margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.fav-count {
  background: #f1f5f9; color: #64748b; font-size: .75rem;
  font-weight: 700; padding: 3px 9px; border-radius: 12px;
}

.fav-list { flex: 1; padding: 8px 16px 80px; }

.fav-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid #f8fafc;
}
.fav-icon {
  width: 40px; height: 40px; background: #fef9c3;
  border-radius: 10px; display: flex; align-items: center;
  justify-content: center; font-size: 1.2rem; flex-shrink: 0;
}
.fav-info { flex: 1; display: flex; flex-direction: column; gap: 3px; overflow: hidden; }
.fav-label { font-size: .9rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fav-sub   { font-size: .78rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.fav-actions { display: flex; gap: 8px; flex-shrink: 0; }
.fav-play {
  background: #0f2d52; color: #fff; border: none;
  width: 34px; height: 34px; border-radius: 50%;
  cursor: pointer; font-size: .8rem; display: flex;
  align-items: center; justify-content: center;
}
.fav-del {
  background: #fee2e2; color: #ef4444; border: none;
  width: 34px; height: 34px; border-radius: 50%;
  cursor: pointer; font-size: .75rem; display: flex;
  align-items: center; justify-content: center;
}

.fav-empty {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 60px 32px; gap: 10px;
}
.fav-empty-icon { font-size: 3rem; }
.fav-empty p { color: #64748b; font-size: .9rem; margin: 0; line-height: 1.6; }
.fav-empty-hint { font-size: .82rem !important; color: #94a3b8 !important; }
.fav-cta { margin-top: 12px; }
`
