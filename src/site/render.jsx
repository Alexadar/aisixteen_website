import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home, Landing, NotFound, FantasticPage } from './components.jsx'
import { FoundationsIndex, FoundationsPage, FoundationsComing, BASE } from './foundations.jsx'
import { SITE, appStoreUrl, faqsOf, claimOf } from './theme.js'

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.origin,
  description: 'Independent developer of Aisixteen Fantastic, an open-source kernel of agents, and of small, fast, private apps for iPhone, iPad and Mac.',
  email: SITE.email,
}

function doc({ title, description, canonical, ogImage, ogType = 'website', extraMeta = '', jsonld = [], robots = 'index, follow, max-image-preview:large', body }) {
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
  const img = ogImage ? `\n<meta property="og:image" content="${ogImage}">\n<meta name="twitter:image" content="${ogImage}">` : ''
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${robots}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE.name}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">${img}${extraMeta}
<link rel="icon" type="image/png" href="/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${ld}
</head>
<body>
${body}
<script src="/assets/site.js" defer></script>
</body>
</html>`
}

export function renderHome(apps, featured, { year, fantastic }) {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AISixteen apps',
    itemListElement: apps.map((a, i) => ({
      '@type': 'ListItem', position: i + 1, name: a.name, url: appStoreUrl(a),
    })),
  }
  return doc({
    title: 'AISixteen — Fantastic: humans and AIs, one workspace',
    description: 'Aisixteen Fantastic is an open-source kernel of agents where models, programs, files and people share one workspace. AISixteen also makes small, private apps for iPhone, iPad and Mac — no accounts, no tracking.',
    canonical: `${SITE.origin}/`,
    ogImage: `${SITE.origin}/logo.png`,
    jsonld: [ORG, itemList],
    body: renderToStaticMarkup(<Home apps={apps} featured={featured} fantastic={fantastic} year={year} />),
  })
}

export function renderLanding(app, apps, { year, fantastic }) {
  const more = apps.filter((a) => a.slug !== app.slug).slice(0, 4)
  // og/schema image: prefer the app's PNG screenshot for max social-crawler compatibility.
  const hero = app.screenshot
  // No offers/price and no aggregateRating are asserted — we don't fabricate either.
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.storeName || app.name,
    description: app.blurb,
    applicationCategory: app.group === 'games' ? 'GameApplication' : 'UtilitiesApplication',
    operatingSystem: 'iOS, iPadOS, macOS',
    url: appStoreUrl(app),
    image: `${SITE.origin}/${hero}`,
    publisher: { '@type': 'Organization', name: SITE.name },
  }
  if (app.rating && app.ratingCount) {
    softwareApp.aggregateRating = {
      '@type': 'AggregateRating', ratingValue: String(app.rating), ratingCount: String(app.ratingCount),
    }
  }
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsOf(app).map((f) => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return doc({
    title: `${app.name} — ${app.tagline} | AISixteen`,
    description: `${app.name}: ${app.short} ${claimOf(app)} On the App Store for ${app.platforms || 'iPhone, iPad and Mac'}.`,
    canonical: `${SITE.origin}/${app.slug}/`,
    ogImage: `${SITE.origin}/${hero}`,
    jsonld: [ORG, softwareApp, faqPage],
    body: renderToStaticMarkup(<Landing app={app} more={more} fantastic={fantastic} year={year} />),
  })
}

// Fantastic is free, open-source developer software — not an App Store app — so it gets
// its own page and schema. Every structured-data value mirrors text visible on the page;
// no rating is asserted (Google's software-app rich result needs one, so none is expected).
export function renderFantastic(f, { year }) {
  const url = `${SITE.origin}/${f.slug}/`
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: f.fullName,
    alternateName: f.name,
    description: f.stackLead,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    url,
    downloadUrl: f.releases,
    sameAs: [f.repo, f.crate],
    image: `${SITE.origin}/${f.icon}`,
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
  }
  const sourceCode = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: f.fullName,
    codeRepository: f.repo,
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    programmingLanguage: f.runtimes.map((r) => r.name),
    targetProduct: { '@type': 'SoftwareApplication', name: f.fullName, url },
  }
  const v = f.video
  const video = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title,
    description: v.description,
    thumbnailUrl: `${SITE.origin}/${v.poster}`,
    contentUrl: `${SITE.origin}/${v.src}`,
    uploadDate: v.uploadDate,
    duration: v.duration,
    hasPart: v.chapters.map((c, i) => ({
      '@type': 'Clip', name: c.label, url: `${url}#t=${c.t}`,
      startOffset: Math.floor(c.t), endOffset: Math.floor(v.chapters[i + 1]?.t ?? 124),
    })),
  }
  return doc({
    title: `${f.name} — humans and AIs in one workspace, built from scratch | AISixteen`,
    description: `${f.fullName}, built from scratch layer by layer: a kernel of agents in Python, Rust, Swift and TypeScript, the fantastic CLI, a browser canvas and an MCP server. Open source (AGPL), alpha, for macOS, Linux and Windows. A desktop app and fantastic OS are on the roadmap.`,
    canonical: url,
    ogImage: `${SITE.origin}/${v.poster}`,
    jsonld: [ORG, softwareApp, sourceCode, video],
    body: renderToStaticMarkup(<FantasticPage f={f} year={year} />),
  })
}

export function renderNotFound({ year }) {
  return doc({
    title: 'Page not found — AISixteen',
    description: 'The page you were looking for could not be found.',
    canonical: `${SITE.origin}/404`,
    robots: 'noindex, follow',
    jsonld: [ORG],
    body: renderToStaticMarkup(<NotFound year={year} />),
  })
}

/* ---------------- /fantastic/foundations/ ---------------- */
// Every published page is a TechArticle with a BreadcrumbList (the full tree path) and a
// VideoObject per Manim clip, referenced from the article by @id. Every value mirrors text
// visible on the page. Planned pages are noindex placeholders; old URLs get a redirect page.

const ORIGIN = SITE.origin
const FOUNDATIONS_URL = `${ORIGIN}${BASE}`
const isoDuration = (s) => { const t = Math.round(s); return `PT${t >= 60 ? `${Math.floor(t / 60)}M` : ''}${t % 60}S` }
const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
})
const crumbPath = (n) => [['AISixteen', `${ORIGIN}/`], ['Fantastic', `${ORIGIN}/fantastic/`], ['Foundations', FOUNDATIONS_URL],
  ...n.ancestors.map((a) => [a.title, `${ORIGIN}${a.url}`]), [n.title, `${ORIGIN}${n.url}`]]
const publisher = { '@type': 'Organization', name: SITE.name, url: ORIGIN, logo: { '@type': 'ImageObject', url: `${ORIGIN}/logo.png` } }
const videoId = (c) => `${ORIGIN}${c.files.mp4}#video`

function videoLd(c, uploadDate) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': videoId(c),
    name: c.title,
    description: c.caption,
    thumbnailUrl: `${ORIGIN}${c.files.poster}`,
    contentUrl: `${ORIGIN}${c.files.mp4}`,
    uploadDate,
    duration: isoDuration(c.meta.duration),
    width: c.meta.width,
    height: c.meta.height,
    isFamilyFriendly: true,
    inLanguage: 'en',
    publisher,
  }
}

export function renderFoundationsIndex(F, { year, modified }) {
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: F.hub.headline,
    description: F.hub.description,
    url: FOUNDATIONS_URL,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: ORIGIN },
    about: { '@type': 'SoftwareApplication', name: 'Aisixteen Fantastic', url: `${ORIGIN}/fantastic/` },
    dateModified: modified,
    hasPart: F.published.map((n) => ({ '@type': 'TechArticle', headline: n.article.headline, url: `${ORIGIN}${n.url}` })),
  }
  return doc({
    title: 'Foundations — how Aisixteen Fantastic works | AISixteen',
    description: F.hub.description,
    canonical: FOUNDATIONS_URL,
    ogImage: `${ORIGIN}${F.hub.og}`,
    jsonld: [ORG, collection, crumbs([['AISixteen', `${ORIGIN}/`], ['Fantastic', `${ORIGIN}/fantastic/`], ['Foundations', FOUNDATIONS_URL]])],
    body: renderToStaticMarkup(<FoundationsIndex F={F} year={year} />),
  })
}

export function renderFoundationsPage(F, n, { year, modified }) {
  const a = n.article
  const url = `${ORIGIN}${n.url}`
  const published = `${F.hub.published}T00:00:00+00:00`
  const parent = n.ancestors[n.ancestors.length - 1]
  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: a.headline,
    name: n.title,
    description: a.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${ORIGIN}${n.og}`,
    datePublished: F.hub.published,
    dateModified: modified,
    author: { '@type': 'Organization', name: SITE.name, url: ORIGIN },
    publisher,
    inLanguage: 'en',
    isPartOf: parent
      ? { '@type': 'WebPage', name: parent.title, url: `${ORIGIN}${parent.url}` }
      : { '@type': 'CollectionPage', name: F.hub.headline, url: FOUNDATIONS_URL },
    about: a.about.map((name) => ({ '@type': 'Thing', name })),
    video: n.clips.map((c) => ({ '@id': videoId(c) })),
  }
  const seen = new Set()
  const clips = n.clips.filter((c) => !seen.has(c.key) && seen.add(c.key)).map((c) => videoLd(c, published))
  return doc({
    title: `${n.title} — Foundations of Aisixteen Fantastic | AISixteen`,
    description: a.description,
    canonical: url,
    ogImage: `${ORIGIN}${n.og}`,
    ogType: 'article',
    extraMeta: `\n<meta property="article:published_time" content="${F.hub.published}">\n<meta property="article:modified_time" content="${modified}">\n<meta property="article:section" content="Foundations">`,
    jsonld: [ORG, article, crumbs(crumbPath(n)), ...clips],
    body: renderToStaticMarkup(<FoundationsPage F={F} n={n} year={year} modified={modified} />),
  })
}

export function renderFoundationsComing(F, n, { year }) {
  return doc({
    title: `${n.title} (coming) — Foundations of Aisixteen Fantastic | AISixteen`,
    description: `${n.title}: a planned page of Foundations, the series on how Aisixteen Fantastic works. Not written yet.`,
    canonical: `${ORIGIN}${n.url}`,
    ogImage: `${ORIGIN}${n.pillar.og || F.hub.og}`,
    robots: 'noindex, follow',
    jsonld: [ORG, crumbs(crumbPath(n))],
    body: renderToStaticMarkup(<FoundationsComing F={F} n={n} year={year} />),
  })
}

// An old URL: a static redirect page (meta refresh, canonical to the new place, noindex).
export function renderRedirect(to, title) {
  const href = `${ORIGIN}${to}`
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Moved: ${esc(title)} | AISixteen</title>
<link rel="canonical" href="${href}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${to}">
<style>body{margin:0;padding:40px 20px;background:#0b1020;color:#e6e9f2;font:16px/1.6 system-ui,sans-serif}a{color:#55d3ff}</style>
</head>
<body>
<p>This page has moved to <a href="${to}">${esc(title)}</a>.</p>
</body>
</html>
`
}
