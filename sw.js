const CACHE_NAME = 'resume-cache-v3';
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
];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const isDynamicProfileData =
    requestUrl.origin === self.location.origin &&
    requestUrl.pathname.endsWith('/profile-data.json');

  if (isDynamicProfileData) {
    // Fresh data wins; the cached copy is only an offline fallback.
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return new Response('Profile data is unavailable offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
