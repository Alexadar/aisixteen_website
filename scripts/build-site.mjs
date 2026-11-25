import { createHash } from 'node:crypto'
import { robotsTxt, llmsFullTxt, llmsPosts } from './ai-files.mjs'
import { loadPosts } from './posts.mjs'
// Static site generator: pre-renders the home page + one real HTML page per app
// into docs/ so every app gets its own crawlable URL on GitHub Pages (no server).
// React is used only here, at build time, as the template engine.
import { build } from 'esbuild'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const docs = join(root, 'docs')
const media = join(root, 'media')
const siteSrc = join(root, 'src', 'site')

// 1) Bundle the JSX render module into a Node-runnable ESM file (esbuild ships with Vite).
//    Kept inside the project so the externalized `react`/`react-dom` resolve from node_modules.
const tmpDir = fs.mkdtempSync(join(root, '.build-'))
const bundlePath = join(tmpDir, 'render.mjs')
await build({
  entryPoints: [join(siteSrc, 'render.jsx')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: bundlePath,
  jsx: 'transform',
  external: ['react', 'react-dom', 'react-dom/server'],
  logLevel: 'warning',
})
const R = await import(pathToFileURL(bundlePath).href)
const { apps, featuredSlug } = await import(pathToFileURL(join(siteSrc, '..', 'data', 'apps.js')).href)
const { fantastic: fantasticData } = await import(pathToFileURL(join(siteSrc, '..', 'data', 'fantastic.js')).href)
const { SITE, platformsOf } = await import(pathToFileURL(join(siteSrc, 'theme.js')).href)

// Intrinsic size of a PNG or WebP in media/, so every <img> carries width and height and
// nothing shifts while images load.
const sizeCache = new Map()
function imageSize(rel) {
  if (sizeCache.has(rel)) return sizeCache.get(rel)
  const file = join(media, rel)
  if (!fs.existsSync(file)) throw new Error(`[build-site] missing image: media/${rel}`)
  const b = fs.readFileSync(file)
  let d
  if (b.toString('ascii', 1, 4) === 'PNG') d = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  else if (b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16)
    if (kind === 'VP8 ') d = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
    else if (kind === 'VP8L') { const n = b.readUInt32LE(21); d = { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 } }
    else if (kind === 'VP8X') d = { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 }
  }
  if (!d) throw new Error(`[build-site] cannot read the size of media/${rel} (PNG and WebP only)`)
  sizeCache.set(rel, d)
  return d
}
// The small WebP copies written by scripts/optimize-media.mjs.
const small = (rel, name) => {
  const out = `${rel.split('/')[0]}/${name}`
  if (!fs.existsSync(join(media, out))) throw new Error(`[build-site] media/${out} is missing: run "npm run optimize-media"`)
  return out
}

// 2) Decorate apps with build-time facts: the screenshots of every platform (the app's own
//    device first), each with its intrinsic size, and the small icon and screenshot copies.
const PER_PLATFORM = 3 // screenshots per platform in the strip
const decorated = apps.map((a) => {
  const folder = a.icon.split('/')[0]
  // Only platforms the app is published on (apps.js `platforms`, default iPhone, iPad & Mac).
  const on = platformsOf(a)
  const published = (p) => p === 'mac' ? on.includes('Mac') : p === 'watch' ? on.includes('Watch') : true
  const order = [a.device, 'ios', 'ipad', 'mac', 'watch'].filter((p, i, arr) => arr.indexOf(p) === i && published(p))
  const slides = []
  for (const plat of order) {
    const dir = join(media, folder, plat)
    if (!fs.existsSync(dir)) continue
    fs.readdirSync(dir)
      .filter((f) => /^screenshot_\d+\.(webp|png)$/i.test(f)).sort().slice(0, PER_PLATFORM)
      .forEach((f, i) => { const src = `${folder}/${plat}/${f}`; slides.push({ platform: plat, n: i + 1, src, ...imageSize(src) }) })
  }
  return { ...a, folder, slides, iconSm: small(a.icon, 'icon-160.webp'), shotSm: small(a.screenshot, 'screenshot-960.webp'), posts: [] }
})
const fantastic = { ...fantasticData, iconSm: small(fantasticData.icon, 'icon-160.webp') }
const featured = decorated.find((a) => a.slug === featuredSlug) || decorated[0]
const year = new Date().getFullYear()

// Posts: content/<app-slug>/<post-slug>.md, newest first, attached to their app.
const posts = loadPosts({ contentDir: join(root, 'content'), apps: decorated, origin: SITE.origin, imageSize })
for (const p of posts) p.app.posts.push(p)
R.setContext({ apps: decorated, posts })
// Home shows the newest post of each app first, then the rest, so every app with a blog is seen.
const firstOfEach = decorated.map((a) => a.posts[0]).filter(Boolean)
const homePosts = [...firstOfEach, ...posts.filter((p) => !firstOfEach.includes(p))].slice(0, 9)

// 3) Fresh docs/ output.
fs.rmSync(docs, { recursive: true, force: true })
fs.mkdirSync(docs, { recursive: true })

// Cache-bust the shared assets: browsers keep them for an hour, so every page links them
// with a content hash and a deploy is picked up on the next page load.
const ASSETS = ['site.css', 'fantastic.css', 'site.js']
const hash = createHash('sha256')
ASSETS.forEach((f) => hash.update(fs.readFileSync(join(siteSrc, f))))
const assetHash = hash.digest('hex').slice(0, 10)
const write = (rel, html) => {
  const out = join(docs, rel)
  fs.mkdirSync(dirname(out), { recursive: true })
  fs.writeFileSync(out, html.replace(/\/assets\/((?:site|fantastic)\.(?:css|js))"/g, `/assets/$1?v=${assetHash}"`))
  return rel
}

const written = []
// Each indexable page with the day it last really changed (never the build date).
const indexable = []
const latest = (...dates) => dates.filter(Boolean).sort().pop()
const page = (rel, html, lastmod) => { written.push(write(rel, html)); if (lastmod) indexable.push({ path: rel.replace(/index\.html$/, ''), lastmod }) }

page('index.html', R.renderHome(decorated, featured, { year, fantastic, posts: homePosts }), latest(SITE.updated, posts[0]?.updated))
for (const app of decorated) {
  page(`${app.slug}/index.html`, R.renderLanding(app, decorated, { year, fantastic }), latest(SITE.updated, ...app.posts.map((p) => p.updated)))
  if (!app.posts.length) continue
  page(`${app.slug}/blog/index.html`, R.renderBlogIndex(app, { year }), latest(...app.posts.map((p) => p.updated)))
  for (const post of app.posts) page(`${app.slug}/blog/${post.slug}/index.html`, R.renderArticle(post, { year }), post.updated)
}
page(`${fantastic.slug}/index.html`, R.renderFantastic(fantastic, { year }), SITE.updated)
page('404.html', R.renderNotFound({ year }))
// Old app URLs that are now media folders: send them to the app page.
for (const app of decorated) if (app.folder !== app.slug) page(`${app.folder}/index.html`, R.renderRedirect(app))

// 4) Shared cached assets (one copy each).
fs.mkdirSync(join(docs, 'assets', 'fonts'), { recursive: true })
ASSETS.forEach((f) => fs.copyFileSync(join(siteSrc, f), join(docs, 'assets', f)))
for (const f of fs.readdirSync(join(siteSrc, 'fonts'))) fs.copyFileSync(join(siteSrc, 'fonts', f), join(docs, 'assets', 'fonts', f))

// 5) Media → docs root (matching the previous publicDir layout). Copy only what the pages
//    reference, so docs stays lean (no unused platforms or stale media).
const copyMedia = (rel) => {
  const src = join(media, rel)
  if (!fs.existsSync(src)) return
  fs.mkdirSync(join(docs, dirname(rel)), { recursive: true })
  fs.copyFileSync(src, join(docs, rel))
}
for (const app of decorated) {
  ;[app.icon, app.screenshot, app.iconSm, app.shotSm, ...app.slides.map((s) => s.src)].forEach(copyMedia)
}
posts.forEach((p) => p.images.forEach(copyMedia))
;[fantastic.icon, fantastic.iconSm, fantastic.video.src, fantastic.video.poster, 'logo.png', 'logo-96.webp'].forEach(copyMedia)

// Sitemap of every indexable page (redirect stubs and 404 excluded), with <lastmod>.
fs.writeFileSync(join(docs, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE.origin}/${p.path}</loc><lastmod>${p.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`)
fs.writeFileSync(join(docs, 'robots.txt'), robotsTxt())
// AI-crawler summaries: the hand-written index plus the posts, and the whole site as text.
fs.writeFileSync(join(docs, 'llms.txt'), fs.readFileSync(join(siteSrc, 'llms.txt'), 'utf8') + llmsPosts({ apps: decorated }))
fs.writeFileSync(join(docs, 'llms-full.txt'), llmsFullTxt({ apps: decorated, fantastic }))
// IndexNow (Bing, Yandex, Seznam…; Bing's index feeds ChatGPT search and Copilot):
// the key file must be served at the site root. Ping with `npm run indexnow` after a deploy.
const indexNowKey = fs.readFileSync(join(root, 'indexnow-key.txt'), 'utf8').trim()
fs.writeFileSync(join(docs, `${indexNowKey}.txt`), indexNowKey)

// 6) Custom domain for GitHub Pages.
if (fs.existsSync(join(root, 'CNAME'))) fs.copyFileSync(join(root, 'CNAME'), join(docs, 'CNAME'))

fs.rmSync(tmpDir, { recursive: true, force: true })
console.log(`[build-site] wrote ${written.length} pages:`)
written.forEach((p) => console.log(`  docs/${p}`))
console.log(`[build-site] ${posts.length} posts, ${indexable.length} URLs in sitemap.xml; assets, fonts, media and CNAME copied`)
