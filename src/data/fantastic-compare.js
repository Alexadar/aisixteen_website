// The harness comparison from the README (October 2026). typical, text and gap are the
// README wording verbatim (gap = its "Not built" admission, split out to show it plainly);
// group and headline are page-only scaffolding for scanning.
export const compareGroups = [
  {
    "group": "The loop",
    "rows": [
      {
        "area": "Agent loop",
        "headline": "Flat async flows — one batch per turn",
        "typical": "a while-loop per agent (model → tools → repeat until a step cap), or a hand-built state graph",
        "text": "No loop object. A model pass is one message; a chain continues only when the model sends — to itself or to others. All calls of a turn dispatch at once as one kernel batch, and their replies come back later as one message: flat asynchronous flows between addressable agents, mailbox-style. A chain ends only by the model's own `done`; silent turns are capped and thought-only turns are rerolled"
      },
      {
        "area": "Tool calling",
        "headline": "One prompt-taught grammar on every model",
        "typical": "the provider's native function-calling API with JSON schemas",
        "text": "One prompt-taught `<call>` tag grammar, no JSON on the model path, the same on every provider and local model. A malformed call gets a compiler-style report (line, caret, the form to write); a call written inside the model's thinking never runs"
      },
      {
        "area": "Tool discovery",
        "headline": "Self-describing agents, read on demand",
        "typical": "a fixed tool list in the prompt; skill files for progressive disclosure",
        "text": "Every agent answers `reflect` (what it is) and `docs` (how to call it, one-liners or detailed). A model drills down on demand, and docs it already read shrink to stubs"
      },
      {
        "area": "Parallel tool calls",
        "headline": "500 calls, one kernel batch",
        "typical": "parallel calls in one turn, when the provider supports them",
        "text": "Every send is a batch. One turn of 500 calls runs as one kernel batch on every runtime"
      }
    ]
  },
  {
    "group": "Many agents",
    "rows": [
      {
        "area": "Multi-agent",
        "headline": "Every AI is an addressable agent",
        "typical": "handoffs, supervisor, swarm, agent-as-tool, sub-agents with their own context",
        "text": "Every AI is an agent with an id: AI-to-AI sends, fan-out to many recipients, inquiries between AIs. Models build their own durable teams — sub-AIs, workers, schedules — and tear them down. No prebuilt supervisor or handoff presets"
      },
      {
        "area": "Graphs and workflows",
        "headline": "The agent tree is the graph",
        "typical": "an explicit state-graph or workflow DSL with conditional edges, cycles and fan-out",
        "text": "No graph DSL. The graph is the agent tree plus its grant edges, and a node can be code, a model, a process or a file store — interchangeably. Models wire graphs from the agents' own self-descriptions; a scheduler drives recurring flows"
      },
      {
        "area": "Human in the loop",
        "headline": "You are an agent too — approvals run once",
        "typical": "interrupt and resume; approve, edit or reject a tool call; permission modes",
        "text": "The human is an agent (`user`). A model asks through `inquiry` (text, single, multi, confirm) or a plain send and continues when answered; nothing blocks the kernel. Approval splits the rights: a model without the grant proposes a named action, the person who holds it approves, and it runs exactly once under the approver's authority.",
        "gap": "Not built: turning a denied call into an approval question automatically"
      }
    ]
  },
  {
    "group": "State and memory",
    "rows": [
      {
        "area": "Durable state",
        "headline": "A named run executes once",
        "typical": "a per-thread checkpointer; crash-resume through a durable execution engine (Temporal, DBOS, Restate, Inngest) that logs every step and replays to the point of the crash",
        "text": "A kernel ledger: every call and its outcome is a row in a memory-store agent. A named execution is idempotent — a repeat joins it or gets its recorded outcome — with retries and dead letters (listed, acked, never silently re-sent). The agent tree, schedules and conversations are persisted and rehydrate.",
        "gap": "Not built: replaying an interrupted turn to where it stopped — an interrupted call becomes a dead letter"
      },
      {
        "area": "Checkpoints and time travel",
        "headline": "Rewind and fork are a projection away",
        "typical": "replay or fork a run from a past checkpoint; coding CLIs rewind edits through a shadow git repo",
        "text": "The ledger already holds every conversation row and every tree change, so both are a projection away from rewind and fork.",
        "gap": "Not built: the rewind verb, and the record of replaced file bytes — today one undo slot per edited file"
      },
      {
        "area": "Memory",
        "headline": "Exact recall — no vector search, by design",
        "typical": "thread state, a long-term store with vector search, self-edited memory blocks, instruction files",
        "text": "Every message lives in a memory-store agent (RAM, or SQLite with full-text search in the CLI), per agent, searchable with `grep` and `recall`. Durable notes are files the model writes through a file agent. No vector search, by design: similarity is approximate, and a memory read should return exactly what was written"
      },
      {
        "area": "Context management",
        "headline": "Folds of folds — nothing deleted",
        "typical": "summarize or compact at a threshold; tool-result clearing",
        "text": "Nested folds: the model summarizes spans of its own history, then folds of folds. Nothing is deleted — `recall`, `grep` and descending into a fold reach everything; `clear` is a boundary, not a deletion. The budget is calibrated from the server's own prompt-size reports"
      }
    ]
  },
  {
    "group": "Control and safety",
    "rows": [
      {
        "area": "Security",
        "headline": "A deny-all gate — both ends must grant",
        "typical": "approval modes, hooks, OS sandboxes (Seatbelt, bubblewrap, containers, microVMs), guardrail classifiers",
        "text": "A deny-all, two-sided call gate on every agent-to-agent call; every IO leg sealed until opened; file access clamped to the run directory with an allow list; commands allow-listed by regex; secret marks; credentials by reference, bound to one host.",
        "gap": "That governs what may be launched; containing a launched process is not built — no OS sandbox, so an allowed command runs with the user's rights"
      },
      {
        "area": "Streaming and cancellation",
        "headline": "Every dispatch is a task you can cancel",
        "typical": "token and event streams, an abort signal",
        "text": "Streamed parts (text, thinking, call drafts) to whoever watches; the receiver can stop a stream. Every dispatch is a kernel task: `ps` lists them, `cancel` kills a whole subtree, real OS processes included. Timeouts are per item and never defaulted"
      },
      {
        "area": "Observability",
        "headline": "A live stream, a ledger and a task table",
        "typical": "OpenTelemetry traces, hosted tracing, eval suites, visual debuggers",
        "text": "A live state stream of who sent what to whom, the ledger, the task table, and the canvas views over them. No OpenTelemetry export; evaluation is the e2e suites and an Exercism benchmark"
      },
      {
        "area": "Background work",
        "headline": "A persisted scheduler, under its own grants",
        "typical": "hosted agent runtimes, cron triggers, cloud background agents",
        "text": "A scheduler (interval-based, persisted, fires under its own grants), command and terminal jobs as kernel tasks, folder-bundle programs as agents. No cron expressions, no hosted platform"
      }
    ]
  },
  {
    "group": "Platform",
    "rows": [
      {
        "area": "Protocols",
        "headline": "MCP both ways, plus its own wire",
        "typical": "MCP client (universal), MCP server, A2A, AG-UI, ACP",
        "text": "MCP client (2026-07-28; each remote tool becomes a verb), an MCP server face for coding CLIs (`fantastic mcp`, stdio), its own WebSocket and REST wire, and kernel-to-kernel bridges, direct or through a relay. No A2A, AG-UI or ACP"
      },
      {
        "area": "Runtimes",
        "headline": "One protocol, four runtimes",
        "typical": "mostly Python and TypeScript; some .NET, Go, Java",
        "text": "One protocol in Python, Rust and Swift (in-process on Apple platforms) plus a browser kernel in TypeScript; a single static binary; a contract corpus pins identical behaviour across them"
      },
      {
        "area": "Models",
        "headline": "The same call grammar on every backend",
        "typical": "provider SDKs; other providers through adapters",
        "text": "vLLM, Ollama, the OpenAI Responses API, Anthropic, and Apple's on-device model — the same call grammar on all; a KV-cache slot table for shared vLLM servers"
      },
      {
        "area": "UI",
        "headline": "A terminal UI and a live canvas",
        "typical": "chat UI kits, generative UI, IDE extensions, studios",
        "text": "A terminal UI and a browser canvas where a model builds live panels, terminals and services and wires them by grants"
      },
      {
        "area": "Extensibility",
        "headline": "A folder becomes a new kind of agent",
        "typical": "plugins, skill files, tools written in code",
        "text": "Folder bundles — a `bundle.yaml` plus a program becomes a new kind of agent, hot-reloaded, self-describing like every other"
      }
    ]
  }
]

export const compareFull = compareGroups.flatMap((g) => g.rows)
