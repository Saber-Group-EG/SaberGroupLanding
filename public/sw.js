const CACHE_NAME = 'sg-image-cache-v1';
const MAX_ENTRIES = 300;
const EVICT_COUNT = 30;
const IMAGE_HOSTS = ['images.weserv.nl', 'images.unsplash.com'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isImageRequest(request) {
  if (request.destination === 'image') return true;
  try {
    return IMAGE_HOSTS.includes(new URL(request.url).hostname);
  } catch {
    return false;
  }
}

function isCacheable(response) {
  if (!response) return false;
  if (response.status === 206) return false;
  if (response.headers.get('Content-Range')) return false;
  return response.status === 200 || response.type === 'opaque';
}

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_ENTRIES) {
    await Promise.all(
      keys.slice(0, EVICT_COUNT).map((key) => cache.delete(key)),
    );
  }
}

async function handleImage(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  let response;
  try {
    response = await fetch(request);
  } catch {
    return Response.error();
  }

  if (isCacheable(response)) {
    try {
      await cache.put(request, response.clone());
      await trimCache(cache);
    } catch {
      // partial/unsupported responses must never break rendering
    }
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (!isImageRequest(request)) return;
  event.respondWith(handleImage(request));
});
