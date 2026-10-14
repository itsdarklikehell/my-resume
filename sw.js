const CACHE_NAME = 'resume-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/profile.jpg',
  '/og-image.png',
  '/favicon-32.png',
  '/favicon-16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/bauke-molenaar-cv.pdf',
  '/bauke-molenaar-cv-en.pdf',
  '/gource.mp4',
  '/github-data.json',
  '/profile-data.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});