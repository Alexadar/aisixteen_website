// SEED — Canvas › Views of agents. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): every agent drawn through its own view (agent-owned views) or a generic card; TUI panels.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - canvas: a host record → its view: src/tui/web/canvas/src/bundles/canvas/host_views.ts, src/tui/web/canvas/src/bundles/agent_view/agent_view.ts, src/tui/web/canvas/src/bundles/reflect_view, src/tui/web/canvas/src/bundles/terminal_view, src/tui/web/canvas/src/bundles/ai_view
//   - terminal UI: a panel per handler_module, generic fallback: src/tui/src/panel/mod.rs, src/tui/src/panel/generic.rs
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Build › A view (/fantastic/foundations/build/view/): how to WRITE a view (panel.html, view.calls, fantastic.send / watch). This page is how the app CHOOSES and draws one; keep the split.
//   - Agents › Exec bridge (/fantastic/foundations/agents/exec-bridge/): terminal cells are exec_bridge PTY jobs; link.
// Notes:
//   - host_views.ts header: `view: {kind | handler, bytes | bytes_file, calls}`; no view → the kind’s default (exec → terminal, AI → chat), else the stub (reflect + docs). One view per agent.
//   - panel/mod.rs header: the TUI keys panels off handler_module; an unknown module gets the generic panel (reflect + call any declared verb).
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_views.md) from fantastic main,
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
