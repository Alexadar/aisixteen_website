// Kernel › State and durability. Facts: coder/tmp/foundations/facts/kernel_state.md
// (fantastic main b175660c). Clips render from anim/foundations/kernel_state.py.
import { src, tree } from '../lib.js'

const KS = 'src/lib/python/bundled_agents/loader/kernel_state/src/kernel_state'

export default {
  headline: 'State and durability: what survives a restart',
  description: 'How the Aisixteen Fantastic kernel_state root persists the agent tree, how one id counter survives restarts, and what depends on a durable memory store.',
  summary: 'The kernel_state root, the one id counter, and the two stores that decide what survives a restart.',
  cover: { clip: 'restart' },
  about: ['Aisixteen Fantastic', 'Durable state'],
  lead: [
    'Two different things can survive a restart. The **tree** is the agents and their records. The **rows** are the kernel’s execution rows and each AI agent’s conversation. They live in different places and persist through different agents, so a kernel can keep one and lose the other.',
    'This page covers the `kernel_state` root that owns the tree, the single id counter that names everything, and what a restart and a crash leave behind. The ledger and dead letters are on [their own page](/fantastic/foundations/protocol/ledger/).',
  ],
  sections: [
    {
      id: 'root',
      title: 'The kernel_state root',
      blocks: [
        'The root of every tree is an agent with the id `kernel_state` and the handler module `kernel_state.tools`. It owns the `.fantastic/` directory: it turns records into `agent.yaml` files, maps the tree to paths and writes changes. The reserved address `kernel` always names this root, whatever its id.',
        'A new directory has no root record. The bootstrap seeds one, `{id: kernel_state, handler_module: kernel_state.tools}`, and writes it to `.fantastic/agent.yaml` when the first mode takes the directory lock. A root `agent.yaml` that exists but does not parse is never written over: the boot stops and asks you to fix or remove it.',
        { h3: 'The tree needs a file_bridge' },
        'The root does not write the children of the tree by itself. It writes them only through a **provider** that it discovers: a `file_bridge` agent anywhere below the root whose `root` resolves to `.fantastic`. If several match, the shallowest wins. Each change is written 150 ms after it happens, to a temporary file that is then renamed over `agent.yaml`.',
        'With no provider, nothing is written. The tree lives in RAM and is lost on restart, and there is no direct-write fallback. A provider that refuses, for example because its `allow` list does not cover the records, fails loudly: the refusal goes to stderr and the root’s `reflect` shows it.',
        { code: '{"persistence": {"provider": "store"}}\n{"persistence": {"provider": null}}', label: 'root reflect: wired, or RAM (illustrative id)' },
        'On a graceful stop, the root writes its last pending records before the agents are torn down, while the provider is still alive. The stop never deletes records, so the next boot rehydrates the tree. A record whose bundle this runtime does not have is skipped with one line on stderr, together with its subtree. The record stays on disk, and a build that has the bundle loads it later.',
        { h3: 'The guid' },
        'The root also mints the kernel’s instance `guid` once, at boot, and keeps it in the root record. With a provider, later boots read it back unchanged. Without one, the guid exists only in memory, and the next boot mints a new one.',
      ],
    },
    {
      id: 'counter',
      title: 'One counter names everything',
      blocks: [
        'A call, a forked task, a settle row, a wait and an AI agent’s conversation row all take their id from one **counter**, a 64-bit integer that starts at 1. The same number is what `ps` lists, what `cancel` takes, what a reply is tagged with and what a store row is keyed by.',
        'The counter is kernel-wide and only goes up. If id `a` is smaller than id `b`, `a` was created first, across all agents. An id is never reused, so a stale `cancel` on an old id kills nothing.',
        { video: 'ids' },
        { h3: 'Reserved in blocks of 1000' },
        'The kernel reserves ids in blocks of 1000 and keeps only the upper bound, `next_id`, in the root record next to `guid`.',
        { ol: [
          'A load resumes at the root record’s `next_id`, never lower, and reserves its first block in memory. A load writes nothing.',
          '`kernel_start` writes that bound into the root record.',
          'When a started kernel mints an id at or past the bound, it reserves the next 1000 and writes the new bound.',
        ] },
        { code: 'next_id: 1001     # ids up to 1000 may have been handed out\nnext_id: 2001     # written when id 1001 is minted', label: 'the root record (illustrative)' },
        'So a restart begins at the stored bound, and ids below it are not issued again. The bound reaches disk through the same debounced write (150 ms) as any other record change. After a crash, up to one block of ids is skipped. The gaps are harmless because ids are opaque.',
        { video: 'reserve' },
        'The guid and the counter persist together. A root that is not durable mints a new guid on its next boot. Every store key starts with the guid, so the new keys cannot collide with the ids that restart from 1. The one case the kernel cannot defend is an old `agent.yaml` restored under the same guid, which moves the counter backwards. That is for the administrator to prevent.',
      ],
    },
    {
      id: 'rows',
      title: 'Rows live in a memory store',
      blocks: [
        'The kernel keeps no conversation and no message log in the tree. Its execution rows (`call`, `settle`, `task`, `ack`, and the rows of an `await_set` wait) are minted in RAM and flushed, 150 ms after a change, into the **memory store** that the root record names in `memory_store_id`. Each AI agent names its own store for its turns, folds and views.',
        '`kernel_start` refuses when the root names no store, and there is no default. The start sequence, step by step on [Lifecycle](/fantastic/foundations/kernel/lifecycle/), boots the root first, which supplies the guid, then the store, which is probed to confirm that it serves the operator. Then it writes the id bound, starts the flusher, rebuilds the open waits, and boots every other agent in registration order.',
        'Every row in a store is keyed `<kernel guid>|<agent id>`, and `<guid>|kernel` is the operator and the kernel’s own bookkeeping. Two stores ship with the kernel, and they answer the same verbs ([Memory stores](/fantastic/foundations/agents/memory-stores/)):',
        { table: { head: ['store', 'durable', 'after a restart'], rows: [
          ['`ram_store`', 'no', 'empty: everything it holds ends with the process'],
          ['`sqlite_store`', 'yes', 'one SQLite file; the rows are read back'],
        ] } },
        'The same store holds the data that gives a restart its meaning: the ledger, dead letters, named-call dedup and every AI agent’s memory. A reply’s body is not stored, only a one-line `origin` that says what to re-read.',
        'The ledger is trimmed once it passes `ledger_cap` (1,000,000 rows by default in the Python kernel, and 100,000 in the `fantastic` CLI, which sets it at start), oldest settled executions first, unnamed before named. A dead letter that nobody has acknowledged is kept ([Ledger and dead letters](/fantastic/foundations/protocol/ledger/)).',
      ],
    },
    {
      id: 'restart',
      title: 'What survives a restart',
      blocks: [
        'The answer depends on which two agents you wired, a `file_bridge` rooted at `.fantastic` and a memory store.',
        'The `fantastic` CLI wires the first one for you. Its first-start seed writes a `store` agent, a `file_bridge` (`file_bridge.tools`) with `root: .fantastic` and `allow: ["."]`, so by default the tree and its records are saved under `.fantastic/`. The terminal’s `volatile()` check is true only when no such store exists, and then the statusline warns: “no store wired — rows will not survive a restart.”',
        { table: { head: ['what', 'survives when', 'otherwise'], rows: [
          ['The agent tree, and bundle sidecars such as a [scheduler](/fantastic/foundations/agents/scheduler/)’s schedules', 'a `file_bridge` is rooted at `.fantastic`', 'gone; only the seeded root record is on disk'],
          ['The kernel’s `guid` and the id counter', 'the root record is persisted, which also needs that `file_bridge`', 'a new guid, and ids restart from 1'],
          ['Settled named executions, dead letters and acknowledgements', 'the memory store is durable, like `sqlite_store`', 'gone with the process'],
          ['Open `await_set` waits', 'the memory store is durable', 'gone with the process'],
          ['An AI agent’s conversation', 'its memory store is durable', 'gone with the process'],
        ] } },
        { video: 'restart' },
        'A durable store alone is not enough. Its rows are keyed by the guid, so a kernel with a `sqlite_store` but no `file_bridge` gets a new guid on every boot and never finds its old rows. Wire both.',
        { h3: 'Two limits' },
        'A call that is in flight when the process dies has no settle row. Re-sending it runs it again, unless the send gave it a name that already settled. On a graceful stop, the drain settles interrupted calls as `cancelled`, which makes them dead letters. Replaying an interrupted turn to where it stopped is not built.',
        { note: 'Keep the records store and your data apart. The `file_bridge` that persists records can rewrite any record, including its own grants, so grant it as narrowly as you can: the CLI’s seed lists only `user` in its `callable_by`. The files your agents read and write go through a second `file_bridge`, which the seed also writes: `files`, rooted at the project folder.' },
      ],
    },
  ],
  sources: [
    ['kernel_state/tools.py: provider discovery, flush loop, guid', src(`${KS}/tools.py`, 329)],
    ['persistence.md: durable state, memory stores, the counter', src(`${KS}/docs/persistence.md`, 5)],
    ['_kernel.py: the counter, kernel_start, load', src('src/lib/python/kernel/_kernel.py', 485)],
    ['rows.rs: the counter in the Rust kernel', src('src/lib/rust/crates/fantastic-kernel/src/rows.rs', 11)],
    ['persistence.rs: find_store_for and the record writer', src('src/lib/rust/crates/fantastic-kernel/src/persistence.rs', 163)],
    ['seed.rs: the CLI’s first-start seed and its store agent', src('src/tui/src/boot/seed.rs', 322)],
    ['blueprint.yaml: the seeded store and files agents', src('src/tui/blueprint.yaml', 79)],
    ['_kernel.py: the Python default ledger_cap', src('src/lib/python/kernel/_kernel.py', 526)],
    ['host.rs: LEDGER_CAP, the CLI’s ledger cap', src('src/tui/src/kern/host.rs', 41)],
    ['host.rs: volatile()', src('src/tui/src/kern/host.rs', 622)],
    ['sqlite_store readme', src('src/lib/python/bundled_agents/memory/sqlite_store/src/sqlite_store/readme.md')],
    ['ram_store readme', src('src/lib/python/bundled_agents/memory/ram_store/src/ram_store/readme.md')],
  ],
  clips: {
    ids: {
      title: 'One counter names everything',
      caption: 'A call takes id 41, a forked task 42 and its settle row 43, all from the same counter. Each id is larger than the one before, across agents, and none is reused. The root record holds only the reserved bound, next_id: 1001.',
    },
    reserve: {
      title: 'Ids reserved in blocks',
      caption: 'The root record holds next_id: 1001. When the kernel mints id 1001 it reserves the next block and writes next_id: 2001. The process crashes after id 1500. On restart the counter resumes at 2001, so ids 1501 to 2000 are skipped and none is issued twice.',
    },
    restart: {
      title: 'What survives a restart',
      caption: 'Before the restart, the kernel has an agent tree on disk through a file_bridge, a ram_store and a sqlite_store. After the restart the tree is back and so are the rows in sqlite_store. The rows in ram_store are gone.',
    },
  },
}
