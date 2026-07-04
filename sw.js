// FixIt Abuja — Service Worker
// Handles: install-to-home-screen eligibility and offline app-shell caching.
// Push notification delivery is handled by OneSignal's imported worker below —
// this is OneSignal's documented pattern for sites that already have a custom
// service worker, so the two never fight over the same push/notificationclick events.
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDKWorker.js');

const CACHE_VERSION = 'fixit-abuja-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/book-a-service.html',
  '/technicians.html',
  '/favicon.svg',
  '/site.webmanifest'
];

// ---- INSTALL: pre-cache the app shell ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

// ---- ACTIVATE: clean up old cache versions ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ---- FETCH: network-first for pages, cache-first for everything else, with offline fallback ----
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});

// Push display and notification-click handling is provided by the imported
// OneSignalSDKWorker.js above — no custom 'push' or 'notificationclick'
// listeners are added here, to avoid double-firing / duplicate notifications.
