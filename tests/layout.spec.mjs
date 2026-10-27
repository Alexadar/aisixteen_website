// Stable layout, in every browser:
//  1. no page can be scrolled sideways, at any common width;
//  2. nothing moves once the page has loaded (reveals, the reel, the video);
//  3. the /fantastic/ reel keeps one size on every slide, and its drawings stay inside it;
//  4. no script errors.
// Positions are layout positions (offsetTop chain), so CSS transforms and animations,
// which never move layout, do not count; only real reflow does.
import fs from 'node:fs'
import { test, expect } from '@playwright/test'

// Foundations pages come from the registry, so every published page is covered as it is added.
const REG = JSON.parse(fs.readFileSync(new URL('../src/data/foundations/registry.json', import.meta.url), 'utf8'))
const FD = '/fantastic/foundations/'
const urlOf = (n) => `${FD}${n.path}/`
const kidsOf = (n) => REG.nodes.filter((m) => m.parent === n.key).sort((a, b) => a.order - b.order)
const dfs = (list) => list.flatMap((n) => [n, ...dfs(kidsOf(n))])
const TREE = dfs(REG.nodes.filter((n) => n.parent == null).sort((a, b) => a.order - b.order))
const PUBLISHED = TREE.filter((n) => n.status === 'published')
const PLANNED = TREE.filter((n) => n.status === 'planned')
const READING = [FD, ...PUBLISHED.map(urlOf)] // previous/next order
const FOUNDATIONS = READING
const REDIRECTS = Object.entries(REG.redirects || {}).map(([from, to]) => [`${FD}${from}/`, `${FD}${to}/`])
const PAGES = ['/', '/fantastic/', ...FOUNDATIONS, ...PLANNED.slice(0, 1).map(urlOf), '/aircore/', '/404.html']
const isMobile = (info) => info.project.name.startsWith('mobile')
const widthsFor = (info) => (isMobile(info) ? [360, 390, 430] : [360, 390, 768, 1024, 1280, 1440, 1920])

async function ready(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(150)
}

// The layout box of every major block: main's sections, the footer, the reel.
function layoutSnapshot(page) {
  return page.evaluate(() => {
    const pos = (el) => { let y = 0, x = 0; for (let n = el; n; n = n.offsetParent) { y += n.offsetTop; x += n.offsetLeft } return { x, y } }
    const els = [...document.querySelectorAll('main > *, footer, .fl-reel__stage, .fl-reel__bar, .fl-hero__video video, .fd-menu, .fd-video, .fd-caption')]
    return {
      docHeight: document.documentElement.scrollHeight,
      boxes: els.map((el, i) => ({ key: `${i}:${el.tagName.toLowerCase()}.${(typeof el.className === 'string' ? el.className : '').split(' ')[0]}`, ...pos(el), w: el.offsetWidth, h: el.offsetHeight })),
    }
  })
}

function expectSameLayout(before, after, label) {
  expect.soft(Math.abs(after.docHeight - before.docHeight), `${label}: page height`).toBeLessThanOrEqual(1)
  expect(after.boxes.length, `${label}: same blocks`).toBe(before.boxes.length)
  before.boxes.forEach((b, i) => {
    const a = after.boxes[i]
    for (const k of ['x', 'y', 'w', 'h']) expect.soft(Math.abs(a[k] - b[k]), `${label}: ${b.key} ${k} moved`).toBeLessThanOrEqual(1)
  })
}

test.describe('no sideways scroll', () => {
  for (const path of PAGES) {
    test(path, async ({ page }, info) => {
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      for (const width of widthsFor(info)) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path, { waitUntil: 'load' })
        await ready(page)
        const r = await page.evaluate(() => {
          window.scrollTo(99999, window.scrollY)
          return { scrollX: window.scrollX, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }
        })
        expect.soft(r.scrollX, `${path} scrolls sideways at ${width}px`).toBe(0)
        expect.soft(r.sw, `${path} is wider than the screen at ${width}px`).toBeLessThanOrEqual(r.cw)
      }
      expect(errors, `${path}: script errors`).toEqual([])
    })
  }
})

test.describe('nothing moves after load', () => {
  for (const path of ['/', '/fantastic/', ...FOUNDATIONS]) {
    test(path, async ({ page }, info) => {
      for (const width of isMobile(info) ? [390] : [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path, { waitUntil: 'load' })
        await ready(page)
        const before = await layoutSnapshot(page)
        // Let the page's own scripts run: scroll through (reveals fire), let the reel play.
        const height = before.docHeight
        for (let y = 0; y < height; y += 450) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60) }
        if (path === '/fantastic/') { await page.locator('#family').scrollIntoViewIfNeeded(); await page.waitForTimeout(2500) }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(1200)
        expectSameLayout(before, await layoutSnapshot(page), `${path} at ${width}px`)
      }
    })
  }

  test('the hero video reserves its 2:1 box before it loads', async ({ page }) => {
    await page.goto('/fantastic/', { waitUntil: 'domcontentloaded' })
    const r = await page.locator('.fl-hero__video video').evaluate((v) => ({ w: v.offsetWidth, h: v.offsetHeight }))
    expect(Math.abs(r.w / 2 - r.h)).toBeLessThanOrEqual(2)
  })
})

test.describe('the /fantastic/ reel', () => {
  test('keeps one size on every slide, with motion', async ({ page }, info) => {
    for (const width of isMobile(info) ? [390] : [390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/fantastic/', { waitUntil: 'load' })
      await ready(page)
      await page.locator('#family').scrollIntoViewIfNeeded()
      const tabs = page.locator('.fl-reel__tab')
      const n = await tabs.count()
      expect(n).toBe(4)
      const sizes = []
      for (let i = 0; i < n; i++) {
        await tabs.nth(i).click()
        await page.mouse.move(1, 1)
        await page.waitForTimeout(1100) // the morph takes 0.8s
        await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true')
        sizes.push(await layoutSnapshot(page))
      }
      sizes.slice(1).forEach((s, i) => expectSameLayout(sizes[0], s, `slide ${i + 2} vs slide 1 at ${width}px`))
    }
  })

  test.describe('at rest (reduced motion)', () => {
    test('every drawing and its copy stay inside the slide', async ({ page }, info) => {
      // At rest every drawing shows its finished state, so this measures layout, not a frame
      // of an entrance animation.
      await page.emulateMedia({ reducedMotion: 'reduce' })
      for (const width of isMobile(info) ? [360, 430] : [360, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto('/fantastic/', { waitUntil: 'load' })
        await ready(page)
        const tabs = page.locator('.fl-reel__tab')
        for (let i = 0; i < 4; i++) {
          await tabs.nth(i).click()
          await page.waitForTimeout(200)
          const bad = await page.evaluate(() => {
            if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return ['reduced motion is not on']
            const stage = document.querySelector('.fl-reel__stage').getBoundingClientRect()
            const slide = document.querySelector('.fl-reel__slide.is-active')
            const out = []
            for (const el of slide.querySelectorAll('*')) {
              const r = el.getBoundingClientRect()
              if (!r.width || !r.height) continue
              if (r.left < stage.left - 1 || r.right > stage.right + 1 || r.top < stage.top - 1 || r.bottom > stage.bottom + 1) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`)
            }
            for (const el of slide.querySelectorAll('.fl-reel__title, .fl-reel__text, .fl-reel__steps li'))
              if (el.scrollWidth > el.clientWidth + 1) out.push(`clipped text: ${el.textContent.slice(0, 30)}`)
            return out.slice(0, 5)
          })
          expect.soft(bad, `slide ${i + 1} at ${width}px`).toEqual([])
        }
      }
    })
  })
})

// /fantastic/foundations/: the blog shell, the menu tree, the pages and their Manim clips.
test.describe('foundations', () => {
  const deep = PUBLISHED.find((n) => n.path.split('/').length >= 3) || PUBLISHED[PUBLISHED.length - 1]
  const ancestorsOf = (n) => { const out = []; for (let p = REG.nodes.find((m) => m.key === n.parent); p; p = REG.nodes.find((m) => m.key === p.parent)) out.unshift(p); return out }

  test('the menu tree: left at desktop width, a top menu on phones; current branch open', async ({ page }, info) => {
    for (const n of [PUBLISHED[0], deep]) {
      for (const width of isMobile(info) ? [360, 390] : [390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(urlOf(n), { waitUntil: 'load' })
        await ready(page)
        const desktop = width > 960
        const nav = desktop ? '.fd-menu' : '.fd-topnav'
        if (!desktop) {
          await expect(page.locator('.fd-menu')).toBeHidden()
          const bar = await page.locator('.fd-topnav').boundingBox()
          const art = await page.locator('.fd-article').boundingBox()
          expect(bar.y + bar.height, `top menu above the article at ${width}px`).toBeLessThanOrEqual(art.y + 1)
          await expect(page.locator('.fd-topnav__here')).toHaveText(n.short)
          await page.locator('.fd-topnav__bar').click()
        } else {
          await expect(page.locator('.fd-topnav')).toBeHidden()
          const m = await page.locator('.fd-menu').boundingBox()
          const art = await page.locator('.fd-article').boundingBox()
          expect(m.x + m.width, `menu left of the article at ${width}px`).toBeLessThanOrEqual(art.x)
          expect(await page.locator('.fd-menu').evaluate((el) => getComputedStyle(el).position)).toBe('sticky')
        }
        const cur = page.locator(`${nav} .fd-node [aria-current="page"]`)
        await expect(cur).toHaveCount(1)
        await expect(cur).toBeVisible()
        await expect(cur).toHaveAttribute('href', urlOf(n))
        // every ancestor's branch is open; a pillar outside the branch is closed
        for (const a of ancestorsOf(n)) await expect(page.locator(`${nav} .fd-node:has(> a[href="${urlOf(a)}"]) > details`)).toHaveAttribute('open', '')
        const other = PUBLISHED.find((p) => p.parent == null && p.key !== (ancestorsOf(n)[0] || n).key)
        expect(await page.locator(`${nav} .fd-node:has(> a[href="${urlOf(other)}"]) > details`).evaluate((d) => d.open)).toBe(false)
        // every node of the tree is in the menu, planned ones marked
        expect(await page.locator(`${nav} .fd-node`).count()).toBe(TREE.length)
        expect(await page.locator(`${nav} .fd-node.is-planned`).count()).toBe(PLANNED.length)
      }
    }
  })

  test('the tree opens and closes without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(urlOf(PUBLISHED[0]), { waitUntil: 'load' })
    const other = PUBLISHED.filter((p) => p.parent == null)[1]
    const details = page.locator(`.fd-menu .fd-node:has(> a[href="${urlOf(other)}"]) > details`)
    expect(await details.evaluate((d) => d.open)).toBe(false)
    await details.locator('> summary').click()
    expect(await details.evaluate((d) => d.open)).toBe(true)
    await expect(details.locator('.fd-node__link').first()).toBeVisible()
    await ctx.close()
  })

  test('each page: one h1, an h2 per section, previous and next in reading order', async ({ page }) => {
    for (const [i, path] of READING.entries()) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(await page.locator('h1').count(), path).toBe(1)
      expect(await page.locator('.fd-section > h2').count(), path).toBe(await page.locator('.fd-section').count())
      const prev = page.locator('.fd-pager a[rel="prev"]')
      if (i > 0) await expect(prev, path).toHaveAttribute('href', READING[i - 1])
      else await expect(prev).toHaveCount(0)
      const next = page.locator('.fd-pager a[rel="next"]')
      if (i < READING.length - 1) await expect(next, path).toHaveAttribute('href', READING[i + 1])
      else await expect(page.locator('.fd-pager__link--next')).toHaveAttribute('href', '/fantastic/')
    }
  })

  test('pillar and section pages link to all their children', async ({ page }) => {
    for (const n of PUBLISHED.filter((p) => kidsOf(p).length)) {
      await page.goto(urlOf(n), { waitUntil: 'domcontentloaded' })
      const hrefs = await page.locator('#in-this-part .fd-kids a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
      expect(hrefs, urlOf(n)).toEqual(kidsOf(n).map(urlOf))
    }
    await page.goto(FD, { waitUntil: 'domcontentloaded' })
    const pillars = await page.locator('.fd-card__title a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    expect(pillars).toEqual(TREE.filter((n) => n.parent == null).map(urlOf))
  })

  test('every clip reserves its 16:9 box before it loads, and its files exist', async ({ page, request }) => {
    for (const n of PUBLISHED) {
      const path = urlOf(n)
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const vids = await page.locator('.fd-video').evaluateAll((vs) => vs.map((v) => ({
        w: v.offsetWidth, h: v.offsetHeight, poster: v.getAttribute('poster'), label: v.getAttribute('aria-label'),
        srcs: [...v.querySelectorAll('source')].map((s) => s.getAttribute('src')),
      })))
      if (kidsOf(n).length) expect(vids.length, `${path}: a pillar or section shows one clip`).toBeGreaterThanOrEqual(1)
      else {
        expect(vids.length, `${path}: 3 to 5 clips`).toBeGreaterThanOrEqual(3)
        expect(vids.length).toBeLessThanOrEqual(5)
      }
      for (const v of vids) {
        expect(Math.abs(v.w * 9 / 16 - v.h), `${v.poster}: 16:9`).toBeLessThanOrEqual(2)
        expect(v.label).toMatch(/^Animation: /)
        for (const url of [v.poster, ...v.srcs]) expect((await request.get(url)).status(), url).toBe(200)
      }
    }
  })

  test('reduced motion: nothing plays; posters and play buttons show', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(urlOf(deep), { waitUntil: 'load' })
    await ready(page)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(50) }
    const r = await page.locator('.fd-video').evaluateAll((vs) => vs.map((v) => v.paused))
    expect(r.every(Boolean), 'no clip autoplays').toBe(true)
    const buttons = await page.locator('.fd-toggle').evaluateAll((bs) => bs.map((b) => getComputedStyle(b).visibility + ' ' + b.getAttribute('aria-label')))
    buttons.forEach((b) => expect(b).toMatch(/^visible Play the animation: /))
  })

  test('structured data: TechArticle, the full BreadcrumbList and a VideoObject per clip', async ({ page, request }) => {
    for (const n of PUBLISHED) {
      const path = urlOf(n)
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((ss) => ss.map((s) => JSON.parse(s.textContent)))
      const article = ld.find((o) => o['@type'] === 'TechArticle')
      expect(article.headline, path).toBeTruthy()
      expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      const crumbs = ld.find((o) => o['@type'] === 'BreadcrumbList').itemListElement
      const chain = [...ancestorsOf(n), n]
      expect(crumbs.map((c) => c.item), `${path}: breadcrumb is the full tree path`).toEqual([
        'https://aisixteen.com/', 'https://aisixteen.com/fantastic/', `https://aisixteen.com${FD}`, ...chain.map((c) => `https://aisixteen.com${urlOf(c)}`)])
      const clips = ld.filter((o) => o['@type'] === 'VideoObject')
      const ids = new Set(clips.map((c) => c['@id']))
      expect(ids.size).toBe(new Set(await page.locator('.fd-video source[type="video/mp4"]').evaluateAll((ss) => ss.map((s) => s.getAttribute('src')))).size)
      for (const ref of article.video) expect(ids.has(ref['@id']), `${path}: ${ref['@id']} is a VideoObject`).toBe(true)
      for (const c of clips) {
        for (const k of ['name', 'description', 'thumbnailUrl', 'contentUrl', 'uploadDate', 'duration']) expect(c[k], `${path} ${c.name}: ${k}`).toBeTruthy()
        expect(c.duration).toMatch(/^PT(\d+M)?\d+S$/)
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://aisixteen.com${path}`)
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index/)
      for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
        const img = await page.locator(sel).getAttribute('content')
        expect((await request.get(img.replace('https://aisixteen.com', ''))).status(), `${path} ${sel}`).toBe(200)
      }
      for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[name="twitter:card"]']) await expect(page.locator(sel)).toHaveCount(1)
    }
  })

  test('planned pages: a noindex placeholder, marked in the menu', async ({ page }) => {
    // with nothing planned, this is vacuous
    for (const n of PLANNED.length ? [PLANNED[0], PLANNED[PLANNED.length - 1]] : []) {
      const r = await page.goto(urlOf(n), { waitUntil: 'domcontentloaded' })
      expect(r.status()).toBe(200)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
      expect(await page.locator('h1').count()).toBe(1)
      await expect(page.locator('.fd-menu .fd-node.is-planned > a[aria-current="page"]')).toHaveCount(1)
    }
  })

  test('old URLs redirect to their new place', async ({ page, request }) => {
    for (const [from, to] of REDIRECTS) {
      const html = await (await request.get(from)).text()
      expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${to}">`)
      expect(html).toContain(`<link rel="canonical" href="https://aisixteen.com${to}">`)
      expect(html).toContain('<meta name="robots" content="noindex, follow">')
      await page.goto(from)
      await page.waitForURL(`**${to}`)
      expect(new URL(page.url()).pathname).toBe(to)
    }
  })

  test('the sitemap and llms-full.txt list every published page, and no planned page', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const llms = await (await request.get('/llms-full.txt')).text()
    for (const path of FOUNDATIONS) {
      expect(sitemap).toContain(`<loc>https://aisixteen.com${path}</loc>`)
      expect(llms).toContain(`https://aisixteen.com${path}`)
    }
    for (const path of [...PLANNED.map(urlOf), ...REDIRECTS.map(([from]) => from)]) {
      expect(sitemap, path).not.toContain(`<loc>https://aisixteen.com${path}</loc>`)
      const exact = new RegExp(`https://aisixteen\\.com${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`)
      expect(llms, path).not.toMatch(exact)
    }
  })
})
