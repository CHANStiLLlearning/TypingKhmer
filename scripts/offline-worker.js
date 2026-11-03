const CACHE_PREFIX = 'khmer-typing-offline-';
const CACHE_NAME = `${CACHE_PREFIX}__CACHE_VERSION__`;
const FILES = __PRECACHE_FILES__;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Navigation uses the HTML from the same build as the cached scripts.
    if (event.request.mode === 'navigate') {
      const shell = await cache.match(new URL('./index.html', self.registration.scope).href);
      if (shell) return shell;
    }
    // Vite's static server varies responses by Origin. The precache request and
    // module/font requests differ there, but these same-origin build files do not.
    const cached = await cache.match(event.request, { ignoreVary: true });
    return cached || fetch(event.request);
  })());
});
