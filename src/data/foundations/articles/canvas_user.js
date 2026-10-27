// SEED — Canvas › User. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): the one human as an agent; every call from the terminal and the canvas goes out through it.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - Rust (the canvas host): src/tui/bundles/fantastic-user/src/lib.rs, src/tui/bundles/fantastic-user/src/grants.rs, src/tui/bundles/fantastic-user/src/inquiries.rs, src/tui/bundles/fantastic-user/src/path.rs, src/tui/bundles/fantastic-user/src/export.rs, src/tui/bundles/fantastic-user/src/import.rs
//   - Python twin: src/lib/python/bundled_agents/io/user/src/user/tools.py, src/lib/python/bundled_agents/io/user/src/user/export.py, src/lib/python/bundled_agents/io/user/src/user/import_.py
//   - where the leg reaches only user: src/tui/src/kern/web.rs, src/tui/docs/canvas.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Call gate (/fantastic/foundations/protocol/call-gate/): can_call / callable_by, both ends, $self. `user`’s god-mode grants are an instance of that rule; link it, do not re-explain the gate.
//   - Agents › Web agents (/fantastic/foundations/agents/web/#ws): the canvas_ws leg and the Host guard. This page starts where the leg hands the call to `user.forward`.
// Notes:
//   - handler `user.tools` (lib.rs HANDLER_MODULE). Verbs in the lib.rs header: forward {target, payload, timeout?} (no default timeout), around, path {rescan?}, export_subtree, import_subtree, reflect, inquiry/inquiries (user_probe); its own `send` is refused.
//   - export_subtree / import_subtree (blueprints with ports) are user verbs: decide here or in Home store whether to cover them; cover them once.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_user.md) from fantastic main,
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
