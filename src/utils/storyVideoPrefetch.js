// Must stay in sync with public/sw.js — that file is copied verbatim by Vite
// and cannot import this module.
export const VIDEO_CACHE_NAME = 'sg-video-cache-v1';

const SLOW_EFFECTIVE_TYPES = ['slow-2g', '2g'];
const POLL_INTERVAL_MS = 1000;
const POLL_CAP_MS = 180000;
const CONTROL_TIMEOUT_MS = 8000;
const IDLE_TIMEOUT_MS = 8000;
const HIDDEN_DELAY_MS = 5000;
const FALLBACK_DELAY_MS = 2000;

const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//.test(value);

// The story viewer owns the connection while it is open, so the idle warm-up
// holds off instead of competing with playback.
let warmupPaused = false;
// Once storage is nearly full the warm-up stays off for the whole session.
let storageExhausted = false;

const STORAGE_LIMIT = 0.85;

export function pauseVideoWarmup() {
  warmupPaused = true;
}

export function resumeVideoWarmup() {
  warmupPaused = false;
}

const hasStorageHeadroom = async () => {
  try {
    const estimate = await navigator.storage?.estimate?.();
    if (!estimate) return true;
    const { usage, quota } = estimate;
    if (!Number.isFinite(usage) || !Number.isFinite(quota) || quota <= 0) return true;
    return usage / quota <= STORAGE_LIMIT;
  } catch {
    // telemetry must never gate or break the warm-up on its own
    return true;
  }
};

const connectionAllowed = () => {
  const connection = navigator.connection;
  if (!connection) return true;
  if (connection.saveData === true) return false;
  return !SLOW_EFFECTIVE_TYPES.includes(connection.effectiveType);
};

const hasController = () => Boolean(navigator.serviceWorker?.controller);

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export function requestVideoPrefetch(urls) {
  try {
    if (!hasController() || !connectionAllowed()) return;
    const list = [...new Set((Array.isArray(urls) ? urls : []).filter(isHttpUrl))].slice(0, 2);
    if (list.length === 0) return;
    navigator.serviceWorker.controller.postMessage({ type: 'PREFETCH_VIDEO', urls: list });
  } catch {
    // prefetching is best-effort and must never surface to the viewer
  }
}

export function nextStoryVideoUrls(stories, pIdx, mIdx) {
  const list = Array.isArray(stories) ? stories : [];
  const urls = [];
  const push = (url) => {
    if (urls.length >= 2) return;
    if (typeof url === 'string' && url.trim() !== '') urls.push(url);
  };

  push(list[pIdx]?.materials?.[mIdx + 2]?.videoUrl);
  for (let p = pIdx + 1; p < list.length && urls.length < 2; p += 1) {
    const materials = list[p]?.materials || [];
    for (let m = 0; m < materials.length && urls.length < 2; m += 1) {
      push(materials[m]?.videoUrl);
    }
  }
  return urls;
}

const waitForControl = () =>
  new Promise((resolve) => {
    if (navigator.serviceWorker.controller) {
      resolve(true);
      return;
    }
    let settled = false;
    let timer = 0;
    const finish = (controlled) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      navigator.serviceWorker.removeEventListener('controllerchange', onChange);
      resolve(controlled);
    };
    const onChange = () => finish(true);
    navigator.serviceWorker.addEventListener('controllerchange', onChange);
    navigator.serviceWorker.ready
      .then(() => {
        if (navigator.serviceWorker.controller) finish(true);
      })
      .catch(() => {});
    timer = setTimeout(() => finish(Boolean(navigator.serviceWorker.controller)), CONTROL_TIMEOUT_MS);
  });

export function startIdleVideoWarmup(urls) {
  let cancelled = false;
  const stop = () => {
    cancelled = true;
  };

  let queue = null;
  try {
    if ('serviceWorker' in navigator && connectionAllowed()) {
      const list = [...new Set((Array.isArray(urls) ? urls : []).filter(isHttpUrl))];
      if (list.length > 0) queue = list;
    }
  } catch {
    queue = null;
  }
  if (!queue) return stop;

  const schedule = (callback) => {
    if (cancelled) return;
    if (document.hidden) {
      setTimeout(callback, HIDDEN_DELAY_MS);
      return;
    }
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
      return;
    }
    setTimeout(callback, FALLBACK_DELAY_MS);
  };

  const next = (cache, index) => {
    schedule(() => {
      runItem(cache, index).catch(() => {});
    });
  };

  const waitUntilCached = async (cache, url) => {
    const deadline = Date.now() + POLL_CAP_MS;
    while (!cancelled && Date.now() < deadline) {
      try {
        if (await cache.match(url)) return true;
      } catch {
        return false;
      }
      await delay(POLL_INTERVAL_MS);
    }
    return false;
  };

  const runItem = async (cache, index) => {
    if (cancelled || index >= queue.length) return;
    if (warmupPaused) {
      // The viewer is open: keep our place and come back on a later tick.
      next(cache, index);
      return;
    }
    if (!connectionAllowed()) {
      next(cache, index);
      return;
    }
    if (storageExhausted) {
      cancelled = true;
      return;
    }
    if (!(await hasStorageHeadroom())) {
      storageExhausted = true;
      cancelled = true;
      return;
    }
    // A stop or pause may have landed while we were asking for the estimate.
    if (cancelled) return;
    if (warmupPaused) {
      next(cache, index);
      return;
    }

    const url = queue[index];
    let cached = false;
    try {
      cached = Boolean(await cache.match(url));
    } catch {
      cached = false;
    }

    if (!cached) {
      requestVideoPrefetch([url]);
      const landed = await waitUntilCached(cache, url);
      // Hitting the poll cap means the fill stalled; stop and let the next
      // visit retry rather than blocking the queue behind a dead download.
      if (!landed || cancelled) return;
    }
    next(cache, index + 1);
  };

  const start = async () => {
    const controlled = await waitForControl();
    if (cancelled || !controlled) return;
    let cache;
    try {
      cache = await caches.open(VIDEO_CACHE_NAME);
    } catch {
      return;
    }
    next(cache, 0);
  };

  start().catch(() => {});

  return stop;
}
