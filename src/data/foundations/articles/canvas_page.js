// SEED — Canvas › Canvas page. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): the page app served from the binary.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the bundle that serves it: src/tui/bundles/fantastic-canvas-page/src/lib.rs, src/tui/bundles/fantastic-canvas-page/build.rs, src/tui/bundles/fantastic-canvas-page/tests/zip_repro.sh, src/tui/bundles/fantastic-canvas-page/tests/no_source_writes.sh
//   - the page app (TypeScript): src/tui/web/canvas/src/main.ts, src/tui/web/canvas/src/user_bridge.ts, src/tui/web/canvas/src/home.ts, src/tui/web/canvas/package.json, src/tui/web/canvas/readme.md
//   - hosted by a shell: src/tui/web/canvas/src/bundles/shell.ts, src/tui/docs/canvas.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Agents › Web agents (/fantastic/foundations/agents/web/#files): the host’s generic GET /<id>/file/<path> route and read_stream; link, this page is what canvas_page answers on it.
//   - Canvas (pillar, /fantastic/foundations/canvas/): page kernel + canvas_ws; do not restate.
// Notes:
//   - handler `canvas_page.tools`; canvas.zip packed by build.rs and embedded byte-for-byte; one-tag index.html loading bundle.min.js; home.html (same bundle, data-page=home) and list.html; verbs reflect, boot (no-op), read_stream (binary reply), list. Read-only.
//   - The desktop app shell under src/app/ is public too (Tauri; window.__FANTASTIC_SHELL__); mention only what canvas.md + shell.ts show.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_page.md) from fantastic main,
// writes this page to STYLE.md, fills headline, description, summary, about, lead, sections,
// sources, cover and clips (3 to 5), and deletes `seed: true`.

export default {
  seed: true,
  headline: '',
  description: '',
  summary: '',
  about: ['Aisixteen Fantastic'],
  lead: [],
  sections: [],
  sources: [],
  clips: {},
}
