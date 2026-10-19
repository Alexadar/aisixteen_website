// Tell IndexNow engines (Bing → ChatGPT search and Copilot, Yandex, Seznam, Naver) that
// every sitemap URL changed. Run after a deploy is live: `npm run indexnow`.
import fs from 'node:fs'
const key = fs.readFileSync(new URL('../indexnow-key.txt', import.meta.url), 'utf8').trim()
const sitemap = fs.readFileSync(new URL('../docs/sitemap.xml', import.meta.url), 'utf8')
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'aisixteen.com', key, keyLocation: `https://aisixteen.com/${key}.txt`, urlList }),
})
console.log(`[indexnow] ${res.status} ${res.statusText} — ${urlList.length} URLs`)
if (!res.ok && res.status !== 202) process.exit(1)
