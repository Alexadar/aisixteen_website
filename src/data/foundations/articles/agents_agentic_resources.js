import { src, tree } from '../lib.js'

export default {
  headline: 'Agentic resources and tasks: roles, limits and who holds what',
  description: 'How the Aisixteen Fantastic agentic_resources bundle spawns agents from role cards under limits that count every agent, and how task_registry records which agent holds each task. Both are off by default.',
  summary: '`agentic_resources` spawns agents from role cards and counts every one that still exists against its limits. `task_registry` records who holds each task and where it came from. Both are off until the host turns them on.',
  cover: { clip: 'cards' },
  about: ['Aisixteen Fantastic', 'Agent roles', 'Task registry'],
  lead: [
    'Two bundles let a lead agent grow a team and keep track of its work. `agentic_resources` holds **role cards** and creates agents from them with `spawn`, under limits. `task_registry` records which agent, or which subtree, holds each task.',
    'Neither bundle is on by default. This page covers how to turn them on, what a card is, how `spawn` counts and caps agents, how a worker reports, and how tasks are added, assigned and reassigned. The Rust and Python runtimes implement the same verbs. [Example: Team](/fantastic/foundations/build/team/) shows both in use in a product.',
  ],
  sections: [
    {
      id: 'off',
      title: 'Off until the host turns them on',
      blocks: [
        'A Rust host registers `agentic_resources` only when the environment variable `FANTASTIC_AGENTIC_RESOURCES` is truthy, and `task_registry` only when `FANTASTIC_TASK_REGISTRY` is. Truthy means `1`, `true`, `yes` or `on`, in any case. A Python host resolves the two modules under the same variables; with the variable unset, a create of the module is an unknown handler.',
        'A second switch is in the record. An `agentic_resources` agent with no `role_dirs` refuses every verb except `reflect`, with `{"error": "agentic_resources is disabled"}`. A `task_registry` agent with no `task_store_id` does the same, with the error `disabled`. `reflect` still answers, and reports `enabled: false`.',
      ],
    },
    {
      id: 'cards',
      title: 'Role cards',
      blocks: [
        'A **role card** is one `*.md` file. A `---` header holds `name`, `purpose`, `tier` and `grants`. The text after the header is the directive, and it becomes the new agent’s system prompt. A role is any kind of agent, not only a code agent.',
        { list: [
          '`tier` is a key, never a model. The registry’s own `tiers` map, `{tier: backend fields}`, turns the key into the fields of the new agent. A key that is not in the map is refused with `unknown_tier`; a tier with no `handler_module` is refused with `bad_tier`.',
          '`grants` is the child’s `can_call`. The key `$registry` stands for the registry itself, and every child also gets `report` on it.',
          '`name`, `purpose` and `tier` are required. A card whose `grants` is not a map of `"*"` or verb lists is rejected.',
        ] },
        'The registry reads the folders in its `role_dirs` on every call, so adding a file adds a role. `roles` lists each card’s `name` and `purpose`, plus an `errors` list. A bad card is named there and skipped. `role {name}` returns one whole card, and an unknown name is `not_found`.',
        'A generic `project_lead` card ships with the bundle, and `roles` always lists it. A card of the same name in a folder replaces it. A second folder card with a name already read is refused as a duplicate.',
        { video: 'cards' },
      ],
    },
    {
      id: 'spawn',
      title: 'Spawn',
      blocks: [
        '`spawn {role, task?, name?, limits?}` creates an agent from the card and makes it a child of the caller. An operator spawn has no caller, so the child sits under the registry. The new record carries `spawned_by`, the registry’s id, and `role`. These two fields are how the registry finds its agents later.',
        'The caller gets `pause`, `resume` and `stop` on the child. The grant is written on both ends: into the child’s `callable_by` and into the caller’s `can_call`. A lead therefore controls its own subtree without anyone writing grants by hand.',
        'A `task` that is a string is sent to the child as its first message. The registry sends it detached, so `spawn` answers at once and does not wait for the child’s turn. Any other `task` is `bad_arg`. The reply is `{id, role, tier}`.',
        'The card’s grants on tools are written on both ends of each edge: the child’s own `can_call` and the tool’s `callable_by`. A spawn never hands out more than the spawner holds. [Call gate and grants](/fantastic/foundations/protocol/call-gate/#spawn) covers that check, `not_allowed` and `grant_failed`. [Forking and marks](/fantastic/foundations/agents/ai-agent/forking/) covers `spawn` with `from`, which branches the new agent off an existing one.',
      ],
    },
    {
      id: 'limits',
      title: 'Limits count every agent',
      blocks: [
        'The registry’s `limits` are `{total?, per_role?: {role: n}}`. `set_limit {role?, max}` writes them to the registry’s record. Without `role` it caps all spawned agents together; with `role` it caps that role. `max: null` clears the cap, and `max` must be a non-negative integer.',
        { code: '{"total": 5, "per_role": {"worker": 3}}', label: 'limits in the registry record (illustrative)' },
        'Nothing is counted in memory. Every spawned agent carries `spawned_by` and `role`, so `get_count {role?}` scans the records and returns `{running, max}`. `running` counts **every** agent this registry spawned that still exists, whatever it is doing. `max` is `null` when there is no cap. Because the count is read off the records, a delete lowers it and a restart rebuilds it.',
        'A slot frees only on `delete_agent`. A worker that reports `done` still holds its slot. `fleet` lists the same agents, grouped by role, as `{roles: {role: [{id}]}}`.',
        'At the start of a `spawn` the registry checks the role cap, then the total. A spawn at the cap is refused and creates nothing:',
        { code: '{"error": "limit", "scope": "total", "role": "worker", "running": 2, "max": 2,\n "reason": "all roles together are at the limit (2 running, max 2)"}', label: 'the refusal (illustrative values)' },
        '`scope` is `role` or `total` for the registry’s caps; `running` and `max` give the count and the cap that stopped the spawn. Today both bundles refuse with the code in `error` (such as `limit`, `unknown_tier` or `already_held`) and a sentence in `reason`, the reverse of the kernel’s [common refusal shape](/fantastic/foundations/protocol/refusals/), which puts the code in `reason`.',
        { video: 'limits' },
      ],
    },
    {
      id: 'quotas',
      title: 'Handing a quota to a sub-lead',
      blocks: [
        '`spawn` takes `limits: {total?, per_role?}`. The registry stores it on the child’s record, and it is the child’s own subtree cap. A sub-lead can then spawn only inside what it was given.',
        'A lead’s **subtree** is every spawned agent below it in the tree, plus any agent whose `lead` field names it. A fork spawned `from` another agent sits beside its source, and `lead` keeps it in the right quota. For the caller and every ancestor that the registry spawned and that has `limits`, `spawn` checks the subtree total (`subtree_total`) and the subtree’s per-role count (`subtree_role`). In a delegated quota `per_role` is one number that applies to each role.',
        'A caller cannot hand on more than it has left. When a spawned lead asks for `total`, the request must fit its cap, minus what its subtree already uses, minus one slot for the sub-lead itself. A larger request is refused with scope `request`. A `per_role` request cannot exceed the lead’s own `per_role`.',
      ],
    },
    {
      id: 'report',
      title: 'Report, and no cleanup',
      blocks: [
        'A spawned agent tells its parent with `report {state, result?}`, when that parent is not the registry itself. `state` is one of `waiting`, `running`, `blocked`, `done`, `failed` and `paused`. The parent, if it is not the registry, receives a message `{type: "report", from, state, result}`. The reply is `{ok: true}` either way, and nothing is stored on any record. A child spawned by an operator sits directly under the registry, so no one receives its message. Any other caller is refused with `not_spawned`.',
        'The registry never cleans up. A `report` of `done` retires nothing and deletes nothing. `delete_agent` ([Lifecycle](/fantastic/foundations/kernel/lifecycle/)) is the only way out, and it is the only thing that frees a slot.',
      ],
    },
    {
      id: 'tasks',
      title: 'The task registry',
      blocks: [
        '`task_registry` keeps the **task tree** of a team: which agent, or which subtree, holds each task, and where the task came from. It makes no outbound call. `source` and `update_to` are opaque strings such as `gh:owner/repo#12`. An agent reads them to see where a task came from and pushes updates itself, through that source’s own agent. Nothing is synced automatically.',
        'This is not the kernel’s task table. The registry’s tasks are records of work. [Tasks and waiting](/fantastic/foundations/kernel/tasks/) covers `ps`, `cancel` and `await_set`, which track running jobs in the kernel. The registry holds the task tree.',
        'An entry has `id`, `parent`, `source`, `update_to`, `holder`, `history`, `status`, `report`, `versions`, `source_version`, `fork_from` and `usage`. `versions` is a list of `{repo, branch, commit}`, one per repo the task touches; `fork_from` is `{agent, mark}`; `usage` is the token counts of the task’s last `report`. All are opaque facts that nothing checks. `parent` is another task id or `null`. `status` is one of the six states, and defaults to `waiting`.',
        'The `holder` is an agent id, `{subtree: <root agent id>}`, or `null`. It must name an existing agent.',
        { list: [
          '`add {id, source, parent?, update_to?, holder?, status?}` creates a task. A taken id is `exists`, and an unknown parent or holder is `not_found`. `update_to` defaults to `source`.',
          '`assign {id, holder}` gives a task nobody holds to a holder. A task that is already held is refused `already_held`.',
          '`reassign {id, holder}` moves a held task. A task nobody holds is refused `not_held`. A move from agent to agent, agent to subtree and subtree to agent are all allowed.',
          '`status {id, status}` changes the state; it can also set `versions`, `source_version` and `fork_from`, and then `status` may be left out. `report {id, from?, state?, result?, usage?}` records the last report on the task. `list` and `get` read tasks; `get` also returns the ids of the task’s children.',
        ] },
        'Every change of holder, including the one given at `add`, appends `{from, to, by, at}` to `history`. `by` is the caller, or `null` for the operator. The history is the audit of who held the task and when.',
        { code: '{"from": "lead-a", "to": {"subtree": "team-b"}, "by": "lead-a", "at": 1.7e9}', label: 'one history step (illustrative values)' },
        { video: 'tasks' },
      ],
    },
    {
      id: 'writers',
      title: 'Who writes, and where it is stored',
      blocks: [
        'The registry has one rule of its own: in `report`, `from` defaults to the caller and must be the caller or one of its descendants, else `not_in_subtree`. Everything else is the [call gate](/fantastic/foundations/protocol/call-gate/). Only a branch lead is granted the write verbs `add`, `assign`, `reassign`, `status` and `report` on the registry. A worker sends its lead the `agentic_resources` `report` message, and the lead writes the registry.',
        'The registry keeps no tasks in memory. Its record names a store agent in `task_store_id`, and each write appends one snapshot row `{kind: "task", task_id, content: <entry>}` to it. Every read takes the latest row per `task_id`, so a restart rebuilds the tasks from the store. A store that refuses or cannot be reached gives `store_refused`, and nothing falls back to RAM.',
        'The store may be volatile (`ram_store`) or a durable one. The wiring is explicit, as for agent memory: the registry’s `can_call` reaches the store, and the store’s `callable_by` lists the registry. The registry serializes the writes of one registry agent, so two leads cannot race. [State and durability](/fantastic/foundations/kernel/state/) covers what survives a restart.',
      ],
    },
  ],
  sources: [
    ['agentic_resources: spawn, limits, report (Rust)', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/lib.rs', 348)],
    ['agentic_resources: role cards (Rust)', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/cards.rs', 52)],
    ['agentic_resources readme', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/readme.md', 1)],
    ['agentic_resources: the same verbs in Python', src('src/lib/python/bundled_agents/agentic_resources/src/agentic_resources/tools.py', 197)],
    ['task_registry: assign, reassign, report (Rust)', src('src/lib/rust/crates/bundles/fantastic-task-registry/src/lib.rs', 555)],
    ['agentic_resources: tool grants opened on the tool’s end (Rust)', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/lib.rs', 766)],
    ['task_registry: versions, source_version, fork_from, usage (Rust)', src('src/lib/rust/crates/bundles/fantastic-task-registry/src/lib.rs', 24)],
    ['task_registry readme', src('src/lib/rust/crates/bundles/fantastic-task-registry/src/readme.md', 1)],
    ['task_registry: the same verbs in Python', src('src/lib/python/bundled_agents/task_registry/src/task_registry/tools.py', 1)],
    ['where the host registers both (Rust)', src('src/lib/rust/crates/fantastic-cli/src/main.rs', 116)],
  ],
  clips: {
    cards: {
      title: 'A role card becomes an agent',
      caption: 'The card reviewer names tier fast and grants report on the registry. The registry’s tiers map turns fast into backend fields. lead sends spawn {role: "reviewer"}, and reviewer-1 appears as lead’s child, with pause, resume and stop granted to lead.',
    },
    limits: {
      title: 'Limits count every agent',
      caption: 'The total limit is 2. Two spawns create w1 and w2. A third spawn is refused with limit, scope total, 2 running, max 2. w1 reports done, and the third spawn is still refused. After delete_agent on w1, the count drops to 1 and the spawn creates w3.',
    },
    tasks: {
      title: 'Who holds the task',
      caption: 'add creates t1 with source gh:o/r#12 and no holder. assign gives it to lead-a, and a second assign is refused with already_held. reassign moves it to the subtree of team-b. The history lists both steps as from, to, by and at.',
    },
  },
}
