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
    uploadDate: '2026-10-16T03:50:00+03:00',
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
    { name: 'Python', short: 'the reference', role: 'The reference. When runtimes disagree, Python is right.' },
    { name: 'Rust', short: 'CLI & server host', role: 'Server and CLI host — the fantastic binary.' },
    { name: 'Swift', short: 'Apple, in-process', role: 'Apple platforms, linked in-process by the Apple client.' },
    { name: 'TypeScript', short: 'the browser kernel', role: 'The browser frontend kernel, served by any host.' },
  ],
  // ---- Landing copy (the /fantastic/ redesign) ----
  // Kept deliberately light, but every line is true to the repo (README, CHANGELOG) and
  // the public roadmap. Nothing unreleased is called available. No issue links, no dates,
  // no effort numbers. The Apple client and the relay are private: describe, never link.
  heroSub: 'A kernel of agents, built from scratch. Models, programs, files and you share one tree, and one call reaches all of them.',
  homeSub: 'Built from scratch, layer by layer: a kernel of agents in four runtimes, the fantastic CLI and a browser canvas today; a desktop app and fantastic OS next. Open source, for macOS, Linux and Windows.',
  // Visible as the #stack lead, and used as the SoftwareApplication description.
  stackLead: 'Built from scratch at every layer: a kernel library in four runtimes, the fantastic CLI and a browser canvas you can use today, with a desktop app and fantastic OS coming soon. One protocol runs through all of it.',
  statuses: {
    available: { label: 'Available' },
    progress: { label: 'In progress' },
    soon: { label: 'Coming soon' },
    stretch: { label: 'Stretch' },
  },
  // Top to bottom. Used by the isometric stack (/fantastic/#stack) and the home strip.
  stackLayers: [
    { key: 'apps', name: 'Apps', status: ['available', 'soon'], text: 'The browser canvas and the terminal UI today. A desktop app and a native Apple client next.' },
    { key: 'home', name: 'Home', status: ['soon'], text: 'One place to open, start and stop every fantastic, in any skin.' },
    { key: 'cli', name: 'CLI', status: ['available'], text: 'One static binary for macOS, Linux and Windows.' },
    { key: 'kernel', name: 'Kernel library', status: ['available'], text: 'Python, Rust, Swift and TypeScript, held to one contract.' },
    { key: 'bridges', name: 'Bridges', status: ['available', 'soon'], text: 'Files, processes, browsers, other kernels and MCP servers, each sealed until opened. A relay comes next.' },
    { key: 'os', name: 'fantastic OS', status: ['soon'], text: 'An image that boots straight into fantastic.' },
  ],
  // The ad reel. The OS and desktop visuals are drawings of the plan, badged as such.
  reel: [
    // Each step lights up at `t` seconds, in sync with the drawing beside it.
    { key: 'os', name: 'fantastic OS', status: 'soon', tone: '#b48cff',
      title: 'An agentic OS that builds with you.',
      text: 'A new kind of operating system: it boots straight into fantastic, the machine itself is made of agents, and the interface grows as you and an AI build it.',
      steps: [['Power on: it boots straight into Home.', 0.4], ['Network, audio, power and displays answer as agents.', 2.1], ['Ask for a tool, and an AI builds its view and its function.', 3.7]] },
    { key: 'app', name: 'The desktop app', status: 'soon', tone: '#55d3ff',
      title: 'Every fantastic, one click away.',
      text: 'Home lists every workspace you have, with live status. Click one and its canvas opens in the same window, ready to build on with an AI.',
      steps: [['Home shows every fantastic, live.', 0.4], ['Click Open: its canvas fills the window.', 2.5], ['Build views and agents on it with an AI, in any skin.', 3.9]] },
    { key: 'cli', name: 'The fantastic CLI', status: 'available', tone: '#4fc27a',
      title: 'One binary. The whole kernel.',
      text: 'Install it in one line, then run it three ways: a terminal UI, a browser canvas where you build with an AI, or an MCP server your coding agent drives.',
      steps: [['Install it with one cargo command.', 0.4], ['fantastic canvas opens the canvas in your browser.', 2.2], ['fantastic mcp lets Claude Code or Codex plug in.', 3]] },
    { key: 'lib', name: 'The kernel library', status: 'available', tone: '#3d82d8',
      title: 'Four runtimes. One protocol.',
      text: 'The kernel underneath it all: everything is an agent in one tree, reached with one call. The same protocol runs in Python, Rust, Swift and TypeScript.',
      steps: [['A model, a program, files and you: all agents.', 0.4], ['One call, send, reaches any of them.', 1.5], ['One contract keeps all four runtimes identical.', 2.7]] },
  ],
  // Runs-with marquee: AI backends and coding agents named in the README.
  worksWith: ['vLLM', 'Ollama', 'OpenAI Responses API', 'Anthropic Messages API', 'Apple on-device model', 'MCP', 'Claude Code', 'Codex', 'Gemini CLI', 'Aider', 'opencode'],
  // Epic "From the fantastic app to fantastic OS". Rendered as progress only: no issue
  // numbers, no dates, no effort figures.
  milestones: [
    { id: 'M1', name: 'App MVP', status: 'progress', text: 'Home lists your fantastics with live status; open, start and stop them.', done: 3, total: 5 },
    { id: 'M2', name: 'Cross-platform app', status: 'progress', text: 'macOS, Windows and Linux with signed installers; one UI, many skins.', done: 1, total: 4 },
    { id: 'M3', name: 'fantastic OS: kiosk', status: 'soon', text: 'A Debian image that boots straight into fantastic.', done: 0, total: 1 },
    { id: 'M4', name: 'fantastic OS: system agents', status: 'soon', text: 'Network, audio, power and displays as agents.', done: 0, total: 1 },
  ],
  principles: ['A pure core: no OS, no I/O, no clock', 'One UI, many skins', 'Green on Linux, macOS and Windows'],
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
