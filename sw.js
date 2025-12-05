const CACHE_NAME = 'kateikartapp-cache-v4'; // A new version to force update
const urlsToCache = [
  // Core files
  '/',
  'index.html',
  'style.css',
  'manifest.json',
  'Logo.jpg',
  
  // A fallback page
  'offline.html',

  // HTML files
  'deutsch.html',
  'fremdsprache.html',
  'gup.html',
  'hilfe.html',
  'infos.html',
  'Konjungtionen.html',
  'mathe.html',
  'new.html',
  'patchnotes.html',
  'Plattentektonik.html',
  'terme.html',
  'Spanisch/spanisch-zahlen.html',

  // JavaScript files
  'Konjungtionen.js',
  'Plattentektonik.js',
  'terme.js',
  'Spanisch/spanisch-zahlen.js'
];

// Install event - caches all the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache, caching files...');
        // Filter out any potential non-existent files if needed, though list should be accurate
        return cache.addAll(urlsToCache.filter(url => !url.includes('offline.js')));
      })
  );
});

// Activate event - cleans up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('kateikartapp-cache-') &&
                 cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch event - serves from cache, falls back to network, then to offline.html
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache, try fetching from network
        return fetch(event.request).catch(() => {
          // Fetch failed, probably offline. 
          // Check if it's a navigation request and return the offline page.
          if (event.request.mode === 'navigate') {
            return caches.match('offline.html');
          }
        });
      })
  );
});
