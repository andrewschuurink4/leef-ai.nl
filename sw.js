self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('leef-ai-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        // Je kunt hier meer bestanden toevoegen om offline te cachen
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});