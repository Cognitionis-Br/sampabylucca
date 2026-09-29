import * as router            from './modules/router.js'
import { renderSplash,      splashCSS }      from './screens/splash.js'
import { renderOnboarding,  onboardingCSS }  from './screens/onboarding.js'
import { renderHome,        homeCSS }        from './screens/home.js'
import { renderRoute,       routeCSS }       from './screens/route.js'
import { renderChat,        chatCSS }        from './screens/chat.js'
import { renderDisruptions, disruptionsCSS } from './screens/disruptions.js'
import { renderMap,         mapCSS }         from './screens/map.js'
import { renderLogin,       loginCSS }       from './screens/login.js'
import { renderRouteDetail, routeDetailCSS } from './screens/route-detail.js'
import { renderFavorites,   favoritesCSS }   from './screens/favorites.js'
import { renderMore,        moreCSS }        from './screens/more.js'
import { renderNearby,      nearbyCSS }      from './screens/nearby.js'
import { brand }                             from './brand.js'

// ── Inject styles ───────────────────────────────────────────────────────────
const style = document.createElement('style')
style.textContent = [
  splashCSS, onboardingCSS, loginCSS, homeCSS, routeCSS, chatCSS,
  disruptionsCSS, mapCSS, routeDetailCSS, favoritesCSS, moreCSS, nearbyCSS,
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

router.on('/favorites', ()      => mount(renderFavorites))
router.on('/more',      ()      => mount(renderMore))
router.on('/map',          ()      => mount(renderMap))
router.on('/nearby',       ()      => mount(renderNearby))
router.on('/login',        ()      => mount(renderLogin))
router.on('/route-detail', (state) => mount(renderRouteDetail, state))

// ── Catch-all ────────────────────────────────────────────────────────────────
router.on('*', () => mount(renderHome))

// ── Expõe navigate globalmente para onclick inline ────────────────────────────
window.navigate = router.navigate.bind(router)

// ── Start ────────────────────────────────────────────────────────────────────
router.start()

// ── PWA service worker ───────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}
