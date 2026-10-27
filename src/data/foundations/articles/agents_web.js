// Web agents. Every claim is in coder/tmp/foundations/facts/agents_web.md (fantastic main df457a0f).
import { src, tree } from '../lib.js'

export default {
  headline: 'Web agents: the HTTP host and its two legs',
  description: 'How the Aisixteen Fantastic web agent hosts HTTP: it mounts the routes web_ws and web_rest declare, guards Host and Origin, and serves files as itself, gated.',
  summary: 'web hosts HTTP and mounts the routes its web_ws and web_rest children declare.',
  cover: { clip: 'mount' },
  about: ['Aisixteen Fantastic', 'HTTP server'],
  lead: [
    'Three agents put a kernel on the network. `web` is the HTTP host: it owns a port and a route table. `web_ws` and `web_rest` are its children, the **legs** that carry verbs over a WebSocket and over REST.',
    'This page covers the host itself: how it builds its route table, why it refuses a request before any route sees it, and how it serves files. What a leg does with a message once it is admitted is the subject of [Transports](/fantastic/foundations/protocol/transports/#wire-legs), and is not repeated here. Rust and Python both implement them, with the same routes, guard, file route and duplicate-route refusal.',
  ],
  sections: [
    {
      id: 'roles',
      title: 'One host, two legs',
      blocks: [
        'A `web` agent (`handler_module` `web.tools`) answers six verbs: `reflect`, `boot`, `stop`, `mount`, `unmount` and `fetch_file`. It has no default port. `boot` needs `port` on the record and raises without it.',
        'The host renders nothing of its own. Its baked routes are exactly two: `GET /_assets/favicon.png` and `GET /<agent id>/file/<path>`. A request for `/` is a 404 unless a leg declares it.',
        { table: { head: ['agent', 'handler module', 'routes it declares'], rows: [
          ['`web`', '`web.tools`', 'baked: the favicon and the file route'],
          ['`web_ws`', '`web_ws.tools`', 'one WebSocket route, `/{host_id}/ws`'],
          ['`web_rest`', '`web_rest.tools`', '`POST /<leg id>/{target_id}`, `GET /<leg id>/_reflect`, `GET /<leg id>/_reflect/{target_id}`'],
        ] } },
        'A leg is a child of the host: its `parent_id` is the web agent’s id. The host never hard-codes the leg routes. It asks each child for them.',
      ],
    },
    {
      id: 'mount',
      title: 'Boot: ask the children, then listen',
      blocks: [
        'On `boot`, the host builds its table with the two baked routes. It then sends each child the verb `get_routes`. The reply is plain data, a list of `{kind, method?, path}`. A child that answers no routes mounts nothing.',
        'Only after every child is mounted does the host bind its port. The port never serves a request before the whole table exists. `boot` is idempotent, answers `{running, surfaces}`, and tells the `cli` agent where it listens.',
        { code: '{"routes": [{"kind": "websocket", "path": "/{host_id}/ws"}]}', label: 'get_routes answered by a web_ws leg' },
        { video: 'mount' },
        'The listener binds the record’s `bind` if it has one, else its `host`, else `127.0.0.1`. A bind that fails, for example a port already in use, is logged and not raised, so one bad web agent does not stop the kernel.',
        { h3: 'Which route answers' },
        'Matching is first match wins. The host orders its table by the number of `{` in each path, fewest first, and keeps mount order among equals. So a literal path such as `/web_ui/ws` always beats the catch-all `/{host_id}/ws`, whichever leg mounted first.',
        'Children are mounted at boot. A child created later is mounted with `mount {child_id}`, which unmounts that child’s earlier routes first. `unmount {child_id}` removes them. Both answer an error while the host is not running.',
      ],
    },
    {
      id: 'duplicates',
      title: 'Two legs, one literal route',
      blocks: [
        'Because the first match wins, a second leg declaring the same literal route could never answer. The host refuses it instead of hiding it. A literal route is a path without `{`, and “the same” means the same kind (HTTP or WebSocket), method and path.',
        { code: 'web: route WS /app/ws declared by ws_b is already declared by ws_a', label: 'the refusal text (illustrative ids)' },
        'At `boot` the refusal fails the boot before the listener binds. A later `mount` answers it as `{"error": …}` naming both children.',
        'Patterns are shared on purpose. Two `web_ws` legs may both declare `/{host_id}/ws`. A WebSocket route and an HTTP route on one path, or two methods on one path, never conflict either.',
        { video: 'duplicates' },
        { note: 'With two web_ws legs the one mounted first is the first match, so it answers every `/<segment>/ws` upgrade. The segment in the URL is not a leg selector. It names the agent whose events the socket watches, as the WebSocket section shows.' },
      ],
    },
    {
      id: 'guard',
      title: 'The guard in front of every route',
      blocks: [
        'Every request passes the origin guard before routing, whatever route it would reach. The guard reads the web record on each request, so changing `host`, `port` or `allowed_origins` applies without a restart.',
        { h3: 'Host check' },
        'The `Host` header of every request, GET and WebSocket upgrade included, must be the host’s own authority: `<host>:<port>`. When the host is loopback, `127.0.0.1:<port>`, `localhost:<port>` and `[::1]:<port>` count too. A LAN name, a tunnel name or a container port map is another authority and is refused.',
        'This stops DNS rebinding. A rebinding page sends a same-origin GET with no `Origin` header, so an origin check never sees it, but its `Host` still names the attacker’s domain.',
        { h3: 'Origin check' },
        'A WebSocket upgrade, or an HTTP request that is not GET, HEAD or OPTIONS, that carries a browser `Origin` must match the host’s own origin (`http://<host>:<port>`) or an exact string in the record’s `allowed_origins`. A bare string there counts as one origin.',
        'A request with no `Origin`, such as curl, a CLI or a bridge, passes the guard. The leg’s own ingress rule still gates it, as [Security](/fantastic/foundations/protocol/security/#edges) describes.',
        { code: '403  {"error": "origin \'https://evil.example\' is not allowed on this host",\n      "reason": "unauthorized",\n      "hint": "add it to the web record\'s allowed_origins"}', label: 'a refused HTTP request (illustrative origin)' },
        'A refused WebSocket upgrade is a 403 with no body. Both kinds are logged on the kernel’s output.',
        { video: 'guard' },
        'The binding is separate from the identity. `bind: 0.0.0.0` publishes the listener, for a container, while the guard keeps judging by `host`. A `host` of `0.0.0.0` answers only `Host: 0.0.0.0:<port>`.',
      ],
    },
    {
      id: 'files',
      title: 'Serving files: the host reads as itself',
      blocks: [
        'The file route turns any agent that answers `read_stream {path, offset, length}` into an HTTP file server. `file_bridge` is the usual one. The host pipes the file in chunks of 256 KiB, so a large file is never held in memory whole. The `Content-Type` comes from the file name’s extension.',
        'A request task runs outside every dispatch, so on its own it would count as the operator. The route does not read as anyone. It sends the web agent `fetch_file {agent_id, path, offset, length}`, and the host sends `read_stream` to the file agent **as itself**.',
        'So the read passes the same [call gate](/fantastic/foundations/protocol/call-gate/) as any send, with all three of these true:',
        { list: [
          'the web agent’s `can_call` names the file agent (egress);',
          'the file agent’s `callable_by` names the web agent (ingress);',
          'the file agent’s own leg is open (`ingress_rule`).',
        ] },
        'If any one is missing, the browser gets a 404. A gate denial (`reason` `unauthorized`) carries a JSON body with `error`, `reason`, `side` and `hint` (`side` is null when the leg itself is sealed), so a person curling the URL learns which half is missing. A missing file, an unknown agent id or an agent that is not a file server is a bare 404 with no body, so the route does not reveal what exists.',
        { video: 'file' },
        '`reflect` on the web agent computes this instead of describing it. Its `browser_reachable` field lists the agent ids a browser could fetch through this host right now, using the real gate and the leg’s resolved ingress rule. The same reply carries `port`, `host`, `allowed_origins`, `running`, `surfaces` (each child with its mounted paths) and the file route’s contract.',
      ],
    },
    {
      id: 'ws',
      title: 'web_ws: the WebSocket leg',
      blocks: [
        'A `web_ws` leg declares `/{host_id}/ws`. It is sealed until you set `ingress_rule`, and an unknown rule name is refused at the write. Who the caller is, the `auth_token` and the `hello` peer are in [Transports](/fantastic/foundations/protocol/transports/#wire-legs).',
        'A client sends these frames: `call`, `emit`, `watch`, `unwatch`, `state_subscribe`, `state_unsubscribe` and `hello`. A binary frame is a 4-byte big-endian length, a JSON envelope and the raw bytes. A `call` is answered with `{"type": "reply", "id": …, "data": …}`. A verb’s error and a gate denial both travel inside `data`. A `type: "error"` frame answers an undecodable frame, and also a `watch` of an unknown agent or a `watch` or `state_subscribe` that the leg refuses; there the refusal’s keys sit on the frame itself, not inside `data`.',
        'The host sends `{"type": "event", "src": …, "payload": …}` for each event of an agent the socket watches. When the socket connects, the host also watches the agent named by the URL segment, but only if the leg admits an unauthenticated `watch`. On a sealed or credentialed leg it does not, so a client that merely completed the handshake receives no events.',
        'An open socket shows in `ps` as the kernel task `ws_drain`, and each call in flight as `ws_call`, both under the URL’s agent ([Tasks](/fantastic/foundations/kernel/tasks/)). The Rust host pings an idle socket every 20 seconds and closes it with 1011 if no pong returns within 20 more. A message, even a fragmented one, is held to the 16 MiB frame cap.',
      ],
    },
    {
      id: 'rest',
      title: 'web_rest: the REST leg',
      blocks: [
        'A `web_rest` leg declares `POST /<leg id>/{target_id}` and two GET shortcuts. The leg’s id sits in the path, so several REST legs under one host do not collide. `GET /<leg id>/_reflect` is a `reflect` of `kernel`, `/_reflect/<target>` reflects that agent, and `?readme=1` adds its readme. They go through the same gate and the same `X-Fantastic-Auth` header as a POST.',
        { code: 'curl -X POST -H \'content-type: application/json\' \\\n  -d \'{"type":"reflect"}\' http://<host>/<leg id>/<target id>', label: 'a POST (illustrative ids)' },
        'The body is the payload and must be a JSON object. An empty body is `{}`, and anything else is a 400, for example “web_rest: request body is not valid JSON”. Headers carry what an envelope would: `X-Fantastic-Execution-Id` names the execution, so the same id twice returns the first outcome, and `X-Fantastic-Auth` is the credential. The 16 MiB limit and the 413 are in [Transports](/fantastic/foundations/protocol/transports/#wire-legs).',
        'For raw bytes, send the body with the content type `application/octet-stream`. The JSON part of the payload goes in `X-Fantastic-Payload`, and `X-Fantastic-Bytes-Field` names the key the bytes fill, `bytes` by default. A reply that carries a chunk comes back the same way: the bytes as the body, the rest in `X-Fantastic-Payload`.',
      ],
    },
  ],
  sources: [
    ['web host: lib.rs (verbs, boot, mount, reflect)', src('src/lib/rust/crates/bundles/fantastic-web/src/lib.rs', 368)],
    ['routes.rs: the ordered table and the duplicate-route refusal', src('src/lib/rust/crates/bundles/fantastic-web/src/routes.rs', 185)],
    ['origin.rs: the Host and Origin guard', src('src/lib/rust/crates/bundles/fantastic-web/src/origin.rs', 91)],
    ['handlers.rs: the file route and REST POST', src('src/lib/rust/crates/bundles/fantastic-web/src/handlers.rs', 166)],
    ['the web host readme', src('src/lib/rust/crates/bundles/fantastic-web/src/readme.md')],
    ['web_ws readme', src('src/lib/rust/crates/bundles/fantastic-web-ws/src/readme.md')],
    ['web_rest readme', src('src/lib/rust/crates/bundles/fantastic-web-rest/src/readme.md')],
    ['Python web host: mounting and ordering', src('src/lib/python/bundled_agents/web/host/src/web/tools.py', 86)],
  ],
  clips: {
    mount: {
      title: 'Boot: ask the children, then listen',
      caption: 'The web agent starts with its two baked routes, the favicon and the file route. It sends get_routes to its children, a web_ws leg and a web_rest leg, and each answers with the routes it declares (the drawn table shows only some of them). Their paths join the table, with the literal paths before the {host_id} pattern. Only then does the host bind its port and listen (illustrative ids).',
    },
    duplicates: {
      title: 'Two legs, one literal route',
      caption: 'Leg ws_a declares the literal route /app/ws and is mounted. Leg ws_b declares /{host_id}/ws, a pattern, which is shared and mounts. When leg ws_c also declares /app/ws, the host refuses it with a message naming ws_c and ws_a, and the table keeps the first (illustrative ids).',
    },
    guard: {
      title: 'The guard in front of every route',
      caption: 'Three requests reach a host bound to localhost:8000. A GET whose Host is evil.example is refused with 403. A POST with a foreign Origin is refused with 403. A POST with no Origin passes the guard and reaches the leg, whose ingress rule still decides (illustrative names).',
    },
    file: {
      title: 'Serving a file as the web agent',
      caption: 'A browser asks GET /files/file/logo.png. The route sends the web agent fetch_file, and the web agent sends read_stream to the file agent as itself. With can_call and callable_by both granting, 256 KiB chunks stream back as 200. With the file agent’s callable_by empty, the call gate refuses and the browser gets a 404 whose body names the missing side (illustrative ids).',
    },
  },
}
