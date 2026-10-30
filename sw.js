const CACHE_NAME = 'resume-cache-v7';
const urlsToCache = [
  '/my-resume/',
  '/my-resume/index.html',
  '/my-resume/script.js',
  '/my-resume/styles.css',
  '/my-resume/profile.jpg',
  '/my-resume/og-image.png',
  '/my-resume/favicon-32.png',
  '/my-resume/favicon-16.png',
  '/my-resume/apple-touch-icon.png',
  '/my-resume/site.webmanifest',
  '/my-resume/bauke-molenaar-cv.pdf',
  '/my-resume/bauke-molenaar-cv-en.pdf',
  '/my-resume/gource.mp4',
  '/my-resume/profile-data.json',
  '/my-resume/github-data.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  // App shell and data must be fresh first: stale JS can leave dynamic sections
  // stuck on their initial "Loading…" placeholders after a deployment.
  const networkFirst =
    request.mode === 'navigate' ||
    ['script', 'style'].includes(request.destination) ||
    /\.(?:html|js|css|json)$/.test(requestUrl.pathname);

  if (networkFirst) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response('This resource is unavailable offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
    );
    return;
  }

  // Keep cache-first behavior for larger, mostly static assets such as images
  // and the Gource video.
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
