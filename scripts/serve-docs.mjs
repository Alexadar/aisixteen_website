// Minimal static server for docs/, with GitHub Pages semantics: /dir/ serves
// dir/index.html, unknown paths get 404.html. Used by the layout tests (no deps).
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs')
const port = Number(process.env.PORT || 4317)
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon',
}

function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  let file = path.join(root, clean)
  if (!file.startsWith(root)) return null
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
  return fs.existsSync(file) ? file : null
}

http.createServer((req, res) => {
  const file = resolve(req.url)
  const target = file || path.join(root, '404.html')
  const type = TYPES[path.extname(target)] || 'application/octet-stream'
  const size = fs.statSync(target).size
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '')
  if (file && range) { // byte ranges, so Safari will play the hero video
    const start = range[1] ? Number(range[1]) : 0
    const end = range[2] ? Number(range[2]) : size - 1
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
    return fs.createReadStream(target, { start, end }).pipe(res)
  }
  res.writeHead(file ? 200 : 404, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' })
  fs.createReadStream(target).pipe(res)
}).listen(port, '127.0.0.1', () => console.log(`docs/ on http://127.0.0.1:${port}`))
