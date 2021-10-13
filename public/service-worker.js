const FILES_TO_CACHE = [
    '/',
    "/index.js",
    "/manifest.json",
    'styles.css',
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png" 
  ];
  
  const PRECACHE = 'my-site-cache-v1';
  const DATA_CACHE_NAME = 'data-cache-v1';
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  // The activate handler takes care of cleaning up old caches.
//   self.addEventListener('fetch', (event) => {
//     event.waitUntil(
//       caches
//         .keys()
//         .then((cacheNames) => {
//           return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
//         })
//         .then((cachesToDelete) => {
//           return Promise.all(
//             cachesToDelete.map((cacheToDelete) => {
//               return caches.delete(cacheToDelete);
//             })
//           );
//         })
//         .then(() => self.clients.claim())
//     );
//   });
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.icludes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  