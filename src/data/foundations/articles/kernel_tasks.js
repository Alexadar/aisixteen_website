// SEED — Tasks and waiting. Status: planned (see registry.json); this page is not published.
// Material moved here from the first draft article "Kernel: agents and messaging" (#443 split).
// It was written from fantastic main at the time; the writer of this article re-checks every
// claim against fantastic main with a fact sheet, rewrites it to STYLE.md, fills headline,
// description, summary and about, and adds clips (3–5 per article). Delete `seed: true` then.
import { src } from '../lib.js'

export default {
  seed: true,
  headline: '',
  description: '',
  summary: '',
  about: ['Aisixteen Fantastic'],
  lead: [],
  cover: { clip: 'cancel' },
  sections: [
    {
      id: 'tasks',
      title: 'Work in flight: ps and cancel',
      blocks: [
        'An agent is a node; a **task** is one in-flight dispatch. Tasks form a tree: a `send` issued inside a handler is a child of that handler’s task, “like a process spawned by init.” `ps` lists them kernel-wide, one row per dispatch, `ps`’s own row included:',
        { code: '{"tasks": [{"id": 42, "agent": "planner", "parent": 41, "verb": "run", "started_at": ...}], "next": ...}', label: 'ps (shape)' },
        'Task ids are plain integers from the kernel’s one id counter, the same number an outcome carries as `pid`. `cancel {task_id}` kills that task and its whole subtree, “like a process group,” and answers `{"cancelled": true, "killed": [...]}`. An unknown or finished id answers `{"cancelled": false, "killed": []}`. The caller blocked on the cancelled send gets status `cancelled`; nothing raises.',
        { video: 'cancel' },
        'Cancel runs in two phases. First, every `on_cancel` hook in the subtree is awaited while all the tasks are still alive; that is where real resources go (an `exec_bridge` job’s child process is SIGKILLed, an AI backend’s in-flight generation is closed out with a `done` event). Then the tasks abort, leaves first. A task being cancelled starts no new work, and the kernel’s own service tasks refuse `cancel`.',
        'These are ordinary verbs behind the gate, so an agent with the grant can read `ps` and cancel another agent’s runaway work.',
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
  ],
  sources: [
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
  // Clips moved from the draft kernel article (rendered from anim/foundations/kernel_tasks.py).
  clips: {
    cancel: {
      title: 'cancel: a task and its subtree',
      caption: 'cancel on task 42 first runs every on_cancel hook in its subtree while the tasks are alive (a child process is SIGKILLed, a generation is closed), then aborts the tasks leaves first. The sibling and the parent keep running; the waiting send settles as cancelled.',
    },
  },
}
