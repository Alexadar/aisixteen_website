// 1. Protocol — pillar page. Published. Overview + one clip (reused from Call gate and grants)
// + the list of its articles, which the page adds from registry.json.
import { src } from '../lib.js'

export default {
  headline: 'The protocol: one message model for people, models and programs',
  description: 'The Aisixteen Fantastic protocol: every person, model and program is an agent that answers verbs, every interaction is one batch send, and a two-sided call gate decides who may call whom. The articles in this part cover each piece.',
  summary: 'One message model shared by humans, models and programs: verbs, batch send, the two-sided call gate, security, refusals, the ledger, transports and the shared contract.',
  cover: { clip: 'gate', from: 'protocol_call_gate' },
  about: ['Aisixteen Fantastic', 'Message passing', 'Agent protocol', 'Access control'],
  lead: [
    'Fantastic’s whole thesis is one sentence: “A shared system where human operators, statistical models, and programs are decentralized and flat, with a mediator that handles the communication exchange.” The protocol is what those peers say to each other, and it is the same for all three.',
  ],
  sections: [
    {
      id: 'overview',
      title: 'One message model',
      blocks: [
        'A model, a program, a file tree, a shell, a browser canvas and the person at the keyboard are all **agents**, addressed by id and reached the same way: one call, `send`. There is no client library. In the README’s words, “The protocol is the API”: every agent answers `{"type":"reflect"}` with what it is, and `docs` says how to call it.',
        'Every interaction is one batch send: a list of items, each `{target, payload}`, answered in order with `{pid, status, result}`. The payload’s `type` is the verb.',
        { code: '[{"target": "kernel", "payload": {"type": "reflect", "readme": true}}]', label: 'send' },
        'Who may call whom is decided by the **call gate**. It is deny-all and two-sided: a call passes only when the caller’s `can_call` and the target’s `callable_by` both grant it.',
        { video: 'gate', from: 'protocol_call_gate' },
        'What the protocol promises is written down once, as data. The `contract/` folder holds cases that every runtime replays with its own runner, “instead of being written four times in four languages and drifting.”',
      ],
    },
  ],
  sources: [
    ['THESIS.md', src('THESIS.md', 5)],
    ['README.md: agents and send', src('README.md', 16)],
    ['README.md: the protocol is the API', src('README.md', 22)],
    ['README.md: one batch send', src('README.md', 27)],
    ['README.md: the call gate', src('README.md', 45)],
    ['contract/README.md', src('contract/README.md', 3)],
  ],
}
