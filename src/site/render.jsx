import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home, Landing, NotFound } from './components.jsx'
import { SITE, appStoreUrl, faqsOf } from './theme.js'

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.origin,
  description: 'Independent developer of small, fast, private, on-device apps for iPhone, iPad and Mac.',
  email: SITE.email,
}

function doc({ title, description, canonical, ogImage, jsonld = [], robots = 'index, follow, max-image-preview:large', body }) {
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
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE.name}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">${img}
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

export function renderHome(apps, featured, { year }) {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AISixteen apps',
    itemListElement: apps.map((a, i) => ({
      '@type': 'ListItem', position: i + 1, name: a.name, url: appStoreUrl(a),
    })),
  }
  return doc({
    title: 'AISixteen — private, on-device apps for iPhone, iPad & Mac',
    description: 'AISixteen builds small, fast, private apps for iPhone, iPad and Mac — no accounts, no tracking, everything runs on-device.',
    canonical: `${SITE.origin}/`,
    ogImage: `${SITE.origin}/logo.png`,
    jsonld: [ORG, itemList],
    body: renderToStaticMarkup(<Home apps={apps} featured={featured} year={year} />),
  })
}

export function renderLanding(app, apps, { year }) {
  const more = apps.filter((a) => a.slug !== app.slug).slice(0, 4)
  // og/schema image: prefer the app's PNG screenshot for max social-crawler compatibility.
  const hero = app.screenshot
  // No offers/price and no aggregateRating are asserted — we don't fabricate either.
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
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
    description: `${app.name}: ${app.short} On-device, no account, works offline — on the App Store for ${app.platforms || 'iPhone, iPad and Mac'}.`,
    canonical: `${SITE.origin}/${app.slug}/`,
    ogImage: `${SITE.origin}/${hero}`,
    jsonld: [ORG, softwareApp, faqPage],
    body: renderToStaticMarkup(<Landing app={app} more={more} year={year} />),
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
