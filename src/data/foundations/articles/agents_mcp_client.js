// MCP client — Agents. Facts: coder/tmp/foundations/facts/agents_mcp_client.md (fantastic main df457a0f).
import { src, tree } from '../lib.js'

export default {
  headline: 'The MCP client: a remote server’s tools as verbs',
  description: 'How an Aisixteen Fantastic mcp_client agent connects to one remote MCP server, lists its tools as the agent’s verbs, reads its key per request and turns each send into a tools/call.',
  summary: 'One remote MCP server as an agent: boot lists its tools, and each tool is a verb.',
  cover: { clip: 'tools' },
  about: ['Aisixteen Fantastic', 'Model Context Protocol', 'Tool calling'],
  lead: [
    'An **MCP server** offers tools over HTTP. The `mcp_client` agent stands for exactly one such server. It lists the server’s tools at boot, and from then on each tool is a verb of the agent: `send {type: <tool>, …arguments}` runs that tool on the remote server.',
    'This page follows one server through the agent: the record that names it, how its tools become verbs, what a call sends and gets back, and how the key and the protocol version are chosen. The opposite direction, where Fantastic is the MCP server, is covered in [Transports](/fantastic/foundations/protocol/transports/#mcp). How an AI agent uses verbs as tools is in [AI agent](/fantastic/foundations/agents/ai-agent/).',
  ],
  sections: [
    {
      id: 'record',
      title: 'The record and boot',
      blocks: [
        'The handler is `mcp_client.tools`, in Rust and Python. Its record has a required `url`, the server’s MCP endpoint, and an optional `credentials` of the form `{store, ref}`. A record without `credentials` is a keyless server. The write is refused unless `url` is an absolute `http` or `https` URL with a host and no fragment.',
        { code: 'create_agent  handler_module=mcp_client.tools\n              url=https://mcp.example.com/mcp\n              credentials={store: creds, ref: mcp_client/mcp.example.com}', label: 'a record (illustrative ids)' },
        'When the kernel creates the agent, it sends it `boot`. A failing boot does not abort the create. `boot` asks the server who it is (`server/discover`, or `initialize` for a legacy server, see the wire below) and, if the server’s capabilities include `tools`, sends `tools/list` for every page. A repeated `nextCursor` is refused as a `transport_error`.',
        'The answer is `{server, protocol_version, tools: [names], skipped?}`, and the agent emits `tools_listed`. Sent again, `boot` lists the tools again, which is how the agent follows a server whose tools changed. A failed `boot` keeps the tools already listed and answers why; `reflect` shows the reason as `last_error`.',
        'The agent keeps what the server said in memory, per instance. `reflect` answers `{id, sentence, url, protocol_version, server?, instructions?, tools, skipped?, last_error?}`, where `tools` is a count and `protocol_version` is `null` before the first successful `boot`.',
      ],
    },
    {
      id: 'verbs',
      title: 'Each tool is a verb',
      blocks: [
        'After `boot`, `docs of=<agent>` lists the server’s tools as the agent’s own verbs. Each entry is built from the tool’s `inputSchema` and `description`: a signature such as `args: title:str (req), body:str?.` followed by the description, or `No args.` when the schema has no properties.',
        { video: 'tools' },
        'A grant names tools like any other verb, for example `can_call {gh: ["create_issue"]}`. The [call gate](/fantastic/foundations/protocol/call-gate/) therefore decides, per tool, who may run it. The agent’s notes say it plainly: a tool runs on the remote server with the key’s rights, so the grant on each tool is the consent.',
        'Some tools cannot become verbs. At listing the agent skips, and reports in `skipped` as `{name, why}`, a tool with no name, a tool named like a kernel verb or like `reflect`, `boot` or `shutdown`, a name listed twice, and a tool whose `x-mcp-header` annotation is invalid (see the wire below). The rest are kept.',
        'Two refusals guard a send. Before a successful `boot`, any tool verb is refused `not_connected` with the hint “send boot to <id> once the server is up”. After it, a verb that is not a listed tool is refused `unhandled`, “the MCP server has no tool”, and the hint lists the tools. See [Refusals](/fantastic/foundations/protocol/refusals/) for the closed set of codes.',
      ],
    },
    {
      id: 'call',
      title: 'A send is a tools/call',
      blocks: [
        'A send to a listed tool becomes `tools/call` with `name` set to the verb and `arguments` set to the rest of the payload, without `type`. The agent reads its key first (next section), then makes one HTTP POST. The call is bounded by the caller’s own timeout; the client sets only a 15 second limit on connecting.',
        { code: '[{"target": "gh", "payload": {"type": "create_issue", "title": "Bug"}}]\n→ tools/call {name: "create_issue", arguments: {title: "Bug"}}', label: 'the send and the call (illustrative)' },
        'The answer is `{content, structured?}`. `content` holds the tool’s content items as the server sent them. `structuredContent` arrives as `structured`. If the tool reports `isError`, the reply gains `error`, the text items joined, so the call settles `errored`; with no text the error is “the tool reported an error”.',
        { h3: 'Binary content' },
        'Image and audio `data`, and an embedded resource’s `blob`, are base64 on the MCP wire. The agent decodes them to raw bytes. A reply carries one binary body, at its top-level `bytes`. The first binary item says `body: "bytes"` and its `size`; any later binary item has only its `size` and an `omitted` note, because its bytes were not sent. Invalid base64 is a `transport_error`.',
        { h3: 'While it runs' },
        'A server may send notifications during a call. The agent re-emits `notifications/progress` as `progress {tool, progressToken, progress, total?, message?}` and `notifications/message` as `log {tool, level, data, logger?}`.',
        'A tool that needs input in the middle of a call answers `{error, input_required: {inputRequests, requestState}}`. This client cannot give that input yet, and the call does not continue.',
        { video: 'call' },
      ],
    },
    {
      id: 'key',
      title: 'The key',
      blocks: [
        'If the record has `credentials`, the agent reads the ref’s `api_key` from the [credential store](/fantastic/foundations/agents/credential-store/) before every request, `boot` and each call included. It sends `get {ref, host}` as itself, with the server’s URL as the host, so the store hands the key out only for the host the ref is bound to. Nothing is cached.',
        'The key goes out as `Authorization: Bearer <key>`. A refused or malformed read becomes an `unauthorized` reply and no request goes out. The wiring is the usual two ends: the agent’s `can_call` names the store, and the store’s `callable_by` names the agent.',
      ],
    },
    {
      id: 'wire',
      title: 'The wire: two eras',
      blocks: [
        'The transport is Streamable HTTP: each request is a POST to the one endpoint, with `Accept: application/json, text/event-stream`. The answer is one JSON object or a stream of server-sent events. The older two-endpoint HTTP+SSE transport of 2024-11-05 is not spoken.',
        { table: { head: ['era', 'versions', 'how a request travels'], rows: [
          ['modern', '`2026-07-28`', 'one POST each, no handshake or session; the version, client info and capabilities ride in `params._meta` and in headers `MCP-Protocol-Version`, `Mcp-Method`, `Mcp-Name` (for `tools/call`)'],
          ['legacy', '`2025-11-25`, `2025-06-18`, `2025-03-26`, `2024-11-05`', '`initialize`, then `notifications/initialized`; later POSTs carry `MCP-Session-Id` and, from 2025-06-18, `MCP-Protocol-Version`'],
        ] } },
        'The agent tries the modern era first by sending `server/discover`. If the answer names `2026-07-28`, the server is modern. If it lists only legacy versions, or answers with another 4xx or an error that is not a modern one (`-32601` included), the agent falls back to `initialize` in `2025-11-25`. A server that speaks none of these versions is refused with “the server speaks … this client speaks …”.',
        { video: 'wire' },
        'In the legacy era a 404 on a request that carries a session id means the session expired: the agent runs one new `initialize` and repeats the request. A new session ends the old one with an HTTP DELETE, and a 405 is accepted. If the server sends a request on the stream, `ping` is answered with `{}` and anything else with `-32601`.',
        { h3: 'Mirrored parameters' },
        'In the modern era a tool’s `inputSchema` may mark a property with `x-mcp-header`. The agent copies that argument into a header `Mcp-Param-<name>` on each call. The annotation must sit on an integer, string or boolean property, reached through `properties` keys only, with a unique header-token name; otherwise the tool is skipped. An integer beyond 2^53 − 1 is refused `bad_arg`.',
        { h3: 'When the server fails' },
        'An unreachable server answers `not_connected`, “cannot connect”; other transport failures answer `transport_error`, and an HTTP error without a JSON-RPC body quotes the status and the first 300 characters of the body. JSON-RPC errors map by code: `-32602` is `bad_arg`, `-32601` is `unhandled`, and `-32022`, `-32021` and `-32020` are `transport_error` replies that name the versions, capabilities or header mismatch. `-32020` hints that `boot` re-lists the tools. Any other code answers `{error, mcp_error}`.',
      ],
    },
  ],
  sources: [
    ['mcp_client (Rust): the agent', src('src/lib/rust/crates/bundles/fantastic-mcp-client/src/lib.rs', 1)],
    ['mcp_client (Rust): the wire', src('src/lib/rust/crates/bundles/fantastic-mcp-client/src/wire.rs', 1)],
    ['mcp_client (Python): the agent', src('src/lib/python/bundled_agents/io/mcp_client/src/mcp_client/tools.py', 1)],
    ['mcp_client (Python): the wire', src('src/lib/python/bundled_agents/io/mcp_client/src/mcp_client/wire.py', 1)],
    ['how the key is read per request', src('src/lib/rust/crates/bundles/fantastic-ai-core/src/credentials.rs', 154)],
    ['where boot is sent at create', src('src/lib/rust/crates/fantastic-kernel/src/lifecycle.rs', 316)],
    ['the Rust client’s tests', src('src/lib/rust/crates/bundles/fantastic-mcp-client/src/tests.rs', 1)],
  ],
  clips: {
    tools: {
      title: 'Tools become verbs',
      caption: 'The agent gh holds the url of a remote MCP server. boot sends server/discover, and the server answers. boot then sends tools/list and gets four tool names. docs of=gh lists three as verbs with their signatures (create_issue, list_issues, add_label); reflect is skipped because the kernel answers that verb.',
    },
    call: {
      title: 'A send is a tools/call',
      caption: 'Agent a sends gh {"type": "create_issue", "title": "Bug"}. gh makes a tools/call to the server and answers content and structured. A second call, add_label, comes back with isError, so the reply has error: label not found. A send named delete_repo, which the server never listed, is refused unhandled and nothing goes to the server.',
    },
    wire: {
      title: 'The key and the wire',
      caption: 'Before a request, gh sends get {ref, host} to the store creds and receives the api_key. It goes to the server as Authorization: Bearer. The agent first sends server/discover; a server that answers 2026-07-28 is spoken to with one POST per request and no session. A server that refuses discover gets initialize, and every later POST carries MCP-Session-Id.',
    },
  },
}
