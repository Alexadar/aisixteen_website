// SEED — State and durability. Status: planned (see registry.json); this page is not published.
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
  sections: [
    {
      id: 'counter',
      title: 'One counter names everything',
      blocks: [
        'A call, a task, a settle row, a wait and a conversation row all take their id from one allocator, “so one number names one thing everywhere (`ps`, `cancel`, a reply tag, a store row).” It is a 64-bit counter starting at 1, reserved in blocks of 1000 and persisted as `next_id` in the root record, so a crash can skip ids but never reuse them. A string from outside is always a name; it never becomes a pid.',
      ],
    },
    {
      id: 'restart',
      title: 'What survives a restart',
      blocks: [
        { list: [
          'The agent tree, from the `agent.yaml` files under `.fantastic/`; schedules and conversations too.',
          'The kernel’s `guid` and its id counter.',
          'Settled named executions and their recorded outcomes, dead letters and acks, and open `await_set` waits — when the kernel’s memory store is persistent. `sqlite_store` keeps “its ledger, dead letters, named-call dedup and every AI agent’s memory”; with `ram_store` those rows end with the process.',
        ] },
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
}
