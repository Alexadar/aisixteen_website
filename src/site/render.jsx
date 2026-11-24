import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home, Landing, NotFound, FantasticPage, BlogIndex, Article, ctx } from './components.jsx'
import { SITE, appStoreUrl, faqsOf, claimOf, osOf, platformsOf } from './theme.js'

export const setContext = ({ apps, posts }) => { ctx.apps = apps; ctx.posts = posts }

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// JSON-LD sits in a <script>: only "</" and "<!--" could end it early.
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

const ORG_ID = `${SITE.origin}/#organization`
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: `${SITE.origin}/`,
  logo: { '@type': 'ImageObject', url: `${SITE.origin}/logo.png`, width: 304, height: 348 },
  description: 'Independent developer of Aisixteen Fantastic, an open-source kernel of agents, and of small, fast, private apps for iPhone, iPad, Mac and Apple Watch.',
  email: SITE.email,
  sameAs: [SITE.developerUrl, SITE.github],
}
const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.origin}/#website`,
  name: SITE.name,
  url: `${SITE.origin}/`,
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
}
const publisherRef = { '@type': 'Organization', '@id': ORG_ID, name: SITE.name, url: `${SITE.origin}/` }

const breadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE.origin}${path}` })),
})

function doc({ title, description, canonical, ogImage, ogImageAlt, ogType = 'website', jsonld = [], robots = 'index, follow, max-image-preview:large', body, appId, extraHead = '', css = ['site.css'] }) {
  const ld = jsonld.map((o) => `<script type="application/ld+json">${ldJson(o)}</script>`).join('\n')
  const img = ogImage ? `\n<meta property="og:image" content="${ogImage}">${ogImageAlt ? `\n<meta property="og:image:alt" content="${esc(ogImageAlt)}">` : ''}\n<meta name="twitter:image" content="${ogImage}">` : ''
  // Smart App Banner: Safari on iPhone and iPad offers the app from its own page and posts.
  const banner = appId ? `\n<meta name="apple-itunes-app" content="app-id=${appId}">` : ''
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${robots}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b1020">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">${img}${banner}${extraHead}
<link rel="icon" type="image/png" href="/logo.png">
<link rel="apple-touch-icon" href="/logo.png">
<link rel="preload" href="/assets/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
${css.map((c) => `<link rel="stylesheet" href="/assets/${c}">`).join('\n')}
${ld}
</head>
<body>
${body}
<script src="/assets/site.js" defer></script>
</body>
</html>`
}

export function renderHome(apps, featured, { year, fantastic, posts }) {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AISixteen apps',
    itemListElement: apps.map((a, i) => ({
      '@type': 'ListItem', position: i + 1, name: a.name, url: `${SITE.origin}/${a.slug}/`,
    })),
  }
  return doc({
    title: 'AISixteen: Fantastic, and private apps for iPhone, iPad and Mac',
    description: 'Aisixteen Fantastic is an open-source kernel of agents where models, programs, files and people share one workspace. AISixteen also makes small, private apps for iPhone, iPad and Mac: no accounts, no tracking.',
    canonical: `${SITE.origin}/`,
    ogImage: `${SITE.origin}/logo.png`,
    ogImageAlt: 'AISixteen logo',
    jsonld: [ORG, WEBSITE, itemList],
    // Old App Store marketing links point at home anchors (e.g. /#ephemeris-sky): forward an app's
    // anchor to that app's page before paint. Section anchors (#privacy, #apps…) are not app slugs.
    extraHead: `\n<script>(function(){var s=${JSON.stringify(apps.map((a) => a.slug))},h=location.hash.slice(1);if(s.indexOf(h)>=0)location.replace('/'+h+'/')})()</script>`,
    body: renderToStaticMarkup(<Home apps={apps} featured={featured} fantastic={fantastic} posts={posts} year={year} />),
  })
}

// No offers/price and no aggregateRating, on purpose (site rule): nothing is asserted that
// the page does not show.
const softwareAppOf = (app) => ({
  '@type': 'SoftwareApplication',
  '@id': `${SITE.origin}/${app.slug}/#app`,
  name: app.storeName || app.name,
  description: app.blurb,
  applicationCategory: app.group === 'games' ? 'GameApplication' : 'UtilitiesApplication',
  operatingSystem: osOf(app),
  url: `${SITE.origin}/${app.slug}/`,
  installUrl: appStoreUrl(app),
  image: `${SITE.origin}/${app.screenshot}`,
  publisher: publisherRef,
})

const descOf = (app) => `${app.name}: ${app.short} ${claimOf(app)} On the App Store for ${platformsOf(app).replace('&', 'and')}.`

export function renderLanding(app, apps, { year, fantastic }) {
  const more = apps.filter((a) => a.slug !== app.slug && a.group === app.group).concat(apps.filter((a) => a.slug !== app.slug && a.group !== app.group)).slice(0, 4)
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsOf(app).map((f) => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return doc({
    title: `${app.name}: ${app.tagline.replace(/\.$/, '')} | AISixteen`,
    description: descOf(app),
    canonical: `${SITE.origin}/${app.slug}/`,
    ogImage: `${SITE.origin}/${app.screenshot}`,
    ogImageAlt: `${app.name} screenshot`,
    appId: app.appStoreId,
    jsonld: [ORG, { '@context': 'https://schema.org', ...softwareAppOf(app) }, faqPage, breadcrumbs([['Home', '/'], [app.name, `/${app.slug}/`]])],
    body: renderToStaticMarkup(<Landing app={app} more={more} fantastic={fantastic} year={year} />),
  })
}

export function renderBlogIndex(app, { year }) {
  const url = `${SITE.origin}/${app.slug}/blog/`
  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${url}#blog`,
    name: `${app.name} guides`,
    url,
    inLanguage: 'en',
    publisher: publisherRef,
    about: { '@id': `${SITE.origin}/${app.slug}/#app` },
    blogPost: app.posts.map((p) => ({
      '@type': 'BlogPosting', headline: p.title, url: `${SITE.origin}${p.url}`, datePublished: p.date, dateModified: p.updated,
    })),
  }
  return doc({
    title: `${app.name} guides | AISixteen`,
    description: (app.blogIntro || `Guides about the problems ${app.name} solves, with worked examples and sources.`).slice(0, 160),
    canonical: url,
    ogImage: `${SITE.origin}/${app.screenshot}`,
    ogImageAlt: `${app.name} screenshot`,
    appId: app.appStoreId,
    jsonld: [ORG, blog, breadcrumbs([['Home', '/'], [app.name, `/${app.slug}/`], ['Guides', `/${app.slug}/blog/`]])],
    body: renderToStaticMarkup(<BlogIndex app={app} year={year} />),
  })
}

export function renderArticle(post, { year }) {
  const app = post.app
  const url = `${SITE.origin}${post.url}`
  const posting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: 'en',
    wordCount: post.words,
    image: [`${SITE.origin}/${app.screenshot}`, ...post.images.map((i) => `${SITE.origin}/${i}`)],
    author: publisherRef,
    publisher: { ...publisherRef, logo: ORG.logo },
    isPartOf: { '@type': 'Blog', '@id': `${SITE.origin}/${app.slug}/blog/#blog`, name: `${app.name} guides` },
    about: softwareAppOf(app),
  }
  const jsonld = [ORG, posting, breadcrumbs([['Home', '/'], [app.name, `/${app.slug}/`], ['Guides', `/${app.slug}/blog/`], [post.title, post.url]])]
  if (post.faqs.length) {
    jsonld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })
  }
  const related = app.posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const full = `${post.title} | ${app.name}`
  return doc({
    title: full.length <= 68 ? full : post.title,
    description: post.description,
    canonical: url,
    ogType: 'article',
    ogImage: `${SITE.origin}/${app.screenshot}`,
    ogImageAlt: `${app.name} screenshot`,
    appId: app.appStoreId,
    extraHead: `\n<meta property="article:published_time" content="${post.date}">\n<meta property="article:modified_time" content="${post.updated}">\n<meta name="author" content="${SITE.name}">`,
    jsonld,
    body: renderToStaticMarkup(<Article app={app} post={post} related={related} year={year} />),
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
    publisher: publisherRef,
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
    title: `${f.name}: humans and AIs in one workspace, built from scratch | AISixteen`,
    description: `${f.fullName}, built from scratch layer by layer: a kernel of agents in Python, Rust, Swift and TypeScript, the fantastic CLI, a browser canvas and an MCP server. Open source (AGPL), alpha, for macOS, Linux and Windows. A desktop app and fantastic OS are on the roadmap.`,
    canonical: url,
    ogImage: `${SITE.origin}/${v.poster}`,
    ogImageAlt: v.title,
    css: ['site.css', 'fantastic.css'],
    jsonld: [ORG, softwareApp, sourceCode, video, breadcrumbs([['Home', '/'], [f.name, `/${f.slug}/`]])],
    body: renderToStaticMarkup(<FantasticPage f={f} year={year} />),
  })
}

export function renderNotFound({ year }) {
  return doc({
    title: 'Page not found | AISixteen',
    description: 'The page you were looking for could not be found.',
    canonical: `${SITE.origin}/404.html`,
    robots: 'noindex, follow',
    jsonld: [ORG],
    body: renderToStaticMarkup(<NotFound year={year} />),
  })
}

// A media folder that shares its name with an old app URL (/eartharound/, /ephemeris_sky/…)
// gets a tiny page that sends visitors and crawlers to the app page, instead of a 404.
export function renderRedirect(app) {
  const to = `${SITE.origin}/${app.slug}/`
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(app.name)} | AISixteen</title>
<link rel="canonical" href="${to}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=/${app.slug}/">
</head>
<body>
<p><a href="/${app.slug}/">${esc(app.name)} has moved here.</a></p>
</body>
</html>`
}
