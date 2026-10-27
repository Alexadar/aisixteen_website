// SEED — The idea. Status: planned (see registry.json); this page is not published.
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
        { quote: 'A shared system where human operators, statistical models, and programs are decentralized and flat, with a mediator that handles the communication exchange.', cite: 'THESIS.md' },
        'Fantastic starts from one sentence, its whole THESIS: “A shared system where human operators, statistical models, and programs are decentralized and flat, with a mediator that handles the communication exchange.” The kernel is that mediator.',
        { quote: 'A model, a program, a file tree, a shell, a browser canvas and the human at the keyboard are all agents in one tree, addressed by id and reached the same way: one call, `send`.', cite: 'README' },
      ],
    },
  ],
  sources: [
    ['THESIS.md', src('THESIS.md')],
    ['README.md', src('README.md')],
  ],
}
