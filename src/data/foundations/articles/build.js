// 5. Build your own — pillar page. Published. Overview + one clip (its own:
// anim/foundations/build.py) + the list of its articles, which the page adds from registry.json.
import { src } from '../lib.js'

export default {
  headline: 'Build your own agents on Aisixteen Fantastic',
  description: 'How to extend Aisixteen Fantastic: a bundle is code, an agent is a record that names it. Drop a folder bundle into .fantastic/bundles/ and it becomes a new kind of agent; edit it and every instance changes at once.',
  summary: 'A bundle is code, an agent is an instance of it: folder bundles, program agents, views, and a product built on fantastic.',
  cover: { clip: 'bundle' },
  about: ['Aisixteen Fantastic', 'Agent development', 'Plugins'],
  lead: [
    'Fantastic grows by new kinds of agents. The rule to keep in mind is the one the bundles doc opens with: a **bundle** is code, an **agent** is an instance of it.',
  ],
  sections: [
    {
      id: 'overview',
      title: 'A bundle and its agents',
      blocks: [
        { table: { head: ['', 'a bundle', 'an agent'], rows: [
          ['what', 'code: `bundle.yaml` (its verbs), `agent.py`, `panel.html` (its view)', 'a record that names the bundle'],
          ['where', '`.fantastic/bundles/<name>/`', '`.fantastic/agents/…/<id>/agent.yaml`'],
          ['one of', 'per project', 'many per bundle'],
        ] } },
        'A new verb is a function passed to `fa.serve` and a line in `bundle.yaml` `verbs`; the two must match, or the kernel refuses the agent. Saving `agent.py` restarts every instance; editing `panel.html` re-renders every instance’s cell.',
        { video: 'bundle' },
        'Folder bundles are one way in. Below them, a Rust bundle is a crate implementing the kernel’s `Bundle` trait, linked into the binary at build time, and the Python kernel finds its bundles through entry points.',
      ],
    },
  ],
  sources: [
    ['README.md: folder bundles', src('README.md', 60)],
    ['bundles.md', src('src/tui/docs/bundles.md', 3)],
    ['the python agent starter', src('src/tui/starters/python_agent/agent.py', 1)],
    ['bundle.rs: the Bundle trait', src('src/lib/rust/crates/fantastic-kernel/src/bundle.rs', 50)],
  ],
  clips: {
    bundle: {
      title: 'One bundle, many agents',
      caption: 'A folder bundle holds bundle.yaml, agent.py and panel.html. Two agents are instances of it, each a record that names the bundle. Saving agent.py restarts both at once; each agent keeps its own record.',
    },
  },
}
