import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

async function loadServiceWorker({ cachedResponse = null, networkResponse = null, networkError = null } = {}) {
  const listeners = {};
  const cache = {
    addAll: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
  };
  const caches = {
    keys: vi.fn().mockResolvedValue(['resume-cache-v2', 'other-app-cache', 'resume-cache-v3']),
    delete: vi.fn().mockResolvedValue(true),
    open: vi.fn().mockResolvedValue(cache),
    match: vi.fn().mockResolvedValue(cachedResponse),
  };
  const fetchMock = vi.fn(async () => {
    if (networkError) throw networkError;
    return networkResponse;
  });
  const self = {
    location: { origin: 'https://itsdarklikehell.github.io' },
    addEventListener: (name, callback) => { listeners[name] = callback; },
  };
  const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  runInNewContext(source, {
    self,
    caches,
    fetch: fetchMock,
    URL,
    Response,
    Promise,
  });
  return { listeners, caches, cache, fetchMock };
}

async function dispatchFetch(harness, url = 'https://itsdarklikehell.github.io/my-resume/profile-data.json') {
  let responsePromise;
  harness.listeners.fetch({
    request: { url, method: 'GET' },
    respondWith: promise => { responsePromise = Promise.resolve(promise); },
  });
  return responsePromise;
}

describe('service worker cache behaviour', () => {
  it('removes only obsolete caches owned by this app', async () => {
    const h = await loadServiceWorker();
    let activation;
    h.listeners.activate({ waitUntil: promise => { activation = promise; } });

    await activation;

    expect(h.caches.delete.mock.calls).toEqual([
      ['resume-cache-v2'],
      ['resume-cache-v3'],
    ]);
  });

  it('uses fresh network profile data and refreshes the cache', async () => {
    const stale = new Response('stale data', { status: 200 });
    const fresh = new Response('fresh data', { status: 200 });
    const h = await loadServiceWorker({ cachedResponse: stale, networkResponse: fresh });

    const response = await dispatchFetch(h);
    expect(await response.text()).toBe('fresh data');
    expect(h.fetchMock).toHaveBeenCalledOnce();
    await Promise.resolve();
    expect(h.cache.put).toHaveBeenCalledOnce();
  });

  it('uses cached profile data when the network is unavailable', async () => {
    const cached = new Response('offline cache', { status: 200 });
    const h = await loadServiceWorker({ cachedResponse: cached, networkError: new Error('offline') });

    const response = await dispatchFetch(h);
    expect(await response.text()).toBe('offline cache');
  });

  it('returns 503 when profile data is unavailable online and in cache', async () => {
    const h = await loadServiceWorker({ networkError: new Error('offline') });

    const response = await dispatchFetch(h);
    expect(response.status).toBe(503);
    expect(await response.text()).toContain('unavailable offline');
  });

  it('keeps cache-first behaviour for static media assets', async () => {
    const cached = new Response('cached image', { status: 200 });
    const h = await loadServiceWorker({ cachedResponse: cached });
    const response = await dispatchFetch(h, 'https://itsdarklikehell.github.io/my-resume/profile.jpg');

    expect(await response.text()).toBe('cached image');
    expect(h.fetchMock).not.toHaveBeenCalled();
  });
});
