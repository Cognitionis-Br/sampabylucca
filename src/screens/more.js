import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'
import { brand }    from '../brand.js'

export async function renderMore(el) {
  const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }))
  const user = session?.user

  el.innerHTML = `
    <div class="more-screen">
      <div class="more-header">
        <h2>Mais</h2>
      </div>

      <!-- Perfil -->
      <div class="more-profile">
        <div class="more-avatar">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L29 16L16 29L3 16L16 3Z" fill="#F5A623"/>
            <circle cx="16" cy="16" r="5" fill="#fff"/>
          </svg>
        </div>
        <div class="more-profile-info">
          <span class="more-name">${user ? (user.email ?? 'Usuário') : 'Visitante'}</span>
          <span class="more-role">${user ? 'Conta conectada' : 'Sem conta — navegando como visitante'}</span>
        </div>
        ${user
          ? `<button class="more-logout" id="more-logout">Sair</button>`
          : `<button class="btn-primary more-login-btn" id="more-login">Entrar</button>`}
      </div>

      <!-- Seções -->
      <div class="more-sections">

        <div class="more-section">
          <h3>Navegação</h3>
          <button class="more-item" data-route="/map">
            <span class="more-item-icon">🗺️</span>
            <span>Mapa do metrô</span>
            <span class="more-arrow">›</span>
          </button>
          <button class="more-item" data-route="/disruptions">
            <span class="more-item-icon">⚠️</span>
            <span>Ocorrências ao vivo</span>
            <span class="more-arrow">›</span>
          </button>
          <button class="more-item" data-route="/favorites">
            <span class="more-item-icon">❤️</span>
            <span>Favoritos</span>
            <span class="more-arrow">›</span>
          </button>
        </div>

        <div class="more-section">
          <h3>Informações</h3>
          <div class="more-item static">
            <span class="more-item-icon">💰</span>
            <span>Tarifa atual</span>
            <span class="more-value">R$ 5,00</span>
          </div>
          <div class="more-item static">
            <span class="more-item-icon">🕐</span>
            <span>Horário metrô</span>
            <span class="more-value">4h40–0h</span>
          </div>
          <div class="more-item static">
            <span class="more-item-icon">📡</span>
            <span>Estações no sistema</span>
            <span class="more-value" id="station-count">—</span>
          </div>
        </div>

        <div class="more-section">
          <h3>Sobre</h3>
          <div class="more-item static">
            <span class="more-item-icon">📱</span>
            <span>${brand.name}</span>
            <span class="more-value">v0.3.0</span>
          </div>
          <div class="more-item static">
            <span class="more-item-icon">🤖</span>
            <span>Assistente</span>
            <span class="more-value">${brand.avatarName}</span>
          </div>
        </div>

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
        <button class="nav-item" data-route="/favorites">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>Favoritos</span>
        </button>
        <button class="nav-item active" data-route="/more">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          <span>Mais</span>
        </button>
      </nav>
    </div>
  `

  el.querySelectorAll('.nav-item, .more-item[data-route]').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.route))
  )

  el.querySelector('#more-logout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    navigate('/login')
  })

  el.querySelector('#more-login')?.addEventListener('click', () => navigate('/login'))

  // Conta estações
  supabase.from('metro_stations').select('id', { count: 'exact', head: true })
    .then(({ count }) => {
      const el2 = el.querySelector('#station-count')
      if (el2 && count != null) el2.textContent = count
    })
    .catch(() => {})
}

export const moreCSS = `
.more-screen { min-height: 100vh; background: #f8fafc; display: flex; flex-direction: column; }

.more-header {
  padding: 20px 16px 12px; background: #fff;
  border-bottom: 1px solid #f1f5f9;
}
.more-header h2 { margin: 0; font-size: 1.2rem; font-weight: 800; color: #0f172a; }

.more-profile {
  display: flex; align-items: center; gap: 14px;
  padding: 20px 16px; background: #fff;
  border-bottom: 1px solid #f1f5f9; margin-bottom: 12px;
}
.more-avatar {
  width: 52px; height: 52px; background: #0f2d52; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.more-profile-info { flex: 1; display: flex; flex-direction: column; gap: 3px; overflow: hidden; }
.more-name { font-size: .95rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.more-role { font-size: .78rem; color: #64748b; }
.more-logout {
  background: #fee2e2; color: #ef4444; border: none;
  padding: 8px 14px; border-radius: 10px; font-size: .85rem;
  font-weight: 600; cursor: pointer; flex-shrink: 0;
}
.more-login-btn { width: auto !important; padding: 10px 16px; flex-shrink: 0; }

.more-sections { flex: 1; padding: 0 0 80px; }

.more-section { background: #fff; margin-bottom: 12px; }
.more-section h3 {
  font-size: .7rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 1px;
  padding: 12px 16px 4px; margin: 0;
}

.more-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; width: 100%; text-align: left;
  background: none; border: none; border-bottom: 1px solid #f8fafc;
  cursor: pointer; font-size: .9rem; color: #0f172a;
  transition: background .1s;
}
.more-item:hover:not(.static) { background: #f8fafc; }
.more-item.static { cursor: default; }
.more-item:last-child { border-bottom: none; }
.more-item-icon { font-size: 1.1rem; width: 24px; text-align: center; flex-shrink: 0; }
.more-item span:nth-child(2) { flex: 1; }
.more-arrow { color: #cbd5e1; font-size: 1.2rem; }
.more-value { color: #64748b; font-size: .85rem; font-weight: 600; }
`
