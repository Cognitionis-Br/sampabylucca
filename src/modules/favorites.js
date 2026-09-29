const KEY = 'lucca_favorites'

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch { return [] }
}

export function addFavorite(item) {
  const list = getFavorites()
  const exists = list.some(f => f.origin === item.origin && f.destination === item.destination)
  if (exists) return false
  list.unshift({ ...item, id: Date.now(), savedAt: new Date().toISOString() })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)))
  return true
}

export function removeFavorite(id) {
  const list = getFavorites().filter(f => f.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function isFavorite(origin, destination) {
  return getFavorites().some(f => f.origin === origin && f.destination === destination)
}
