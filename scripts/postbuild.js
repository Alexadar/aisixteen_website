// Post-build tasks:
// 1. Create 404.html copy of index.html so GitHub Pages serves SPA routes
// 2. Copy CNAME file to docs for custom domain
import { cpSync, existsSync } from 'node:fs';

const indexSrc = new URL('../docs/index.html', import.meta.url);
const indexDest = new URL('../docs/404.html', import.meta.url);
const cnameSrc = new URL('../CNAME', import.meta.url);
const cnameDest = new URL('../docs/CNAME', import.meta.url);

try {
  // Create 404.html for SPA fallback
  if (!existsSync(indexSrc)) {
    console.warn('[postbuild] docs/index.html not found; skipping 404.html creation');
  } else {
    cpSync(indexSrc, indexDest);
    console.log('[postbuild] Created docs/404.html for SPA fallback');
  }

  // Copy CNAME to docs
  if (!existsSync(cnameSrc)) {
    console.warn('[postbuild] CNAME not found; skipping CNAME copy');
  } else {
    cpSync(cnameSrc, cnameDest);
    console.log('[postbuild] Copied CNAME to docs/');
  }
} catch (err) {
  console.error('[postbuild] Failed:', err);
  process.exit(1);
}
