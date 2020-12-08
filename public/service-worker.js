const APP_PREFIX = 'Budget-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


/*
const CACHE_NAME = 'Budget-cache';
const DATA_CACHE_NAME = 'data-cache'
*/

const FILES_TO_CACHE = [
    'index.html',
    'css/styles.css',
    'js/index.js'
  ];

  // Testing the service-worker.js file
// console.log('looking at the service worker file');

// Install the service worker
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE).then(
        () => console.log('Your files were pre-cached successfully!')
      )
    })
  );

  self.skipWaiting();
});

// Activate
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i])
          }
        })
      )
    })
  )
})

// Making the application work offline
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }
    })
  )
})