const FILES_TO_CACHE = [
    '/',
    "/index.js",
    "/index.html",
    "/manifest.webmanifest",
    'styles.css',
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/db.js"
  ];
  
  const PRECACHE = 'my-site-cache-v1';
  const DATA_CACHE_NAME = 'data-cache-v1';
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then(cache => {
            var cacheAll = cache.addAll(FILES_TO_CACHE);
            return cacheAll;
        })
    );
    self.skipWaiting();
    });
  
self.addEventListener("fetch", function (event) {
    const { url } = event.request;
    if (url.includes("/all") || url.includes("/find")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        return cache.match(event.request);
                    });
            }).catch(err)
        );
    } else {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    return response || fetch(event.request);
                });
            })
        );
    }
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});