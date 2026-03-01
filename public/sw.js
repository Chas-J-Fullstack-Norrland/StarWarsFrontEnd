const CACHE_NAME = 'sw-v6';
const BASE = '/StarWarsFrontEnd/'; 

const ASSETS_TO_CACHE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}favorites.html`,
  `${BASE}view.html`,
  `${BASE}list.html`,
  `${BASE}assets/main.js`, 
  `${BASE}assets/api.js`,
  `${BASE}assets/style.css`,
  `${BASE}assets/header-footer.css`,
  `${BASE}assets/header-footer.js`,
  `${BASE}background.jpg`,
  `${BASE}favicon-512.png`,
  `${BASE}favicon-192.png`
];

// Installerar service workern och sparar filer i cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
            console.error(`Kunde inte arkivera: ${url}`, err);
          });
        })
      );
    })
  );
});

// Activate: Rensar bort gamla skuggor
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch: Navigerar mellan cache och nätverk
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.pathname.includes('@vite') || url.pathname.includes('hot-update')) {
    event.respondWith(new Response('', { status: 404, statusText: 'Vite ignored offline' }));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate' && event.request.headers.get('accept').includes('text/html')) {
              return caches.match(`${BASE}index.html`);
            }
      });
    })
  );
});