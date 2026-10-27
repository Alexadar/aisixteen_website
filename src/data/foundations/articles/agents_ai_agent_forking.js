// SEED — Forking and marks. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): fork {at} (a new agent from a copied prefix),
// mark, fork_points, cache lifetime; forking several agents while the cache is warm.
// Material moved here in batch 3 from Context folding (its section "fork and mark: reuse a
// prefix" and its clip `fork`, now rendered from anim/foundations/agents_ai_agent_forking.py).
// It was checked against fantastic main for Context folding; the writer re-checks every claim
// with a fact sheet (coder/tmp/foundations/facts/agents_ai_agent_forking.md), rewrites it to
// STYLE.md, fills headline, description, summary, about and lead, adds clips (3 to 5 in all)
// and deletes `seed: true`.
import { src } from '../lib.js'

export default {
  seed: true,
  headline: '',
  description: '',
  summary: '',
  about: ['Aisixteen Fantastic'],
  lead: [],
  cover: { clip: 'fork' },
  sections: [
    {
      id: 'fork',
      title: 'fork and mark: reuse a prefix',
      blocks: [
        '`fork {at, name?, id?}` starts a new agent from this one’s first rows. The fork gets the same card (handler, model, endpoint, system prompt, memory store, context settings, `can_call`) and a copy of every row with id ≤ `at`, **under its own key with the same ids**, plus every fold whose members all fall at or before `at`, in one all-or-nothing append. It answers `{id, copied, at}`.',
        { quote: 'Rows are never edited and the provider’s prompt cache compares bytes, not storage, so the fork re-appends the parent’s rows under its OWN key with their original ids and hits the parent’s cache.', cite: 'fork.rs' },
        'After that the two are separate: “Later rows, folds and forgets on either side never reach the other.” A fork point must be clean, and a bad one is refused with a reason: `no_such_row`, `cuts_turn` (inside a turn, or one still owed a reply), `cuts_fold` (some of a fold’s members before `at`, some after), `parent_mid_turn`, or `store_refused`, which leaves no agent behind.',
        { video: 'fork' },
        '`mark {label, note?, version?}` records a turn boundary outside any fold, a point `fork` always accepts; an agent keeps its last 20 marks. `fork_points` lists them with `rows_after` and a `warm` flag, true while the agent’s last send is younger than 300 seconds, the code’s assumption of how long a provider keeps a prefix warm.',
      ],
    },
  ],
  sources: [
    ['ai_core (Python)', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core')],
    ['fantastic-ai-core (Rust)', src('src/lib/rust/crates/bundles/fantastic-ai-core/src')],
  ],
  // This article's own clips: rendered from anim/foundations/agents_ai_agent_forking.py.
  clips: {
    fork: {
      title: 'fork: a new agent on the same prefix',
      caption: 'mark labels a turn boundary. fork at row 5 is refused with cuts_turn; fork at 6 starts a new agent with a copy of rows 1 to 6 under its own key, with the same ids, so its first prompt has the parent’s bytes. After that the two histories diverge.',
    },
  },
}
