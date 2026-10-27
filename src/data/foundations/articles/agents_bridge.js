// SEED — Bridge. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): one kernel to another over WebSocket, raw call frames.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - There is no agent named `bridge`: the handler is ws_bridge.tools. Rust: src/lib/rust/crates/bundles/fantastic-bridge/src (lib.rs, transport/ws.rs, transport/memory.rs, readme_ws.md); the same crate also registers relay_connector.tools (transport/relay.rs, readme_relay.md). Python: src/lib/python/bundled_agents/io/ws_bridge/src/ws_bridge (tools.py, _ws.py, readme.md) and src/lib/python/bundled_agents/io/relay_connector.
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Transports (/fantastic/foundations/protocol/transports/#bridge): forward {target, payload}, the far side needs no bridge, sealed by default, frame ids <leg id>-<boot nonce>-<n>, watch_remote, relay_connector through a relay router by GUID, no automatic reconnect (`reconnect` verb). Link; this page goes deeper (wire, leg lifetime, message cap), it must not restate those.
//   - relay_connector: describe it only as Transports does (a relay router, reached by GUID). Never name the relay's repository or any relay host name.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_bridge.md) from fantastic main,
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
