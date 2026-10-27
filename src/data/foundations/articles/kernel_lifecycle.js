import { src } from '../lib.js'

const K = 'src/lib/rust/crates/fantastic-kernel/src'
const P = 'src/lib/python/kernel'

export default {
  headline: 'Lifecycle: create, update, delete, start and stop',
  description: 'How the Aisixteen Fantastic kernel creates, updates and deletes agents, boots a tree with kernel_start, and stops with shutdown_agents and kernel_stop. Rust and Python behave the same.',
  summary: '`create_agent` names its parent, `update_agent` replaces whole fields, `delete_agent` cascades deepest first, and `kernel_start` boots the root, the memory store, then everyone else.',
  cover: { clip: 'start' },
  about: ['Aisixteen Fantastic', 'Agent lifecycle', 'Kernel'],
  lead: [
    'An agent lives from the `create_agent` that makes its record to the `delete_agent` that removes it, and the kernel around it starts and stops. Each step is one kernel verb, and the Rust and Python runtimes do the same thing.',
    'This page follows that order: create, update, delete, then the start sequence, the two stop verbs and what a restart reads back. The record that these verbs write is described in [Agents as records](/fantastic/foundations/kernel/records/).',
  ],
  sections: [
    {
      id: 'verbs',
      title: 'Kernel verbs belong to the root',
      blocks: [
        'The kernel answers fourteen verbs: `create_agent`, `update_agent`, `delete_agent`, `list_agents`, `ps`, `cancel`, `ledger`, `ack_deadletter`, `await_set`, `await_cancel`, `kernel_start`, `shutdown_agents`, `kernel_stop` and `docs`. This page covers the lifecycle ones; [Tasks and waiting](/fantastic/foundations/kernel/tasks/) covers `ps`, `cancel` and the waits.',
        'Only the root agent answers them. The agent a call names is the **operand**, not the actor: `create_agent` names the new agent’s parent, `delete_agent` the agent to remove. A kernel verb sent to any other agent is refused with `reason: "not_here"`, and the hint says to address `kernel` and to name the agent in `parent_id` or `id`.',
        'They take the same [call gate](/fantastic/foundations/protocol/call-gate/) as any other send, against the root. Whoever holds a verb on the root holds it for every agent.',
      ],
    },
    {
      id: 'create',
      title: 'create_agent: placement is always stated',
      blocks: [
        '`create_agent` needs two arguments, `handler_module` and `parent_id`. There is no default parent: the call does not guess from who sent it. A missing `parent_id` is refused with `reason: "missing_arg"` and a hint to name the agent that will own the new one, “your own id for a tool you keep, or the root (‘kernel_state’) for a top-level agent”. The reserved name `kernel` also works for the root.',
        { code: '[{"target": "kernel", "payload": {"type": "create_agent",\n  "handler_module": "ram_store.tools", "parent_id": "lead"}}]', label: 'create a child of lead (illustrative ids)' },
        'The `id` is optional. Without one, the kernel mints `<bundle>_<6 hex digits>` from the handler module’s second-to-last dotted segment, for example `ram_store_a3f9c1`. An id that is already in use is refused with `reason: "exists"`. Every other field in the payload becomes the new record’s meta, and the keys the substrate owns (`root_path`, `ctx`, `parent`) are refused.',
        { video: 'create' },
        'The kernel checks the meta before it creates anything: a grant map of the wrong shape, or a value the bundle’s own check rejects, is refused with `invalid_meta`. A `handler_module` that no installed bundle provides is not refused; the record is made and it answers no domain verbs until the bundle exists.',
        'The new agent is registered under its parent, then booted at once. The kernel runs the child’s `boot` itself, as the child and without the call gate, before the reply. If the boot fails, the kernel prints the failure and the agent still exists. The reply is the new record, and the parent gets an `agent_created` message.',
      ],
    },
    {
      id: 'update',
      title: 'update_agent: a field is replaced, not merged',
      blocks: [
        '`update_agent` takes an `id` and any fields to set. Every field the call names is replaced, and a field it does not name is untouched. A dict field is therefore sent whole. The verb’s own doc puts it this way: “Granting one edge reads like a PATCH and behaves like a PUT.”',
        { code: 'before  can_call {"$self": "*", "a": ["reflect"]}\nsend    update_agent id=x can_call={"b": ["reflect"]}\nafter   can_call {"b": ["reflect"]}', label: 'a map is replaced whole (illustrative)' },
        'To grant one more edge, restate every key to keep, including the baseline `$self`; the keys left out are gone. [Call gate and grants](/fantastic/foundations/protocol/call-gate/) explains the maps.',
        'Some fields cannot be set. `handler_module` is fixed at create, because swapping it would leave a running agent whose state belongs to the old bundle. The substrate keys `root_path`, `ctx` and `parent` are refused too, and `parent_id` is ignored: where an agent sits comes from the tree, not from its meta. These checks run before the id is looked up.',
        'The kernel checks grant maps and the bundle’s own rules for the new values, and refuses with `invalid_meta` when they fail. On success the reply is `updated: true`, the `id` and the new record, and the caller gets an `agent_updated` message that lists the changed field names. The root can be updated like any agent, which is how it gets its `memory_store_id` below.',
      ],
    },
    {
      id: 'delete',
      title: 'delete_agent: the whole subtree, deepest first',
      blocks: [
        '`delete_agent` takes an `id` and removes that agent and everything below it. The root cannot be deleted: it owns persistence and answers the kernel verbs, so deleting it would leave no kernel. That is a `bad_arg` refusal.',
        'Before it deletes anything, the kernel walks the subtree for `delete_lock`. If the target or any descendant carries `delete_lock: true`, the whole delete is refused with `reason: "locked"`. The refusal names the first blocker in `blocked_by`, and its hint is “clear the lock with update_agent, then delete again”. Nothing has changed at that point.',
        { video: 'delete' },
        'The cascade then runs per node, children first. For each agent the kernel runs the bundle’s `on_delete` hook, as that agent, then detaches the agent from its parent and drops it from the tree. A hook that raises is printed and the cascade goes on, so a delete cannot be blocked from inside.',
        { list: [
          '**Memory.** An AI agent’s `on_delete` removes its persisted rows from the memory store. `keep_memory: true` on the delete, the literal `true` only, keeps the rows of every agent in that subtree, for that one delete.',
          '**Grants.** After the cascade, every deleted id is removed from every other agent’s `can_call` and `callable_by`. An agent created later under the same id inherits no old edge.',
          '**Reply.** `deleted: true` and the `id`. The caller gets an `agent_deleted` message.',
        ] },
      ],
    },
    {
      id: 'start',
      title: 'kernel_start: the order of boot',
      blocks: [
        'Loading a tree and booting it are two steps. The loader builds the agents from their records, and `kernel_start` runs the start sequence. The daemon runs the sequence once its tree is loaded, and it is also a verb an operator can send.',
        'The sequence needs a **memory store**: the root’s `memory_store_id` must name an agent. The kernel keeps its execution rows there (the [ledger](/fantastic/foundations/protocol/ledger/), dead letters and named-call dedup), and there is no built-in default. Without one, the verb fails loud, and the hint is the fix:',
        { code: 'create_agent parent_id=<root> handler_module=ram_store.tools id=memory\nupdate_agent id=<root> memory_store_id=memory', label: 'the hint, verbatim' },
        { video: 'start' },
        { ol: [
          'Boot the root. Its boot gives the kernel a `guid` when the record has none.',
          'Boot the memory store, before anyone who might call it.',
          'Probe the store with a `read` as the operator. If it refuses the kernel, `kernel_start` refuses now, not on the first flush.',
          'Write the reserved `next_id` bound to the root record, start the flusher that moves execution rows into the store, and restore the open `await_set` waits.',
          'Boot every other agent in registration order, then complete the waits that are already due.',
        ] },
        'The reply is `started: true`, the `store` id and `booted`, the ids that booted in order. A second call is idempotent: it answers `started: true` and `already: true` with the store. If the root or the store fails to boot, `kernel_start` is refused. Any other agent that fails to boot is printed, and the sequence goes on. AI agents boot lazily: they read their own store on their first turn.',
      ],
    },
    {
      id: 'stop',
      title: 'Stopping: shutdown_agents and kernel_stop',
      blocks: [
        'Two verbs stop things, and both are root-only. `shutdown_agents` stops the agents and leaves the process running. `kernel_stop` stops the whole process.',
        { list: [
          '**Drain.** `shutdown_agents` first refuses new work with `reason: "draining"`. A send made from inside work that is already live still passes.',
          '**Tell.** Every agent whose bundle declares a `shutdown` verb is sent `shutdown`, all at once, each with a 30-second bound. In the Python runtime an AI agent gets it as a message to persist what matters, and its tools still work.',
          '**Quiet.** The kernel waits up to 10 seconds for in-flight work. Whatever is left is cancelled through the normal `cancel` path, so `on_cancel` hooks run and subtrees die with their roots. Then it waits up to 2 seconds for each cancelled call to record its ending.',
        ] },
        'The reply is `drained: true`, `shut` (the ids told) and `cancelled`. The kernel keeps serving afterwards, so reads and `ledger` still work, until the process exits. A second call answers the same shape and shuts nothing new.',
        { video: 'stop' },
        '`kernel_stop` acknowledges first with `{"type": "kernel_stop", "ok": true}`. About 100 ms later, after the reply is on the wire, it asks the daemon to stop. The daemon then does the full teardown: drain, let every call settle (done, or cancelled into the dead letters), flush the last rows into the store, run each agent’s shutdown hook, release `.fantastic/lock.yaml` and exit 0. SIGINT and SIGTERM take the same path. Without a running serve loop, such as a one-shot CLI call, there is nothing to stop and the verb only acknowledges.',
      ],
    },
    {
      id: 'restart',
      title: 'Restart is a new process',
      blocks: [
        'The kernel has no restart verb. A restart is `kernel_stop` followed by a new daemon, and the second start reads back what the first one persisted.',
        { ol: [
          'Take `.fantastic/lock.yaml`. One kernel runs per workdir; a lock whose holder died is taken over.',
          'Read the root record from `.fantastic/agent.yaml` and every agent record under the children directory. A virgin workdir gets a fresh root.',
          'Validate the records first. A bad id, a reserved key, a duplicate or an orphan refuses the boot. A record whose `handler_module` is not installed in this runtime is logged and skipped, together with its subtree.',
          'Build the tree, then run `kernel_start` as above. With no `memory_store_id` on the root, the daemon tears down, releases the lock and exits with an error.',
        ] },
        'Records come back because the root’s loader writes them to disk as agents are created and updated. The memory store is a separate matter: a `ram_store`, as in the example above, holds its rows in RAM and loses them with the process. What a store keeps across a restart is the subject of [State and durability](/fantastic/foundations/kernel/state/).',
        { note: 'The headless Rust daemon starts only when the tree contains a `web.tools` agent. With nothing to serve, it exits quietly with code 0 and takes no lock.' },
      ],
    },
  ],
  sources: [
    ['kernel_verbs.rs: the fourteen verbs, their docs, shutdown_agents and kernel_stop (Rust)', src(`${K}/send/kernel_verbs.rs`, 14)],
    ['lifecycle.rs: create_agent, delete_agent, the cascade and grant pruning (Rust)', src(`${K}/lifecycle.rs`, 127)],
    ['executions.rs: Kernel::start, the start sequence (Rust)', src(`${K}/executions.rs`, 193)],
    ['kernel.rs: shutdown_agents and the graceful shutdown (Rust)', src(`${K}/kernel.rs`, 488)],
    ['bootstrap.rs: lock, read the tree, build it (Rust)', src(`${K}/bootstrap.rs`, 1)],
    ['_agent.py: the Python kernel verbs, delete and cascade', src(`${P}/_agent.py`, 2695)],
    ['_kernel.py: the Python start and shutdown_agents', src(`${P}/_kernel.py`, 662)],
    ['main.rs: the daemon, start to exit (Rust)', src('src/lib/rust/crates/fantastic-cli/src/main.rs', 608)],
  ],
  clips: {
    create: {
      title: 'create_agent: placement is stated',
      caption: 'A create_agent with no parent_id is refused with missing_arg. With parent_id "lead" the child is registered under lead with a minted id, ram_store_a3f9c1, booted by the kernel before the reply, and the reply is its record. The ids are illustrative.',
    },
    start: {
      title: 'kernel_start: the order of boot',
      caption: 'kernel_start on a root with no memory_store_id is refused. After update_agent names memory, the root boots (1), then memory (2), the kernel probes the store (3) and starts the flusher, then lead (4) and web (5) boot in registration order. The reply lists booted in that order.',
    },
    stop: {
      title: 'shutdown_agents and kernel_stop',
      caption: 'shutdown_agents drains the kernel, sends shutdown to lead and web, and cancels task 7 that is still in flight. The reply lists shut and cancelled. kernel_stop then acknowledges, and about 100 ms later calls settle, the last rows flush, hooks run, the lock is released and the process exits 0. The ids are illustrative.',
    },
    delete: {
      title: 'delete_agent: the whole subtree',
      caption: 'delete_agent on team is refused because reviewer carries delete_lock. After update_agent clears it, the delete cascades deepest first, each agent running its on_delete hook, and the deleted ids are pruned from x’s can_call.',
    },
  },
}
