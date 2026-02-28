import { precacheAndRoute, matchPrecache } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'

/**
 *  Precache build assets
 *  Ignore query parameters when matching.
 */
precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/.*/]
})

/**
 *  Handle navigation requests (multi-page app safe handling)
 *    - Try network first
 *    - If offline, strip query string
 *    - Serve matching precached HTML
 */
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      // network first
      return await fetch(event.request)
    } catch (error) {
      // Offline → strip query string
      const url = new URL(event.request.url)
      url.search = ''

      // Try matching precached pathname
      const cachedResponse = await matchPrecache(url.pathname)

      if (cachedResponse) {
        return cachedResponse
      }

      // If nothing found, fail gracefully
      return new Response('Offline and page not cached.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      })
    }
  }
)

/**
 * Runtime caching for SWAPI responses,  Network first
 */
registerRoute(
  ({ url }) => url.href.includes('swapi.dev/api/'),
  new NetworkFirst({
    cacheName: 'Chas_Swapi-Cache-v1'
  })
)

self.skipWaiting()
self.clients.claim()