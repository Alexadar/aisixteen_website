// SEED — Canvas › User home store. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): saved set-ups (agent blueprints) in ~/.fantastic.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the store (Rust): src/tui/bundles/fantastic-user-home-store/src/lib.rs, src/tui/bundles/fantastic-user-home-store/src/user_store.rs, src/tui/bundles/fantastic-user-home-store/src/secrets.rs, src/tui/bundles/fantastic-user-home-store/src/readme.md
//   - the user_store agent and its view: src/tui/src/kern/user_store.rs, src/tui/src/kern/user_store_view.html, src/tui/src/kern/saved.rs
//   - the Home (lists stored fantastics): src/tui/crates/fantastic-home-kernel/docs/home.md, src/tui/crates/fantastic-home-kernel/README.md, src/tui/crates/fantastic-home/README.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Agents › Credential store (/fantastic/foundations/agents/credential-store/): keys by reference, 0600 file / keychain / env. The home keeps key REFS and hosts (secrets.rs), never values; link for the store itself.
//   - Protocol › Call gate (/fantastic/foundations/protocol/call-gate/): who reaches the store is its callable_by; one link.
// Notes:
//   - Layout (lib.rs header): <home> = FANTASTIC_HOME else ~/.fantastic; user/setups/ai_agent/<name>.yaml (0600) + .preferred; user/keys/; fantastics/ (stored locations). Dirs 0700, files 0600, atomic writes, if_match against lost updates.
//   - A saved set-up is NOT an agent: no identity, wiring or grants; it must pass the target bundle’s validate_meta when saved. The binary fixes the directory; nothing on a record can move it.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_home_store.md) from fantastic main,
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
