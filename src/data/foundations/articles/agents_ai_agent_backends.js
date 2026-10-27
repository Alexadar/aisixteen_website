// Model backends — Agents › AI agent. Facts: coder/tmp/foundations/facts/agents_ai_agent_backends.md
import { src, tree } from '../lib.js'

const B = 'src/lib/rust/crates/bundles'
const P = 'src/lib/python/bundled_agents/ai'

export default {
  headline: 'Model backends: five transports, one agent surface',
  description: 'How Aisixteen Fantastic runs one AI agent on Anthropic, vLLM, Ollama, OpenAI Responses or Apple Foundation Models: raw text streams, caching modes and transport retries.',
  summary: 'Five providers behind one raw-text seam; provider_cache only on Anthropic; transport_retries re-run a dropped link.',
  cover: { clip: 'surface' },
  about: ['Aisixteen Fantastic', 'LLM backends', 'Prompt caching', 'Retries'],
  lead: [
    'An AI agent does not know which model it talks to. Its record names a **backend**, a bundle that turns the conversation into one request to a provider and streams text back. Fantastic ships five: `anthropic_backend`, `vllm_backend`, `ollama_backend`, `responses_backend` and `foundation_models_backend`.',
    'This page covers what the five share, what each one adds, the three `caching` modes and the `transport_retries` setting. Folds, the history and marks are on [Context folding](/fantastic/foundations/agents/ai-agent/context-folding/) and [Forking and marks](/fantastic/foundations/agents/ai-agent/forking/).',
  ],
  sections: [
    {
      id: 'surface',
      title: 'One surface, five providers',
      blocks: [
        'The shared code is **ai-core**. It owns the verbs (`send` and the rest), the per-client history, the FIFO lock that serializes callers, prompt assembly and the status events. A backend supplies only a **provider**: messages in, content tokens out.',
        { quote: 'A provider is a PURE RAW-TEXT streamer: it takes plain chat messages (role system/user/assistant/…, text content) and yields content tokens', cite: 'provider.rs' },
        'No backend uses a provider’s native tool API. The model writes its `<call name=…>` envelope as plain text, the provider streams that text through without reading it, and ai-core parses and routes it. Adding a provider therefore teaches it nothing about tools. A provider holds no agent state; its one protocol duty is to wrap the model’s reasoning channel in `<think>…</think>` once per turn, so a reasoning model’s turn does not read as empty.',
        { video: 'surface' },
        'Every backend answers the same verbs because each one’s verb list starts from ai-core’s (Anthropic and vLLM add `usage`; Anthropic also adds `usage_reset` and `models`). `send` runs one turn on `text` and returns `{response, final, client_id}`. The call gate, refusals and ledger work as on any other agent; see [The call gate](/fantastic/foundations/protocol/call-gate/).',
        'Rust ships all five backends. Python ships four: it has no Foundation Models backend, because that one is Apple-only native code.',
      ],
    },
    {
      id: 'transports',
      title: 'What each backend adds',
      blocks: [
        { table: { head: ['backend', 'request', 'record fields it requires', 'key'], rows: [
          ['`anthropic_backend`', '`POST` to the Messages URL, SSE', '`endpoint`, `model`', 'optional `credentials`, sent as `x-api-key`'],
          ['`vllm_backend`', '`POST {endpoint}/chat/completions`', '`endpoint`, `kv_overflow`', 'optional `credentials`, sent as Bearer'],
          ['`ollama_backend`', '`POST {endpoint}/api/chat`, line-delimited JSON', '`endpoint`', 'optional `credentials`, sent as Bearer'],
          ['`responses_backend`', '`POST` to the full `…/v1/responses` URL, SSE', '`endpoint`, `model`, `credentials`', 'required, sent as Bearer'],
          ['`foundation_models_backend`', 'one on-device request', 'none', 'none: a `credentials` field is refused'],
        ] } },
        'Where a field can be read from the server, the backend reads it before a turn and writes it into the record: `max_tokens` and `context_window` from the API for Anthropic, the served `model`, `max_tokens`, `context_window` and `kv_slots` for vLLM, and the `model` from `GET /api/tags` for Ollama. A key is read from a credential store at each request and sent only to the ref’s host; the record holds the name, never the secret ([Security](/fantastic/foundations/protocol/security/)).',
        { h3: 'Anthropic' },
        'One top-level `system` string joins every system message, and consecutive turns of one role are merged. `max_tokens` goes on every request because the API requires it. With `thinking_budget` set (at least 1024, below `max_tokens`) the thinking streams first, wrapped in `<think>`. A stream that ends without `message_stop` did not finish, and an `error` event is raised with the API’s own type and message. The agent also counts tokens, side calls included, in its own `usage.json`; the `usage` and `usage_reset` verbs read and zero them, and `models` lists what the key can use.',
        { h3: 'vLLM' },
        'The backend talks to the server directly, with no proxy. It reads both `delta.reasoning_content` and `delta.content`, since reading `content` alone drops whole turns of a reasoning model. It sends one system message, at index 0. A stream that ends with no `finish_reason` is an error, never a completion. `server_dialect` (`vllm`, `strata` or `llamacpp`) says how the server names its thinking budget and is set, never guessed.',
        'vLLM also gets a **session table** per endpoint. `kv_slots` is how many conversations may be live there, and `kv_overflow` decides what happens when all are: `evict` rotates the least-recently-used conversation out, `reject` refuses the newcomer with `KvSlotsFull`. A slot frees itself after `kv_ttl` idle seconds (default 1800). The code calls this bookkeeping: it frees no GPU memory and sees only this kernel’s traffic. A side call, such as a fold summary, takes no slot.',
        { h3: 'Ollama' },
        'The backend reads both the `thinking` and the `content` field of each line and wraps the thinking in `<think>`. Optional fields include `num_ctx`, `num_predict`, `think` and `stream_idle_seconds`. A non-2xx answer fails the turn as `<error> (status code: n)`.',
        { h3: 'OpenAI Responses' },
        'The backend is stateless: `store:false`, and the whole conversation goes with every pass, as `instructions` plus typed message items. It guesses no host and no model, and `credentials` is required. A `function_call` item in the output is a loud error, because tools are never native. `max_tokens` is sent as `max_output_tokens` and defaults to 8192.',
        { h3: 'Apple Foundation Models' },
        'The on-device system model runs through a Swift core linked into the Rust crate. A record that names `endpoint`, `model` or `credentials` is refused at the write, since none of them means anything here. The context window is the model’s own, and a record may name only a smaller one. If the model is unavailable, the turn fails loud, naming why (device not eligible, Apple Intelligence not enabled, model not ready, or not macOS 26+). It is checked first in the turn, and nothing falls back to another backend. The backend is registered on every platform, and the failure appears when an agent uses it.',
      ],
    },
    {
      id: 'caching',
      title: 'Caching modes',
      blocks: [
        'The `caching` field decides how the model’s view of the history is built. `cleanup` is the default.',
        { table: { head: ['mode', 'the view'], rows: [
          ['`none`', 'every stored row, in order, never trimmed'],
          ['`cleanup`', 'superseded whole-state reads, repeated reply bodies and used docs drop out; no markers'],
          ['`provider_cache`', '`none`’s history plus two markers: the end of the **primer** row (`cache_primer_until`) and the end of the last fold or clear row'],
        ] } },
        'ai-core only flags the two messages. The backend turns the flags into its own markers, and only in `provider_cache`. Anthropic is the only backend that declares it. It sends ephemeral `cache_control` markers on the system block, on the block that ends the primer row, on the block that ends the last fold, and one top-level automatic marker: at most four. In every other mode the body carries none.',
        { video: 'caching' },
        'A backend that cannot cache refuses the mode, at the write and again at the turn.',
        { code: 'responses_backend cannot do provider caching: caching=provider_cache is refused — use none or cleanup', label: 'the refusal at the write (vLLM, Ollama, Responses and Foundation Models say the same with their own name)' },
        'The primer row and every row before it are pinned in any mode: `context_fold` will not fold a range that starts at or before it. Why old bytes never move, and how folds use this, is on [Context folding](/fantastic/foundations/agents/ai-agent/context-folding/).',
      ],
    },
    {
      id: 'retries',
      title: 'Transport retries',
      blocks: [
        'Each provider error carries a `transport` flag. It is true when the failure is the link, not the model or the request: a connect failure, a stream that stalls or drops, or a transient gateway error. A stalled stream is detected by the **idle clock**, `stream_idle_seconds` (default 60), which covers the response headers and every read of the body.',
        'The record field `transport_retries` is an int from 0 to 5, and 0 is the default, which means off. When a pass fails with a transport error and retries remain, ai-core stores a notice row, emits a `status` event with phase `retrying`, waits, and runs the pass again.',
        { code: '[retry 1/2] the link dropped (<message>) — retrying the turn\nstatus: {phase: "retrying", detail: {attempt: 1, of: 2, error: "<message>"}}', label: 'what each retry leaves (message illustrative)' },
        { video: 'retries' },
        'The wait doubles: 2 s, 4 s, 8 s and so on. The notice row is stored in the history, so the model reads it on the next pass and the operator sees it. A `cancel` that lands during the wait ends the turn. A failure that is not a transport failure, or a transport failure after the last retry, ends the turn with the error as usual. Rust and Python do the same.',
        { h3: 'What each backend calls a transport failure' },
        { table: { head: ['backend', 'retried by transport_retries'], rows: [
          ['`anthropic_backend`', 'connect failure or timeout, a dropped stream, HTTP 502, 503, 504 and 529'],
          ['`vllm_backend`', 'a stall, a dropped stream, HTTP 502, 503 and 504'],
          ['`ollama_backend`', 'a failed request, a stall or a broken stream; an HTTP error status is not retried'],
          ['`responses_backend`', 'a failed request, and HTTP 502, 503 or 504 once its own retries are spent'],
          ['`foundation_models_backend`', 'none: the code marks no failure as a link failure'],
        ] } },
        'The Responses backend has a retry of its own, below this one. A 502, 503, 504 or 520 to 524 whose body is not JSON, which is a CDN or proxy error page, is retried twice inside the request, waiting 1.5 s times the attempt number. A 4xx, or a 5xx with a JSON body, stays loud.',
        { note: 'The field’s hint lists 502, 503 and 504. The Anthropic code also treats 529 (overloaded) as transport, so this page follows the code.' },
      ],
    },
  ],
  sources: [
    ['The provider seam: provider.rs', src(`${B}/fantastic-ai-core/src/provider.rs`, 1)],
    ['The caching modes: caching.rs', src(`${B}/fantastic-ai-core/src/caching.rs`, 1)],
    ['The retry loop: verbs.rs', src(`${B}/fantastic-ai-core/src/verbs.rs`, 1288)],
    ['transport_retries in the record schema', src(`${B}/fantastic-ai-core/src/schema.rs`, 195)],
    ['anthropic_backend (Rust)', src(`${B}/fantastic-anthropic-backend/src/lib.rs`, 1)],
    ['vllm_backend (Rust) and its session table', src(`${B}/fantastic-vllm-backend/src/lib.rs`, 136)],
    ['The Responses backend’s own retry', src(`${B}/fantastic-responses-backend/src/lib.rs`, 62)],
    ['The Python backends', tree(P)],
  ],
  clips: {
    surface: {
      title: 'Five backends, one agent surface',
      caption: 'An agent sends send to ai-core. ai-core hands the messages to the agent’s backend: anthropic, vllm, ollama, responses or foundation_models, each with its own wire (/v1/messages, /chat/completions, /api/chat, /v1/responses, or on-device). The backend streams raw text back, a <call> in it is parsed by ai-core, and the call is routed the same way for every provider.',
    },
    caching: {
      title: 'caching: one history, three views',
      caption: 'Rows 1 to 6 are stored, and row 5 is a fold. none sends all six. cleanup drops rows 3 and 4 from the view. provider_cache sends all six with a marker after the primer row (2) and one at the last fold (5). Only anthropic turns the markers into cache_control; vllm, ollama, responses and foundation_models refuse the mode.',
    },
    retries: {
      title: 'transport_retries: a visible retry',
      caption: 'With transport_retries: 2, pass 1 fails with HTTP 503. A notice row “[retry 1/2] the link dropped” is stored, a retrying status goes out, and after 2 s pass 2 runs. It fails too: notice row 2 of 2, a 4 s wait, and pass 3 succeeds. With the budget spent, the next failure would end the turn.',
    },
  },
}
