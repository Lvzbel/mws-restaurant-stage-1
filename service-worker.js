// Rewrite of Service-Worker
const staticCacheName = 'restaurant-Static-V1';
const contentImgsCache = 'restaurant-content-imgs';
const allCaches = [
  staticCacheName,
  contentImgsCache
]
const cacheFiles = [
  './',
  './index.html',
  './restaurant.html',
  './dist/restaurants.js',
  './dist/restaurant.js',
  './dist/styles.css',
  // './css/responsive.css',
  // './css/styles.css',
  // './js/dbhelper.js',
  // './js/main.js',
  './js/promiseDb.js',
  // './js/restaurant_info.js',
  './data/restaurants.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
    .then((cache) => {
      return cache.addAll(cacheFiles)
    })
  )
});

self.addEventListener('activate',(event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('restaurant') && !allCaches.includes(cacheName);
        })
        .map(function (cacheName) {
          return caches.delete(cacheName);
        })
      )
    })
  )
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  // this Fetch request are already being handle by IDB
  if(event.request.url.startsWith('http://localhost:1337')) {
    return;
  }

  if (requestUrl.pathname.startsWith('/img/')) {
    event.respondWith(servePhoto(event.request))
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request);
    })
  )
});

function servePhoto(request) {
  const storageUrl = request.url

  return caches.open(contentImgsCache).then((cache) => {
    return cache.match(storageUrl).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse
      })
    })
  })
}