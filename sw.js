const CACHE_NAME = 'resume-cache-v1';
const urlsToCache = [
  '/my-resume/',
  '/my-resume/index.html',
  '/my-resume/profile.jpg',
  '/my-resume/og-image.png',
  '/my-resume/favicon-32.png',
  '/my-resume/favicon-16.png',
  '/my-resume/apple-touch-icon.png',
  '/my-resume/site.webmanifest',
  '/my-resume/bauke-molenaar-cv.pdf',
  '/my-resume/bauke-molenaar-cv-en.pdf',
  '/my-resume/gource.mp4',
  '/my-resume/github-data.json',
  '/my-resume/profile-data.json',
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