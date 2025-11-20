const CACHE_NAME = 'neon-focus-v10-stable';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
    // No other files needed, everything is in index.html
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
