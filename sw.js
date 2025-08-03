const CACHE_NAME = 'wellness-tracker-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation Completed');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => {
                console.log('Service Worker: Fetch Failed');
                // Provide a fallback page so that the fetch handler
                // always resolves with a valid Response. Without
                // returning a value here, respondWith would receive
                // `undefined`, leading to a failed request when the
                // network is unavailable and the resource isn't in
                // cache.
                return caches.match('./index.html');
            })
    );
});
