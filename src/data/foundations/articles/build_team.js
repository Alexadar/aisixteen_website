// SEED — Build › Example: Team. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): fantastic_team (public repo), a product built on fantastic: role cards, a project lead that plans a tree of agents, the task registry, the cadencer; links to the repo.
// Where to start, paths verified to exist:
//   - fantastic_team (PUBLIC: github.com/aisixteen/fantastic_team, main 4f0eb0e): README.md, examples/team.yaml, roles/project_lead.md, roles/lead.md, roles/worker.md, crates/team/src/lib.rs, crates/team/src/cadence_feed.rs, docs/fantastic-notes.md, patches/github-exec.patch
//   - what it uses from fantastic main (22f88cb8): src/lib/python/bundled_agents/agentic_resources, src/lib/rust/crates/bundles/fantastic-agentic-resources, src/lib/rust/crates/bundles/fantastic-task-registry
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Agents › Agentic resources and tasks (/fantastic/foundations/agents/agentic-resources/): role cards, spawn, limits, the task registry. Link; this page shows how Team USES them (team.yaml `roles:`, the project_lead card’s grants), not how they work.
//   - Kernel › Tasks (/fantastic/foundations/kernel/tasks/): await_set, which the project lead uses to wait for its children; link.
// Notes:
//   - aisixteen/fantastic_team is public (checked with gh, 2026-10-27) and may be linked. Claims about Team come from that repo; claims about fantastic from fantastic main.
//   - Its README says there are no releases yet (build from source) and that the run was verified on Linux only; keep those qualifiers if the page mentions install.
// The writer builds a fact sheet (coder/tmp/foundations/facts/build_team.md) from fantastic main,
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
