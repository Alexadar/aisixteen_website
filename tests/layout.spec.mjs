// Stable layout, in every browser:
//  1. no page can be scrolled sideways, at any common width;
//  2. nothing moves once the page has loaded (reveals, the reel, the video);
//  3. the /fantastic/ reel keeps one size on every slide, and its drawings stay inside it;
//  4. no script errors.
// Positions are layout positions (offsetTop chain), so CSS transforms and animations,
// which never move layout, do not count; only real reflow does.
import { test, expect } from '@playwright/test'

const FOUNDATIONS = ['/fantastic/foundations/', '/fantastic/foundations/kernel/', '/fantastic/foundations/context-folding/']
const PAGES = ['/', '/fantastic/', ...FOUNDATIONS, '/aircore/', '/404.html']
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

// /fantastic/foundations/: the blog shell, the articles and their Manim clips.
test.describe('foundations', () => {
  test('menu on the left at desktop width, a top row on phones', async ({ page }, info) => {
    for (const width of isMobile(info) ? [360, 390] : [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/fantastic/foundations/kernel/', { waitUntil: 'load' })
      await ready(page)
      const r = await page.evaluate(() => {
        const m = document.querySelector('.fd-menu').getBoundingClientRect()
        const a = document.querySelector('.fd-article').getBoundingClientRect()
        const cur = document.querySelector('.fd-menu [aria-current="page"]')
        return { m: { l: m.left, r: m.right, t: m.top, b: m.bottom }, a: { l: a.left, t: a.top }, current: cur && cur.textContent, sticky: getComputedStyle(document.querySelector('.fd-menu')).position }
      })
      expect(r.current, `current article marked at ${width}px`).toContain('Kernel')
      if (width > 960) {
        expect(r.m.r, `menu left of the article at ${width}px`).toBeLessThanOrEqual(r.a.l)
        expect(r.sticky).toBe('sticky')
      } else {
        expect(r.m.b, `menu above the article at ${width}px`).toBeLessThanOrEqual(r.a.t + 1)
      }
    }
  })

  test('each article: one h1, an h2 per section, previous and next links', async ({ page }) => {
    for (const path of FOUNDATIONS.slice(1)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(await page.locator('h1').count()).toBe(1)
      const h2 = await page.locator('.fd-section > h2').count()
      expect(h2).toBe(await page.locator('.fd-section').count())
      expect(await page.locator('.fd-pager a').count()).toBe(2)
    }
    await page.goto('/fantastic/foundations/kernel/')
    await expect(page.locator('.fd-pager a[rel="next"]')).toHaveAttribute('href', '/fantastic/foundations/context-folding/')
    await page.goto('/fantastic/foundations/context-folding/')
    await expect(page.locator('.fd-pager a[rel="prev"]')).toHaveAttribute('href', '/fantastic/foundations/kernel/')
  })

  test('every clip reserves its 16:9 box before it loads, and its files exist', async ({ page, request }) => {
    for (const path of FOUNDATIONS.slice(1)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const vids = await page.locator('.fd-video').evaluateAll((vs) => vs.map((v) => ({
        w: v.offsetWidth, h: v.offsetHeight, poster: v.getAttribute('poster'), label: v.getAttribute('aria-label'),
        srcs: [...v.querySelectorAll('source')].map((s) => s.getAttribute('src')),
      })))
      expect(vids.length, `${path}: 3 to 5 clips`).toBeGreaterThanOrEqual(3)
      expect(vids.length).toBeLessThanOrEqual(5)
      for (const v of vids) {
        expect(Math.abs(v.w * 9 / 16 - v.h), `${v.poster}: 16:9`).toBeLessThanOrEqual(2)
        expect(v.label).toMatch(/^Animation: /)
        for (const url of [v.poster, ...v.srcs]) expect((await request.get(url)).status(), url).toBe(200)
      }
    }
  })

  test('reduced motion: nothing plays; posters and play buttons show', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/fantastic/foundations/context-folding/', { waitUntil: 'load' })
    await ready(page)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(50) }
    const r = await page.locator('.fd-video').evaluateAll((vs) => vs.map((v) => v.paused))
    expect(r.every(Boolean), 'no clip autoplays').toBe(true)
    const buttons = await page.locator('.fd-toggle').evaluateAll((bs) => bs.map((b) => getComputedStyle(b).visibility + ' ' + b.getAttribute('aria-label')))
    buttons.forEach((b) => expect(b).toMatch(/^visible Play the animation: /))
  })

  test('structured data: TechArticle, BreadcrumbList and a VideoObject per clip', async ({ page }) => {
    for (const path of FOUNDATIONS.slice(1)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((ss) => ss.map((s) => JSON.parse(s.textContent)))
      const types = ld.map((o) => o['@type'])
      const article = ld.find((o) => o['@type'] === 'TechArticle')
      expect(article.headline).toBeTruthy()
      expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(types).toContain('BreadcrumbList')
      const clips = ld.filter((o) => o['@type'] === 'VideoObject')
      expect(clips.length).toBe(await page.locator('.fd-video').count())
      for (const c of clips) {
        for (const k of ['name', 'description', 'thumbnailUrl', 'contentUrl', 'uploadDate', 'duration']) expect(c[k], `${path} ${c.name}: ${k}`).toBeTruthy()
        expect(c.duration).toMatch(/^PT(\d+M)?\d+S$/)
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://aisixteen.com${path}`)
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
    }
  })

  test('the sitemap and llms-full.txt list every Foundations page', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const llms = await (await request.get('/llms-full.txt')).text()
    for (const path of FOUNDATIONS) {
      expect(sitemap).toContain(`<loc>https://aisixteen.com${path}</loc>`)
      expect(llms).toContain(`https://aisixteen.com${path}`)
    }
  })
})
