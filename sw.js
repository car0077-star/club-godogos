/* Service worker mínimo: solo cachea el envoltorio para que Android
   reconozca la app como instalable. El contenido real siempre viene
   en vivo desde Apps Script, nunca se cachea. */
var CACHE = 'club-godogos-v1';
var SHELL = ['./', './index.html', './manifest.json',
             './iconos/icono-192.png', './iconos/icono-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  // todo lo de Google va directo a la red, sin caché
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).catch(function () { return caches.match(e.request); })
  );
});

