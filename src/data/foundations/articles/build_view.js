// Build your own › A view. Facts: coder/tmp/foundations/facts/build_view.md (fantastic main 22f88cb8).
import { src } from '../lib.js'

const W = 'src/tui/web/canvas/src/bundles'
const S = 'src/tui/starters/python_agent'

export default {
  headline: 'A view: how an agent shows itself on the canvas and in the TUI',
  description: 'How to give an Aisixteen Fantastic agent a live panel: the view record, panel.html, fantastic.send and watch, the cell’s grant, live edits, and what the terminal UI shows instead.',
  summary: 'A view record, a panel.html that sends and watches, the calls it may make, and what the TUI shows instead.',
  cover: { clip: 'starter' },
  about: ['Aisixteen Fantastic', 'User interface', 'Agents'],
  lead: [
    'An agent shows itself through its record. Give the record a `view` that names an HTML file, and the canvas draws that file as a panel: buttons that call the agent’s verbs and a script that redraws when the agent emits an event.',
    'This page builds one from the starter that ships with the CLI. How the app **chooses** a view is [Views of agents](/fantastic/foundations/canvas/views/). The sandbox it runs in is [HTML and GL agents](/fantastic/foundations/canvas/html-gl/). The program behind the verbs is [Program agents](/fantastic/foundations/agents/program-agents/).',
  ],
  sections: [
    {
      id: 'starter',
      title: 'Three files: record, verbs, panel',
      blocks: [
        'The starter is a **folder bundle** ([Bundles](/fantastic/foundations/kernel/bundles/#folder-bundles)). `spawn {bundle: python_agent}` copies its files into a new folder, `.fantastic/bundles/py_<hex>/`, loads it, makes one instance named `<folder>_1`, and writes the instance’s view from the bundle. Each file has one job.',
        { table: { head: ['file', 'job'], rows: [
          ['`bundle.yaml`', 'the verbs, and `record.view`: the view every instance gets'],
          ['`agent.py`', 'the verbs. `count` adds one and calls `fa.emit({"type": "count", "count": n})`'],
          ['`panel.html`', 'the view: buttons that send verbs and a `watch` that redraws'],
        ] } },
        { code: 'view: {kind: html, bytes_file: panel.html, calls: [hello, count, watch]}', label: 'the view record (bundle.yaml)' },
        '`kind: html` selects the HTML view renderer (`agent_view`). `bytes_file` names the body, relative to the bundle folder. `calls` lists the verbs the body may send to its agent. The two verbs in `bundle.yaml` must equal the ones `agent.py` serves, or the kernel refuses the agent (see [Program agents](/fantastic/foundations/agents/program-agents/#start)).',
        'A view can also carry its HTML inline as `bytes` in the record instead of `bytes_file`. With neither, the cell says the agent declares no view body.',
        'To show the agent, call `place {backend_id: "<id>", x, y}` on the canvas’s view, with no `kind`. It makes a cell that is a view of that host agent, 480 by 320 unless the call gives a size. An unknown agent is refused as `not_found`, and a missing `x` or `y` as `bad_arg`.',
      ],
    },
    {
      id: 'panel',
      title: 'The panel: send, watch, and {{agent}}',
      blocks: [
        'The panel is a fragment of HTML. The canvas wraps it in a document and puts a small script, the **connector**, in its head, so a global `fantastic` exists before the body runs. The frame is a sandboxed iframe: scripts run, but the only way out is a message to the page.',
        { table: { head: ['call', 'does'], rows: [
          ['`fantastic.send(target, payload)`', 'sends a message and returns a promise of the reply'],
          ['`fantastic.watch(src, cb)`', 'calls `cb` with each event the agent emits; returns a function that stops watching'],
          ['`fantastic.emit(target, payload)`', 'emits an event on another agent'],
          ['`fantastic.onMessage(cb)`', 'receives messages sent to the cell itself'],
        ] } },
        'The agent’s own id is not known when you write the file, so write `{{agent}}`. When the canvas reads the file it replaces every `{{agent}}` with the instance’s id. One `panel.html` therefore serves every instance of the bundle.',
        { code: 'const AGENT = "{{agent}}";\ndocument.getElementById("c").onclick =\n  () => fantastic.send(AGENT, {type: "count"});\nfantastic.watch(AGENT, (ev) => {\n  if (ev && ev.type === "count") out.textContent = "count = " + ev.count;\n});', label: 'panel.html (the starter, shortened)' },
        'The button only sends. The new number arrives as an event, because the `count` verb emits it, and the `watch` callback draws it. Any other client of the agent sees the same event. The starter never polls.',
        { note: 'Setting `innerHTML` runs no `<script>`. Keep the script in `panel.html`, and send data, or HTML without scripts, in the events.' },
        { video: 'starter' },
      ],
    },
    {
      id: 'grant',
      title: 'What the panel may call',
      blocks: [
        'The panel does not act as you. Its sends go out as its **cell**, which is an agent, so the [call gate](/fantastic/foundations/protocol/call-gate/) judges them like any other send. The cell’s `can_call` is derived from the view as `{<agent id>: [hello, count, watch]}`: `calls`, plus `watch`, which a view always gets.',
        'A verb that is not in `calls` is refused at the cell, inside the panel, where nobody reads a log. If your button needs a new verb, add it to the bundle’s `verbs`, to `agent.py` and to `calls`.',
        'The other end of the edge is the agent’s `callable_by`. The terminal UI shell grants `user`, which every canvas tab calls through, on each agent it sees, and `spawn` waits for that grant before it returns. For an agent you create by hand, the canvas’s own documentation says to give it `callable_by: {user: [the verbs the panel calls, watch]}`, because a new agent admits no one.',
        'A chat can show the same panel inside a conversation. The AI’s `embed {id}` verb draws a card for any host agent with a `view` record, and it checks the same grants. It answers `not_found`, `no_view` or `grants_missing` with the fix in `hint`. One agent can be a chat card and a canvas cell at once.',
      ],
    },
    {
      id: 'edit',
      title: 'Edit it while it runs',
      blocks: [
        'The CLI watches every bundle folder. It listens to file events rather than polling, and it treats one save, a burst of events within 150 ms, as one change. What happens depends on the file.',
        { list: [
          '**`panel.html`** (the view file): the CLI writes each instance’s `view` again, and the cells redraw. Nothing restarts.',
          '**`agent.py` or `bundle.yaml`**: the kernel runs `reload_bundle`. Every instance stops abruptly and starts again, and calls in flight answer `reloaded`.',
        ] },
        'The record the CLI writes takes `kind`, `calls` and `bytes_file` from `bundle.yaml` over the instance’s own. A new verb in `calls` therefore reaches every instance’s grant. It also removes any inline `bytes` and adds `bytes_rev`, a hash of the file, so the change is visible to the cells. If you save the code and the panel together, the code reloads first and then the panel redraws.',
        { video: 'edit' },
        'A bundle’s edit changes every instance. To change one agent alone, copy the folder to a new name first.',
      ],
    },
    {
      id: 'tui',
      title: 'In the terminal UI',
      blocks: [
        'The terminal UI does not run `panel.html`. It has its own panel per kind of agent, chosen by the agent’s `handler_module`, and no code in its panels reads a `view` record.',
        'A bundle you wrote has an unknown module, so the TUI shows the **generic panel**: the agent’s id, whether it is open or sealed, its sentence, the last call, its egress (`can_call`) and ingress (`callable_by`), its verbs with their argument lines, and its rows. You can call any verb it lists, and the answer, a refusal included, is shown verbatim. That is enough to try `hello` and `count` from the terminal.',
        { video: 'tui' },
        'In the public code, `make` in `panel/mod.rs` is a fixed `match` over the panel kinds. This page therefore claims no way to add a custom TUI panel: a new handler gets the generic panel. The views you write are for the canvas.',
      ],
    },
  ],
  sources: [
    ['starter bundle.yaml: the view record', src(`${S}/bundle.yaml`, 9)],
    ['starter agent.py: a verb that emits', src(`${S}/agent.py`, 36)],
    ['starter panel.html: send and watch', src(`${S}/panel.html`, 6)],
    ['connector.ts: the fantastic object', src(`${W}/html_agent/connector.ts`, 40)],
    ['agent_view.ts: reading the view file', src(`${W}/agent_view/agent_view.ts`, 57)],
    ['host_views.ts: the cell’s grant', src(`${W}/canvas/host_views.ts`, 108)],
    ['bundle_watch.rs: live edits and the starters', src('src/tui/src/kern/bundle_watch.rs', 1)],
    ['panel/mod.rs: the TUI panels', src('src/tui/src/panel/mod.rs', 78)],
  ],
  clips: {
    starter: {
      title: 'A view: click, verb, event, redraw',
      caption: 'py_ab12_1 has view {kind: html, bytes_file: panel.html, calls: [hello, count, watch]}. The panel sends count to py_ab12_1 through its cell. The agent adds one and emits {type: count, count: 1}, and the panel’s watch redraws “count = 1”.',
    },
    edit: {
      title: 'Edit a bundle while it runs',
      caption: 'Two instances, py_ab12_1 and py_ab12_2, share one bundle. Saving panel.html redraws both cells with no restart. Saving agent.py runs reload_bundle, and both instances restart.',
    },
    tui: {
      title: 'The TUI shows the generic panel',
      caption: 'py_ab12_1 is selected in the TUI tree. Its handler_module is unknown to the shell, so it gets the generic panel: sentence, verbs hello and count, and a call. count answers {count: 1}.',
    },
  },
}
