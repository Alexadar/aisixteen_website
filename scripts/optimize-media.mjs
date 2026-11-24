// One-off media optimizer. Run by hand after adding or changing an icon, a screenshot.png or
// the logo: `npm run optimize-media` (needs ImageMagick's `magick` on PATH). It writes small
// WebP copies next to the originals; the outputs are committed, so the site build and CI need
// no image tooling. The PNG originals stay: Open Graph and JSON-LD images point at them.
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'node:fs'

const media = join(dirname(fileURLToPath(import.meta.url)), '..', 'media')
const run = (src, out, args) => {
  execFileSync('magick', [src, ...args, out])
  console.log(`${out.replace(media + '/', '')}  ${(fs.statSync(out).size / 1024).toFixed(1)} KB`)
}
for (const dir of fs.readdirSync(media)) {
  const d = join(media, dir)
  if (!fs.statSync(d).isDirectory()) continue
  const icon = ['icon.png', 'icon.jpg'].map((f) => join(d, f)).find((f) => fs.existsSync(f))
  if (icon) run(icon, join(d, 'icon-160.webp'), ['-resize', '160x160', '-quality', '86'])
  const shot = join(d, 'screenshot.png')
  if (fs.existsSync(shot)) run(shot, join(d, 'screenshot-960.webp'), ['-resize', '960x', '-quality', '80'])
}
run(join(media, 'logo.png'), join(media, 'logo-96.webp'), ['-resize', 'x96', '-quality', '90'])
