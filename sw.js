const CACHE_NAME = 'kateikartapp-cache-v1';
const urlsToCache = [
  '.',
  'index.html',
  'style.css',
  'manifest.json',
  'Logo.jpg',
  'deutsch.html',
  'fremdsprache.html',
  'gup.html',
  'hilfe.html',
  'infos.html',
  'Konjungtionen.html',
  'Konjungtionen.js',
  'mathe.html',
  'new.html',
  'patchnotes.html',
  'Plattentektonik.html',
  'Plattentektonik.js',
  'terme.html',
  'terme.js',
  'Spanisch/spanisch-zahlen.html',
  'Spanisch/spanisch-zahlen.js',
  'offline.html'
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
      }
    )
  );
});

self.addEventListener('message', event => {
  if (event.data.action === 'cache-topic') {
    const topic = event.data.topic;
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log(`Caching topic: ${topic}`);
          return cache.add(`${topic}.html`);
        })
    );
  }
});
