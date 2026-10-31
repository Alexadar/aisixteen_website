import { createHash } from 'node:crypto'
import { robotsTxt, llmsFullTxt } from './ai-files.mjs'
import { loadFoundations } from './foundations-data.mjs'
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
const { renderHome, renderLanding, renderNotFound, renderFantastic, renderTeam, renderFoundationsIndex, renderFoundationsPage, renderFoundationsComing, renderRedirect } = await import(pathToFileURL(bundlePath).href)
const { apps, featuredSlug } = await import(pathToFileURL(join(siteSrc, '..', 'data', 'apps.js')).href)
const { fantastic } = await import(pathToFileURL(join(siteSrc, '..', 'data', 'fantastic.js')).href)
// Foundations: the #443 tree (src/data/foundations/registry.json) and each article's own data
// file and clip manifest. Throws, listing every problem, on a missing file, caption or render.
const { team } = await import(pathToFileURL(join(siteSrc, '..', 'data', 'team.js')).href)
const F = await loadFoundations(root)

// 2) Decorate apps with build-time facts: a multi-device carousel that rotates through
//    EVERY platform's screenshots, each shown in the device frame designed for it.
//    A platform is only included when its screenshots' orientation matches its frame
//    (mac = landscape; iPad/iPhone = portrait) — so the two landscape games stay on Mac.
const PLATFORM_FRAME = { mac: 'mac', ipad: 'ipad', ios: 'iphone', watch: 'watch' }
const FRAME_IS_LANDSCAPE = { mac: true, ipad: false, iphone: false, watch: false }
const LANDSCAPE_GAMES = new Set(['skyscraper-frog', 'monstro-shooter'])
const PER_PLATFORM = 3 // screenshots per platform in the carousel
const isLandscape = (a, plat) => plat === 'mac' || ((plat === 'ios' || plat === 'ipad') && LANDSCAPE_GAMES.has(a.slug))

const decorated = apps.map((a) => {
  const folder = a.icon.split('/')[0]
  // Lead with the app's own device, then the remaining platforms.
  const order = [a.device, 'mac', 'ipad', 'ios', 'watch'].filter((p, i, arr) => arr.indexOf(p) === i)
  const slides = []
  for (const plat of order) {
    const dir = join(media, folder, plat)
    if (!fs.existsSync(dir)) continue
    const frame = PLATFORM_FRAME[plat]
    if (isLandscape(a, plat) !== FRAME_IS_LANDSCAPE[frame]) continue // orientation must fit the frame
    fs.readdirSync(dir)
      .filter((f) => /^screenshot_\d+\.(webp|png)$/i.test(f)).sort().slice(0, PER_PLATFORM)
      .forEach((f) => slides.push({ platform: plat, frame, src: `${folder}/${plat}/${f}` }))
  }
  if (slides.length === 0) slides.push({ platform: a.device, frame: PLATFORM_FRAME[a.device] || 'mac', src: a.screenshot })
  // Carousel height follows the tallest frame present (phone > ipad > mac).
  const frames = new Set(slides.map((s) => s.frame))
  const carouselSize = frames.has('iphone') ? 'phone' : frames.has('ipad') ? 'ipad' : 'mac'
  const previews = slides.map((s) => s.src)
  return { ...a, folder, slides, carouselSize, previews }
})
const featured = decorated.find((a) => a.slug === featuredSlug) || decorated[0]
const year = new Date().getFullYear()
// The build date: dateModified of the Foundations pages.
const buildDate = new Date().toISOString().slice(0, 10)

// 3) Fresh docs/ output.
fs.rmSync(docs, { recursive: true, force: true })
fs.mkdirSync(docs, { recursive: true })

// Cache-bust the shared assets: browsers keep them for an hour, so every page links them
// with a content hash and a deploy is picked up on the next page load.
const assetHash = createHash('sha256')
  .update(fs.readFileSync(join(siteSrc, 'site.css'))).update(fs.readFileSync(join(siteSrc, 'site.js')))
  .digest('hex').slice(0, 10)
const write = (rel, html) => {
  const out = join(docs, rel)
  fs.mkdirSync(dirname(out), { recursive: true })
  fs.writeFileSync(out, html.replace(/\/assets\/(site\.(?:css|js))"/g, `/assets/$1?v=${assetHash}"`))
  return rel
}

const written = []
written.push(write('index.html', renderHome(decorated, featured, { year, fantastic })))
for (const app of decorated) written.push(write(`${app.slug}/index.html`, renderLanding(app, decorated, { year, fantastic })))
written.push(write(`${fantastic.slug}/index.html`, renderFantastic(fantastic, { year })))
written.push(write(`${team.slug}/index.html`, renderTeam(team, { year })))
const fdOpts = { year, modified: buildDate }
written.push(write('fantastic/foundations/index.html', renderFoundationsIndex(F, fdOpts)))
for (const n of F.published) written.push(write(`${n.url.slice(1)}index.html`, renderFoundationsPage(F, n, fdOpts)))
for (const n of F.planned) written.push(write(`${n.url.slice(1)}index.html`, renderFoundationsComing(F, n, fdOpts)))
for (const r of F.redirects) written.push(write(`${r.from.slice(1)}index.html`, renderRedirect(r.to.url, r.to.title)))
written.push(write('404.html', renderNotFound({ year })))

// 4) Shared cached assets (one copy each).
fs.mkdirSync(join(docs, 'assets'), { recursive: true })
fs.copyFileSync(join(siteSrc, 'site.css'), join(docs, 'assets', 'site.css'))
fs.copyFileSync(join(siteSrc, 'site.js'), join(docs, 'assets', 'site.js'))
// AI-crawler summary served at /llms.txt
fs.copyFileSync(join(siteSrc, 'llms.txt'), join(docs, 'llms.txt'))

// 5) Media → docs root (matching the previous publicDir layout). Copy only what each
//    page references — icon, the single screenshot (og/fallback), and the device-platform
//    slideshow images — so docs stays lean (no unused platforms/stale media).
const copyMedia = (rel) => {
  const src = join(media, rel)
  if (!fs.existsSync(src)) return
  fs.mkdirSync(join(docs, dirname(rel)), { recursive: true })
  fs.copyFileSync(src, join(docs, rel))
}
for (const app of decorated) {
  copyMedia(app.icon)
  copyMedia(app.screenshot)
  app.previews.forEach(copyMedia)
}
copyMedia(fantastic.icon)
copyMedia(fantastic.video.src)
copyMedia(fantastic.video.poster)
// Foundations: every clip a published page shows (webm, webp poster) and each og.jpg.
F.mediaFiles.forEach(copyMedia)
if (fs.existsSync(join(media, 'logo.png'))) fs.copyFileSync(join(media, 'logo.png'), join(docs, 'logo.png'))

// Sitemap of every indexable page (redirect stubs and 404 excluded). No <lastmod>:
// a build date on every URL would be inaccurate, and Google ignores unreliable lastmod.
const indexable = ['', ...decorated.map((a) => `${a.slug}/`), `${fantastic.slug}/`, `${team.slug}/`,
  'fantastic/foundations/', ...F.published.map((n) => n.url.slice(1))]
fs.writeFileSync(join(docs, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>https://aisixteen.com/${p}</loc></url>`).join('\n')}
</urlset>
`)
fs.writeFileSync(join(docs, 'robots.txt'), robotsTxt())
fs.writeFileSync(join(docs, 'llms-full.txt'), llmsFullTxt({ apps: decorated, fantastic, team, foundations: F }))
// IndexNow (Bing, Yandex, Seznam…; Bing's index feeds ChatGPT search and Copilot):
// the key file must be served at the site root. Ping with `npm run indexnow` after a deploy.
const indexNowKey = fs.readFileSync(join(root, 'indexnow-key.txt'), 'utf8').trim()
fs.writeFileSync(join(docs, `${indexNowKey}.txt`), indexNowKey)

// 6) Custom domain for GitHub Pages.
if (fs.existsSync(join(root, 'CNAME'))) fs.copyFileSync(join(root, 'CNAME'), join(docs, 'CNAME'))

fs.rmSync(tmpDir, { recursive: true, force: true })
console.log(`[build-site] wrote ${written.length} pages:`)
written.forEach((p) => console.log(`  docs/${p}`))
console.log(`[build-site] assets/site.css, assets/site.js, media/, CNAME copied`)
