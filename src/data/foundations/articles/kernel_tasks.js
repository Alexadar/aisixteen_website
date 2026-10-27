import { src } from '../lib.js'

export default {
  headline: 'Tasks and waiting: ps, cancel and await_set',
  description: 'How the Aisixteen Fantastic kernel tracks work in flight: the ps task table, cancel of a task subtree in two phases, and await_set for one wake on many reports.',
  summary: '`ps` lists work in flight as a tree, `cancel` kills a task and its subtree in two phases, and `await_set` wakes a lead once for a set of reports.',
  cover: { clip: 'cancel' },
  about: ['Aisixteen Fantastic', 'Task table', 'Cancellation'],
  lead: [
    'Every send that is running right now is a **task**. The kernel keeps them in one table, so any caller with the grant can list work in flight, stop it, or wait for a group of agents to finish.',
    'This page covers the task table and `ps`, `cancel` of a task and everything below it, and `await_set`, which wakes a lead once for a whole set of reports. The Rust and Python runtimes implement the same behaviour. How a send is checked first is on [Call gate and grants](/fantastic/foundations/protocol/call-gate/).',
  ],
  sections: [
    {
      id: 'table',
      title: 'The task table and ps',
      blocks: [
        'A task is one in-flight dispatch, not an agent. When a send reaches its target, the kernel adds a row to the **task table** for it and removes the row when the dispatch ends. The row is made before the handler runs, so a task can be stopped from its first moment.',
        'Tasks form a tree. A send made inside a handler is a child of that handler’s task. A send made outside every dispatch, such as one from the CLI or a test, has no parent and is a root, “like a process spawned by init.” Work that a bundle forks out of a dispatch, such as an exec job’s output pump, is registered as a task too, so it also shows up in the table and can be cancelled.',
        'A task id is a plain integer from the kernel’s one id counter. It is the same number that an outcome carries as its `pid`, so the id in `ps` is the id you give `cancel`. ([Messages and verbs](/fantastic/foundations/protocol/messages/) covers outcomes.)',
        '`ps` answers with the whole table, kernel-wide, oldest row first, unless you page it. Each row has five fields:',
        { code: '{"tasks": [{"id": 42, "agent": "planner", "parent": 41,\n            "verb": "run", "started_at": 1790000000.5}],\n "next": null}', label: 'ps (shape, illustrative values)' },
        { table: {
          head: ['field', 'meaning'],
          rows: [
            ['`id`', 'the task’s number'],
            ['`agent`', 'the agent that is handling the dispatch'],
            ['`parent`', 'the task that made this send, or `null` for a root'],
            ['`verb`', 'the verb being handled'],
            ['`started_at`', 'seconds since the epoch'],
          ],
        } },
        { video: 'ps' },
        '`ps` lists its own row, because it is a dispatch like any other. A reply can be paged: `limit` and an `after` cursor work as in `list_agents`, and `next` is `null` when no further page exists. The table is live, so a row that finishes while you page may be missed.',
        'When a task ends, its surviving children move up to its parent. Work that outlives the dispatch that started it therefore stays inside its caller’s subtree, where `cancel` on the caller still reaches it.',
        '`ps` and `cancel` are kernel verbs: the root answers them, so they are sent to `kernel`. They pass the same call gate as any other verb. An agent that holds the grant can read `ps` and cancel another agent’s runaway work.',
      ],
    },
    {
      id: 'cancel',
      title: 'cancel: a task and its subtree',
      blocks: [
        '`cancel {task_id}` kills that task and every task below it, children first, “like a process group.” The id may be an integer, its decimal string, or the name the caller gave its own execution. It answers with the ids it killed:',
        { code: '[{"target": "kernel", "payload": {"type": "cancel", "task_id": 42}}]\n→ {"cancelled": true, "killed": [43, 44, 42]}', label: 'cancel (illustrative ids)' },
        'An unknown or finished id is not an error. The answer is `{"cancelled": false, "killed": []}`. A missing `task_id` is refused with the usual shape ([Refusals](/fantastic/foundations/protocol/refusals/)).',
        { h3: 'Two phases' },
        'Dropping a task frees no operating-system resource: a child process or a socket stays open. So `cancel` runs in two phases, named after SIGTERM and SIGKILL.',
        { ol: [
          '**Hooks.** The kernel marks every task in the subtree as dying. It then awaits each agent’s bundle `on_cancel` hook, with all tasks still alive, so no handler sees a half-killed group. A hook runs as its own agent. If a hook fails, the error is logged and the kill goes on: cancel cannot be refused by a bundle.',
          '**Abort.** The kernel stops the tasks leaves first, with no wait in between, so a parent cannot resume between its child’s death and its own.',
        ] },
        { video: 'cancel' },
        'The hooks are where real resources go. An `exec_bridge` job’s `on_cancel` kills the job’s child process. An AI backend’s `on_cancel` closes the stopped turn: its open parts abort and its status goes to `done` with reason `cancelled`.',
        'The caller that was waiting on the cancelled send is not killed. Its item settles with status `cancelled` and the reply `{"cancelled": true}`. Nothing raises out of `send`. A caller that is itself inside the dying subtree does not resume either. It waits for its own stop.',
        'Two cases go the same way as `cancel`. A send with its own `timeout` kills its task through the same front door, so hooks run first, and its item settles as `timed_out`. And the kernel’s own service tasks, such as the loop that flushes the ledger to the memory store, refuse `cancel` with a `bad_arg` refusal. They stay listed in `ps` until the kernel stops. See [Ledger and dead letters](/fantastic/foundations/protocol/ledger/) for what a cancelled item leaves behind.',
      ],
    },
    {
      id: 'await',
      title: 'await_set: one wake for a set',
      blocks: [
        'A lead that waits for several workers would otherwise wake on every report and send its whole context again each time. `await_set {ids, timeout_s?, label?}` replaces that with one wake. It is a kernel verb, sent to `kernel` by the agent that wants to wait, and it answers at once:',
        { code: '[{"target": "kernel", "payload": {"type": "await_set",\n  "ids": ["w1", "w2", "w3"], "timeout_s": 60}}]\n→ {"wait_id": 50, "label": null, "ids": ["w1", "w2", "w3"], "timeout_s": 60}', label: 'await_set (illustrative ids)' },
        'The `wait_id` is another number from the kernel’s id counter. `label` is an optional string that comes back in the final message. The verb refuses an operator send, since nobody could be woken. It also refuses a missing or empty `ids`, an id that names no agent, the caller’s own id, a `timeout_s` that is not a positive number, and a `label` that is not a string.',
        'The signal each worker sends is a plain message, `{"type": "report", "state": ..., "result": ...}`, sent to the lead. No `report` verb is involved. While the wait is open, a report from a named agent is held instead of delivered, and the reporter is answered at once with `{"held": true, "wait_id": 50}`, so it never blocks on the lead. A second report from the same agent replaces its first.',
        { video: 'await' },
        'When every named agent has reported, or `timeout_s` passes, the lead receives one message:',
        { code: '{"type": "send", "text": "<the same body as compact JSON>",\n "wait_id": 50, "label": null,\n "done": [{"id": "w1", "state": ..., "result": ...}, ...],\n "missing": [], "timed_out": false}', label: 'the one message' },
        '`done` follows the order of `ids`, and `text` is the body as compact JSON, for a model to read. After a timeout, `done` holds the agents that reported, `missing` names the rest and `timed_out` is `true`. The last report and the timer cannot both win: the kernel claims the wait once, so the lead is woken once.',
        '`await_cancel {wait_id}` drops the caller’s own wait. The reports it held are then delivered one by one, each as its own message from the agent that sent it, in the order they were held. The answer is `{"cancelled": true, "wait_id": 50, "released": 2}`. A wait that is unknown, or belongs to another agent, answers `{"cancelled": false, "wait_id": ..., "released": 0}`.',
        'A wait is stored as rows in the kernel’s memory store, so it survives a restart: on start the kernel rebuilds each open wait, completes the ones already due, and re-arms the timers of the rest. A kernel that is stopping delivers nothing and leaves the wait open for the next start. If the lead has left the tree, nobody is woken.',
      ],
    },
  ],
  sources: [
    ['tasks.rs: the task table, ps rows and cancel (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/tasks.rs', 1)],
    ['kernel_verbs.rs: ps, cancel and the kernel verb docs (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/send/kernel_verbs.rs', 14)],
    ['_kernel.py: task_rows and cancel_task (Python)', src('src/lib/python/kernel/_kernel.py', 1235)],
    ['await_set.rs: held reports, the one message, restore (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/await_set.rs', 1)],
    ['_await.py: await_set (Python)', src('src/lib/python/kernel/_await.py', 1)],
    ['exec_bridge on_cancel: SIGKILL of a job (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/lib.rs', 606)],
    ['ai_core on_cancel: closing a stopped turn (Rust)', src('src/lib/rust/crates/bundles/fantastic-ai-core/src/verbs.rs', 229)],
  ],
  clips: {
    ps: {
      title: 'ps: the task table',
      caption: 'Five tasks run: 41 lead, its children 42 planner and 45 notes, and below 42 the tasks 43 exec_bridge and 44 model. The operator sends ps to kernel. The reply lists one row per task, oldest first, with id, agent, parent and verb. The last row, 46, is the ps dispatch itself. The parent column ties each row back to its place in the tree. Ids, agents and verbs are illustrative.',
    },
    cancel: {
      title: 'cancel: a task and its subtree',
      caption: 'cancel on task 42 first runs every on_cancel hook in its subtree while the tasks are alive: a child process is killed and a generation is closed. Then the tasks abort, leaves first. The sibling 45 and the parent 41 keep running. cancel answers cancelled true with the killed ids, and the waiting send settles as cancelled.',
    },
    await: {
      title: 'await_set: one wake for a set',
      caption: 'A lead sends await_set for w1, w2 and w3 with a timeout of 60 seconds and gets wait_id 50 back at once. Each worker then sends a report. The kernel holds each one and answers the worker held, and the count at the lead goes from 0 to 3 of 3. With all three in, the lead receives one message with wait_id 50, a done entry per worker, an empty missing list and timed_out false. Ids are illustrative.',
    },
  },
}
