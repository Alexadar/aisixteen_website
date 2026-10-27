// SEED — Build › A bundle. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): Rust or Python, verbs and their docs, the record fields it reads, passing the contract cases.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the Rust trait and a small real bundle: src/lib/rust/crates/fantastic-kernel/src/bundle.rs, src/lib/rust/crates/fantastic-bundle, src/lib/rust/crates/bundles/fantastic-scheduler/src, src/tui/bundles/fantastic-web-mcp/src/lib.rs
//   - Python: src/lib/python/bundled_agents/scheduler/pyproject.toml, src/lib/python/bundled_agents/scheduler/src
//   - the contract: contract, CONTRIBUTING.md
//   - folder bundles: src/tui/docs/bundles.md, src/tui/starters/python_agent
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Kernel › Bundles (/fantastic/foundations/kernel/bundles/): handler_module, Rust links at build time, Python entry points, folder bundles, twins. Link every one of those; this page is the HOW-TO (write one, step by step), not the mechanism again.
//   - Protocol › The contract (/fantastic/foundations/protocol/contract/): cases, runtimes, replay byte-for-byte. Link; say only how a new bundle adds and passes its cases.
// Notes:
//   - fantastic-web-mcp and fantastic-canvas-page say they are bundles written OUTSIDE the kernel tree: a public example of an external Rust bundle.
//   - Pick one small real bundle and walk it (name, verbs, verb docs in reflect, validate_meta / record fields, boot). Check the scheduler is the smallest honest example before using it.
// The writer builds a fact sheet (coder/tmp/foundations/facts/build_bundle.md) from fantastic main,
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
