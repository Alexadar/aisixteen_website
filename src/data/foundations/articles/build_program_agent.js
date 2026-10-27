// Build › A program agent. Facts: coder/tmp/foundations/facts/build_program_agent.md (fantastic main 22f88cb8)
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src, tree } from '../lib.js'

const ST = 'src/tui/starters/python_agent'
const BW = 'src/tui/src/kern/bundle_watch.rs'

export default {
  headline: 'Build a program agent from the starter: verbs, save, release',
  description: 'How to build an Aisixteen Fantastic program agent: start from the python agent starter, add a verb in agent.py and bundle.yaml, save to reload, and copy the folder for a release.',
  summary: 'Start from the starter folder, add a verb in two places, save to restart every instance, copy the folder to release.',
  cover: { clip: 'verb' },
  about: ['Aisixteen Fantastic', 'Agent development', 'Plugin architecture'],
  lead: [
    'A **program agent** is a folder with a program in it. This page is a walkthrough: make one from the starter, add a verb, see what a save does, and keep a copy that does not change.',
    'What the running program sees and how it ends is on [Program agents](/fantastic/foundations/agents/program-agents/), and how a folder becomes a bundle is on [Bundles](/fantastic/foundations/kernel/bundles/#folder-bundles). This page does not repeat either.',
  ],
  sections: [
    {
      id: 'starter',
      title: 'Start from the starter',
      blocks: [
        'The CLI ships one starter, `python_agent`. On the canvas, double-click and pick **python agent**. The host copies the starter into a new folder `.fantastic/bundles/py_<hex>/` and places one instance of it, `py_<hex>_1`, with its view on the canvas. It refuses to reuse a folder name that already exists.',
        'The folder holds four files:',
        { list: [
          '`bundle.yaml` names the base (`py_agent`), the `command` that starts the program, the `verbs` it serves with a one-line doc each, and the `record` defaults.',
          '`agent.py` is the program. Its verbs are the functions it passes to `fa.serve`.',
          '`panel.html` is the view the instance shows on the canvas.',
          '`fantastic_agent.py` is the reference helper, copied next to the program ([The program’s side](/fantastic/foundations/agents/program-agents/#helper)).',
        ] },
        { code: 'import fantastic_agent as fa\n\ncount = 0\n\ndef hello(p):\n    return {"greeting": f"hello, {p.get(\'name\') or \'world\'}"}\n\ndef bump(p):\n    global count\n    count += 1\n    fa.emit({"type": "count", "count": count})\n    return {"count": count}\n\nfa.serve({"hello": hello, "count": bump})', label: 'agent.py of the starter (comments left out)' },
        'The verb `hello` answers a greeting. The verb `count` adds one to a counter, emits an event with the new value, and returns it. The panel redraws on that event. `bundle.yaml` lists the same two verbs, and its `record` holds `inherit_env: [PATH]`, which is what lets the bare command `python3` be found.',
        { video: 'scaffold' },
      ],
    },
    {
      id: 'verb',
      title: 'Add a verb in two places',
      blocks: [
        'A verb exists in `agent.py` and in `bundle.yaml`, and the two lists must be equal. Write the function, add it to the dictionary passed to `fa.serve`, and add a line under `verbs` in `bundle.yaml`.',
        { code: 'agent.py      fa.serve({"hello": hello, "count": bump, "shout": shout})\nbundle.yaml   verbs:\n                hello: "args: name:str?. Returns {greeting}."\n                count: "args: none. …"\n                shout: "args: text:str (req). Returns {text}."', label: 'adding shout (illustrative verb)' },
        'The program says `hello` with its sorted verb names when it starts. If they differ from `bundle.yaml`, the instance stops with “the program serves […] but bundle.yaml declares […] — they must match”, and `reflect` shows that text as `program_error`. A call to a verb that `bundle.yaml` does not list is refused as `unhandled` with the hint `its verbs: …`.',
        'Three names are not yours: `reflect`, `boot` and `shutdown` are answered by the kernel, and declaring one in `verbs` is refused.',
        { video: 'verb' },
      ],
    },
    {
      id: 'save',
      title: 'Save, and every instance restarts',
      blocks: [
        'In the terminal host, a watcher keeps an eye on `.fantastic/bundles/`. It runs on the operating system’s file events, so nothing runs while nothing changes. Saves that arrive within 150 ms of each other count as one change. Python’s `__pycache__` files are ignored.',
        'A change to any file of the bundle except its view makes the watcher send the kernel `reload_bundle {name}`. The kernel re-reads `bundle.yaml`, then sends `shutdown` with the reason `reloaded` and `boot` to every live instance of that bundle. The restart is abrupt: a call still in flight settles as `transport_closed`, and its message says the program was reloaded. The next call meets the new code in a new process.',
        'A change to the view file (`panel.html`) restarts nothing. The host writes each instance’s `view` again, and the cells redraw. A change to `bundle.yaml` also reaches the `calls` list of every instance’s view, so a panel that calls a new verb is not refused.',
        { note: 'The watcher belongs to the terminal host. `reload_bundle` itself is a kernel verb in both runtimes, answered by the root: without the watcher, send it yourself after you edit.' },
        { video: 'save' },
      ],
    },
    {
      id: 'release',
      title: 'Copy the folder for a release',
      blocks: [
        'A save changes every instance of the bundle, because the code lives in the bundle and an instance is only a record that names it. To change one agent without touching the others, fork first.',
        'Copy the folder to a new name, for example `.fantastic/bundles/web_search`. The new name is a new handler. Its instances are not touched by edits to the original, and the original’s are not touched by edits to the copy. Every bundle in the folder appears as a tile in the double-click popup, and each pick places one more instance, `<name>_<n>`. An agent can do the same with `spawn {instance_of: <name>}`, sent to the canvas’s host agent `canvas_root`.',
        'To update the release from the working folder later, copy the working files over the release folder. Every instance of the release then restarts with the new code.',
      ],
    },
    {
      id: 'trust',
      title: 'What the folder is allowed to do',
      blocks: [
        'A program agent’s code runs with your operating-system rights. What it does itself, such as reading files, starting processes or opening the network, passes no kernel gate. Only the verbs that reach it, and the sends it makes through its agent, are gated ([Program agents](/fantastic/foundations/agents/program-agents/#out), [Security](/fantastic/foundations/protocol/security/)). A bundle is a folder of open files, so read one before you run it.',
      ],
    },
  ],
  sources: [
    ['the starter: agent.py', src(`${ST}/agent.py`, 7)],
    ['the starter: bundle.yaml', src(`${ST}/bundle.yaml`, 1)],
    ['the starter: panel.html', src(`${ST}/panel.html`, 1)],
    ['the dev watcher: reload on save', src(BW, 1)],
    ['the starter copied into a new folder', src(BW, 238)],
    ['reload_bundle in Rust', src('src/lib/rust/crates/bundles/fantastic-core/src/lib.rs', 729)],
    ['reload_bundle in Python', src('src/lib/python/bundled_agents/loader/kernel_state/src/kernel_state/tools.py', 1109)],
    ['bundles.md: make, change, keep', src('src/tui/docs/bundles.md', 14)],
  ],
  clips: {
    scaffold: {
      title: 'The starter becomes a bundle',
      caption: 'A double-click on “python agent” copies four files into a new folder, bundles/py_ab12 (illustrative id): bundle.yaml, agent.py, panel.html and fantastic_agent.py. The kernel loads the bundle, and one instance, py_ab12_1, appears and runs.',
    },
    verb: {
      title: 'A verb lives in two places',
      caption: 'agent.py serves hello and count, and bundle.yaml declares the same two. Adding shout to the program alone makes its hello differ from the declaration, and the instance stops with “they must match”. Adding shout to bundle.yaml too makes the lists equal, and the instance runs.',
    },
    save: {
      title: 'A save restarts every instance',
      caption: 'A call is in flight on py_ab12_1 when agent.py is saved. The watcher sends reload_bundle, and the call settles as transport_closed, “reloaded”. Both instances, py_ab12_1 and py_ab12_2, restart on the new code. A save of panel.html restarts nothing and only redraws the cells.',
    },
  },
}
