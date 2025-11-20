const CACHE_NAME = 'rev-tracker-v10_stable'; // NEW CACHE NAME for stability
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
    // Note: All CSS and JS modules are removed as they are embedded in index.html
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        // Pre-cache all essential static assets
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    // Serve files from cache first, then fall back to the network
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
