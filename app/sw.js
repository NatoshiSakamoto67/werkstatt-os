/* WERKHOF Service Worker · NETWORK-FIRST.
   HTML/Assets sind online immer frisch (kein Stale-App mehr); Cache dient nur als
   Offline-Fallback. DSGVO: fremde Hosts (OSM-Tiles, KI-Gateway, APIs) werden nie
   angefasst/gecacht — nur Same-Origin-GETs. */
const CACHE = "werkhof-v3";
const SHELL = [
  "./",
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
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;   // fremde Hosts: durchreichen, nie cachen
  if (e.request.method !== "GET") return;
  // network-first: online -> frische Version (+ Cache aktualisieren); offline -> Cache-Fallback
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
  );
});
