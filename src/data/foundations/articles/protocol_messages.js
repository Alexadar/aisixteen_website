// Protocol › Messages and verbs. Facts: coder/tmp/foundations/facts/messages.md (fantastic main b175660c).
import { src } from '../lib.js'

export default {
  headline: 'Messages and verbs: one send, five statuses',
  description: 'How every call in Aisixteen Fantastic is one batch send of {target, payload} items, how each item settles into one of five statuses, and how reflect and docs describe verbs.',
  summary: 'One batch send, `{target, payload}` items, five statuses; `reflect` and `docs` describe the verbs.',
  cover: { clip: 'batch' },
  about: ['Aisixteen Fantastic', 'Messaging protocol'],
  lead: [
    'Everything in Aisixteen Fantastic happens by sending a message to an agent. A message names a **verb**, and the verb is the only way in: there is no client library, so the protocol is the API.',
    'This page covers the one call, `send`, the shape of the payload and of the reply, the checks and routing an item goes through, the five statuses it can end in, and the two verbs that describe the rest: `reflect` and `docs`.',
  ],
  sections: [
    {
      id: 'send',
      title: 'One call: send',
      blocks: [
        'Every interaction is one **batch** send: a list of items, each `{target, payload}`, answered in order with `{pid, status, result}`. The `target` is an agent id, or `"kernel"` for the root. The `payload` is an object whose `type` is the **verb**; the other fields are that verb’s arguments.',
        { code: '[{"target": "kernel", "payload": {"type": "list_agents"}},\n {"target": "kernel", "payload": {"type": "ps"}}]', label: 'two calls, one send' },
        'There is deliberately no single-call form. One shape prevents drift between the single and the batch case, and a single call is a batch of one. The code also gives the reason: a model reply that fans out N calls would otherwise get its answers spread over the next N replies.',
        'The kernel first checks and registers every item. It then runs them concurrently, and the reply array keeps the input order. Both the Rust and the Python kernel work this way.',
        { video: 'batch' },
        'Each registered item is a task with its own integer `pid`. The kernel mints every pid before it awaits anything, so the whole batch shows in `ps` at once and each item can be cancelled by its pid. An item that never reaches the task table, such as a refused one, has `pid: null`.',
        { h3: 'What an item may carry' },
        'Besides `target` and `payload`, an item may carry an `id` that names the execution, a `timeout` in seconds and a `retries` budget. The kernel never defaults the timeout: absent means wait forever. When a timeout expires, the kernel kills the item through the same path as `cancel`, so the target’s cleanup hook runs. The ledger page covers `id` and `retries`.',
      ],
    },
    {
      id: 'checks',
      title: 'What happens to an item',
      blocks: [
        'Before any handler runs, the kernel checks each item in a fixed order: the target is a non-empty string, the payload is an object, then `timeout`, `payload.type`, `id` and `retries`. A missing `target`, `payload` or `payload.type` is refused as `missing_arg`; a `type` that is not a non-empty string is refused as `bad_arg`.',
        'The kernel then resolves the target. `"kernel"` names the root, any other string is an agent id, and `<guid>|<agent id>` names an agent on a connected kernel. An id that names no agent is refused as `unknown_agent`, and the refusal lists the live ids.',
        'Next comes the call gate, which judges every send an agent makes, whatever the verb, `reflect` included. A send from outside any agent, such as the command line, is ungated. The call gate page covers the rule.',
        { h3: 'Where a verb is answered' },
        'The kernel answers its own verbs on the root alone: `create_agent`, `update_agent`, `delete_agent`, `list_agents`, `ps`, `cancel`, `ledger`, `ack_deadletter`, `kernel_start`, `shutdown_agents`, `kernel_stop`, `await_set`, `await_cancel` and `docs`. The agent you name in their arguments is the thing acted on, not the actor. Once the call gate has passed, sending one of them to any other agent is refused as `not_here`, with a hint to address `kernel`.',
        'Every other verb goes to the **bundle**, the handler module that the target’s record names. A bare agent with no handler module answers only `boot`, `shutdown` and `reflect`, and refuses the rest as `unhandled`.',
      ],
    },
    {
      id: 'statuses',
      title: 'Five statuses',
      blocks: [
        'The code calls the status strings the contract. Every item settles in exactly one of them:',
        { table: { head: ['status', 'meaning'], rows: [
          ['`completed`', 'the handler ran and returned a reply; the reply is passed through verbatim'],
          ['`errored`', 'the handler ran and returned a map with a truthy `error`; the reply is kept verbatim'],
          ['`failed`', 'refused before dispatch (gate, unknown agent, malformed item), or the handler panicked or raised: `{"error": ..., "raised": true}`'],
          ['`cancelled`', 'killed by `cancel`; the result is `{"cancelled": true}`'],
          ['`timed_out`', 'the item’s own deadline expired; the result is a refusal with reason `timeout`'],
        ] } },
        { video: 'statuses' },
        'Failure is a status, so a caller reads `status` instead of parsing `result`. Truthiness follows Python: `error: 0`, `[]`, `{}` and `""` are falsy, so a reply carrying one of them settles `completed`.',
        'Nothing propagates out of `send`. A panic settles as `failed`, a cancel as `cancelled`, and the caller always gets an answer. Only `failed` and `timed_out` are ever retried, and only within the `retries` the caller declared. `cancelled` is never retried; in the code’s words, “an operator kill is an absorbing decision, not a transient.”',
        { note: 'The Python kernel replies with `{pid, status, result}` and adds `attempts` after a retry and `name` for a named item. The Rust kernel always includes `attempts` as well.' },
      ],
    },
    {
      id: 'reflect',
      title: 'The protocol is the API',
      blocks: [
        'There is no client library. Two verbs describe the rest. `reflect` says what an agent **is**. `docs` says how to **call** it.',
        'Every agent answers `{"type": "reflect"}` with its identity: `id`, `sentence`, `display_name`, `parent_id`, `handler_module`, an optional `description`, and the rest of its record. A reflect also carries the agent’s own `can_call` and `callable_by`, so an agent can read what it may call without trial and error. The root’s reflect adds `runtime`, `env`, `version` and `peers`.',
        { code: '[{"target": "kernel", "payload": {"type": "reflect", "readme": true}}]', label: 'the README’s first example' },
        'Three flags shape the reply. `tree` is `all` (the default) or `ids`; any other value leaves the tree out. `bundles` is `all` or `ids` and lists every kind of agent you can create. `readme` is `true` for the short orientation, `"index"` for the topic map, or a topic key for one topic. A reflect of the root with `readme: true` returns the live tree and the root’s readme.',
        { h3: 'docs: how to call it' },
        '`docs` is a kernel verb, so the root answers it. Its argument `of` names an agent, a bundle or `kernel`. The default `tier` is `oneliners`: one signature line per verb. `tier: "detailed"` returns the full text, and with no `verb` filter it adds the bundle’s emits, cancel and notes. `docs of: kernel` documents the kernel verbs themselves.',
        'Like every kernel verb, `docs` is gated: the caller needs a `docs` grant in its `can_call`, and the root needs one in its `callable_by`.',
        { video: 'reflect' },
        'A model or a person can start from one reflect, read the docs of the one kind of agent it needs, and send that agent a verb. Nothing else is needed.',
      ],
    },
  ],
  sources: [
    ['README.md: the idea in one call', src('README.md', 27)],
    ['Rust send: the batch, the checks and the dispatch', src('src/lib/rust/crates/fantastic-kernel/src/send.rs', 462)],
    ['Rust outcome: the statuses and the item', src('src/lib/rust/crates/fantastic-kernel/src/outcome.rs', 55)],
    ['Python send and its outcome vocabulary', src('src/lib/python/kernel/_agent.py', 667)],
    ['Rust kernel verbs and their docs', src('src/lib/rust/crates/fantastic-kernel/src/send/kernel_verbs.rs', 14)],
    ['Rust reflect', src('src/lib/rust/crates/fantastic-kernel/src/reflect.rs', 175)],
    ['Rust docs verb', src('src/lib/rust/crates/fantastic-kernel/src/docs.rs', 1)],
    ['the reflect surface (reflect.md)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/reflect.md')],
  ],
  clips: {
    batch: {
      title: 'One send, a batch of calls',
      caption: 'A model turn sends three items in one batch. The kernel registers all three as tasks in ps before any reply; they run concurrently and finish in any order, and the reply array keeps the input order: one {pid, status, result} per item.',
    },
    statuses: {
      title: 'Five statuses',
      caption: 'One send of five illustrative items. The first completes with the handler’s reply. The second errored: the handler returned a map with an error. The third failed with pid null because it names no agent. The fourth was cancelled, and the fifth timed out. Each row shows its pid, status and result; the pids and results are illustrative.',
    },
    reflect: {
      title: 'reflect, docs, then the verb',
      caption: 'A reflect of agent notes returns what it is: identity, its can_call and callable_by, and optional tree, bundles and readme. A docs sent to the kernel with of notes returns how to call it: one signature per verb, with a detailed tier. The caller then sends the verb itself.',
    },
  },
}
