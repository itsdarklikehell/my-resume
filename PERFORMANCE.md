# Performance Optimization Research — my-resume

## Baseline (file inspection)

| Asset | Size | Dimensions |
|---|---|---|
| gource.mp4 | 940 KB | 1920×1080, H.264, 30fps, 8.5s, no audio |
| profile.jpg | 22.9 KB | 460×460 |
| og-image.png | 83.4 KB | 1200×630 |
| android-chrome-192.png | 48.2 KB | 192×192 |
| android-chrome-512.png | 234.7 KB | 512×512 |
| apple-touch-icon.png | 43.3 KB | 180×180 |
| script.js | 127.8 KB | — |

Total media ≈ 1.5 MB; gource.mp4 is 62% of it.

## 1. Compress gource.mp4

Command (H.264, 720p, CRF 28, faststart):

```bash
ffmpeg -i gource.mp4 -c:v libx264 -crf 28 -preset medium \
  -vf scale=1280:720 -an -movflags +faststart gource.mp4
```

Expected: **940 KB → 300 KB (−68%)**. Verified by test encode.

Alt (WebM/VP9): 940 KB → 563 KB (−40%) — worse here; stick with H.264.

## 2. Optimize images

```bash
# profile photo -> WebP (best savings)
magick profile.jpg -strip -quality 75 profile.webp   # 22.9 KB -> 12.1 KB (-47%)

# PNGs: strip metadata, max compression
magick og-image.png -strip -define png:compression-level=9 og-image.png
magick android-chrome-192.png -strip -define png:compression-level=9 android-chrome-192.png
magick android-chrome-512.png -strip -define png:compression-level=9 android-chrome-512.png
magick apple-touch-icon.png -strip -define png:compression-level=9 apple-touch-icon.png
```

Expected PNG savings: ~1–5% each (already small). Bigger win: convert profile.jpg to WebP and use `<picture>` fallback.

## 3. Lazy loading (index.html)

Current: header avatar uses `loading="eager" fetchpriority="high"`; second avatar uses `loading="lazy"`. gource.mp4 has no lazy attribute.

Add to video element:

```html
<video src="gource.mp4" loading="lazy" preload="none" playsinline muted loop></video>
```

And `loading="lazy"` to any below-fold images. Defer non-critical JS already done (`defer`).

## 4. Service worker cache strategy (sw.js)

Current: cache-first for everything including gource.mp4 and large PDFs → bloats cache.

Recommended: split strategies.

```js
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Network-first for data
  if (url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  // Cache-first for static assets, stale-while-revalidate for media
  if (/\.(mp4|pdf)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }
  event.respondWith(cacheFirst(event.request));
});
```

Also remove gource.mp4 from precache list; cache on first play. Bump CACHE_NAME to v3.

## Expected total savings

- gource.mp4: −640 KB (−68%)
- profile.jpg (WebP): −10.7 KB (−47%)
- PNGs: −~12 KB combined
- Lazy loading + SW: avoids downloading 300 KB video + PDFs until needed; faster first paint.

## Notes

- No tooling deps missing except cwebp/pngquant; ImageMagick + ffmpeg present.
- Verify after changes: Lighthouse performance score, cache size in DevTools.
