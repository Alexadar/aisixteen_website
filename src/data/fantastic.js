// Content for the dedicated /fantastic/ page. Source of truth for the copy is the
// public repo README (github.com/aisixteen/fantastic) — keep claims in step with it.
// The Apple client and relay repos are private: describe them, never link them.
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
  // Launch-directory badges. LaunchNest verifies the backlink: keep the <a> followed
  // (no nofollow/sponsored/ugc) and keep their hosted image URL.
  badges: [
    { href: 'https://launchnest.io/p/fantastic', src: 'https://launchnest.io/badge/fantastic.svg?variant=featured', alt: 'Fantastic on LaunchNest', width: 220, height: 56 },
  ],
  tagline: 'A medium that unifies humans and AIs into a single workspace.',
  short: 'A kernel of agents: models, programs, files, shells, a browser canvas and you, all in one tree, all reached with one call.',
  blurb: 'Fantastic is a kernel of agents. A model, a program, a file tree, a shell, a browser canvas and the human at the keyboard are all agents in one tree, addressed by id and reached the same way: one call, send. Compute, inference and memory are interchangeable — a step written as code and the same step written as an LLM call plug into the wiring identically.',
  oneCall: '[{"target": "kernel",\n  "payload": {"type": "reflect", "readme": true}}]',
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
  family: [
    { name: 'Fantastic CLI & canvas', state: 'Available', text: 'A terminal coder, a browser canvas where you build and run your own systems visually with an AI, and an MCP face for coding CLIs. macOS and Linux, arm64 and x86_64.' },
    { name: 'Apple client', state: 'In development', text: 'A native SwiftUI app for Mac, iPhone, iPad, Vision Pro and Apple Watch that runs the Swift kernel in-process — or attaches to a remote kernel over SSH, with no difference in architecture.' },
    { name: 'Relay', state: 'In development', text: 'A relay-kernel that turns connected kernels into agents: an addressable router with a live directory, so kernels reach each other through NAT and firewalls.' },
  ],
  install: [
    { label: 'From crates.io', note: 'Needs Rust 1.88 or newer and a C compiler (Xcode Command Line Tools on macOS, build-essential on Linux). All four AI backends are on by default.', code: 'cargo install fantastic' },
    { label: 'Prebuilt binary (Apple silicon)', code: 'curl -LO https://github.com/aisixteen/fantastic/releases/latest/download/fantastic-aarch64-apple-darwin.tar.gz\ntar xzf fantastic-aarch64-apple-darwin.tar.gz && sudo mv fantastic /usr/local/bin/' },
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
