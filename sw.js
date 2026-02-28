const CACHE_NAME = 'sw-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favorites.html',
  '/view.html',
  '/list.html',
  '/src/main.js',
  '/src/api/api.js',
  '/styles/style.css'
];

// Installerar service workern och sparar filer i cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktiverar och rensar gamla cacher
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Hämtar filer: Först cachen, sedan nätverket
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});