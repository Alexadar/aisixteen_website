// SEED — Memory stores. Status: planned (see registry.json); this page is not published.
// Scope (GitHub issue aisixteen/fantastic#443): ram_store and sqlite_store: the same tables and verbs, rows keyed by owner, fold refs with cascade, one file per store, what survives a restart; which store is used is configuration.
// Overlaps: Context folding (section "Memory is rows in a store") and State and durability
// ("Rows live in a memory store") already state some of this; link to them, do not contradict.
// The writer builds a fact sheet (coder/tmp/foundations/facts/agents_memory_stores.md) from fantastic main,
// writes this page to STYLE.md, fills headline, description, summary, about, lead, sections,
// sources, cover and clips (3 to 5), and deletes `seed: true`.

export default {
  seed: true,
  headline: '',
  description: '',
  summary: '',
  about: ['Aisixteen Fantastic'],
  lead: [],
  sections: [],
  sources: [],
  clips: {},
}
