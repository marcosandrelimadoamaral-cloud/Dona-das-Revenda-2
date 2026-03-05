const CACHE_NAME = 'dona-revenda-v1'
const STATIC_ASSETS = [
    '/',
    '/dashboard',
    '/manifest.json',
    '/logo.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
]

// Install: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Silently fail if some assets can't be cached
            })
        })
    )
    self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    )
    self.clients.claim()
})

// Fetch: network-first for API/auth, cache-first for static
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET, chrome-extension, and supabase/stripe API calls
    if (
        request.method !== 'GET' ||
        url.protocol === 'chrome-extension:' ||
        url.hostname.includes('supabase.co') ||
        url.hostname.includes('stripe.com') ||
        url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/_next/data/')
    ) {
        return
    }

    // Cache-first for static assets (_next/static, images, fonts)
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/icons/') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.woff2')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
            })
        )
        return
    }

    // Network-first for pages (fallback to cache if offline)
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok && response.type === 'basic') {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                }
                return response
            })
            .catch(() => caches.match(request))
    )
})
