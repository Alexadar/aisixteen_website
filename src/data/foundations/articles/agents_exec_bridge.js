// SEED — Exec bridge. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): a command runner, sealed by default, gated by an allowlist over a published control wire; terminal sessions.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - handler_module exec_bridge.tools. Rust: src/lib/rust/crates/bundles/fantastic-exec-bridge/src (lib.rs, jobs.rs, pty.rs, spawn.rs, monitor.rs, tail.rs, relay.rs, connector.py, readme.md). Python: src/lib/python/bundled_agents/io/exec_bridge/src/exec_bridge (tools.py, proc.py, _connector.py, _monitor.py, readme.md).
//   - The control wire: readme.md "## The wire" (FANTASTIC_CTRL_FD, the reference client sent by the `connector` verb). Terminals are PTY jobs: start {pty: {cols, rows}}, write, resize, ack.
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Security (/fantastic/foundations/protocol/security/#edges): sealed by default, ingress_rule to open, the `allowed` regex fullmatch on the whole line, the `shell` exception, the refusal text, "not a sandbox". Link; do not re-explain or contradict.
//   - Protocol › Security (/fantastic/foundations/protocol/security/#spawn): a started program acts AS the runner (its sends carry the runner id and can_call).
//   - Kernel › Tasks (/fantastic/foundations/kernel/tasks/): a job's on_cancel kills its child process. Kernel › Bundles (/fantastic/foundations/kernel/bundles/#rust): exec_bridge registers only with the `full` feature.
//   - Kernel › Bundles (/fantastic/foundations/kernel/bundles/#folder-bundles) covers py_agent programs; keep the two apart (Program agents is its own page).
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_exec_bridge.md) from fantastic main,
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
