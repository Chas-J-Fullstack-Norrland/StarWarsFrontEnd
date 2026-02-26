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

self.addEventListener('fetch',event  => {
    const request = event.request;

    if(request.url.includes("api") && request.url.startsWith(basePath)){
        event.respondWith(
            caches.match(request).then(cached=>{
                if(cached) return cached;

                return fetch(request).then(response=>{
                    caches.open(cacheName).then(cache=> cache.put(request,response.clone()));
                    return response;
                }).catch(()=>{
                    return new Response("online api not reachable while offline",{
                        headers:{'Content-Type':'application/javascript'}
                    });
                });
            })
        );
        return;
    };
});
