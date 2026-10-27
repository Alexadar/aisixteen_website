// SEED — Canvas › Canvas. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): cells placed, moved, wired, hidden; the selector.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the page side (TypeScript, packed into the binary): src/tui/web/canvas/src/bundles/canvas/canvas_agent.ts, src/tui/web/canvas/src/bundles/canvas/canvas.ts, src/tui/web/canvas/src/bundles/canvas/layout.ts, src/tui/web/canvas/src/bundles/canvas/selector_agent.ts, src/tui/web/canvas/src/bundles/canvas/action_popup.ts, src/tui/web/canvas/src/bundles/view.ts
//   - the host side (canvas nodes, nesting): src/tui/src/kern/web.rs
//   - docs (code wins): src/tui/docs/canvas.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Canvas (pillar, /fantastic/foundations/canvas/): page kernel, canvas_ws, cells as views. Do not restate the overview.
//   - Protocol › Call gate (/fantastic/foundations/protocol/call-gate/): `wire {sender, receiver, verbs}` writes grants; link for the rule.
// Notes:
//   - Docs vs code: README.md:329 says canvases are flat peers; kern/web.rs (header) and canvas.md say `new_canvas` makes a CHILD of the canvas that received it (deleting a canvas deletes the canvases it spawned); flat peers made before nesting still load. Write the code’s version.
//   - A view’s verbs (place, move, fit, update, theme, wire, hide, show, remove): canvas.md table; check each against view.ts / canvas_agent.ts before claiming it.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_canvas.md) from fantastic main,
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
