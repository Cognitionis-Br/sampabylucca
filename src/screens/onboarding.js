import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'

const STEPS = [
  {
    img: '🌆',
    title: 'Explore São Paulo\nde um jeito mais fácil.',
    body:  'Rotas, horários, lugares e experiências\ntudo em um só app.',
    cta:   'Começar →',
    skip:  'Já tenho uma conta',
  },
  {
    img: '🚇',
    title: 'Tudo que você precisa\npara se movimentar.',
    body:  'Rotas inteligentes com metrô, CPTM e ônibus.\nInformações em tempo real.',
    cta:   'Próximo →',
  },
  {
    img: '📍',
    title: 'Permissões para uma\nmelhor experiência.',
    body:  'Localização, notificações e dados móveis\npara informações precisas.',
    cta:   'Próximo →',
  },
]

let step = 0

export function renderOnboarding(el) {
  step = 0
  renderStep(el)
}

function renderStep(el) {
  const s = STEPS[step]
  const isLast = step === STEPS.length - 1

  el.innerHTML = `
    <div class="ob-screen">
      <div class="ob-header">
        ${step > 0 ? `<button class="ob-back" onclick="history.back()">←</button>` : '<div></div>'}
        ${step > 0 ? `<button class="ob-skip" id="ob-skip">Pular</button>` : ''}
      </div>

      <div class="ob-hero">${s.img}</div>

      <div class="ob-body">
        <h2 class="ob-title">${s.title.replace('\n', '<br>')}</h2>
        <p class="ob-desc">${s.body.replace('\n', '<br>')}</p>

        <div class="ob-dots">
          ${STEPS.map((_, i) => `<span class="ob-dot${i === step ? ' active' : ''}"></span>`).join('')}
        </div>

        <button class="btn-primary ob-cta" id="ob-cta">${s.cta}</button>
        ${step === 0 ? `<button class="btn-secondary ob-alt" id="ob-alt">${s.skip}</button>` : ''}
        ${isLast ? `<button class="btn-secondary ob-alt" id="ob-alt">Continuar sem conta</button>` : ''}
      </div>
    </div>

    ${isLast ? renderAuth() : ''}
  `

  el.querySelector('#ob-cta')?.addEventListener('click', () => {
    if (step < STEPS.length - 1) {
      step++
      renderStep(el)
    } else {
      submitAuth(el)
    }
  })

  el.querySelector('#ob-alt')?.addEventListener('click', () => {
    if (step === 0) {
      step = STEPS.length - 1
      renderStep(el)
    } else {
      goHome()
    }
  })

  el.querySelector('#ob-skip')?.addEventListener('click', goHome)
}

function renderAuth() {
  return `
    <form class="ob-auth" id="ob-auth" autocomplete="on">
      <div class="ob-social">
        <button type="button" class="btn-social" id="ob-google">
          <span>G</span> Continuar com Google
        </button>
      </div>
      <div class="ob-divider"><span>ou</span></div>
      <input type="email"    name="email"    placeholder="E-mail"  class="ob-input" required>
      <input type="password" name="password" placeholder="Senha"   class="ob-input" minlength="6" required>
      <p class="ob-error" id="ob-error" hidden></p>
    </form>
  `
}

async function submitAuth(el) {
  const form = el.querySelector('#ob-auth')
  if (!form) { goHome(); return }

  const email = form.email.value.trim()
  const pass  = form.password.value

  if (!email || !pass) return

  const btn = el.querySelector('#ob-cta')
  btn.disabled = true
  btn.textContent = 'Aguarde...'

  try {
    const { error } = await supabase.auth.signUp({ email, password: pass })
    if (error && error.message.includes('already')) {
      await supabase.auth.signInWithPassword({ email, password: pass })
    } else if (error) throw error
    goHome()
  } catch (err) {
    const errEl = el.querySelector('#ob-error')
    if (errEl) { errEl.textContent = err.message; errEl.hidden = false }
    btn.disabled = false
    btn.textContent = STEPS[step].cta
  }
}

function goHome() {
  localStorage.setItem('lucca_onboarded', '1')
  navigate('/home')
}

export const onboardingCSS = `
.ob-screen {
  min-height: 100vh; display: flex; flex-direction: column;
  background: #fff; padding: 0 24px;
}
.ob-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 0; min-height: 48px;
}
.ob-back, .ob-skip {
  background: none; border: none; font-size: .95rem;
  color: #64748b; cursor: pointer; padding: 8px;
}
.ob-hero {
  font-size: 5rem; text-align: center; padding: 32px 0 24px;
  line-height: 1;
}
.ob-body { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.ob-title {
  font-size: 1.6rem; font-weight: 800; color: #0f172a; line-height: 1.2;
  margin: 0;
}
.ob-desc { font-size: 1rem; color: #64748b; line-height: 1.6; margin: 0; }
.ob-dots { display: flex; gap: 8px; }
.ob-dot {
  width: 8px; height: 8px; border-radius: 4px;
  background: #e2e8f0; transition: all .2s;
}
.ob-dot.active { background: #0f2d52; width: 24px; }
.btn-primary {
  background: #0f2d52; color: #fff; border: none;
  padding: 16px; border-radius: 12px; font-size: 1rem;
  font-weight: 700; cursor: pointer; width: 100%;
  transition: opacity .15s;
}
.btn-primary:hover { opacity: .9; }
.btn-primary:disabled { opacity: .5; }
.btn-secondary {
  background: transparent; color: #0f2d52; border: none;
  padding: 12px; font-size: .95rem; font-weight: 600;
  cursor: pointer; width: 100%;
}
.ob-cta { margin-top: auto; }
.ob-alt { margin-bottom: 24px; }
.ob-auth {
  padding: 0 24px 24px; display: flex; flex-direction: column; gap: 12px;
}
.ob-social { }
.btn-social {
  width: 100%; padding: 14px; border: 1.5px solid #e2e8f0;
  border-radius: 12px; background: #fff; font-size: .95rem;
  font-weight: 600; cursor: pointer; display: flex;
  align-items: center; justify-content: center; gap: 10px;
  color: #0f172a;
}
.btn-social span {
  font-weight: 900; font-size: 1.1rem; color: #4285F4;
}
.ob-divider {
  display: flex; align-items: center; gap: 12px; color: #94a3b8;
  font-size: .85rem;
}
.ob-divider::before, .ob-divider::after {
  content: ''; flex: 1; height: 1px; background: #e2e8f0;
}
.ob-input {
  width: 100%; padding: 14px 16px; border: 1.5px solid #e2e8f0;
  border-radius: 12px; font-size: 1rem; box-sizing: border-box;
  outline: none; transition: border-color .15s;
}
.ob-input:focus { border-color: #0f2d52; }
.ob-error { color: #ef4444; font-size: .875rem; margin: 0; }
`
