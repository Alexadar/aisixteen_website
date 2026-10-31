// Agents › AI agent › Forking and marks. Facts: coder/tmp/foundations/facts/agents_ai_agent_forking.md
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src } from '../lib.js'

const R = 'src/lib/rust/crates/bundles/fantastic-ai-core/src'
const PY = 'src/lib/python/bundled_agents/ai/ai_core/src/ai_core'

export default {
  headline: 'Forking and marks: a new agent from a copied prefix',
  description: 'How an Aisixteen Fantastic AI agent forks: mark a turn boundary, copy the rows up to it into a new agent under the same ids, and why a warm prompt cache helps.',
  summary: 'mark a turn boundary, fork {at} copies the prefix into a new agent, and fork_points says whether the cache is still warm.',
  cover: { clip: 'fork' },
  about: ['Aisixteen Fantastic', 'Prompt caching', 'Conversation branching'],
  lead: [
    'Sometimes one conversation should become several: three reviewers that start from the same briefing, or a retry from the point before a bad turn. Starting each over would send the whole prefix to the model again, from scratch.',
    '`fork {at}` starts a new agent from the first rows of an existing one. The rows are copied byte for byte, so the model server can reuse the work it already did on them. `mark` and `fork_points` choose and list the places where a fork is allowed. This page assumes the rows and folds of [Context folding](/fantastic/foundations/agents/ai-agent/context-folding/).',
  ],
  sections: [
    {
      id: 'fork',
      title: 'fork: a copy of the prefix',
      blocks: [
        '`fork {at, name?, id?}` takes a row id, `at`, and answers `{id, copied, at}`. The new agent gets the same card as its source: handler, model, endpoint, system prompt, memory store, context settings and `can_call`. It sits beside its source, with the same parent, and is named “<source> fork” unless you pass `name`. Pass `id` to choose its agent id.',
        'The memory store is shared, but the rows are not. A store keys every row by the agent that writes it, so the copy is written as the fork, under its own key. It keeps every original row id, and the store’s `callable_by` is opened for the fork the way it is open for the source ([the call gate](/fantastic/foundations/protocol/call-gate/)). In the code’s words, “rows are never edited and the provider’s prompt cache compares bytes, not storage.”',
        { quote: 'the fork re-appends the parent’s rows under its OWN key with their original ids and hits the parent’s cache.', cite: 'fork.rs' },
        'The copy is one `append`, all or nothing. If the store refuses it, the half-made agent is deleted and its grant removed, and the refusal is `store_refused`: nothing is left behind.',
        { video: 'fork' },
        'After the copy the two agents are separate. Later rows, folds and forgets on either side never reach the other, and each new row takes a fresh id from the kernel’s counter ([State and durability](/fantastic/foundations/kernel/state/)).',
      ],
    },
    {
      id: 'points',
      title: 'Where a fork may start',
      blocks: [
        'A fork point is always the end of a finished turn, outside any fold. A **turn** here is a chain of rows linked by `parent`, and a chain whose last row is an assistant message with a pending `send` call is still owed a reply, and is not finished. `fork` judges `at` before it creates anything, and a refusal names a `reason`, the `at` it judged, and a `hint` ([Refusals](/fantastic/foundations/protocol/refusals/)).',
        { table: { head: ['reason', 'when'], rows: [
          ['`no_such_row`', 'no row of the conversation has id `at`'],
          ['`cuts_turn`', '`at` is inside a turn, or the turn ends in an assistant message with a pending `send` call'],
          ['`cuts_fold`', 'some of a fold’s members are at or before `at`, some after'],
          ['`parent_mid_turn`', 'a turn is running for the source agent'],
          ['`store_refused`', 'the store refused the copy; no agent is left'],
        ] } },
        'The check on folds follows nested folds down to their leaf rows. A fold whose members all sit at or before `at` is not cut, even when the fold row itself was appended after `at`: the fork takes it whole.',
        { h3: 'What is copied' },
        'The fork gets every conversation row with id at or below `at`, and every fold whose members all sit at or below it. It also gets the newest `view` row and the newest `anchors` row at or before `at`, because the prompt is assembled from them, so the fork’s next prompt equals its source’s for the same prefix. It does not get `pause`, `held`, `late` or `mark` rows, which are the live state of one agent: each fork writes its own marks.',
        { video: 'folds' },
      ],
    },
    {
      id: 'mark',
      title: 'mark and fork_points',
      blocks: [
        '`mark {label, note?, version?}` records the agent’s newest row as a fork point. That row is the end of the last turn, so `fork` there is accepted. The `version` is a free-form tag, for example a commit. A mark is one `mark` row that never enters the prompt, and the agent keeps its last 20: a new mark prunes the oldest in the same step.',
        'A mark is itself checked as a fork would be. It is refused as `mid_turn` while a turn runs, `open_chain` while the last chain ends in an assistant message with a pending `send` call, `in_fold` when the newest row is inside a fold, and `no_rows` on an empty conversation.',
        '`fork_points {filter?}` lists the agent’s own marks, oldest first. `filter` is `{label?, version?}`: a substring of the label, or an exact version.',
        { code: '{"points": [{"agent": "reviewer", "at": 6, "label": "briefing", "note": null,\n  "version": null, "rows_after": 4, "model": "…", "warm": true}]}', label: 'fork_points (shape, illustrative values)' },
        'Each point carries `rows_after`, the number of conversation rows after `at`, and the agent’s `model`. It also carries `warm`, which the next section explains.',
      ],
    },
    {
      id: 'warm',
      title: 'Cache lifetime and several forks',
      blocks: [
        '`warm` is true while the agent’s last send ended less than 300 seconds ago. The constant is `CACHE_LIFETIME_SECS`, and its comment calls it “how long a provider keeps a prompt prefix warm after a send ended.” The clock starts when a provider pass ends. It is an assumption of the code, not an observation: nothing reads the provider’s cache, and whether a fork hits the cache is the provider’s decision.',
        'The timestamp lives in memory. A freshly forked agent has not sent anything, so it reports `warm: false` until its first send ends, and so does every agent after a restart.',
        'To fan out, fork the same mark several times while `warm` is true, and each fork starts from the same rows, with the same ids and content, that the model server has, by the code’s assumption, just processed. A test forks one mark twice and compares the two stores row for row.',
        { video: 'warm' },
        'The branches can come from another agent. `fork {from: {agent, at}}` sends the same verb to that agent as a gated send ([send](/fantastic/foundations/protocol/messages/)). In the `agentic_resources` bundle, `spawn {role, from: {agent, at}}` forks `agent` at `at` and applies a role card over the copy. The caller must hold `fork` on the source or the spawn is refused `not_allowed`.',
      ],
    },
    {
      id: 'both',
      title: 'Rust and Python',
      blocks: [
        'The Rust runtime (`fork.rs`) and the Python runtime (`core.py`) implement the same rules. They share the fork check, the rows left out of a copy, the limit of 20 marks and the 300-second window.',
      ],
    },
  ],
  sources: [
    ['fork.rs: fork, mark, fork_points (Rust)', src(`${R}/fork.rs`, 182)],
    ['the fork check, `_fork_plan` (Python)', src(`${PY}/core.py`, 5223)],
    ['MAX_MARKS and CACHE_LIFETIME_SECS', src(`${R}/constants.rs`, 188)],
    ['the verb descriptions', src(`${R}/verbs.rs`, 62)],
    ['when the send clock is set', src(`${R}/agent_loop.rs`, 351)],
    ['tests: two forks of one mark', src(`${R}/tests_fork.rs`, 642)],
    ['spawn from a fork point (Rust)', src('src/lib/rust/crates/bundles/fantastic-agentic-resources/src/lib.rs', 893)],
  ],
  clips: {
    fork: {
      title: 'fork: a new agent on the same prefix',
      caption: 'mark labels a turn boundary. fork at row 5 is refused with cuts_turn; fork at 6 starts a new agent with a copy of rows 1 to 6 under its own key, with the same ids, so its first prompt has the parent’s bytes. After that the two histories diverge.',
    },
    folds: {
      title: 'fork and folds: whole or refused',
      caption: 'The parent has rows 1 to 8, a fold 9 over rows 2 and 3, and a fold 10 over rows 6 and 7. fork at 6 is refused with cuts_fold, because fold 10 has members 6 and 7, one at or before row 6 and one after it. fork at 4 copies rows 1 to 4 and fold 9 whole, and leaves fold 10 behind.',
    },
    warm: {
      title: 'warm: fork while the prefix is cached',
      caption: 'A send ends and fork_points reports warm: true for the mark at row 6. Three forks of that mark start from the same rows 1 to 6 within the window. After 300 seconds without a send, fork_points reports warm: false.',
    },
  },
}
