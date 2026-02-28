const CACHE_NAME = 'sw-v1';
const BASE = '/StarWarsFrontEnd/'; 

const ASSETS_TO_CACHE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}favorites.html`,
  `${BASE}view.html`,
  `${BASE}list.html`,
  `${BASE}src/main.js`,
  `${BASE}src/api/api.js`,
  `${BASE}styles/style.css`
];

// Installerar service workern och sparar filer i cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
            console.error(`Kunde inte fånga essensen av: ${url}`, err);
          });
        })
      );
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