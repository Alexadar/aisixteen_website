// SEED — Canvas › Skin and backgrounds. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): look and themes as agents.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the skin agent: src/tui/web/canvas/src/bundles/skin/skin_agent.ts, src/tui/web/canvas/src/bundles/skin/tokens.ts, src/tui/web/canvas/src/bundles/skin/schema.ts, src/tui/web/canvas/src/bundles/skin/stock.ts
//   - backgrounds and layout themes (the canvas theme agent): src/tui/web/canvas/src/bundles/backgrounds/backgrounds_agent.ts, src/tui/web/canvas/src/bundles/backgrounds/stock.ts, src/tui/web/canvas/src/bundles/canvas/background_agent.ts, src/tui/web/canvas/src/bundles/canvas/layout.ts
//   - docs (code wins): src/tui/docs/skins.md, src/tui/docs/canvas.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Canvas › Canvas (/fantastic/foundations/canvas/canvas/): layouts per theme (`layout_<theme>` rects) belong there if it covers cell placement; link rather than repeat.
// Notes:
//   - Three different things, keep them apart as the code does: a SKIN (W3C design tokens + backdrop web|native, page agent `skin`), a THEME (where cells sit: canvas / mobile / yours, layout.ts), a BACKGROUND (one GL source on the view’s delete-locked `background` agent: set_bg, default_bg, clear_bg, get_bg).
//   - The page agent is `backgrounds_agent.ts` but the doc calls it the canvas theme agent (owner rename); use the code’s names and say both.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_skin.md) from fantastic main,
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
