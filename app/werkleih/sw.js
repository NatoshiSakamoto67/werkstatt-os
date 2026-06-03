/* WERKLEIH Service Worker — App-Shell offline-fähig (Home-App / PWA).
   DSGVO: API-/Agent-/Tile-Requests werden NICHT gecacht (dynamische bzw.
   Drittland-Daten), nur die statische Shell. */
const CACHE = 'werkleih-v1';
const SHELL = [
  '/', '/index.html', '/manifest.json', '/fonts/fonts.css',
  '/vendor/leaflet/leaflet.css', '/vendor/leaflet/leaflet.js',
  '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL).catch(() => {}))   // einzelne 404 dürfen Install nicht killen
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Dynamische/Backend-Pfade + Karten-Kacheln: immer direkt ans Netz (kein Cache).
  if (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/agent/') ||
      url.pathname.startsWith('/runs/') ||
      url.hostname.endsWith('tile.openstreetmap.org')) {
    return;
  }

  // App-Shell: cache-first -> Netzwerk (und nachcachen) -> SPA-Fallback index.html.
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
