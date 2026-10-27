// Foundations (/fantastic/foundations/): loads the tree from src/data/foundations/registry.json
// and every article's own data file, resolves every clip, and fails loudly on anything missing.
//
//   registry.json               the whole #443 tree: key, path, title, short, parent, order, status
//   articles/<key>.js           one file per article: text blocks, sources, its own clips' captions
//   clips/<key>.json            render manifest per article (duration, size), written by anim/render.py
//   media/fantastic/foundations/<path>/<clip>.{mp4,webm,webp} and og.jpg   the rendered files
//
// A published node must have an article file that is not a seed, every clip it shows must be
// rendered, and its cover clip's article folder must hold og.jpg. Planned nodes get a noindex
// "coming" page (no 404s from the menu) and never reach the sitemap or llms-full.txt.
import fs from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export const BASE = '/fantastic/foundations/'
const STATUSES = new Set(['published', 'planned'])

export async function loadFoundations(root) {
  const dir = join(root, 'src', 'data', 'foundations')
  const media = join(root, 'media')
  const reg = JSON.parse(fs.readFileSync(join(dir, 'registry.json'), 'utf8'))
  const errors = []
  const fail = (m) => errors.push(m)

  // 1) The tree.
  const byKey = new Map()
  const nodes = reg.nodes.map((raw) => ({ ...raw, children: [] }))
  for (const n of nodes) {
    if (byKey.has(n.key)) fail(`duplicate key ${n.key}`)
    byKey.set(n.key, n)
    if (n.key !== n.path.replace(/[/-]/g, '_')) fail(`${n.key}: key must be the path with / and - as _ (${n.path})`)
    if (!STATUSES.has(n.status)) fail(`${n.key}: status must be published or planned`)
    for (const k of ['title', 'short']) if (!n[k]) fail(`${n.key}: no ${k}`)
    n.url = `${BASE}${n.path}/`
  }
  for (const n of nodes) {
    if (n.parent == null) { if (n.path.includes('/')) fail(`${n.key}: a top-level node has a one-segment path`); continue }
    const p = byKey.get(n.parent)
    if (!p) { fail(`${n.key}: unknown parent ${n.parent}`); continue }
    if (n.path !== `${p.path}/${n.path.split('/').pop()}`) fail(`${n.key}: path must be under ${p.path}/`)
    p.children.push(n)
  }
  const byOrder = (a, b) => a.order - b.order
  const roots = nodes.filter((n) => n.parent == null).sort(byOrder)
  nodes.forEach((n) => n.children.sort(byOrder))
  const walk = (list, ancestors, out) => {
    for (const n of list) {
      n.ancestors = ancestors
      n.depth = ancestors.length
      n.pillar = ancestors[0] || n
      out.push(n)
      walk(n.children, [...ancestors, n], out)
    }
    return out
  }
  const all = walk(roots, [], []) // depth-first: the reading order

  // 2) Article files and render manifests (any present file must belong to a registry key).
  const artDir = join(dir, 'articles')
  for (const f of fs.readdirSync(artDir)) {
    if (f.startsWith('_') || !f.endsWith('.js')) continue
    if (!byKey.has(f.slice(0, -3))) fail(`articles/${f}: no node with key ${f.slice(0, -3)} in registry.json`)
  }
  const clipDir = join(dir, 'clips')
  for (const f of fs.existsSync(clipDir) ? fs.readdirSync(clipDir) : []) {
    if (f.endsWith('.json') && !byKey.has(f.slice(0, -5))) fail(`clips/${f}: no node with key ${f.slice(0, -5)} in registry.json`)
  }
  for (const n of all) {
    const file = join(artDir, `${n.key}.js`)
    if (fs.existsSync(file)) n.article = (await import(pathToFileURL(file).href)).default
    const man = join(clipDir, `${n.key}.json`)
    n.manifest = fs.existsSync(man) ? JSON.parse(fs.readFileSync(man, 'utf8')) : {}
  }

  // 3) Clips: a clip is (owner article, name). Resolve one, checking its caption, render and files.
  const mediaFiles = new Set()
  const resolveClip = (ref, where) => {
    const owner = byKey.get(ref.from || where.key)
    if (!owner) { fail(`${where.key}: clip ${ref.clip} from unknown article ${ref.from}`); return null }
    const def = owner.article && owner.article.clips && owner.article.clips[ref.clip]
    if (!def || !def.title || !def.caption) { fail(`${where.key}: clip ${ref.clip} has no title/caption in articles/${owner.key}.js clips`); return null }
    const meta = owner.manifest[ref.clip]
    if (!meta) { fail(`${where.key}: clip ${owner.key}/${ref.clip} is not rendered (anim/render.sh ${owner.key}/${ref.clip})`); return null }
    const rel = `fantastic/foundations/${owner.path}/${ref.clip}`
    for (const ext of ['mp4', 'webm', 'webp']) {
      if (!fs.existsSync(join(media, `${rel}.${ext}`))) fail(`${where.key}: missing media/${rel}.${ext}`)
      mediaFiles.add(`${rel}.${ext}`)
    }
    return {
      key: `${owner.key}/${ref.clip}`, owner, name: ref.clip, title: def.title, caption: def.caption, meta,
      htmlId: `anim-${ref.clip}`,
      files: { mp4: `/${rel}.mp4`, webm: `/${rel}.webm`, poster: `/${rel}.webp` },
    }
  }
  const ogOf = (owner, where) => {
    const rel = `fantastic/foundations/${owner.path}/og.jpg`
    if (!fs.existsSync(join(media, rel))) fail(`${where.key}: missing media/${rel} (anim/render.sh writes it from the scene file's OG clip)`)
    mediaFiles.add(rel)
    return `/${rel}`
  }

  // 4) Published pages: complete article, every clip resolved, the cover and its og image.
  const published = all.filter((n) => n.status === 'published')
  for (const n of published) {
    const a = n.article
    if (!a) { fail(`${n.key} is published but src/data/foundations/articles/${n.key}.js does not exist`); continue }
    if (a.seed) { fail(`${n.key} is published but its article file is still a seed (seed: true)`); continue }
    for (const k of ['headline', 'description', 'summary']) if (!a[k]) fail(`${n.key}: no ${k}`)
    for (const k of ['lead', 'sections', 'sources', 'about']) if (!Array.isArray(a[k]) || !a[k].length) fail(`${n.key}: ${k} must be a non-empty list`)
    if (!a.cover || !a.cover.clip) { fail(`${n.key}: no cover {clip, from?}`); continue }
    const ids = new Set()
    n.clips = []
    for (const s of a.sections || []) {
      if (!s.id || !s.title) fail(`${n.key}: a section has no id/title`)
      if (ids.has(s.id) || ['sources', 'in-this-part'].includes(s.id)) fail(`${n.key}: section id ${s.id} is taken`)
      ids.add(s.id)
      for (const b of s.blocks || []) {
        if (b && b.video) {
          const c = resolveClip({ clip: b.video, from: b.from }, n)
          if (c) { b.resolved = c; n.clips.push(c) }
        }
      }
    }
    const htmlIds = n.clips.map((c) => c.htmlId)
    if (new Set(htmlIds).size !== htmlIds.length) fail(`${n.key}: two clips with the same name on one page`)
    const leaf = n.children.length === 0
    if (leaf && (n.clips.length < 3 || n.clips.length > 5)) fail(`${n.key}: an article shows 3 to 5 clips (has ${n.clips.length})`)
    if (!leaf && n.clips.length < 1) fail(`${n.key}: a pillar or section page shows one clip`)
    n.cover = resolveClip(a.cover, n)
    if (n.cover) n.og = ogOf(n.cover.owner, n)
  }
  // Clips shown on published pages may belong to planned articles (e.g. a pillar reusing a clip).
  if (errors.length) throw new Error(`[foundations] ${errors.length} problem(s):\n  - ${errors.join('\n  - ')}`)

  // 5) Reading order (hub first) and previous/next among published pages.
  const hub = { ...reg.hub, key: '', url: BASE, ancestors: [], children: roots, status: 'published' }
  const order = [hub, ...published]
  order.forEach((n, i) => { n.prev = order[i - 1] || null; n.next = order[i + 1] || null })
  hub.og = roots.find((r) => r.og)?.og
  const redirects = Object.entries(reg.redirects || {}).map(([from, to]) => {
    const target = nodes.find((n) => n.path === to)
    if (!target || target.status !== 'published') throw new Error(`[foundations] redirect ${from} -> ${to}: target is not a published node`)
    if (nodes.some((n) => n.path === from)) throw new Error(`[foundations] redirect ${from}: a node already lives there`)
    return { from: `${BASE}${from}/`, to: target }
  })
  return { hub, roots, all, published, planned: all.filter((n) => n.status === 'planned'), byKey, redirects, mediaFiles: [...mediaFiles].sort() }
}
