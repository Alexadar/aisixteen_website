// TEMPLATE — copy to src/data/foundations/articles/<key>.js (key from registry.json) and fill in.
// Rules: src/data/foundations/STYLE.md. Every claim comes from your fact sheet
// (coder/tmp/foundations/facts/<key>.md), which cites fantastic main as path:line.
// The page title and short title come from registry.json; do not repeat them here.
//
// Blocks inside a section, in any order:
//   'a paragraph'                         inline markup: `code`, **bold**, [text](https://…)
//   { h3: 'A sub-heading' }
//   { code: 'one\ntwo', label: 'what it is' }   JSON shapes and verbs, as the code spells them
//   { list: ['…', '…'] }  { ol: ['…', '…'] }
//   { table: { head: ['a', 'b'], rows: [['`x`', 'y']] } }   first cell of a row is its header
//   { quote: 'verbatim from the repo', cite: 'file name' }
//   { note: 'a small aside' }
//   { video: 'clip' }                      one of THIS article's clips (see `clips` below)
//   { video: 'clip', from: '<other key>' } a clip another article owns (reuse; no re-render)
import { src, tree } from '../lib.js'

export default {
  // <title> suffix, og:title, TechArticle.headline: what the page explains, in plain words.
  headline: 'The call gate: both ends must grant',
  // meta description (150–160 characters): the mechanism, said once.
  description: 'How the Aisixteen Fantastic call gate decides every send: the caller’s can_call and the target’s callable_by must both grant the verb, or the send is refused.',
  // One sentence for the parent page's "In this part" list and the hub.
  summary: 'can_call on the caller, callable_by on the target: both must grant, per verb.',
  // The clip used for social cards (its article's og.jpg) and the hub card.
  cover: { clip: 'gate' },
  // schema.org "about" topics: 2–4 short nouns.
  about: ['Aisixteen Fantastic', 'Access control'],
  // 1–2 paragraphs under the h1: what this page covers and why it matters.
  lead: [
    'Every send passes one check before it runs …',
  ],
  // Each section becomes an h2 with id = `id` (lowercase, unique, not "sources" or "in-this-part").
  sections: [
    {
      id: 'rule',
      title: 'One rule, two halves',
      blocks: [
        'An edge exists only if both ends grant it …',
        { code: 'a.can_call     {"$self": "*", "b": ["reflect"]}\nb.callable_by  {"$self": "*", "a": ["reflect"]}', label: 'a may send reflect to b' },
        { video: 'gate' },
      ],
    },
  ],
  // [label, link] pairs; link to the exact file and line on fantastic main.
  sources: [
    ['README.md: the call gate', src('README.md', 45)],
    ['the Rust kernel crate', tree('src/lib/rust/crates/fantastic-kernel/src')],
  ],
  // This article's OWN clips: name -> title + caption. Names match CLIPS in anim/foundations/<key>.py.
  // The caption says what the clip shows, step by step, so the page is complete without video.
  clips: {
    gate: {
      title: 'The call gate: both ends must grant',
      caption: 'Agent a sends reflect to b. The send is refused at egress until a’s can_call names b, then at ingress until b’s callable_by names a.',
    },
  },
}
