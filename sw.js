const CACHE_NAME = 'resume-cache-v2';
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
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
