const CACHE_NAME = 'rev-tracker-v9'; // Increment the version name to force browsers to re-cache
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    
    // --- NEW PATHS ---
    '/assets/css/main.css',
    '/src/app.js',
    '/src/data.js',
    '/src/logic.js',
    '/src/render.js',
    '/src/timer.js'
    // -----------------
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
