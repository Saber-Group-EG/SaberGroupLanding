// Turns page facts into plain HTML that crawlers and AI assistants can read
// without running JavaScript. Shared by scripts/prerender.mjs (Node) and
// middleware.js (Vercel edge), so it must stay dependency-free.
//
// The generated markup goes inside #root. React's createRoot() replaces it as
// soon as the app boots, so visitors see the normal site; the text only
// matters to clients that never run the bundle.

import { ORG, SITE_URL, SITE_NAME, LOGO_URL } from './site.js';
import { getEnSlug } from '../src/utils/slug.js';

export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const paragraphs = (text) =>
  String(text || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');

const list = (items) =>
  items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';

// ─── Structured data ──────────────────────────────────────────────────────────

export function organizationJsonLd(services = []) {
  const [main, ...others] = ORG.offices;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: ORG.name,
    alternateName: ORG.alternateName,
    description: ORG.summary,
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: ORG.phone,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: main.street,
      addressLocality: ORG.locality,
      addressRegion: ORG.region,
      addressCountry: ORG.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: main.lat, longitude: main.lng },
    hasMap: main.mapsUrl,
    location: others.map((o) => ({
      '@type': 'Place',
      name: o.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: o.street,
        addressLocality: ORG.locality,
        addressRegion: ORG.region,
        addressCountry: ORG.country,
      },
      geo: { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lng },
    })),
    areaServed: ORG.areaServed.map((name) => ({ '@type': 'Place', name })),
    sameAs: ORG.sameAs,
    knowsAbout: services.map((s) => s.title),
    hasOfferCatalog: services.length
      ? {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title,
              description: s.description,
              areaServed: ORG.areaServed,
            },
          })),
        }
      : undefined,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const names = (arr, lang = 'en') =>
  (arr || [])
    .map((t) => (typeof t === 'string' ? t : t?.name?.[lang] || t?.name?.en || ''))
    .filter(Boolean);

export function projectFacts(raw) {
  const slug = getEnSlug(raw);
  return {
    slug,
    url: `${SITE_URL}/portfolio/${slug}`,
    title: raw.name?.en || raw.name?.ar || '',
    titleAr: raw.name?.ar || '',
    description: raw.description?.en || '',
    descriptionAr: raw.description?.ar || '',
    services: names(raw.types),
    sectors: [...names(raw.categories), ...names(raw.subcategories)],
    location: raw.location?.en || (typeof raw.location === 'string' ? raw.location : ''),
    image: raw.fullMainCover || raw.mainCover?.url || '',
    date: raw.createdAt || '',
  };
}

export function isPublicProject(raw) {
  return raw && raw.published !== false && !raw.deleted;
}

export function projectJsonLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.description || p.descriptionAr || undefined,
    url: p.url,
    image: p.image || undefined,
    dateCreated: p.date || undefined,
    genre: p.services.length ? p.services : undefined,
    about: p.sectors.length ? p.sectors : undefined,
    creator: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['en', 'ar'],
  };
}

export function renderProjectArticle(p, { headingLevel = 1 } = {}) {
  const h = `h${headingLevel}`;
  const meta = [
    p.services.length && `<li>Services: ${esc(p.services.join(', '))}</li>`,
    p.sectors.length && `<li>Sector: ${esc(p.sectors.join(', '))}</li>`,
    p.location && `<li>Location: ${esc(p.location)}</li>`,
  ].filter(Boolean);
  return `<article>
<${h}><a href="/portfolio/${esc(p.slug)}">${esc(p.title)}</a></${h}>
${p.titleAr && p.titleAr !== p.title ? `<p lang="ar" dir="rtl">${esc(p.titleAr)}</p>` : ''}
${meta.length ? `<ul>${meta.join('')}</ul>` : ''}
${paragraphs(p.description)}
${p.descriptionAr ? `<div lang="ar" dir="rtl">${paragraphs(p.descriptionAr)}</div>` : ''}
</article>`;
}

// ─── Shared page chrome ───────────────────────────────────────────────────────

export function renderNav() {
  const links = [
    ['/', 'Home'],
    ['/portfolio', 'Portfolio'],
    ['/about', 'About'],
    ['/services', 'Software'],
    ['/join-us', 'Careers'],
    ['/contact', 'Contact'],
  ];
  return `<nav aria-label="Main">${list(
    links.map(([href, label]) => `<a href="${href}">${label}</a>`)
  )}</nav>`;
}

export function renderContactBlock() {
  const offices = ORG.offices.map(
    (o) =>
      `${esc(o.name)}: ${esc(o.street)}, ${esc(ORG.locality)}, ${esc(ORG.region)}, Egypt` +
      (o.mapsUrl ? ` (<a href="${esc(o.mapsUrl)}">map</a>)` : '')
  );
  return `<section>
<h2>Contact Saber Group</h2>
${list([
  `Phone: <a href="tel:${ORG.phone}">${ORG.phoneDisplay}</a>`,
  `WhatsApp: <a href="${ORG.whatsapp}">${ORG.phoneDisplay}</a>`,
  `Email: <a href="mailto:${ORG.email}">${ORG.email}</a>`,
  ...offices,
])}
<p>Follow Saber Group: ${ORG.sameAs.map((u) => `<a href="${u}">${esc(new URL(u).hostname.replace('www.', ''))}</a>`).join(' · ')}</p>
</section>`;
}

// ─── HTML injection ───────────────────────────────────────────────────────────

const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
};

/**
 * Fill the built index.html shell with page-specific meta, JSON-LD and
 * readable body content.
 */
export function renderPage(template, { path, title, description, image, type = 'website', jsonLd = [], body = '' }) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`;
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:type', type);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  if (image) {
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'property', 'og:image:alt', title);
    html = setMeta(html, 'name', 'twitter:image', image);
  }

  // The template may itself be a rendered page (middleware fetches the
  // prerendered /index.html), so drop anything a previous pass injected.
  html = html.replace(/\s*<link rel="canonical"[^>]*>/i, '');
  html = html.replace(/\s*<script type="application\/ld\+json" data-seo>[\s\S]*?<\/script>/g, '');

  const scripts = jsonLd
    .filter(Boolean)
    .map(
      (d) =>
        `<script type="application/ld+json" data-seo>${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`
    )
    .join('\n    ');
  html = html.replace(
    '</head>',
    `    <link rel="canonical" href="${esc(url)}" />\n    ${scripts}\n  </head>`
  );

  const content = `<!--seo--><div class="seo-static">${renderNav()}<main>${body}</main>${renderContactBlock()}</div><!--/seo-->`;
  return html.replace(
    /<div id="root">(?:<!--seo-->[\s\S]*?<!--\/seo-->)?<\/div>/,
    `<div id="root">${content}</div>`
  );
}
