// SEED — Ledger and dead letters. Status: planned (see registry.json); this page is not published.
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
  cover: { clip: 'ledger' },
  sections: [
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
        { video: 'ledger' },
      ],
    },
    {
      id: 'stop',
      title: 'Graceful stop and crash',
      blocks: [
        'Two honest limits. A call in flight when the process dies has no settle row, and per the code “re-sending runs it.” On a graceful stop the drain settles interrupted calls as `cancelled`, which makes them dead letters. Replaying an interrupted turn to where it stopped is not built.',
      ],
    },
  ],
  sources: [
    ['README.md', src('README.md')],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
  // Clips moved from the draft kernel article (rendered from anim/foundations/protocol_ledger.py).
  clips: {
    ledger: {
      title: 'Every call is an execution',
      caption: 'A named call writes a call row and a settle row, flushed into the memory store. A failed call is a dead letter with an on_deadletter event for its caller. After a restart, re-sending the named call returns the recorded outcome without running the handler; ack_deadletter retires the dead letter.',
    },
  },
}
