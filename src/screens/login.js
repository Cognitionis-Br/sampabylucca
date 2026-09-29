import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'

export function renderLogin(el) {
  el.innerHTML = `
    <div class="login-screen">
      <div class="login-brand">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 4L44 24L24 44L4 24L24 4Z" fill="#F5A623"/>
          <path d="M24 12L36 24L24 36L12 24L24 12Z" fill="#fff" opacity="0.25"/>
          <circle cx="24" cy="24" r="5" fill="#fff"/>
        </svg>
        <h1>LUCCA</h1>
        <p>Mobilidade inteligente em São Paulo</p>
      </div>

      <form class="login-form" id="login-form" autocomplete="on">
        <input type="email"    name="email"    placeholder="E-mail"
               class="ob-input" required autocomplete="email">
        <input type="password" name="password" placeholder="Senha"
               class="ob-input" minlength="6" required autocomplete="current-password">
        <p class="ob-error" id="login-error" hidden></p>
        <button type="submit" class="btn-primary" id="login-btn">Entrar</button>
        <button type="button" class="btn-secondary" id="login-signup">Criar conta</button>
      </form>
    </div>
  `

  const form    = el.querySelector('#login-form')
  const errEl   = el.querySelector('#login-error')
  const loginBtn = el.querySelector('#login-btn')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = form.email.value.trim()
    const pass  = form.password.value
    loginBtn.disabled = true
    loginBtn.textContent = 'Aguarde...'
    errEl.hidden = true

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) {
      errEl.textContent = error.message
      errEl.hidden = false
      loginBtn.disabled = false
      loginBtn.textContent = 'Entrar'
    } else {
      navigate('/home')
    }
  })

  el.querySelector('#login-signup')?.addEventListener('click', () => navigate('/onboarding'))
}

export const loginCSS = `
.login-screen {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: #fff; padding: 24px;
}
.login-brand {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; margin-bottom: 40px;
}
.login-brand h1 {
  font-size: 2rem; font-weight: 900; color: #0f172a;
  letter-spacing: 6px; margin: 0;
}
.login-brand p { color: #64748b; font-size: .9rem; margin: 0; }
.login-form {
  width: 100%; max-width: 360px;
  display: flex; flex-direction: column; gap: 12px;
}
`
