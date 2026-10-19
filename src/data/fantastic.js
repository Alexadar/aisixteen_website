// Content for the dedicated /fantastic/ page. Source of truth for the copy is the
// public repo README (github.com/aisixteen/fantastic) — keep claims in step with it.
// The Apple client and relay repos are private: describe them, never link them.
import { compareGroups } from './fantastic-compare.js'

export const fantastic = {
  slug: 'fantastic',
  name: 'Fantastic',
  fullName: 'Aisixteen Fantastic',
  accent: '#3d82d8',
  icon: 'fantastic/icon.png',
  status: 'Open source · Alpha',
  license: 'AGPL-3.0-or-later',
  repo: 'https://github.com/aisixteen/fantastic',
  releases: 'https://github.com/aisixteen/fantastic/releases/latest',
  crate: 'https://crates.io/crates/fantastic',
  roadmap: 'https://github.com/orgs/aisixteen/projects/1',
  tagline: 'A medium that unifies humans and AIs into a single workspace.',
  short: 'A kernel of agents: models, programs, files, shells, a browser canvas and you, all in one tree, all reached with one call.',
  blurb: 'Fantastic is a kernel of agents. A model, a program, a file tree, a shell, a browser canvas and the human at the keyboard are all agents in one tree, addressed by id and reached the same way: one call, send. Compute, inference and memory are interchangeable — a step written as code and the same step written as an LLM call plug into the wiring identically.',
  // The README hero, rendered from .fantastic/bundles/readme_hero in the fantastic repo
  // (manim, 1600×800). Chapter times match the slide list drawn inside the video.
  video: {
    src: 'fantastic/hero.mp4',
    poster: 'fantastic/hero-poster.jpg',
    width: 1600,
    height: 800,
    duration: 'PT2M4S',
    uploadDate: '2026-10-16',
    title: 'How Aisixteen Fantastic works',
    description: 'A two-minute tour: the kernel, how it differs from typical agent harnesses, the two kernels behind fantastic canvas, a coding agent connecting, and what you can build — a dashboard, artwork, a chatbot, or your own.',
    chapters: [
      { t: 5.5, label: 'The kernel' },
      { t: 15.75, label: 'vs typical harnesses' },
      { t: 24.5, label: 'A meta-runtime' },
      { t: 29.25, label: 'Built on it: the canvas' },
      { t: 40.25, label: 'Two kernels, one tree' },
      { t: 53.25, label: 'The canvas' },
      { t: 64, label: 'A coding agent connects' },
      { t: 74, label: 'Dashboard' },
      { t: 85.25, label: 'Artwork' },
      { t: 95.25, label: 'Chatbot' },
      { t: 110, label: 'Yours' },
    ],
  },
  compareGroups,
  layers: {
    engine: { name: 'The engine', title: 'A meta-runtime', text: 'The kernel of agents: one verb, a two-sided call gate, a ledger, memory, a scheduler — in Python, Rust, Swift and TypeScript. It is not a harness for one app; it is ready to power any AI app, yours included.' },
    product: { name: 'The product', title: 'fantastic canvas', text: 'The open-source workbench built on that engine: a browser canvas where you and an AI build, run and wire your own systems. One repo holds both layers — the engine and the harness of Emergent Software.' },
  },
  // Video slide 5: the canvas is two kernels bridged by one WebSocket.
  twoKernels: {
    page: { name: 'Page kernel', where: 'in your browser tab', role: 'TypeScript · draws the views' },
    host: { name: 'Host kernel', where: 'on your machine', role: 'One binary · runs the agents, files and processes' },
    points: [
      'Bridged by one WebSocket — the same send crosses it.',
      'One tree: both kernels’ agents in one view, one address space.',
      'Every agent is a backend on the host, with its view on the page.',
      'A click on a chart is a send to chart_agent on your machine.',
    ],
  },
  // Video slides 6–7: how a coding agent starts working inside the canvas.
  flow: [
    { cmd: '$ fantastic canvas', text: 'One command opens the canvas.' },
    { cmd: 'double-click', text: 'Open a coding agent — Claude, Codex, Aider, opencode — in a terminal cell inside the canvas.' },
    { cmd: 'read .fantastic', text: 'It doesn’t know Fantastic yet: it reads .fantastic, connects over fantastic mcp and reflects the canvas — every agent and its docs.' },
    { cmd: 'build', text: 'Now it builds with the same verbs as every other agent — spawning sub-agents, each with its own view, wired by grants.' },
  ],
  // Video slides 8–11: what you can build on the canvas.
  build: [
    { key: 'dashboard', t: 74, title: 'A dashboard', text: 'Each cell is a view plus a running backend agent the AI wrote. Grants wire them together, and a click on the page is a send to the agent behind it.' },
    { key: 'artwork', t: 85.25, title: 'Artwork', text: 'Design mocks on the page, a Blender agent rendering the scene, and the movie streaming back into the canvas frame by frame.' },
    { key: 'chatbot', t: 95.25, title: 'A chatbot', text: 'Designed on the canvas as an isolated kernel — AI, docs, memory — then moved off it as a separate headless process on your server. Close the canvas; it keeps answering.' },
    { key: 'yours', t: 110, title: 'Yours', text: 'Whatever you imagine. Ultimate creativity is you.' },
  ],
  oneCall:'[{"target": "kernel",\n  "payload": {"type": "reflect", "readme": true}}]',
  oneCallNote: 'There is no client library. The protocol is the API: every agent answers reflect with what it is, and docs says how to call it. Given only those self-descriptions, an AI wires the system itself.',
  concepts: [
    { term: 'Agents', text: 'A recursive tree. Each agent runs a bundle (a handler module) and keeps its state in its own record.' },
    { term: 'send', text: 'The one primitive: batched, concurrent, each item a kernel task you can ps and cancel, joinable and idempotent by id.' },
    { term: 'reflect / docs', text: 'What an agent is, and how to call it — the whole self-description, one round-trip each.' },
    { term: 'The call gate', text: 'Deny-all and two-sided: a call passes only when the caller’s can_call and the target’s callable_by both grant it.' },
    { term: 'Bridges', text: 'Every edge to the outside — another kernel, the disk, a process, a browser, an MCP server — is an IO leg, sealed until opened.' },
    { term: 'Memory', text: 'Every message lives in a memory store agent; AI agents fold, recall and page their own history.' },
  ],
  inTheBox: [
    { title: 'AI agents', text: 'vLLM, Ollama, the OpenAI Responses API and Anthropic’s Messages API — plus Apple’s on-device model in Swift. Tool calling uses the kernel’s own prompt-taught grammar, so any capable model drives the same verbs.' },
    { title: 'IO legs', text: 'Files, edits, streams and watches clamped to the running dir; allow-listed commands and PTY terminals; browser and HTTP faces; kernel-to-kernel links; a remote MCP server’s tools as verbs.' },
    { title: 'Folder bundles', text: 'Drop bundles/<name>/bundle.yaml plus a program into .fantastic/ and it becomes a new kind of agent — hot-reloadable.' },
    { title: 'Kernel services', text: 'A scheduler, credentials by reference with secret fields masked in records and events, a persistent tree on disk, and a task table with Unix-style ps / cancel.' },
  ],
  runtimes: [
    { name: 'Python', role: 'The reference. When runtimes disagree, Python is right.' },
    { name: 'Rust', role: 'Server and CLI host — the fantastic binary.' },
    { name: 'Swift', role: 'Apple platforms, linked in-process by the Apple client.' },
    { name: 'TypeScript', role: 'The browser frontend kernel, served by any host.' },
  ],
  // ---- The stack, the roadmap and the architecture ----
  // Status reflects what a visitor can install, checked against the repo and epic #57
  // (aisixteen/fantastic#57, re-read 2026-10-19). `parts` marked done are merged in the
  // source but not in a release yet — never present them as shipped. Private repos
  // (Apple client, Relay) are "In development" and are never linked.
  epic: 'https://github.com/aisixteen/fantastic/issues/57',
  heroSub: 'One product family across the whole stack: a kernel library in four runtimes, the fantastic CLI, a browser canvas and an MCP server you can install today, with a desktop app and fantastic OS on the way.',
  homeSub: 'Built from scratch, layer by layer: a kernel of agents in four runtimes, the fantastic CLI and a browser canvas today; a desktop app and fantastic OS next. Open source, for macOS, Linux and Windows.',
  stackLead: 'Fantastic is built from scratch, layer by layer: a kernel library in four runtimes, the fantastic CLI, a browser canvas and an MCP server you can install today; a desktop app, its Home and skins in progress; fantastic OS on the roadmap. One protocol runs through every layer.',
  statuses: {
    available: { label: 'Available', note: 'In a public release you can use today.' },
    progress: { label: 'In progress', note: 'Being built. ✓ = merged in the source, not yet released.' },
    dev: { label: 'In development', note: 'Built in a private repo; not released.' },
    soon: { label: 'Coming soon', note: 'On the public roadmap; not started.' },
    stretch: { label: 'Stretch', note: 'An ambition, not a commitment.' },
    host: { label: 'Host', note: 'The platform underneath; not ours.' },
  },
  // Top to bottom. `span` is the block's width on a 12-column row.
  stack: [
    {
      key: 'apps', name: 'Apps & shells', id: 'what you touch',
      blocks: [
        { name: 'Browser canvas', id: 'fantastic canvas', status: 'available', span: 3, text: 'Build, run and wire your own systems visually with an AI, in the browser.' },
        { name: 'Terminal UI', id: 'fantastic', status: 'available', span: 3, text: 'The terminal coder. Run from an agent’s shell, it prints its docs and starts nothing.' },
        { name: 'Desktop app', id: 'Tauri 2', status: 'progress', span: 3, issue: 48, text: 'A thin native shell beside the CLI: it runs the home kernel in-process and shows Home in one window. macOS, Windows, Linux.' },
        { name: 'Apple client', id: 'SwiftUI', status: 'dev', span: 3, text: 'Mac, iPhone, iPad, Vision Pro and Apple Watch. Runs the Swift kernel in-process, or attaches to a remote kernel over SSH.' },
        { name: 'Native apps as canvas cells', status: 'stretch', span: 12, issue: 56, text: 'Native apps such as a browser or an editor inside canvas cells, panning and zooming with the canvas. It starts with a compositor spike.' },
      ],
    },
    {
      key: 'home', name: 'Home', id: '~/.fantastic/',
      blocks: [
        { name: 'Home kernel', id: 'fantastic-home-kernel', status: 'progress', span: 5, text: 'A minimal kernel the desktop app runs in-process. Its home agent lists, opens, starts and stops your fantastics; its state lives in ~/.fantastic/app/.',
          parts: [{ text: 'Library, home agent and OS layer', done: true, issue: 46 }, { text: 'Everything under ~/.fantastic', done: true, issue: 71 }, { text: 'Home UI as canvas view bundles', issue: 47 }] },
        { name: 'Model + ViewModel', id: 'fantastic-home', status: 'progress', span: 3, text: 'Pure: no OS, no I/O, no clock. Events in, effects out, rows to draw.',
          parts: [{ text: 'The pure crate', done: true, issue: 45 }] },
        { name: 'Skins', id: 'design tokens', status: 'progress', span: 4, text: 'Every colour, radius, font and motion value is a token. Stock skins dark and glass; an AI can write more.',
          parts: [{ text: 'Tokens and the skin agent', done: true, issue: 49 }, { text: 'The reskin contract', issue: 50 }] },
      ],
    },
    {
      key: 'cli', name: 'CLI', id: 'one binary',
      blocks: [
        { name: 'The fantastic CLI', id: 'fantastic', status: 'available', span: 12, text: 'One static binary that runs the Rust kernel in-process: terminal UI, canvas and MCP face. macOS and Linux (arm64, x86_64), Windows (x86_64). From crates.io or GitHub releases.' },
      ],
    },
    {
      key: 'kernel', name: 'Kernel library', id: 'one protocol',
      blocks: [
        { name: 'Python', id: 'src/lib/python', status: 'available', span: 3, text: 'The reference. When runtimes disagree, Python is right.' },
        { name: 'Rust', id: 'src/lib/rust', status: 'available', span: 3, text: 'Server and CLI host — the kernel inside fantastic.' },
        { name: 'Swift', id: 'src/lib/swift', status: 'available', span: 3, text: 'Apple platforms, linked in-process by the Apple client.' },
        { name: 'TypeScript', id: 'src/lib/ts', status: 'available', span: 3, text: 'The browser kernel: the canvas page, served by any host.' },
        { name: 'Contract corpus', id: 'contract/', status: 'available', span: 12, text: 'Cross-runtime requirements written as data and run by every host, pinning identical behaviour across them.' },
      ],
    },
    {
      key: 'bridges', name: 'Bridges', id: 'IO legs',
      blocks: [
        { name: 'IO legs', id: 'file_bridge · exec_bridge · web_ws · mcp_client', status: 'available', span: 6, text: 'Files, commands and terminals, the browser and HTTP faces, kernel-to-kernel links, a remote MCP server’s tools. Each sealed until opened.' },
        { name: 'MCP face', id: 'fantastic mcp', status: 'available', span: 3, text: 'MCP over stdio, so a coding CLI drives the kernel.' },
        { name: 'Relay', id: 'relay-kernel', status: 'dev', span: 3, text: 'An addressable router with a live directory: kernels reach each other through NAT and firewalls.' },
      ],
    },
    {
      key: 'os', name: 'Operating system', id: 'boots into fantastic',
      blocks: [
        { name: 'Your OS today', id: 'macOS · Linux · Windows', status: 'host', span: 4, text: 'Fantastic runs as a program on the system you already have.' },
        { name: 'fantastic OS', id: 'Debian + Wayland kiosk', status: 'soon', span: 4, issue: 54, text: 'A headless Debian image that boots into the desktop app’s Home, full-screen under a Wayland kiosk compositor.' },
        { name: 'System agents', id: 'network · audio · power · displays', status: 'soon', span: 4, issue: 55, text: 'The machine itself as agents, reached with the same send.' },
      ],
    },
    {
      key: 'hw', name: 'Hardware', id: 'arm64 · x86_64',
      blocks: [
        { name: 'Your machine', id: 'arm64 · x86_64', status: 'host', span: 12, text: 'Mac, PC or Linux box.' },
      ],
    },
  ],
  // Epic #57: "From the fantastic app to fantastic OS". No hours or dates are published.
  roadmapTitle: 'From the fantastic app to fantastic OS',
  milestones: [
    { id: 'M1', name: 'App MVP', status: 'progress', url: 'https://github.com/aisixteen/fantastic/milestone/1', text: 'The manager of your fantastics as a desktop app: Home lists them with live status; open, start and stop them.',
      items: [
        { issue: 45, text: 'Pure home model and ViewModel crate', done: true },
        { issue: 46, text: 'Home kernel: an in-process library with the home agent and its OS layer', done: true },
        { issue: 71, text: 'Home layout v2: everything under ~/.fantastic', done: true },
        { issue: 47, text: 'Home UI as canvas view bundles', status: 'progress' },
        { issue: 48, text: 'Tauri desktop app for macOS, Windows and Linux', status: 'progress' },
      ] },
    { id: 'M2', name: 'Cross-platform app and the reskin contract', status: 'progress', url: 'https://github.com/aisixteen/fantastic/milestone/2', text: 'Tauri on macOS, Windows and Linux with signed installers; one UI, many skins, and the contract other projects reskin.',
      items: [
        { issue: 49, text: 'Skins: design tokens and a skin agent', done: true },
        { issue: 50, text: 'The reskin contract' },
        { issue: 51, text: 'Installers and signing' },
        { issue: 52, text: 'Linux rendering and per-OS polish' },
      ] },
    { id: 'M3', name: 'fantastic OS: kiosk', status: 'soon', url: 'https://github.com/aisixteen/fantastic/milestone/3', text: 'A Debian headless image that boots straight into fantastic.',
      items: [{ issue: 54, text: 'Debian headless kiosk image' }] },
    { id: 'M4', name: 'fantastic OS: system agents', status: 'soon', url: 'https://github.com/aisixteen/fantastic/milestone/4', text: 'Network, audio, power and displays as agents.',
      items: [{ issue: 55, text: 'System agents' }] },
    { id: '+', name: 'Stretch', status: 'stretch', text: 'Beyond the four milestones.',
      items: [{ issue: 56, text: 'Native apps as canvas cells' }] },
  ],
  deferred: { issue: 53, text: 'Retiring the Swift kernel runtime (keeping the Foundation Models bridge) is deferred: Swift stays for now.' },
  // Epic #57's architecture principles, drawn as the schematic. `issue` = the phase that builds it.
  arch: [
    { layer: 'Shell', name: 'Tauri 2 · Wayland kiosk', id: 'macOS · Windows · Linux · fantastic OS', status: 'progress', issues: [{ n: 48, status: 'progress' }, { n: 54, status: 'soon' }], text: 'A native window beside the CLI on each desktop; full-screen on fantastic OS.', link: 'hosts' },
    { layer: 'Skin', name: 'Design tokens + native backdrop', id: 'dark · glass', status: 'progress', issues: [{ n: 49, done: true }, { n: 50, status: 'soon' }], text: 'Swap the skin, keep the app.', link: 'styles' },
    { layer: 'View', name: 'Canvas view bundles', id: 'Home UI', status: 'progress', issues: [{ n: 47, status: 'progress' }], text: 'Render the state; send intents.', link: ['events', 'rows'] },
    { layer: 'ViewModel', name: 'Model + ViewModel', id: 'fantastic-home', status: 'progress', issues: [{ n: 45, done: true }], text: 'Pure: no OS, no I/O, no clock. Events in, effects out.', link: ['effects', 'answers'] },
    { layer: 'OS layer', name: 'Home kernel → sys', id: 'home/sys: unix · windows', status: 'progress', issues: [{ n: 46, done: true }], text: 'Every OS call lives here, one module per OS family.' },
  ],
  principles: [
    { term: 'MVVM, pure', text: 'Model and ViewModel live in a dependency-free crate. The OS is reached only through sys modules, one per OS family; views render state and send intents.' },
    { term: 'Home is a fantastic', text: 'A minimal home kernel, a library the desktop app runs in-process, manages your fantastics. Its state lives in ~/.fantastic/app/.' },
    { term: 'One UI, many skins', text: 'Design tokens plus a native backdrop. The home protocol, the pure crate and the token schema form a contract any project can reskin.' },
    { term: 'Green on three OSes', text: 'Every phase lands with CI green on Linux, macOS and Windows.' },
  ],
  comingSoon: [
    { name: 'The desktop app', status: 'progress', text: 'A Tauri 2 app for macOS, Windows and Linux that lives beside the CLI. Home lists your fantastics with live status and opens, starts and stops them; skins restyle it, and signed installers ship it.' },
    { name: 'fantastic OS', status: 'soon', text: 'A Debian headless image that boots straight into fantastic: a Wayland kiosk runs the desktop app full-screen, and network, audio, power and displays become agents you reach with the same send.' },
  ],
  install: [
    { label: 'From crates.io', note: 'Needs Rust 1.88 or newer and a C compiler (Xcode Command Line Tools on macOS, build-essential on Linux). The canvas page comes prebuilt, so no Go is needed. All four AI backends — vLLM, Ollama, OpenAI Responses and Anthropic — are on by default.', code: 'cargo install fantastic --locked' },
    { label: 'Prebuilt binary (Apple silicon)', note: 'Archives for Apple silicon and Intel Macs, static Linux binaries (arm64 and x86_64) and a Windows (x86_64) zip are on the latest release, with SHA256SUMS beside them.', code:'curl -LO https://github.com/aisixteen/fantastic/releases/latest/download/fantastic-aarch64-apple-darwin.tar.gz\ntar xzf fantastic-aarch64-apple-darwin.tar.gz && sudo mv fantastic /usr/local/bin/' },
  ],
  agentPrompt: 'Run `fantastic` and read what it prints. Explain to me what it is, then ask me how I want to run it.',
  commands: [
    ['fantastic', 'the terminal UI'],
    ['fantastic canvas', 'the browser canvas'],
    ['fantastic ai vllm -p PORT', 'the root AI on a backend'],
    ['fantastic run CMD', 'your own program in a terminal cell'],
    ['fantastic mcp', 'MCP over stdio for a coding CLI'],
    ['fantastic readme [key]', 'the docs'],
  ],
  security: 'Nothing is open by default. Every IO leg denies until an operator opens it, grants are explicit on both ends of a call, an agent never raises its own authority, and file access is clamped to the directory the kernel runs in. One root reflect shows the whole landscape.',
}
