// Create a 404.html copy of index.html so GitHub Pages serves SPA routes
// and fallback works when refreshing subpaths.
import { cpSync, existsSync } from 'node:fs';

const src = new URL('../docs/index.html', import.meta.url);
const dest = new URL('../docs/404.html', import.meta.url);

try {
  if (!existsSync(src)) {
    console.warn('[postbuild] docs/index.html not found; skipping 404.html creation');
    process.exit(0);
  }
  cpSync(src, dest);
  console.log('[postbuild] Created docs/404.html for SPA fallback');
} catch (err) {
  console.error('[postbuild] Failed to create 404.html', err);
  process.exit(1);
}
