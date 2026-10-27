// Build › A bundle — written from fantastic main 22f88cb8; facts in
// coder/tmp/foundations/facts/build_bundle.md.
import { src, tree } from '../lib.js'

export default {
  headline: 'Writing a bundle: verbs, docs, record fields and checks',
  description: 'How to write an Aisixteen Fantastic bundle in Python or Rust: the handler, the verbs and their docs, the record fields it reads, and the checks a new bundle meets.',
  summary: 'Write a bundle in Python or Rust: the handler, verb docs, record checks, and the tests that hold it to the contract.',
  cover: { clip: 'twin' },
  about: ['Aisixteen Fantastic', 'Plugin development', 'Runtimes'],
  lead: [
    'A bundle is the code behind a `handler_module`. [Kernel › Bundles](/fantastic/foundations/kernel/bundles/) explains how the kernel finds one. This page is the how-to: what to write, in Python or in Rust, so that an agent of your bundle answers its verbs.',
    'The examples come from two real bundles that exist in both runtimes. The `scheduler` shows verbs, docs and hooks. The `static_loader` shows a record field and its check. The code blocks that name `tally` are illustrative; the shapes are the real ones.',
  ],
  sections: [
    {
      id: 'start',
      title: 'Start from a pair that already exists',
      blocks: [
        'The `scheduler` bundle has a Python file and a Rust file that answer the same nine verbs under one `handler_module`, `scheduler.tools`. Read them side by side before you write your own.',
        { table: { head: ['', 'Python', 'Rust'], rows: [
          ['the code', '`bundled_agents/scheduler/src/scheduler/tools.py`', '`crates/bundles/fantastic-scheduler/src/lib.rs`'],
          ['how the kernel finds it', 'an entry point in `pyproject.toml`', '`reg.register("scheduler.tools", …)` in the CLI'],
          ['its tests', '`tests/test_scheduler.py`', '`src/tests.rs`'],
        ] } },
        'Python is the reference. [CONTRIBUTING.md](https://github.com/aisixteen/fantastic/blob/main/CONTRIBUTING.md) says that when the two disagree, Python is right. The Rust file copies Python’s verb docs and refusal texts, and its comments say so.',
        { video: 'twin' },
      ],
    },
    {
      id: 'python',
      title: 'In Python: a module with a verb table',
      blocks: [
        'A Python bundle is a module with an `async def handler(id, payload, agent)`. The kernel awaits it for every verb that is not a kernel verb, and passes the agent object as the third argument. The scheduler calls that parameter `kernel`; it is the agent’s handle for `get`, `update`, `emit` and `send`.',
        { code: 'VERBS = {"reflect": _reflect, "bump": _bump}\n\nasync def handler(id, payload, agent):\n    fn = VERBS.get(payload.get("type"))\n    if fn is None:\n        return refusal(UNHANDLED, f"tally: unknown type {payload.get(\'type\')!r}",\n                       verb=payload.get("type"))\n    return await fn(id, payload, agent)', label: 'tally/tools.py (illustrative; the scheduler’s handler is this shape)' },
        'Each verb is a function that returns a dict. A refusal comes from `kernel._refusal`: `refusal(UNHANDLED, …, verb=…)` for an unknown verb, and `bad(verb, arg, want)` for an argument that is present but wrong. Both carry a machine `reason`; see [Refusals](/fantastic/foundations/protocol/refusals/).',
        'To make the module reachable, publish it in the `fantastic.bundles` entry-point group. The kernel resolves a `handler_module` only from that catalog, so a module without an entry point answers “No module named”.',
        { code: '[project.entry-points."fantastic.bundles"]\ntally = "tally.tools"', label: 'pyproject.toml (illustrative; the scheduler publishes scheduler = "scheduler.tools")' },
        'The package layout is `src/<package>/tools.py`, an optional `readme.md` that the kernel reads from the package, and a `tests/` folder. A module with no entry point can still dispatch in tests through `register_unlisted`.',
      ],
    },
    {
      id: 'rust',
      title: 'In Rust: a crate that implements Bundle',
      blocks: [
        'A Rust bundle is a crate that implements the `Bundle` trait of `fantastic-kernel`. Only two methods are required: `name()` and `handle()`. Every other method has a default that does nothing.',
        { code: 'impl Bundle for TallyBundle {\n    fn name(&self) -> &str { "tally" }\n    fn verb_docs(&self) -> Value { json!({ "bump": "args: by:int?. Returns {count}." }) }\n    async fn handle(&self, agent_id: &AgentId, payload: &Value,\n                    kernel: &Arc<Kernel>) -> Result<Reply, BundleError> { /* match on payload["type"] */ }\n}', label: 'the trait (illustrative; the scheduler implements these)' },
        '`handle` matches on `payload["type"]` and returns `Ok(Some(reply))`. `Ok(None)` means no reply. A domain error is a normal reply with an `error` field; `Err` is for a failure of the substrate. The unknown-verb arm builds the same `unhandled` refusal with the `verb` field that Python builds.',
        'The kernel does not load Rust bundles at run time. A crate is linked into the binary, and the host registers it under its `handler_module` string. The CLI does that in `register_default_bundles()`. A host that is not the CLI can register its own bundles after the stock set, with an `Extra` function passed to the TUI shell’s `main_with`; registering a stock name again replaces the stock bundle.',
        { code: 'reg.register("scheduler.tools", fantastic_scheduler::SchedulerBundle);', label: 'aisixteen/fantastic: fantastic-cli/src/main.rs' },
        '`fantastic-web-mcp` is a public example of a bundle written outside the kernel tree. Among the workspace crates, its non-test dependencies include only `fantastic-kernel`, and its comment says every API it touches is the kernel’s public surface. In the repository’s own workspace, a crate also needs a line in the workspace `members` and a dependency in the CLI’s `Cargo.toml`.',
        { note: 'The scheduler crate also depends on `fantastic-bundle`. That crate holds helpers that format values the way Python does (`repr`, `str`, truthiness), so a Rust refusal text matches Python’s byte for byte. A new bundle needs it only when it must match a Python text exactly.' },
      ],
    },
    {
      id: 'docs',
      title: 'Verbs and their docs',
      blocks: [
        'Every verb gets one doc. In Python the doc is the verb function’s docstring, and the `VERBS` table is where the kernel reads them. In Rust it is the map that `verb_docs()` returns, `{verb: doc}`, in the bundle’s order. The scheduler’s Rust map holds the first paragraph of each Python docstring.',
        'The kernel’s `docs` verb serves them. The default tier, `oneliners`, cuts each doc at its first top-level `. ` or ` — `, outside brackets. The `detailed` tier returns the whole doc. Rust’s `docs::signature` mirrors Python’s rule, so write the doc’s first sentence as the signature: the arguments, then what it returns.',
        { code: '"schedule": "args: target:str, payload:{type:<verb>, ...}, interval_seconds:int (default 60). ... Returns {schedule_id, schedule}."', label: 'a verb doc (the scheduler’s `schedule`, shortened)' },
        'A bundle can publish more. In Python the module attributes `EMITS`, `CANCEL` and `NOTES` are served by `docs` at the detailed tier; in Rust the methods `emits_doc`, `cancel_doc` and `notes_doc` do the same. The scheduler declares its one event, `schedule_fired`, in `EMITS`.',
        'The docs never ride on a reflect. The scheduler’s own test checks it: a `reflect` of a scheduler carries no `verbs` or `emits`, and `docs` of the same agent lists `schedule` and `schedule_fired`. Keep a verb’s how-to in its doc, and keep `reflect` for what the agent is: the scheduler answers `id`, `sentence`, `paused` and `running`.',
        { video: 'docs' },
      ],
    },
    {
      id: 'record',
      title: 'The record fields a bundle reads',
      blocks: [
        'An agent’s **record** holds `id`, `handler_module`, `parent_id` and any other fields written to it ([Records](/fantastic/foundations/kernel/records/)). A bundle reads the fields it defines. In Python the agent object has `record` and `get(id)`. In Rust the fields are `agent.meta`, behind a lock. The scheduler reads `paused` from the record each time it decides whether to fire, and it writes the same field with `update`.',
        'A field that only your bundle understands needs a check that only your bundle can make. That is `validate_meta(meta, record)`. `meta` is the patch, and `record` is the agent’s current fields, empty at create. Return a string to refuse the write, or nothing to accept it. The kernel calls it in both `create_agent` and `update_agent`, so a value refused on update is refused on create too. The refusal has the reason `invalid_meta`.',
        'Judge the state the write will produce, not the patch alone. The `static_loader` reads one field, `manifest`, and checks it against the merged view.',
        { code: 'def validate_meta(meta, record):\n    merged = {**record, **meta}\n    if "manifest" not in merged:\n        return None\n    path = merged.get("manifest")\n    if not isinstance(path, str) or not path:\n        return "static_loader: manifest must be a non-empty path string"', label: 'static_loader/tools.py, validate_meta (shortened)' },
        'The Rust bundle has the same method on the trait and the same text. The hook is handed no kernel, so it checks shape only. Whether the manifest file exists is a question for the verb that reads it, at boot.',
        'A bundle can also publish what its record takes before any agent exists. Python reads a module attribute `RECORD_SCHEMA`, and Rust calls `record_schema()`. The kernel adds it to the bundle’s entry in `reflect bundles=all`. A bundle that publishes a schema enforces the same one in `validate_meta`.',
        { video: 'record' },
      ],
    },
    {
      id: 'hooks',
      title: 'Hooks: what to free when the agent goes',
      blocks: [
        'A bundle that keeps state in the process, such as a cache or a running loop, frees it in a hook. Python looks for module functions `on_delete(agent)` and `on_shutdown(agent)`. Rust’s trait has `on_delete`, `on_shutdown` and `on_cancel`, all defaulting to nothing.',
        'The shutdown hook is the only one the shutdown walk calls. There is no fallback to `on_delete`, so a bundle that frees resources at shutdown says so. The scheduler does it in one line, `on_shutdown = on_delete`, and Rust’s `on_shutdown` calls its own `on_delete`.',
        'The scheduler starts its loop with `spawn_task`, so the loop is in `ps` and can be cancelled. See [Tasks](/fantastic/foundations/kernel/tasks/). A bare background task would be missing from both.',
      ],
    },
    {
      id: 'checks',
      title: 'Passing the contract and the parity checks',
      blocks: [
        'The `contract/` folder states wire behaviour as data ([The contract](/fantastic/foundations/protocol/contract/)). Its `unknown-verb` case sends a verb that does not exist to a probe agent, a test fixture and not a shipped bundle, and expects `reason: unhandled`. Nothing in the contract runs against a new bundle. It pins the wire behaviour, and a bundle should answer an unknown verb the same way, with `unhandled` and the `verb` field, as both scheduler files do. The scheduler’s own parity case, `shutdown` to `unhandled`, is the per-bundle check.',
        'Contract files that are about a kind of bundle exist for memory stores. `contract/memory_store/cases.json` says that every memory store bundle in every runtime that ships it replays its scenarios and must answer each step as written. If your bundle is a memory store, those scenarios are your cases.',
        'For everything else, the checks are in the repository’s process. These are the steps for a bundle that has twins:',
        { ol: [
          'Write the Python bundle first, with its tests in the package’s `tests/` folder. Python is the reference.',
          'Write the Rust bundle with the same verbs, the same docs, the same refusal texts and its own unit tests in `src/tests.rs`.',
          'Add the verbs to the parity harness. `e2e/parity` sends the same inputs to a Python kernel and a Rust kernel and diffs the Rust answers against Python’s. Its `bundle_verbs` family has a list of cases for the scheduler, among them `{"type": "shutdown"}`, which is not a verb and must be refused alike.',
          'Name the verbs and fields in the bundle’s own docs. If a change alters the wire protocol, it must land in every host; CONTRIBUTING.md says a change to one bundle’s internals with no wire impact needs no such parity.',
        ] },
        { note: 'The parity harness and the contract files live in the fantastic repository, which does not accept outside pull requests. A bundle you keep in your own repository runs the first two steps and your own selftest; the diff against Python applies when you also ship a twin.' },
        { video: 'checks' },
        'The bundle’s `selftest.md` is a walk through the CLI with the expected output of each step. The scheduler’s runs `fantastic <id> <verb> …` against a fresh `.fantastic` folder.',
      ],
    },
    {
      id: 'next',
      title: 'Where to go next',
      blocks: [
        'A bundle that is only a folder, with a program in any language and no new crate, is the other route; it is in [Kernel › Bundles](/fantastic/foundations/kernel/bundles/#folder-bundles) and [Program agents](/fantastic/foundations/agents/program-agents/). To see what a bundle’s agent may call and be called by, read [The call gate](/fantastic/foundations/protocol/call-gate/).',
      ],
    },
  ],
  sources: [
    ['Rust: the Bundle trait and registry', src('src/lib/rust/crates/fantastic-kernel/src/bundle.rs', 50)],
    ['Python: the scheduler bundle', src('src/lib/python/bundled_agents/scheduler/src/scheduler/tools.py', 514)],
    ['Python: the scheduler’s entry point', src('src/lib/python/bundled_agents/scheduler/pyproject.toml', 13)],
    ['Rust: the scheduler bundle', src('src/lib/rust/crates/bundles/fantastic-scheduler/src/lib.rs', 210)],
    ['Python: static_loader and validate_meta', src('src/lib/python/bundled_agents/loader/static_loader/src/static_loader/tools.py', 88)],
    ['Rust: static_loader validate_meta', src('src/lib/rust/crates/bundles/fantastic-static-loader/src/lib.rs', 314)],
    ['Python: the docs verb', src('src/lib/python/kernel/_docs.py', 1)],
    ['a bundle written outside the kernel tree', tree('src/tui/bundles/fantastic-web-mcp')],
    ['the parity harness: scheduler cases', src('e2e/parity/families/bundle_verbs.py', 187)],
    ['the contract: unknown-verb case (probe agent)', src('contract/conformance/cases.json', 44)],
  ],
  clips: {
    twin: {
      title: 'One bundle, a file in each runtime',
      caption: 'The handler_module scheduler.tools has two implementations. In Python, pyproject.toml publishes the module in the fantastic.bundles group, and tools.py holds VERBS and handler(). In Rust, main.rs calls reg.register, and lib.rs holds impl Bundle with handle(). Both answer to scheduler.tools and serve the same verbs: schedule, list, pause, history and the rest.',
    },
    docs: {
      title: 'Verbs and their docs',
      caption: 'The bundle writes one doc per verb, in the VERBS table in Python or in verb_docs() in Rust. A docs send for the agent returns each doc cut to its first sentence, which the clip shortens: schedule, pause and history with their arguments. A reflect of the same agent answers with no verbs and no emits.',
    },
    record: {
      title: 'validate_meta judges the record',
      caption: 'The record holds manifest fantastic.yaml. An update_agent patch sets manifest to an empty string. validate_meta gets the patch and the record and refuses it with invalid_meta, manifest must be a non-empty path string, before the record changes. A patch that sets manifest to team.yaml passes, and the record changes. Create is judged the same way.',
    },
    checks: {
      title: 'Three checks for a new bundle',
      caption: 'A new bundle, tally.tools, meets three checks. A bundle should answer an unknown verb with unhandled, as the contract’s unknown-verb case pins on a probe agent and the scheduler’s parity case checks per bundle. The bundle’s own tests pass in each runtime it ships in: tests/ in Python and tests.rs in Rust. For a twin, the parity harness diffs the Rust answers against Python, the reference.',
    },
  },
}
