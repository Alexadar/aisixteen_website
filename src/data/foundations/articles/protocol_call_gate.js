// SEED — Call gate and grants. Status: planned (see registry.json); this page is not published.
// Material moved here from the first draft article "Kernel: agents and messaging" (#443 split).
// It was written from fantastic main at the time; the writer of this article re-checks every
// claim against fantastic main with a fact sheet, rewrites it to STYLE.md, fills headline,
// description, summary and about, and adds clips (3–5 per article). Delete `seed: true` then.
import { src } from '../lib.js'

export default {
  seed: true,
  headline: '',
  description: '',
  summary: '',
  about: ['Aisixteen Fantastic'],
  lead: [],
  cover: { clip: 'gate' },
  sections: [
    {
      id: 'gate',
      title: 'The call gate',
      blocks: [
        'Security is one rule, applied to every send an agent makes, for any verb, `reflect` and the kernel verbs included. **Egress:** the sender’s `can_call` must grant (target, verb). **Ingress:** the target’s `callable_by` must grant (sender, verb). An edge exists only if both ends grant it. The gate never looks at what the verb is.',
        { video: 'gate' },
        'A grant map has keys and values. A value is `"*"` (every verb) or a list of verbs. A key is a literal agent id; `$self`; `$parent`; `$subtree` (every agent below the holder, at any depth); or, in `can_call` only, `<guid>|<agent>` or `<guid>|*` for a connected kernel. Tokens resolve relative to the agent holding the grant. An absent or empty grant denies, and the baseline merged into every agent, on both fields, is `{"$self": "*"}` and nothing else.',
        { code: 'a.can_call     {"$self": "*", "b": ["reflect"]}\nb.callable_by  {"$self": "*", "a": ["reflect"]}', label: 'a may send reflect to b (one way)' },
        'A refusal says which half failed. Egress is checked first, so a call with neither half granted reports egress:',
        { code: '{"error": "a may not call \'reflect\' on b", "reason": "unauthorized", "side": "egress", "hint": "grants come from above ..."}\n{"error": "b does not accept \'reflect\' from a", "reason": "unauthorized", "side": "ingress", "hint": "..."}', label: 'the two refusals' },
        'The hint says where grants come from: “grants come from above — an ancestor (update_agent on an agent in its subtree) or the operator writes can_call and callable_by; an agent never raises its own.” Holding `update_agent` on the root is itself such a grant, and an agent without it is refused.',
        '**Operator sends** skip the gate: the CLI, a cold bootstrap, a test driver, a transport handing in an inbound frame, and the kernel’s own bookkeeping. Identity comes only from dispatch, so the sends a handler makes, and the tasks it spawns, are that agent’s.',
        'The same gate covers the edges around it. `watch` is gated, because a mirror of a target’s traffic is a read of it. Joining someone else’s named execution is gated, because you receive its recorded outcome. Grant maps are checked when they are written, so a malformed grant is refused with `invalid_meta` instead of failing quietly later. The e2e probe for the gate runs against both the Python and the Rust host.',
      ],
    },
  ],
  sources: [
    ['README.md', src('README.md')],
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['the call-gate e2e probe (E114)', src('e2e/tests/kernel/E114_call_gate/probe.py')],
    ['the Rust kernel crate', src('src/lib/rust/crates/fantastic-kernel/src')],
    ['the Python kernel', src('src/lib/python/kernel')],
  ],
  // Clips moved from the draft kernel article (rendered from anim/foundations/protocol_call_gate.py).
  clips: {
    gate: {
      title: 'The call gate: both ends must grant',
      caption: 'Agent a sends reflect to b. The send is refused at egress until a’s can_call names b, then at ingress until b’s callable_by names a. With both grants it passes, one way, for that verb only. Operator sends skip the gate.',
    },
  },
}
