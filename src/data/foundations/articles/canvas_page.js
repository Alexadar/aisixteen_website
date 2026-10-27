// Canvas page. Every claim is in coder/tmp/foundations/facts/canvas_page.md (fantastic main 22f88cb8).
import { src, tree } from '../lib.js'

export default {
  headline: 'The canvas page: an app served from the binary',
  description: 'How Aisixteen Fantastic ships the canvas app inside the binary: build.rs packs it into canvas.zip, the canvas_page agent serves it read-only, and the page boots as a peer kernel.',
  summary: 'canvas_page serves the canvas app from the binary, read-only, through the web host.',
  cover: { clip: 'serve' },
  about: ['Aisixteen Fantastic', 'Web app delivery'],
  lead: [
    'The canvas is a web page, and the binary that runs the kernel carries it. There is no folder of assets to install and no second server. A **`canvas_page`** agent holds the page and hands it out, one file at a time, to the `web` host.',
    'This page follows the page from build to browser: how it is packed and embedded, what the agent answers, and what the page does in its first moments. What the canvas then draws is the subject of the other Canvas pages. This page covers the Rust runtime. The Python runtime has no `canvas_page` bundle on `main`.',
  ],
  sections: [
    {
      id: 'embed',
      title: 'Packed at build, embedded in the binary',
      blocks: [
        '`canvas_page` is an ordinary [bundle](/fantastic/foundations/kernel/bundles/), built outside the kernel tree. Its handler module is `canvas_page.tools`, and it is a child of a `web` host.',
        'Its `build.rs` runs the canvas app’s `scripts/pack.sh`, which needs only a POSIX shell, a vendored esbuild pinned by its sha256, and no npm or node. The result is `canvas.zip`. The build script writes it under `OUT_DIR`, never into the source tree, and the crate embeds it with `include_bytes!`. A failed pack fails the build, because a binary without its page is not a build.',
        'The zip has three entries, in a fixed order: `readme.md`, `bundle.min.js` and `bundle.min.js.map`. `bundle.min.js` is the whole page in one file. The canvas, its views, the TypeScript kernel library, three.js and xterm are all inlined, and the pack refuses a bundle with a bare vendor import left in it.',
        'The zip is reproducible. Every entry gets mode 644, no extra fields and a time taken from `SOURCE_DATE_EPOCH` (1980-01-01 UTC when unset), so the same inputs give the same bytes whatever the clock, the umask or the time zone. The pack also stamps the sha256 of `bundle.min.js` into the zip’s copy of `readme.md`, as `expected: …`.',
        { video: 'embed' },
      ],
    },
    {
      id: 'files',
      title: 'Six files, one agent',
      blocks: [
        'The agent inflates the zip once and keeps the files in a map by name. It adds three small pages of its own, so it serves six files.',
        { table: { head: ['file', 'what it is'], rows: [
          ['`index.html`', 'one `<script type="module" src="bundle.min.js">` tag, so the bundle is the whole page; the path is relative, so it loads under whatever id the agent has'],
          ['`home.html`', 'the same tag with `<body data-page="home">`; the bundle then boots the Home page instead of the canvas'],
          ['`list.html`', 'the example client of the `home` protocol, a single file with no build step'],
          ['`bundle.min.js`, `bundle.min.js.map`, `readme.md`', 'the three entries of `canvas.zip`'],
        ] } },
        'The choice between canvas and Home is made inside the bundle. Its entry file imports the Home when `document.body.dataset.page` is `home`, and the canvas for every other page.',
        'The agent holds no state and writes nothing. Its sentence says it serves the files “read-only (transport only)”.',
      ],
    },
    {
      id: 'serve',
      title: 'Serving it: the web host reads as itself',
      blocks: [
        '`canvas_page` answers four verbs:',
        { table: { head: ['verb', 'answer'], rows: [
          ['`reflect`', '`id`, a sentence, and `files`, the served names'],
          ['`boot`', 'a no-op, `{"booted": true}`: the parent `web` host serves the route'],
          ['`list`', '`{"files": [...]}`'],
          ['`read_stream {path, offset?, length?}`', 'a chunk of one file'],
        ] } },
        'Any other verb gets an error with `reason` `unhandled`. `read_stream` is the one that matters. The record declares it in its `verbs`, which is what lets the host’s generic file route, `GET /<id>/file/<path>`, serve this agent. That route is described in [Web agents](/fantastic/foundations/agents/web/#files).',
        'Once the canvas is running, the page lives at `/canvas_page/file/index.html`. The host reads as itself, so the read passes the [call gate](/fantastic/foundations/protocol/call-gate/) like any send. `fantastic canvas` writes both halves: `web` has `can_call` for `read_stream` on `canvas_page`, and `canvas_page` has `callable_by` for it from `web`.',
        { code: '{"path": "index.html", "offset": 0, "next_offset": 10, "eof": false, "size": 173}', label: 'the head of a read_stream reply' },
        'A reply is a **binary reply**. The bytes are the body, under the key `bytes`, and the head carries `path`, `offset`, `next_offset`, `eof` and `size`. A caller that sends text only gets the head. The host asks for 256 KiB at a time and walks `next_offset` until `eof`.',
        'A path the agent does not have is refused with `reason` `not_found`, and the error lists the files it does serve. The lookup is a map of names, not a filesystem path, so a name like `../secret` is simply not in the map.',
        { video: 'serve' },
        'The home kernel creates the same agent under its own `web` host. It serves `home.html` and `list.html` at `/canvas_page/file/…`, and the desktop app’s window filter admits those URLs.',
      ],
    },
    {
      id: 'boot',
      title: 'What the page does when it loads',
      blocks: [
        'The page is its own kernel, running in the browser, and a peer of the host kernel. It talks to the host over the socket leg `canvas_ws`. Its first steps run in a fixed order:',
        { ol: [
          'Read the shell flag. A desktop shell sets one frozen global, `window.__FANTASTIC_SHELL__`, with `name`, `os`, `webview`, `backdrop` and an optional `pickFolder`. A plain browser tab has none. A malformed flag is said in place of the page, and nothing else runs.',
          'Install the stock skin, so the first paint is already styled.',
          'Build the kernel and its bridge. Every host call goes through the host’s `user` agent: a call to agent `T` is sent as `user.forward {target: T, payload}`.',
          'Send `reflect` to `kernel` through `user`. If the reply’s `reason` is `unauthorized`, the page shows “The host refused this canvas” with the reason, and stops.',
          'List the host’s agents, keep the canvases, and pick one: `?canvas=<id>` if given, else the main one, else the first. An unknown id shows “no canvas <id> on this host”.',
          'Load that canvas’s page bundles and page records through its loader, a `kernel_state` agent on the host. An empty tree is seeded with the canvas root. Every later local change is persisted back through the same loader.',
          'Boot the root. The first boot mints the page’s guid, and the host addresses the page as `<guid>|canvas`. Then mount the canvas.',
        ] },
        { video: 'boot' },
        'The page also watches its own `bundles/` folder on the host through the `bundles_watch` bridge. When a file changes, it waits 150 ms, collects the burst, and sends `reload_bundle` for each touched folder. Nothing runs while nothing changes. When the host stops, it calls `host_stopping` on the page first, and the page flushes its records and stops its loader before the socket closes.',
        'The Home page, `home.html`, boots the same way. It mounts one view onto the host’s `home` agent, and its open pages and selection live in that agent’s state, not in page records.',
      ],
    },
  ],
  sources: [
    ['canvas_page bundle: verbs, files and read_stream', src('src/tui/bundles/fantastic-canvas-page/src/lib.rs', 29)],
    ['build.rs: pack, then embed', src('src/tui/bundles/fantastic-canvas-page/build.rs', 11)],
    ['pack.sh: one bundle, vendors inlined', src('src/tui/web/canvas/scripts/pack.sh', 1)],
    ['zip_repro.sh: the reproducible zip', src('src/tui/bundles/fantastic-canvas-page/tests/zip_repro.sh', 1)],
    ['kern/web.rs: creating the page and both grants', src('src/tui/src/kern/web.rs', 308)],
    ['main.ts: the page’s boot', src('src/tui/web/canvas/src/main.ts', 118)],
    ['user_bridge.ts: every call through user', src('src/tui/web/canvas/src/user_bridge.ts', 1)],
    ['the canvas app', tree('src/tui/web/canvas')],
  ],
  clips: {
    embed: {
      title: 'Packed at build, embedded in the binary',
      caption: 'build.rs runs pack.sh, which turns the canvas app into canvas.zip with three entries: readme.md, bundle.min.js and bundle.min.js.map. The crate embeds the zip with include_bytes!, so the binary carries the page. A failed pack fails the build.',
    },
    serve: {
      title: 'Serving it: the web host reads as itself',
      caption: 'A browser asks web for /canvas_page/file/index.html. web sends read_stream to canvas_page as itself, with can_call and callable_by both granting it. canvas_page answers with the bytes and a head. A name it does not hold is refused with not_found.',
    },
    boot: {
      title: 'What the page does when it loads',
      caption: 'The page kernel sends reflect to kernel through user.forward. An unauthorized reply stops it with a refusal. Otherwise it picks a canvas, loads its records through the loader, boots its root to mint a guid, and mounts the canvas.',
    },
  },
}
