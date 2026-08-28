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

export default async function middleware(request) {
  const { pathname } = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';

  if (!CRAWLER_UA.test(ua)) return;

  const segments = pathname.split('/');
  const slug = segments[segments.length - 1] || segments[segments.length - 2];
  if (!slug || slug === 'portfolio') return;

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

    const html = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/S ICON.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(projectDesc || projectName)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${esc(pageUrl)}" />
    <meta property="og:title" content="${esc(projectName)} | Saber Group" />
    <meta property="og:description" content="${esc(projectDesc || projectName)}" />
    <meta property="og:site_name" content="Saber Group" />
    <meta property="og:image" content="${esc(absoluteCover)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(projectName)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(projectName)} | Saber Group" />
    <meta name="twitter:description" content="${esc(projectDesc || projectName)}" />
    <meta name="twitter:image" content="${esc(absoluteCover)}" />
    <title>${esc(projectName)} | Saber Group</title>
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
