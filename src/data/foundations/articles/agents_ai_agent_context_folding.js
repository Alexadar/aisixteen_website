// Agents › AI agent › Context folding. Published.
// Moved here from /fantastic/foundations/context-folding/ (that URL now redirects).
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src } from '../lib.js'

export default {
  headline: 'Context folding: a long conversation in a finite window',
  description: 'How a Fantastic AI agent keeps a long conversation inside a finite context window without losing it: rows in a memory store, folds that are appended rows with refs, levels, recall, clear and forget, and why the prompt prefix stays byte-identical.',
  summary: 'Memory as rows in a store, folds as appended rows with refs, folds of folds, recall, clear and forget, and why the prefix stays byte-identical for the prompt cache.',
  cover: { clip: 'fold' },
  about: ['Aisixteen Fantastic', 'LLM context window', 'Prompt caching', 'Conversation memory'],
  lead: [
    'A model reads a finite window, and an agent that works for hours outgrows it. Something has to give. Folding is Fantastic’s way of giving without losing anything: a finished stretch of work collapses into one row that names what it hides, and in the code’s words “the history becomes a tree of marks the model walks down as far as it needs.”',
    'This article covers the storage under it, the fold row itself, levels, the verbs that fold, recall, clear and forget, and the reason old bytes never move: the provider’s prompt cache. Starting a new agent from this one’s prefix, with `fork` and `mark`, has [its own page](/fantastic/foundations/agents/ai-agent/forking/). Folding is opt-in, with `context_strategy: fold`; the default strategy is `compact`.',
  ],
  sections: [
    {
      id: 'store',
      title: 'Memory is rows in a store',
      blocks: [
        'An AI agent’s conversation lives in a **memory store** agent, one row per message. Two store bundles ship, each in Rust and in Python with identical readmes: `ram_store`, where everything is lost when the process exits, and `sqlite_store`, one SQLite file that survives it. They answer “the SAME verbs, arguments, replies and refusals”; the only difference a caller sees is `durable: true`.',
        'Rows are keyed `(owner, id)`. The owner is the caller, `<kernel guid>|<agent id>`, set by the store from who is calling: “there is no `owner` field to forge.” Row ids are the kernel’s own counter, the same one that numbers calls and tasks ([State and durability](/fantastic/foundations/kernel/state/)), which is why an id also orders rows in time.',
        { table: { head: ['verb', 'what'], rows: [
          ['`append {rows}`', 'add rows under your key, all or none'],
          ['`read {after?, limit?, kinds?, match?, ...}`', 'your rows'],
          ['`search {query, ids?}`', 'the lines that mention something'],
          ['`prune {before_id | ids, keep?}`', 'delete your rows; fold refs on them go too'],
          ['`inject {tables}` · `dump`', 'replace or capture the whole store'],
        ] } },
        'A fold’s members are kept in a `fold_refs` table whose foreign keys cascade, so pruning a row also removes it from every fold that names it. `sqlite_store` adds an FTS5 trigram index for `search`, runs in WAL mode, and on `prune` overwrites the deleted bytes and truncates the WAL, “so the text leaves `memory.db` and its `-wal` at once.”',
      ],
    },
    {
      id: 'fold',
      title: 'A fold is an appended row',
      blocks: [
        'What the model reads is a **view** over those rows: an ordered list of row ids, each at a resolution (`full`, `stub` or `fold`). The view is saved as a row of its own, so the next turn, and the next process, rebuild the same bytes instead of a freshly guessed prefix.',
        'A fold is an ordinary row appended to the conversation. It carries `refs` (the ids it collapses, in order), a `title` of at most 140 characters, a summary `body`, a `level` and an `anchor`. Nothing is rewritten and nothing is lost. The model sees it as one line plus the summary:',
        { code: '[fold 41 · 7 refs · L1] "Fixed the printer queue bug"\nASKED: ...\nDONE: ...\nBINDING: ...\nERRORS: ...\nOPEN: none', label: 'a fold as the model sees it (illustrative)' },
        'The `anchor` is the smallest ordinary row id the fold covers. Because row ids order rows in time, the view can place a fold at its anchor without loading the rows it hides. Rendering is deterministic, “so a view renders the same bytes until a new fold lands.” If the summarizer fails, the fold is still written, with its refs and the members’ titles, and says so on its header line: “Degraded, loud, never silent.”',
        { video: 'fold' },
        { h3: 'Folding by hand: context_fold' },
        '`context_fold {from?, to?, summary?}` is an operator verb, not one the model is taught. It folds a range of consecutive rows in the view into one fold row, `summary` used verbatim or written by the fold summarizer, and answers `{folded: <fold id>, rows: <n>, summarized: <bool>}`. The new view is the rows before the range unchanged, then the fold, then the rows after. It refuses an empty range, an id not in the view, a range that crosses a fold or a clear row, a range that starts at or before the pinned primer, and any range while a turn is running.',
        { code: 'context_fold {"from": 12, "to": 18, "summary": "printer fixed; queue cleared"}\n  -> {"folded": 41, "rows": 7, "summarized": true}', label: 'illustrative ids' },
      ],
    },
    {
      id: 'levels',
      title: 'Folds of folds',
      blocks: [
        'Folds nest. A fold’s level is one more than the highest level among the folds it contains: 1 for a fold of rows, 2 for a fold of folds, and so on. When three adjacent folds sit at the head of the view, they fold as a group. The constant is `FOLD_RUN = 3`, and its comment explains the choice: “THREE, not four ... depth grows as log3 of the history rather than one level per cut.”',
        { video: 'levels' },
        'The summary format is fixed. The model writes a one-sentence title, then five sections, “omitting none (write `none`)”: ASKED, DONE (and why), BINDING (rules and choices that still bind), ERRORS (quoted verbatim) and OPEN. When a fold contains earlier summaries, they are merged: “the newer statement wins, and unfinished work is carried forward.” The summary budget is 1024 tokens; a summary still over it after three re-summarizes fails the turn loudly.',
        'Next to the summary, every fold carries a mechanical index that no summarizer can drop: the file names and identifiers its members mention, and up to 1200 characters of what the user said, verbatim.',
        'Going back down is one verb. `history {fold: <id>}` returns the fold’s title and summary and its members one level down, and a member that is itself a fold opens the same way. `grep` finds a line “behind every clear, inside every fold,” and `recall` pages turns back from the durable store.',
      ],
    },
    {
      id: 'strategy',
      title: 'When folding happens',
      blocks: [
        'Each AI agent has one `context_strategy`, chosen statically; there is no try-this-then-that chain, and an unknown value is refused.',
        { table: { head: ['strategy', 'what it does when the window fills'], rows: [
          ['`compact`', 'the default'],
          ['`truncate`', 'keeps the first, task-framing turn and the recent turns, drops the middle; no model call'],
          ['`strip`', 'drops reply bodies and keeps their titles, oldest first; no model call'],
          ['`fold`', 'folds finished chains into fold rows, then strips, then cuts'],
          ['`none`', 'never shrinks; an over-budget turn is refused before any model call'],
        ] } },
        '`fold` is “THE ONE STRATEGY THAT WRITES.” Every other strategy is a pure projection; this one appends fold rows to the durable store, “because a fold is a mark that must persist — the next turn has to see the same collapse, or the prefix rewrites every turn.”',
        'It starts once the view passes `FOLD_AT = 0.95` of the body budget and works oldest first, in one batch, until the view is at `LOW = 0.6` or under. Step one folds **closed** chains, one summarizing call each. A chain is open while its last row is an assistant turn still owed a reply, and open chains are never folded. If the view is still over, step two strips reply bodies in open chains; if it is still over, step three cuts. The last `KEEP_TAIL = 6` rows never fold.',
        { code: '[reply to pid · notes read · "survey chunk 2"]\\n<6800 bytes>       L0  full row\n[reply to pid · notes read · "survey chunk 2"] (stripped: 6800 bytes)  L1  stub', label: 'strip, from its module doc' },
        'Strip follows two rules that keep the cache warm. Hysteresis: it strips only past a high watermark and then down to `LOW` in one batch, because “ten stubs in one event is one cache miss, not ten.” Monotone, oldest first: “Once stripped, always stripped,” so “the stable prefix only ever EXTENDS, never gets holes.”',
        'Token counts are estimates (characters divided by four), calibrated against the prompt sizes the model server reports.',
      ],
    },
    {
      id: 'cache',
      title: 'Why the prefix stays byte-identical',
      blocks: [
        'Model servers cache the work done on a prompt’s prefix and compare it **byte for byte**: an append after the cached prefix reuses it, an edit inside it does not. The `ai_core` code records one measurement on its own stack (a vLLM prefix cache): an append reused the whole 4752-token prefix out of a 6559-token prompt, while “any edit inside it — or a cut taken from the front of it — reuses nothing and recomputes everything.”',
        'So Fantastic only appends. Rows are never edited, a fold is a new row placed at its anchor, the view is persisted, and `context_fold` keeps the rows before its range exactly as they were rendered. The Rust tests assert that “the messages before the fold are byte-identical,” and the E125 end-to-end probe checks the same across a kernel restart.',
        { video: 'cache' },
        'To be precise about the claim: a fold replaces its members, so the prompt does change from the fold on. What stays byte-identical is everything before the folded range, and after the fold lands, the next turns append after it again. Whether a provider actually hits its cache depends on the provider; the code only keeps the bytes stable and places markers.',
        { h3: 'Caching modes and the primer' },
        'The `caching` setting picks how the view is rendered. `none` sends every stored row, in order, never trimmed. `cleanup`, the default, trims superseded whole-state reads, repeated reply bodies and used docs from the view, with no markers. `provider_cache` sends what `none` sends, plus two cache markers: the end of the **primer** (the row `cache_primer_until` names) and the last fold or clear row. The Anthropic backend turns them into `cache_control` markers, at most four; a backend that cannot cache refuses `provider_cache`.',
        'The primer is pinned in every mode: “The primer and every row before it are pinned — context_fold will not fold a range that starts at or before it.”',
      ],
    },
    {
      id: 'recall',
      title: 'Recall: rebuilding the view',
      blocks: [
        '`context_recall {dry?}` rebuilds the agent’s view from its store. With the fold strategy, a head longer than the budget is folded first. Then the head is fitted to the budget at digest resolution, the model is asked which rows it wants in full (one model call), the chosen id list is persisted and the decision is logged as a row. It answers `{kept, expanded, dropped, folded, budget, why, degraded}`. A bad or missing model answer changes nothing: recall falls back to the mechanical fit and reports `degraded`.',
        'Some rows always stay in. The goal turn is first. Then, within half of the target (`PIN_SHARE = 0.5`), the standing rows: the first task root (the turn that set the task), the last task root (the live one), the newest fold, then other task roots, newest first. The rest fills newest first. The purpose, per the code: “a reboot after a long run of polling still sees why it is running.”',
        'Recall runs on the first turn after a boot, after a batch that folded (debounced to every third fold batch), or on request. With `dry: true` it does the mechanical fit only, with no model call.',
      ],
    },
    {
      id: 'forget',
      title: 'Clear and forget',
      blocks: [
        '`context_clear {why?}` starts a new thread on the same store. It appends one clear row whose members are every row since the previous clear, and the view starts at its line:',
        { code: '[cleared 90 · 34 rows] switching to the invoice task — a new thread; the rows before it are this clear\'s members, reachable by id (grep, recall, history fold=90).', label: 'a clear line (illustrative ids)' },
        'Nothing is deleted: `grep`, `recall` and `history {fold: <id>}` still reach every member. It answers `{cleared, rows}`.',
        '`context_forget {include_cleared?}` is the verb that deletes. In one `prune` it removes every ordinary row covered by a fold whose place is known (rows of an open chain are spared) and all but the newest view row; with `include_cleared` it also removes every row before the last clear, which stays. It keeps every fold at every level, every row no fold covers, and the anchors a kept fold needs. It answers `{pruned, kept_folds, unanchored}`. The verb’s own promise: “The next prompt is the same before and after.” Afterwards, a pruned id is gone from `grep`, `recall` and `history`, while `history {fold}` still returns the fold’s title and summary.',
        { video: 'forget' },
        '`context_status` reports the posture: `{context_window, output_reserve, budget, strategy, last_projection, last_reaction}`, where the projection record lists the ids the model actually saw that turn, measured from the view rather than self-reported.',
      ],
    },
    {
      id: 'runtimes',
      title: 'Rust and Python',
      blocks: [
        'Both runtimes implement the fold, strip, truncate, compact and none strategies, the caching modes, `context_fold`, `context_recall`, `context_clear`, `context_forget`, `context_status`, `fork`, `mark` and `fork_points`, and both ship `ram_store` and `sqlite_store`. The Rust code describes itself as mirroring Python, with Python’s `folds.py` as “the immutable reference.”',
        'One difference is visible in `context_status`: Python builds a pinned-facts block in the prompt, while the Rust runtime has none and always reports `pinned_facts: 0`.',
      ],
    },
  ],
  sources: [
    ['ai_core (Python)', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core')],
    ['fantastic-ai-core (Rust)', src('src/lib/rust/crates/bundles/fantastic-ai-core/src')],
    ['ram_store readme', src('src/lib/python/bundled_agents/memory/ram_store/src/ram_store/readme.md')],
    ['sqlite_store readme', src('src/lib/python/bundled_agents/memory/sqlite_store/src/sqlite_store/readme.md')],
    ['the context_fold e2e probe (E125)', src('e2e/tests/memory/E125_context_fold')],
    ['README.md', src('README.md')],
  ],
  // This article's own clips: rendered from anim/foundations/agents_ai_agent_context_folding.py.
  clips: {
    fold: {
      title: 'A fold is a new row',
      caption: 'context_fold over rows 3 to 8 appends one fold row (13) to the store, with refs to its members; nothing is deleted. In the view the fold sits at its anchor, row 3, in place of its members, and everything before the range keeps its exact bytes.',
    },
    levels: {
      title: 'Folds of folds',
      caption: 'Finished chains at the head of the view fold into level-1 folds. Three adjacent folds at the head fold again into one level-2 fold, and so on, so depth grows like log3 of the history. history {fold} opens any fold one level down.',
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
