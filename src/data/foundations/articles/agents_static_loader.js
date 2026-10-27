// SEED — Static loader. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): agents declared in YAML, created at boot.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - handler_module static_loader.tools. Rust: src/lib/rust/crates/bundles/fantastic-static-loader/src (lib.rs, readme.md). Python: src/lib/python/bundled_agents/loader/static_loader/src/static_loader (tools.py, readme.md). The manifest is fantastic.yaml (`fantastic init static_loader ./fantastic.yaml`, record field `manifest`).
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Kernel › Lifecycle (/fantastic/foundations/kernel/lifecycle/): create_agent, boot, kernel_start and restart. Kernel › Records (/fantastic/foundations/kernel/records/): the record and the tree. Kernel › State (/fantastic/foundations/kernel/state/): what survives a restart. Link these; this page covers only the declared roster and how it is hydrated.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_static_loader.md) from fantastic main,
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
