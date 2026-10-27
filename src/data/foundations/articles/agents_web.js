// SEED — Web agents. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): `web` (HTTP host), `web_ws` (WebSocket channel), `web_rest` (REST channel).
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - web.tools: Rust src/lib/rust/crates/bundles/fantastic-web/src (lib.rs, routes.rs, handlers.rs, ws.rs, ws_peer.rs, origin.rs, mimetypes.rs, readme.md); Python src/lib/python/bundled_agents/web/host/src/web (tools.py, app.py, readme.md).
//   - web_ws.tools: Rust src/lib/rust/crates/bundles/fantastic-web-ws/src; Python src/lib/python/bundled_agents/io/web_ws/src/web_ws (tools.py, _proxy.py). web_rest.tools: Rust src/lib/rust/crates/bundles/fantastic-web-rest/src; Python src/lib/python/bundled_agents/io/web_rest/src/web_rest.
//   - Shared edge code: src/lib/rust/crates/fantastic-io-bridge/src (inbound.rs, authorizer*, codec.rs) and Python io/io_bridge. New on main df457a0f (#446): web refuses two children declaring the same literal route (fantastic-web/src/tests_duplicate_route.rs).
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Transports (/fantastic/foundations/protocol/transports/#wire-legs): the leg is the caller, ingress rule and "edge sealed by policy", auth_token on the envelope vs X-Fantastic-Auth / X-Fantastic-Execution-Id, the 16 MiB body cap and 413, the hello/guid browser peer. Link; do not repeat.
//   - Protocol › Security (/fantastic/foundations/protocol/security/) for sealed edges in general. This page covers the HTTP host itself: routes, mounting children, static serving, origin/host guard, duplicate routes.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_web.md) from fantastic main,
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
