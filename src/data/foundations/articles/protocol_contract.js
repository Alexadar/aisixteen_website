import { src, tree } from '../lib.js'

export default {
  headline: 'The contract: shared cases every runtime replays',
  description: 'How Aisixteen Fantastic keeps its Rust, Python and TypeScript kernels in step: the contract/ folder states cases as data, and every runtime replays them.',
  summary: 'The wire behaviour is written once as data in contract/, and each runtime replays it.',
  cover: { clip: 'replay' },
  about: ['Aisixteen Fantastic', 'Conformance testing'],
  lead: [
    'Fantastic has two host runtimes, Python and Rust, and a TypeScript kernel for the browser. A caller must get the same answer from any of them. Writing that down as a test in each language would let the tests drift apart.',
    'The repository instead states each wire-visible property once, as data, in the `contract/` folder. Each runtime has a small driver that replays the data against its own kernel. This page shows what is in the folder, how the drivers hold a reply to a case, and where the runtimes are allowed to differ.',
  ],
  sections: [
    {
      id: 'folder',
      title: 'What is in contract/',
      blocks: [
        'The folder holds the **contract**: what the substrate claims, as files that no runtime owns. Every runtime reads them with the tools it already has, so the TypeScript kernel needs no extra dependencies and the cases are JSON.',
        { table: { head: ['file', 'what it pins'], rows: [
          ['`requirements.yaml`', 'the registry of requirement ids, such as `TSG-1`, and whether a failure of each is a `MUST`'],
          ['`conformance/cases.json`', '9 cases: one envelope, answered the same by every runtime and transport'],
          ['`memory_store/cases.json`', '15 scenarios that every memory store (`ram_store`, `sqlite_store`) must answer the same'],
          ['`home/v1/cases.json`', 'the `home` protocol, version 1: replayed by the Rust agent and the TypeScript client'],
          ['`agentic/configs`, `agentic/specs`', 'deployable kernel shapes, and ordered steps that each must prove'],
        ] } },
        'Python is the reference. The contributing guide says that when implementations disagree, Python is right, and that a protocol change in only one host is a bug.',
      ],
    },
    {
      id: 'cases',
      title: 'A case is a send and what the reply must hold',
      blocks: [
        'A case in `conformance/cases.json` has a `name`, a `target`, a `payload`, and what to check. `expect` lists keys and values that must appear in the reply. `expect_keys` lists keys that must exist. Extra keys in the reply are allowed, so a case names only what it means to pin.',
        { code: '{"name": "custom-verb", "target": "c21_probe",\n "payload": {"type": "poke", "value": 41},\n "expect": {"poked": 41}}', label: 'one case, as written in cases.json' },
        'Each driver builds the same small fixture: an agent `c21_probe` that answers `poke` with `{poked: value}`, and an id `c21_nobody` that never exists. The cases then reach past the happy path. Sending `reflect` to `c21_nobody` must answer `reason: unknown_agent`. An empty payload must answer `missing_arg` with `arg: payload.type`. A kernel verb such as `ps` sent to a non-root agent must answer `not_here` and name the verb.',
        { video: 'replay' },
        'The checks use `reason`, the machine field of every [refusal](/fantastic/foundations/protocol/refusals/), not the prose of `error`. So two runtimes may word an error differently and still pass.',
        'Cases replay in order against one kernel, so a case that changes state must come first and be repeatable. The tree-changing verbs `create_agent`, `update_agent` and `delete_agent` are not in this file. Their answer depends on who sends, so each runtime pins them in its own tests and in the agentic specs.',
      ],
    },
    {
      id: 'runtimes',
      title: 'Three drivers, one file',
      blocks: [
        'Adding a case to the file puts every runtime on the hook for it. There is no per-runtime test to forget. The drivers are short.',
        { list: [
          '**Rust** reads the file, sends each case through the kernel in order, and asserts that every case was checked.',
          '**Python** replays it too, and adds the transport legs described below.',
          '**TypeScript** runs one test per case, each on a fresh kernel.',
        ] },
        'All three hold the reply to the same rule: every key in `expect` must be in the reply with an equal value, and every key in `expect_keys` must exist. No test compares a Rust reply with a Python reply directly. Both are held to the same written answer, which is what makes the data the contract.',
      ],
    },
    {
      id: 'legs',
      title: 'Python also diffs the transports',
      blocks: [
        'The Python driver sends the same cases down five **legs** of one kernel: in-process, a websocket bridge, a REST route, an `exec` guest and a relay tunnel. It turns every reply into JSON with sorted keys, so a wire reply and an in-process object compare on equal terms. Each leg’s reply must equal the in-process reply.',
        { video: 'legs' },
        'Attribution differs by design. In-process the sender is the operator, and each other leg dispatches as its own agent. So the fixture grants every leg the same reach on both halves of the [call gate](/fantastic/foundations/protocol/call-gate/), and the cases avoid testing the gate itself. What must be identical is the reply.',
        'Two cases are marked `pairwise: false`: `reflect` on the kernel and `ledger`. They are checked for shape on every leg but not compared across legs. The root’s live state differs between legs’ runs, and `ledger` is scoped to the sender that made the calls, so each leg sees its own executions.',
      ],
    },
    {
      id: 'named',
      title: 'Where runtimes may differ, in writing',
      blocks: [
        'Two things are allowed to differ, and both are written down. The first is the root id. A case writes `$root`, and each driver replaces it with its own root id before it compares. All three drivers use `kernel_state`. The placeholder keeps the rule “each runtime’s own value, never equality” in the data, and it would allow a different root id. None of the three differs today.',
        { note: 'contract/README.md says the Rust root is `core`. The Rust driver and its `DEFAULT_ROOT_ID` say `kernel_state`, and the code wins.' },
        'The second is a verb a runtime does not own. The browser kernel does not own the tree verbs (`create_agent`, `update_agent`, `list_agents`), so its driver skips the `list_agents` case by name and records the reason in the driver. Anything not named must pass. A skip is a visible, reviewed line, not a quiet gap.',
        { video: 'named' },
      ],
    },
    {
      id: 'agentic',
      title: 'Steps with a cause: the agentic corpus',
      blocks: [
        'A flat table can state a verdict but not a cause. The agentic corpus pairs a **config**, a kernel shape you could deploy, with a **spec**, an ordered list of steps that says what must be true of it. A config holds no test data and a spec holds no system data, and both are parsed strictly: an unknown key is an error naming its file.',
        'The steps use a few verbs. `reach` sends as an agent through the gate, and `operator` sends with operator authority. `grant` and `revoke` change one half of an edge, `reboot` persists and rehydrates, and `reconcile_grants` and `sweep_undeclared` walk what the manifest declares rather than a hand-written list.',
        'Order is the point. The `two_sided_gate` spec opens one half of an edge at a time. With neither half the send is refused at `egress`. With only the sender’s half the refusal moves to `ingress`. Only with both does it pass. That move proves the second half was refusing on its own all along.',
        'Every step can carry `because: <requirement-id>`, and a spec may not claim a requirement that no step tags. The Python and Rust runners run this corpus. The TypeScript kernel does not, because it has no manifest loader to hydrate a declared roster. Its own tests cover the gate, the ledger, batch send, refusals and paging.',
      ],
    },
    {
      id: 'twins',
      title: 'How Rust and Python stay twins',
      blocks: [
        'Three habits keep the two host runtimes close. Python is the reference, and a Rust module says when it is a port. The Rust refusal module is a “Port of python `kernel/_refusal.py` (canonical)”, and it documents that its key order matches Python’s.',
        'A protocol change lands in both hosts, and the shared corpus fails if one is missed. The memory stores show the same habit at smaller scale: in both runtimes the RAM store and the SQLite store replay the same 15 scenarios, and their transcripts must match, apart from the error prose of an unhandled reply and the text of `reflect`, so a caller cannot tell the stores apart.',
        'The corpus does not make the runtimes identical. It makes the claims that matter checkable from outside: the same envelope, the same reply, and each difference named in the data or in a driver.',
      ],
    },
  ],
  sources: [
    ['contract/README.md: the corpus and the steps DSL', src('contract/README.md', 1)],
    ['conformance/cases.json: the 9 shared cases', src('contract/conformance/cases.json', 6)],
    ['Python driver: five transport legs', src('src/lib/python/tests/conformance/test_c21_transport_symmetry.py', 365)],
    ['Rust driver: c21_conformance.rs', src('src/lib/rust/crates/fantastic-kernel/tests/c21_conformance.rs', 124)],
    ['TypeScript driver: skips by name', src('src/lib/ts/tests/c21_conformance.test.ts', 44)],
    ['agentic spec: the two-sided gate ladder', src('contract/agentic/specs/two_sided_gate.yaml', 1)],
    ['memory_store/cases.json: one answer from every store', src('contract/memory_store/cases.json', 2)],
    ['CONTRIBUTING.md: cross-runtime parity', src('CONTRIBUTING.md', 33)],
  ],
  clips: {
    replay: {
      title: 'One file of cases, every runtime',
      caption: 'A case from cases.json is shown: send {"type": "poke", "value": 41}, expect {"poked": 41}. Python, Rust and TS each send it to their own kernel, and each reply holds {"poked": 41}. A second case sends reflect to c21_nobody and expects reason unknown_agent, and all three answer it.',
    },
    legs: {
      title: 'Five transports, one answer',
      caption: 'Python sends the poke case on five legs: in-proc, ws-bridge, web-rest, exec-guest and relay-tunnel. Each reply equals the in-proc reference. For the ledger case, marked pairwise: false, the legs are checked for shape only, because ledger is scoped to the sender.',
    },
    named: {
      title: 'Differences are named',
      caption: 'The reflect-kernel case expects {"id": "$root"}. Each runtime swaps in its own root id, kernel_state, and passes. For list-agents-limited, Python and Rust pass and the TS driver skips the case by name, with its reason recorded in the driver.',
    },
  },
}
