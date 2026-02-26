import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

const cacheName = 'Chas_Swapi-Cache-v1';

self.addEventListener('fetch',event  => {
    const request = event.request;

    if(request.url.endsWith("api/api.js")){
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
    if(request.url.includes('swapi.dev/api/')){  
        event.respondWith(
            fetch(request).then(response=>{
                if(request.method === 'GET' && response.status === 200){
                    const responseClone = response.clone();
                    caches.open(cacheName).then(cache => cache.put(request,responseClone));
                }
                return  response;
            }).catch(()=>caches.match(request))
        );
    return
    }

    event.respondWitch(
        caches.match(request).then(cached=>cached||fetch(request))
    );
});
