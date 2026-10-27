// Credential store — Agents. Facts: coder/tmp/foundations/facts/agents_credential_store.md (fantastic main 16d36778).
import { src, tree } from '../lib.js'

export default {
  headline: 'The credential store: secrets by reference, bound to a host',
  description: 'How the Aisixteen Fantastic credential store declares a ref with one host, hands its value out only for that host, and keeps it in a file, the OS keychain or the environment.',
  summary: 'Declare a ref and its host, set the value, read it per request; file, keychain or env.',
  cover: { clip: 'backends' },
  about: ['Aisixteen Fantastic', 'Secrets management', 'Credentials'],
  lead: [
    'An agent that calls a model API needs a key, but the key does not belong in the agent’s record. The **credential store** keeps it somewhere else. The record names the store and the ref (`credentials: {store, ref}`), never the value; the store hands the value out when asked, and only for the host the key belongs to.',
    'This page follows one key through the store: how its ref and host are declared, how a consumer reads it on every request, and where its value rests. For the idea of credentials by reference within the whole security model, see [Security](/fantastic/foundations/protocol/security/).',
  ],
  sections: [
    {
      id: 'ref',
      title: 'A ref, its host and its value',
      blocks: [
        'A credential is a **ref** such as `openai/main`. It holds named **fields** (`api_key`) and is bound to one **host**. The store is an agent like any other, so its refs live on its own record under `refs`, and the verbs below are verbs on that agent.',
        { table: { head: ['verb', 'what it does'], rows: [
          ['`set {ref, fields}`', 'stores or rotates the value of a declared ref; takes no `host`'],
          ['`get {ref, host?}`', 'answers `{ref, host, fields}`; a `host` that is not the ref’s is refused'],
          ['`list`', 'the declared refs: ref, host and field names, never a value'],
          ['`forget {ref}`', 'drops the value and keeps the declaration'],
        ] } },
        'The host is not an argument of `set`. Only `update_agent` on the store’s own record declares a ref, and it writes the whole `refs` map, so it must repeat every ref you keep. Each ref must carry a `host`; without one the write is refused with “the one host this ref’s value may be sent to”.',
        'A `set` that names a host is refused with `bad_arg`. A `set` for a ref nobody declared answers `no such ref`. When a `set` succeeds, the store writes `{host, fields}` to its backend, with the host taken from the declaration, and puts only the sorted field names back on the record.',
        { code: 'update_agent creds  refs: {"openai/main": {"host": "api.openai.com"}}\nset {"ref": "openai/main", "fields": {"api_key": "…"}}\n→ {"ref": "openai/main", "host": "api.openai.com", "fields": ["api_key"], "stored": true}', label: 'declare, then set (illustrative ids)' },
        { video: 'declare' },
        'A host is compared after normalising: a URL is cut to its `host[:port]` and the text is lowercased. A `get` may therefore pass the full endpoint URL, not just a bare host.',
      ],
    },
    {
      id: 'read',
      title: 'Read on every request',
      blocks: [
        'A consumer names its key on its own record as `credentials: {store, ref}`. An AI backend reads it before every request: it sends the store `get` with the `ref` and the endpoint it is about to call as `host`. The read is that agent’s own send, so the [call gate](/fantastic/foundations/protocol/call-gate/) applies to it like any other: the agent’s `can_call` must name the store, and the store’s `callable_by` must name the agent.',
        'The store answers only if the endpoint’s host is the one the ref is bound to. Otherwise it refuses, “ref is bound to host … refused, nothing read”, and the request does not go out. Nothing is cached, so a key rotated with one `set` is used by the next request, with no restart.',
        { code: 'get {"ref": "openai/main", "host": "https://evil.example/v1"}\n→ credential_store: ref \'openai/main\' is bound to host \'api.openai.com\',\n  not \'evil.example\' — refused, nothing read', label: 'the refusal (illustrative hosts)' },
        'A `forget` drops the value and leaves the ref declared, so the next `get` answers `not_found`: the ref “has no value in the backend”. A `set` stores a value again. A ref is declared and removed through `update_agent` on the store’s record, which writes the whole refs map.',
        { video: 'rotate' },
        'A record with no `credentials` has no key. That suits a local server that needs none. A backend that cannot run without a key marks the field required and refuses a record that lacks it. A key that cannot be sent as an HTTP header (a control or non-ASCII character, or whitespace at an edge) is refused too, and the refusal names the ref, not the value.',
      ],
    },
    {
      id: 'rest',
      title: 'Where the value rests',
      blocks: [
        'The `backend` field on the store’s record chooses where values rest. It must be `file`, `keychain` or `env`; the default is `file`.',
        { table: { head: ['backend', 'how it holds a value'], rows: [
          ['`file` (default)', 'one YAML file, `{refs: {ref: {host, fields}}}`, at `<home>/user/credentials/<store id>.yaml`, or at an absolute path in `file`'],
          ['`keychain`', 'one item per ref in the OS keychain: service `keychain_namespace` (default `fantastic`), account `<store id>/<ref>`, the item holding `{host, fields}` as JSON'],
          ['`env`', 'read-only: each ref maps its fields to environment variables, `{host, env: {api_key: VAR}}`'],
        ] } },
        { h3: 'The file' },
        'The home is `FANTASTIC_HOME`, or `~/.fantastic` when it is unset. A `file` must be absolute (`/…` or `~…`); a relative path is refused when the record is written. The store writes the file with mode 0600.',
        'It reads the file only if it is a regular file owned by this user with no group or other permission bits. The check runs on the one open the data is read from (`O_NOFOLLOW`, then `fstat` of that descriptor), so the file cannot be swapped between the check and the read. Anything else is refused with “refused, nothing read”.',
        { h3: 'The keychain' },
        'The Python runtime reaches the keychain through the `keyring` package. The Rust runtime uses the macOS and iOS Keychain and the Windows Credential Manager. On any other operating system, a Rust call fails with “the keychain backend has no OS keychain … choose backend file or env”.',
        { h3: 'The environment' },
        'The `env` backend keeps no value at rest, so `set` and `forget` are refused as read-only. A `get` reads the variables the ref names, and fails if one is unset or empty. The ref’s declared host still pins every read.',
        { video: 'backends' },
        'File and keychain store the host beside the value. A stored value whose host differs from the declaration, or that has none, is refused with the same host-mismatch answer. A store elsewhere that declares the same id and ref with another host therefore reads nothing from it.',
      ],
    },
    {
      id: 'who',
      title: 'Who may ask, and what is recorded',
      blocks: [
        'A store has no per-ref access lists. Any caller the call gate admits may `set`, `get` or `forget` a declared ref, so grant a caller access to the store narrowly, for example `["get"]` for a backend that only reads. The store’s guidance is not to give a credential to an AI agent’s prompt, and to give it to a bundle that sends it.',
        'The value rides the call, so the kernel records it as `[secret]`. The field values of a `set` payload and of a `get` reply show `[secret]` in the ledger, the memory store and the state stream, while the caller receives the value whole. A `list` shows refs, hosts and field names only. Across connected kernels, the calling side marks the values as secret too.',
      ],
    },
    {
      id: 'app',
      title: 'In the fantastic app',
      blocks: [
        'The `fantastic` app keeps all provider keys in one store agent with the id `credentials`. Its backend follows the user’s key mode: **plain** is the `file` backend, one 0600 file in the user’s home; **secure** is the `keychain` backend. Until a mode is chosen there is no store and no key can be stored, and the mode cannot change while keys are stored under the other one.',
        'A key’s ref is `<provider>/<host>`, for example `responses/api.openai.com`. The app declares the ref on the store, then sends `set` with the key marked secret. It then grants the AI agent `get` on the store and the store’s `callable_by` the agent, which are the two ends the call gate needs.',
      ],
    },
  ],
  sources: [
    ['credential_store readme', src('src/lib/rust/crates/bundles/fantastic-credential-store/src/readme.md', 1)],
    ['credential_store (Rust)', src('src/lib/rust/crates/bundles/fantastic-credential-store/src/lib.rs', 1)],
    ['credential_store (Python, canonical)', src('src/lib/python/bundled_agents/security/credential_store/src/credential_store/tools.py', 1)],
    ['the Rust keychain, by OS', src('src/lib/rust/crates/bundles/fantastic-credential-store/src/sys/keychain.rs', 1)],
    ['how an AI backend reads its key', src('src/lib/rust/crates/bundles/fantastic-ai-core/src/credentials.rs', 154)],
    ['the credential store test spec', src('contract/agentic/specs/credential_store.yaml', 1)],
    ['the app’s key handling', src('src/tui/src/kern/keys.rs', 1)],
    ['the app’s key modes', src('src/tui/bundles/fantastic-user-home-store/src/secrets.rs', 1)],
  ],
  clips: {
    declare: {
      title: 'Declare, then set',
      caption: 'The store creds starts with an empty record. update_agent declares the ref openai/main with the host api.openai.com. A set that names a host is refused with bad_arg: set takes no host. A set with fields stores the value at rest beside the declared host, and the record gains only the field name api_key.',
    },
    rotate: {
      title: 'Read on every request',
      caption: 'An AI agent sends get with the ref and the host it is about to call, and the store answers key-A, which is sent to api.openai.com. One set stores key-B, and the next request carries key-B with no restart. forget drops the value and keeps the ref declared, so the next get answers not_found.',
    },
    backends: {
      title: 'Where the value rests',
      caption: 'The file backend holds a YAML file at <home>/user/credentials/<id>.yaml, mode 0600. The keychain backend holds one item per ref, service fantastic, account <id>/<ref>. The env backend holds nothing: the ref names a variable. File and keychain take set, get, list and forget; env takes get and list.',
    },
  },
}
