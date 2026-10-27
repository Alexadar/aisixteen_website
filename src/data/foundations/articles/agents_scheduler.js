// SEED — Scheduler. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): recurring sends on a timer.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - handler_module scheduler.tools. Rust: src/lib/rust/crates/bundles/fantastic-scheduler/src (lib.rs, readme.md). Python: src/lib/python/bundled_agents/scheduler/src/scheduler (tools.py, readme.md).
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Kernel › State (/fantastic/foundations/kernel/state/): schedules persist as bundle sidecars (schedules.yaml, schedule_events.yaml) through the loader and need the .fantastic file_bridge. Link; do not re-explain persistence.
//   - A fire goes out AS the scheduler, so the scheduler→target edge must be granted: link Call gate (/fantastic/foundations/protocol/call-gate/), do not re-explain the gate.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_scheduler.md) from fantastic main,
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
