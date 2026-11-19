// Angel Academy Naija: offline support. Bump CACHE_NAME whenever files change.
const CACHE_NAME = 'angel-academy-naija-v2';
const ASSETS = [
  './',
  './index.html',
  './levels.json',
  './manifest.json',
  './css/style.css',
  './js/config.js',
  './js/minigames.js',
  './js/app.js',
  './js/player-count.js',
  './privacy.html',
  './guides/parent-guide.html',
  './guides/teacher-guide.html',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first for content (so level and config updates arrive), with the cache as an offline fallback.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
