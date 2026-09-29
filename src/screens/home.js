import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'

const QUICK = [
  { id: 'work',  icon: '🏢', label: 'Trabalho' },
  { id: 'home',  icon: '🏠', label: 'Casa' },
  { id: 'near',  icon: '📍', label: 'Perto de mim' },
]

export async function renderHome(el) {
  el.innerHTML = `
    <div class="home">
      <!-- Header -->
      <div class="home-header">
        <div class="home-top">
          <div class="home-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#F5A623"/>
              <circle cx="12" cy="12" r="3" fill="#fff"/>
            </svg>
            <span>LUCCA</span>
          </div>
          <button class="home-avatar-btn" id="btn-avatar" title="Falar com Lucca">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        <!-- Barra de busca -->
        <button class="home-search" id="btn-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Para onde vamos?</span>
          <svg class="home-mic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f2d52" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        </button>

        <!-- Chips rápidos -->
        <div class="home-chips">
          ${QUICK.map(q => `
            <button class="home-chip" data-id="${q.id}">
              ${q.icon} ${q.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Mapa placeholder (clica para abrir mapa completo) -->
      <div class="home-map" id="home-map" style="cursor:pointer" title="Ver mapa completo">
        <div class="home-map-placeholder">
          <svg width="100%" height="100%" viewBox="0 0 375 300" fill="none">
            <!-- Grid de ruas simulado -->
            <rect width="375" height="300" fill="#f1f5f9"/>
            <g stroke="#e2e8f0" stroke-width="1">
              <line x1="0" y1="60"  x2="375" y2="60"/>
              <line x1="0" y1="120" x2="375" y2="120"/>
              <line x1="0" y1="180" x2="375" y2="180"/>
              <line x1="0" y1="240" x2="375" y2="240"/>
              <line x1="75"  y1="0" x2="75"  y2="300"/>
              <line x1="150" y1="0" x2="150" y2="300"/>
              <line x1="225" y1="0" x2="225" y2="300"/>
              <line x1="300" y1="0" x2="300" y2="300"/>
            </g>
            <!-- L4 Amarela (horizontal) -->
            <line x1="40" y1="150" x2="335" y2="150" stroke="#ffd500" stroke-width="5" stroke-linecap="round"/>
            <!-- L2 Verde (diagonal) -->
            <line x1="80" y1="230" x2="280" y2="100" stroke="#007a3d" stroke-width="5" stroke-linecap="round"/>
            <!-- L1 Azul (vertical) -->
            <line x1="187" y1="20" x2="187" y2="280" stroke="#1566b0" stroke-width="5" stroke-linecap="round"/>
            <!-- Estações -->
            <circle cx="187" cy="150" r="8" fill="#fff" stroke="#1566b0" stroke-width="3"/>
            <circle cx="187" cy="150" r="4" fill="#1566b0"/>
            <!-- Label SÃO PAULO -->
            <text x="187" y="90" text-anchor="middle" font-size="14" font-weight="700" fill="#cbd5e1" letter-spacing="2">SÃO PAULO</text>
            <!-- Pin de localização -->
            <path d="M187 200 C187 200 174 185 174 178 C174 171 180 165 187 165 C194 165 200 171 200 178 C200 185 187 200 187 200Z" fill="#0f2d52"/>
            <circle cx="187" cy="178" r="4" fill="#fff"/>
          </svg>
        </div>
      </div>

      <!-- Rotas rápidas -->
      <div class="home-routes">
        <div class="home-routes-header">
          <h3>Rotas rápidas</h3>
          <button class="home-routes-all">Ver todas &rsaquo;</button>
        </div>
        <div id="home-routes-list">
          <div class="home-route-item skeleton"></div>
          <div class="home-route-item skeleton"></div>
        </div>
      </div>

      <!-- Bottom Nav -->
      <nav class="bottom-nav">
        <button class="nav-item active" data-route="/home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Explorar</span>
        </button>
        <button class="nav-item" data-route="/route">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 17V9a4 4 0 0 1 4-4h4"/><path d="M14 21h4a2 2 0 0 0 0-4h-4"/></svg>
          <span>Rotas</span>
        </button>
        <button class="nav-item" data-route="/nearby">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
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

  // Ações
  el.querySelector('#btn-search')?.addEventListener('click', () => navigate('/route'))
  el.querySelector('#btn-avatar')?.addEventListener('click', () => navigate('/chat'))
  el.querySelector('#home-map')?.addEventListener('click',   () => navigate('/map'))
  el.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.route))
  })

  // Carrega disruptions
  loadDisruptions(el)
}

async function loadDisruptions(el) {
  try {
    const { data } = await supabase
      .from('metro_disruptions')
      .select('title, severity, line_id')
      .is('ends_at', null)
      .limit(3)

    const list = el.querySelector('#home-routes-list')
    if (!list) return

    // Placeholder de rotas rápidas (estáticas por ora)
    list.innerHTML = `
      <div class="home-route-item">
        <div class="home-route-icon" style="background:#fef3c7">🏢</div>
        <div class="home-route-info">
          <span class="route-label">Para o Trabalho</span>
          <span class="route-sub">38 min · Linha 4 + Linha 9</span>
        </div>
        <button class="route-play" onclick="navigate('/route')">▶</button>
      </div>
      <div class="home-route-item">
        <div class="home-route-icon" style="background:#dbeafe">🏠</div>
        <div class="home-route-info">
          <span class="route-label">Para Casa</span>
          <span class="route-sub">42 min · Linha 2 + Ônibus</span>
        </div>
        <button class="route-play" onclick="navigate('/route')">▶</button>
      </div>
      ${data?.length ? `
      <div class="home-alert">
        <span class="alert-dot"></span>
        <span>${data[0].title}</span>
        <button onclick="navigate('/disruptions')">Ver &rsaquo;</button>
      </div>` : ''}
    `
  } catch {
    // silencia erros de rede
  }
}

export const homeCSS = `
.home { display: flex; flex-direction: column; min-height: 100vh; background: #fff; }

.home-header { background: #fff; padding: 16px 16px 0; box-shadow: 0 1px 0 #f1f5f9; z-index: 10; }
.home-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.home-logo { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; font-weight: 900; color: #0f172a; letter-spacing: 1px; }
.home-avatar-btn { background: #f1f5f9; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #0f2d52; }

.home-search {
  display: flex; align-items: center; gap: 10px;
  background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px;
  padding: 13px 16px; width: 100%; box-sizing: border-box;
  cursor: pointer; color: #94a3b8; font-size: .95rem;
}
.home-search span { flex: 1; text-align: left; }
.home-mic { margin-left: auto; }

.home-chips { display: flex; gap: 8px; padding: 12px 0 16px; overflow-x: auto; scrollbar-width: none; }
.home-chips::-webkit-scrollbar { display: none; }
.home-chip {
  flex-shrink: 0; background: #f1f5f9; border: none;
  border-radius: 20px; padding: 8px 14px; font-size: .85rem;
  color: #0f172a; cursor: pointer; white-space: nowrap;
  transition: background .15s;
}
.home-chip:hover { background: #e2e8f0; }

.home-map { flex: 1; min-height: 240px; position: relative; overflow: hidden; }
.home-map-placeholder { width: 100%; height: 100%; }

.home-routes { padding: 16px 16px 80px; }
.home-routes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.home-routes-header h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #0f172a; }
.home-routes-all { background: none; border: none; color: #0f2d52; font-size: .85rem; font-weight: 600; cursor: pointer; }

.home-route-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 0; border-bottom: 1px solid #f1f5f9;
}
.home-route-item.skeleton {
  height: 56px; background: #f1f5f9; border-radius: 10px;
  margin-bottom: 8px; border: none; animation: pulse 1.5s infinite;
}
.home-route-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.home-route-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.route-label { font-size: .9rem; font-weight: 600; color: #0f172a; }
.route-sub { font-size: .8rem; color: #64748b; }
.route-play {
  background: #0f2d52; color: #fff; border: none;
  width: 32px; height: 32px; border-radius: 50%;
  cursor: pointer; font-size: .8rem; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
}

.home-alert {
  display: flex; align-items: center; gap: 8px; padding: 12px;
  background: #fef9c3; border-radius: 10px; margin-top: 8px;
  font-size: .85rem; color: #854d0e;
}
.alert-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #f59e0b; flex-shrink: 0;
}
.home-alert button {
  margin-left: auto; background: none; border: none;
  color: #92400e; font-weight: 700; cursor: pointer; font-size: .85rem;
}

.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #fff; border-top: 1px solid #f1f5f9;
  display: flex; padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  z-index: 100;
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 3px; background: none; border: none; cursor: pointer;
  color: #94a3b8; font-size: .7rem; padding: 4px 0;
  transition: color .15s;
}
.nav-item.active, .nav-item:hover { color: #0f2d52; }
.nav-item svg { flex-shrink: 0; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
`
