const cacheName = 'Chas_Swapi-Cache-v1';
const basePath = self.registration.scope;
const cachedAssets = [
    basePath,
    basePath + 'index.html',
    basePath + 'favorites.html',
    basePath + 'list.html',
    basePath + 'view.html',
    basePath + 'favorites.js',
    basePath + 'favoritesStorage.js',
    basePath + 'list.js',
    basePath + 'view.js',
    basePath + 'main/icon-192.png',
    basePath + 'icons/icon-192.png',
    basePath + 'icons/icon-512.png',
    basePath + 'icons/icon.svg',
    basePath + 'styles/main.css',
    basePath + 'styles/icon-192.png',
]

self.addEventListener('install',event=>{
    event.waitUntil(
        caches.open(cacheName).then(cache=>cache.addAll(cachedAssets))
        .then(()=> self.skipwaiting())
    )
});

self.addEventListener('activate',event=>{
    event.waitUntil(
        caches.keys().then(keys=> Promise.all(keys.filter(
            key => key !== cacheName).map(key=>caches.delete(key))
        ).then(()=>self.clients.claim())
        )
    );
});
