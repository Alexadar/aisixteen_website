// Foundations: blog-style articles on how Aisixteen Fantastic works, under /fantastic/foundations/.
// Every claim is taken from the public fantastic repo (origin/main): the README, THESIS.md, the
// kernel crates' docs and code, and the ai_core / memory-store sources, which are cited per
// article in `sources`. Rust and Python are the two kernel runtimes covered.
//
// Inline markup in strings: `code`, **bold**, [text](url). Blocks:
//   'a paragraph'                      · { h3 }        · { code, label? }   · { list } / { ol }
//   { table: { head, rows } }          · { quote, cite } · { note }         · { video: slug }
// Videos are rendered with Manim from anim/foundations/*.py (anim/render.sh); their durations
// come from src/data/foundations-videos.json, which the render script writes.

const REPO = 'https://github.com/aisixteen/fantastic'
const src = (path) => `${REPO}/blob/main/${path}`

// Manim clips. `slug` is the key in foundations-videos.json; files live next to the article.
export const videos = {
  k1_batch: {
    title: 'One send, a batch of calls',
    caption: 'A model turn sends three items in one batch. The kernel registers all three as tasks in ps before any reply; they run concurrently and finish in any order, and the reply array keeps the input order: one {pid, status, result} per item.',
  },
  k2_gate: {
    title: 'The call gate: both ends must grant',
    caption: 'Agent a sends reflect to b. The send is refused at egress until a’s can_call names b, then at ingress until b’s callable_by names a. With both grants it passes, one way, for that verb only. Operator sends skip the gate.',
  },
  k3_cancel: {
    title: 'cancel: a task and its subtree',
    caption: 'cancel on task 42 first runs every on_cancel hook in its subtree while the tasks are alive (a child process is SIGKILLed, a generation is closed), then aborts the tasks leaves first. The sibling and the parent keep running; the waiting send settles as cancelled.',
  },
  k4_delete: {
    title: 'delete_agent: the whole subtree',
    caption: 'delete_agent on team is refused because reviewer carries delete_lock. After update_agent clears it, the delete cascades deepest first, each agent running its on_delete hook, and the deleted ids are pruned from x’s can_call.',
  },
  k5_ledger: {
    title: 'Every call is an execution',
    caption: 'A named call writes a call row and a settle row, flushed into the memory store. A failed call is a dead letter with an on_deadletter event for its caller. After a restart, re-sending the named call returns the recorded outcome without running the handler; ack_deadletter retires the dead letter.',
  },
  cf1_fold: {
    title: 'A fold is a new row',
    caption: 'context_fold over rows 3 to 8 appends one fold row (13) to the store, with refs to its members; nothing is deleted. In the view the fold sits at its anchor, row 3, in place of its members, and everything before the range keeps its exact bytes.',
  },
  cf2_levels: {
    title: 'Folds of folds',
    caption: 'Finished chains at the head of the view fold into level-1 folds. Three adjacent folds at the head fold again into one level-2 fold, and so on, so depth grows like log3 of the history. history {fold} opens any fold one level down.',
  },
  cf3_cache: {
    title: 'Why folds append, never edit',
    caption: 'A prompt cache compares bytes from the start. Appending a row keeps the whole old prompt as a cached prefix; cutting rows from the front moves everything after the cut; a fold misses from its anchor on but keeps the rows before it, and because the fold row persists, the next turn appends after the same bytes again.',
  },
  cf4_fork: {
    title: 'fork: a new agent on the same prefix',
    caption: 'mark labels a turn boundary. fork at row 5 is refused with cuts_turn; fork at 6 starts a new agent with a copy of rows 1 to 6 under its own key, with the same ids, so its first prompt has the parent’s bytes. After that the two histories diverge.',
  },
  cf5_forget: {
    title: 'clear starts over; forget deletes',
    caption: 'context_clear appends one clear row and the view starts at its line; nothing is deleted and grep still finds old rows. context_forget then deletes the rows a fold covers, keeps every fold, and the next prompt is the same before and after.',
  },
}

const kernel = {
  slug: 'kernel',
  n: 1,
  title: 'Kernel: agents and messaging',
  short: 'Kernel',
  headline: 'The kernel: agents, one tree, and one verb',
  description: 'How the Aisixteen Fantastic kernel works: every model, program and person is an agent in one tree, every interaction is a batch send through a two-sided call gate, and every dispatch is a task you can list and cancel.',
  summary: 'Agents and the tree, the one verb send, the two-sided call gate, tasks and cancel, the ledger and dead letters, and what survives a restart.',
  cover: 'k1_batch',
  about: ['Aisixteen Fantastic', 'Agent kernel', 'Message passing', 'Access control'],
  lead: [
    'Fantastic starts from one sentence, its whole THESIS: “A shared system where human operators, statistical models, and programs are decentralized and flat, with a mediator that handles the communication exchange.” The kernel is that mediator.',
    'This article walks through what the kernel actually does, from the agent record to the call gate, the task table, the ledger and a restart. It covers the Rust and Python kernels, which answer the same fourteen kernel verbs with the same semantics.',
  ],
  sections: [
    {
      id: 'agents',
      title: 'Everything is an agent',
      blocks: [
        { quote: 'A model, a program, a file tree, a shell, a browser canvas and the human at the keyboard are all agents in one tree, addressed by id and reached the same way: one call, `send`.', cite: 'README' },
        'An agent is two things: a **record** and the **bundle** that answers its verbs. The record is small. It has an `id` that is unique across the tree, a `handler_module` naming the bundle, a `parent_id`, and every other field flat at the top level. Those other fields are how a bundle is configured.',
        { code: 'id              file_bridge_ab12cd   minted as <bundle>_<hex6> when you leave it out\nhandler_module  file_bridge.tools    the bundle; fixed once the agent exists\nparent_id       kernel_state         where it sits in the tree\n...             ...                  every other field: the bundle’s own config', label: 'an agent record' },
        'A bundle is the code. In Python it is anything with a `handler(id, payload, agent)` callable, found through entry points. In Rust it is a crate implementing the `Bundle` trait, linked into the binary at compile time. That is the one real difference between the two runtimes: how bundles load. On top of either, a **folder bundle** (a `bundle.yaml` plus a program dropped into `.fantastic/bundles/<name>/`) becomes a new kind of agent, hot-reloadable.',
        'A handler that returns nothing sends no reply; a domain error comes back as `{"error": ...}`. A bundle can also run code when its agent is deleted (`on_delete`), stopped (`on_shutdown`) or has a task cancelled (`on_cancel`). It can refuse a bad record with `validate_meta` and publish a `record_schema`, the same schema `create_agent` and `update_agent` enforce.',
        { h3: 'The protocol is the API' },
        'There is no client library. Every agent answers `{"type": "reflect"}` with what it is, and the `docs` kernel verb says how to call it. A reflect carries the agent’s `can_call` and `callable_by`, so an agent can read what it may call without trial and error. The README’s first example is one reflect of the root:',
        { code: '[{"target": "kernel", "payload": {"type": "reflect", "readme": true}}]', label: 'send' },
        'It returns the live tree and the kernel’s manual index. With `bundles: "all"` it also lists every kind of agent you can create, which is enough for a person or a model to take it from there.',
      ],
    },
    {
      id: 'tree',
      title: 'One tree',
      blocks: [
        'Every agent has exactly one parent. The root’s id is `kernel_state`, and the reserved address `kernel` reaches it too. Children keep their creation order. On disk each agent is an `agent.yaml` in its own folder, with its children in folders below it (under `agents/` by default), all inside `.fantastic/`. One kernel runs per folder: a second `fantastic` started there attaches to the running one.',
        'The tree does not route messages. The kernel keeps one flat map of agents and looks the target id up directly. The tree is about **ownership**: what a delete takes with it, what the `$parent` and `$subtree` grants mean, how records lie on disk, and what `reflect` shows.',
        { h3: 'Composition verbs' },
        'Fourteen verbs belong to the kernel, and only the root answers them: `create_agent`, `update_agent`, `delete_agent`, `list_agents`, `ps`, `cancel`, `ledger`, `ack_deadletter`, `await_set`, `await_cancel`, `kernel_start`, `shutdown_agents`, `kernel_stop` and `docs`. The agent you name is the operand, not the actor, so a kernel verb sent to any other agent is refused with `not_here` and the fix.',
        { list: [
          '`create_agent` needs `handler_module` and `parent_id`. There is no default parent: “placement is always stated, never inferred from who sent the call.” The reply is the new record, and the child boots right away.',
          '`update_agent` replaces every field you name and leaves the rest alone. A map such as `can_call` is replaced whole: “Granting one edge reads like a PATCH and behaves like a PUT.” `handler_module` cannot change.',
          '`delete_agent` deletes the agent and its whole subtree, deepest first. `keep_memory: true` keeps the subtree’s rows in the memory store.',
          '`list_agents` returns every record, flat, root first, paged.',
        ] },
        { code: '[{"target": "kernel", "payload": {"type": "create_agent",\n  "handler_module": "ram_store.tools", "parent_id": "kernel", "id": "memory"}}]', label: 'create a child of the root' },
        { video: 'k4_delete' },
        'A delete runs per node: children first, then the bundle’s `on_delete` hook, then the agent leaves the tree. A raising hook is logged and the cascade goes on. If any agent in the subtree carries `delete_lock`, the whole delete is refused with `reason: "locked"` and `blocked_by` naming it; clear the lock with `update_agent` first. The root cannot be deleted. After a cascade, every deleted id is pruned from every other agent’s `can_call` and `callable_by`, so an agent created later under the same id inherits no stale edge.',
      ],
    },
    {
      id: 'send',
      title: 'One verb: send',
      blocks: [
        'Every interaction is one **batch** send: a list of items, each `{target, payload}`, answered in order with `{pid, status, result}`. There is deliberately no single-call form. The code says why: a model reply that fans out to N calls would otherwise get its answers spread over the next N replies. In the README’s words, “One turn of 500 calls runs as one kernel batch on every runtime.”',
        { code: '[{"target": "kernel", "payload": {"type": "list_agents"}},\n {"target": "kernel", "payload": {"type": "ps"}}]', label: 'two calls, one send' },
        'The whole batch is registered as tasks, visible in `ps`, before the first reply is awaited. The items then run concurrently, and the result array keeps the input order.',
        { video: 'k1_batch' },
        'An item can also carry an `id` (it names the execution, more on that below), a `timeout` in seconds and a `retries` budget. The kernel never defaults the timeout: absent means wait forever. When a timeout expires, the item is killed through the same path as `cancel`, so cleanup hooks run.',
        { h3: 'Five statuses' },
        'The code calls these strings the contract:',
        { table: { head: ['status', 'meaning'], rows: [
          ['`completed`', 'the handler ran and returned a reply, passed through verbatim'],
          ['`errored`', 'the handler ran and returned a map with a truthy `error`'],
          ['`failed`', 'refused before dispatch (gate, unknown agent, malformed item), or the handler panicked or raised: `{"error": ..., "raised": true}`'],
          ['`cancelled`', 'killed by `cancel`; the result is `{"cancelled": true}`'],
          ['`timed_out`', 'the item’s own deadline expired'],
        ] } },
        'Nothing propagates out of `send`: a panic settles as `failed`, a cancel as `cancelled`, and the caller always gets an answer. Only `failed` and `timed_out` are retried, and only within the `retries` the caller declared. `cancelled` is never retried; in the code’s words, “an operator kill is an absorbing decision.”',
        { h3: 'send, emit, and the word “call”' },
        'There is no verb named `call`. `send` is the one request/reply primitive. `emit` is fire-and-forget: one event onto a target’s inbox and its watchers, no reply. `watch` mirrors an agent’s inbound traffic into a watcher’s inbox. Both are gated like a send. “Call” in the docs means the **call gate** below, and the **call row** the ledger writes for every send.',
        'The reserved target `kernel` names the root, and `<guid>|<agent id>` addresses an agent on a connected kernel.',
      ],
    },
    {
      id: 'gate',
      title: 'The call gate',
      blocks: [
        'Security is one rule, applied to every send an agent makes, for any verb, `reflect` and the kernel verbs included. **Egress:** the sender’s `can_call` must grant (target, verb). **Ingress:** the target’s `callable_by` must grant (sender, verb). An edge exists only if both ends grant it. The gate never looks at what the verb is.',
        { video: 'k2_gate' },
        'A grant map has keys and values. A value is `"*"` (every verb) or a list of verbs. A key is a literal agent id; `$self`; `$parent`; `$subtree` (every agent below the holder, at any depth); or, in `can_call` only, `<guid>|<agent>` or `<guid>|*` for a connected kernel. Tokens resolve relative to the agent holding the grant. An absent or empty grant denies, and the baseline merged into every agent, on both fields, is `{"$self": "*"}` and nothing else.',
        { code: 'a.can_call     {"$self": "*", "b": ["reflect"]}\nb.callable_by  {"$self": "*", "a": ["reflect"]}', label: 'a may send reflect to b (one way)' },
        'A refusal says which half failed. Egress is checked first, so a call with neither half granted reports egress:',
        { code: '{"error": "a may not call \'reflect\' on b", "reason": "unauthorized", "side": "egress", "hint": "grants come from above ..."}\n{"error": "b does not accept \'reflect\' from a", "reason": "unauthorized", "side": "ingress", "hint": "..."}', label: 'the two refusals' },
        'The hint says where grants come from: “grants come from above — an ancestor (update_agent on an agent in its subtree) or the operator writes can_call and callable_by; an agent never raises its own.” Holding `update_agent` on the root is itself such a grant, and an agent without it is refused.',
        '**Operator sends** skip the gate: the CLI, a cold bootstrap, a test driver, a transport handing in an inbound frame, and the kernel’s own bookkeeping. Identity comes only from dispatch, so the sends a handler makes, and the tasks it spawns, are that agent’s.',
        'The same gate covers the edges around it. `watch` is gated, because a mirror of a target’s traffic is a read of it. Joining someone else’s named execution is gated, because you receive its recorded outcome. Grant maps are checked when they are written, so a malformed grant is refused with `invalid_meta` instead of failing quietly later. The e2e probe for the gate runs against both the Python and the Rust host.',
      ],
    },
    {
      id: 'tasks',
      title: 'Work in flight: ps and cancel',
      blocks: [
        'An agent is a node; a **task** is one in-flight dispatch. Tasks form a tree: a `send` issued inside a handler is a child of that handler’s task, “like a process spawned by init.” `ps` lists them kernel-wide, one row per dispatch, `ps`’s own row included:',
        { code: '{"tasks": [{"id": 42, "agent": "planner", "parent": 41, "verb": "run", "started_at": ...}], "next": ...}', label: 'ps (shape)' },
        'Task ids are plain integers from the kernel’s one id counter, the same number an outcome carries as `pid`. `cancel {task_id}` kills that task and its whole subtree, “like a process group,” and answers `{"cancelled": true, "killed": [...]}`. An unknown or finished id answers `{"cancelled": false, "killed": []}`. The caller blocked on the cancelled send gets status `cancelled`; nothing raises.',
        { video: 'k3_cancel' },
        'Cancel runs in two phases. First, every `on_cancel` hook in the subtree is awaited while all the tasks are still alive; that is where real resources go (an `exec_bridge` job’s child process is SIGKILLed, an AI backend’s in-flight generation is closed out with a `done` event). Then the tasks abort, leaves first. A task being cancelled starts no new work, and the kernel’s own service tasks refuse `cancel`.',
        'These are ordinary verbs behind the gate, so an agent with the grant can read `ps` and cancel another agent’s runaway work.',
      ],
    },
    {
      id: 'ledger',
      title: 'Executions, the ledger and dead letters',
      blocks: [
        'Every call is an **execution**: a `call` row when it is dispatched and a `settle` row with its outcome when it ends. The rows are held in RAM and flushed, debounced, into the kernel’s memory store, the agent the root names in `memory_store_id`. A settled, flushed execution leaves RAM.',
        { h3: 'Named calls run once' },
        'An item with a string `id` is a **named** execution with “ensure” semantics. A new name dispatches and records. A name in flight is joined: no second run, “once-only under concurrency.” A settled name returns the recorded outcome and the handler never runs. Because the store is read before dispatch, this holds across a flush and across a restart. An integer `id` joins an existing execution by its number and never creates one.',
        'A settle row keeps a named call’s whole result (that is the dedup contract), a dead letter’s error text, and for everything else only `{status, bytes}`: “a reply body is its caller’s, never the kernel’s record.” Call rows hold their payload in clear, so values that must not be recorded belong in a credential store, named by reference, or in payload fields the sender marks `secret`, which records and events show as `[secret]`.',
        { h3: 'Dead letters' },
        'An execution that settles `failed`, `timed_out` or `cancelled` is a **dead letter** (`errored` is not: the handler ran and answered). The originating caller gets an `on_deadletter` event on its own inbox, the root gets it for an operator send, and nothing retries it silently.',
        { code: '{"type": "on_deadletter", "id": 57, "target": "fetcher", "caller": "lead", "status": "failed", "attempts": 1}', label: 'the event (shape)' },
        '`ledger` lists executions, `{id, target, status, attempts, retries, named, outcome?, acked?}`, scoped to the caller: an agent sees only what it originated, the operator sees all. “Unscoped this would be a side-channel around callable_by.” `ack_deadletter {id}` acknowledges a dead letter you originated and writes an `ack` row; an acknowledged dead letter may be pruned, an unacknowledged one is kept. There is no re-send verb: inspect it, send again under a new id if you choose, then ack.',
        { video: 'k5_ledger' },
        { h3: 'One counter names everything' },
        'A call, a task, a settle row, a wait and a conversation row all take their id from one allocator, “so one number names one thing everywhere (`ps`, `cancel`, a reply tag, a store row).” It is a 64-bit counter starting at 1, reserved in blocks of 1000 and persisted as `next_id` in the root record, so a crash can skip ids but never reuse them. A string from outside is always a name; it never becomes a pid.',
      ],
    },
    {
      id: 'await',
      title: 'Waiting on many: await_set',
      blocks: [
        'A lead waiting on several workers would otherwise wake on every report and re-send its whole context each time. `await_set {ids, timeout_s?, label?}` answers at once with a `wait_id`. Each named agent then sends the lead a plain `{"type": "report", "state": ..., "result": ...}`; until the set completes, the report is held and the reporter is told `{"held": true, "wait_id": ...}`.',
        'When everyone has reported, or `timeout_s` passes, the lead gets **one** message: `{type: "send", text, wait_id, label, done: [{id, state, result}], missing, timed_out}`, with `done` in the order of `ids` and `text` the same body as compact JSON for a model to read. `await_cancel` drops a wait and delivers the held reports one by one. A wait is rows in the memory store, so it is rebuilt when the kernel starts.',
      ],
    },
    {
      id: 'lifecycle',
      title: 'Start, stop and restart',
      blocks: [
        '`kernel_start` refuses to start unless the root names a memory store, with no built-in default (fail loud). Its hint is the fix:',
        { code: 'create_agent parent_id=<root> handler_module=ram_store.tools id=memory\nupdate_agent id=<root> memory_store_id=memory', label: 'the hint, verbatim' },
        { ol: [
          'Boot the root (it mints the kernel’s `guid`), then the store, before anyone who might call it.',
          'Probe that the store serves the operator, and refuse now rather than on the first flush.',
          'Write the reserved `next_id` bound to the root record.',
          'Start the flusher, restore open `await_set` waits, boot every other agent in registration order, and complete waits that are already due.',
        ] },
        'It answers `{started: true, store, booted: [ids]}`, and a second call is idempotent. `shutdown_agents` drains: new work is refused, sends from inside live work still pass, every agent that advertises `shutdown` gets it, in-flight work gets a bounded time to finish, and the rest is cancelled through the normal path so hooks run. It stops the agents, not the process. `kernel_stop` acknowledges first, then about 100 ms later stops the process gracefully: drain, every call settles, the last rows flush, the lock is released, exit 0.',
        { h3: 'What survives a restart' },
        { list: [
          'The agent tree, from the `agent.yaml` files under `.fantastic/`; schedules and conversations too.',
          'The kernel’s `guid` and its id counter.',
          'Settled named executions and their recorded outcomes, dead letters and acks, and open `await_set` waits — when the kernel’s memory store is persistent. `sqlite_store` keeps “its ledger, dead letters, named-call dedup and every AI agent’s memory”; with `ram_store` those rows end with the process.',
        ] },
        'Two honest limits. A call in flight when the process dies has no settle row, and per the code “re-sending runs it.” On a graceful stop the drain settles interrupted calls as `cancelled`, which makes them dead letters. Replaying an interrupted turn to where it stopped is not built.',
      ],
    },
    {
      id: 'runtimes',
      title: 'Rust and Python',
      blocks: [
        'The Rust files describe themselves as rule-for-rule ports of the Python kernel, “which is canonical.” Everything above is implemented in both:',
        { table: { head: ['', 'Rust', 'Python'], rows: [
          ['the 14 kernel verbs', 'yes', 'yes, the same set'],
          ['batch `send`, five statuses, dead letters', 'yes', 'yes'],
          ['two-sided gate, baseline `{"$self": "*"}`', 'yes', 'yes, same refusals'],
          ['tasks, `ps`, `cancel`, integer ids', 'yes', 'yes'],
          ['one id counter in blocks of 1000', 'yes', 'yes'],
          ['`await_set`', 'yes', 'yes (“twin”)'],
          ['how bundles load', 'crates linked in at compile time', 'entry points'],
          ['root `reflect` reports `runtime`', '`"rust"`', '`"python"`'],
        ] } },
        'The `fantastic` CLI is one static binary that runs the Rust kernel in-process. Both kernel hosts also run on their own from a source checkout: `uv run fantastic_kernel` for the Python reference kernel and `cargo run --bin fantastic_kernel` for the Rust one.',
      ],
    },
  ],
  sources: [
    ['README.md', src('README.md')],
    ['THESIS.md', src('THESIS.md')],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['agents.md and reflect.md', src('src/lib/rust/crates/bundles/fantastic-core/src/docs')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
    ['the call-gate e2e probe (E114)', src('e2e/tests/kernel/E114_call_gate/probe.py')],
  ],
}

const folding = {
  slug: 'context-folding',
  n: 2,
  title: 'Context folding',
  short: 'Context folding',
  headline: 'Context folding: a long conversation in a finite window',
  description: 'How a Fantastic AI agent keeps a long conversation inside a finite context window without losing it: rows in a memory store, folds that are appended rows with refs, levels, recall, clear, forget and fork, and why the prompt prefix stays byte-identical.',
  summary: 'Memory as rows in a store, folds as appended rows with refs, folds of folds, recall, clear and forget, fork, and why the prefix stays byte-identical for the prompt cache.',
  cover: 'cf1_fold',
  about: ['Aisixteen Fantastic', 'LLM context window', 'Prompt caching', 'Conversation memory'],
  lead: [
    'A model reads a finite window, and an agent that works for hours outgrows it. Something has to give. Folding is Fantastic’s way of giving without losing anything: a finished stretch of work collapses into one row that names what it hides, and in the code’s words “the history becomes a tree of marks the model walks down as far as it needs.”',
    'This article covers the storage under it, the fold row itself, levels, the verbs that fold, recall, clear, forget and fork, and the reason old bytes never move: the provider’s prompt cache. Folding is opt-in, with `context_strategy: fold`; the default strategy is `compact`.',
  ],
  sections: [
    {
      id: 'store',
      title: 'Memory is rows in a store',
      blocks: [
        'An AI agent’s conversation lives in a **memory store** agent, one row per message. Two store bundles ship, each in Rust and in Python with identical readmes: `ram_store`, where everything is lost when the process exits, and `sqlite_store`, one SQLite file that survives it. They answer “the SAME verbs, arguments, replies and refusals”; the only difference a caller sees is `durable: true`.',
        'Rows are keyed `(owner, id)`. The owner is the caller, `<kernel guid>|<agent id>`, set by the store from who is calling: “there is no `owner` field to forge.” Row ids are the kernel’s own counter, the same one that numbers calls and tasks, which is why an id also orders rows in time.',
        { table: { head: ['verb', 'what'], rows: [
          ['`append {rows}`', 'add rows under your key, all or none'],
          ['`read {after?, limit?, kinds?, match?, ...}`', 'your rows'],
          ['`search {query, ids?}`', 'the lines that mention something'],
          ['`prune {before_id | ids, keep?}`', 'delete your rows; fold refs on them go too'],
          ['`inject {tables}` · `dump`', 'replace or capture the whole store'],
        ] } },
        'A fold’s members are kept in a `fold_refs` table whose foreign keys cascade, so pruning a row also removes it from every fold that names it. `sqlite_store` adds an FTS5 trigram index for `search`, runs in WAL mode, and on `prune` overwrites the deleted bytes and truncates the WAL, “so the text leaves `memory.db` and its `-wal` at once.”',
      ],
    },
    {
      id: 'fold',
      title: 'A fold is an appended row',
      blocks: [
        'What the model reads is a **view** over those rows: an ordered list of row ids, each at a resolution (`full`, `stub` or `fold`). The view is saved as a row of its own, so the next turn, and the next process, rebuild the same bytes instead of a freshly guessed prefix.',
        'A fold is an ordinary row appended to the conversation. It carries `refs` (the ids it collapses, in order), a `title` of at most 140 characters, a summary `body`, a `level` and an `anchor`. Nothing is rewritten and nothing is lost. The model sees it as one line plus the summary:',
        { code: '[fold 41 · 7 refs · L1] "Fixed the printer queue bug"\nASKED: ...\nDONE: ...\nBINDING: ...\nERRORS: ...\nOPEN: none', label: 'a fold as the model sees it (illustrative)' },
        'The `anchor` is the smallest ordinary row id the fold covers. Because row ids order rows in time, the view can place a fold at its anchor without loading the rows it hides. Rendering is deterministic, “so a view renders the same bytes until a new fold lands.” If the summarizer fails, the fold is still written, with its refs and the members’ titles, and says so on its header line: “Degraded, loud, never silent.”',
        { video: 'cf1_fold' },
        { h3: 'Folding by hand: context_fold' },
        '`context_fold {from?, to?, summary?}` is an operator verb, not one the model is taught. It folds a range of consecutive rows in the view into one fold row, `summary` used verbatim or written by the fold summarizer, and answers `{folded: <fold id>, rows: <n>, summarized: <bool>}`. The new view is the rows before the range unchanged, then the fold, then the rows after. It refuses an empty range, an id not in the view, a range that crosses a fold or a clear row, a range that starts at or before the pinned primer, and any range while a turn is running.',
        { code: 'context_fold {"from": 12, "to": 18, "summary": "printer fixed; queue cleared"}\n  -> {"folded": 41, "rows": 7, "summarized": true}', label: 'illustrative ids' },
      ],
    },
    {
      id: 'levels',
      title: 'Folds of folds',
      blocks: [
        'Folds nest. A fold’s level is one more than the highest level among the folds it contains: 1 for a fold of rows, 2 for a fold of folds, and so on. When three adjacent folds sit at the head of the view, they fold as a group. The constant is `FOLD_RUN = 3`, and its comment explains the choice: “THREE, not four ... depth grows as log3 of the history rather than one level per cut.”',
        { video: 'cf2_levels' },
        'The summary format is fixed. The model writes a one-sentence title, then five sections, “omitting none (write `none`)”: ASKED, DONE (and why), BINDING (rules and choices that still bind), ERRORS (quoted verbatim) and OPEN. When a fold contains earlier summaries, they are merged: “the newer statement wins, and unfinished work is carried forward.” The summary budget is 1024 tokens; a summary still over it after three re-summarizes fails the turn loudly.',
        'Next to the summary, every fold carries a mechanical index that no summarizer can drop: the file names and identifiers its members mention, and up to 1200 characters of what the user said, verbatim.',
        'Going back down is one verb. `history {fold: <id>}` returns the fold’s title and summary and its members one level down, and a member that is itself a fold opens the same way. `grep` finds a line “behind every clear, inside every fold,” and `recall` pages turns back from the durable store.',
      ],
    },
    {
      id: 'strategy',
      title: 'When folding happens',
      blocks: [
        'Each AI agent has one `context_strategy`, chosen statically; there is no try-this-then-that chain, and an unknown value is refused.',
        { table: { head: ['strategy', 'what it does when the window fills'], rows: [
          ['`compact`', 'the default'],
          ['`truncate`', 'keeps the first, task-framing turn and the recent turns, drops the middle; no model call'],
          ['`strip`', 'drops reply bodies and keeps their titles, oldest first; no model call'],
          ['`fold`', 'folds finished chains into fold rows, then strips, then cuts'],
          ['`none`', 'never shrinks; an over-budget turn is refused before any model call'],
        ] } },
        '`fold` is “THE ONE STRATEGY THAT WRITES.” Every other strategy is a pure projection; this one appends fold rows to the durable store, “because a fold is a mark that must persist — the next turn has to see the same collapse, or the prefix rewrites every turn.”',
        'It starts once the view passes `FOLD_AT = 0.95` of the body budget and works oldest first, in one batch, until the view is at `LOW = 0.6` or under. Step one folds **closed** chains, one summarizing call each. A chain is open while its last row is an assistant turn still owed a reply, and open chains are never folded. If the view is still over, step two strips reply bodies in open chains; if it is still over, step three cuts. The last `KEEP_TAIL = 6` rows never fold.',
        { code: '[reply to pid · notes read · "survey chunk 2"]\\n<6800 bytes>       L0  full row\n[reply to pid · notes read · "survey chunk 2"] (stripped: 6800 bytes)  L1  stub', label: 'strip, from its module doc' },
        'Strip follows two rules that keep the cache warm. Hysteresis: it strips only past a high watermark and then down to `LOW` in one batch, because “ten stubs in one event is one cache miss, not ten.” Monotone, oldest first: “Once stripped, always stripped,” so “the stable prefix only ever EXTENDS, never gets holes.”',
        'Token counts are estimates (characters divided by four), calibrated against the prompt sizes the model server reports.',
      ],
    },
    {
      id: 'cache',
      title: 'Why the prefix stays byte-identical',
      blocks: [
        'Model servers cache the work done on a prompt’s prefix and compare it **byte for byte**: an append after the cached prefix reuses it, an edit inside it does not. The `ai_core` code records one measurement on its own stack (a vLLM prefix cache): an append reused the prefix in full, 4752 of 6559 tokens (72.3%), while “any edit inside it — or a cut taken from the front of it — reuses nothing and recomputes everything.”',
        'So Fantastic only appends. Rows are never edited, a fold is a new row placed at its anchor, the view is persisted, and `context_fold` keeps the rows before its range exactly as they were rendered. The Rust tests assert that “the messages before the fold are byte-identical,” and the E125 end-to-end probe checks the same across a kernel restart.',
        { video: 'cf3_cache' },
        'To be precise about the claim: a fold replaces its members, so the prompt does change from the fold on. What stays byte-identical is everything before the folded range, and after the fold lands, the next turns append after it again. Whether a provider actually hits its cache depends on the provider; the code only keeps the bytes stable and places markers.',
        { h3: 'Caching modes and the primer' },
        'The `caching` setting picks how the view is rendered. `none` sends every stored row, in order, never trimmed. `cleanup`, the default, trims superseded whole-state reads, repeated reply bodies and used docs from the view, with no markers. `provider_cache` sends what `none` sends, plus two cache markers: the end of the **primer** (the row `cache_primer_until` names) and the last fold or clear row. The Anthropic backend turns them into `cache_control` markers, at most four; a backend that cannot cache refuses `provider_cache`.',
        'The primer is pinned in every mode: “The primer and every row before it are pinned — context_fold will not fold a range that starts at or before it.”',
      ],
    },
    {
      id: 'fork',
      title: 'fork and mark: reuse a prefix',
      blocks: [
        '`fork {at, name?, id?}` starts a new agent from this one’s first rows. The fork gets the same card (handler, model, endpoint, system prompt, memory store, context settings, `can_call`) and a copy of every row with id ≤ `at`, **under its own key with the same ids**, plus every fold whose members all fall at or before `at`, in one all-or-nothing append. It answers `{id, copied, at}`.',
        { quote: 'Rows are never edited and the provider’s prompt cache compares bytes, not storage, so the fork re-appends the parent’s rows under its OWN key with their original ids and hits the parent’s cache.', cite: 'fork.rs' },
        'After that the two are separate: “Later rows, folds and forgets on either side never reach the other.” A fork point must be clean, and a bad one is refused with a reason: `no_such_row`, `cuts_turn` (inside a turn, or one still owed a reply), `cuts_fold` (some of a fold’s members before `at`, some after), `parent_mid_turn`, or `store_refused`, which leaves no agent behind.',
        { video: 'cf4_fork' },
        '`mark {label, note?, version?}` records a turn boundary outside any fold, a point `fork` always accepts; an agent keeps its last 20 marks. `fork_points` lists them with `rows_after` and a `warm` flag, true while the agent’s last send is younger than 300 seconds, the code’s assumption of how long a provider keeps a prefix warm.',
      ],
    },
    {
      id: 'recall',
      title: 'Recall: rebuilding the view',
      blocks: [
        '`context_recall {dry?}` rebuilds the agent’s view from its store. With the fold strategy, a head longer than the budget is folded first. Then the head is fitted to the budget at digest resolution, the model is asked which rows it wants in full (one model call), the chosen id list is persisted and the decision is logged as a row. It answers `{kept, expanded, dropped, folded, budget, why, degraded}`. A bad or missing model answer changes nothing: recall falls back to the mechanical fit and reports `degraded`.',
        'Some rows always stay in. The goal turn is first. Then, within half of the target (`PIN_SHARE = 0.5`), the standing rows: the first task root (the turn that set the task), the last task root (the live one), the newest fold, then other task roots, newest first. The rest fills newest first. The purpose, per the code: “a reboot after a long run of polling still sees why it is running.”',
        'Recall runs on the first turn after a boot, after a batch that folded (debounced to every third fold batch), or on request. With `dry: true` it does the mechanical fit only, with no model call.',
      ],
    },
    {
      id: 'forget',
      title: 'Clear and forget',
      blocks: [
        '`context_clear {why?}` starts a new thread on the same store. It appends one clear row whose members are every row since the previous clear, and the view starts at its line:',
        { code: '[cleared 90 · 34 rows] switching to the invoice task — a new thread; the rows before it are this clear\'s members, reachable by id (grep, recall, history fold=90).', label: 'a clear line (illustrative ids)' },
        'Nothing is deleted: `grep`, `recall` and `history {fold: <id>}` still reach every member. It answers `{cleared, rows}`.',
        '`context_forget {include_cleared?}` is the verb that deletes. In one `prune` it removes every ordinary row covered by a fold whose place is known (rows of an open chain are spared) and all but the newest view row; with `include_cleared` it also removes every row before the last clear, which stays. It keeps every fold at every level, every row no fold covers, and the anchors a kept fold needs. It answers `{pruned, kept_folds, unanchored}`. The verb’s own promise: “The next prompt is the same before and after.” Afterwards, a pruned id is gone from `grep`, `recall` and `history`, while `history {fold}` still returns the fold’s title and summary.',
        { video: 'cf5_forget' },
        '`context_status` reports the posture: `{context_window, output_reserve, budget, strategy, last_projection, last_reaction}`, where the projection record lists the ids the model actually saw that turn, measured from the view rather than self-reported.',
      ],
    },
    {
      id: 'runtimes',
      title: 'Rust and Python',
      blocks: [
        'Both runtimes implement the fold, strip, truncate, compact and none strategies, the caching modes, `context_fold`, `context_recall`, `context_clear`, `context_forget`, `context_status`, `fork`, `mark` and `fork_points`, and both ship `ram_store` and `sqlite_store`. The Rust code describes itself as mirroring Python, with Python’s `folds.py` as “the immutable reference.”',
        'One difference is visible in `context_status`: Python builds a pinned-facts block in the prompt, while the Rust runtime has none and always reports `pinned_facts: 0`.',
      ],
    },
  ],
  sources: [
    ['ai_core (Python)', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core')],
    ['fantastic-ai-core (Rust)', src('src/lib/rust/crates/bundles/fantastic-ai-core/src')],
    ['ram_store readme', src('src/lib/python/bundled_agents/memory/ram_store/src/ram_store/readme.md')],
    ['sqlite_store readme', src('src/lib/python/bundled_agents/memory/sqlite_store/src/sqlite_store/readme.md')],
    ['the context_fold e2e probe (E125)', src('e2e/tests/memory/E125_context_fold')],
    ['README.md', src('README.md')],
  ],
}

export const foundations = {
  slug: 'fantastic/foundations',
  title: 'Foundations',
  headline: 'Foundations of Aisixteen Fantastic',
  description: 'How Aisixteen Fantastic works underneath, one mechanism per article: the kernel of agents and its messaging, then context folding, with short animations of each mechanism.',
  lead: 'How Fantastic works underneath, one mechanism at a time. Each article follows the code on the main branch of the open-source repo, for the Rust and Python runtimes, with short animations of the mechanism it describes.',
  published: '2026-10-27',
  articles: [kernel, folding],
}
