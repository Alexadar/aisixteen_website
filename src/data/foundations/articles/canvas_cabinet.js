// SEED — Canvas › Cabinet. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): a master AI opens sub-canvases, each with one worker AI that builds its own tools and talks to its peers.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - Python (the reference runtime, per its readme): src/lib/python/bundled_agents/ai/cabinet/src/cabinet/tools.py, src/lib/python/bundled_agents/ai/cabinet/src/cabinet/readme.md, src/lib/python/bundled_agents/ai/cabinet/src/cabinet/view.html
//   - Rust port, verb for verb: src/lib/rust/crates/bundles/fantastic-cabinet/src/lib.rs, src/lib/rust/crates/bundles/fantastic-cabinet/src/readme.md, src/lib/rust/crates/bundles/fantastic-cabinet/src/view.html
//   - the nested canvas and the UIs: src/tui/src/kern/web.rs, src/tui/src/panel/cabinet.rs, src/tui/web/canvas/src/bundles/cabinets_view
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Canvas › Canvas (/fantastic/foundations/canvas/canvas/): `new_canvas` and nesting; the cabinet uses it, link.
//   - Agents › Agentic resources (/fantastic/foundations/agents/agentic-resources/) and Kernel › Tasks (/fantastic/foundations/kernel/tasks/): if the page mentions limits or waiting, link; the cabinet bundle itself does not use the roles registry unless the code says so (check).
// Notes:
//   - Verbs (readme): open_cabinet {task, name?, backend?, setup?}, close_cabinet {id}, cabinets, conclude {keep?}, status {line, progress?, result?}, create / place (the worker’s only two verbs on its canvas), view, reflect. open_cabinet does NOT start the worker.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_cabinet.md) from fantastic main,
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
