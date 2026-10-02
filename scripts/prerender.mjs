// Post-build step: writes a readable HTML file per public route into dist/,
// plus sitemap.xml and llms.txt, so crawlers and AI assistants that don't run
// JavaScript still see the site's content. Runs after `vite build`.
//
// Portfolio projects come from the live API; if it is unreachable the build
// still succeeds, just without the project list.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import homeContent from '../src/content/HomeContent.js';
import servicesContent from '../src/content/ServicesContent.js';
import aboutContent from '../src/content/AboutContent.js';
import { ORG, ROUTES, SITE_URL, LOGO_URL, PROJECTS_API } from '../seo/site.js';
import {
  esc,
  renderPage,
  organizationJsonLd,
  websiteJsonLd,
  projectFacts,
  projectJsonLd,
  isPublicProject,
  renderProjectArticle,
} from '../seo/render.js';

const DIST = path.resolve('dist');
const home = homeContent.en;
const homeAr = homeContent.ar;

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

const SERVICES = Object.values(home.whatWeDo.services).map((s) => ({
  title: s.title,
  description: s.description,
  features: s.features,
}));

async function fetchProjects() {
  try {
    const res = await fetch(`${PROJECTS_API}?PageCount=all`, {
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.projects || [])
      .filter(isPublicProject)
      .filter((p) => !p.parentProject)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map(projectFacts)
      .filter((p) => p.slug && p.title);
  } catch (err) {
    console.warn(`[prerender] projects API unavailable, skipping portfolio list: ${err.message}`);
    return [];
  }
}

// ─── Page bodies ──────────────────────────────────────────────────────────────

// Display names live in ProductsSection.jsx (PRODUCT_META), next to its icons.
const PRODUCT_NAMES = {
  'jahez-crm': 'Jahez CRM',
  'jahez-ats': 'Jahez ATS',
  'easy-menu': 'Easy Menu',
  medify: 'Medify',
};

function homeBody(projects) {
  const products = Object.entries(home.products.items).map(
    ([id, p]) =>
      `<strong>${esc(PRODUCT_NAMES[id] || id)}</strong> — ${esc(p.subtitle)} (${esc(p.badge)}). ${esc(p.description)}`
  );
  const servicesAr = Object.values(homeAr.whatWeDo.services).map((s) => esc(s.title));

  return `
<h1>Saber Group — Marketing &amp; Creative Agency in Tanta, Egypt</h1>
<p>${esc(ORG.summary)}</p>

<section>
<h2>Services</h2>
${SERVICES.map(
  (s) => `<h3>${esc(s.title)}</h3><p>${esc(s.description)}</p>${list(s.features.map(esc))}`
).join('\n')}
</section>

<section>
<h2>Software products</h2>
${list(products)}
<p><a href="/services">Details on the ATS and CRM</a></p>
</section>

<section>
<h2>Clients</h2>
<p>Brands Saber Group has worked with include ${esc(ORG.clients.join(', '))}.</p>
</section>

${
  projects.length
    ? `<section>
<h2>Recent projects</h2>
${list(projects.slice(0, 12).map((p) => `<a href="/portfolio/${esc(p.slug)}">${esc(p.title)}</a>${p.services.length ? ` — ${esc(p.services.slice(0, 3).join(', '))}` : ''}`))}
<p><a href="/portfolio">See all ${projects.length} projects</a></p>
</section>`
    : ''
}

<section lang="ar" dir="rtl">
<h2>صابر جروب — وكالة تسويق وإنتاج إبداعي في طنطا</h2>
<p>${esc(ORG.summaryAr)}</p>
${list(servicesAr)}
</section>`;
}

function portfolioBody(projects) {
  return `
<h1>Saber Group Portfolio</h1>
<p>Marketing campaigns, photoshoots, video production, branding and web projects produced by Saber Group, a marketing and creative agency in Tanta, Egypt.</p>
${projects.length ? projects.map((p) => renderProjectArticle(p, { headingLevel: 2 })).join('\n') : '<p>Browse the portfolio at <a href="/portfolio">sabergroup-eg.com/portfolio</a>.</p>'}`;
}

function aboutBody() {
  const a = aboutContent.en;
  const ar = aboutContent.ar;
  return `
<h1>About Saber Group</h1>
<p>${esc(a.subheadline)}</p>
<h2>${esc(a.story.title)}</h2><p>${esc(a.story.body)}</p>
<h2>${esc(a.vision.title)}</h2><p>${esc(a.vision.body)}</p>
<h2>${esc(a.values.title)}</h2>
${list(a.values.list.map((v) => `<strong>${esc(v.title)}</strong>: ${esc(v.desc)}`))}
<section lang="ar" dir="rtl">
<h2>${esc(ar.story.title)}</h2><p>${esc(ar.story.body)}</p>
</section>`;
}

function servicesBody() {
  const s = servicesContent.en;
  const product = (p) => `
<h2>${esc(p.name)} — ${esc(p.tagline)}</h2>
<p>${esc(p.description)}</p>
${list(p.capabilities.map(esc))}`;
  return `
<h1>${esc(s.hero.title)}</h1>
<p>${esc(s.hero.subtitle)}</p>
${product(s.products.ats)}
${product(s.products.crm)}
<p>${esc(s.tiersSection.subtitle)}</p>`;
}

function contactBody() {
  return `
<h1>Contact Saber Group</h1>
<p>Saber Group is based in ${esc(ORG.locality)}, ${esc(ORG.region)}, Egypt. Reach us by phone, WhatsApp or email to discuss a marketing, production or software project.</p>
<h2>Services you can ask about</h2>
${list(SERVICES.map((s) => esc(s.title)))}`;
}

function addressBody() {
  return `
<h1>Saber Group Locations in Tanta</h1>
${list(
  ORG.offices.map(
    (o) =>
      `<strong>${esc(o.name)}</strong>: ${esc(o.street)}, ${esc(ORG.locality)}, ${esc(ORG.region)}, Egypt` +
      (o.mapsUrl ? ` — <a href="${esc(o.mapsUrl)}">Google Maps</a>` : '')
  )
)}`;
}

function joinUsBody() {
  return `
<h1>Careers at Saber Group</h1>
<p>Saber Group hires marketers, content creators, photographers, videographers, designers and software engineers in Tanta, Egypt. Current open positions are listed on this page; you can also send a general application.</p>`;
}

const BODIES = {
  '/': homeBody,
  '/portfolio': portfolioBody,
  '/about': aboutBody,
  '/services': servicesBody,
  '/contact': contactBody,
  '/address': addressBody,
  '/join-us': joinUsBody,
};

// ─── Side files ───────────────────────────────────────────────────────────────

function sitemap(projects) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...ROUTES.map((r) => ({ loc: `${SITE_URL}${r.path}`, priority: r.priority, lastmod: today })),
    ...projects.map((p) => ({
      loc: p.url,
      priority: '0.5',
      lastmod: (p.date || '').slice(0, 10) || today,
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
  .join('\n')}
</urlset>
`;
}

function llmsTxt(projects) {
  const md = (s) => String(s).replace(/\s+/g, ' ').trim();
  return `# Saber Group

> ${ORG.summary}

- Location: ${ORG.offices.map((o) => `${o.name}, ${o.street}, ${ORG.locality}, ${ORG.region}, Egypt`).join('; ')}
- Phone / WhatsApp: ${ORG.phoneDisplay} (${ORG.phone})
- Email: ${ORG.email}
- Social: ${ORG.sameAs.join(', ')}
- Clients include: ${ORG.clients.join(', ')}

## Services

${SERVICES.map((s) => `- **${s.title}**: ${md(s.description)}`).join('\n')}

## Pages

${ROUTES.filter((r) => !r.sitemapOnly)
  .map((r) => `- [${r.title}](${SITE_URL}${r.path}): ${r.description}`)
  .join('\n')}

## Portfolio

${
  projects.length
    ? projects
        .map((p) => `- [${md(p.title)}](${p.url})${p.services.length ? `: ${p.services.join(', ')}` : ''}`)
        .join('\n')
    : `- [All projects](${SITE_URL}/portfolio)`
}

## العربية

${ORG.summaryAr}
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const projects = await fetchProjects();
  const siteJsonLd = [organizationJsonLd(SERVICES), websiteJsonLd()];

  for (const route of ROUTES) {
    if (route.sitemapOnly) continue;
    const isPortfolio = route.path === '/portfolio';
    const html = renderPage(template, {
      ...route,
      image: LOGO_URL,
      jsonLd: [
        ...siteJsonLd,
        isPortfolio && projects.length
          ? {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Saber Group portfolio',
              itemListElement: projects.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: projectJsonLd(p),
              })),
            }
          : null,
      ],
      body: BODIES[route.path](projects),
    });

    // "/about" -> dist/about.html, served at /about via cleanUrls in vercel.json
    const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
    await mkdir(path.dirname(path.join(DIST, file)), { recursive: true });
    await writeFile(path.join(DIST, file), html);
  }

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(projects));
  await writeFile(path.join(DIST, 'llms.txt'), llmsTxt(projects));

  console.log(
    `[prerender] ${ROUTES.filter((r) => !r.sitemapOnly).length} pages, ${projects.length} projects, sitemap.xml, llms.txt`
  );
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
