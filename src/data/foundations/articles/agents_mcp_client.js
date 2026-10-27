// SEED — MCP client. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): one remote MCP server as an agent; its tools become the agent's verbs.
// Where to start on fantastic main (df457a0f), paths verified to exist:
//   - handler_module mcp_client.tools. Rust: src/lib/rust/crates/bundles/fantastic-mcp-client/src (lib.rs, wire.rs). Python: src/lib/python/bundled_agents/io/mcp_client/src/mcp_client (tools.py, wire.py). No readme.md in either; read lib.rs doc comments.
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Transports (/fantastic/foundations/protocol/transports/#mcp): the one-paragraph summary (tools become verbs, send {type: <tool>} becomes tools/call) and the opposite direction (`fantastic mcp` server, the `mcp` leg). Link; go deeper here only on the client.
//   - The MCP server side of the canvas is Canvas › Web MCP (/fantastic/foundations/canvas/web-mcp/, planned); do not cover it here.
//   - How an AI agent calls tools as verbs is in AI agent (/fantastic/foundations/agents/ai-agent/).
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_mcp_client.md) from fantastic main,
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
