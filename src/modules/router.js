// SPA router baseado em hash (#/rota)
const routes = {}
let currentRoute = null

export function on(path, handler) {
  routes[path] = handler
}

export function navigate(path, state = {}) {
  history.pushState(state, '', `#${path}`)
  dispatch(path, state)
}

export function replace(path, state = {}) {
  history.replaceState(state, '', `#${path}`)
  dispatch(path, state)
}

function dispatch(path, state) {
  const handler = routes[path] ?? routes['*']
  if (handler) {
    currentRoute = path
    handler(state)
  }
}

export function start() {
  window.addEventListener('popstate', () => {
    const path = location.hash.slice(1) || '/'
    dispatch(path, history.state ?? {})
  })
  const initial = location.hash.slice(1) || '/'
  dispatch(initial, {})
}

export function current() { return currentRoute }
