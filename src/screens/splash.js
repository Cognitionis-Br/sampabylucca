import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'

export async function renderSplash(el) {
  el.innerHTML = `
    <div class="splash">
      <div class="splash-brand">
        <div class="splash-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path d="M28 4L52 28L28 52L4 28L28 4Z" fill="#F5A623"/>
            <path d="M28 14L42 28L28 42L14 28L28 14Z" fill="#fff" opacity="0.3"/>
            <circle cx="28" cy="28" r="6" fill="#fff"/>
          </svg>
        </div>
        <h1 class="splash-name">LUCCA</h1>
        <p class="splash-tagline">Mobilidade inteligente.<br>Cidade mais viva.</p>
      </div>
      <div class="splash-footer">
        <div class="splash-loader">
          <div class="splash-progress"></div>
        </div>
        <p class="splash-status">Carregando...</p>
      </div>
    </div>
  `

  el.style.cssText = ''

  // Verifica sessão + carrega dados essenciais
  try {
    const { data: { session } } = await supabase.auth.getSession()
    await fakeProgress(el)
    if (session) {
      navigate('/home')
    } else {
      const seen = localStorage.getItem('lucca_onboarded')
      navigate(seen ? '/login' : '/onboarding')
    }
  } catch {
    await fakeProgress(el)
    navigate('/home') // offline fallback
  }
}

function fakeProgress(el) {
  return new Promise(resolve => {
    const bar = el.querySelector('.splash-progress')
    let w = 0
    const iv = setInterval(() => {
      w = Math.min(w + Math.random() * 15, 100)
      if (bar) bar.style.width = w + '%'
      if (w >= 100) { clearInterval(iv); setTimeout(resolve, 300) }
    }, 120)
  })
}

export const splashCSS = `
.splash {
  position: fixed; inset: 0;
  background: #0a0d14;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0;
}
.splash-brand {
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px;
}
.splash-icon { animation: splash-bounce .6s ease-out; }
.splash-name {
  font-size: 3rem; font-weight: 900; letter-spacing: 8px;
  color: #fff; margin: 0;
}
.splash-tagline {
  font-size: .95rem; color: rgba(255,255,255,.55);
  text-align: center; line-height: 1.6; margin: 0;
}
.splash-footer {
  padding: 0 40px 60px;
  width: 100%; box-sizing: border-box;
}
.splash-loader {
  height: 3px; background: rgba(255,255,255,.15);
  border-radius: 2px; overflow: hidden; margin-bottom: 12px;
}
.splash-progress {
  height: 100%; width: 0; background: #F5A623;
  border-radius: 2px; transition: width .1s linear;
}
.splash-status {
  font-size: .8rem; color: rgba(255,255,255,.35);
  text-align: center; margin: 0;
}
@keyframes splash-bounce {
  0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
  60%  { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
`
