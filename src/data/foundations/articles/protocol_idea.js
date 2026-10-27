// The idea. Facts: coder/tmp/foundations/facts/idea.md (fantastic main b175660c).
import { src } from '../lib.js'

export default {
  headline: 'The idea: everything is an agent that answers verbs',
  description: 'Aisixteen Fantastic treats humans, models and programs as flat peers: each is an agent with an id, reached by one call, send, through one mediating kernel.',
  summary: 'Humans, models and programs are flat peers; one kernel mediates; every agent answers verbs.',
  cover: { clip: 'peers' },
  about: ['Aisixteen Fantastic', 'Agents', 'Messaging'],
  lead: [
    'Fantastic starts from one sentence. Humans, statistical models and programs are peers: none sits above another, and none is built into another. A single mediator handles the exchange between them.',
    'This page explains that sentence in terms of the code. It shows what an agent is, how a person, a model and a program each become one, and what the mediator does.',
  ],
  sections: [
    {
      id: 'thesis',
      title: 'One sentence',
      blocks: [
        { quote: 'A shared system where human operators, statistical models, and programs are decentralized and flat, with a mediator that handles the communication exchange.', cite: 'THESIS.md' },
        '**Flat** means no kind of participant is special. A human, a model and a program are reached the same way. **Decentralized** means no one of them runs the others. In the code, the **mediator** is the kernel: it holds the one table of agents, checks each call, and tracks the work in flight.',
        'The README states the same thing as a rule. A model, a program, a file tree, a shell, a browser canvas and the human at the keyboard are all agents in one tree, addressed by id and reached the same way: one call, `send`.',
        { video: 'peers' },
      ],
    },
    {
      id: 'agent',
      title: 'One node type: the agent',
      blocks: [
        'The code has a single kind of node. The Rust source calls the `Agent` “the substrate’s only node type”, and the Python source begins “Every entity in the system is an Agent.”',
        'An **agent** has an `id`, a `handler_module` and a `parent_id`, plus any other fields its bundle needs. The `handler_module` names the **bundle** (a handler module) that answers its calls. The root and other bare agents have none by default. The record is saved as `agent.yaml`.',
        { code: '{"id": "notes", "handler_module": "file_bridge.tools", "parent_id": "kernel"}', label: 'an agent record (illustrative id)' },
        'Agents form a tree, and each agent can create children under itself. The tree is for ownership and lifetime. It plays no part in routing.',
      ],
    },
    {
      id: 'routing',
      title: 'The mediator routes by id',
      blocks: [
        'Every call goes through the kernel. In the Rust source, “the kernel’s `agents` map is the only routing table”, and `send` resolves the target id there directly. The Python kernel does the same with its flat `ctx.agents` dict, and bundles never call each other’s handler functions.',
        'A call to an agent three levels deep is resolved the same way as a call to one at the top: by its id, with no walk through the agents in between. Agents address each other by id and hold no references to one another.',
        { video: 'table' },
        'The kernel also does the bookkeeping that makes the exchange safe. Every call is checked by the two-sided call gate, and every call runs as a task you can list with `ps` and stop with `cancel`. [Call gate and grants](/fantastic/foundations/protocol/call-gate/) covers the first, and [Messages and verbs](/fantastic/foundations/protocol/messages/) covers tasks, `ps` and `cancel`.',
      ],
    },
    {
      id: 'peers',
      title: 'Three kinds of peer',
      blocks: [
        'A person, a model and a program differ in what stands behind the agent. They do not differ in how they are called.',
        { table: { head: ['peer', 'agent', 'what stands behind it'], rows: [
          ['human', '`user` (`user.tools`)', 'The one human, as an agent. In the terminal app, every call the terminal and the canvas make goes out through it, so it is the sender and its grants are checked.'],
          ['model', 'an AI backend (vLLM, Ollama, OpenAI Responses, Anthropic, Apple on-device)', '`send {text}` runs one turn. The model names its calls in `<call>` tags, and the kernel dispatches them as ordinary sends.'],
          ['program', 'a `py_agent` folder bundle', 'A `command` the kernel starts when the agent boots and kills when it is deleted. Calls reach it as `{op: "call"}` messages and come back as `{op: "result"}`.'],
        ] } },
        'The human’s side differs between the two runtimes. The Python `user` bundle answers `reflect`, `export_subtree` and `import_subtree`. The terminal app’s `user` also has `forward {target, payload}`, which sends a payload to a target and returns the reply.',
        'A model pass is one provider call with no loop. The model’s reply is parsed for `<call>` tags, each call is sent to its target, and each reply goes to the call’s `reply_to`. Nothing uses a provider’s native tool API.',
        'A program declares its verbs in `bundle.yaml`, and the kernel treats the running process as a full agent. The program runs with the user’s OS rights, and its own subprocesses, files and network never pass the gate.',
      ],
    },
    {
      id: 'verbs',
      title: 'Every agent answers verbs',
      blocks: [
        'A **verb** is the `type` field of a payload. Every agent answers `reflect` with what it is: its id, a one-line `sentence`, its parent and its handler. The root answers with the sentence “Fantastic kernel. Everything is reachable by sending messages to agents.”',
        'The kernel answers `docs` for any agent too, and `docs` says how to call that agent. These two verbs are the whole self-description. The README states that there is no client library, and that the protocol is the API.',
        { code: '[{"target": "kernel", "payload": {"type": "reflect"}}]', label: 'one call: send to the kernel' },
        'Every call is a batch: a list of items, each `{target, payload}`. The kernel runs them concurrently and answers a list of `{pid, status, result}` in input order. There is deliberately no single-call form, so one call is a batch of one.',
        { video: 'reflect' },
        'The two runtimes keep this the same. The Rust kernel (`fantastic-kernel`) and the Python kernel (`kernel/`) both implement the agent record, the one routing table and the `reflect` and `docs` verbs. [Messages and verbs](/fantastic/foundations/protocol/messages/) covers the batch, its statuses and both verbs in full.',
      ],
    },
  ],
  sources: [
    ['THESIS.md', src('THESIS.md')],
    ['README.md: the idea in one call', src('README.md', 27)],
    ['Rust Agent: the only node type', src('src/lib/rust/crates/fantastic-kernel/src/agent.rs', 1)],
    ['Rust routing: the only table', src('src/lib/rust/crates/fantastic-kernel/src/send.rs', 5)],
    ['Python Agent: routing and lifecycle', src('src/lib/python/kernel/_agent.py', 1)],
    ['the user agent (terminal app)', src('src/tui/bundles/fantastic-user/src/lib.rs', 1)],
    ['py_agent: a program as an agent', src('src/lib/rust/crates/bundles/fantastic-py-agent/src/lib.rs', 1)],
    ['AI backends: one pass per send', src('src/lib/rust/crates/bundles/fantastic-ai-core/src/lib.rs', 1)],
  ],
  clips: {
    peers: {
      title: 'Three peers, one mediator',
      caption: 'A human (user), a model (ai) and a program (tool) sit around the kernel as equals. The human’s send goes to the kernel, which routes it to ai. ai then sends to tool through the kernel as well. No peer calls another directly.',
    },
    table: {
      title: 'Routing by id, not by tree',
      caption: 'The tree on the left has kernel, notes and, under notes, a worker. The table on the right lists every agent id once. A send to worker is looked up in the table and delivered directly, without passing through notes.',
    },
    reflect: {
      title: 'Every agent answers reflect',
      caption: 'The same send, {"type": "reflect"}, goes to kernel, user and ai in one batch. Each answers with its id and a sentence, and the replies come back in input order. The sentences shown are illustrative, and the kernel\u2019s is shortened.',
    },
  },
}
