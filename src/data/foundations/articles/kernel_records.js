// SEED — Agents as records. Status: planned (see registry.json); this page is not published.
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
      id: 'agents',
      title: 'Everything is an agent',
      blocks: [
        { quote: 'A model, a program, a file tree, a shell, a browser canvas and the human at the keyboard are all agents in one tree, addressed by id and reached the same way: one call, `send`.', cite: 'README' },
        'An agent is two things: a **record** and the **bundle** that answers its verbs. The record is small. It has an `id` that is unique across the tree, a `handler_module` naming the bundle, a `parent_id`, and every other field flat at the top level. Those other fields are how a bundle is configured.',
        { code: 'id              file_bridge_ab12cd   minted as <bundle>_<hex6> when you leave it out\nhandler_module  file_bridge.tools    the bundle; fixed once the agent exists\nparent_id       kernel_state         where it sits in the tree\n...             ...                  every other field: the bundle’s own config', label: 'an agent record' },
        'A handler that returns nothing sends no reply; a domain error comes back as `{"error": ...}`. A bundle can also run code when its agent is deleted (`on_delete`), stopped (`on_shutdown`) or has a task cancelled (`on_cancel`). It can refuse a bad record with `validate_meta` and publish a `record_schema`, the same schema `create_agent` and `update_agent` enforce.',
      ],
    },
    {
      id: 'tree',
      title: 'One tree',
      blocks: [
        'Every agent has exactly one parent. The root’s id is `kernel_state`, and the reserved address `kernel` reaches it too. Children keep their creation order. On disk each agent is an `agent.yaml` in its own folder, with its children in folders below it (under `agents/` by default), all inside `.fantastic/`. One kernel runs per folder: a second `fantastic` started there attaches to the running one.',
        'The tree does not route messages. The kernel keeps one flat map of agents and looks the target id up directly. The tree is about **ownership**: what a delete takes with it, what the `$parent` and `$subtree` grants mean, how records lie on disk, and what `reflect` shows.',
      ],
    },
  ],
  sources: [
    ['README.md', src('README.md')],
    ['agents.md and reflect.md', src('src/lib/rust/crates/bundles/fantastic-core/src/docs')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
}
