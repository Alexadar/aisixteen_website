// Stable layout, in every browser:
//  1. no page can be scrolled sideways, at any common width;
//  2. nothing moves once the page has loaded (reveals, the reel, the video);
//  3. the /fantastic/ reel keeps one size on every slide, and its drawings stay inside it;
//  4. no script errors.
// Positions are layout positions (offsetTop chain), so CSS transforms and animations,
// which never move layout, do not count; only real reflow does.
import { test, expect } from '@playwright/test'

const PAGES = ['/', '/fantastic/', '/aircore/', '/404.html']
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
    const els = [...document.querySelectorAll('main > *, footer, .fl-reel__stage, .fl-reel__bar, .fl-hero__video video')]
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
  for (const path of ['/', '/fantastic/']) {
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
