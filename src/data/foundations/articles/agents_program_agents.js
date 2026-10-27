// SEED — Program agents. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): (`py_agent`): a folder with a program answers the bundle's verbs.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - handler_module py_agent.tools. Rust: src/lib/rust/crates/bundles/fantastic-py-agent/src (lib.rs; registers only with the `full` feature). Python: src/lib/python/bundled_agents/io/py_agent/src/py_agent (tools.py, fantastic_agent.py). No readme.md; read lib.rs doc comments.
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Kernel › Bundles (/fantastic/foundations/kernel/bundles/#folder-bundles) ALREADY explains folder bundles in full: bundles/<name>/bundle.yaml, base py_agent, the 7 load checks, hello/verbs must match, {op: "call"}, no respawn, reload_bundle, the program runs with the user's OS rights. Link it; do not repeat or contradict. This page adds what a program sees and does (its side of the protocol, fantastic_agent.py, calls out, errors).
//   - Protocol › The idea (/fantastic/foundations/protocol/idea/) shows a program as one of the three kinds of peer. Build › A program agent (/fantastic/foundations/build/program-agent/, planned) will be the step-by-step how-to; keep this page about the mechanism.
//   - Exec bridge (/fantastic/foundations/agents/exec-bridge/) also runs programs that speak a wire; do not conflate the two.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_program_agents.md) from fantastic main,
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
