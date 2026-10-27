// SEED — File agent. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): the filesystem as an agent: text verbs, streams, list/delete/rename/mkdir, the allow list, watching paths.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - There is no agent named `file`: the bundle is `file_bridge` (handler_module file_bridge.tools). Rust: src/lib/rust/crates/bundles/fantastic-file/src (lib.rs, fs.rs, text.rs, views.rs, watch.rs, readme.md). Python: src/lib/python/bundled_agents/io/file_bridge/src/file_bridge (tools.py, fs.py, views.py, file_agent.py, folder_agent.py, readme.md).
//   - views.* adds per-file and per-folder view agents (file_agent / folder_agent) that call the bridge as themselves; check both runtimes before claiming parity.
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Security (/fantastic/foundations/protocol/security/#edges): sealed by default, the clamp to the running directory (.., ~, absolute paths, symlinks out), the `allow` list, unlisted path answers not_found. Link; do not repeat.
//   - Kernel › State (/fantastic/foundations/kernel/state/) and Kernel › Lifecycle (/fantastic/foundations/kernel/lifecycle/): a file_bridge rooted at .fantastic is the records store (the CLI seed `store`, allow ["."]). Link; this page is about files, not record persistence.
//   - Kernel › Records (/fantastic/foundations/kernel/records/) uses file_bridge.tools as its example record.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_file.md) from fantastic main,
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
