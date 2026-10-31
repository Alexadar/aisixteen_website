import { src, tree } from '../lib.js'

const TEAM = 'https://github.com/aisixteen/fantastic_team'
const team = (path, line) => `${TEAM}/blob/main/${path}${line ? `#L${line}` : ''}`

export default {
  headline: 'Example: Team, a product built on fantastic',
  description: 'How fantastic_team, a public program built on Aisixteen Fantastic, uses role cards, a project lead that plans a tree of agents, the task registry and a cadencer.',
  summary: 'fantastic_team is a public program built on fantastic: role cards, a project lead that grows a tree of agents, a task registry and a cadencer.',
  cover: { clip: 'plan' },
  about: ['Aisixteen Fantastic', 'Multi-agent teams', 'Role cards'],
  lead: [
    '[fantastic_team](https://github.com/aisixteen/fantastic_team) is a separate, public program built on fantastic. Its product page is [Fantastic Team](/team/). Its README describes it as unattended team work: you queue tasks, a team of AI workers takes them, and you review what comes back. It is an example of what the pieces on the other pages make when you put them together.',
    'This page follows four parts of it: how `team.yaml` turns role cards into agents, what the `project_lead` card grants and asks, how the lead records its work in the task registry, and what the cadencer sends back up. Everything about fantastic itself is covered on the pages linked in each section; this page shows Team’s use of it. The statements about Team come from its repository at the commit named in the sources.',
  ],
  sections: [
    {
      id: 'what',
      title: 'What Team is, and what it is not yet',
      blocks: [
        'Team depends on fantastic as a pinned git dependency, so it uses the same kernel, agents and bundles described in the other Foundations pages. A **team** is a folder with a `team.yaml`. The file names the worker templates the team may start, the connectors it may use, the queue and the credential store.',
        'The binary adds no coding agent of its own. A `team.yaml` with no `templates` and no `first_agent` is valid and starts only the system agents: the dispatcher, the tools and the queue. Which agents exist is the file’s choice.',
        { list: [
          'The README says there are no releases yet, so you build from source with `sh scripts/build.sh`. It needs `git` and a Rust toolchain.',
          'It also says CI runs the unit tests on Linux, macOS and Windows, but the run was verified on Linux only.',
          'Team does not merge. A worker opens a draft pull request, and a person reviews and merges it.',
        ] },
      ],
    },
    {
      id: 'cards',
      title: 'Role cards and tiers in team.yaml',
      blocks: [
        'Team turns on fantastic’s roles registry with a `roles:` section. It takes an `id` (default `roles`), `dirs`, the folders of role cards (default `roles`), and `limits` with `total` and `per_role`. Team applies the limits with `set_limit` at every start, and clears a limit the file no longer names. [Agentic resources and tasks](/fantastic/foundations/agents/agentic-resources/) explains the registry; the cards and limits themselves work as described there.',
        { code: 'roles:\n  id: roles\n  dirs: [roles]\n  limits:\n    total: 3\n    per_role:\n      worker: 2', label: 'the roles section of examples/team.yaml' },
        'A card’s `tier` is the name of a template in the same `team.yaml`. A card therefore names no model: the file maps the tier to a model, an endpoint and a credential, and the registry holds one tier per template. The example file names three tiers, `strong`, `small` and `issue_keeper`. A test checks that no card text names a provider or a model.',
        'Team ships six cards in its `roles/` folder. The `project_lead` card replaces fantastic’s generic card of the same name.',
        { table: { head: ['card', 'tier', 'grants'], rows: [
          ['`worker`', '`small`', '`worker_exec`, `worker_files`, `queue`'],
          ['`lead`', '`strong`', '`$registry`, `worker_exec`, `worker_files`, `queue`, `kernel`'],
          ['`project_lead`', '`strong`', '`$registry`, `github`, `board`, `queue`, `kernel_state`, `tasks`'],
          ['`issue_keeper`', '`issue_keeper`', '`queue`'],
          ['`issue_writer`', '`small`', '`queue`'],
          ['`spec_reviewer`', '`small`', '`queue`, `worker_files`'],
        ] } },
        'Team checks the cards before it starts. It refuses to start when a card does not parse, names a tier that is not a template, grants an agent that `team.yaml` does not define, or when one of the six cards is missing. `roles:` also needs a `first_agent` and `templates`.',
        { video: 'cards' },
      ],
    },
    {
      id: 'project-lead',
      title: 'The project lead plans a tree',
      blocks: [
        'The `project_lead` card describes a lead that “plans a team’s open issues as a tree of agents, runs it through the GitHub connector, and reports one condensed account upward”. It plans and coordinates, and does not write code. Its grants are the whole of what it can do:',
        { table: { head: ['grant', 'verbs'], rows: [
          ['`$registry`', '`roles`, `role`, `spawn`, `get_count`, `fleet`, `report`'],
          ['`github`', '`issues`, `issue_view`, `issue_edit`, `issue_state`, `comment`, `label`, `project_field_set`, `pr_create`, `pr_status`, `staleness`, `push`'],
          ['`board`', '`board`, `rows`'],
          ['`queue`', 'all verbs'],
          ['`kernel_state`', '`await_set`, `await_cancel`'],
          ['`tasks`', '`add`, `assign`, `reassign`, `status`, `report`, `list`, `get`'],
        ] } },
        'The card tells it a flow. It reads the issues and the board, and it reads its own room: `roles`, `get_count` and the fork points of its conversation. It then proposes a tree in the chat: sub-leads per area, a worker per issue, what waits on what. After approval it grows the tree with `spawn {role, task}` on the registry. A sub-lead starts with `spawn {role, from: {agent, at}}`, which branches off a mark in the lead’s conversation ([Forking and marks](/fantastic/foundations/agents/ai-agent/forking/)), and with `limits` that hand it part of the lead’s quota ([the quota](/fantastic/foundations/agents/agentic-resources/#quotas)).',
        'It waits for its children with `await_set` ([Tasks and waiting](/fantastic/foundations/kernel/tasks/)), never with a shell wait or short polling loops. Team writes the other end of that grant at every start: it names the agents below the root in the root’s `callable_by` with `await_set` and `await_cancel`.',
        { h3: 'When it asks first' },
        'The card says when to stop and ask. It asks before a plan of more than five agents, before going past its limits, and before any GitHub write (`issue_edit`, `issue_state`, `comment`, `label`, `pr_create`, `push`). A small plan within its limits and with no GitHub write may start at once. If the user says “show me the plan first”, it always waits for a “yes”.',
        { quote: 'Approval is the user\'s reply in the chat, nothing else: no button, no code gate.', cite: 'roles/project_lead.md' },
        'This is a rule in the card’s text, which the model reads. Team’s tests check that the card contains these rules, but no code enforces the wait. What code does enforce is the grants: a call the card does not list is refused with “may not call”, and the card tells the lead to say so and stop. The limits are enforced too. A spawn past a limit is refused, and the card says that refusal is final.',
        'Nothing is cleaned up until the user asks. The lead never deletes an agent or closes an issue by itself, so finished agents, their histories and their marks stay. The card has each worker make a branch, push it and open a draft pull request through the `github` connector, and the lead reads the worker’s ticks and labels instead of redoing them. The shipped `worker` card grants no connector, so a team whose workers deliver this way adds `github` to its own worker card.',
        { video: 'plan' },
      ],
    },
    {
      id: 'tasks',
      title: 'Tasks it records',
      blocks: [
        'With `roles:`, Team adds one more agent, `tasks`: fantastic’s `task_registry`, created as a child of the lead. The id `tasks` is taken. Its rows live in the team’s one store agent, a `sqlite_store` whose file is `.fantastic/memory.db` by default. That store also keeps every AI agent’s conversation, so the history and the task rows survive a restart.',
        'The card tells the project lead to record each issue it hands out. Right after it starts an agent for an issue, it calls `add` with the issue as the `source` and the agent as the `holder`. When it gives a whole area to a sub-lead, the holder is that sub-lead’s subtree. When it hands an issue to another agent, it calls `reassign`, and the registry keeps every step in the task’s history.',
        { code: 'add {"id": "o/r#12", "source": "gh:o/r#12", "holder": "w1"}\nreassign {"id": "o/r#12", "holder": {"subtree": "sub-a"}}', label: 'illustrative ids: the lead’s calls on tasks' },
        'The card also has the lead store, with each task, the `versions` it was done against (`{repo, branch, commit}` per repo), the issue’s `source_version`, and the mark it was forked from (`fork_from`). Before it reuses a mark, it calls the connector’s `staleness` verb, which returns the commits and changed files since the recorded commit and whether the issue changed. The card says “Code gives the facts; you decide”, so the choice between forking and starting fresh stays with the lead. A child’s `usage` goes up with its `report`, and `list` sums it.',
        'The registry does not sync with GitHub. The card says so: after the lead changes a task, it pushes the update to the source itself, with `issue_edit`, `comment` or `label` on the `github` connector, at the task’s `update_to`. [Who holds what](/fantastic/foundations/agents/agentic-resources/#tasks) covers the verbs and refusals such as `already_held`.',
        'With `roles:`, the `board` verb returns a `roles` section as well: the tree below the project lead with each agent’s role and state, the count from `get_count`, and the task rows with source, holder and status. Team finds the project lead as the first agent that the registry’s `fleet` lists under the role `project_lead`. Its end-to-end test spawns that role through the registry as the operator.',
      ],
    },
    {
      id: 'cadencer',
      title: 'The cadencer reports upward',
      blocks: [
        'The **cadencer** is an agent Team creates in every team. It is on by default; `cadencer: {enabled: false}` creates it switched off. On a timer it reads the tree and sends each lead a short digest of the level directly below it. A sub-lead’s line rolls up its whole subtree, so a project lead sees one line per sub-lead and does not see the workers below.',
        'In a team with `roles:`, the tree is the spawned tree. The cadencer reads the registry’s `fleet` and `get_count`, the root’s `reflect` of the project lead’s branch, and the task registry’s `list`. An agent holding a running, waiting or blocked task, itself or through an ancestor’s subtree, is busy. An agent whose tasks are all done is done, and an agent with no task is idle. Before each beat the cadencer is let `send` to the leads the registry lists under `project_lead` and `lead`, so a lead spawned after the start still gets its digest.',
        { list: [
          'The beat is 60 seconds by default. A group in `team.yaml` may set its own `cadence`, `stall_after`, `quiet` and `enabled`.',
          'A worker is **stalled** when it holds a task and has been idle for `stall_after` seconds (300 by default). The digest line says `STALLED` with the idle time.',
          'In quiet mode, the default, a digest holds only what changed since the last one, plus every stall. An empty digest is not sent.',
          'A quiet lead that gets no digest, has an idle member and sees queued work gets one line on every third such beat: `heartbeat: N idle, M queued`. A regular digest restarts the count.',
        ] },
        { code: 'sub-a: 2 agents (2 busy) · +0 new · 1 STALLED', label: 'a sub-lead’s roll-up line (illustrative values)' },
        'A digest goes to the lead’s driver, else to the lead itself if it has an AI, else to the board. It is a `send` whose text is the lines. A failed send is counted and is never fatal. The cadencer also reports the team’s load as plain counts in its `status`: workers busy, idle and stalled, and tasks held, in review, done, blocked and queued. The code gives only these numbers; it has no mode and no progress bar.',
        { video: 'digest' },
      ],
    },
    {
      id: 'where',
      title: 'Where to read more',
      blocks: [
        'The repository is [aisixteen/fantastic_team](https://github.com/aisixteen/fantastic_team), under AGPL-3.0-or-later like fantastic. Start with `README.md`, `examples/team.yaml` and the six cards in `roles/`. The code for the tree, the grants and the cadencer is in `crates/team/src`. The README also covers Team’s other parts, such as the dispatcher page, worker packs and remote running, which this page leaves out.',
        'To build your own agents of the same kind, see [A program agent](/fantastic/foundations/build/program-agent/) and [A bundle](/fantastic/foundations/build/bundle/). The cards, the registry and the task registry are the pieces that Team shares with any other team you write.',
      ],
    },
  ],
  sources: [
    ['fantastic_team README: configure, roles, load and progress', team('README.md', 129)],
    ['fantastic_team: examples/team.yaml', team('examples/team.yaml', 1)],
    ['fantastic_team: the project_lead card', team('roles/project_lead.md', 1)],
    ['fantastic_team: card checks and the tasks agent in the plan', team('crates/team/src/tree.rs', 154)],
    ['fantastic_team: the cadencer', team('crates/team/src/cadencer.rs', 1)],
    ['fantastic_team: the board’s roles section', team('crates/team/src/board.rs', 868)],
    ['fantastic: the roles registry (Rust)', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/lib.rs', 88)],
    ['fantastic: the task registry (Rust)', src('src/lib/rust/crates/bundles/fantastic-task-registry/src/lib.rs', 92)],
  ],
  clips: {
    cards: {
      title: 'Cards name a tier, team.yaml defines it',
      caption: 'team.yaml defines templates, here strong and small. The project_lead card names strong and the worker card names small, so no card names a model. A third card, reviewer, names tier fast. No template has that name, so the team refuses to start.',
    },
    plan: {
      title: 'The project lead grows a tree',
      caption: 'The project lead proposes a plan of six agents in the chat (the project lead and five it will start). Over five agents, so it waits. The user replies yes. It spawns a sub-lead and workers through the registry, and records each issue in tasks with a holder: w1 holds o/r#12, and the sub-lead’s subtree holds the rest of its area. It then waits for sub-a and w1 with await_set, and deletes nothing.',
    },
    digest: {
      title: 'The cadencer sends one line per branch',
      caption: 'The cadencer reads the spawned tree: lead, sub-lead sub-a, and two workers. Worker w2 holds a task and has been idle past stall_after. The digest to the lead has one roll-up line for sub-a with 1 STALLED, and none for the workers below.',
    },
  },
}
