// Content for the /team/ page. Source of truth for the copy is the public repo
// (github.com/aisixteen/fantastic_team: README, app/README, docs/install.md) and its
// roadmap issue #1, read on main. Keep claims in step with them. Nothing here is a
// number, price or customer of ours; the relay is described as "our relay", never named.

export const team = {
  slug: 'team',
  name: 'Fantastic Team',
  fullName: 'AISixteen Fantastic Team',
  accent: '#7c5cff',
  status: 'Open source · Alpha',
  license: 'AGPL-3.0-or-later',
  repo: 'https://github.com/aisixteen/fantastic_team',
  roadmap: 'https://github.com/aisixteen/fantastic_team/issues/1',
  board: 'https://github.com/orgs/aisixteen/projects/2',
  install: 'https://github.com/aisixteen/fantastic_team/blob/main/docs/install.md',
  tagline: 'Unattended team work on fantastic.',
  heroSub: 'You queue tasks. A team of AI agents takes them one by one, does the work on its own, and hands back finished results for you to review. You come back to done work, not to a chat.',
  // Used for the meta description and the SoftwareApplication description.
  summary: 'AISixteen Fantastic Team runs unattended team work on Aisixteen Fantastic: you queue tasks, a team of AI agents does them and hands back results to review. Open source (AGPL), alpha, built from source.',
  what: {
    title: 'What it is',
    lead: 'Fantastic Team is a program built on fantastic, the kernel of agents. One headless binary does the work. A web UI is opt-in on a local port, and a desktop app wraps that UI.',
    text: 'It is not only for code. A task is any piece of work that can be described exactly and checked. Each task says what to read, what to produce and how to check it.',
    kinds: ['Code', 'Documentation', 'Research', 'Triage', 'Data', 'Review', 'Translation', 'Ports'],
    note: 'The team does not merge. When work belongs in a repository it opens a draft pull request, and a person reviews and merges it.',
  },
  modes: {
    title: 'Two ways to run',
    lead: 'The same program, started two ways. What differs is who defines the agents.',
    cards: [
      {
        key: 'cli',
        name: 'The CLI',
        tag: 'Only what you define',
        text: 'The `fantastic_team` binary adds no coding agent of its own. It runs only the agents your `team.yaml` defines. A `team.yaml` with no templates and no first agent is valid and starts only the system agents: the dispatcher, the tools and the queue.',
        points: ['No default lead, no default workers', 'Fully headless unless you pass `--port` or `--tui`', 'Scripts render a task file for whatever agents your file defines'],
      },
      {
        key: 'app',
        name: 'The app',
        tag: 'A roles preset',
        text: 'The desktop app ships a preset: a lead plus roles. When it starts a team in a folder with no `team.yaml`, it writes the preset and the role cards there once.',
        points: ['The preset is an ordinary `team.yaml`: edit it', 'The app never overwrites it', 'The lead grows the agents it needs through the roles registry'],
      },
    ],
  },
  how: {
    title: 'How it works',
    lead: 'A lead plans, a registry says which agents may exist, and a task registry records who holds what. Nothing is hidden in code: the agents, their models and their directives come from configuration.',
    parts: [
      {
        key: 'lead',
        title: 'A lead and a roles registry',
        text: 'The lead is an AI agent configured in `team.yaml`, working from a directive. It starts every agent with `spawn` on the roles registry, after it asks the registry how many agents exist. Roles are cards, one file each: a name, a purpose, a tier and the agents it may call. A tier is the name of a template in `team.yaml`, so a card never names a model. The registry enforces limits: a spawn past a limit is refused.',
      },
      {
        key: 'tasks',
        title: 'A task registry between agents and task sources',
        text: 'Tasks live in a task registry that sits between your agents and the places tasks come from, such as GitHub issues. It records each task, who holds it, and every reassignment. It makes no outbound call and syncs nothing by itself: the lead pushes updates to the source through the source\'s own connector.',
      },
      {
        key: 'reuse',
        title: 'Versioned reuse',
        text: 'With each task the lead records the versions it was done against: repository, branch and commit, the version of the issue, and the mark an agent was forked from. Before reusing earlier work, the GitHub connector reports what changed since: commits, files and whether the issue changed. The lead decides whether to fork from the earlier mark, to reuse its context and cache.',
      },
      {
        key: 'cadencer',
        title: 'A cadencer',
        text: 'On a timer, the cadencer sends each lead a short digest of its own children. A worker that holds a task and stops making progress is marked as stalled, with its idle time. It is on by default and can be switched off in `team.yaml` or from the UI.',
      },
    ],
    flow: ['Task source', 'Task registry', 'Lead', 'Roles registry', 'Workers', 'Draft pull request'],
    flowNote: 'Workers hold no forge credentials. Delivery goes through a connector agent that owns the credentials and the rules.',
  },
  ui: {
    title: 'The interface',
    lead: 'Two columns, in the roles setup. On the left, the team as a tree of agents. On the right, the view of the agent you clicked.',
    points: [
      { term: 'Left', text: 'The agent tree: the lead first, then the agents it spawned, indented by depth, with each one\'s state.' },
      { term: 'Right', text: 'The opened agent\'s chat. A card appears in the chat where an agent embedded one, and a Canvas button shows when the agent has a canvas. The lead\'s view also shows the plan, the task registry\'s rows, above its chat.' },
      { term: 'Served locally', text: 'Start the binary with `--port N` and the UI is served on `127.0.0.1:N`. Nothing is exposed beyond your machine.' },
      { term: 'Wrapped by the app', text: 'The desktop app is a thin window over that same page. It has no logic of its own.' },
    ],
    placeholder: 'Screenshot placeholder',
    placeholderNote: 'The team UI, to be added after the first run of the desktop app. This is not an image of the product.',
    appNote: 'Status of the app: it is not released, and its window has not had a verified run yet.',
  },
  diff: {
    title: 'How it differs',
    items: [
      { title: 'Any model, with your own keys', text: 'Workers are fantastic AI agents: Anthropic models over the API with your own key, or local models (vLLM, llama.cpp) on your own GPU. Mix them, and compare them on the same tasks.' },
      { title: 'Cost measured per task', text: 'Each task records its worker, model, time, tokens and cost, computed from the prices in the template. Compare lanes on what a task really costs.' },
      { title: 'Self-hosted', text: 'You run the binary. It can run detached on a box with a GPU while you attach from a laptop over SSH, with the keys passed into memory at start and bound to loopback only.' },
      { title: 'Workers hold no secrets', text: 'Credentials live in the credential store, and workers run commands through a restricted exec: no forge login, no keys in the environment, and forge CLIs refused. This is an early, clear refusal, not an OS sandbox, so run the team as a separate user or in a container.' },
      { title: 'Two builds', text: 'The general build gives workers stock exec. The GitHub build applies a patch so workers cannot reach forge CLIs, `git push` or credentials; every GitHub action goes through the connector.' },
    ],
  },
  start: {
    title: 'Start',
    lead: 'There are no releases yet, so you build from source. You need git and a Rust toolchain on Linux or macOS. The run was verified on Linux only.',
    steps: [
      {
        n: 1,
        title: 'Build from source',
        code: 'git clone https://github.com/aisixteen/fantastic_team\ncd fantastic_team\nsh scripts/build.sh\n./target/release/fantastic_team --help',
        note: 'For the GitHub build, run `sh scripts/build-github.sh` instead.',
      },
      {
        n: 2,
        title: 'Write a team.yaml',
        code: 'templates:\n  writer:\n    handler_module: anthropic_backend\n    model: example-model\n    endpoint: https://api.example.com/v1\n    credentials:\n      store: credentials\n      ref: EXAMPLE_KEY\nfirst_agent:\n  id: lead\n  template: writer\n  directive_file: lead.md\nqueue:\n  id: queue',
        note: 'A team is a folder with a `team.yaml`. Values for keys are never in the file, only their names. `examples/team.yaml` in the repo is a complete config.',
      },
      {
        n: 3,
        title: 'Register the GitHub App',
        code: './target/release/fantastic_team setup github --name NAME',
        note: 'Optional, and only needed for pull requests, comments, labels and reading issues. It opens a local page, GitHub redirects back, and the key goes to the credential store, never to a file or the screen. Add `--org ORG` to create the app under an organization.',
      },
      {
        n: 4,
        title: 'Run it and hand it a first task',
        code: './target/release/fantastic_team --dir ./my-team --port 8123',
        note: 'In the repo the team serves, label an issue `team-ready` and add a comment that starts with `## SPEC` and holds the task. The label and the comment must come from the maintainer (the comment may also come from your GitHub App); others are ignored. The team opens a draft pull request. You review it on GitHub; merging stays with you.',
      },
    ],
  },
  links: [
    { label: 'Source and README', href: 'https://github.com/aisixteen/fantastic_team' },
    { label: 'Install guide', href: 'https://github.com/aisixteen/fantastic_team/blob/main/docs/install.md' },
    { label: 'Roadmap (issue #1)', href: 'https://github.com/aisixteen/fantastic_team/issues/1' },
    { label: 'Project board', href: 'https://github.com/orgs/aisixteen/projects/2' },
  ],
  statusNote: 'Alpha. The first version\'s code is complete, and the end-to-end testing phase comes next, then a release. There are no releases yet. Expect sharp edges.',
  related: 'Built on [Aisixteen Fantastic](/fantastic/). For how the pieces work underneath, see [Example: Team](/fantastic/foundations/build/team/) in Foundations.',
}
