import * as router            from './modules/router.js'
import { renderSplash,      splashCSS }      from './screens/splash.js'
import { renderOnboarding,  onboardingCSS }  from './screens/onboarding.js'
import { renderHome,        homeCSS }        from './screens/home.js'
import { renderRoute,       routeCSS }       from './screens/route.js'
import { renderChat,        chatCSS }        from './screens/chat.js'
import { renderDisruptions, disruptionsCSS } from './screens/disruptions.js'
import { renderMap,         mapCSS }         from './screens/map.js'
import { brand }                             from './brand.js'

// ── Inject styles ───────────────────────────────────────────────────────────
const style = document.createElement('style')
style.textContent = [
  splashCSS, onboardingCSS, homeCSS, routeCSS, chatCSS, disruptionsCSS, mapCSS,
].join('\n')
document.head.appendChild(style)

document.title = brand.name

// ── Mount point ─────────────────────────────────────────────────────────────
const root = document.getElementById('app')

function mount(renderFn, state) {
  root.innerHTML = ''
  renderFn(root, state)
}

// ── Routes ───────────────────────────────────────────────────────────────────
router.on('/',             ()      => mount(renderSplash))
router.on('/splash',       ()      => mount(renderSplash))
router.on('/onboarding',   ()      => mount(renderOnboarding))
router.on('/home',         ()      => mount(renderHome))
router.on('/route',        (state) => mount(renderRoute, state))
router.on('/chat',         ()      => mount(renderChat))
router.on('/disruptions',  ()      => mount(renderDisruptions))

// Placeholders for future screens
router.on('/favorites', () => {
  root.innerHTML = `<div style="padding:40px;text-align:center;color:#64748b">Favoritos — em breve</div>`
})
router.on('/more', () => {
  root.innerHTML = `<div style="padding:40px;text-align:center;color:#64748b">Mais — em breve</div>`
})
router.on('/map',    ()      => mount(renderMap))
router.on('/nearby', ()     => mount(renderDisruptions))

// ── Start ────────────────────────────────────────────────────────────────────
router.start()

// ── PWA service worker ───────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}
