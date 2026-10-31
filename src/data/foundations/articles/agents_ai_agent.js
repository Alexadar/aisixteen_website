// Agents › AI agent. Facts: coder/tmp/foundations/facts/agents_ai_agent.md (fantastic main 16d36778).
import { src, tree } from '../lib.js'

const CORE = 'src/lib/rust/crates/bundles/fantastic-ai-core/src'
const PY = 'src/lib/python/bundled_agents/ai/ai_core/src/ai_core'

export default {
  headline: 'The AI agent: one pass, one chain, history as rows',
  description: 'How an Aisixteen Fantastic AI agent runs: one pass behind a provider seam, a prompt built from the live tree, tools written as text calls, a chain of passes, history as rows, pause and resume.',
  summary: 'One pass behind a provider seam, tools written as text calls, a chain that ends with done, history as rows, pause and resume.',
  cover: { clip: 'chain' },
  about: ['Aisixteen Fantastic', 'LLM agents', 'Tool calling', 'Agent loop'],
  lead: [
    'An **AI agent** is an ordinary agent whose handler talks to a language model. It is the shared crate `ai_core`, in Rust and in Python, behind a small interface called a provider. A backend such as ollama, vllm, responses or anthropic supplies only that provider.',
    'This page follows what happens when a message reaches an AI agent: the prompt it builds, the one pass it runs, the calls the model writes, the chain that continues from their replies, the rows it leaves behind, and the verbs that pause it. Three parts have their own pages: [Context folding](/fantastic/foundations/agents/ai-agent/context-folding/), [Forking and marks](/fantastic/foundations/agents/ai-agent/forking/) and [Model backends](/fantastic/foundations/agents/ai-agent/backends/).',
  ],
  sections: [
    {
      id: 'pass',
      title: 'One pass behind a provider seam',
      blocks: [
        'Each `send` to an AI agent runs exactly one **pass**: it assembles the prompt, fits it to the context window, streams the model’s tokens, and appends the turn to the agent’s history. The code says so itself: “ONE provider pass per `send`.”',
        'The **provider** is the only part that knows a vendor. It takes plain chat messages (a role and text) and yields text tokens. It does no tool calling, holds no agent state, and never uses a vendor’s native tool interface. Its one protocol duty is the reasoning channel: it wraps a reasoning model’s deliberation in `<think>` and `</think>` once per turn, so a turn that is all thinking is not read as empty.',
        { list: [
          '`chat(messages, max_tokens)` streams the completion as tokens.',
          '`model()` names the upstream model.',
          '`ready()` can refuse the turn up front, before anything is assembled.',
          '`report()` returns what the endpoint reported about the pass, such as its own prompt-token count.',
        ] },
        'A pass runs its steps in a fixed order: the provider’s `ready()` check, the caching-mode check, any recall owed from the last fold, prompt assembly, context projection, and only then `chat`. A failure at any step ends the turn with a reason instead of a half answer. The two runtimes agree on this contract; the Rust crate is a port of the Python `ai_core`, which its comments call canonical.',
        { video: 'pass' },
      ],
    },
    {
      id: 'prompt',
      title: 'The prompt is built from the live tree',
      blocks: [
        'The default system block is three parts joined by blank lines: `{tree}`, `{self}` and `{howto}`. `{tree}` is the kernel’s primer, a flat list of agent ids and the bundle names. `{self}` is the agent’s own identity: its `id`, `description`, `memory_store_id`, `can_call` and `callable_by`. `{howto}` is fixed text that teaches the call envelope, grants, replies and the context window.',
        'Nothing in the block lists other agents’ verbs. To learn what a target answers, the model sends `kernel` a `docs` with `<of>` naming the agent. That reply is transient: after the model’s next message it shrinks to a one-line stub.',
        'The block states the mechanism and no strategy. The source comment is explicit that the default prompt says nothing about looping, orienting, iterating or finishing, and a test pins it. A record can replace the block with its own `system_prompt`, or a file named by `system_prompt_file`; a `send` can replace it for one delivery. The first of those that is set wins, and the placeholders above are filled in whichever block is used. `pre_system_prompt` and `post_system_prompt` on the record wrap it without replacing anything.',
        'Everything after the block is the conversation: the rows in the agent’s store, shaped to a view that fits the window ([Context folding](/fantastic/foundations/agents/ai-agent/context-folding/)).',
      ],
    },
    {
      id: 'tools',
      title: 'Tools are verbs, written as text',
      blocks: [
        'A model calls an agent by writing a `<call>` element in its answer: one child tag per argument, no JSON, no escaping. `<target_id>` names the agent, `<type>` is the verb, and every other child is an argument. This is the only envelope the parser reads.',
        { code: '<call name="send">\n<target_id>notes</target_id>\n<type>read</type>\n<path>todo.md</path>\n</call>', label: 'a call (illustrative ids)' },
        'It is the same `{target, payload}` item that [every message](/fantastic/foundations/protocol/messages/) carries, written as text. So an AI agent has no tool list of its own: its tools are the verbs of every agent it may reach. Four call names parse: `send`, `done`, `await` and `inquiry_answer`. The last three are control calls, not dispatches.',
        'The calls run as the agent, so the [call gate](/fantastic/foundations/protocol/call-gate/) decides each one. The prompt tells the model to read its `can_call` before the first call, because a call outside it is refused and costs a turn.',
        'Only the answer acts. A `<call>` written inside thinking never runs, and thinking is stripped before the turn is stored. A pass that stops with a call still open dispatches nothing at all, even its closed calls, and leaves a marker row in place of a half answer.',
      ],
    },
    {
      id: 'chain',
      title: 'The loop is a chain of passes',
      blocks: [
        'No code loops inside a pass. The loop is a **chain**: after a pass, the router dispatches every call the model wrote in one batch, and the calls run concurrently. Everything owed to one destination comes back as one message, one block per call, each headed by its pid:',
        { code: '[reply to 1042 · notes read · 1 of 2 in batch b7]\n…\n[reply to 1043 · notes list · 2 of 2 in batch b7]\n…', label: 'a reply batch, abridged (illustrative pids and batch token)' },
        'The model never sees half a batch. `reply_to` decides where a reply goes: back to the caller by default, another agent’s id, or `null` to discard it. When the batch lands on the agent itself, that is the next pass, and the chain goes on when a reply batch lands on the agent, or when the router sends a reminder (below).',
        { video: 'chain' },
        { h3: 'How a chain ends' },
        { list: [
          '`done` ends it explicitly. Nothing runs and nothing reminds.',
          '`await` stops until something lands. Status ends with `reason: awaiting` and the `pending` count. With nothing in flight it ends the chain and stores a note, `nothing_to_await`.',
          'A turn with no calls dispatched ends it only after the reminders run out (below).',
        ] },
        'A turn that dispatches no call at all is not the end. The router stores a reminder, `[no call was dispatched]`, and the agent runs again. A turn that was only thinking has its answer discarded and never stored (the incoming row stays), and gets an extra line saying so. The second silent turn in a row escalates the reminder.',
        'Ten silent turns in a row end the chain with status `done`, `reason: gave_up`. The record field `misfire_limit` replaces the ten. Any call resets the count, `done` and `await` included.',
        { video: 'nudge' },
        '`cancel` ends a runaway chain like any other task ([Tasks and waiting](/fantastic/foundations/kernel/tasks/)).',
      ],
    },
    {
      id: 'rows',
      title: 'History is rows in a store',
      blocks: [
        'The conversation is never kept in the agent. It lives in the **memory store** the record names with `memory_store_id`, one row per message, under the agent’s own key. A turn adds two rows: the incoming message, `{role: "user", content, id, parent}`, and the answer, `{role: "assistant", content, id, parent}` with the thinking removed.',
        'Row ids come from the kernel’s counter ([State and durability](/fantastic/foundations/kernel/state/)), minted at the moment of the append. An id therefore orders rows in time, and after a restart the conversation comes back in the order it was lived. When the incoming message is a reply batch, its `parent` is the turn named by the `↑N` on its first tag.',
        'Writes go to the store first and into the agent’s in-memory head only when the store took them. The head is the rows since the last `clear`, read once on the first turn after boot. No store named means the agent fails loud at boot and on its first turn; nothing falls back to RAM. A store that refuses mid-turn fails the turn.',
        'Large reply bodies are held in memory for this run only. The store keeps the reply’s `origin` line, how to get it again, so after a restart the model re-reads instead of remembering. Memory stores, their verbs and their durability are on [their own page](/fantastic/foundations/agents/memory-stores/).',
      ],
    },
    {
      id: 'pause',
      title: 'pause and resume',
      blocks: [
        '`pause {reason?}` stops the generation in flight and then holds every message sent to the agent, in order, in its store. It returns `{paused: true, held: 0}`. Pausing twice is a no-op.',
        'While the agent is paused, each `send` is appended as a `held` row and answers `{held: <n>, paused: true}`. Nothing runs and nothing is dropped.',
        '`resume {note?}` writes one `resume` row, `[resumed after a pause of 42s]` plus the note, then releases the held messages as a kernel task, one after another, each as a fresh turn in arrival order. It returns `{resumed: true, released: <n>}`; when the agent is not paused it returns `{resumed: false, released: 0}`.',
        { video: 'pause' },
        'The pause state is rows too. The last `pause` or `resume` row decides, and the `held` rows after the last `resume` are the queue. A restart reads them back from the head, so a paused agent stays paused with its queue intact.',
      ],
    },
    {
      id: 'sends',
      title: 'Sends, queues and status',
      blocks: [
        '`send {text, client_id?, system_prompt?, send_to?}` runs a turn. A lock lets one generation run at a time; a caller who waits gets a `status` event with `phase: queued` and the number ahead. If the model made no call of its own, `send_to` hands the pass’s text to another agent once, without propagating.',
        'An agent has one chain at a time. A message that lands while its chain is alive is stored as a row and read by the chain’s next pass, and its sender gets the answer of the pass that read it. A message the agent sends to itself is its own chain turn and is never held.',
        '`stop` closes the provider stream, aborts the open parts and leaves a `[stopped by <caller>]` marker. There is no `interrupt` verb: a `send` is a kernel task, so `cancel` ends it, and the agent’s cancel hook closes the turn out with `status` `done` and `reason: cancelled`.',
        { h3: 'status' },
        'The `status` verb answers `{source, client_id, generating, current, mine_pending, others_pending}`. With a `client_id` it shows that client’s own queue entries and in-flight text in full; other clients collapse to a count, and without a `client_id` all text is redacted. It has no `paused` field.',
        'The same transitions also stream as events: `queued`, `thinking`, `streaming`, `retrying` and `done`. A `done` carries a reason (for example `ok`, `cancelled`, `timeout`, `error`, `awaiting`, `nothing_to_await`, `dead_turn`, `gave_up`) and the token counts, `prompt_tokens`, `completion_tokens`, `gen_seconds` and `context_window`. The counts are the endpoint’s own, or an estimate flagged `…_estimated`.',
      ],
    },
  ],
  sources: [
    ['ai_core: the crate overview and verbs', src(`${CORE}/lib.rs`, 1)],
    ['the provider seam', src(`${CORE}/provider.rs`, 1)],
    ['one pass: run_generation', src(`${CORE}/agent_loop.rs`, 173)],
    ['prompt assembly and the how-to text', src(`${CORE}/assembly.rs`, 81)],
    ['the call envelope and its four names', src(`${CORE}/tool_parse/grammar.rs`, 50)],
    ['routing, done, await and the no-call reminder', src(`${CORE}/route.rs`, 961)],
    ['pause and resume', src(`${CORE}/pause.rs`, 1)],
    ['the Python ai_core', tree(PY)],
  ],
  clips: {
    pass: {
      title: 'One pass: rows and a prompt in, a stream out',
      caption: 'A send reaches the AI agent. The system block (tree, self, how-to) and the rows from its memory store go to the provider. Tokens stream back. The agent appends two rows, the incoming message and the answer.',
    },
    chain: {
      title: 'A chain is passes joined by replies',
      caption: 'Pass 1 writes two calls. They run concurrently and come back as one reply batch addressed to the agent. That starts pass 2, which writes done, and the chain ends.',
    },
    nudge: {
      title: 'A turn with no call is reminded',
      caption: 'The agent answers with prose and no call. The router stores a reminder and the agent runs again. Ten silent turns in a row end the chain with gave_up; a done call ends it at once.',
    },
    pause: {
      title: 'pause holds, resume releases in order',
      caption: 'pause stops the generation and writes a pause row. Two sends arrive and become held rows. resume writes a resume row and releases both, in order, each as a fresh turn.',
    },
  },
}
