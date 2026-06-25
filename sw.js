const CACHE_NAME = 'metis-pro-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
  // Aggiungi qui i nomi delle icone se vuoi che siano salvate offline
];

// Installazione del Service Worker e creazione della Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aperta');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Attivazione e pulizia delle vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercettazione delle richieste di rete (Fetch)
self.addEventListener('fetch', event => {
  // Ignora le richieste verso il MASTER_URL per garantire i dati in tempo reale
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Ritorna la risorsa dalla cache se presente, altrimenti fa la richiesta di rete
      return response || fetch(event.request);
    })
  );
});