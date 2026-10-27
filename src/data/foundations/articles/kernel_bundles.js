// Bundles and twin runtimes — written from fantastic main b175660c; facts in
// coder/tmp/foundations/facts/kernel_bundles.md.
import { src, tree } from '../lib.js'

export default {
  headline: 'Bundles: how an agent gets its code, in Rust and Python',
  description: 'How an Aisixteen Fantastic agent gets its code from a bundle: linked crates in Rust, entry points in Python, folder bundles in both, and the same kernel verbs.',
  summary: 'A bundle is the code behind a handler_module: linked in Rust, found by entry point in Python, dropped in as a folder in both.',
  cover: { clip: 'resolve' },
  about: ['Aisixteen Fantastic', 'Plugin architecture', 'Runtimes'],
  lead: [
    'An agent is a record, and its record names a `handler_module`. The **bundle** behind that name is the code that answers the agent’s own verbs. Every kernel keeps its bundles in a catalog and resolves the name against it.',
    'Fantastic ships kernels in more than one language. This page compares the Rust and the Python kernels; a TypeScript kernel also exists and reports runtime `"ts"`. The Rust and Python kernels fill that catalog differently, but a caller sends the same messages to either (see [Messages and verbs](/fantastic/foundations/protocol/messages/) and [Call gate and grants](/fantastic/foundations/protocol/call-gate/)).',
  ],
  sections: [
    {
      id: 'handler-module',
      title: 'One bundle per handler module',
      blocks: [
        'A send to an agent first meets the **kernel verbs**: `create_agent`, `delete_agent`, `update_agent`, `list_agents`, `ps`, `cancel`, `ledger`, `ack_deadletter`, `kernel_start`, `shutdown_agents`, `kernel_stop`, `await_set`, `await_cancel` and `docs`. The kernel answers these itself, at the root. They are the same fourteen in Rust and in Python.',
        'Any other verb goes to the agent’s bundle. In Python the kernel calls `handler(id, payload, agent)` in the module that `handler_module` names. In Rust the registry returns the `Bundle` that is registered under that string, and the kernel calls its `handle`.',
        { code: 'file_bridge.tools        # a handler_module, as stored in an agent\'s record\nhandler(id, payload, agent)   # Python: the callable in that module\nBundle::handle(...)           # Rust: the method of the registered bundle', label: 'one name, two ways in' },
        'A bundle can also hook the agent’s life: Rust’s `Bundle` has `on_delete`, `on_cancel` and `on_shutdown`, each a no-op by default.',
      ],
    },
    {
      id: 'rust',
      title: 'Rust: linked at build time',
      blocks: [
        'A Rust bundle is a crate that implements the `Bundle` trait. The file that defines the trait states it plainly: “Bundles aren’t dynamically loaded — every Rust bundle is a crate linked into the binary at compile time.”',
        'The `fantastic` binary builds a `BundleRegistry` in `register_default_bundles()` and calls `register("file_bridge.tools", …)` for each bundle it ships. To add a bundle to a build, add its crate to the workspace and register it there. The `exec_bridge` and `py_agent` bundles register only when the `full` feature is on, and the CLI builds with `full` by default.',
        'A `create_agent` that names an unregistered bundle still makes the record ([Lifecycle](/fantastic/foundations/kernel/lifecycle/)). A domain verb sent to that agent is refused as `unhandled`, with Python’s own text, `No module named \'absent_bundle\'` for the handler module `absent_bundle.tools`. A caller sees one message from both kernels.',
        { video: 'resolve' },
      ],
    },
    {
      id: 'python',
      title: 'Python: found by entry point',
      blocks: [
        'A Python bundle is “anything with a `handler(id, payload, agent)` callable” in its module. A package publishes it in the `fantastic.bundles` entry-point group, for example `file_bridge = "file_bridge.tools"`.',
        'The kernel resolves a `handler_module` only from that catalog. It never imports an arbitrary name from `sys.path`, so a `create_agent` cannot make the kernel run a module that no package published. A name outside the catalog fails as `No module named \'<package>\'`.',
        'The catalog is read live. A name the kernel has not seen re-scans the entry points once, so a bundle installed while the kernel runs resolves on its first lookup. Test and probe modules that have no entry point register through `register_unlisted`: they dispatch, but never appear in the catalog.',
        { note: 'Both kernels list their bundles in `reflect bundles=all`: the entry points in Python, the installed registry entries in Rust. Unlisted test bundles stay out of it.' },
      ],
    },
    {
      id: 'folder-bundles',
      title: 'Folder bundles: a new kind of agent without a rebuild',
      blocks: [
        'A **folder bundle** is a folder `bundles/<name>/` inside a kernel’s root (`.fantastic/`) that holds a `bundle.yaml`. It extends a bundled agent named by `base`. On main the one base a folder can extend is `py_agent`. The folder’s name becomes the `handler_module` of its instances.',
        'Both runtimes load folder bundles, with the same rules. A folder bundle needs no entry point in Python and no new crate in Rust. The `py_agent` base it extends is itself a bundle: a registered crate in Rust (under `full`) and a bundled module in Python.',
        { code: 'base: py_agent\nsentence: Keeps short notes.\ncommand: [python3, agent.py]\nverbs:\n  add: "args: text:str (req). Returns {id}."', label: 'bundles/notes/bundle.yaml (illustrative)' },
        'Folders are read at boot, before the agent tree loads, so an instance’s handler resolves. A folder that fails any check is listed in `reflect bundles=all` with an `error` and is never loaded. The checks are, in order:',
        { ol: [
          'The folder name uses letters, digits, `_` and `-`, and starts with a letter or `_`.',
          'The name is not a built-in bundle’s name: “a folder may not shadow it.”',
          '`bundle.yaml` exists, parses, and is a mapping.',
          '`base` is present: the bundled agent it extends.',
          '`sentence` is present: one line saying what the bundle is.',
          '`base` names a bundled agent that a folder can extend.',
          'The base accepts the rest: for `py_agent`, a `command` (the program’s argv, run with the folder as its working directory) and a `verbs` map from verb to doc. `reflect`, `boot` and `shutdown` are reserved.',
        ] },
        { video: 'folder' },
        'Each instance, made with `create_agent handler_module=notes`, is a full agent. The kernel starts the program when the instance boots and kills it when the instance is deleted or the kernel stops. The program first says `{"op": "hello", "verbs": [...]}`; those verbs must equal the `verbs` in `bundle.yaml`, or the instance stops and says why. After that the kernel sends it `{"op": "call", ...}` and the program answers `{"op": "result", ...}`.',
        '[Program agents](/fantastic/foundations/agents/program-agents/) follows the running program: its wire, `hello`, calls and how it stops. Nothing respawns a program that exits. `reload_bundle {name}`, a root verb, re-reads the folder and restarts every live instance of it. If the new `bundle.yaml` no longer loads, the call is refused and the live instances keep the previous load.',
        { note: 'The program runs with the user’s OS rights. Its own subprocesses, files and network do not pass the call gate; only the verbs that reach it do.' },
      ],
    },
    {
      id: 'twins',
      title: 'Twin runtimes: same verbs, different loading',
      blocks: [
        'The Rust and Python kernels answer the same fourteen kernel verbs, and Rust’s verb docs are written to mirror Python’s. A client that talks to one can talk to the other. The root `reflect` reports which one it reached in its `runtime` field; the TypeScript kernel reports `"ts"` there and is not covered on this page.',
        { table: { head: ['', 'Rust', 'Python'], rows: [
          ['built-in bundles reach the kernel', 'crates linked at compile time, registered in `register_default_bundles()`', 'entry points in the `fantastic.bundles` group'],
          ['a bundle is', 'a `Bundle` trait implementation', 'a module with `handler(id, payload, agent)`'],
          ['an unknown handler module', '`No module named \'…\'`', '`No module named \'…\'`'],
          ['folder bundles (`base: py_agent`)', 'yes', 'yes'],
          ['kernel verbs', 'the same 14', 'the same 14'],
          ['root `reflect` reports `runtime`', '`"rust"`', '`"python"`'],
        ] } },
        { video: 'twin' },
      ],
    },
  ],
  sources: [
    ['Rust: the Bundle trait and registry', src('src/lib/rust/crates/fantastic-kernel/src/bundle.rs', 1)],
    ['Rust: register_default_bundles()', src('src/lib/rust/crates/fantastic-cli/src/main.rs', 45)],
    ['Python: bundle discovery', src('src/lib/python/kernel/_bundles.py', 1)],
    ['Python: the system verbs', src('src/lib/python/kernel/_agent.py', 129)],
    ['Rust: folder bundle loader', src('src/lib/rust/crates/bundles/fantastic-core/src/folders.rs', 31)],
    ['Python: folder bundle loader', src('src/lib/python/bundled_agents/loader/kernel_state/src/kernel_state/tools.py', 123)],
    ['py_agent, the folder base (Python)', src('src/lib/python/bundled_agents/io/py_agent/src/py_agent/tools.py', 1)],
    ['py_agent, the folder base (Rust)', tree('src/lib/rust/crates/bundles/fantastic-py-agent')],
  ],
  clips: {
    resolve: {
      title: 'From handler_module to code',
      caption: 'A send reaches an agent whose record says handler_module file_bridge.tools. In the Rust kernel the registry holds a crate linked at build time under that string. In the Python kernel the fantastic.bundles entry-point catalog names the module. Both reach the bundle. A name absent_bundle.tools is in neither, and both answer No module named absent_bundle.',
    },
    folder: {
      title: 'A folder bundle loads at boot',
      caption: 'At boot the kernel reads bundles/notes/bundle.yaml. It checks the folder name, that notes is not a built-in bundle, and that base py_agent and a sentence are present; the bundle registers. create_agent with handler_module notes makes an instance. The kernel starts the program, which says hello with its verbs, and the verbs match bundle.yaml.',
    },
    twin: {
      title: 'Rust and Python, one set of verbs',
      caption: 'The same reflect is sent to a Rust kernel and a Python kernel. The root reflect reports a runtime field with the same field names and order in both, and only its value differs: rust in one and python in the other. This clip shows the Rust and Python kernels; a TypeScript kernel also exists. Below them sit the same fourteen kernel verbs.',
    },
  },
}
