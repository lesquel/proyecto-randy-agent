const APP_VERSION = '1.0.0'
const CACHE_NAME = `chat-ai-cache-${APP_VERSION}`
const CORE_ASSETS = ['/', '/favicon.ico', '/manifest.json', '/offline.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

// Network falling back to cache with SWR for HTML / fetch for others
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return resp
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (c) => c || caches.match('/offline.html') || caches.match('/')
            )
        )
    )
    return
  }

  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResp) => {
            if (networkResp.status === 200) {
              const copy = networkResp.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            }
            return networkResp
          })
          .catch(() => cached)
        return cached || fetchPromise
      })
    )
  }
})
