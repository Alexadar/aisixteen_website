// SEED — Agentic resources and tasks. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): role cards, `spawn` with limits that count every existing agent, the task registry (holder, source, reassignments); both off by default.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - agentic_resources.tools: Rust src/lib/rust/crates/bundles/fantastic-agentic-resources/src (lib.rs, cards.rs, readme.md); Python src/lib/python/bundled_agents/agentic_resources/src/agentic_resources (tools.py, cards.py, cards/, readme.md).
//   - task_registry.tools: Rust src/lib/rust/crates/bundles/fantastic-task-registry/src (lib.rs, readme.md); Python src/lib/python/bundled_agents/task_registry/src/task_registry (tools.py, readme.md).
//   - Off by default (Rust readmes, line 2-3): registered only when FANTASTIC_AGENTIC_RESOURCES / FANTASTIC_TASK_REGISTRY is truthy, and an agent with no role_dirs / task_store_id refuses every verb. Verify the Python side before writing "both runtimes".
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Call gate (/fantastic/foundations/protocol/call-gate/#spawn) ALREADY explains spawn grants: the card's tool grants written on both ends, the check against the spawner's can_call, the not_allowed reason, all-or-nothing with grant_failed, only literal ids applied. Link; do not repeat. This page covers cards, limits/counts (set_limit, get_count), roles, report, fleet and the task registry.
//   - Protocol › Security (/fantastic/foundations/protocol/security/#spawn) notes that spawn (unlike create_agent) checks grants. AI agent › Forking (/fantastic/foundations/agents/ai-agent/forking/) covers spawn {role, from: {agent, at}}. Kernel › Tasks (/fantastic/foundations/kernel/tasks/) is the kernel task table (ps, cancel, await_set), a different thing from the task registry; say so.
//   - Build › Example: Team (/fantastic/foundations/build/team/, planned) shows these in a product; do not describe that product here.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_agentic_resources.md) from fantastic main,
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
