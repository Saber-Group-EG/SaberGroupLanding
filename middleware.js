// Serves readable HTML for portfolio links to crawlers, link-preview bots and
// AI assistants, which don't run the React bundle. Projects are fetched live,
// so new ones are covered without a rebuild. Everyone else falls through to
// the normal SPA.

import { SITE_URL, LOGO_URL, PROJECTS_API } from './seo/site.js';
import {
  renderPage,
  projectFacts,
  projectJsonLd,
  organizationJsonLd,
  renderProjectArticle,
  isPublicProject,
} from './seo/render.js';
import { getEnSlug } from './src/utils/slug.js';

// Link-preview bots, search crawlers and AI assistant fetchers. Anything that
// doesn't identify as a browser (no "Mozilla") is treated the same way —
// that covers scripts and agent tools with generic user agents.
const CRAWLER_UA =
  /bot|crawl|spider|facebookexternalhit|twitter|whatsapp|telegram|slack|discord|linkedinbot|pinterest|skype|viber|applebot|googlebot|bingbot|yandex|baidu|gptbot|chatgpt|oai-searchbot|openai|claude|anthropic|perplexity|google-extended|ccbot|bytespider|amazonbot|cohere|meta-externalagent|duckassist|youbot/i;

const isCrawler = (ua) => !ua || CRAWLER_UA.test(ua) || !/mozilla/i.test(ua);

export const config = {
  matcher: ['/portfolio/:path*'],
};

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

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg)$/i.test(url);
}

function resolveItemCaption(item, parentCaption) {
  return resolveBilingual(item?.caption) || resolveBilingual(item?.label) || parentCaption || '';
}

function getAllPhotoItems(raw) {
  const items = [];
  const material = raw.material || [];
  for (const mat of material) {
    if (mat.type === 'before_after') continue;
    if (mat.type === 'bulk' && Array.isArray(mat.items)) {
      const parentCaption = resolveBilingual(mat.caption);
      for (const item of mat.items) {
        const itemType = item.type || (isVideoUrl(item.url) ? 'video' : 'photo');
        if (itemType !== 'video') {
          items.push({ url: item.url, thumbnail: item.thumbnail || item.url, caption: resolveItemCaption(item, parentCaption) });
        }
      }
    } else if (mat.type === 'photo' && mat.url) {
      items.push({ url: mat.url, thumbnail: mat.thumbnail || mat.url, caption: resolveBilingual(mat.caption) || '' });
    }
  }
  return items;
}

function getAllVideoItems(raw) {
  const items = [];
  const material = raw.material || [];
  for (const mat of material) {
    if (mat.type === 'before_after') continue;
    if (mat.type === 'bulk' && Array.isArray(mat.items)) {
      const parentCaption = resolveBilingual(mat.caption);
      for (const item of mat.items) {
        const itemType = item.type || (isVideoUrl(item.url) ? 'video' : 'photo');
        if (itemType === 'video') {
          items.push({ url: item.url, thumbnail: item.thumbnail || item.url, caption: resolveItemCaption(item, parentCaption) });
        }
      }
    } else if (mat.type === 'video' && mat.url) {
      items.push({ url: mat.url, thumbnail: mat.thumbnail || '', caption: resolveBilingual(mat.caption) || '' });
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
  if (!isCrawler(request.headers.get('user-agent') || '')) return;

  const route = parseMediaRoute(pathname);
  if (!route?.slug) return;
  const { slug, type, index } = route;

  try {
    // The built shell carries the real asset tags, so a human who lands here
    // (e.g. through an unusual in-app browser) still gets the working app.
    const [projectsRes, shellRes] = await Promise.all([
      fetch(`${PROJECTS_API}?PageCount=all`),
      fetch(new URL('/index.html', request.url)),
    ]);
    if (!projectsRes.ok || !shellRes.ok) return;
    const [data, shell] = await Promise.all([projectsRes.json(), shellRes.text()]);

    const raw = (data.projects || []).find((p) => isPublicProject(p) && getEnSlug(p) === slug);
    if (!raw) return;

    const project = projectFacts(raw);
    let title = `${project.title} | Saber Group`;
    let description =
      (project.description || project.descriptionAr || project.title).replace(/\s+/g, ' ').slice(0, 300);
    let image = project.image || LOGO_URL;
    let path = `/portfolio/${slug}`;

    if (type === 'cover') {
      path = `/portfolio/${slug}/cover`;
    } else if (type === 'photo' || type === 'video') {
      const items = type === 'photo' ? getAllPhotoItems(raw) : getAllVideoItems(raw);
      const item = index >= 0 ? items[index] : null;
      if (item) {
        path = `/portfolio/${slug}/${type}/${index}`;
        const thumb = item.thumbnail || item.url || '';
        image = thumb.startsWith('http') ? thumb : `${SITE_URL}${thumb}`;
        const caption = item.caption || project.title;
        title = `${caption} | ${project.title} | Saber Group`;
        description = `${caption} - ${project.title}`;
      }
    }

    const html = renderPage(shell, {
      path,
      title,
      description,
      image,
      type: 'article',
      jsonLd: [projectJsonLd(project), organizationJsonLd()],
      body: `${renderProjectArticle(project)}
<p>A project by Saber Group, a marketing and creative agency in Tanta, Egypt. <a href="/portfolio">More projects</a>.</p>`,
    });

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return;
  }
}
