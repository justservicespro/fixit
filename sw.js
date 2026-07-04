// FixIt Abuja — Service Worker
// Handles: install-to-home-screen eligibility, offline app-shell caching,
// and receiving/display of push notifications (once a push provider is wired in — see README-push-notifications.md).

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

// ---- PUSH: display a notification when a push message arrives ----
// This fires once a push provider (e.g. OneSignal, or your own web-push server)
// sends a message to a subscribed device. See README-push-notifications.md
// for how to actually wire up a sender — a static site cannot send push on its own.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { title: 'FixIt Abuja', body: event.data ? event.data.text() : '' }; }

  const title = data.title || 'FixIt Abuja';
  const options = {
    body: data.body || 'You have a new update from FixIt Abuja.',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ---- NOTIFICATION CLICK: focus/open the relevant page ----
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
