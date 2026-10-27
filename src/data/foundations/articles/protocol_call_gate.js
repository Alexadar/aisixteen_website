import { src, tree } from '../lib.js'

export default {
  headline: 'Call gate and grants: both ends must agree',
  description: 'How the Aisixteen Fantastic call gate works: can_call on the caller and callable_by on the target must both grant the verb, with $self as the only baseline.',
  summary: '`can_call` on the caller and `callable_by` on the target must both grant the verb. Spawn hands out only what the spawner holds.',
  cover: { clip: 'gate' },
  about: ['Aisixteen Fantastic', 'Access control', 'Call gate'],
  lead: [
    'Every send an agent makes passes one check before it runs. The caller must be allowed to call the target, and the target must be willing to be called by the caller. If either side does not grant it, the send is refused.',
    'This page covers the two grant fields, the keys and tokens they use, the one baseline every agent starts with, grants per verb, and how a spawn hands out grants. The Rust and Python runtimes implement the same rules.',
  ],
  sections: [
    {
      id: 'rule',
      title: 'One rule, two halves',
      blocks: [
        'Each agent has two **grant maps** in its record. `can_call` says who the agent may call. `callable_by` says who may call the agent. A send from agent `a` to agent `b` for a verb passes only if both maps agree.',
        { list: [
          '**Egress:** the sender’s `can_call` must grant the target and the verb.',
          '**Ingress:** the target’s `callable_by` must grant the sender and the verb.',
        ] },
        'An edge exists only if both ends grant it. The gate checks egress first, then ingress. It never looks at what the verb is: `reflect` and the kernel verbs that the root answers take the same check as any other verb.',
        { code: 'a.can_call     {"$self": "*", "b": ["reflect"]}\nb.callable_by  {"$self": "*", "a": ["reflect"]}', label: 'a may send reflect to b, one way (illustrative ids)' },
        'The edge is one-way. These two lines let `a` call `b`, and nothing lets `b` call `a`. For that, `b` needs its own `can_call` and `a` its own `callable_by`.',
        { video: 'gate' },
        'The gate judges agent sends. A send made outside every dispatch, such as the CLI, the cold bootstrap, a test driver or a transport handing in an inbound frame, is an **operator send** and skips the gate. A wire leg that receives a frame then sends the item onward as itself, so the gate judges the leg ([Transports](/fantastic/foundations/protocol/transports/)). The kernel’s own bookkeeping does too. Identity comes only from dispatch: a send made inside an agent’s handler, or in a task that handler spawned, is that agent’s.',
      ],
    },
    {
      id: 'maps',
      title: 'What a grant map holds',
      blocks: [
        'A grant map has keys and values. The value is `"*"` for every verb, or a list of verbs. A list may itself contain `"*"`. A key names the other end of the edge:',
        { table: {
          head: ['key', 'matches'],
          rows: [
            ['an agent id', 'that one local agent'],
            ['`$self`', 'the holder of the grant itself'],
            ['`$parent`', 'the holder’s parent'],
            ['`$subtree`', 'every agent below the holder, at any depth'],
            ['`<guid>|<agent>`, `<guid>|*`', 'one agent, or every agent, of a connected kernel; `can_call` only'],
          ],
        } },
        'The tokens resolve relative to the holder of the grant: the sender for `can_call`, the target for `callable_by`. A `<guid>|…` key has no meaning in `callable_by`, because a caller is always a local agent, so the kernel refuses to write one there.',
        'An absent or empty grant denies. So does an agent the kernel has no record of. The only baseline merged into every agent, on both fields, is `{"$self": "*"}`. It lets an agent call itself, and nothing else. Every other edge is an explicit grant, and an explicit key in a record is merged over the baseline.',
        { note: 'For a target on a connected kernel, only egress is checked here: the sender’s `can_call` must name `<guid>|<agent>` or `<guid>|*`. The other kernel decides ingress with its own `callable_by`.' },
      ],
    },
    {
      id: 'verbs',
      title: 'Grants are per verb',
      blocks: [
        'A key grants the verbs in its list and no others. With `["reflect"]` on both ends, `a` can send `reflect` to `b` and cannot send `ps`. The grant `"*"` covers every verb.',
        'Each end keeps its own list. If `a` holds `"*"` on `b` but `b` lists only `reflect`, a `ps` from `a` passes egress and is refused at ingress.',
        { video: 'verbs' },
        { code: '{"error": "a may not call \'ps\' on b", "reason": "unauthorized", "side": "egress", "hint": "…"}\n{"error": "b does not accept \'ps\' from a", "reason": "unauthorized", "side": "ingress", "hint": "…"}', label: 'the two refusals (hint shortened)' },
        'The refusal names the failing half in `side`. A send with neither half granted reports `egress`, because egress is checked first. [Refusals](/fantastic/foundations/protocol/refusals/) covers the shape every refusal shares.',
      ],
    },
    {
      id: 'writing',
      title: 'Where grants come from',
      blocks: [
        'The refusal’s hint says it: “grants come from above — an ancestor (update_agent on an agent in its subtree) or the operator writes can_call and callable_by; an agent never raises its own.” The tree verbs `create_agent`, `update_agent` and `delete_agent` ([Lifecycle](/fantastic/foundations/kernel/lifecycle/)) take the same gate against the root, so whoever holds the verb on the root can write grants for the agents it names.',
        'The kernel checks a grant map when it is written. A map that is not an object, a key that is not legal for that field, or a value that is neither `"*"` nor a list of strings is refused with `invalid_meta`. A grant that can never match is not stored.',
        'When an agent is deleted, its id is removed from every grant that named it. A new agent that reuses the id does not inherit an old edge.',
      ],
    },
    {
      id: 'spawn',
      title: 'Grants on spawn',
      blocks: [
        'The `spawn` verb of the `agentic_resources` bundle creates a worker from a **card**. The card’s `grants` on tools are written on both ends of each edge: into the worker’s `can_call` and into the tool’s `callable_by`. The worker can call its tools without further setup.',
        'A spawn cannot hand out more than the spawner holds. Before anything is created, `spawn` checks every verb the card lists on a tool against the spawner’s own `can_call`, with the same matching the gate uses. The grant `"*"` needs the spawner to hold `"*"`. If a verb is missing, the spawn is refused with `not_allowed`, and nothing is created. An operator spawn has no spawner, so there is nothing to check. Plain `create_agent` makes no such check; [Security](/fantastic/foundations/protocol/security/) explains what that means.',
        { video: 'spawn' },
        { code: 'spawn: lead may not grant \'write\' on \'files\' (role \'…\')', label: 'the not_allowed reason (role elided)' },
        'The spawn is all or nothing. A tool id that is not an agent is skipped. If a write to a tool’s `callable_by` is refused, the edits already made are taken back, the half-made worker is removed, and the reply is `grant_failed`. Only literal agent ids in the card are applied as tool grants; `$` tokens and `<guid>|` keys are not.',
      ],
    },
  ],
  sources: [
    ['authz.rs: the grant keys, baseline and matching (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/authz.rs', 1)],
    ['gate.rs: egress then ingress (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/send/gate.rs', 82)],
    ['_authz.py: the same rules in Python', src('src/lib/python/kernel/_authz.py', 1)],
    ['_agent.py: the Python gate', src('src/lib/python/kernel/_agent.py', 1477)],
    ['lifecycle.rs: grant shape checked at write', src('src/lib/rust/crates/fantastic-kernel/src/lifecycle.rs', 84)],
    ['agentic_resources: spawn grants (Rust)', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/lib.rs', 716)],
    ['agentic_resources readme: tool grants', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/readme.md', 10)],
    ['the call-gate e2e probe (E114)', tree('e2e/tests/kernel/E114_call_gate')],
  ],
  clips: {
    gate: {
      title: 'The call gate: both ends must grant',
      caption: 'Agent a sends reflect to b. The send is refused at egress until a’s can_call names b, then at ingress until b’s callable_by names a. With both grants it passes, one way, for that verb only. Operator sends skip the gate.',
    },
    verbs: {
      title: 'Grants are per verb, on both ends',
      caption: 'a and b both list only reflect: a reflect passes, a ps is refused at egress. a’s can_call is widened to "*", and ps now passes egress but is refused at ingress. Once b’s callable_by also holds "*", ps passes.',
    },
    spawn: {
      title: 'Spawn grants stay within the spawner',
      caption: 'lead holds only read on files. A card that grants read and write is refused with not_allowed and creates nothing. A card that grants read creates worker as lead’s child, and writes worker’s can_call and files’ callable_by.',
    },
  },
}
