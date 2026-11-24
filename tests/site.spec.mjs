// SEO, structured data, links and accessibility of the built site (docs/), issue #3:
//  1. every page has one canonical URL, a unique title and description, and one <h1>;
//  2. every JSON-LD block parses; posts carry BlogPosting + BreadcrumbList (+ FAQPage that
//     mirrors the visible questions); no price and no rating in app or post schema;
//  3. sitemap.xml lists exactly the indexable pages, each with a lastmod; robots.txt names it;
//  4. no internal link, image, script or stylesheet points at something that is not there;
//  5. every post is in llms.txt and llms-full.txt;
//  6. no page scrolls sideways on a phone or a desktop;
//  7. the site is the one indigo theme whatever the OS asks for, and its text meets WCAG AA.
// 1–5 read the files in docs/ and run once (Chromium project); 6–7 run in every browser.
import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const docs = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs')
const ORIGIN = 'https://aisixteen.com'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (f.endsWith('.html')) out.push(p)
  }
  return out
}
const attr = (tag, name) => (new RegExp(`${name}="([^"]*)"`).exec(tag) || [])[1]
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
const textOf = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')

const pages = walk(docs).map((file) => {
  const html = fs.readFileSync(file, 'utf8')
  const rel = path.relative(docs, file).split(path.sep).join('/')
  const url = '/' + rel.replace(/index\.html$/, '')
  const head = html.slice(0, html.indexOf('</head>'))
  const metas = head.match(/<meta[^>]+>/g) || []
  const meta = (key) => { const m = metas.find((t) => attr(t, 'name') === key || attr(t, 'property') === key); return m ? decode(attr(m, 'content') || '') : undefined }
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  return {
    file, rel, url, html, meta,
    title: decode((/<title>([\s\S]*?)<\/title>/.exec(head) || [])[1] || ''),
    canonicals: (head.match(/<link rel="canonical"[^>]*>/g) || []).map((t) => attr(t, 'href')),
    robots: meta('robots') || '',
    jsonld,
    isPost: /^\/[a-z0-9-]+\/blog\/[a-z0-9-]+\/$/.test(url),
    isBlogIndex: /^\/[a-z0-9-]+\/blog\/$/.test(url),
  }
})
const indexable = pages.filter((p) => !p.robots.includes('noindex'))
const posts = pages.filter((p) => p.isPost)
const parseLd = (p) => p.jsonld.map((s) => JSON.parse(s))
const ofType = (p, type) => parseLd(p).filter((o) => o['@type'] === type)

const once = (info) => test.skip(info.project.name !== 'chromium', 'file checks run once')

test.describe('SEO: every page', () => {
  test.beforeEach(({}, info) => once(info))

  test('the build produced app pages, blog indexes and posts', () => {
    expect(posts.length).toBeGreaterThanOrEqual(8)
    expect(pages.filter((p) => p.isBlogIndex).length).toBeGreaterThanOrEqual(4)
  })

  test('has exactly one canonical, and it is its own URL', () => {
    for (const p of pages) {
      expect(p.canonicals.length, `${p.rel}: canonical count`).toBe(1)
      expect(p.canonicals[0], `${p.rel}: canonical is absolute`).toMatch(new RegExp(`^${ORIGIN}/`))
      if (!p.robots.includes('noindex')) expect(p.canonicals[0], `${p.rel}: canonical`).toBe(ORIGIN + p.url)
      else if (p.rel !== '404.html') { // redirect stub: canonical is the app page it points to
        const target = p.canonicals[0].slice(ORIGIN.length)
        expect(pages.some((q) => q.url === target && !q.robots.includes('noindex')), `${p.rel}: canonical target ${target} exists`).toBe(true)
      }
    }
  })

  test('has a unique title and description, one h1, lang and Open Graph', () => {
    const titles = new Map(), descs = new Map()
    for (const p of indexable) {
      expect(p.title.length, `${p.rel}: title length (${p.title})`).toBeGreaterThan(10)
      expect(p.title.length, `${p.rel}: title length (${p.title})`).toBeLessThanOrEqual(90)
      const d = p.meta('description')
      expect(d, `${p.rel}: meta description`).toBeTruthy()
      expect(d.length, `${p.rel}: description length`).toBeGreaterThan(50)
      expect(titles.has(p.title), `${p.rel}: title duplicates ${titles.get(p.title)}`).toBe(false)
      expect(descs.has(d), `${p.rel}: description duplicates ${descs.get(d)}`).toBe(false)
      titles.set(p.title, p.rel); descs.set(d, p.rel)
      expect((p.html.match(/<h1[\s>]/g) || []).length, `${p.rel}: h1 count`).toBe(1)
      expect(p.html, `${p.rel}: lang`).toContain('<html lang="en"')
      for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'twitter:card', 'twitter:image']) expect(p.meta(k), `${p.rel}: ${k}`).toBeTruthy()
      expect(p.meta('og:url'), `${p.rel}: og:url`).toBe(ORIGIN + p.url)
    }
  })

  test('every image has alt text and a reserved size', () => {
    for (const p of indexable) {
      for (const img of p.html.match(/<img[^>]*>/g) || []) {
        expect(img, `${p.rel}: ${img} needs an alt attribute`).toMatch(/\salt="/)
        expect(img, `${p.rel}: ${img} needs width and height`).toMatch(/\swidth="\d+"[^>]*\sheight="\d+"|\sheight="\d+"[^>]*\swidth="\d+"/)
      }
    }
  })

  test('headings do not skip a level', () => {
    for (const p of indexable) {
      const main = p.html.slice(p.html.indexOf('<main'), p.html.indexOf('</main>'))
      let prev = 0
      for (const m of main.matchAll(/<h([1-6])[\s>]/g)) {
        const level = Number(m[1])
        expect(level - prev, `${p.rel}: h${prev} is followed by h${level}`).toBeLessThanOrEqual(1)
        prev = level
      }
    }
  })
})

test.describe('structured data', () => {
  test.beforeEach(({}, info) => once(info))

  test('every JSON-LD block parses and names a schema.org type', () => {
    for (const p of pages) {
      for (const raw of p.jsonld) {
        let o
        expect(() => { o = JSON.parse(raw) }, `${p.rel}: JSON-LD parses`).not.toThrow()
        expect(o['@context'], `${p.rel}: @context`).toBe('https://schema.org')
        expect(o['@type'], `${p.rel}: @type`).toBeTruthy()
      }
      if (!p.robots.includes('noindex')) expect(p.jsonld.length, `${p.rel}: has JSON-LD`).toBeGreaterThan(0)
    }
  })

  test('posts: BlogPosting and a four-step BreadcrumbList that match the page', () => {
    for (const p of posts) {
      const [post] = ofType(p, 'BlogPosting')
      expect(post, `${p.rel}: BlogPosting`).toBeTruthy()
      const h1 = textOf((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(p.html) || [])[1] || '').trim()
      expect(post.headline, `${p.rel}: headline is the visible h1`).toBe(h1)
      expect(post.description).toBe(p.meta('description'))
      for (const k of ['datePublished', 'dateModified']) expect(post[k], `${p.rel}: ${k}`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(post.dateModified >= post.datePublished, `${p.rel}: modified is not before published`).toBe(true)
      expect(p.html, `${p.rel}: the published date is visible`).toContain(`<time dateTime="${post.datePublished}"`)
      expect(post.author?.name, `${p.rel}: author`).toBe('AISixteen')
      expect(textOf(p.html), `${p.rel}: the author is visible`).toContain('By AISixteen')
      expect(post.publisher?.name).toBe('AISixteen')
      expect(post.mainEntityOfPage['@id']).toBe(ORIGIN + p.url)
      expect(Array.isArray(post.image) && post.image.length > 0, `${p.rel}: image`).toBe(true)
      for (const img of post.image) expect(fs.existsSync(path.join(docs, img.slice(ORIGIN.length))), `${p.rel}: image file ${img}`).toBe(true)
      expect(p.meta('og:type')).toBe('article')
      expect(p.meta('article:published_time')).toBe(post.datePublished)
      expect(p.meta('apple-itunes-app'), `${p.rel}: Smart App Banner`).toMatch(/^app-id=\d+$/)

      const [crumbs] = ofType(p, 'BreadcrumbList')
      expect(crumbs, `${p.rel}: BreadcrumbList`).toBeTruthy()
      const items = crumbs.itemListElement
      expect(items.map((i) => i.position)).toEqual([1, 2, 3, 4])
      const app = p.url.split('/')[1]
      expect(items.map((i) => i.item)).toEqual([`${ORIGIN}/`, `${ORIGIN}/${app}/`, `${ORIGIN}/${app}/blog/`, ORIGIN + p.url])
      expect(items[3].name).toBe(h1)
    }
  })

  test('FAQPage questions and answers are visible on the page', () => {
    for (const p of indexable) {
      const text = textOf(p.html)
      for (const faq of ofType(p, 'FAQPage')) {
        expect(faq.mainEntity.length, `${p.rel}: FAQ has questions`).toBeGreaterThan(0)
        for (const q of faq.mainEntity) {
          expect(text, `${p.rel}: question is visible: ${q.name}`).toContain(q.name)
          expect(text, `${p.rel}: answer is visible: ${q.name}`).toContain(q.acceptedAnswer.text.slice(0, 60))
        }
      }
    }
  })

  test('app pages and posts assert no price and no rating', () => {
    for (const p of indexable.filter((q) => q.url !== '/fantastic/')) {
      const all = p.jsonld.join('\n')
      for (const banned of ['"offers"', '"price"', 'aggregateRating', '"review"', 'ratingValue']) expect(all, `${p.rel}: ${banned} in JSON-LD`).not.toContain(banned)
    }
    for (const p of indexable.filter((q) => q.url !== '/' && q.url !== '/fantastic/')) {
      const [app] = ofType(p, 'SoftwareApplication')
      if (p.isPost || p.isBlogIndex) continue
      expect(app, `${p.rel}: SoftwareApplication`).toBeTruthy()
      expect(app.operatingSystem, `${p.rel}: operatingSystem`).toMatch(/^iOS, iPadOS, macOS(, watchOS)?$/)
      expect(app.operatingSystem.includes('watchOS'), `${p.rel}: watchOS only when the page says Apple Watch`).toBe(/Apple Watch<\/span>|&amp; Apple Watch/.test(p.html))
      expect(p.meta('apple-itunes-app'), `${p.rel}: Smart App Banner`).toBe(`app-id=${app.installUrl.split('/id')[1]}`)
    }
  })

  test('the home page describes the organisation and the site', () => {
    const home = pages.find((p) => p.url === '/')
    const [org] = ofType(home, 'Organization')
    expect(org.logo.url).toBe(`${ORIGIN}/logo.png`)
    expect(org.sameAs.length).toBeGreaterThanOrEqual(2)
    expect(ofType(home, 'WebSite')[0].url).toBe(`${ORIGIN}/`)
  })
})

test.describe('sitemap, robots and AI files', () => {
  test.beforeEach(({}, info) => once(info))
  const sitemap = fs.readFileSync(path.join(docs, 'sitemap.xml'), 'utf8')
  const entries = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map((m) => ({ loc: m[1], lastmod: m[2] }))

  test('sitemap.xml lists exactly the indexable pages, each with a lastmod', () => {
    expect(entries.map((e) => e.loc).sort()).toEqual(indexable.map((p) => ORIGIN + p.url).sort())
    for (const e of entries) expect(e.lastmod, `${e.loc}: lastmod`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('a post\'s lastmod is its own dateModified', () => {
    for (const p of posts) {
      const e = entries.find((x) => x.loc === ORIGIN + p.url)
      expect(e, `${p.rel} is in the sitemap`).toBeTruthy()
      expect(e.lastmod).toBe(ofType(p, 'BlogPosting')[0].dateModified)
    }
  })

  test('robots.txt allows crawling and names the sitemap', () => {
    const robots = fs.readFileSync(path.join(docs, 'robots.txt'), 'utf8')
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`)
    expect(robots).not.toMatch(/^Disallow: \/\S*/m)
  })

  test('every post is in llms.txt and llms-full.txt', () => {
    const llms = fs.readFileSync(path.join(docs, 'llms.txt'), 'utf8')
    const full = fs.readFileSync(path.join(docs, 'llms-full.txt'), 'utf8')
    for (const p of posts) {
      expect(llms, `llms.txt lists ${p.url}`).toContain(ORIGIN + p.url)
      expect(full, `llms-full.txt has ${p.url}`).toContain(ORIGIN + p.url)
    }
  })
})

test.describe('internal links', () => {
  test.beforeEach(({}, info) => once(info))
  const exists = (urlPath) => {
    const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0])
    const f = path.join(docs, clean)
    if (!fs.existsSync(f)) return false
    return fs.statSync(f).isDirectory() ? fs.existsSync(path.join(f, 'index.html')) : true
  }

  test('no link, image, script or stylesheet is broken', () => {
    const byUrl = new Map(pages.map((p) => [p.url, p]))
    let checked = 0
    for (const p of pages) {
      for (const m of p.html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) {
        const ref = decode(m[1])
        if (/^(https?:|mailto:|data:)/.test(ref)) continue // external; this site's absolute URLs are checked below
        const [target, hash] = ref.startsWith('#') ? [p.url, ref.slice(1)] : ref.split('#')
        expect(target.startsWith('/'), `${p.rel}: ${ref} should be root-relative`).toBe(true)
        expect(exists(target), `${p.rel}: broken link ${ref}`).toBe(true)
        checked++
        if (hash && !/^t=/.test(hash)) {
          const dest = byUrl.get(target.split('?')[0])
          if (dest) expect(dest.html, `${p.rel}: no #${hash} on ${target}`).toMatch(new RegExp(`\\sid="${hash}"`))
        }
      }
      // Absolute URLs to this site (canonical, og:url, JSON-LD) must exist too.
      for (const m of p.html.matchAll(/https:\/\/aisixteen\.com(\/[^"'\s<)\\]*)/g)) {
        if (m[1] === '/404.html' || m[1].startsWith('/#')) continue
        expect(exists(m[1]), `${p.rel}: ${m[0]} does not exist in docs/`).toBe(true)
      }
    }
    expect(checked).toBeGreaterThan(500)
  })

  test('app pages, blog indexes and posts link to each other', () => {
    for (const p of posts) {
      const app = p.url.split('/')[1]
      expect(p.html, `${p.rel} links to its app page`).toContain(`href="/${app}/"`)
      expect(p.html, `${p.rel} links to its blog index`).toContain(`href="/${app}/blog/"`)
      expect(p.html, `${p.rel} links to the App Store`).toContain('href="https://apps.apple.com/app/id')
      const index = pages.find((q) => q.url === `/${app}/blog/`)
      expect(index.html, `/${app}/blog/ lists ${p.url}`).toContain(`href="${p.url}"`)
      const appPage = pages.find((q) => q.url === `/${app}/`)
      expect(appPage.html, `/${app}/ links to its blog`).toContain(`href="/${app}/blog/"`)
      const siblings = posts.filter((q) => q !== p && q.url.startsWith(`/${app}/blog/`))
      if (siblings.length) expect(siblings.some((s) => p.html.includes(`href="${s.url}"`)), `${p.rel} links to a related post`).toBe(true)
    }
    const home = pages.find((p) => p.url === '/')
    for (const i of pages.filter((p) => p.isBlogIndex)) expect(home.html, `home links to ${i.url}`).toContain(`href="${i.url}"`)
  })
})

/* ---------- in the browser ---------- */
const sample = ['/', '/kerf-calc/', '/earth-around/', '/kerf-calc/blog/', '/404.html', ...posts.map((p) => p.url)]
const isMobile = (info) => info.project.name.startsWith('mobile')

test.describe('layout: no sideways scroll', () => {
  test('home, app pages, blog indexes and every post', async ({ page }, info) => {
    test.slow()
    const widths = isMobile(info) ? [360, 390] : [360, 768, 1280, 1920]
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    for (const url of sample) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(url, { waitUntil: 'load' })
        const r = await page.evaluate(() => {
          window.scrollTo(99999, 0)
          const wide = [...document.querySelectorAll('main *')].filter((el) => {
            if (el.closest('.shots, .table-wrap, pre, .cmd, .term')) return false // these scroll inside their own box
            const b = el.getBoundingClientRect()
            return b.width > 0 && b.right > document.documentElement.clientWidth + 1
          }).slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`)
          return { scrollX: window.scrollX, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, wide }
        })
        expect.soft(r.scrollX, `${url} scrolls sideways at ${width}px`).toBe(0)
        expect.soft(r.sw, `${url} is wider than the screen at ${width}px`).toBeLessThanOrEqual(r.cw)
        expect.soft(r.wide, `${url}: elements past the right edge at ${width}px`).toEqual([])
      }
    }
    expect(errors, 'script errors').toEqual([])
  })
})

// WCAG 2.x AA: 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold). The background is
// the nearest painted ancestor colour, alpha-composited down to the page.
function contrastFailures(page) {
  return page.evaluate(() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 1
    const g = cv.getContext('2d', { willReadFrequently: true })
    const rgba = (css) => { g.clearRect(0, 0, 1, 1); g.fillStyle = '#000'; g.fillStyle = css; g.fillRect(0, 0, 1, 1); const d = g.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255] }
    const over = (top, under) => { const a = top[3]; return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)).concat(1) }
    const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]) }
    const bgOf = (el) => {
      const layers = []
      for (let n = el; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0) layers.push(c); if (c[3] === 1) break }
      let base = rgba(getComputedStyle(document.documentElement).backgroundColor)
      if (base[3] === 0) base = rgba(getComputedStyle(document.body).backgroundColor)
      for (const c of layers.reverse()) base = over(c, base)
      return base
    }
    const out = []
    const seen = new Set()
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.nodeValue.trim()) continue
      const el = node.parentElement
      if (!el || seen.has(el) || el.closest('script, style, noscript, [aria-hidden="true"], .sr-only, .skip')) continue
      seen.add(el)
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || !el.getClientRects().length) continue
      if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || cs.backgroundClip === 'text') continue // gradient text
      const bg = bgOf(el)
      const fg = over(rgba(cs.color), bg)
      const l1 = lum(fg), l2 = lum(bg)
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
      const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5
      if (ratio < need) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${node.nodeValue.trim().slice(0, 28)}" ${ratio.toFixed(2)} < ${need}`)
    }
    return [...new Set(out)].slice(0, 12)
  })
}

test.describe('contrast (WCAG AA)', () => {
  const urls = ['/', '/kerf-calc/', '/earth-around/', '/ephemeris-sky/', '/golden-ratio-calculator-lite/', '/kerf-calc/blog/', posts[0]?.url, '/404.html'].filter(Boolean)
  // One theme only: a visitor whose OS is set to light still gets the indigo site.
  for (const scheme of ['light', 'dark']) {
    test(`indigo theme, OS set to ${scheme}`, async ({ page }) => {
      test.slow()
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
      for (const url of urls) {
        await page.goto(url, { waitUntil: 'load' })
        await page.evaluate(() => document.fonts.ready)
        expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), `${url}: indigo ground`).toBe('rgb(11, 16, 32)')
        expect.soft(await contrastFailures(page), `${url}, OS ${scheme}`).toEqual([])
      }
    })
  }

  test('the contrast check itself can fail, and reads real text', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/kerf-calc/')
    expect(await contrastFailures(page)).toEqual([])
    const texts = await page.evaluate(() => document.querySelectorAll('main p, main h2, main li, main a').length)
    expect(texts).toBeGreaterThan(30)
    await page.evaluate(() => {
      document.querySelector('.app-hero__blurb').style.color = '#3a3d46' // dark grey on the dark ground
    })
    const bad = await contrastFailures(page)
    expect(bad.length, 'a low-contrast paragraph is reported').toBe(1)
    expect(bad[0]).toContain('app-hero__blurb')
  })

  test('there is no theme switch and no white variant', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await expect(page.locator('[data-theme-toggle]')).toHaveCount(0)
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark')
  })
})
