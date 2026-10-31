// Bridge. Every claim is in coder/tmp/foundations/facts/agents_bridge.md (fantastic main df457a0f).
import { src, tree } from '../lib.js'

export default {
  headline: 'Bridge: one kernel calling another over WebSocket',
  description: 'How the Aisixteen Fantastic ws_bridge agent dials another kernel’s web_ws leg, ships raw call frames, correlates replies by frame id and handles a dropped link.',
  summary: 'A ws_bridge agent dials another kernel and ships raw call frames: the wire, the frame ids, the 30 s wait and a dropped link.',
  cover: { clip: 'frames' },
  about: ['Aisixteen Fantastic', 'WebSocket'],
  lead: [
    'The **bridge** is how an agent on one kernel calls an agent on another. There is no agent named `bridge`: the handler is `ws_bridge.tools`, and the agent is a client that dials a WebSocket on the other kernel and sends it plain frames.',
    'This page covers the wire: the record that configures a leg, the frames in each direction, how a forward waits for its reply, and what happens when the link drops. [Transports](/fantastic/foundations/protocol/transports/#bridge) already explains what a `forward` is and who judges it, so this page does not repeat that.',
  ],
  sections: [
    {
      id: 'dial',
      title: 'Dialing the other kernel',
      blocks: [
        'A `ws_bridge` agent reads its target off its own record: `peer_id`, `host` and `port`, with `transport` defaulting to `ws`. The `boot` verb joins them into `ws://<host>:<port>/<peer_id>/ws`, which is the address of a `web_ws` leg on the far kernel. A missing field fails the boot with a message that names it, for example “ws transport requires host (nothing is guessed)”.',
        'The Rust client gives the connection 5 seconds and has no TLS built in, so a `wss://` address fails. The bridge starts no tunnel. If the far kernel is only reachable through ssh, an [`exec_bridge`](/fantastic/foundations/agents/exec-bridge/) job or other tooling opens the tunnel, and the bridge dials its local end.',
        'A successful `boot` starts the **read loop**, a kernel task named `read_loop` that shows in `ps` and can be cancelled, and then emits `bridge_up` on the bridge’s inbox. Booting a bridge that is already connected does nothing and answers `already`.',
        { code: '{"type": "boot"}\n→ {"booted": true, "transport": "ws"}', label: 'boot (shape)' },
      ],
    },
    {
      id: 'frames',
      title: 'Raw frames, no peer bridge',
      blocks: [
        'The bridge is an asymmetric client. It sends the far `web_ws` the same JSON frames a browser would, and that leg answers them. Nothing runs on the far side except its ordinary `web_ws` leg.',
        { table: { head: ['direction', 'frame', 'sent by'], rows: [
          ['out', '`{"type": "call", "id", "target", "payload"}`', '`forward`'],
          ['out', '`{"type": "watch", "src"}` and `{"type": "unwatch", "src"}`', '`watch_remote`, `unwatch_remote`'],
          ['in', '`{"type": "reply", "id", "data"}`', 'the far leg, settling a call'],
          ['in', '`{"type": "error", "id", "error"}`', 'the far leg, refusing a call'],
          ['in', '`{"type": "event", "src", "payload"}`', 'the far leg, for a watched agent'],
        ] } },
        'The bridge never wraps a call in a `forward` envelope. `forward` is only the verb you send to the local bridge; what travels is a `call` frame with the remote `target` and the `payload` to run there. If the leg’s egress rule presents a credential, the bridge writes it as `auth_token` on the frame envelope, and the dispatched payload stays clean.',
        'A frame is a text WebSocket message of JSON, or a binary message of the form `[4B len|header|body]` when it carries raw bytes, such as a `read_stream` chunk. Bytes are never base64-encoded. A frame that does not decode, or decodes to something other than an object, is skipped with a warning on stderr and the reader keeps going. A frame of an unknown `type` is ignored.',
        { video: 'frames' },
      ],
    },
    {
      id: 'forward',
      title: 'One forward, start to finish',
      blocks: [
        'Each `forward` takes the next frame id. The id is `<bridge id>-<nonce>-<n>`: the bridge’s own id, 12 hex characters minted at each boot, and a counter that starts at 1 under that nonce. A dash joins the parts because `<agent>:<hex>` is the kernel’s own namespace for minted execution ids.',
        'The id does a second job. The receiver uses a frame id as the name of the execution, so a second frame with an id it has already settled joins that execution and never runs. The nonce prevents this after a restart: the new boot’s `…-1` cannot collide with the old boot’s.',
        'The bridge records the id in a pending table, sends the frame and waits. A `reply` frame with the same id resolves the forward, and the caller receives `data` unwrapped. An `error` frame resolves it as `{"error": "remote error: …"}`.',
        { h3: 'How a forward fails' },
        'The wait lasts 30 seconds unless the item sets `forward_timeout`. The field is not called `timeout`, because that is a call’s own routing field. Each of these local failures comes back as an `error` result with a `bridge.forward:` prefix. An `error` frame from the remote side returns `remote error: …` without that prefix.',
        { table: { head: ['when', 'result'], rows: [
          ['no live socket', 'refused: “bridge.forward: not connected”, with the hint “call boot first”'],
          ['the socket rejects the write', '`bridge.forward: send failed: …`'],
          ['no reply within `forward_timeout`', '`bridge.forward: timeout after 30s`'],
          ['the link drops while waiting', '`bridge.forward: bridge transport closed`'],
        ] } },
        'Large messages have a limit. A frame and a whole WebSocket message are each at most 16 MiB on the dialled socket, in Rust and in Python, and a message over the limit ends the socket.',
      ],
    },
    {
      id: 'watch',
      title: 'Watching a remote agent',
      blocks: [
        '`watch_remote {target}` sends a `watch` frame for one agent on the far kernel and adds that name to the leg’s watch list. The far leg then sends `event` frames that carry the agent’s name as `src`.',
        'The bridge re-emits an event on its own inbox, as the payload plus `src`, only when `src` is on the watch list. An event for anything else is dropped, and `unwatch_remote` takes the name off the list. A local agent that wants those events watches the bridge with `kernel.watch(<bridge id>, …)`.',
        { video: 'watch' },
      ],
    },
    {
      id: 'lifetime',
      title: 'A leg’s lifetime',
      blocks: [
        'When the read loop ends, because the peer closed or the socket failed, the bridge emits `bridge_down` once for that boot. It fails every forward still waiting, and it cancels any inbound call still being served. `reflect` then reports `connected: false`.',
        'The bridge does not reconnect on its own. `reconnect` is an explicit verb that shuts the leg down and boots it again, so a real network problem stays visible instead of being retried silently. A fresh boot mints a new nonce, so the ids it sends start again under a new prefix.',
        'The leg’s rules are read from its record on every frame. Sealing or opening a live leg with `update_agent` takes effect on the next frame, with no reboot, as [Security](/fantastic/foundations/protocol/security/) describes for every edge. `reflect` shows `connected`, `pending_count` and the rules.',
        { video: 'lifetime' },
        { note: 'Rust and Python run the same design. Python’s engine lives in `io_bridge` and `ws_bridge` only adds the WebSocket transport; Rust keeps both in one crate that also registers `relay_connector.tools`.' },
      ],
    },
  ],
  sources: [
    ['the bridge crate: verbs, frames, forward and the read loop', src('src/lib/rust/crates/bundles/fantastic-bridge/src/lib.rs', 1)],
    ['ws_bridge readme', src('src/lib/rust/crates/bundles/fantastic-bridge/src/readme_ws.md')],
    ['the WebSocket client transport', src('src/lib/rust/crates/bundles/fantastic-bridge/src/transport/ws.rs', 1)],
    ['the 16 MiB message cap', src('src/lib/rust/crates/bundles/fantastic-bridge/src/transport/mod.rs', 32)],
    ['Python ws_bridge: the transport builder', src('src/lib/python/bundled_agents/io/ws_bridge/src/ws_bridge/_ws.py', 99)],
    ['Python io_bridge engine: forward and read loop', src('src/lib/python/bundled_agents/io/io_bridge/src/io_bridge/_engine.py', 441)],
    ['the far side’s frame loop (web_ws)', src('src/lib/rust/crates/bundles/fantastic-web/src/ws.rs', 1)],
  ],
  clips: {
    frames: {
      title: 'A forward becomes a call frame',
      caption: 'On kernel A, a local agent sends the bridge a `forward` with target src and a payload. The bridge writes a call frame with an illustrative id, br-ab12-1, and ships it to the web_ws leg of kernel B. A reply frame with the same id returns, and the bridge returns the data unwrapped to the caller. A second forward, br-ab12-2, gets an error frame, which comes back as “remote error: …”.',
    },
    watch: {
      title: 'Watching a remote agent',
      caption: 'The bridge sends a watch frame for the remote agent src1 and adds it to its watch list. An event frame with src src1 arrives and is re-emitted on the bridge’s inbox as the payload plus src. An event frame for src2, which is not on the list, is dropped. Ids are illustrative.',
    },
    lifetime: {
      title: 'A leg’s lifetime',
      caption: 'boot dials the peer and emits bridge_up. A forward, br-ab12-1, is waiting when the peer drops. The bridge emits bridge_down once and the forward fails with “bridge transport closed”. Nothing redials by itself. reconnect boots again with a new nonce, so the next forward is br-cd34-1. Ids are illustrative.',
    },
  },
}
