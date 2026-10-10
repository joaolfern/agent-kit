/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { V1_API_URL } from '../config/env'

declare let self: ServiceWorkerGlobalScope

type PushMessage = {
  title: string
  body?: string
  tag?: string
  url?: string
}

const API_BASE = `${new URL(V1_API_URL).href}/`
const API_CACHE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60
// Only GETs whose answer may be a few minutes stale; live endpoints (status polls, previews) stay off this list.
const CACHED_API_PATH = /^(items|items\/[^/]+)$/

function apiPath(url: URL) {
  return url.href.startsWith(API_BASE)
    ? url.pathname.slice(new URL(API_BASE).pathname.length)
    : null
}

function isCachedApiRequest(url: URL) {
  const path = apiPath(url)
  return path !== null && CACHED_API_PATH.test(path)
}

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Paths answered by another Worker on this domain go in the denylist, or the SPA shell would hide them.
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [
      /^\/__/,
      // kit:if cloudflare-router
      /^\/r\//,
      // kit:end
    ],
  })
)

registerRoute(
  ({ url, request }) => request.method === 'GET' && isCachedApiRequest(url),
  new NetworkFirst({
    cacheName: '{{name}}-api',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: API_CACHE_MAX_AGE_SECONDS,
      }),
    ],
  })
)

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: '{{name}}-fonts',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
)

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('push', (event) => {
  const message = event.data?.json() as PushMessage | undefined
  if (!message) return

  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      tag: message.tag,
      icon: '/logos/pwa-192x192.png',
      data: { url: message.url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = new URL(event.notification.data?.url ?? '/', self.location.origin)
  const target =
    url.origin === self.location.origin ? url.href : self.location.origin
  event.waitUntil(self.clients.openWindow(target))
})
