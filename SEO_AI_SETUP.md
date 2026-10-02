# SEO & AI readability

The site is a React SPA, so its HTML is empty until JavaScript runs. Search
engines, link-preview bots and AI assistants (ChatGPT, Claude, Perplexity…)
mostly don't run JavaScript. Two pieces give them real content:

## 1. Build time — `scripts/prerender.mjs`

Runs after `vite build` (see `npm run build`). For each route in
`seo/site.js` → `ROUTES` it writes `dist/<route>.html` with:

- a page-specific `<title>`, description, Open Graph tags and canonical URL
- JSON-LD structured data (`ProfessionalService` + `WebSite`, and an
  `ItemList` of projects on `/portfolio`)
- readable text inside `#root`, built from `src/content/*` so it matches the
  page. React replaces it on boot; it only shows if the app hasn't started
  after 2s (see the `.seo-static` style in `index.html`).

It also writes `dist/sitemap.xml` and `dist/llms.txt`. Portfolio projects are
fetched from the projects API; if the API is down the build still succeeds
without them. `vercel.json` has `cleanUrls` so `/about` serves `about.html`.

## 2. Request time — `middleware.js`

For `/portfolio/*`, requests from bots / AI fetchers / non-browser clients get
the built shell with that project's title, description, services, sector,
OG image and `CreativeWork` JSON-LD. Projects are fetched live, so new ones
work without a redeploy. Browsers fall through to the normal SPA.

## Editing

- Company facts (address, phone, services summary, clients, socials):
  `seo/site.js`. AI answers quote these closely — keep them accurate.
- Page titles/descriptions: `ROUTES` in `seo/site.js`.
- Crawler rules: `public/robots.txt`.

## Checking

```bash
npm run build
```

Then open `dist/index.html` (or any `dist/*.html`) — everything inside
`<div id="root">` is what an AI assistant reads. Validate structured data at
https://validator.schema.org and https://search.google.com/test/rich-results.
