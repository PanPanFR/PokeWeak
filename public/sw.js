const CACHE = 'pokeweak-v1';
const ASSETS = [
  '/',
  '/speed/',
  '/cheatsheet/',
  '/team/'
];

const API_CACHE = 'pokeapi-sprites';
const MAX_SPRITES = 300;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  if (url.includes('raw.githubusercontent.com') && url.includes('PokeAPI')) {
    e.respondWith(cacheFirstSprite(e.request));
    return;
  }

  if (e.request.mode === 'navigate') {
    e.respondWith(networkFirst(e.request));
    return;
  }

  e.respondWith(cacheFirst(e.request));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached || fetchAndCache(req, CACHE);
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(CACHE);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await caches.match(req);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function cacheFirstSprite(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  if (res.ok) {
    const cache = await caches.open(API_CACHE);
    const keys = await cache.keys();
    if (keys.length >= MAX_SPRITES) {
      await cache.delete(keys[0]);
    }
    cache.put(req, res.clone());
  }
  return res;
}
