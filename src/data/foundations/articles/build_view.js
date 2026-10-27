// SEED — Build › A view. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): how an agent shows itself on the canvas and in the TUI.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - a live panel, end to end: src/tui/starters/python_agent/bundle.yaml, src/tui/starters/python_agent/panel.html, src/tui/starters/python_agent/agent.py
//   - how the record’s view is read: src/tui/web/canvas/src/bundles/canvas/host_views.ts, src/tui/web/canvas/src/bundles/html_agent/connector.ts
//   - the TUI side: src/tui/src/panel/mod.rs, src/tui/src/panel/generic.rs
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Canvas › Views of agents (/fantastic/foundations/canvas/views/): how the app picks a view (record view, kind default, stub; TUI panels by handler_module). Link; this page is how to WRITE one.
//   - Canvas › HTML and GL agents (/fantastic/foundations/canvas/html-gl/): the sandbox and the connector; link.
// Notes:
//   - Starter: `view: {kind: html, bytes_file: panel.html, calls: [hello, count, watch]}`; the verb emits, the panel watches. innerHTML runs no <script> (bundles.md). `{{agent}}` is filled with the instance id. A view’s `calls` reach the instance’s grant.
//   - TUI: a new handler gets the generic panel; there is no public plug-in hook for a custom TUI panel unless the code shows one (check before claiming).
// The writer builds a fact sheet (coder/tmp/foundations/facts/build_view.md) from fantastic main,
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
