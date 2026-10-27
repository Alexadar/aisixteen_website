// SEED — Canvas › HTML and GL agents. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): pages and WebGL scenes as agents.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - page agents: src/tui/web/canvas/src/bundles/html_agent/html_agent.ts, src/tui/web/canvas/src/bundles/html_agent/connector.ts, src/tui/web/canvas/src/bundles/html_agent/grant_hint.ts, src/tui/web/canvas/src/bundles/html_check.ts, src/tui/web/canvas/src/bundles/gl_agent/gl_agent.ts, src/tui/web/canvas/src/bundles/canvas/gl_host.ts
//   - docs (code wins): src/tui/docs/canvas.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Kernel › Bundles (/fantastic/foundations/kernel/bundles/#folder-bundles): page bundles (`base: html_agent`) are a kind of folder bundle; link, do not re-explain bundles.
//   - Protocol › Call gate (/fantastic/foundations/protocol/call-gate/): the grant hint (`grants_missing`) is the gate seen from a cell.
// Notes:
//   - Both are PAGE agents (TypeScript, in the browser kernel), not host bundles: html_agent.ts and gl_agent.ts say they were ported from a deleted host Python bundle. Say page-side; no Rust/Python twin.
//   - html: body in meta.html, sandboxed (null origin) unless trusted; the connector fantastic.send / emit / onMessage / watch. gl: source in meta.gl_source, get_gl_view, one shared THREE scene.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_html_gl.md) from fantastic main,
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
