// ServiceWorker was created by fallowing the tutorial made by bitsofcode https://www.youtube.com/channel/UCaJvzHE_y3MhbDLrsa4FfJQ/videos
// and the guide located at https://www.sitepoint.com/getting-started-with-service-workers/


// var cacheName = 'v2';
// var cacheFiles = [
//   './',
//   './index.html',
//   './restaurant.html',
//   './css/responsive.css',
//   './css/styles.css',
//   './js/dbhelper.js',
//   './js/main.js',
//   './data/restaurants.json',
//   './js/promiseDb.js',
//   'http://localhost:1337/restaurants'
// ]

// self.addEventListener('install', function (e) {
//   console.log("[ServiceWorker] Installed")

//   e.waitUntil(
//     caches.open(cacheName).then(function (cache) {
//       console.log('[ServiceWorker] Caching cacheFiles');
//       return cache.addAll(cacheFiles);
//     })
//   )
// })

// self.addEventListener('activate', function (e) {
//   console.log("[ServiceWorker] Activated")

//   e.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(cacheNames.map(function (thisCacheName) {

//         if (thisCacheName !== cacheName) {
//           console.log('[ServiceWorker] Removing Cache files', thisCacheName)
//           return caches.delete(thisCacheName);
//         }
//       }))
//     })
//   )
// })

// self.addEventListener('fetch', function (e) {
//   console.log("[ServiceWorker] Fetching", e.request.url)

//   e.respondWith(
//     caches.match(e.request).then(function (response) {
//       if (response) {
//         console.log("[ServiceWorker] Found in Cache", e.request.url);
//         return response;
//       }

//       let requestClone = e.request.clone();
//       return fetch(requestClone).then(function (response) {
//           if (!respose) {
//             console.log('[ServiceWorker] No response from fetch');
//             return response;
//           }

//           let responseClone = response.clone();

//           caches.open(cacheName).then(function (cache) {
//             cache.put(e.request, responseClone);
//             return response;
//           })
//         })
//         .catch(function (err) {
//           console.log('[ServiceWorker] Error Fetching & Caching', err)
//         })
//     })
//   )
// })



// TEST

const staticCacheName = 'rr-static-v1';
const dynamicCacheName = 'rr-dynamic';

const staticUrls = [
  './',
  './index.html',
  './restaurant.html',
  './css/responsive.css',
  './css/styles.css',
  './js/dbhelper.js',
  './js/main.js',
  './data/restaurants.json',
  './js/promiseDb.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function (cache) {
      return cache.addAll(staticUrls);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('rr-') && !allCaches.includes(cacheName);
        })
        .map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// self.addEventListener('sync', function (event) {
//   console.log(event);
// });

self.addEventListener('fetch', function (event) {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    // Redirect 'http://localhost:8000' to 'http://localhost:8000/index.html' since 
    // they should bascially be the same html
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('index.html'));
      return;
    }
  }

  if (event.request.url.startsWith('http://localhost:1337')) {
    // avoid caching the API calls as those will be handle by IDB
    return;
  }

  // event.respondWith(loadCacheOrNetwork(event.request, requestUrl, requestUrl.origin === location.origin));
});

// self.addEventListener('message', function (event) {
//   if (event.data && event.data.updated) {
//     self.skipWaiting();
//   }
// });