// SEED — Bundles and twin runtimes. Status: planned (see registry.json); this page is not published.
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
      id: 'bundles',
      title: 'Bundles',
      blocks: [
        'A bundle is the code. In Python it is anything with a `handler(id, payload, agent)` callable, found through entry points. In Rust it is a crate implementing the `Bundle` trait, linked into the binary at compile time. That is the one real difference between the two runtimes: how bundles load. On top of either, a **folder bundle** (a `bundle.yaml` plus a program dropped into `.fantastic/bundles/<name>/`) becomes a new kind of agent, hot-reloadable.',
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
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
}
