// SEED — Messages and verbs. Status: planned (see registry.json); this page is not published.
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
  cover: { clip: 'batch' },
  sections: [
    {
      id: 'send',
      title: 'One verb: send',
      blocks: [
        'Every interaction is one **batch** send: a list of items, each `{target, payload}`, answered in order with `{pid, status, result}`. There is deliberately no single-call form. The code says why: a model reply that fans out to N calls would otherwise get its answers spread over the next N replies. In the README’s words, “One turn of 500 calls runs as one kernel batch on every runtime.”',
        { code: '[{"target": "kernel", "payload": {"type": "list_agents"}},\n {"target": "kernel", "payload": {"type": "ps"}}]', label: 'two calls, one send' },
        'The whole batch is registered as tasks, visible in `ps`, before the first reply is awaited. The items then run concurrently, and the result array keeps the input order.',
        { video: 'batch' },
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
      ],
    },
    {
      id: 'reflect',
      title: 'The protocol is the API',
      blocks: [
        'There is no client library. Every agent answers `{"type": "reflect"}` with what it is, and the `docs` kernel verb says how to call it. A reflect carries the agent’s `can_call` and `callable_by`, so an agent can read what it may call without trial and error. The README’s first example is one reflect of the root:',
        { code: '[{"target": "kernel", "payload": {"type": "reflect", "readme": true}}]', label: 'send' },
        'It returns the live tree and the kernel’s manual index. With `bundles: "all"` it also lists every kind of agent you can create, which is enough for a person or a model to take it from there.',
      ],
    },
  ],
  sources: [
    ['README.md', src('README.md')],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['agents.md and reflect.md', src('src/lib/rust/crates/bundles/fantastic-core/src/docs')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
  // Clips moved from the draft kernel article (rendered from anim/foundations/protocol_messages.py).
  clips: {
    batch: {
      title: 'One send, a batch of calls',
      caption: 'A model turn sends three items in one batch. The kernel registers all three as tasks in ps before any reply; they run concurrently and finish in any order, and the reply array keeps the input order: one {pid, status, result} per item.',
    },
  },
}
