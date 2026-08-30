const PROXY_BASE = 'https://images.weserv.nl';

export function getProxiedCoverUrl(originalUrl, options = {}) {
  if (!originalUrl) return originalUrl;

  const { width = 800, quality = 75 } = options;

  return `${PROXY_BASE}/?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}&output=jpg`;
}
