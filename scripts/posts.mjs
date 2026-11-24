// Per-app blog posts: content/<app-slug>/<post-slug>.md → post objects the shared layout
// renders (issue #3). One renderer for every app; a post is only data.
//
// A post file is front matter plus Markdown:
//   ---
//   title: How to …?                 (the H1 and the BlogPosting headline)
//   description: …                   (meta description, ≤ 160 characters)
//   date: 2026-11-24                 (first published; the real date, never the build date)
//   updated: 2026-11-24              (optional; last real edit)
//   answer: …                        (the direct answer, shown first under the title)
//   ---
// A `## Frequently asked questions` section whose questions are `###` headings becomes the
// FAQPage structured data, so the JSON-LD always mirrors the visible text.
import fs from 'node:fs'
import { join } from 'node:path'
import { marked } from 'marked'

const slugify = (s) => s.toLowerCase().replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const plain = (tokens) => tokens.map((t) => (t.tokens ? plain(t.tokens) : t.type === 'list' ? t.items.map((i) => plain(i.tokens)).join(' ') : t.type === 'space' ? ' ' : t.text ?? t.raw ?? '')).join('')
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

function frontMatter(src, file) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(src)
  if (!m) throw new Error(`${file}: missing front matter`)
  const meta = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  for (const k of ['title', 'description', 'date', 'answer']) if (!meta[k]) throw new Error(`${file}: front matter needs "${k}"`)
  if (meta.description.length > 165) throw new Error(`${file}: description is ${meta.description.length} characters (max 165)`)
  return { meta, body: m[2] }
}

export function loadPosts({ contentDir, apps, origin, imageSize }) {
  const out = []
  if (!fs.existsSync(contentDir)) return out
  for (const dir of fs.readdirSync(contentDir).sort()) {
    const app = apps.find((a) => a.slug === dir)
    if (!fs.statSync(join(contentDir, dir)).isDirectory()) continue
    if (!app) throw new Error(`content/${dir}: no app with that slug ("no new": posts are for apps already on the site)`)
    for (const file of fs.readdirSync(join(contentDir, dir)).filter((f) => f.endsWith('.md')).sort()) {
      const slug = file.replace(/\.md$/, '')
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`content/${dir}/${file}: slug must be lowercase words joined by hyphens`)
      const { meta, body } = frontMatter(fs.readFileSync(join(contentDir, dir, file), 'utf8'), `content/${dir}/${file}`)
      const tokens = marked.lexer(body)

      // FAQ pairs, from the visible section.
      const faqs = []
      let inFaq = false
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i]
        if (t.type === 'heading' && t.depth === 2) inFaq = /^(faq|frequently asked questions)/i.test(t.text)
        else if (inFaq && t.type === 'heading' && t.depth === 3) {
          const ans = []
          for (let k = i + 1; k < tokens.length && tokens[k].type !== 'heading'; k++) ans.push(tokens[k])
          faqs.push({ q: unescape(plain(t.tokens)), a: unescape(plain(ans)).replace(/\s+/g, ' ').trim() })
        }
      }

      const toc = []
      const used = new Set()
      let html = marked.parser(tokens)
      html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, d, inner) => {
        let id = slugify(inner.replace(/<[^>]+>/g, '')) || 'section'
        while (used.has(id)) id += '-2'
        used.add(id)
        if (d === '2') toc.push({ id, text: unescape(inner.replace(/<[^>]+>/g, '')) })
        return `<h${d} id="${id}">${inner}</h${d}>`
      })
      // Wide tables scroll inside their own box, never the page.
      html = html.replace(/<table>/g, '<div class="table-wrap" tabindex="0" role="group" aria-label="Table"><table>').replace(/<\/table>/g, '</table></div>')
      // External links open in a new tab; internal ones stay root-relative.
      html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) => (href.startsWith(origin) ? `<a href="${href.slice(origin.length) || '/'}"` : `${m} target="_blank" rel="noopener"`))
      // Images: a figure with intrinsic size (no layout shift), lazy-loaded. Title = caption.
      const images = []
      html = html.replace(/<p><img src="\/([^"]+)" alt="([^"]*)"(?: title="([^"]*)")?\s*\/?><\/p>/g, (_, src, alt, title) => {
        const { w, h } = imageSize(src)
        if (!alt) throw new Error(`content/${dir}/${file}: image ${src} needs alt text`)
        images.push(src)
        return `<figure class="figure"><img src="/${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async">${title ? `<figcaption>${title}</figcaption>` : ''}</figure>`
      })
      if (/<img(?![^>]*width=)/.test(html)) throw new Error(`content/${dir}/${file}: put each image on its own line, with a root-relative /media path`)

      const words = plain(tokens).split(/\s+/).filter(Boolean).length
      out.push({
        slug, app, title: meta.title, description: meta.description, answer: meta.answer,
        date: meta.date, updated: meta.updated || meta.date,
        url: `/${app.slug}/blog/${slug}/`, html, toc, faqs, images, words, minutes: Math.max(2, Math.round(words / 220)),
        text: body.trim(),
      })
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}
