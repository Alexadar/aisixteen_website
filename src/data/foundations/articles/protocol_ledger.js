// Protocol › Ledger and dead letters. Facts: coder/tmp/foundations/facts/protocol_ledger.md
// (fantastic main b175660c). Clips render from anim/foundations/protocol_ledger.py.
import { src } from '../lib.js'

const KERNEL = 'src/lib/rust/crates/fantastic-kernel/src'

export default {
  headline: 'Ledger and dead letters: what the kernel records',
  description: 'How the Aisixteen Fantastic kernel records each call as a call row and a settle row, and why failed, timed-out and cancelled calls become dead letters.',
  summary: 'Every call leaves a call row and a settle row; failed, timed_out and cancelled ones are dead letters until acknowledged.',
  cover: { clip: 'ledger' },
  about: ['Aisixteen Fantastic', 'Durable execution'],
  lead: [
    'The kernel records what happens to every call. A call that ends badly is not dropped and not retried behind your back: it becomes a **dead letter**, which the caller is told about and a person acknowledges.',
    'This page covers what is recorded and where, which endings make a dead letter, the `ack_deadletter` verb, and what a graceful stop and a crash leave behind.',
  ],
  sections: [
    {
      id: 'recorded',
      title: 'What is recorded',
      blocks: [
        'Every send that the kernel dispatches is an **execution**. It writes a `call` row when it starts, with the verb, the caller and the payload as sent. When it ends, it writes a `settle` row that names the call and holds the outcome.',
        'The rows start in the kernel’s RAM. A flusher waits 150 ms after a new row, then writes everything waiting as one batch into the **memory store**: the agent that the root record names in `memory_store_id`. The batch ends with a `flush` row that lists the ids it covers. If the store refuses the batch, the rows stay in RAM for the next flush. A flushed, settled execution leaves RAM.',
        'The kernel does not start without a memory store. `kernel_start` refuses when the root names none.',
        { h3: 'What a settle row keeps' },
        'A settle row does not keep every reply. It keeps the whole result of a **named** call, the error fields of a dead letter (each cut at 500 characters), and for everything else only `{status, bytes}`. The kernel’s own store reads are executions too, so keeping their bodies would record the store inside the store.',
        { h3: 'Named calls run once' },
        'A send can give an item a string `id`, which names the execution. A new name dispatches and records. A name that is still running is joined: there is no second run. A name that has settled returns the recorded outcome, and the handler does not run again.',
        'Before it dispatches an item with an `id`, the kernel reads the store for it. So a name still works after its rows were flushed and after a restart. An integer `id` joins an execution that already exists and never creates one.',
        { video: 'ledger' },
        { h3: 'Reading the ledger' },
        'The `ledger` verb lists executions as `{id, target, status, attempts, retries, named, outcome?, acked?}`. It merges the rows in the store with the rows still in RAM. A call with no settle row yet has the status `in_flight`.',
        'The view is scoped to the caller. An agent sees only the executions it originated, and the operator sees all of them. The code comments why: unscoped, the ledger would be a side-channel around `callable_by`.',
      ],
    },
    {
      id: 'dead-letters',
      title: 'Dead letters and ack_deadletter',
      blocks: [
        'An execution has one of five ending statuses. `completed` and `errored` mean the handler ran and answered, so they are not dead letters. `failed`, `timed_out` and `cancelled` are. A handler that raises or panics settles `failed`, a call that passes its deadline settles `timed_out`, and a `cancel` settles `cancelled`.',
        'A call that is refused before it starts is different. A denial at the call gate or an unknown target returns a `failed` outcome to the caller, but the kernel has not opened an execution, so it writes no rows and creates no dead letter.',
        'Retries come first. An item may set `retries`, and the kernel sends a `failed` or `timed_out` call again under the same id while the budget lasts. A `cancelled` call is never retried. When the last attempt ends badly, the execution settles and is a dead letter.',
        { h3: 'The event' },
        'The kernel then emits an `on_deadletter` event. It goes to the inbox of the agent that made the call. For an operator send, or when the caller is gone, it goes to the root.',
        { code: '{"type": "on_deadletter", "id": 57, "target": "fetcher", "caller": "lead", "status": "failed", "attempts": 1}', label: 'the event (illustrative ids)' },
        'Nothing retries a dead letter afterwards. The `ledger` rows with one of the three dead statuses are the dead-letter queue: there is no separate queue and no re-send verb. To try again, send the work under a new `id`.',
        { h3: 'Acknowledging' },
        '`ack_deadletter {id}` takes an execution id or its name. It refuses an execution that is not yours, and one that is not a dead letter. Otherwise it writes an `ack` row that names the execution and returns `{acked: true, id}`. A second ack returns `{acked: true, id, already: true}`.',
        'The ack decides what pruning may remove. When the ledger grows past `ledger_cap`, the kernel prunes the oldest settled executions from the store, unnamed ones first. A dead letter that nobody acknowledged stays, because it waits for a person. An acknowledged one may go.',
        { video: 'deadletter' },
      ],
    },
    {
      id: 'stop',
      title: 'Graceful stop and crash',
      blocks: [
        'On a graceful stop (`kernel_stop`), the kernel first drains: it refuses new root calls and tells every agent that advertises `shutdown`. It waits up to 10 seconds for in-flight calls and cancels those that remain. It then waits up to 2 seconds for each cancelled call to record its ending.',
        'Only after that does the final flush run, while the store is still alive. Every call that the drain cancelled lands as a `cancelled` settle row, so it is a dead letter that the ledger lists. Rust and Python do the same.',
        { video: 'stop' },
        'A crash gives the kernel none of this. No drain runs and no final flush runs. Rows that are still in RAM never reach the store. A call that was in flight has no settle row, so it is not a dead letter. The kernel rebuilds nothing for it: re-sending its name runs it again.',
        'The kernel does reserve ids ahead of use, in blocks written to the root record, so a restart after a crash skips ids and does not reuse them.',
        { note: 'Not built: replaying an interrupted turn to where it stopped. After a graceful stop the interrupted call is a dead letter; after a crash it leaves no record of the interruption.' },
      ],
    },
  ],
  sources: [
    ['executions.rs: flush, prune, recall, on_deadletter', src(`${KERNEL}/executions.rs`, 342)],
    ['ledger.rs: named calls, dead statuses, what a settle keeps', src(`${KERNEL}/ledger.rs`, 515)],
    ['kernel_verbs.rs: ledger and ack_deadletter', src(`${KERNEL}/send/kernel_verbs.rs`, 466)],
    ['kernel.rs: the graceful stop', src(`${KERNEL}/kernel.rs`, 488)],
    ['the Python kernel: _kernel.py', src('src/lib/python/kernel/_kernel.py', 263)],
    ['persistence.md: the memory store and the ledger', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/persistence.md', 65)],
  ],
  clips: {
    ledger: {
      title: 'Every call is an execution',
      caption: 'A named call (ingest-42) writes a call row and a settle row in RAM, which flush into the memory store. A call that settles failed (fetch-7) is a dead letter, and its caller gets an on_deadletter event. After a restart RAM is empty, and re-sending ingest-42 returns the recorded outcome without running the handler. ack_deadletter retires fetch-7.',
    },
    deadletter: {
      title: 'Dead letters',
      caption: 'Five illustrative executions end in five statuses. 61 completed and 62 errored are not dead letters. 63 failed, 64 timed_out and 65 cancelled are, and the caller lead receives on_deadletter. Pruning removes the oldest settled executions, 61 and 62, but keeps the unacknowledged dead letters. ack_deadletter marks 63 as acked, so it may be pruned later.',
    },
    stop: {
      title: 'Graceful stop and crash',
      caption: 'Top: kernel_stop cancels call 71, the settle row is flushed, and 71 is a dead letter. Bottom: the process is killed while call 72 is in flight. 72 has no settle row, so it is not a dead letter, and re-sending it runs it again.',
    },
  },
}
