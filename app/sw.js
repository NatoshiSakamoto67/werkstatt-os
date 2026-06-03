/* WERKHOF Service Worker · Shell cache-first.
   DSGVO: KEINE API-/KI-/Tile-Antworten cachen – nur die statische App-Shell. */
const CACHE = "werkhof-v1";
const SHELL = [
  "./index.html",
  "./manifest.json",
  "./assets/logo.svg",
  "./fonts/HankenGrotesk.woff2",
  "./fonts/BebasNeue.woff2"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Nie cachen: fremde Hosts (Tiles, KI-Gateway, APIs) → DSGVO/Drittland-sauber
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
