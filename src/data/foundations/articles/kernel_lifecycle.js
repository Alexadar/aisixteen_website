// SEED — Lifecycle. Status: planned (see registry.json); this page is not published.
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
  cover: { clip: 'delete' },
  sections: [
    {
      id: 'verbs',
      title: 'Composition verbs',
      blocks: [
        'Fourteen verbs belong to the kernel, and only the root answers them: `create_agent`, `update_agent`, `delete_agent`, `list_agents`, `ps`, `cancel`, `ledger`, `ack_deadletter`, `await_set`, `await_cancel`, `kernel_start`, `shutdown_agents`, `kernel_stop` and `docs`. The agent you name is the operand, not the actor, so a kernel verb sent to any other agent is refused with `not_here` and the fix.',
        { list: [
          '`create_agent` needs `handler_module` and `parent_id`. There is no default parent: “placement is always stated, never inferred from who sent the call.” The reply is the new record, and the child boots right away.',
          '`update_agent` replaces every field you name and leaves the rest alone. A map such as `can_call` is replaced whole: “Granting one edge reads like a PATCH and behaves like a PUT.” `handler_module` cannot change.',
          '`delete_agent` deletes the agent and its whole subtree, deepest first. `keep_memory: true` keeps the subtree’s rows in the memory store.',
          '`list_agents` returns every record, flat, root first, paged.',
        ] },
        { code: '[{"target": "kernel", "payload": {"type": "create_agent",\n  "handler_module": "ram_store.tools", "parent_id": "kernel", "id": "memory"}}]', label: 'create a child of the root' },
        { video: 'delete' },
        'A delete runs per node: children first, then the bundle’s `on_delete` hook, then the agent leaves the tree. A raising hook is logged and the cascade goes on. If any agent in the subtree carries `delete_lock`, the whole delete is refused with `reason: "locked"` and `blocked_by` naming it; clear the lock with `update_agent` first. The root cannot be deleted. After a cascade, every deleted id is pruned from every other agent’s `can_call` and `callable_by`, so an agent created later under the same id inherits no stale edge.',
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
      ],
    },
  ],
  sources: [
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
  // Clips moved from the draft kernel article (rendered from anim/foundations/kernel_lifecycle.py).
  clips: {
    delete: {
      title: 'delete_agent: the whole subtree',
      caption: 'delete_agent on team is refused because reviewer carries delete_lock. After update_agent clears it, the delete cascades deepest first, each agent running its on_delete hook, and the deleted ids are pruned from x’s can_call.',
    },
  },
}
