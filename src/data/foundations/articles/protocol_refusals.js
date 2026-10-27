// SEED — Refusals. Status: planned (see registry.json); this page is not published.
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
  sections: [
    {
      id: 'seed',
      title: 'From the draft (the gate refusals)',
      blocks: [
        'A refusal says which half failed. Egress is checked first, so a call with neither half granted reports egress:',
        { code: '{"error": "a may not call \'reflect\' on b", "reason": "unauthorized", "side": "egress", "hint": "grants come from above ..."}\n{"error": "b does not accept \'reflect\' from a", "reason": "unauthorized", "side": "ingress", "hint": "..."}', label: 'the two refusals' },
        'Fourteen verbs belong to the kernel, and only the root answers them: `create_agent`, `update_agent`, `delete_agent`, `list_agents`, `ps`, `cancel`, `ledger`, `ack_deadletter`, `await_set`, `await_cancel`, `kernel_start`, `shutdown_agents`, `kernel_stop` and `docs`. The agent you name is the operand, not the actor, so a kernel verb sent to any other agent is refused with `not_here` and the fix.',
      ],
    },
  ],
  sources: [
    ['system-verbs.md (the kernel verbs)', src('src/lib/rust/crates/bundles/fantastic-core/src/docs/system-verbs.md')],
    ['the call-gate e2e probe (E114)', src('e2e/tests/kernel/E114_call_gate/probe.py')],
  ],
}
