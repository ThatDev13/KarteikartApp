const CACHE_NAME = 'karteikart-app-v1';
const urlsToCache = [
  'index.html',
  'deutsch.html',
  'fremdsprache.html',
  'gup.html',
  'hilfe.html',
  'info.html',
  'infos.html',
  'Konjungtionen.html',
  'news.html',
  'new.html',
  'patchnotes.html',
  'Plattentektonik.html',
  'mathe.html',
  'terme.html',
  'Spanisch/spanisch-zahlen.html',
  'Konjungtionen.js',
  'Plattentektonik.js',
  'terme.js',
  'Spanisch/spanisch-zahlen.js',
  'style.css',
  'manifest.json',
  '192x192.jpg',
  '512x512.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});