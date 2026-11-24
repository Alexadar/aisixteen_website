// Headless screenshots of the built site, for review. Needs a server on docs/:
//   PORT=4173 node scripts/serve-docs.mjs &   then   node scripts/screenshots.mjs <outDir> [baseURL]
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import { join } from 'node:path'

const out = process.argv[2] || 'tmp/screenshots'
const base = process.argv[3] || 'http://127.0.0.1:4173'
const only = process.argv[4]
// VIEWPORT=1: the first screen only (what a visitor sees before scrolling), not the full page.
const firstScreen = !!process.env.VIEWPORT
fs.mkdirSync(out, { recursive: true })
const SHOTS = [
  ['home', '/'],
  ['app-kerf-calc', '/kerf-calc/'],
  ['blog-index-kerf-calc', '/kerf-calc/blog/'],
  ['article-kerf-calc', '/kerf-calc/blog/feet-inch-fraction-math/'],
  ['fantastic', '/fantastic/'],
]
const VIEWS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } }
const browser = await chromium.launch()
for (const [name, path] of SHOTS) {
  if (only && !name.startsWith(only)) continue
  for (const [view, viewport] of Object.entries(VIEWS)) {
    for (const scheme of ['light', 'dark']) {
      if (firstScreen ? scheme !== 'light' || !['home', 'app-kerf-calc', 'article-kerf-calc'].includes(name) : name !== 'home' && !(view === 'desktop' && scheme === 'light') && !(view === 'mobile' && scheme === 'dark')) continue
      const ctx = await browser.newContext({ viewport, colorScheme: scheme, deviceScaleFactor: view === 'mobile' ? 2 : 1, reducedMotion: 'reduce' })
      const page = await ctx.newPage()
      const res = await page.goto(base + path, { waitUntil: 'load' })
      if (!res.ok()) { console.log(`skip ${path}: ${res.status()}`); await ctx.close(); continue }
      await page.evaluate(() => document.fonts.ready)
      // Load the lazy images so a full-page shot is complete.
      const h = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(40) }
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForLoadState('networkidle')
      const file = join(out, firstScreen ? `${name}-${view}.png` : `${name}-${view}-${scheme}.png`)
      await page.screenshot({ path: file, fullPage: !firstScreen })
      console.log(file)
      await ctx.close()
    }
  }
}
await browser.close()
