// SEED — Canvas › System agents. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): power, displays, audio, network, notifications, lock (fantastic OS).
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the bundles (OS calls only in sys/): src/tui/bundles/fantastic-system-agents/src/lib.rs, src/tui/bundles/fantastic-system-agents/src/driver.rs, src/tui/bundles/fantastic-system-agents/src/sys/mod.rs, src/tui/bundles/fantastic-system-agents/src/views
//   - pure models / ViewModels: src/tui/crates/fantastic-system/src/lib.rs, src/tui/crates/fantastic-system/tests/purity.rs
//   - the recipe and the OS image: src/tui/src/kern/system.rs, os/README.md, os/mkosi, os/session
//   - docs (code wins): src/tui/docs/system.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Refusals (/fantastic/foundations/protocol/refusals/): the refusal shape; this page lists only its reasons (denied, unsupported, unavailable, failed, bad_arg, not_found).
//   - Protocol › Call gate (/fantastic/foundations/protocol/call-gate/): `lock` answers `user` alone; link for why.
// Notes:
//   - Linux with D-Bus only; refused elsewhere. Without the service the agent still exists: state says available: false with a why. State emits at most one per 100 ms. Each has an html view (a canvas cell).
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_system.md) from fantastic main,
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
