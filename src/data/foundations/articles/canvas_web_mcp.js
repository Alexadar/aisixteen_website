// SEED — Canvas › Web MCP. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): fantastic itself served as an MCP server.
// Where to start on fantastic main (22f88cb8), paths verified to exist (all public):
//   - the leg (Rust, outside the kernel tree): src/tui/bundles/fantastic-web-mcp/src/lib.rs, src/tui/bundles/fantastic-web-mcp/src/inquiries.rs, src/tui/bundles/fantastic-web-mcp/tests/calls.rs, src/tui/bundles/fantastic-web-mcp/tests/mcp_config.rs
//   - the CLI side: src/tui/src/mcp.rs, src/tui/src/send.rs, src/tui/src/kern/mcp_config.rs
//   - docs (code wins): src/tui/docs/mcp.md
// Already explained elsewhere — link the article, do not repeat or contradict it:
//   - Protocol › Transports (/fantastic/foundations/protocol/transports/#mcp) ALREADY says: stdio, protocol 2025-11-25, two tools reflect + send, attach over .fantastic/cli/mcp.sock or run the kernel, the `mcp` agent sends as itself via inbound_send, god-mode grants narrowed by update_agent, a tool call is a task, notifications/cancelled. Link it; do not restate. This page goes deeper: WebMcpBundle vs McpCore, .fantastic/.mcp.json written by the mcp_config bridge, `secret` marks, inquiries on the leg (#307), `fantastic send` and `$env:NAME`.
//   - Agents › MCP client (/fantastic/foundations/agents/mcp-client/): the other direction; one link.
// Notes:
//   - The handler is `web_mcp.tools` but the only carrier on main is STDIO; lib.rs says the HTTP carrier is “later”. Never imply an HTTP MCP endpoint exists. No public-hostname MCP service either.
//   - Narrow topic after Transports#mcp: recommend a short article (3 clips) or fold into Transports.
// The writer builds a fact sheet (coder/tmp/foundations/facts/canvas_web_mcp.md) from fantastic main,
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
