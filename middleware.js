const PROJECTS_API =
  'https://marketing-planner-tau.vercel.app/api/v1/projects/public';
const SITE_URL = 'https://www.sabergroup-eg.com';
const DEFAULT_IMAGE = `${SITE_URL}/S ICON.png`;

const CRAWLER_UA =
  /bot|crawl|spider|facebook|twitter|whatsapp|telegram|slack|discord|linkedin|pinterest|skype|viber|applebot|googlebot|bingbot|yandex|baidu/i;

export const config = {
  matcher: ['/portfolio/:path*'],
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveBilingual(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (val.en || val.ar) return val.en || val.ar;
    if (val.name?.en || val.name?.ar) return val.name.en || val.name.ar;
    return '';
  }
  return '';
}

function slugify(text) {
  if (!text) return '';
  return String(text)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function getEnSlug(raw) {
  if (!raw) return '';
  const enName = raw.name?.en || '';
  if (enName) {
    const s = slugify(enName);
    if (s) return s;
  }
  return String(raw._id || '').replace(/[^a-z0-9-]/gi, '-');
}

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function getAllPhotoItems(raw) {
  const items = [];
  const mediaGroups = raw.mediaGroups || [];
  for (const group of mediaGroups) {
    if (group.type === 'before_after') continue;
    if (group.type !== 'bulk' && group.type !== 'photo') continue;
    for (const item of (group.items || [])) {
      if (!isVideoUrl(item.url) && item.type !== 'video') {
        items.push({ url: item.url, thumbnail: item.thumbnail || item.url, caption: resolveBilingual(item.caption) || resolveBilingual(item.name) || '' });
      }
    }
  }
  return items;
}

function getAllVideoItems(raw) {
  const items = [];
  const mediaGroups = raw.mediaGroups || [];
  for (const group of mediaGroups) {
    if (group.type === 'before_after') continue;
    if (group.type !== 'bulk' && group.type !== 'photo') continue;
    for (const item of (group.items || [])) {
      if (isVideoUrl(item.url) || item.type === 'video') {
        items.push({ url: item.url, thumbnail: item.thumbnail || item.url, caption: resolveBilingual(item.caption) || resolveBilingual(item.name) || '' });
      }
    }
  }
  return items;
}

function parseMediaRoute(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 4 && segments[0] === 'portfolio') {
    const slug = segments[1];
    if (segments[2] === 'cover') {
      return { slug, type: 'cover', index: -1 };
    }
    if (segments[2] === 'photo' && segments[3]) {
      return { slug, type: 'photo', index: parseInt(segments[3], 10) };
    }
    if (segments[2] === 'video' && segments[3]) {
      return { slug, type: 'video', index: parseInt(segments[3], 10) };
    }
  }
  if (segments.length >= 2 && segments[0] === 'portfolio') {
    return { slug: segments[1], type: null, index: -1 };
  }
  return null;
}

export default async function middleware(request) {
  const { pathname } = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';

  if (!CRAWLER_UA.test(ua)) return;

  const route = parseMediaRoute(pathname);
  if (!route) return;

  const { slug, type, index } = route;
  if (!slug) return;

  try {
    const res = await fetch(`${PROJECTS_API}?PageCount=all`);
    const data = await res.json();
    const raw = (data.projects || []).find((p) => getEnSlug(p) === slug);
    if (!raw) return;

    const projectName = resolveBilingual(raw.name);
    const projectDesc = resolveBilingual(raw.description);
    const coverImage = raw.mainCover?.url || DEFAULT_IMAGE;
    const absoluteCover = coverImage.startsWith('http')
      ? coverImage
      : `${SITE_URL}${coverImage}`;
    const pageUrl = `${SITE_URL}/portfolio/${slug}`;

    let ogImage = absoluteCover;
    let ogTitle = `${projectName} | Saber Group`;
    let ogDescription = projectDesc || projectName;
    let mediaUrl = pageUrl;

    if (type === 'cover') {
      mediaUrl = `${SITE_URL}/portfolio/${slug}/cover`;
      ogTitle = `${projectName} | Saber Group`;
    } else if (type === 'photo' || type === 'video') {
      const photoItems = type === 'photo' ? getAllPhotoItems(raw) : [];
      const videoItems = type === 'video' ? getAllVideoItems(raw) : [];

      let mediaItem = null;
      if (type === 'photo' && index >= 0 && index < photoItems.length) {
        mediaItem = photoItems[index];
        mediaUrl = `${SITE_URL}/portfolio/${slug}/photo/${index}`;
      } else if (type === 'video' && index >= 0 && index < videoItems.length) {
        mediaItem = videoItems[index];
        mediaUrl = `${SITE_URL}/portfolio/${slug}/video/${index}`;
      }

      if (mediaItem) {
        const mediaThumb = mediaItem.thumbnail?.startsWith('http')
          ? mediaItem.thumbnail
          : mediaItem.thumbnail
            ? `${SITE_URL}${mediaItem.thumbnail}`
            : mediaItem.url?.startsWith('http')
              ? mediaItem.url
              : `${SITE_URL}${mediaItem.url}`;
        ogImage = mediaThumb;
        const mediaCaption = mediaItem.caption || projectName;
        ogTitle = `${mediaCaption} | ${projectName} | Saber Group`;
        ogDescription = `${mediaCaption} - ${projectName}`;
      }
    }

    const html = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/S ICON.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(ogDescription)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${esc(mediaUrl)}" />
    <meta property="og:title" content="${esc(ogTitle)}" />
    <meta property="og:description" content="${esc(ogDescription)}" />
    <meta property="og:site_name" content="Saber Group" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(ogTitle)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ogTitle)}" />
    <meta name="twitter:description" content="${esc(ogDescription)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <title>${esc(ogTitle)}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return;
  }
}
