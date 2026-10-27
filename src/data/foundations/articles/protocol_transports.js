// Transports. Every claim is in coder/tmp/foundations/facts/protocol_transports.md (fantastic main b175660c).
import { src, tree } from '../lib.js'

export default {
  headline: 'Transports: one message over five carriers',
  description: 'How a message reaches the Aisixteen Fantastic kernel in process, over WebSocket, REST, a kernel-to-kernel bridge or MCP, and what changes with the carrier.',
  summary: 'In process, WebSocket, REST, bridge and MCP: the payload is the same, only who calls changes.',
  cover: { clip: 'carriers' },
  about: ['Aisixteen Fantastic', 'Transport protocols'],
  lead: [
    'A message is a batch item: a `target`, a `payload` whose `type` names the verb, and optionally an `id`. It can reach the kernel in five ways: from an agent in the same process, over a WebSocket, over REST, through a bridge from another kernel, or over MCP.',
    'The payload is the same on every carrier. The carrier changes where the `target`, the `id` and the credential are written, and it changes who the kernel treats as the caller. Everything else in the protocol, the batch, the call gate and the ledger, runs after the carrier hands the message in.',
  ],
  sections: [
    {
      id: 'one-message',
      title: 'One message, five carriers',
      blocks: [
        'Take the smallest useful message, a `reflect` of the root. Each carrier below writes it differently, and each ends in the same `send` on the kernel. The ids and the leg name are illustrative.',
        { table: { head: ['carrier', 'how the message is written', 'the reply'], rows: [
          ['in process', '`send([{"target": "kernel", "payload": {"type": "reflect"}}])`', 'the outcome `{pid, status, result}`'],
          ['WebSocket', '`{"type": "call", "id": "c1", "target": "kernel", "payload": {"type": "reflect"}}`', '`{"type": "reply", "id": "c1", "data": …}`'],
          ['REST', '`POST /<leg id>/kernel` with the body `{"type": "reflect"}`', 'the result as JSON'],
          ['bridge', '`{"type": "forward", "target": "kernel", "payload": {"type": "reflect"}}`, sent to the bridge agent', 'the remote reply, unwrapped'],
          ['MCP', 'the `send` tool with `{"items": [{"target": "kernel", "payload": {"type": "reflect"}}]}`', 'one `{pid, status, result}` per item'],
        ] } },
        { video: 'carriers' },
        'The in-process form and MCP return the full outcome with its `status`. The WebSocket, REST and bridge forms return the result of the call; the `status` word is not a field of the WebSocket reply frame.',
      ],
    },
    {
      id: 'in-process',
      title: 'In process: the caller is the agent',
      blocks: [
        'An agent’s handler sends by calling `kernel.send` with a list of items, in Rust and in Python. The kernel knows the caller: it is the agent whose dispatch makes the send, or the operator when no dispatch is running.',
        'This is the only carrier where the caller is the sender itself. The call gate judges it with the sender’s own `can_call` and the target’s `callable_by`, as the call gate article describes.',
      ],
    },
    {
      id: 'wire-legs',
      title: 'WebSocket and REST: the leg is the caller',
      blocks: [
        'A **leg** is an agent that owns one wire face. `web_ws` mounts `ws://host/<id>/ws` on a parent `web` agent, and `web_rest` mounts `POST /<id>/<target>` and `GET /<id>/_reflect`. Both exist in the Rust and the Python runtime.',
        'The loop that reads a socket or serves a request runs outside every dispatch, so anything it sent would count as the operator’s. The code avoids that. The loop hands the admitted frame to its leg as an inbound verb (`inbound_call` for a call), and the leg sends the item onward as itself.',
        { quote: 'Whoever is on the other end of the wire is not an identity in this kernel; the leg is.', cite: 'fantastic-io-bridge, inbound.rs' },
        'So the leg’s `can_call` and the target’s `callable_by` decide the call, and everyone admitted through one leg is one caller. A frame also passes the leg’s **ingress rule** first. A leg is sealed until you open it: an unset rule refuses every inbound frame, with the reason “edge sealed by policy”.',
        { code: 'update_agent <leg id> ingress_rule=allow_all_ingress', label: 'opening a leg (the readme’s repair)' },
        { video: 'legs' },
        { h3: 'Where the carrier writes its fields' },
        'On a WebSocket, the credential is `auth_token` on the frame envelope, next to `type` and `target`, never inside the payload. A non-empty frame `id` names the execution, so the same id sent twice is one execution.',
        'REST has no envelope. The credential is the `X-Fantastic-Auth` header and the execution id is `X-Fantastic-Execution-Id`. The leg judges a POST on its target and credential before it reads one byte of the body, and it reads at most 16 MiB; a larger body gets a 413.',
        { h3: 'A page can be a kernel too' },
        'A client that is itself a kernel, such as the browser’s, sends `{"type": "hello", "guid": …}` on its WebSocket. The host then treats that guid as a peer, and a send to `<guid>|<agent id>` travels back over the same socket as a `call` frame. When its last socket closes, the guid stops being an address and calls still waiting on it settle as a `transport_error`.',
      ],
    },
    {
      id: 'bridge',
      title: 'Kernel to kernel: the bridge',
      blocks: [
        'A `ws_bridge` agent dials another kernel’s `web_ws` leg at `ws://<host>:<port>/<peer_id>/ws`. To call across, you send the bridge a `forward` item with the remote `target` and the `payload` to run there. The bridge ships it as a plain `call` frame, waits for the matching `reply`, and returns the data.',
        'The far side needs no bridge. It sees the same frame a browser would send, so its leg judges the call: its ingress rule, its `can_call` and the target’s `callable_by`. A bridge is sealed by default like any leg, and an inbound call over it is served as the bridge leg.',
        { video: 'bridge' },
        'Frame ids are `<leg id>-<boot nonce>-<n>`, fresh at each boot, so a restarted bridge never reuses an id the peer already settled. `watch_remote` also streams a remote agent’s events onto the bridge’s inbox. A `relay_connector` does the same work through a relay router, reaching the partner by its GUID instead of a host and port.',
        { note: 'The bridge does not reconnect on its own after a transport failure. `reconnect` is a verb, so the failure stays visible.' },
      ],
    },
    {
      id: 'mcp',
      title: 'MCP: both directions',
      blocks: [
        'The Rust program `fantastic mcp` is an MCP server over stdio, protocol 2025-11-25, with two tools: `reflect` and `send`. The `send` tool takes `{items: [{target, payload, timeout?}]}` and returns `[{pid, status, result}]`, the same batch as in process. If a kernel already runs in the directory, `fantastic mcp` attaches to it over `.fantastic/cli/mcp.sock`; otherwise it runs the kernel itself.',
        'MCP is a leg too. A persisted agent named `mcp` receives each batch through `inbound_send` and sends it as itself. It starts with grants on every agent, and the human narrows them with `update_agent`. Each tool call is a kernel task that `ps` lists, and MCP’s `notifications/cancelled` cancels it.',
        'The other direction is the `mcp_client` agent, in Rust and Python. It connects to one remote MCP server and makes each of that server’s tools a verb of the agent, so `send {type: <tool>, …}` becomes a `tools/call`.',
      ],
    },
    {
      id: 'constant',
      title: 'What the carrier changes',
      blocks: [
        { list: [
          'The **payload and its verb** do not change. `{"type": "reflect"}` is the same text on all five.',
          'The **place of the fields** changes: a call frame, URL and headers, a `forward` item or a tool argument.',
          'The **caller** changes. In process it is the sending agent. On every wire it is the leg, and the leg’s ingress rule is a first check.',
          'The **reply shape** changes: the full outcome in process and over MCP, the result on the wire.',
          'Everything after the hand-in, the batch, the gate, the tasks and the ledger, is the same code.',
        ] },
      ],
    },
  ],
  sources: [
    ['inbound.rs: how a wire frame becomes the leg’s call', src('src/lib/rust/crates/fantastic-io-bridge/src/inbound.rs', 1)],
    ['ws.rs: the WebSocket frames', src('src/lib/rust/crates/bundles/fantastic-web/src/ws.rs', 1)],
    ['web_ws readme', src('src/lib/rust/crates/bundles/fantastic-web-ws/src/readme.md')],
    ['web_rest readme', src('src/lib/rust/crates/bundles/fantastic-web-rest/src/readme.md')],
    ['the bridge crate: forward and the frame protocol', src('src/lib/rust/crates/bundles/fantastic-bridge/src/lib.rs', 1)],
    ['peers.rs: <guid>|<agent> addressing', src('src/lib/rust/crates/fantastic-kernel/src/peers.rs', 1)],
    ['fantastic mcp (the MCP server face)', src('src/tui/docs/mcp.md')],
    ['mcp_client (a remote server’s tools as verbs)', src('src/lib/rust/crates/bundles/fantastic-mcp-client/src/lib.rs', 1)],
  ],
  clips: {
    carriers: {
      title: 'One message, five carriers',
      caption: 'The payload {"type": "reflect"} stays fixed while the carrier changes. In process it is send([{target, payload}]); on a WebSocket a call frame with an id; on REST a POST whose body is the payload; through a bridge a forward item; over MCP the send tool. Each ends in the same send on the kernel.',
    },
    legs: {
      title: 'A wire leg is the caller',
      caption: 'A client sends a call frame to a sealed web_ws leg and gets the refusal "edge sealed by policy". After update_agent sets ingress_rule=allow_all_ingress the frame is admitted. The leg then sends the item onward as itself, and the target answers only because the leg’s can_call and the target’s callable_by grant the verb (illustrative grants).',
    },
    bridge: {
      title: 'Kernel to kernel with forward',
      caption: 'On kernel A, agent a sends the bridge a forward item for target src on the other kernel. The bridge ships a call frame with an illustrative id (bridge-1-1) to kernel B’s web_ws leg. B’s leg judges the call and answers with a reply frame. The bridge returns the data to a, which settles completed.',
    },
  },
}
