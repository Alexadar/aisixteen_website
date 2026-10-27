// User home store — Canvas. Facts: coder/tmp/foundations/facts/canvas_home_store.md (fantastic main 22f88cb8).
import { src } from '../lib.js'

const B = 'src/tui/bundles/fantastic-user-home-store/src'

export default {
  headline: 'The user home store: saved set-ups kept in ~/.fantastic',
  description: 'How the Aisixteen Fantastic user home store keeps saved set-ups, named agent blueprints, as private files in ~/.fantastic, and how a new AI agent is made from one.',
  summary: 'Saved set-ups: named agent blueprints in ~/.fantastic, checked on save and used to make new AI agents.',
  cover: { clip: 'blueprint' },
  about: ['Aisixteen Fantastic', 'Configuration storage', 'Agent blueprints'],
  lead: [
    'A project keeps its agents in its own `.fantastic/` folder. Some choices belong to the person instead, and should follow them from project to project, such as which model an AI agent uses. Fantastic keeps those in the user’s **home**: `FANTASTIC_HOME`, or `~/.fantastic` when it is unset.',
    'This page is about the **saved set-up**: a named blueprint for an agent, kept as one file in the home. It covers what the file may hold, how it is written and protected, and how the canvas makes an AI agent from it. The Rust CLI provides the store; the Python runtime has no twin of it.',
  ],
  sections: [
    {
      id: 'home',
      title: 'What the home holds',
      blocks: [
        'The `user_home_store.tools` bundle owns one directory of the home. Next to it sit the key refs (see the [credential store](/fantastic/foundations/agents/credential-store/)) and the stored locations of your fantastics.',
        { code: '<home>/                         0700\n  user/                         0700\n    setups/ai_agent/            0700\n      opus.yaml                 0600\n      .preferred                0600\n    keys/                       0700\n  fantastics/                   0700', label: 'the layout (opus is an illustrative name)' },
        'The binary fixes the directory when it registers the bundle. Nothing on a record can move it, so a cloned project whose record names the same bundle still gets the same store and cannot point it at another place. If neither `FANTASTIC_HOME` nor the user’s home variable is set, the store has no home, and it says which variable is missing.',
        'Who reaches the store is its `callable_by`, as for every agent. The CLI makes an agent `user_home` under `user` and grants `user` exactly `persist_record`, `forget_record`, `load_tree`, `prefer` and `reflect`. It sets that grant again on every boot, so a record on disk that widened it is narrowed. The [call gate](/fantastic/foundations/protocol/call-gate/) refuses every other caller.',
      ],
    },
    {
      id: 'blueprint',
      title: 'A blueprint, not an agent',
      blocks: [
        'A saved set-up is a `handler_module` plus that bundle’s own settings, such as a model and an endpoint. It is not an agent. It carries no identity, no per-project wiring and no authority. The store refuses a record that holds any of these fields:',
        { code: 'id  parent_id  guid  agents  memory_store_id\ncan_call  callable_by  ingress_rule  egress_rule  auth', label: 'fields a saved set-up may never carry' },
        'The refusal is `invalid_meta`, names the fields to drop, and adds the hint that the creator supplies id, parent, memory store and grants when it makes an agent from the set-up. The store keeps no key values either. A set-up may name a key by its ref (`credentials: {store, ref}`), and the value stays in the credential store.',
        'The record must also be a record the target bundle would accept. The bundle must be linked into this build. Its record schema decides which fields are required and which values an enumerated field may take. A bundle without a schema is checked by its own `validate_meta`. A record that fails the bundle’s schema is refused when saved, not when used. Other problems, such as a handler that is not an AI backend, appear when the canvas makes an agent from it.',
        { video: 'blueprint' },
      ],
    },
    {
      id: 'verbs',
      title: 'Four verbs',
      blocks: [
        { table: { head: ['verb', 'what it does'], rows: [
          ['`persist_record {name, record, if_match?}`', 'checks and writes `<name>.yaml`; answers `{name, version, path}`'],
          ['`forget_record {name, if_match?}`', 'deletes the file; answers `{name, forgotten}`; clears the default if it was this one'],
          ['`load_tree`', 'answers `{saved: [{name, version, record}], preferred, dir}`, sorted by name'],
          ['`prefer {name}`', 'writes the default’s name to `.preferred`; the set-up must exist; `{name: null}` clears it'],
        ] } },
        'A name is letters, digits, `-` and `_`, starts with a letter or digit, and is at most 64 characters, so a name is never a path. A read creates nothing: with no set-ups ever saved, `load_tree` answers an empty list and does not make the home folder.',
        'Nothing is a default until someone calls `prefer`. Deleting the `user_home` agent never deletes the files, because the set-ups belong to the user, not to the project.',
      ],
    },
    {
      id: 'private',
      title: 'Private files and lost updates',
      blocks: [
        'Directories are created `0700` and files `0600`, with that mode from the start. A write goes to a temporary file that is synced and then renamed over the target, so a reader never sees half a file.',
        'The store applies the ssh rule on every read and write. A set-up file or a directory on the path that is readable or writable by group or others is refused as `unauthorized`, and the refusal names the fix, a `chmod`.',
        'The **version** of a set-up is the first 16 hex digits of the SHA-256 of its bytes. Two running fantastics share one home, so a save can overwrite a change it never saw. Passing `if_match` with the version you read prevents that: if the file differs, the save is refused and the hint says to `load_tree` again and retry.',
        { code: 'persist_record {"name": "opus", "record": {...}, "if_match": "a1b2…"}\n→ bad_arg  arg: if_match\n  persist_record: opus changed since you read it (you had a1b2…, it is c3d4…)\n  hint: load_tree again, then retry', label: 'a stale save (illustrative versions)' },
        { video: 'guard' },
      ],
    },
    {
      id: 'use',
      title: 'From a set-up to an AI agent',
      blocks: [
        'The canvas uses the store when it makes an AI agent. The canvas’s host agent, `canvas_root` (`canvas.tools`), answers `spawn`, which is not the role registry’s `spawn`. A `spawn` names a saved set-up, or else uses the preferred one. With neither, it answers `not_found`, “no default AI set-up”, and the hint says to save one and make it the default. A set-up whose handler is not an AI backend, one whose handler’s record schema has no `memory_store_id` field, is refused with `bad_arg` at this point, not when saved.',
        'The store accepts any bundle that is linked in and passes its schema, so this check belongs to the canvas, not to the store. The agent gets the id `ai_<hex>`, made at creation. Its fields come from the set-up plus the stamp its caller supplies, and the creator adds the memory store and the grants.',
        { video: 'apply' },
        'The CLI’s own set-up flow, the wizard, saves the first set-up as the default when none is set. It also names the stored key for the endpoint, when one is stored, as `credentials` before saving. When it makes an agent from a saved set-up, it drops `handler_module` and `credentials` from the record, names the key again for the endpoint, and writes the agent under a free id (`opus`, `opus-2`, and so on).',
      ],
    },
    {
      id: 'user-store',
      title: 'The user store beside it',
      blocks: [
        'A second agent, `user_store`, is made under `user` on every boot. It reads the same home and shows what the user keeps: key refs with their hosts, the names of the saved set-ups, and the locations of stored fantastics. Each stored fantastic has a folder `<home>/fantastics/<guid or name>/fantastic.yaml` with its project path, process id and canvas URL. A switch on its record, `register_home_folder`, turns that folder on or off. The canvas places its own view of it from the double-click menu.',
      ],
    },
  ],
  sources: [
    ['lib.rs: the store, its layout and rules', src(`${B}/lib.rs`, 1)],
    ['lib.rs: persist_record', src(`${B}/lib.rs`, 248)],
    ['readme.md: the store’s own summary', src(`${B}/readme.md`, 1)],
    ['kern/saved.rs: the user_home agent and its grants', src('src/tui/src/kern/saved.rs', 1)],
    ['kern/backend.rs: spawn from a saved set-up', src('src/tui/src/kern/backend.rs', 192)],
    ['kern/wizard.rs: create and from_saved', src('src/tui/src/kern/wizard.rs', 59)],
    ['user_store.rs: the stored fantastics', src(`${B}/user_store.rs`, 1)],
    ['tests.rs: the store’s behaviour', src(`${B}/tests.rs`, 62)],
  ],
  clips: {
    blueprint: {
      title: 'A blueprint, not an agent',
      caption: 'With illustrative names, a record with a handler_module and a model also carries id ai_1 and a can_call grant. persist_record opus is refused with invalid_meta, which says to drop id and can_call. Without them the record passes the bundle’s checks, opus.yaml is written with mode 0600, and the store answers {name, version, path}.',
    },
    guard: {
      title: 'Two fantastics, one file',
      caption: 'Fantastics A and B both read opus with load_tree and get version a1b2. B saves first through a temp file and a rename, and the version becomes c3d4. A then saves with if_match a1b2, and the store refuses it with bad_arg: the file changed since A read it. The hint says to load_tree again and retry.',
    },
    apply: {
      title: 'From a set-up to an agent',
      caption: 'The saved set-ups opus and sonnet are listed by load_tree. prefer marks opus as the default. With illustrative names, a spawn that names no set-up reads the preferred one and makes the AI agent ai_3f9a1c02 with the record’s model. Its id, memory store and grants are added at creation.',
    },
  },
}
