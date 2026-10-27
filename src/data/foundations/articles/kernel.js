// 2. Kernel — pillar page. Published. Overview + one clip (reused from Messages and verbs)
// + the list of its articles, which the page adds from registry.json.
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
        'Every agent is a **record** in one tree: an `id`, a `handler_module` that names its **bundle** (the code that answers its verbs) and a `parent_id`. The tree says who owns whom; a send finds its target in one flat map from id to agent. [Agents as records](/fantastic/foundations/kernel/records/) covers the record, the tree and `reflect`.',
        'A set of fourteen verbs belongs to the kernel itself and only the root answers them, such as `create_agent`, `update_agent`, `delete_agent`, `ps` and `cancel`. The agent you name is the operand, not the actor: sending one of these verbs to any other agent gets a `not_here` refusal that names the fix. [Lifecycle](/fantastic/foundations/kernel/lifecycle/) follows an agent from `create_agent` to `delete_agent`, and the kernel from `kernel_start` to `kernel_stop`.',
        'Every item of a send that reaches its target runs as a kernel task. The task table works like Unix: `ps` lists what is in flight, `cancel` stops a task and its subtree, and `await_set` wakes a lead once for a set of reports ([Tasks and waiting](/fantastic/foundations/kernel/tasks/)).',
        { video: 'batch', from: 'protocol_messages' },
        'There are two host kernels, Rust and Python, and they answer the same verbs. The Rust kernel’s files describe themselves as rule-for-rule ports of the Python kernel, “which is canonical.” The main difference is how bundles load: Rust crates implement a `Bundle` trait, Python finds handler modules through entry points, and both load folder bundles ([Bundles and twin runtimes](/fantastic/foundations/kernel/bundles/)).',
        'What survives a restart depends on two agents you wire: a `file_bridge` rooted at `.fantastic` keeps the tree on disk, and a durable memory store keeps the kernel’s execution rows. One counter names every call, task and row ([State and durability](/fantastic/foundations/kernel/state/)).',
      ],
    },
  ],
  sources: [
    ['THESIS.md', src('THESIS.md', 5)],
    ['README.md: agents and send', src('README.md', 42)],
    ['README.md: kernel services', src('README.md', 63)],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md', 5)],
    ['rows.rs: a port of the Python kernel', src('src/lib/rust/crates/fantastic-kernel/src/rows.rs', 4)],
    ['persistence.rs: the tree on disk, through a file_bridge', src('src/lib/rust/crates/fantastic-kernel/src/persistence.rs', 163)],
    ['bundle.rs: the Bundle trait', src('src/lib/rust/crates/fantastic-kernel/src/bundle.rs', 50)],
    ['_bundles.py: entry points', src('src/lib/python/kernel/_bundles.py', 1)],
  ],
}
