# aisixteen.com

A static, prerendered site: the home page, one page per app, a blog per app, and the
`/fantastic/` page. React is used only at build time as the template engine; every page is
plain HTML in `docs/`, which GitHub Pages serves. No client-side rendering.

## Commands

```bash
npm install
npm run build            # scripts/build-site.mjs -> docs/
npm run preview          # build, then serve docs/ on http://localhost:4173
npm run test:layout      # Playwright: layout, SEO, links, contrast (see below)
npm run optimize-media   # after adding an icon, screenshot.png or logo (needs ImageMagick)
npm run indexnow         # after a deploy is live: pings IndexNow with every sitemap URL
./build.sh               # clean build AND git commit (the deploy step)
```

## Structure

- `src/data/apps.js` — every app: copy, App Store id, accent, app-specific questions (`QA`)
  and the blog intro line. Single source for the pages, JSON-LD, `llms-full.txt` and sitemap.
- `src/data/fantastic.js` — content of `/fantastic/`.
- `src/site/` — `components.jsx` (templates), `render.jsx` (head, meta, JSON-LD), `site.css`
  (design tokens: one indigo theme), `fantastic.css` (only `/fantastic/`), `site.js`, `fonts/`.
- `content/<app-slug>/<post-slug>.md` — blog posts (see below).
- `media/<folder>/` — icons and screenshots. Published at the site root under the same path.
- `scripts/` — the build, `posts.mjs` (Markdown -> post), `ai-files.mjs` (robots.txt, llms).
- `docs/` — build output. Never edit by hand.

## URLs

- `/<app-slug>/` — app page. `/<app-slug>/blog/` — its posts. `/<app-slug>/blog/<post-slug>/` — a post.
- Media folders whose name is an old app URL (`/eartharound/`, `/ephemeris_sky/`, …) get a
  small noindex page that forwards to the app page.
- `sitemap.xml` lists every indexable page with a `lastmod`: a post's own `updated` date, and
  `SITE.updated` in `src/site/theme.js` for app pages. Change that constant when app pages
  really change; it is never the build date.

## Writing a post

Create `content/<app-slug>/<post-slug>.md`. The app must already exist in `apps.js`.

```markdown
---
title: How do you …?
description: One or two sentences, at most 165 characters.
date: 2026-11-24
updated: 2026-12-02
answer: The direct answer, shown in a box under the title.
---

Intro paragraph.

![Alt text that describes the picture](/kerfcalc/screenshot-960.webp "Optional caption")

## A question as a heading?

Body…

## Frequently asked questions

### A question?

Its answer. (This section becomes FAQPage structured data.)

## Sources

- …
```

The build adds the page chrome, table of contents, canonical, Open Graph, BlogPosting,
BreadcrumbList and FAQPage JSON-LD, the Smart App Banner, related posts, the sitemap entry
and the `llms.txt` / `llms-full.txt` entries. Rules for the text: facts checked against the
app and a cited source; no prices and no ratings; no predictive claims for the astrology app;
nothing the app does not do.

## Layout tests

`npm run test:layout` runs Playwright against the built `docs/` in Chromium, Firefox and
WebKit, on desktop and phone sizes (`playwright.config.mjs`). `tests/site.spec.mjs` checks every
page's canonical, title, description, headings and image sizes; JSON-LD validity (BlogPosting,
BreadcrumbList, FAQPage that mirrors the visible text, no price or rating); that the sitemap
lists exactly the indexable pages; that no internal link is broken; sideways scroll on every
post; and WCAG AA contrast of the indigo theme. `tests/layout.spec.mjs` checks
that no page scrolls sideways at any common width, that nothing moves after load (scroll
reveals, the /fantastic/ reel, the video), that the reel keeps one size on every slide with its
drawings inside it, and that no script throws. Install the browsers once with
`npx playwright install chromium firefox webkit`, or run one, e.g. `--project=chromium`.
The `Layout tests` workflow runs all of them on every pull request.
