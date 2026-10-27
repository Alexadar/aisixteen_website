// Protocol › Security. Facts: coder/tmp/foundations/facts/protocol_security.md (fantastic main b175660c).
import { src, tree } from '../lib.js'

export default {
  headline: 'Security: capabilities, not ambient authority',
  description: 'How Aisixteen Fantastic limits what an agent can reach: two-sided grants, credentials bound to a host, a sealed exec bridge with an allowlist, and clamped file agents.',
  summary: 'Grants instead of ambient authority; credentials by reference; sealed process and file edges.',
  cover: { clip: 'reach' },
  about: ['Aisixteen Fantastic', 'Access control', 'Secrets management'],
  lead: [
    'An agent in Fantastic starts with the power to call itself and nothing else. Every other reach is a **grant**: a line in a record that someone with authority wrote, and that the kernel checks on every send.',
    'This page follows that rule outward: what a new agent can do, where a secret lives, why the process edge refuses an unlisted command, and how a file agent is kept inside its folder. It ends with what an agent can and cannot reach.',
  ],
  sections: [
    {
      id: 'grants',
      title: 'Authority is a grant',
      blocks: [
        'The kernel checks every send an agent makes. The sender’s `can_call` must grant the target and the verb (**egress**), and the target’s `callable_by` must grant the sender and the verb (**ingress**). The gate never looks at what the verb is. The [call gate](/fantastic/foundations/protocol/call-gate/) page covers the rule itself.',
        'The baseline on both fields of every agent is `{"$self": "*"}`: the agent itself and nothing else. An absent or empty grant denies. Every other edge is a line someone wrote.',
        { code: 'worker.can_call     {"$self": "*", "store": ["get"]}\nstore.callable_by   {"$self": "*", "worker": ["get"]}', label: 'one edge, written on both ends (illustrative ids)' },
        'The refusal teaches where grants come from: “grants come from above — an ancestor (update_agent on an agent in its subtree) or the operator writes can_call and callable_by; an agent never raises its own.” An agent that tries to widen its own record is refused unless it holds `update_agent` on the root, and that is itself a grant.',
        'Sends made by the operator (the CLI, a transport handing in a frame) skip the gate. Identity inside the kernel comes only from dispatch: the sends a handler makes, and the tasks it spawns, are that agent’s.',
        { video: 'reach' },
      ],
    },
    {
      id: 'spawn',
      title: 'Spawning inherits nothing',
      blocks: [
        'A child made by `create_agent` gets the same baseline as any agent: `{"$self": "*"}` on both fields. It does not receive its parent’s reach, and it is not granted `$parent` or `$subtree`. Any wider grant is written into the new record explicitly.',
        '`create_agent` itself needs a grant on the root, on both ends. The child’s `boot` is kernel bookkeeping, run as the child, and is never a send checked against the creator’s grants.',
        'A program started by an `exec_bridge` agent acts as that agent. Its sends carry the runner’s identity, its reach is the runner’s `can_call`, and a target must list the runner in `callable_by`. You grant the runner, not the program.',
        { note: 'The code checks the shape of grants written at create time, not whether they exceed the creator’s own. Whoever holds `create_agent` or `update_agent` on the root can write any grants, so that grant is the one to hand out with care.' },
      ],
    },
    {
      id: 'credentials',
      title: 'Credentials: by reference, bound to a host',
      blocks: [
        'A secret lives in a **credential store**. A credential is a **ref** such as `openai/main` that holds named fields (`api_key`) and is bound to one host. A consumer names it on its own record as `credentials: {store, ref}`. The record holds the name of the secret, never its value.',
        'Only `update_agent` on the store declares a ref, and the declaration must carry its `host`. `set` stores or rotates a value for a declared ref and takes no host of its own. The host is stored beside the value, so a value saved for one host is not returned for another.',
        { code: 'credentials: {store: "creds", ref: "openai/main"}\n\nget {"ref": "openai/main", "host": "api.example.com"}\n→ credential_store: ref \'openai/main\' is bound to host \'api.openai.com\',\n  not \'api.example.com\' — refused, nothing read', label: 'the record, and a get for the wrong host (illustrative host names)' },
        'An AI backend reads its key this way. Before every request it sends the store `get` with the `ref` and the endpoint it is about to call. The store answers only if the ref is bound to that host. Nothing is cached, so a key rotated with `set` is used by the next request without a restart.',
        'The value rides the call, so the kernel records it as `[secret]`. A `set` payload and a `get` reply show `[secret]` in the ledger, the memory store and the state stream, while the caller receives the value whole. Across connected kernels, the calling side marks the values as secret too.',
        'The store’s own guidance is not to give a credential to an AI agent’s prompt, and instead to give it to a bundle that sends it. A store has no per-ref access lists: any caller the call gate admits may `set`, `get` or `forget` a declared ref, so the gate decides who is admitted.',
        { video: 'credential' },
        { h3: 'Where the value rests' },
        { table: { head: ['backend', 'how it holds a value'], rows: [
          ['`file` (default)', 'a YAML file at an absolute path, written with mode 0600 and read only if it is a regular file owned by this user with no group or other bits'],
          ['`keychain`', 'the operating system’s keychain, one item per ref'],
          ['`env`', 'read-only: each ref maps its fields to environment variables, so no value is kept at rest'],
        ] } },
      ],
    },
    {
      id: 'edges',
      title: 'The process and file edges',
      blocks: [
        'Two bridges cross out of the kernel: `exec_bridge` runs commands, and `file_bridge` reads and writes files. Both are **sealed by default**. A freshly created leg refuses every verb except discovery with `{reason: "unauthorized"}` until an operator opens it with `update_agent <id> ingress_rule=allow_all_ingress` (or `password_ingress`).',
        { h3: 'exec_bridge: the allowlist is the law' },
        'Even open, `start` runs a command only if the whole line, `command` plus `args` joined, fully matches one regex in the record’s `allowed` list. There is no default list, no per-call override, and an empty list runs nothing. The one exception is the record’s `shell` field, which permits exactly the child’s own shell line on a PTY job. A request that matches nothing is refused with the patterns in the message.',
        'Where and with what a command runs also belongs to the record. A per-call `env` or `cwd` is refused, `cwd` is required, and the child’s environment is built from the record: the kernel variables named in `inherit_env` (none by default) plus the record’s own `env`.',
        { code: 'allowed = ["ffmpeg .*"]\n\nstart curl example.com\n→ exec_bridge: command not allowed: \'curl example.com\'\n  — this leg permits: [\'ffmpeg .*\']', label: 'an allowlist and a refusal (illustrative command)' },
        'The code is plain that this is **not a sandbox**. An allowlisted command keeps all of its own reach, and a pattern such as `python3 -c .*` or any shell runs any code. The allowlist guarantees one thing: the operator chose which commands may run, and a caller cannot pick another. Stronger containment would need an operating-system mechanism and is not built.',
        { h3: 'file_bridge: a root and an allow list' },
        'A file bridge is clamped to the directory the kernel runs in. `..`, `~`, absolute paths outside it and symlinks that point out all refuse. Inside that, the bridge’s `allow` list names what it exposes. No list, or an empty one, exposes nothing, and an unlisted path answers `not_found` whether or not it exists.',
        'Both the path as asked and the file it lands on, with symlinks followed, must be in the list. The list is read live: `update_agent` changes it, and the next call obeys. Writes are separately governed by `readonly`.',
        'A file or a folder given to an agent is a **view** of the bridge. A file view’s `can_call` on the bridge names exactly `read`, `write`, `watch_path` and `unwatch_path`, and the bridge’s `callable_by` entry for it carries its path. A verb that names another path is refused.',
        { video: 'edges' },
      ],
    },
    {
      id: 'reach',
      title: 'What an agent can and cannot reach',
      blocks: [
        { table: { head: ['an agent can', 'an agent cannot'], rows: [
          ['call itself, and any agent that both lists it and is listed by it, for the verbs both name', 'call anyone else, or raise its own grants without `update_agent` on the root'],
          ['ask a credential store for a ref it was wired to, and use the value for that ref’s host', 'read a secret from a record, the ledger or the state stream, which show `[secret]`'],
          ['start a command on an open exec bridge it can call, if the line matches `allowed`', 'start any other command, or pass its own `cwd` or `env`'],
          ['read and write what a file bridge’s `allow` list exposes, inside the running directory', 'see a path outside the list, outside the root, or through a link that leaves it'],
        ] } },
        'The scope is a single operator’s fleet of kernels that trust each other. The project’s `SECURITY.md` states that the HTTP, WebSocket and REST surfaces are not independently authenticated by design: the trust boundary is the channel, such as loopback or an authenticated tunnel. Whoever can reach a kernel’s control surface can drive it.',
        'A root `reflect` shows the landscape: which legs are open and what each agent may call. That is how an operator audits a kernel before opening an edge.',
      ],
    },
  ],
  sources: [
    ['SECURITY.md: threat model and scope', src('SECURITY.md', 57)],
    ['README.md: security posture', src('README.md', 98)],
    ['the call gate (Python)', src('src/lib/python/kernel/_authz.py', 1)],
    ['credential_store readme', src('src/lib/rust/crates/bundles/fantastic-credential-store/src/readme.md', 1)],
    ['how an AI backend reads its key', src('src/lib/rust/crates/bundles/fantastic-ai-core/src/credentials.rs', 1)],
    ['exec_bridge readme', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/readme.md', 1)],
    ['file_bridge readme', src('src/lib/rust/crates/bundles/fantastic-file/src/readme.md', 19)],
    ['the file clamp e2e probe (E116)', tree('e2e/tests/kernel/E116_file_clamp')],
  ],
  clips: {
    reach: {
      title: 'No grant, no reach',
      caption: 'Agent worker starts with only itself in can_call. Its get to store is refused. The operator writes both ends of the edge: worker.can_call names store, and store.callable_by names worker. The same send now passes, for get only. A third agent, other, was never named, and stays out of reach.',
    },
    credential: {
      title: 'A key by reference, for one host',
      caption: 'The record of an AI agent holds credentials: store and ref, not a key. Before a request it sends the store get with the ref and the host it is about to call. The store returns the key only for the host the ref is bound to. A get for another host is refused, and the ledger shows the value as [secret].',
    },
    edges: {
      title: 'Sealed edges and allowlists',
      caption: 'A new exec_bridge refuses start as unauthorized. Opened, it still refuses a line that matches nothing in allowed. A listed line runs. A file_bridge exposes only the paths in its allow list: docs/a.txt is read, an unlisted file answers not_found, and ../secret is refused by the clamp.',
    },
  },
}
