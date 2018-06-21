var cacheName = 'v1';
var cacheFiles = [
  './',
  './index.html',
  './restaurant.html',
  './css/responsive.css',
  './css/styles.css',
  './js/dbhelper.js',
  './js/main.js',
  './js/main.js',
  './data/restaurants.json',
  './img/*.jpg'
  
]

self.addEventListener('install', function (e) {
  console.log("[ServiceWorker] Installed")

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log("[ServiceWorker] Activated")

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {

        if (thisCacheName !== cacheName) {
          console.log('[ServiceWorker] Removing Cache files', thisCacheName)
          return caches.delete(thisCacheName);
        }
      }))
    })
  )
})

self.addEventListener('fetch', function (e) {
  console.log("[ServiceWorker] Fetching", e.request.url)

  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log("[ServiceWorker] Found in Cache", e.request.url);
        return response;
      }

      let requestClone = e.request.clone();
      return fetch(requestClone).then(function(response) {
        if (!respose) {
          console.log('[ServiceWorker] No response from fetch');
          return response;
        }

        let responseClone = response.clone();

        caches.open(cacheName).then(function(cache) {
          cache.put(e.request, responseClone);
          return response;
        })
      })
      .catch(function(err){
        console.log('[ServiceWorker] Error Fetching & Caching', err)
      })
    })
  )
})