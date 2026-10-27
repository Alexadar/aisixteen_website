// Kernel › Agents as records. Facts: coder/tmp/foundations/facts/kernel_records.md (fantastic main b175660c).
import { src, tree } from '../lib.js'

export default {
  headline: 'Agents as records: one tree, one reflect',
  description: 'How Aisixteen Fantastic stores every agent as a record in one tree, and how the reflect verb shows that tree: ids, pruned subtrees and the bundle list.',
  summary: 'An agent is a record with an id, a parent and a handler module; the records form one tree that reflect reads.',
  cover: { clip: 'record' },
  about: ['Aisixteen Fantastic', 'Agent kernel', 'Data model'],
  lead: [
    'In Fantastic a model, a program, a shell and the human at the keyboard are all agents in one tree, reached the same way. The kernel knows an agent by one small thing: its record.',
    'This page shows what a record holds, how the records form one tree, and how the `reflect` verb reads that tree back without flooding a caller with text.',
  ],
  sections: [
    {
      id: 'record',
      title: 'The record',
      blocks: [
        'An agent is a **record** plus the **bundle** that answers its verbs. The record has an `id`, unique across the whole tree, and a `handler_module` that names the bundle. Every other field sits flat at the top level of the record. A `parent_id` says who owns the agent; the root has none.',
        'Those flat fields are how a bundle is configured: a `display_name`, a `description`, a port, a root folder. The kernel does not nest them under a `meta` key. In the Rust kernel the record is a struct with `id`, `handler_module`, `parent_id` and a map for everything else.',
        { code: 'id              file_bridge_3f9a1c\nhandler_module  file_bridge.tools\ndisplay_name    files\ncan_call        {"$self": "*"}\ncallable_by     {"$self": "*"}\nparent_id       kernel_state', label: 'a record (illustrative id)' },
        'The key order is part of the record. Both runtimes write `id`, `handler_module`, the other fields and then `parent_id`. The parent comes last because the tree decides where an agent sits: a `parent_id` that leaked into the flat fields must not shadow it.',
        { video: 'record' },
      ],
    },
    {
      id: 'creating',
      title: 'Where a record comes from',
      blocks: [
        'The kernel verb `create_agent` makes a record. It requires a `handler_module` and a `parent_id`. Placement is stated, never inferred from who sent the call: `parent_id` names the owner, which can be the caller’s own id or `kernel_state` for a top-level agent. The reserved address `kernel` stands for the root here too.',
        { code: '[{"target": "kernel", "payload": {"type": "create_agent",\n  "handler_module": "file_bridge.tools",\n  "parent_id": "kernel_state", "display_name": "files"}}]', label: 'create_agent (illustrative values)' },
        'Every field in the payload except `type`, `id`, `handler_module` and `parent_id` becomes a flat field of the record. If the payload has no `id`, the kernel mints one as `<bundle>_<hex6>`: the second-last dotted segment of the handler module, then six random hex digits. `file_bridge.tools` gives `file_bridge_3f9a1c`. An id that is already taken is refused with `exists`. An id becomes a folder name, so it must be one safe path segment.',
        'A write is judged before it lands. The names `root_path`, `ctx` and `parent` are reserved for the kernel’s own wiring, and a record may not carry them. The shape of `can_call` and `callable_by` is checked, and the bundle may add its own `validate_meta` check. A refused write comes back as a refusal in the [common shape](/fantastic/foundations/protocol/refusals/), with a `reason` such as `bad_arg` or `invalid_meta`.',
        'The `handler_module` is fixed once the agent exists: `update_agent` refuses it. Two fields are stamped on every record when the kernel builds the agent: `can_call` and `callable_by`, each starting as `{"$self": "*"}`, merged under any grant the record already carries. They are the two halves of the [call gate](/fantastic/foundations/protocol/call-gate/).',
        { note: 'Comments in the Rust and Python kernels still describe the starting grants as `$self`, `$parent` and `$subtree`. The constants in both runtimes hold `{"$self": "*"}` only, and this page follows the constants.' },
      ],
    },
    {
      id: 'tree',
      title: 'One tree',
      blocks: [
        'Every agent has exactly one parent. The root has the id `kernel_state` and no parent, and every other agent sits below it. An agent’s children keep their creation order.',
        'The tree does not carry messages. The kernel keeps one flat map from id to agent, which the Rust kernel calls its only routing table. A send looks its target id up in that map and does not walk from parent to child.',
        'The tree answers a different question: who owns what. It decides what `delete_agent` takes with it, because a delete cascades depth first through the subtree. It decides what the `$parent` and `$subtree` keys of a grant mean, because `$subtree` is every agent below the holder. And it decides what `reflect` shows. The root cannot be deleted.',
        { video: 'tree' },
        'On disk the tree mirrors the ownership. Each agent is an `agent.yaml` in its own folder, and its children are folders below it, in a container named by the root record’s `children_dir` field, `agents` by default, the same for every agent in the tree. The kernel the `fantastic` command starts keeps all of this in `.fantastic/` of the folder it runs in. The root loader writes the records, not `create_agent` itself, so a kernel with no loader keeps its records in memory only.',
      ],
    },
    {
      id: 'reflect',
      title: 'reflect: the tree on demand',
      blocks: [
        '`reflect` is the discovery verb, and every agent answers it with the same core fields. The reply says what the agent is, not how to call it: its `id`, a one-line `sentence`, `parent_id`, `handler_module`, `display_name`, a `description` if the record has one, then the flat fields of the record. It also repeats the agent’s `can_call` and `callable_by`, so an agent can read its own reach without trying calls. Like any send, a reflect passes the [call gate](/fantastic/foundations/protocol/call-gate/) first.',
        'On the root, `reflect` adds the fields that belong to the whole kernel: `runtime` (`rust` in the Rust kernel), `peers` (the kernels this one is connected to), `env` and `version`. The root’s loader adds more, such as the kernel’s `guid`.',
        { h3: 'The tree flag' },
        'By default a reflect carries the agent’s whole subtree under `tree`. That is fine for a first look and too much afterwards, so three flags shape it.',
        { table: { head: ['flag', 'what the reply holds'], rows: [
          ['`tree=all` (the default)', 'the nested subtree. Each node is `{id, sentence?, description?, mode?, task?, children}`, and a node’s `sentence` comes from the agent itself'],
          ['`tree=ids`', 'a flat list of every id below, depth first, the agent first. It pages with `limit` and `after`, and `next` is the cursor'],
          ['`detail=full`', 'with `tree=all`, a wiring node instead: `{id, parent_id, handler_module, display_name, description?, children}` plus the posture fields `ingress_rule`, `egress_rule`, `auth`, `root`, `allow`, `can_call` and `callable_by` where the record has them'],
          ['`ignore_subtrees=[ids]`', 'each named branch becomes `{id, pruned: n}`, where n counts the agents the branch holds, itself included'],
          ['`show_subtrees=[ids]`', 'only those branches, as a list. An id inside another shown id is covered by it. Show applies first, then ignore inside it'],
        ] } },
        'A `tree` value other than `all` or `ids` leaves the tree out. The built-in manual writes that as `tree=none`. An id in `show_subtrees` or `ignore_subtrees` that is not in the reflected agent’s tree is refused with `bad_arg`, and the hint says that `tree=ids` lists the ids.',
        { code: '[{"target": "kernel", "payload": {"type": "reflect",\n  "tree": "all", "ignore_subtrees": ["team"]}}]', label: 'reflect with a pruned branch (illustrative id)' },
        { video: 'reflect' },
        { h3: 'The bundles flag' },
        'The kinds of agent that can be created are bundles, and `reflect` lists them on request. `bundles=ids` gives the names. `bundles=all` gives each one as `{name, handler_module}`, plus a `schema` when the bundle publishes one, so the fields a record of that kind takes can be read before any agent of it exists. The list also holds the folder bundles of this kernel’s root, and it pages with `limit` and `after`, with `bundles_next` as the cursor.',
        'A scan that stays cheap is `tree=ids` with `bundles=ids`. A caller then reflects one id at a time, or uses `show_subtrees` and `ignore_subtrees` once it knows which part of the tree it works on. A reflect that is refused is never decorated with a tree.',
      ],
    },
  ],
  sources: [
    ['README.md: everything is an agent', src('README.md', 16)],
    ['the record and the agent (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/agent.rs', 52)],
    ['create_agent and id minting (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/lifecycle.rs', 51)],
    ['the record in Python', src('src/lib/python/kernel/_agent.py', 632)],
    ['reflect flags (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/reflect.rs', 300)],
    ['show_subtrees and ignore_subtrees', src('src/lib/rust/crates/fantastic-kernel/src/docs.rs', 271)],
    ['the built-in reflect manual', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/reflect.md')],
    ['the Rust kernel crate', tree('src/lib/rust/crates/fantastic-kernel/src')],
  ],
  clips: {
    record: {
      title: 'An agent is a record',
      caption: 'create_agent names the bundle file_bridge.tools and the owner kernel_state, and sends no id. The kernel mints file_bridge_3f9a1c, copies display_name from the payload, stamps can_call and callable_by, and writes parent_id last.',
    },
    tree: {
      title: 'One tree, one flat map',
      caption: 'Five agents sit in one tree under kernel_state. The kernel also keeps a flat map from id to agent. A send from writer to files is resolved in that map, not by walking the tree. The tree shows ownership: team’s subtree is team, writer and reviewer.',
    },
    reflect: {
      title: 'reflect: look without flooding',
      caption: 'tree=ids returns every id below, depth first. ignore_subtrees=["team"] folds that branch to {id: "team", pruned: 3}. bundles=ids lists the kinds of agent that can be created. show_subtrees=["team"] answers with only the team branch.',
    },
  },
}
