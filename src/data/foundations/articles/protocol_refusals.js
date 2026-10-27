import { src } from '../lib.js'

export default {
  headline: 'Refusals: one shape for every failed call',
  description: 'Every refused call in Aisixteen Fantastic answers in one shape: error, reason, hint and facts. See the common reason codes and how a caller recovers.',
  summary: 'error for a person, reason for a machine, hint for the repair: one shape, a closed set of codes.',
  cover: { clip: 'shape' },
  about: ['Aisixteen Fantastic', 'Error handling'],
  lead: [
    'A call can fail for many reasons: the id does not exist, an argument is missing, the call gate says no. In Fantastic each of these answers in the same shape, whichever verb was sent.',
    'That shape has a line for a person, a code for a machine and a hint for the repair. This page shows the shape, the common codes, and how a caller, human or model, uses them to recover.',
  ],
  sections: [
    {
      id: 'shape',
      title: 'One shape',
      blocks: [
        'A **refusal** is the reply to a call the kernel or an agent will not carry out. It is a JSON object with two fields that are always there. `error` is one line a person reads. `reason` is a code a machine branches on.',
        'A third field, `hint`, says what to do instead. It is optional but strongly encouraged in the code, and many refusals carry facts about the failure beside it, such as `arg`, `side` or `agents`.',
        { code: '{"error": "agent \'dup\' exists", "reason": "exists",\n "hint": "pick another id, or update the existing agent", "id": "dup"}', label: 'a refusal (create_agent with a taken id)' },
        { video: 'shape' },
        'Before this shape existed, refusals came in about eighteen forms (the Python source counts them). A caller had to know which verb it had called to know which shape came back, and a machine could not branch on a failure without matching the prose. The code keeps `reason` as the machine field because the call gate already used it, so nothing was renamed.',
        'The order of the keys is part of the shape: `error`, `reason`, `hint` when present, then the facts. The Python builder also accepts an optional `see`, a pointer to a doc key, between `hint` and the facts. The Rust and Python runtimes build the same shape, and tests in Rust pin the key order to Python’s.',
      ],
    },
    {
      id: 'codes',
      title: 'A closed set of codes',
      blocks: [
        'The codes are a **closed set**. A new code is a deliberate addition to one list, not a string made up at a call site: building a refusal with an unknown code raises an error in Python and panics in Rust. Each code names a kind of refusal, not a call site, so two verbs that fail for the same reason share a code.',
        { table: { head: ['`reason`', 'what it means', 'extra facts'], rows: [
          ['`unauthorized`', 'the call gate said no', '`side`'],
          ['`unknown_agent`', 'no agent has that id', '`agent_count`, `agents`'],
          ['`missing_arg`', 'a required argument is absent', '`arg`'],
          ['`bad_arg`', 'an argument is present but wrong', '`arg`'],
          ['`invalid_meta`', 'the bundle’s own `validate_meta` refused', ''],
          ['`locked`', 'the agent has `delete_lock` set', '`blocked_by`, `id`'],
          ['`not_here`', 'a kernel verb was sent to an agent other than the root', '`verb`'],
          ['`exists`', 'the id is already taken', '`id`'],
          ['`unhandled`', 'the agent has no such verb', '`verb`'],
          ['`not_found`', 'the named path, job or key is absent', ''],
          ['`timeout`', 'the call outlived its deadline', '`task_id`'],
        ] } },
        { video: 'branch' },
        'The set also holds `draining` (the kernel is stopping and accepts no new roots), `no_consumer` (a `watch` whose watcher has no inbox) and the transport codes `not_connected`, `transport_error` and `transport_closed`, for a connection that could not carry the call. The Python runtime has five more: `secret_found`, `failed`, `unbound_ports`, `bad_binding` and `code_not_allowed`. The Rust runtime lists 16 codes and Python 21.',
        { note: 'The kernel doc lists nine codes. The code lists more, and the code is the source for this page.' },
      ],
    },
    {
      id: 'gate',
      title: 'Reading a gate refusal',
      blocks: [
        'The call gate refuses with `unauthorized` and says which half failed in `side`. The sender’s `can_call` is checked first, so a call with neither half granted reports `egress`. If egress passes, the target’s `callable_by` is checked and a failure there reports `ingress`.',
        { code: '{"error": "a may not call \'reflect\' on b", "reason": "unauthorized",\n "hint": "grants come from above ...", "side": "egress"}\n{"error": "b does not accept \'reflect\' from a", "reason": "unauthorized",\n "hint": "grants come from above ...", "side": "ingress"}', label: 'the two gate refusals (hint cut short)' },
        'Both refusals carry the same hint: “grants come from above — an ancestor (update_agent on an agent in its subtree) or the operator writes can_call and callable_by; an agent never raises its own.” The `side` tells the reader whose grant to change: the sender’s reach on `egress`, the target’s acceptance on `ingress`.',
        'A target on another kernel, written `<guid>|<agent>`, is checked at egress only, because the other kernel decides whether it accepts the call. Its hint says to name the agent in `can_call`, as `{"<agent>": [...]}` or `{"<guid>|*": [...]}`.',
      ],
    },
    {
      id: 'arrives',
      title: 'How a refusal arrives',
      blocks: [
        'A refusal is a result, not an exception. In a batch of sends, each item gets its own outcome, in input order. An item the kernel refuses before dispatch, such as an unknown agent or a gate denial, settles `failed`, has no task id, and its `result` is the refusal. The other items still run.',
        'A handler that runs and answers with a truthy `error` settles `errored`, with its reply kept as the result. A call that outlives its own deadline settles `timed_out`, and its result is a `timeout` refusal that carries the `task_id`. A non-positive `timeout` is itself refused, as `bad_arg`.',
        'A dead letter’s settle row keeps the refusal’s `error`, `reason` and `side`, with strings cut to 500 characters, so the same fields are there when the ledger is read later.',
      ],
    },
    {
      id: 'recover',
      title: 'How a caller recovers',
      blocks: [
        'A caller reads `reason`, never the prose, and then reads the facts and the `hint`. The facts are what repair the call. `missing_arg` and `bad_arg` name the argument in `arg`. `not_here` names the verb and says to address the kernel root and put the agent you mean in `parent_id` or `id`. `locked` says to clear the lock with `update_agent` and delete again.',
        '`unknown_agent` is the clearest case. The reply lists the live agent ids in `agents`, sorted, at most 40, with the full count in `agent_count`. If the id is wrapped in angle brackets, like `<id>`, the hint says that it is a placeholder from an example and not an id, and to use one of `agents`.',
        { code: '{"error": "no agent \'<id>\'", "reason": "unknown_agent",\n "agent_count": 3, "agents": ["fetcher", "lead", "notes"],\n "hint": "\'<id>\' is a PLACEHOLDER from an example, not an id — substitute one of `agents`."}', label: 'unknown_agent (illustrative ids)' },
        { video: 'recover' },
        'The code states why: a model that copies `<id>` from an example and gets back only “no agent '+"'<id>'"+'” states what went wrong and none of the values that would repair it, so it repeats the call. “A refusal that cannot be acted on costs the same as no reply.” A person reading the same refusal gets the same help from `error` and `hint`.',
        'The kernel never repairs the call for the caller. The refused call fails once, and the reply says what the legal values are on the way out.',
      ],
    },
  ],
  sources: [
    ['refusal.rs: the shape and the codes (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/refusal.rs', 8)],
    ['_refusal.py: the shape and the codes (Python)', src('src/lib/python/kernel/_refusal.py', 10)],
    ['send/gate.rs: the gate refusals (Rust)', src('src/lib/rust/crates/fantastic-kernel/src/send/gate.rs', 89)],
    ['_agent.py: the gate refusals (Python)', src('src/lib/python/kernel/_agent.py', 1507)],
    ['outcome.rs: how an item ends', src('src/lib/rust/crates/fantastic-kernel/src/outcome.rs', 5)],
    ['system-verbs.md: Refusals', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md', 161)],
  ],
  clips: {
    shape: {
      title: 'One shape for every refusal',
      caption: 'Agent lead sends create_agent with an id that is already taken. The kernel answers with four fields in order: error, a line a person reads; reason, exists, the code a machine branches on; hint, what to do instead; and id, the id that is taken.',
    },
    branch: {
      title: 'Branch on reason',
      caption: 'Five reason codes with the fact each carries and the caller’s next step: unauthorized carries side, so read egress or ingress; unknown_agent carries agents, so pick one; missing_arg carries arg, so add it; locked carries id, so clear delete_lock and send again; not_here carries verb, so address the kernel root.',
    },
    recover: {
      title: 'Recover from a refusal',
      caption: 'A model sends reflect to the placeholder id <id>. The refusal is unknown_agent, lists the live ids fetcher, lead and notes, and says the id is a placeholder. The model sends reflect to fetcher, and the call completes.',
    },
  },
}
