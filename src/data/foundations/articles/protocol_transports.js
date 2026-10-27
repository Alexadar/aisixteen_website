// SEED — Transports. Status: planned (see registry.json); this page is not published.
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
      id: 'seed',
      title: 'From the draft',
      blocks: [
        'The reserved target `kernel` names the root, and `<guid>|<agent id>` addresses an agent on a connected kernel.',
      ],
    },
  ],
  sources: [
    ['README.md', src('README.md')],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
  ],
}
