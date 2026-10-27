// Canvas › Views of agents. Facts: coder/tmp/foundations/facts/canvas_views.md (fantastic main 22f88cb8).
import { src } from '../lib.js'

const H = 'src/tui/web/canvas/src/bundles/canvas/host_views.ts'

export default {
  headline: 'Views of agents: how the app picks what to draw',
  description: 'How Aisixteen Fantastic draws a host agent: its record’s own view, else its kind’s default, else a reflect card, and how the terminal UI picks a panel by handler_module.',
  summary: 'A record’s view, else the kind’s default, else a reflect card; the terminal UI keys panels off handler_module.',
  cover: { clip: 'choose' },
  about: ['Aisixteen Fantastic', 'User interface', 'Agents'],
  lead: [
    'An agent is not tied to a screen. The canvas and the terminal UI each look at an agent’s record and decide what to draw for it. In the canvas the decision is a short, ordered list, and the agent’s own record has the first say.',
    'This page covers how the app **chooses** a view. Writing one (`panel.html`, `view.calls`, `fantastic.send`) is in [A view](/fantastic/foundations/build/view/). Where cells sit, and the view’s own verbs, are in [Canvas](/fantastic/foundations/canvas/canvas/).',
  ],
  sections: [
    {
      id: 'host-agent',
      title: 'The agent is the unit; the cell is a view of it',
      blocks: [
        'The **host agent** is the real agent, in the kernel. Its record declares how it is shown. A cell on the canvas holds only layout (where, how big) and a `backend_id`, the agent it shows. Placing a cell with just a `backend_id` makes a view of that agent, drawn as its record says.',
        { code: 'view: {kind: terminal | chat | html | …  OR  handler: <any page bundle>,\n       bytes | bytes_file,   calls: [verbs…]}', label: 'the record’s view field (shape)' },
        '`bytes` or `bytes_file` is the body of an `html` view, and `calls` lists the verbs an `html` or `handler` view may call on its agent. An agent has one view.',
      ],
    },
    {
      id: 'choose',
      title: 'Choosing: record, kind, stub',
      blocks: [
        '`viewOf` in `host_views.ts` reads a record and returns the page bundle that draws it. It tries these in order, and the first match wins:',
        { ol: [
          'The record has a `view`. A `handler` names a page bundle directly. A `kind` names one of the generic renderers: `terminal`, `chat`, `html`, `mcp`, `resources`, `tasks`, `store`, `scheduler`, `cabinets` or `credentials`. A `view` with no `kind` or `handler`, or with an unknown `kind`, gets the stub.',
          'The record has no `view`, and its `handler_module` is `exec_bridge.tools`: a terminal. For `mcp_client.tools`: the MCP view.',
          'Its `handler_module` is one of the agentic stores: `agentic_resources`, `task_registry`, `ram_store`, `sqlite_store`, `scheduler` or `credential_store`. Each has its own read-only view. A `cabinet` gets one only when its `cabinet_role` is `manager`.',
          'The record has a `memory_store_id` and a `handler_module`, which is what makes an AI agent: a chat.',
          'Anything else gets the **stub**: a reflect card.',
        ] },
        { video: 'choose' },
        'The stub is `reflect_view`. It shows the agent’s `handler_module`, its sentence, its verbs as the kernel’s `docs` lists them, and the rest of its reflect as JSON. An agent nobody wrote a view for is therefore still visible and documented.',
        'The sidebar uses the same card to open any agent that no other cell shows. Its ✕ hides the card, and Shift+✕ deletes the agent. The card fronts the agent and does not own it.',
      ],
    },
    {
      id: 'own-view',
      title: 'An agent’s own view',
      blocks: [
        'A record with `view: {kind: html, …}` is drawn by `agent_view`. The body is the agent’s own small renderer. It comes from the bundle’s view file, `view.bytes_file`, read from `.fantastic/bundles/<handler_module>/` through the host’s `bundles_watch` bridge, with `{{agent}}` replaced by the instance id. Without a file, the record’s inline `view.bytes` is used. With neither, the cell says the agent declares no view body.',
        'The body runs in the same sandboxed panel as an `html` cell, and its calls go out as the cell. A bundle declares the view once, in `bundle.yaml`, and every instance gets it. Editing the view file writes each instance’s `view` again, and its cell re-renders without a restart. A chat card mounts the same panel inside its frame.',
        { code: 'view: {kind: html, bytes_file: panel.html, calls: [hello, count, watch]}', label: 'the starter python agent’s view (bundle.yaml)' },
        'The `agent_view` cell answers no verbs of its own beyond the panel’s relay. Anything else is refused as `unhandled`, and the hint points at the host agent’s `view` instead.',
      ],
    },
    {
      id: 'grant',
      title: 'The cell’s grant comes from the view',
      blocks: [
        'A cell is an agent too, so the [call gate](/fantastic/foundations/protocol/call-gate/) judges what it sends. Nobody writes that grant by hand. `cellGrant` derives it as `{<agent id>: [the view’s calls]}` when the cell is placed.',
        'Each generic renderer carries its own fixed list. The stub gets `reflect` (and `docs` on the kernel). A terminal gets `watch`, `status`, `start`, `write`, `ack`, `resize`, `output` and `paste_image`. A chat gets `watch`, `reflect`, `history`, `status`, `send` and `stop`. For an `html` or `handler` view the list is the record’s `calls`, and `watch` is always added, so a view receives its agent’s events.',
        'The read-only views (resources, tasks, store, scheduler, cabinets, credentials) are granted reads and `watch` and no write verb. The credentials view never gets `get`: it shows a name and a grant, not a value. See the [credential store](/fantastic/foundations/agents/credential-store/).',
        { video: 'grant' },
      ],
    },
    {
      id: 'tui',
      title: 'The terminal UI: a panel per handler_module',
      blocks: [
        'The terminal UI (TUI) decides the same way, with a different key. Selecting an agent in the tree changes the right pane to that agent’s panel. `PanelKind::of` picks it from the agent’s `handler_module`, read from the tree’s reflect.',
        { table: { head: ['handler_module', 'panel'], rows: [
          ['`*_backend.tools`, `ai_core.tools`', 'AI: conversation'],
          ['`exec_bridge.tools`, only for the shell’s own id `term`', 'terminal'],
          ['`file_bridge.tools`', 'files'],
          ['`agentic_resources`, `task_registry`, `ram_store`, `sqlite_store`, `scheduler`, `cabinet`, `credential_store`', 'read-only panels'],
          ['anything else', 'generic'],
        ] } },
        'AI agents match by suffix, so a new provider needs no change. A terminal is matched by id as well, because only the shell knows which exec agent it drew as its PTY. Any other `exec_bridge` agent gets the generic panel, which differs from the canvas, where every exec agent is a terminal.',
        'An unknown module is not an error and not a blank pane. The **generic panel** shows the agent’s id, whether it is open or sealed, its sentence, the last call, its egress (`can_call`) and ingress (`callable_by`), its verbs and its rows, and lets you call any declared verb. Its answer, a refusal included, is shown verbatim. A transport leg has only a reflect, so it lands here too.',
        { video: 'tui' },
        'In the public code, `make` in `panel/mod.rs` is a fixed `match` over these kinds. This page therefore claims no plug-in hook for a custom TUI panel: a new handler gets the generic panel.',
      ],
    },
  ],
  sources: [
    ['host_views.ts: viewOf and cellGrant', src(`${H}`, 83)],
    ['agent_view.ts: an agent’s own view', src('src/tui/web/canvas/src/bundles/agent_view/agent_view.ts', 57)],
    ['reflect_view.ts: the stub', src('src/tui/web/canvas/src/bundles/reflect_view/reflect_view.ts', 39)],
    ['canvas_agent.ts: hostViewCell and place', src('src/tui/web/canvas/src/bundles/canvas/canvas_agent.ts', 27)],
    ['bundle.yaml of the starter python agent', src('src/tui/starters/python_agent/bundle.yaml', 9)],
    ['panel/mod.rs: PanelKind::of', src('src/tui/src/panel/mod.rs', 78)],
    ['panel/generic.rs: the generic panel', src('src/tui/src/panel/generic.rs', 1)],
  ],
  clips: {
    choose: {
      title: 'Record, kind, stub',
      caption: 'Three host agents. py_ab12 has view {kind: html} in its record, so its own view draws it. runner has no view and is an exec_bridge, so it gets a terminal. notes has neither, so it gets the reflect card.',
    },
    grant: {
      title: 'The view’s calls become the cell’s grant',
      caption: 'py_ab12 declares calls [hello, count]. The canvas adds watch and writes the cell’s can_call as {py_ab12: [hello, count, watch]}. The panel’s hello passes the call gate as the cell. A stop is not in the grant and is refused.',
    },
    tui: {
      title: 'A panel per handler_module',
      caption: 'Four agents selected in the tree. A vllm_backend.tools agent gets the AI panel, the shell’s term gets the terminal, another exec_bridge agent gets the generic panel, and so does a module the shell has never seen.',
    },
  },
}
