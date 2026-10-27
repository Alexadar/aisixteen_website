// SEED — Build › A program agent. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): a folder with a program.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the starter: src/tui/starters/python_agent/agent.py, src/tui/starters/python_agent/bundle.yaml, src/tui/starters/python_agent/panel.html
//   - py_agent: src/lib/rust/crates/bundles/fantastic-py-agent/src/lib.rs, src/lib/python/bundled_agents/io/py_agent/src/py_agent
//   - docs (code wins): src/tui/docs/bundles.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Agents › Program agents (/fantastic/foundations/agents/program-agents/): the wire, hello / call / result, fantastic_agent.py, emit and send, stop. Link each; do NOT repeat the wire. This page is a walkthrough: make one from the starter, add a verb (fa.serve + bundle.yaml verbs must match), save = every instance restarts (in-flight calls answer `reloaded`), copy the folder for a release.
//   - Kernel › Bundles (/fantastic/foundations/kernel/bundles/#folder-bundles): link.
// Notes:
//   - Trust: a python agent’s code runs with your OS rights; nothing it does itself passes the gate (bundles.md “Trust”).
// The writer builds a fact sheet (coder/tmp/foundations/facts/build_program_agent.md) from fantastic main,
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
