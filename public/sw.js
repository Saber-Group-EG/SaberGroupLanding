const CACHE_NAME = 'sg-image-cache-v1';
const MAX_ENTRIES = 300;
const EVICT_COUNT = 30;
const IMAGE_HOSTS = ['images.weserv.nl', 'images.unsplash.com'];

const VIDEO_CACHE_NAME = 'sg-video-cache-v1';
const VIDEO_MAX_ENTRIES = 100;
const VIDEO_MAX_BYTES = 4 * 1024 * 1024 * 1024;
const VIDEO_ACCEPT = 'video/mp4,video/webm,video/*;q=0.9,*/*;q=0.5';
// A cache.match can queue behind an in-flight 50 MB put, so the player only
// waits this long for it before going to the network anyway.
const CACHE_MATCH_TIMEOUT_MS = 1500;

// url -> in-progress fill, so a player request and a background prefetch for
// the same file never download it twice.
const inflight = new Map();

// Set when a video cache write fails (quota, or anything else): background
// fills stop for the session while handleVideo keeps streaming to the player.
let quotaExceeded = false;

const MATCH_TIMEOUT = Symbol('cache-match-timeout');

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== VIDEO_CACHE_NAME)
            .map((key) => caches.delete(key)),
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

function isVideoRequest(request) {
  if (request.destination === 'video') return true;
  try {
    return /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i.test(new URL(request.url).pathname);
  } catch {
    return false;
  }
}

function isFullRange(header) {
  if (!header) return true;
  return header.replace(/\s/g, '') === 'bytes=0-';
}

function cancelQuietly(response) {
  try {
    const body = response?.body;
    if (!body) return;
    // An abandoned body stalls HTTP/2 flow control for the whole origin, so
    // every response we neither return nor read must be cancelled here.
    body.cancel().catch(() => {});
  } catch {
    // a locked or already-consumed body has nothing left to cancel
  }
}

function track(url, promise) {
  const tracked = Promise.resolve(promise)
    .catch(() => {})
    .finally(() => {
      // A newer fill may have taken over this key while we were settling;
      // only the owner may clear it, or de-duplication silently breaks.
      if (inflight.get(url) === tracked) inflight.delete(url);
    });
  inflight.set(url, tracked);
  return tracked;
}

// Reserve `url` before the caller awaits anything, so concurrent callers join
// this download instead of starting a second one. Callers that find the key
// already taken get `owned: false` and a no-op release so they can never
// clear someone else's entry.
function reserveInflight(url) {
  if (inflight.has(url)) return { owned: false, release: () => {} };
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const entry = gate.then(() => {
    // Same ownership rule as track(): only the current key clears itself.
    if (inflight.get(url) === entry) inflight.delete(url);
  });
  inflight.set(url, entry);
  return { owned: true, release };
}

async function fillVideo(url, cache) {
  if (quotaExceeded) return undefined;
  let release = () => {};
  try {
    const pending = inflight.get(url);
    if (pending) return pending;

    // Reserve before the first await: two concurrent fills for this URL must
    // not both download it.
    release = reserveInflight(url).release;

    const existing = await cache.match(url);
    if (existing) {
      release();
      return undefined;
    }

    const fill = (async () => {
      const response = await fetch(url, { headers: { Accept: VIDEO_ACCEPT } });
      if (!response.ok || response.status !== 200) {
        // 304 and friends are not storable, and an unread body would stall
        // flow control for the whole origin.
        cancelQuietly(response);
        return;
      }
      try {
        await cache.put(url, response);
      } catch (err) {
        // Only a full disk should stop background fills for the session —
        // a transient write failure must not disable the warm-up entirely.
        if (err && err.name === 'QuotaExceededError') quotaExceeded = true;
        cancelQuietly(response);
        return;
      }
      await trimVideoCache(cache);
    })();

    // Joiners must not wake until the body has actually been written.
    return track(url, fill).finally(release);
  } catch {
    release();
    // a failed background fill only costs a retry on the next visit
    return undefined;
  }
}

function parseRange(header, size) {
  if (!Number.isFinite(size) || size <= 0) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!match) return null;
  const rawStart = match[1];
  const rawEnd = match[2];
  if (rawStart === '' && rawEnd === '') return null;

  let start;
  let end;
  if (rawStart === '') {
    start = Math.max(size - Number(rawEnd), 0);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd === '' ? size - 1 : Number(rawEnd);
  }

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start > end || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

async function sliceBody(body, start, end) {
  const reader = body.getReader();
  const chunks = [];
  let received = 0;
  try {
    while (received <= end) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      const chunkStart = received;
      received += value.byteLength;
      if (received - 1 < start) continue;
      const from = Math.max(start - chunkStart, 0);
      const to = Math.min(value.byteLength - 1, end - chunkStart);
      chunks.push(value.slice(from, to + 1));
    }
  } finally {
    reader.cancel().catch(() => {});
  }
  return new Blob(chunks);
}

// Returns a response, or null when this cache entry cannot honour the Range
// safely (unknown size, no body, truncated slice). The caller then falls
// through to the network: a wrong or short 206 leaves the player stuck on
// its poster far longer than re-fetching would.
async function serveFromCache(cached, rangeHeader) {
  if (!rangeHeader) return cached;

  const size = Number(cached.headers.get('Content-Length'));
  if (!Number.isFinite(size) || size <= 0) return null;
  if (!cached.body) return null;

  const range = parseRange(rangeHeader, size);
  if (!range) return null;
  if (range.start === 0 && range.end >= size - 1) return cached;

  const chunk = await sliceBody(cached.body, range.start, range.end);
  const expected = range.end - range.start + 1;
  if (chunk.size !== expected) return null;

  const headers = new Headers();
  headers.set('Content-Type', cached.headers.get('Content-Type') || 'video/mp4');
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
  headers.set('Content-Length', String(expected));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(chunk, { status: 206, statusText: 'Partial Content', headers });
}

async function trimVideoCache(cache) {
  const keys = await cache.keys();
  const entries = [];
  let total = 0;
  for (const key of keys) {
    const response = await cache.match(key);
    const length = Number(response?.headers.get('Content-Length'));
    const size = Number.isFinite(length) && length > 0 ? length : 0;
    entries.push({ key, size });
    total += size;
  }
  while (
    (entries.length > VIDEO_MAX_ENTRIES || total > VIDEO_MAX_BYTES) &&
    entries.length > 1
  ) {
    const oldest = entries.shift();
    total -= oldest.size;
    await cache.delete(oldest.key);
  }
}

// The player must never wait on a cache read that could take as long as an
// in-flight put: on timeout we go straight to the network instead.
async function matchWithTimeout(cache, url, timeoutMs) {
  let timer = 0;
  const match = cache.match(url).catch(() => undefined);
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(MATCH_TIMEOUT), timeoutMs);
  });
  const winner = await Promise.race([match, timeout]);
  clearTimeout(timer);
  if (winner !== MATCH_TIMEOUT) return winner;
  // A cached copy resolving late still has a body nobody would read.
  match.then(cancelQuietly);
  return undefined;
}

async function handleVideo(request, event) {
  let response = null;
  try {
    const cache = await caches.open(VIDEO_CACHE_NAME);
    const url = request.url;
    const rangeHeader = request.headers.get('Range');

    const cached = await matchWithTimeout(cache, url, CACHE_MATCH_TIMEOUT_MS);
    if (cached) {
      const served = await serveFromCache(cached, rangeHeader);
      if (served) return served;
      // Fall through: this entry can't serve the Range correctly.
    }

    if (!isFullRange(rangeHeader)) return await fetch(request);

    // Reserve before awaiting the network so a concurrent request for this
    // URL joins instead of downloading the whole file a second time. On a
    // miss we never wait on someone else's fill: buffering playback behind a
    // 50 MB download stalls the player.
    const { owned, release } = reserveInflight(url);

    try {
      response = await fetch(url, { headers: { Accept: VIDEO_ACCEPT } });
    } catch (err) {
      release();
      throw err;
    }

    if (!(response.ok && response.status === 200)) {
      // A validator response (304) or an error body is no use to a media
      // element; drop ours and let the original request reach the origin.
      cancelQuietly(response);
      release();
      return await fetch(request);
    }

    if (owned) {
      // Nothing below may throw into the outer catch: a response we obtained
      // but then neither return nor cancel stalls every later request on
      // this origin, so each path below either returns `response` or releases.
      try {
        const copy = response.clone();
        const put = cache.put(url, copy).then(
          () => trimVideoCache(cache),
          (err) => {
            // Only a full disk stops background fills; a transient write
            // failure must not disable them for the whole session.
            if (err && err.name === 'QuotaExceededError') quotaExceeded = true;
            cancelQuietly(copy);
          },
        );
        // Joiners wait for the bytes to land, not just for the headers.
        event.waitUntil(track(url, put).finally(release));
        return response;
      } catch {
        release();
      }
    } else {
      // Someone else already owns the cache write for this URL.
      release();
    }
    return response;
  } catch {
    // Whatever went wrong, a body obtained above must not be left unread.
    cancelQuietly(response);
    try {
      return await fetch(request);
    } catch {
      return Response.error();
    }
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (isVideoRequest(request)) {
    event.respondWith(handleVideo(request, event));
    return;
  }
  if (!isImageRequest(request)) return;
  event.respondWith(handleImage(request));
});

self.addEventListener('message', (event) => {
  const message = event.data;
  if (!message || message.type !== 'PREFETCH_VIDEO') return;
  const urls = Array.isArray(message.urls)
    ? message.urls.filter((url) => typeof url === 'string' && /^https?:\/\//.test(url))
    : [];
  if (urls.length === 0) return;

  event.waitUntil(
    (async () => {
      let cache;
      try {
        cache = await caches.open(VIDEO_CACHE_NAME);
      } catch {
        return;
      }
      // Sequential on purpose: parallel fills would saturate the connection
      // the player is using.
      for (const url of urls) {
        await fillVideo(url, cache);
      }
    })(),
  );
});
