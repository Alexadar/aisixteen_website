import { src } from '../lib.js'

const R = 'src/lib/rust/crates/bundles/fantastic-static-loader/src'
const P = 'src/lib/python/bundled_agents/loader/static_loader/src/static_loader'

export default {
  headline: 'Static loader: a roster declared in YAML',
  description: 'How the Aisixteen Fantastic static loader reads a fantastic.yaml manifest at boot, creates the declared agents as its children, re-applies them on reboot and closes the roster.',
  summary: 'A `fantastic.yaml` lists the agents; the loader creates them at the kernel’s own boot and re-applies the file on every restart.',
  cover: { clip: 'hydrate' },
  about: ['Aisixteen Fantastic', 'Declarative configuration', 'Agent roster'],
  lead: [
    'The **static loader** is an agent that builds a fixed set of agents from a YAML file. The file is a **manifest**, usually `fantastic.yaml`, and the loader reads it once, when the kernel boots it. Rust and Python do the same thing.',
    'This page covers the manifest, how its entries become agents, what a reboot does with them and what the loader refuses. How `create_agent` and boot work is in [Lifecycle](/fantastic/foundations/kernel/lifecycle/); the record each agent gets is in [Agents as records](/fantastic/foundations/kernel/records/).',
  ],
  sections: [
    {
      id: 'manifest',
      title: 'The manifest and the loader record',
      blocks: [
        'The loader is an ordinary agent with `handler_module` `static_loader.tools`. Its record has one field of its own, `manifest`, the path of the YAML file. A `manifest` that is present must be a non-empty string; anything else is refused when the record is written. Whether the file exists is only checked at boot.',
        'The command `fantastic init static_loader ./fantastic.yaml` creates this agent. It sends `create_agent` to the root with the loader’s `id` set to the bundle name, `parent_id` set to the root and the `manifest` field. `create_agent` boots the new loader, and that boot hydrates the roster.',
        'The file is a mapping with an `agents` list. Each entry is the payload of a `create_agent`, minus the parent: a `handler_module`, an `id`, and any other fields the bundle takes.',
        { code: 'agents:\n  - id: memory\n    handler_module: file_bridge.tools\n  - id: worker\n    handler_module: exec_bridge.tools\n    allowed: [\'python3 .*\']\n    can_call: {memory: [set, read]}', label: 'a manifest (illustrative ids)' },
        'The loader reads the file from the kernel’s running directory and cannot leave it. The kernel itself never parses YAML; this bundle owns the format. A file that is empty, or has no `agents` key, declares no agents. A document that is not a mapping, or an `agents` that is not a list, makes `boot` fail with an error.',
        'The loader answers two verbs. `reflect` returns its `id`, the sentence “declarative YAML roster loader”, `loader: true` and the `manifest` path. `boot` hydrates the roster.',
      ],
    },
    {
      id: 'hydrate',
      title: 'Boot: each entry becomes a child',
      blocks: [
        'For each entry in order, `boot` checks that it names a `handler_module` and an explicit `id`. Then it calls `create_agent` on the root with the entry’s fields and `parent_id` set to the loader. The declared agent is therefore a child of the loader, and the child boots inside `create_agent`.',
        'The loader does not send these calls through the [call gate](/fantastic/foundations/protocol/call-gate/). It calls the root’s `create_agent` and `update_agent` directly, as kernel bookkeeping, so the loader needs no grant on the root and holds no standing power over it. The `parent_id` is set after the entry’s fields, so an entry that names another parent still lands under the loader.',
        'Every created agent has the baseline grant `{"$self": "*"}` on both `can_call` and `callable_by`. A `can_call` or `callable_by` in the manifest is merged on top. Nothing else is granted: an edge between two roster agents needs both halves written in the manifest.',
        { video: 'hydrate' },
        'The reply lists what happened: `{"booted": true, "created": [...], "reapplied": [...]}`. Any failure while reading the manifest or applying an entry returns `{"error": "...", "booted": false}` and stops. Entries before the failing one are already applied, and the rest are not read.',
      ],
    },
    {
      id: 'reboot',
      title: 'Reboot: the manifest is the truth',
      blocks: [
        'The kernel persists the roster agents like any others. On the next start the loader boots again and finds some of the declared ids already in the tree. It does not skip them and it does not duplicate them. It re-applies the entry with `update_agent`: every declared field except `id`, `handler_module` and `parent_id` is written over the persisted record.',
        'Editing a grant in the YAML therefore changes the agent on the next boot, and the persisted record never wins over the file. These ids are listed under `reapplied`; the new ones are listed under `created`.',
        '`update_agent` replaces a named field whole, and a bare `can_call` would delete the `$self` baseline. The loader merges the declared `can_call` and `callable_by` over the baseline first, as `create_agent` does, so `$self` survives.',
        { video: 'reapply' },
        'One field cannot change. A `handler_module` is fixed when the agent is created, because the running agent’s state belongs to the old bundle. If the manifest declares a different `handler_module` for an id that already exists, `boot` fails with “a handler_module is fixed at create; delete the agent to re-declare it”.',
        'This is also why every entry needs an explicit `id`. The roster is matched by id, so an entry without one could never match the agent the last boot made. Each restart would create another agent and persist it. The loader refuses the entry instead.',
      ],
    },
    {
      id: 'closed',
      title: 'What the loader refuses, and why the roster is closed',
      blocks: [
        'The loader hydrates only on the kernel’s own boot: the cold start, or the `create_agent` that makes the loader. A `boot` sent by an agent is refused with `reason: "unauthorized"` before the manifest is read. The reason is that hydration is ungated. Any agent that could reach the loader could otherwise restore a grant the operator revoked or recreate an agent the operator deleted.',
        { code: 'static_loader: an agent-sent boot is refused — hydrating the roster is the kernel\'s own bookkeeping, so only the kernel\'s own boot (cold boot, create_agent) runs it', label: 'the refusal text' },
        'The hint says to change an agent’s record with `update_agent`, and that the operator re-boots the loader. [Refusals](/fantastic/foundations/protocol/refusals/) describes the shape.',
        'After boot, the roster agents are deny-all like any other agent. One creates agents only if it is granted `create_agent` on the root, at both ends. The manifest does not grant that, so the set of agents is fixed by the file. The closure comes from the default rule.',
        { video: 'closed' },
      ],
    },
  ],
  sources: [
    ['lib.rs: the static loader bundle (Rust)', src(`${R}/lib.rs`, 120)],
    ['lib.rs: reading and checking the manifest (Rust)', src(`${R}/lib.rs`, 68)],
    ['readme.md: manifest and init (Rust)', src(`${R}/readme.md`, 1)],
    ['tools.py: the Python loader, boot and re-apply', src(`${P}/tools.py`, 102)],
    ['tools.py: _load_manifest and validate_meta (Python)', src(`${P}/tools.py`, 65)],
    ['main.rs: the init command (Rust CLI)', src('src/lib/rust/crates/fantastic-cli/src/main.rs', 472)],
    ['dispatch.py: the init command (Python)', src('src/lib/python/kernel/modes/dispatch.py', 100)],
  ],
  clips: {
    hydrate: {
      title: 'Boot: each entry becomes a child',
      caption: 'The static_loader reads fantastic.yaml, which lists memory and worker. It creates memory first, then worker, each as its own child with the baseline $self grant, and worker’s can_call names memory. The reply lists both ids under created.',
    },
    reapply: {
      title: 'Reboot: the manifest is re-applied',
      caption: 'After a restart memory and worker already exist. The loader re-applies each entry with update_agent instead of creating it again, and merges the declared can_call over the $self baseline. The reply lists both ids under reapplied. Had the file changed worker’s handler_module, the boot would fail instead.',
    },
    closed: {
      title: 'An agent-sent boot is refused',
      caption: 'An agent that has been granted boot on the static_loader sends it, and the loader refuses with reason unauthorized before the manifest is read, even though the gate allows the call. Then worker tries create_agent on the root and is refused too, because deny-all grants it nothing. The roster stays what the file declared.',
    },
  },
}
