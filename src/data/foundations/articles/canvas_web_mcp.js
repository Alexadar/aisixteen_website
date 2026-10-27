// Web MCP. Every claim is in coder/tmp/foundations/facts/canvas_web_mcp.md (fantastic main 22f88cb8).
import { src, tree } from '../lib.js'

export default {
  headline: 'Web MCP: the kernel as an MCP server',
  description: 'How Aisixteen Fantastic serves its kernel to an MCP client: the web_mcp leg and McpCore, tasks, .fantastic/.mcp.json, inquiries and the fantastic send command.',
  summary: 'The mcp leg lets a coding CLI drive the kernel with two tools, keeps its own config file right and holds questions for the person.',
  cover: { clip: 'two_layers' },
  about: ['Aisixteen Fantastic', 'Model Context Protocol'],
  lead: [
    'A coding CLI or any other MCP client can drive a fantastic kernel through two tools, `reflect` and `send`. The part of the kernel that answers it is an agent called the **MCP leg**, with the handler `web_mcp.tools`.',
    'The wire format, the attach-or-run rule and the grants are already in [Transports](/fantastic/foundations/protocol/transports/#mcp). This page goes one layer down: how the leg splits protocol from identity, the config file it keeps, the questions it holds for the person, and the `fantastic send` command.',
  ],
  sections: [
    {
      id: 'two-layers',
      title: 'Two layers: the agent and the protocol',
      blocks: [
        'The leg lives in the `fantastic-web-mcp` crate, outside the kernel tree. It keeps two things apart on purpose. `WebMcpBundle` is the **agent**: it answers verbs sent to the leg. `McpCore` is the **protocol**: one JSON-RPC message in, one reply out. Every carrier calls `McpCore`, and no carrier knows what MCP means.',
        'The only carrier on `main` is a stream of JSON lines, over stdio or over the kernel’s local socket. The code comments name an HTTP carrier as later, so this page describes none. `McpCore` answers `initialize`, `ping`, `tools/list` and `tools/call`, and answers any other method with the error “Method not found”. A notification gets no reply. Protocol version 2025-11-25.',
        { h3: 'A tool call is the leg’s task' },
        'A carrier runs outside every dispatch, so anything it sent itself would count as the operator’s. `McpCore` avoids that. It starts a kernel task owned by the leg, and the task sends the leg an `inbound_send` verb with the batch. The leg then sends each item onward as itself, so the leg’s own grants decide every call, as in [Call gate and grants](/fantastic/foundations/protocol/call-gate/).',
        { video: 'two_layers' },
        'The task id exists from the first instant, so `ps` lists the call and `cancel` on it kills the subtree. The client’s `notifications/cancelled` does the same, and an item `timeout` cancels just that item. There is no wait bound: the reply is the outcome whenever the task ends. [Tasks](/fantastic/foundations/kernel/tasks/) explains the task table.',
        { h3: 'The two tools' },
        'There is no tool per agent or per verb. `reflect` with no arguments reflects `kernel` with `tree` and `bundles` as ids and the readme index on; with a `target` it reflects that agent, and extra arguments pass through. `send` takes `{items: [{target, payload, timeout?}]}`. Each item needs a `target` and a `payload` object whose `type` names the verb.',
        { code: '[{"pid": 8, "status": "completed", "result": …}]', label: 'what send returns (shape)' },
        'The result is pretty-printed JSON text, plus `structuredContent` when it is an object. `isError` is true only when nothing in the batch completed. A mixed batch, or a refusal inside one, is data. A shape error in an item, such as a missing `payload.type`, comes back as a tool error naming the item.',
      ],
    },
    {
      id: 'the-leg',
      title: 'The mcp agent and how it connects',
      blocks: [
        'The agent is named `mcp`. The CLI creates it in code at boot, or on the first connection if it is missing, as a child of the `user` agent, with the handler `web_mcp.tools`. If an agent called `mcp` already runs another handler, the CLI stops with an error and asks you to rename or delete it.',
        'The CLI also grants it every verb on every agent, both edges, except cabinet-owned agents (they keep the grants `fantastic_cabinet` writes for them), and the human reshapes those grants with `update_agent`. [Transports](/fantastic/foundations/protocol/transports/#mcp) describes `fantastic mcp` attaching to a running kernel over `.fantastic/cli/mcp.sock`, or running the kernel itself when none holds the directory’s lock. When it runs the kernel, stdout belongs to the protocol: the real stdout is duplicated to a private descriptor and the log takes over fds 1 and 2.',
        'A `reflect` of the leg shows its sentence, the protocol, the two tools, how many inquiries are open, and `mcp_config_error` when the config check below failed. The leg has no other verbs for a client. A verb it does not know gets `{error, reason: "unhandled"}` with the note that the leg is driven by its carrier.',
      ],
    },
    {
      id: 'config',
      title: 'The project’s MCP config',
      blocks: [
        'A coding CLI needs to find this kernel. So the leg keeps a file right: `.fantastic/.mcp.json`. At every boot the CLI makes a writable `file_bridge` named `mcp_config`, rooted at the project and exposing only that one file, and names it on the leg as `file_bridge_id` with `mcp_config_file`. The bridge is never rooted at `.fantastic`, because the kernel persists its own records there.',
        'On its boot the leg then reads the file through the bridge, as itself, with `read_stream`. It sets `mcpServers.fantastic` to `{command: <this binary, absolute path>, args: ["mcp"]}`, and writes the file back with `write` only when that entry changed. A missing file counts as `{}`. Every other server and key keeps its place, so a moved or rebuilt binary is corrected on the next start.',
        { video: 'config_file' },
        'A failure is loud and nothing is overwritten. The boot answers `{error, reason: "mcp_config"}` and the leg’s `reflect` carries `mcp_config_error` until a boot succeeds. The causes are a bridge named without a file path, a bridge that does not admit the leg, a file that is not a JSON object, and `mcpServers` that is not an object. To use the file, point the client at it: `claude --mcp-config .fantastic/.mcp.json`.',
      ],
    },
    {
      id: 'inquiries',
      title: 'Inquiries: questions for the person',
      blocks: [
        'Some decisions belong to the human who drives the kernel through the leg. An agent sends the leg `inquiry {text, kind?, options?, request_id?, reply_client_id?}`. The `kind` is `text`, `single`, `multi` or `confirm`, and `single` and `multi` need `options`. The leg accepts at once with `{accepted, re, request_id, open}` and holds the question. `re` is the pid the inquiry runs under, and it is the handle for the answer.',
        'The person lists the open ones with `inquiries`, oldest first, optionally for one `asker`. They answer with `answer {re, text}`, where `text` is words, a list of picks or a boolean. The leg sends the asker a message shaped `[reply to <re> · <leg> inquiry]`, then closes the inquiry. If that send fails, the question stays open and `answer` returns `reason: "refused"`.',
        { video: 'inquiry' },
        'The open list is durable. It lives on the leg’s own record as `open_inquiries`, written through the kernel’s ordinary update, so an unanswered question is still there after a restart.',
      ],
    },
    {
      id: 'send-command',
      title: 'fantastic send: one call from a shell',
      blocks: [
        '`fantastic send \'<item json>\'` makes one call into the kernel running in the current directory, as the `mcp` leg. It is attach-only: it opens the same socket, speaks `initialize` and one `tools/call` of `send`, and prints the item’s `{pid, status, result}`. With no live kernel it exits 1 and starts nothing. The exit code is 0 only when the item completed.',
        'A payload string value that starts with `$env:`, at any depth, is replaced by the variable of the calling shell named by the rest of the string. This is the only place `$env:` is resolved, and the kernel never reads its own environment for it. A string with text before `$env:` is left alone. An unset variable exits 2 before anything is sent.',
        { code: 'KEY=$(op read op://vault/openai/key) fantastic send \'{"target":"credentials","payload":{"type":"set","ref":"responses/api.openai.com","fields":{"api_key":"$env:KEY"}}}\'', label: 'storing a key (from the connected client’s instructions)' },
        { note: 'The CLI docs say `send` items also take `secret` marks. In the code the MCP carrier builds each item without reading one, and `fantastic send` substitutes `$env:` without marking a path. This page claims neither. [Credential store](/fantastic/foundations/agents/credential-store/) covers where keys go.' },
      ],
    },
  ],
  sources: [
    ['lib.rs: WebMcpBundle, McpCore, the two tools', src('src/tui/bundles/fantastic-web-mcp/src/lib.rs', 1)],
    ['McpCore.run: a tool call as the leg’s task', src('src/tui/bundles/fantastic-web-mcp/src/lib.rs', 418)],
    ['the config sync: with_entry and write_config', src('src/tui/bundles/fantastic-web-mcp/src/lib.rs', 160)],
    ['inquiries.rs: inquiry, inquiries, answer', src('src/tui/bundles/fantastic-web-mcp/src/inquiries.rs', 1)],
    ['mcp.rs: attach or run, the socket, ensure_leg', src('src/tui/src/mcp.rs', 1)],
    ['mcp_config.rs: .fantastic/.mcp.json and its bridge', src('src/tui/src/kern/mcp_config.rs', 1)],
    ['send.rs: fantastic send and $env:', src('src/tui/src/send.rs', 1)],
    ['the crate’s tests', tree('src/tui/bundles/fantastic-web-mcp/tests')],
  ],
  clips: {
    two_layers: {
      title: 'A tool call becomes the leg’s task',
      caption: 'A client sends tools/call send to McpCore. McpCore starts a task owned by the mcp leg (task 7, illustrative), which ps lists. The task hands the batch to the leg’s inbound_send. The leg sends the item to files as itself, so its grants decide. When the task ends, the outcomes return as [{pid, status, result}].',
    },
    config_file: {
      title: 'The leg keeps .mcp.json right',
      caption: 'At boot the mcp leg reaches .fantastic/.mcp.json through its mcp_config bridge. It reads the file with read_stream and keeps the other servers. It sets mcpServers.fantastic to this binary with args mcp, and writes with write only if the entry changed. A bad file or a missing grant makes the boot answer with reason mcp_config.',
    },
    inquiry: {
      title: 'An inquiry waits for the person',
      caption: 'An agent sends the mcp leg inquiry with kind confirm. The leg accepts at once with re 12 (illustrative pid) and holds it in open_inquiries. The person lists inquiries and sends answer with re 12 and the text yes. The asker receives [reply to 12 · mcp inquiry] and the inquiry closes.',
    },
  },
}
