// Canvas › Cabinet. Facts: coder/tmp/foundations/facts/canvas_cabinet.md
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src, tree } from '../lib.js'

export default {
  headline: 'Cabinets: a canvas and a worker AI for each part of a job',
  description: 'How a master AI uses the Aisixteen Fantastic cabinet bundle: open_cabinet makes a child canvas and a worker AI, wires message-only grants between workers, and conclude cleans up.',
  summary: 'A master AI opens sub-canvases, each with one worker AI that builds its own tools and talks to its peers.',
  cover: { clip: 'open' },
  about: ['Aisixteen Fantastic', 'Multi-agent AI'],
  lead: [
    'A **cabinet** is a canvas of its own with one worker AI. A master AI splits a job into cabinets, gives each worker a task, and reads their reports as they come in.',
    'The `cabinet` bundle holds the rules: which canvas each cabinet gets, what each worker may call, and how the cabinets are removed. The Python bundle is the reference; the Rust bundle is a port with the same verbs, refusals and grants.',
  ],
  sections: [
    {
      id: 'parts',
      title: 'The parts',
      blocks: [
        'One **manager** is a `cabinet.tools` agent with `cabinet_role: manager`. The operator makes it once. It names the canvas that spawns the cabinets in its `canvas_id` field, and the cabinets are its children.',
        'Each cabinet is a record with `cabinet_role: cabinet`. It is the live status cell that the spawning canvas can show, and it owns one worker AI as its child. The cabinet also points at its own canvas, made by `new_canvas`. That canvas is a child of the spawning canvas, as described in the [Canvas](/fantastic/foundations/canvas/) overview.',
        'Deleting a canvas deletes the canvases it spawned. This is what lets a cabinet take its canvas with it when it closes.',
        { list: [
          'manager verbs: `open_cabinet`, `close_cabinet`, `cabinets`, `conclude`, `reflect`',
          'cabinet verbs: `status`, `view`, `reflect`',
        ] },
        'The master is the AI that sends `open_cabinet`. An operator send is refused, because there is no master to wire the cabinet to.',
      ],
    },
    {
      id: 'open',
      title: 'Opening a cabinet',
      blocks: [
        'The master sends `open_cabinet {task, name?, backend?, setup?}` to the manager. Only `task` is required. The manager then works in this order:',
        { ol: [
          'It grants itself `new_canvas` on the spawning canvas, and the canvas grants it back.',
          'It sends `new_canvas {name}` to the spawning canvas. The new canvas is a child of it.',
          'It creates the cabinet record `cabinet_<name>` with its task, its master, its canvas and an empty status.',
          'It creates the worker `cabinet_<name>_worker` under the cabinet.',
          'It wires the grants described below and rewrites every worker’s directory.',
        ] },
        'The cabinet and worker records are made by sends to the root as the manager itself, so the operator must grant the manager `create_agent`, `update_agent` and `delete_agent` on the root. See the [call gate](/fantastic/foundations/protocol/call-gate/). If any wiring step fails, the manager removes the half-made cabinet and its canvas.',
        { code: '{"id": "cabinet_alpha", "canvas": "canvas_cabinet_alpha",\n "worker": "cabinet_alpha_worker", "master": "…",\n "backend": "…", "new_backend": false, "peers": []}', label: 'the reply of open_cabinet (illustrative values)' },
        'The reply does not mean the worker has started. `open_cabinet` does not start the worker. The master sends it the task as its first message, `{type: "send", text: …}`.',
        { video: 'open' },
        { h3: 'Where the worker comes from' },
        'The worker is a copy of an existing AI backend’s record. By default the backend is the master itself, and `backend` names another. The copy keeps the handler, endpoint, model, credential reference and memory store, so the connection and key stay where their owner set them. The record’s identity, grants, prompts, view and cabinet fields are not copied.',
        '`setup` overrides fields of the copy, but a wiring key in it is refused. A worker whose handler, endpoint or credentials differ from the backend’s is flagged `new_backend: true` with a warning. The code allows it and discourages it.',
        'The manager’s optional `max_cabinets` is a ceiling. An open that would exceed it is refused with `reason: "ceiling"`.',
      ],
    },
    {
      id: 'grants',
      title: 'Who may call whom',
      blocks: [
        'Every open edits grants key by key. The pattern follows the [call gate](/fantastic/foundations/protocol/call-gate/): each edge needs both a `can_call` and a `callable_by`.',
        { table: { head: ['edge', 'verbs'], rows: [
          ['worker to its cabinet', '`status`'],
          ['worker to its cabinet’s canvas', '`create`, `place`'],
          ['worker to a peer worker, or to the master', '`send`, `reflect`'],
          ['master or manager to a worker', 'all verbs'],
          ['master to a cabinet', '`view`, `reflect`'],
          ['worker to the root', 'nothing'],
        ] } },
        { quote: 'a peer that may only message cannot stop, clear or re-task the other.', cite: 'cabinet/tools.py' },
        'The worker also holds its memory store, and its credential store when the backend names one. It holds no grant on the root, so it cannot edit grants, and it cannot place a child canvas, because `new_canvas` is not on its grant. When a cabinet closes, the kernel prunes every grant that names a deleted id.',
        { h3: 'The directory' },
        'Each live worker’s record carries `cabinet_peers`: the cabinet, worker and task of every other cabinet. Its `post_system_prompt` says it is one of N workers, lists the peers, and shows how to message a peer or the master, how to report `status`, and how to build on its canvas. The text rides after the backend’s own prompt and never replaces it. Both are rewritten on every open and close.',
        { video: 'wiring' },
        { note: '`open_cabinet`, `close_cabinet` and `conclude` run one at a time per manager. Each reads whole grant maps and writes them back, so two in flight would overwrite each other’s entries. Other verbs are not serialised.' },
      ],
    },
    {
      id: 'work',
      title: 'What a worker does',
      blocks: [
        'A worker builds its **equipment** on its cabinet’s canvas. It sends `create {record: {handler_module, …}}` to build an agent there, for example an exec runner or a helper AI, and `place` to show a view. These are the only two verbs it holds on the canvas. Equipment is a child of the canvas, not of the worker.',
        'The worker reports up with `status {line, progress?, result?}` to its cabinet. `line` is a string, `progress` is a number from 0 to 100, and `result` can hold the final answer. The cabinet stores the report with a timestamp and emits an `update` event on its own id, so its view and every watcher see it live.',
        { code: '{"type": "status", "line": "parsing", "progress": 40}', label: 'status (illustrative values)' },
        'The master reads the state in two ways. `cabinets` lists every live cabinet with its task, worker, canvas, status and equipment. `view` on one cabinet returns the same fields for it.',
        'The status cell appears on the spawning canvas once the master places it there with the canvas view’s `place {backend_id: <cabinet>, x, y}`. Its button calls `fantastic.openCanvas(canvas)` and the page switches to the cabinet’s canvas. The button stays disabled until a canvas is named. The Rust terminal panel for a cabinet is read-only and sends only `cabinets` and `view`.',
      ],
    },
    {
      id: 'conclude',
      title: 'Closing and keeping',
      blocks: [
        '`close_cabinet {id}` deletes the cabinet with its worker, then its canvas with all the equipment on it, then rewrites the remaining workers’ directories. It refuses an id that is not a cabinet of this manager.',
        '`conclude {keep?}` closes every cabinet that is not named in `keep`, and the manager stays. A `keep` id is either a live cabinet, which stays whole, or a **result**: an agent placed on a cabinet’s canvas at any depth. For a result, the canvas and the path down to it stay. The cabinet record, the worker and all other equipment are deleted.',
        'Any other id is refused with `reason: "unknown_keep"` before anything is deleted. A canvas’s page loader is its own records: it is never deleted and never counts as a result.',
        { video: 'conclude' },
      ],
    },
    {
      id: 'limits',
      title: 'What the code leaves open',
      blocks: [
        { list: [
          'Equipment is not wired for the worker. A created helper AI gets its memory store and nothing else; the worker reaches other equipment only when its own `can_call`, or a peer’s, names it.',
          'How many cabinets to open, and what each worker builds, is the model’s choice. The code limits only the ceiling and the grants.',
        ] },
      ],
    },
  ],
  sources: [
    ['Python cabinet bundle (reference)', src('src/lib/python/bundled_agents/ai/cabinet/src/cabinet/tools.py', 349)],
    ['cabinet readme', src('src/lib/python/bundled_agents/ai/cabinet/src/cabinet/readme.md', 1)],
    ['status cell', src('src/lib/python/bundled_agents/ai/cabinet/src/cabinet/view.html', 1)],
    ['Rust cabinet bundle', src('src/lib/rust/crates/bundles/fantastic-cabinet/src/lib.rs', 1)],
    ['new_canvas and the canvas tree', src('src/tui/src/kern/web.rs', 8)],
    ['terminal panel', src('src/tui/src/panel/cabinet.rs', 1)],
    ['the manager view', src('src/tui/web/canvas/src/bundles/cabinets_view/cabinets_view.ts', 1)],
  ],
  clips: {
    open: {
      title: 'open_cabinet: a canvas and a worker',
      caption: 'The master sends open_cabinet {task} to the manager. The manager asks the spawning canvas for new_canvas and gets a child canvas. It then creates the cabinet cell and, under it, the worker. The reply names the ids, and the worker waits for its first message.',
    },
    wiring: {
      title: 'Grants between workers',
      caption: 'Two cabinets, alpha and beta, each with a worker. The workers get send and reflect grants both ways. The master calls each worker in full. No worker holds any grant on the root.',
    },
    conclude: {
      title: 'conclude keeps a result',
      caption: 'A worker reports status up to its cabinet. The master sends conclude {keep: ["report"]}, where report sits on a cabinet’s canvas. The canvas and the report stay; the cabinet, the worker and the other equipment are deleted.',
    },
  },
}
