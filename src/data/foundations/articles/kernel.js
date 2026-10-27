// 2. Kernel — pillar page. Published. Overview + one clip (reused from Messages and verbs)
// + the list of its articles, which the page adds from registry.json.
// The kernel material of the first draft lives in the planned articles kernel_*.js (seed).
import { src } from '../lib.js'

export default {
  headline: 'The kernel: the runtime that holds agents and routes messages',
  description: 'The Aisixteen Fantastic kernel holds every agent as a record in one tree, answers the verbs that create, update and delete them, and runs every send as a task you can list and cancel. Rust and Python kernels answer the same verbs.',
  summary: 'The runtime that holds agents and routes messages: records in one tree, their lifecycle, bundles in Rust and Python, tasks and waiting, and what survives a restart.',
  cover: { clip: 'batch', from: 'protocol_messages' },
  about: ['Aisixteen Fantastic', 'Agent kernel', 'Task scheduling', 'Runtime'],
  lead: [
    'The thesis names a “mediator that handles the communication exchange.” The kernel is that mediator: it holds the agents, routes every send between them and keeps track of the work in flight.',
  ],
  sections: [
    {
      id: 'overview',
      title: 'What the kernel holds',
      blocks: [
        'Agents form a recursive tree. Each one runs a **bundle** (a handler module) and keeps its state in its own record. The tree is persisted on disk under `.fantastic/`.',
        'A set of verbs belongs to the kernel itself and only the root answers them, such as `create_agent`, `update_agent`, `delete_agent`, `ps` and `cancel`. The agent you name is the operand, not the actor: sending one of these verbs to any other agent gets a `not_here` refusal that names the fix.',
        'Every item of a send is a kernel task. The task table works like Unix: `ps` lists what is in flight and `cancel` stops it.',
        { video: 'batch', from: 'protocol_messages' },
        'There are two host kernels, Rust and Python. The Rust kernel’s files describe themselves as rule-for-rule ports of the Python kernel, “which is canonical.” The main difference is how bundles load: Rust crates implement a `Bundle` trait, Python finds handler modules through entry points.',
      ],
    },
  ],
  sources: [
    ['THESIS.md', src('THESIS.md', 5)],
    ['README.md: agents and send', src('README.md', 42)],
    ['README.md: kernel services', src('README.md', 63)],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md', 5)],
    ['rows.rs: a port of the Python kernel', src('src/lib/rust/crates/fantastic-kernel/src/rows.rs', 4)],
    ['bundle.rs: the Bundle trait', src('src/lib/rust/crates/fantastic-kernel/src/bundle.rs', 50)],
    ['_bundles.py: entry points', src('src/lib/python/kernel/_bundles.py', 1)],
  ],
}
