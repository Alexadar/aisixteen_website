import { src } from '../lib.js'

export default {
  headline: 'Memory stores: ram_store and sqlite_store',
  description: 'How the two Aisixteen Fantastic memory stores work: the same verbs over the same tables, rows keyed by caller, fold refs that cascade, one SQLite file per store, and what survives a restart.',
  summary: 'One surface, two stores: rows keyed by caller, fold refs that cascade, a SQLite file or RAM, and a record field that picks which.',
  cover: { clip: 'cascade' },
  about: ['Aisixteen Fantastic', 'Agent memory', 'SQLite'],
  lead: [
    'A **memory store** is an agent that keeps rows for other agents. An AI agent’s conversation lives in one, and so do the kernel’s own execution rows. Two ship: `ram_store`, which holds everything in RAM, and `sqlite_store`, which keeps it in one SQLite file.',
    'This page covers what both share, how rows are keyed, what happens to a fold’s refs when a row is deleted, the file behind `sqlite_store`, and how a record picks its store. What a fold is and how an AI agent uses one is on [Context folding](/fantastic/foundations/agents/ai-agent/context-folding/).',
  ],
  sections: [
    {
      id: 'surface',
      title: 'One surface, two stores',
      blocks: [
        'Both stores exist in Rust and in Python and answer the same verbs. A caller cannot tell them apart except by one field: in the code’s words, `sqlite_store` gives “the SAME verbs, arguments, replies and refusals” as `ram_store`, and is `durable: true`.',
        { table: { head: ['verb', 'what'], rows: [
          ['`append {rows}`', 'add rows under your key, all or none'],
          ['`read {after?, limit?, kinds?, match?, from_last_kind?, order?}`', 'your rows, oldest first by default'],
          ['`search {query, ids?}`', 'the lines that mention something: a case-insensitive substring, line by line'],
          ['`prune {before_id | ids, keep?}`', 'delete your rows; fold refs on them go too'],
          ['`inject {tables}` · `dump`', 'replace or capture the whole store'],
        ] } },
        'Row ids are the kernel’s. A row carries the integer the kernel minted, or none, and the store then takes the next one from the kernel’s counter. A store never numbers rows on its own. An id that is not a positive integer is refused with `bad_arg`.',
        '`ram_store` keeps its tables as maps in RAM, shaped like the SQLite ones, with the same keys, uniqueness and cascades. `reflect` tells the two apart: `durable: false` for `ram_store`, and `durable: true` plus its `path` for `sqlite_store`, with the number of `owners` and `rows` in both.',
        'Both runtimes replay one shared corpus, `contract/memory_store/cases.json`, and must answer every step as written. See [The contract](/fantastic/foundations/protocol/contract/). The store is an ordinary agent, so the [call gate](/fantastic/foundations/protocol/call-gate/) decides who may call any of its verbs, `inject` and `dump` included.',
      ],
    },
    {
      id: 'owners',
      title: 'Rows are keyed by owner',
      blocks: [
        'Every row is stored under `(owner, id)`. The owner is not a field the caller writes. The store takes it from who is calling: `<kernel guid>|<agent id>`, or `<kernel guid>|kernel` for the operator and the kernel’s own bookkeeping. A caller writes and reads its own rows only.',
        { quote: 'there is no `owner` field to forge.', cite: 'sqlite_store readme' },
        'The shared cases show it. `alice` and `bob` each append row `101` and both succeed, because the keys differ. An `append` that carries `owner: "g1|bob"` still lands under the caller, and the extra field is ignored. A second `101` from the same owner is refused with `reason: "exists"` and the id.',
        'A store that is asked before the kernel has a guid refuses with `not_found` and the hint “boot the kernel root first (it mints the guid)”.',
        { video: 'owners' },
      ],
    },
    {
      id: 'cascade',
      title: 'Fold refs cascade',
      blocks: [
        'A fold is a row with a `refs` list naming the rows it covers. The store keeps the list in a `fold_refs` table. In `sqlite_store`, its foreign keys cascade on delete, and the connection runs with `PRAGMA foreign_keys = ON`. `ram_store` mirrors the same cascade in its maps.',
        'An `append` checks `refs` before it writes anything. Each ref must name a row of the same owner, from earlier or in the same batch. Otherwise the whole append is refused with `not_found`. A `refs` that is not a list of ids is refused with `bad_arg`.',
        'Pruning a member removes it from every fold that names it. The fold row stays, with a shorter list. In the shared case, rows `1` and `2` sit under fold `3`, and row `4` is a note. `prune {before_id: 2}` deletes row `1` and the fold now reads `refs: [2]`. `prune {ids: [2]}` leaves `refs: []`. Pruning a fold row itself removes its member list and keeps the members.',
        { code: 'prune {before_id: 2}   →  {pruned: 1}   fold 3: refs [2]\nprune {ids: [2]}       →  {pruned: 1}   fold 3: refs []', label: 'from the shared case; ids illustrative' },
        '`keep` lists row kinds that survive a prune. `sqlite_store` has one more table, `ref_lists`, so that a fold whose members are all gone (`refs: []`) is distinguishable from a row with no list at all.',
        { video: 'cascade' },
      ],
    },
    {
      id: 'file',
      title: 'One file per store',
      blocks: [
        'A `sqlite_store` agent keeps everything in one SQLite file. Its record needs a `path`, which has no default. The path is relative to the kernel’s project directory, never absolute and never containing `..`. Symlinks are followed and the result must still be inside. A kernel without a project directory, an in-memory one, refuses the store.',
        'On first use the store creates the directory and the file, sets WAL mode, `synchronous=NORMAL`, `secure_delete` on and a five-second busy timeout, and creates its tables and an FTS5 trigram index for `search`. Every verb is one transaction under one lock per store, and a refusal rolls it back. Two `sqlite_store` agents with two paths are two files.',
        '`prune` also removes the text from disk. Deleted bytes are overwritten, and after a prune that deleted rows the store checkpoints and truncates the WAL, “so the text leaves `memory.db` and its `-wal` at once.”',
        'A kernel stop keeps the file. The host closes each store after the kernel’s last flush and checkpoints the WAL into it. `delete_agent` on the store is different: it deletes the file together with its `-wal` and `-shm`, as a `ram_store`’s tables do.',
        { video: 'file' },
      ],
    },
    {
      id: 'restart',
      title: 'What survives a restart',
      blocks: [
        'Nothing in a `ram_store` survives its process. A restarted `sqlite_store` reads its tables straight back: the kernel’s ledger, dead letters and named-call dedup, and every AI agent’s memory. The full picture, including the guid that the row keys depend on, is on [State and durability](/fantastic/foundations/kernel/state/). The ledger itself is on [Ledger and dead letters](/fantastic/foundations/protocol/ledger/).',
        'Rows are keyed by the kernel guid. A kernel that does not keep its guid across restarts never finds its old rows, whichever store it uses.',
      ],
    },
    {
      id: 'config',
      title: 'Which store is used is configuration',
      blocks: [
        'Nothing is built in. The root’s `memory_store_id` names the store for the kernel’s execution rows, and `kernel_start` refuses without one ([Lifecycle](/fantastic/foundations/kernel/lifecycle/)). An AI agent names its own in `memory_store_id`, a required field. With none, it fails at boot and at its first turn, and nothing falls back to RAM.',
        'The store is reached like any agent: the AI agent needs `can_call` on the store, and the store needs a `callable_by` naming the agent.',
        'The `fantastic` CLI wires both kinds. Its first-start seed, `blueprint.yaml`, applied once to a new `.fantastic/`, creates `kernel_memory`, a `ram_store` that the root names, and `memory`, a `sqlite_store` at `.fantastic/memory.db` that every AI agent uses. The comments say why: the kernel’s own rows stay in RAM so no keystroke or read touches disk, and the AI agents’ chats, folds and recall survive restarts. Their rows are keyed `<guid>|<agent>`, so agents never mix.',
        { code: '- id: kernel_memory\n  handler_module: ram_store.tools\n- id: memory\n  handler_module: sqlite_store.tools\n  path: .fantastic/memory.db', label: 'the CLI blueprint, abridged' },
        'So in the shipped CLI, a restart loses the kernel’s ledger history and its dead letters from a stop, but not an AI agent’s conversation. Pointing the root’s `memory_store_id` at a `sqlite_store` changes that.',
        { video: 'choose' },
      ],
    },
  ],
  sources: [
    ['sqlite_store (Rust): schema, path, pragmas, delete', src('src/lib/rust/crates/bundles/fantastic-sqlite-store/src/lib.rs', 64)],
    ['ram_store (Rust): owner key, verbs, cascade', src('src/lib/rust/crates/bundles/fantastic-ram-store/src/lib.rs', 1)],
    ['sqlite_store readme', src('src/lib/python/bundled_agents/memory/sqlite_store/src/sqlite_store/readme.md', 1)],
    ['ram_store readme', src('src/lib/python/bundled_agents/memory/ram_store/src/ram_store/readme.md', 1)],
    ['shared cases for every store', src('contract/memory_store/cases.json', 46)],
    ['the CLI blueprint: both stores', src('src/tui/blueprint.yaml', 35)],
    ['ai_core: the store an AI agent names', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core/core.py', 586)],
  ],
  clips: {
    owners: {
      title: 'Rows are keyed by who wrote them',
      caption: 'alice appends row 101 and it lands under g1|alice. bob appends 101 too and it lands under g1|bob, with no clash. alice then sends an append that carries owner "g1|bob" and row 5; the field is ignored and 5 lands under g1|alice. Each caller reads only its own rows.',
    },
    cascade: {
      title: 'Prune cascades to fold refs',
      caption: 'Fold row 3 names rows 1 and 2 in refs. prune before_id 2 deletes row 1 and the fold now reads refs [2]. prune ids [2] deletes row 2 and the fold stays with refs []. Row 4, a note, is untouched.',
    },
    file: {
      title: 'One file per store',
      caption: 'An open sqlite_store is the file at its path, memory.db, with memory.db-wal and memory.db-shm beside it. A kernel stop folds the WAL into the file and keeps memory.db. delete_agent removes memory.db and both siblings.',
    },
    choose: {
      title: 'Which store is configuration',
      caption: 'The root’s memory_store_id names kernel_memory, a ram_store. An AI agent’s memory_store_id names memory, a sqlite_store. The verbs are the same on both. After a restart the RAM store is empty and the SQLite store’s rows are read back from its file.',
    },
  },
}
