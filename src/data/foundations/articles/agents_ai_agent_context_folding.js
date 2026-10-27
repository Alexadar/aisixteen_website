// Agents › AI agent › Context folding. Published. Refreshed against fantastic main 16d36778
// (facts: coder/tmp/foundations/facts/agents_ai_agent_context_folding.md).
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src } from '../lib.js'

export default {
  headline: 'Context folding: a long conversation in a finite window',
  description: 'How an Aisixteen Fantastic AI agent fits a long conversation in a finite context window: folds are appended rows, so the prompt prefix stays byte-identical.',
  summary: 'Folds as appended rows with refs, folds of folds, the five strategies, recall, clear and forget, and why the prefix stays byte-identical for the prompt cache.',
  cover: { clip: 'fold' },
  about: ['Aisixteen Fantastic', 'LLM context window', 'Prompt caching', 'Conversation memory'],
  lead: [
    'A model reads a finite window, and an agent that works for hours outgrows it. Something has to give. Folding is Fantastic’s way of giving without losing anything: a stretch of old rows collapses into one row that names what it hides, and in the code’s words “the history becomes a tree of marks the model walks down as far as it needs.”',
    'This article covers the fold row, levels, the five context strategies, the verbs that fold, recall, clear and forget, and the reason old bytes never move: the provider’s prompt cache. The rows live in a memory store, described on [Memory stores](/fantastic/foundations/agents/memory-stores/). Starting a new agent from this one’s prefix, with `fork` and `mark`, has [its own page](/fantastic/foundations/agents/ai-agent/forking/), and the provider side is on [Model backends](/fantastic/foundations/agents/ai-agent/backends/). Folding is opt-in, with `context_strategy: fold`; the default strategy is `compact`.',
  ],
  sections: [
    {
      id: 'store',
      title: 'Memory is rows in a store',
      blocks: [
        'An AI agent’s conversation lives in a **memory store** agent, one row per message, keyed by the caller so that an agent reads and writes only its own rows. [Memory stores](/fantastic/foundations/agents/memory-stores/) covers the two bundles, `ram_store` and `sqlite_store`, and their verbs. Row ids are the kernel’s own counter, the same one that numbers calls and tasks ([State and durability](/fantastic/foundations/kernel/state/)), which is why an id also orders rows in time.',
        'Two things in the store matter here. Pruning a row also removes it from every fold that names it ([Fold refs cascade](/fantastic/foundations/agents/memory-stores/#cascade)). And on `prune`, `sqlite_store` overwrites the deleted bytes and truncates the WAL, so the text leaves the file at once ([One file per store](/fantastic/foundations/agents/memory-stores/#file)).',
      ],
    },
    {
      id: 'fold',
      title: 'A fold is an appended row',
      blocks: [
        'What the model reads is a **view** over those rows: an ordered list of row ids, each at a resolution (`full`, `stub` or `fold`). Every projection saves the view as a row of its own, so the next turn, and the next process, rebuild the same bytes instead of a freshly guessed prefix.',
        'A fold is an ordinary row appended to the conversation. It carries `refs` (the ids it collapses, in order), a `title` of at most 140 characters, a summary `body`, a `level` and an `anchor`. Nothing is rewritten and nothing is lost. The model sees it as one line plus the summary:',
        { code: '[fold 41 · 7 refs · L1] "Fixed the printer queue bug"\nASKED: ...\nDONE: ...\nBINDING: ...\nERRORS: ...\nOPEN: none', label: 'a fold as the model sees it (illustrative)' },
        'The `anchor` is the smallest non-fold row id the fold covers (a member fold contributes its own anchor). Because row ids order rows in time, the view can place a fold at its anchor without loading the rows it hides. Rendering is deterministic, “so a view renders the same bytes until a new fold lands.” If the summarizer fails, the fold is still written, with its refs and the members’ titles, and says so on its header line: “Degraded, loud, never silent.”',
        { video: 'fold' },
        { h3: 'Folding by hand: context_fold' },
        '`context_fold {from?, to?, summary?}` is an operator verb: the how-to text an AI agent reads teaches `history`, `grep`, `recall`, `context_status`, `context_recall` and `context_clear`, and does not mention it. It folds a range of consecutive rows in the view into one fold row, `summary` used verbatim or written by the fold summarizer, and answers `{folded: <fold id>, rows: <n>, summarized: <bool>}`. The new view is the rows before the range unchanged, then the fold, then the rows after. It refuses an empty range, an id not in the view, a range that crosses a fold or a clear row, a range that starts at or before the pinned primer, and any range while a turn is running (a [refusal](/fantastic/foundations/protocol/refusals/) that names the reason). `from` defaults to the row after the last fold or clear in the view, and `to` to the last row.',
        { code: 'context_fold {"from": 12, "to": 18, "summary": "printer fixed; queue cleared"}\n  -> {"folded": 41, "rows": 7, "summarized": true}', label: 'illustrative ids' },
      ],
    },
    {
      id: 'levels',
      title: 'Folds of folds',
      blocks: [
        'Folds nest. A fold’s level is one more than the highest level among the folds it contains: 1 for a fold of rows, 2 for a fold of folds, and so on. The automatic fold normally skips the folds at the head of the view and takes the oldest ordinary rows, because wrapping the previous fold every time would build a linked list of summaries of summaries. Only when three adjacent folds sit at the head do they fold as a group. The constant is `FOLD_RUN = 3`, and its comment explains the choice: “THREE, not four ... depth grows as log3 of the history rather than one level per cut.”',
        { video: 'levels' },
        'The summary format is fixed. The model writes a one-sentence title, then five sections, “omitting none (write `none`)”: ASKED, DONE (and why), BINDING (rules and choices that still bind), ERRORS (quoted verbatim) and OPEN. When a fold contains earlier summaries, they are merged: “the newer statement wins, and unfinished work is carried forward.” The summary budget is 1024 tokens; a summary still over it after three re-summarizes fails the turn loudly.',
        'Next to the summary, every fold carries a mechanical index that no summarizer can drop and that sits outside the 1024-token budget: up to 30 file names and 20 hex identifiers its members mention, and up to 1200 characters of what the user said, verbatim.',
        'Going back down is one verb. `history {fold: <id>}` returns the fold’s title and summary and its members one level down, and a member that is itself a fold opens the same way. `grep` finds a line “behind every clear, inside every fold,” and `recall {query?, limit?, before?}` pages whole turns back, read-only, from the durable store.',
      ],
    },
    {
      id: 'strategy',
      title: 'When folding happens',
      blocks: [
        'Each AI agent has one `context_strategy`, chosen statically; there is no try-this-then-that chain, and an unknown value is refused with the list of valid names. A strategy runs only when the estimated prompt passes `TRIGGER = 0.8` of the budget. Token counts are estimates (the serialized message length divided by four), calibrated against the prompt sizes the model server reports.',
        { table: { head: ['strategy', 'what it does when the window fills'], rows: [
          ['`compact`', 'the default: keeps the recent turns verbatim and adds a model summary of the overflow'],
          ['`truncate`', 'keeps the first, task-framing turn and the recent turns, drops the middle; no model call'],
          ['`strip`', 'drops reply bodies and keeps their titles, oldest first; no model call'],
          ['`fold`', 'folds the oldest rows into fold rows, then strips, then cuts'],
          ['`none`', 'never shrinks; an over-budget turn is refused before any model call, with “context full”'],
        ] } },
        '`fold` is “THE ONE STRATEGY THAT WRITES.” Every other strategy is a pure projection; this one appends fold rows to the durable store, “because a fold is a mark that must persist — the next turn has to see the same collapse, or the prefix rewrites every turn.”',
        'It acts once the view passes `FOLD_AT = 0.95` of the body budget. Step one takes the oldest rows, sized by their tokens, until the view would sit at `LOW = 0.6` or under, and writes one fold for them, with one summarizing call; it repeats only if the view is still over `LOW`. The ordinary span skips any folds at the head, stops at the next fold, never contains the goal turn or the last `KEEP_TAIL = 6` rows, and drops trailing assistant rows so it does not end between a call and its answer. Only when `FOLD_RUN = 3` or more folds sit adjacent at the head are they taken together as the span (the fold-of-folds case below). If the view is still over after step one, step two strips reply bodies, and if it is still over, step three cuts.',
        { note: 'The module’s header comment speaks of folding “closed chains” and stripping “open chains.” The code that picks the span counts tokens and does not test whether a chain is open. Open chains matter to `context_forget`, which spares them.' },
        { code: '[reply to pid · notes read · "survey chunk 2"]\\n<6800 bytes>       L0  full row\n[reply to pid · notes read · "survey chunk 2"] (stripped: 6800 bytes)  L1  stub', label: 'strip, from its module doc' },
        'Strip follows two rules that keep the cache warm. Hysteresis: it strips only past a high watermark and then down to `LOW` in one batch, because “ten stubs in one event is one cache miss, not ten.” Monotone, oldest first: “Once stripped, always stripped,” so “the stable prefix only ever EXTENDS, never gets holes.”',
        'If the summarizer returns nothing, the fold is still written with its refs and its members’ titles, and its header line says “summary unavailable.” A summary that stays over its budget after three re-summarizes ends the turn with `reason: fold_summary` and folds nothing.',
      ],
    },
    {
      id: 'cache',
      title: 'Why the prefix stays byte-identical',
      blocks: [
        'Model servers cache the work done on a prompt’s prefix and compare it **byte for byte**: an append after the cached prefix reuses it, an edit inside it does not. The `ai_core` code records one measurement on its own stack (a vLLM prefix cache): an append reused the whole 4752-token prefix out of a 6559-token prompt, while “any edit inside it — or a cut taken from the front of it — reuses nothing and recomputes everything.”',
        'So Fantastic only appends. Rows are never edited, a fold is a new row placed at its anchor, the view is persisted, and `context_fold` keeps the rows before its range exactly as they were rendered. The Rust tests assert that “the messages before the fold are byte-identical,” and the E125 end-to-end probe, which runs against the Python runtime, checks the same for stored rows, the next prompt, a refused range and a kernel restart.',
        { video: 'cache' },
        'To be precise about the claim: a fold replaces its members, so the prompt does change from the fold on. What stays byte-identical is everything before the folded range, and after the fold lands, the next turns append after it again. Whether a provider actually hits its cache depends on the provider; the code only keeps the bytes stable and places markers.',
        { h3: 'Caching modes and the primer' },
        'The `caching` setting picks how the view is rendered. `none` sends every stored row, in order, never trimmed. `cleanup`, the default, trims superseded whole-state reads, repeated reply bodies and used docs from the view, with no markers. `provider_cache` sends what `none` sends, plus two cache markers: the end of the **primer** (the row `cache_primer_until` names) and the last fold or clear row. The Anthropic backend turns them into `cache_control` markers, together with one on the system block and the automatic top-level one, at most four; a backend that cannot cache refuses `provider_cache`. [Model backends](/fantastic/foundations/agents/ai-agent/backends/) covers the provider side.',
        'The primer is pinned in every mode: “The primer and every row before it are pinned — context_fold will not fold a range that starts at or before it.”',
      ],
    },
    {
      id: 'recall',
      title: 'Recall: rebuilding the view',
      blocks: [
        '`context_recall {dry?}` rebuilds the agent’s view from its store. With the fold strategy, a head longer than the budget is folded first. Then the head is fitted to the budget at digest resolution, the model is asked which rows it wants in full (one model call), the chosen id list is persisted and the decision is logged as a row. It answers `{kept, expanded, dropped, folded, budget, why, degraded}`. A bad or missing model answer changes nothing: recall falls back to the mechanical fit and reports `degraded`.',
        'Some rows always stay in. The goal turn is first. Then, within half of the target (`PIN_SHARE = 0.5`), the standing rows: the first task root (a user turn with no parent that set the task), the last task root (the live one), the newest fold, then other task roots, newest first. The rest fills newest first. The decision is a `recall` row that names the live task. The purpose, per the code: “a reboot after a long run of polling still sees why it is running.”',
        'Recall runs on the first turn after a boot, after three fold rows have been written since the last recall (a recall is a model call, so it is debounced), or on request. It is not the `recall` verb, which only pages old turns back. With `dry: true` it does the mechanical fit only, with no model call.',
      ],
    },
    {
      id: 'forget',
      title: 'Clear and forget',
      blocks: [
        '`context_clear {why?}` starts a new thread on the same store. It appends one clear row whose members are every row since the previous clear, and the view starts at its line:',
        { code: '[cleared 90 · 34 rows] switching to the invoice task — a new thread; the rows before it are this clear\'s members, reachable by id (grep, recall, history fold=90).', label: 'a clear line (illustrative ids)' },
        'Nothing is deleted: `grep`, `recall` and `history {fold: <id>}` still reach every member. It answers `{cleared, rows}`.',
        '`context_forget {include_cleared?}` is the verb that deletes. In one `prune` it removes every ordinary row covered by a fold whose place is known (rows of an open chain are spared) and all but the newest view row; with `include_cleared` it also removes every row before the last clear, which stays. It keeps every fold at every level, every row no fold covers, and the anchors a kept fold needs. It answers `{pruned, kept_folds, unanchored}`. The verb’s own promise: “The next prompt is the same before and after.” It waits for a running turn. Afterwards, a pruned id is gone from `grep`, `recall` and `history`, while `history {fold}` still returns the fold’s title and summary.',
        { video: 'forget' },
        '`context_status` reports the posture: `{context_window, output_reserve, budget, trigger, calibration, reported_prompt_tokens, strategy, last_projection, last_reaction, view_source}`, where the projection record lists the ids the model actually saw that turn, measured from the view rather than self-reported.',
        { table: { head: ['verb', 'what', 'in the model’s how-to'], rows: [
          ['`history {fold?}`', 'rows at digest resolution; a fold’s title, summary and members', 'yes'],
          ['`grep {query}`', 'the line that mentions something, anywhere in memory', 'yes'],
          ['`recall {query?}`', 'whole old turns from the durable store, read-only', 'yes'],
          ['`context_recall {dry?}`', 'rebuild the view and fit it to the budget', 'yes'],
          ['`context_clear {why?}`', 'start a new thread; delete nothing', 'yes'],
          ['`context_fold {from?, to?, summary?}`', 'fold a range by hand', 'no'],
          ['`context_forget {include_cleared?}`', 'delete rows no longer in view', 'no'],
          ['`context_status`', 'the budget posture', 'yes'],
        ] } },
      ],
    },
    {
      id: 'runtimes',
      title: 'Rust and Python',
      blocks: [
        'Both runtimes implement the fold, strip, truncate, compact and none strategies, the caching modes, `context_fold`, `context_recall`, `context_clear`, `context_forget`, `context_status`, `history`, `grep` and `recall`, and both ship `ram_store` and `sqlite_store`. The Rust code describes itself as mirroring Python, with Python’s `folds.py` as “the immutable reference.”',
        'One difference is visible in the projection record: the Rust runtime always reports `pinned_facts: 0`, and no strategy on main fills the Python counter either. Forking and `mark` are on [their own page](/fantastic/foundations/agents/ai-agent/forking/).',
      ],
    },
  ],
  sources: [
    ['ai_core (Python)', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core')],
    ['fantastic-ai-core (Rust)', src('src/lib/rust/crates/bundles/fantastic-ai-core/src')],
    ['sqlite_store readme', src('src/lib/python/bundled_agents/memory/sqlite_store/src/sqlite_store/readme.md')],
    ['the context_fold e2e probe (E125)', src('e2e/tests/memory/E125_context_fold')],
    ['fold.py: the fold strategy', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core/strategies/fold.py')],
    ['folds.py: the fold row, anchors, levels', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core/folds.py')],
    ['constants.py: FOLD_AT, LOW, FOLD_RUN, KEEP_TAIL', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core/constants.py')],
    ['caching.py: the caching modes and the primer', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core/caching.py')],
  ],
  // This article's own clips: rendered from anim/foundations/agents_ai_agent_context_folding.py.
  clips: {
    fold: {
      title: 'A fold is a new row',
      caption: 'context_fold over rows 3 to 8 appends one fold row (13) to the store, with refs to its members; nothing is deleted. In the view the fold sits at its anchor, row 3, in place of its members, and everything before the range keeps its exact bytes.',
    },
    levels: {
      title: 'Folds of folds',
      caption: 'The oldest rows fold into level-1 folds, one fold row each. Three adjacent folds at the head fold again into one level-2 fold, and so on, so depth grows like log3 of the history. history {fold} opens any fold one level down.',
    },
    cache: {
      title: 'Why folds append, never edit',
      caption: 'A prompt cache compares bytes from the start. Appending a row keeps the whole old prompt as a cached prefix; cutting rows from the front moves everything after the cut; a fold misses from its anchor on but keeps the rows before it, and because the fold row persists, the next turn appends after the same bytes again.',
    },
    forget: {
      title: 'clear starts over; forget deletes',
      caption: 'context_clear appends one clear row and the view starts at its line; nothing is deleted and grep still finds old rows. context_forget then deletes the rows a fold covers, keeps every fold, and the next prompt is the same before and after.',
    },
  },
}
