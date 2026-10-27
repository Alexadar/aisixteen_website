// Agents › Program agents. Facts: coder/tmp/foundations/facts/agents_program_agents.md
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src } from '../lib.js'

const R = 'src/lib/rust/crates/bundles/fantastic-py-agent/src/lib.rs'
const PY = 'src/lib/python/bundled_agents/io/py_agent/src/py_agent'

export default {
  headline: 'Program agents: a process that answers the bundle’s verbs',
  description: 'How an Aisixteen Fantastic py_agent program works: the wire it speaks, hello, call and result, emit and send, and what happens when the process stops.',
  summary: 'A program says hello with its verbs, answers calls, can send and emit, and stops with a reason.',
  cover: { clip: 'call' },
  about: ['Aisixteen Fantastic', 'Agents', 'Inter-process communication'],
  lead: [
    'A **program agent** is an ordinary agent whose handler is a process. The kernel starts the process, forwards each verb to it as a message, and returns what it answers. To a caller it is an agent like any other; nothing in the call tells the two apart.',
    'The base that does this is `py_agent`. How a folder with a `bundle.yaml` becomes a bundle is on [Bundles](/fantastic/foundations/kernel/bundles/#folder-bundles). This page is about the running program: what it sees, what it can do, and how it ends. [A program agent](/fantastic/foundations/build/program-agent/) builds one from the starter.',
  ],
  sections: [
    {
      id: 'start',
      title: 'Start and hello',
      blocks: [
        'Each instance of a folder bundle starts its program on `boot`. The command from `bundle.yaml` runs with the bundle folder as its working directory. Starting again while the program runs does nothing.',
        'The program gets only the environment that its record names in `inherit_env` (a list of variable names, or `"*"`), plus two variables the kernel sets: `FANTASTIC_CTRL_FD`, a socket the child inherits, and `FANTASTIC_SELF_ID`, the id of its agent. The record is the `record` defaults from `bundle.yaml`, overlaid by the instance’s own record. A bare command such as `python3` has no `PATH` to be found in, so the start is refused with `missing_arg` and the hint `bundle.yaml record: {inherit_env: [PATH]} (or an absolute command)`.',
        'The first thing the program writes on that socket is `{"op": "hello", "verbs": [...]}`. The verbs must equal the `verbs` of `bundle.yaml`. If they do, the instance becomes `running` and emits `{"type": "status", "phase": "running"}`. If they do not, the kernel kills the program and the instance stops with the reason in `reflect`.',
        { code: '<name>: the program serves [\'echo\'] but bundle.yaml declares [\'echo\', \'shout\'] — they must match', label: 'the reason a mismatch leaves (illustrative verbs)' },
        'A call that arrives before `hello` waits for it. If the program never says hello, the caller’s own timeout is what ends the wait.',
        { video: 'hello' },
      ],
    },
    {
      id: 'wire',
      title: 'The wire',
      blocks: [
        'The socket is the same connector channel that [Exec bridge](/fantastic/foundations/agents/exec-bridge/) offers to the programs it runs, and `py_agent` reuses its relay. Each frame is a 4-byte big-endian length, one byte for the kind, then the body. Kind `T` is a UTF-8 JSON message. Kind `B` carries raw bytes next to a JSON header, so binary data is never base64.',
        'A `py_agent` program uses three messages of its own, `hello`, `call` and `result`, and from the connector `send` (with its `reply`) and `emit`:',
        { table: { head: ['direction', 'message', 'meaning'], rows: [
          ['program → kernel', '`{op: "hello", verbs}`', 'first; the verbs it serves'],
          ['kernel → program', '`{op: "call", rid, payload}`', 'one verb call; `payload` is the whole send payload, `type` included'],
          ['program → kernel', '`{op: "result", rid, result}`', 'the answer to the call with that `rid`'],
          ['program → kernel', '`{op: "send", rid, target, payload}`', 'call another agent; the answer comes back as `{op: "reply", rid, data}`'],
          ['program → kernel', '`{op: "emit", payload}`', 'an event on the program’s own agent'],
        ] } },
        'The `rid` is a counter per instance; it pairs a result with its call. The connector has more ops (`watch`, `onmessage`); a plain `py_agent` program needs none of them.',
      ],
    },
    {
      id: 'helper',
      title: 'The program’s side: fantastic_agent.py',
      blocks: [
        'The repository carries a reference helper, `fantastic_agent.py`, that speaks this wire. It uses only the Python standard library, and a program copies it next to its own file. It is a convenience: any language that can read and write the socket can do the same.',
        { code: 'import fantastic_agent as fa\n\ndef search(p):                 # p = {"type": "search", ...}\n    return {"hits": [...]}\n\nfa.serve({"search": search})   # hello, then answer calls', label: 'a program (shape)' },
        '`fa.serve(handlers)` sends `hello` with the sorted verb names, then reads frames. Each `call` is queued for a worker thread, which runs `handlers[type](payload)` and writes the return value as the `result`. Calls run one at a time, in order. A handler returns a plain object: an answer, or a refusal shaped `{"error", "reason"?, "hint"?}`. A refusal is data, so it reaches the caller unchanged ([Refusals](/fantastic/foundations/protocol/refusals/)).',
        'If a handler raises, the helper prints the traceback to stderr and answers `{"error": "<verb> raised <ExceptionName>: <message>"}`. The program keeps running. When the kernel closes the socket, the helper exits the process.',
        { video: 'call' },
      ],
    },
    {
      id: 'out',
      title: 'Calling out and emitting',
      blocks: [
        '`fa.send(target, payload)` writes a `send` message and waits for the `reply`. The kernel makes one ordinary [send](/fantastic/foundations/protocol/messages/) on the program’s behalf, as the program’s agent. That agent’s `can_call` and the target’s `callable_by` decide whether it goes through ([the call gate](/fantastic/foundations/protocol/call-gate/)). A program holds exactly the reach of its agent, and you grant that agent.',
        'Because calls run on a worker thread while the main thread keeps reading, a handler may call `fa.send` and still receive the reply. A program can therefore ask another agent for something in the middle of answering its own caller.',
        '`fa.emit(payload)` writes an `emit` message. The payload becomes an event in the inbox of the program’s agent, where anything that watches the agent sees it. It is how a program reports progress while a call is still open.',
        { video: 'out' },
        { note: 'The program is still a process with the user’s OS rights. What it does with its own files, subprocesses and network never passes a gate; only the verbs that reach it, and the sends it makes through the socket, do. [Security](/fantastic/foundations/protocol/security/) draws that line.' },
      ],
    },
    {
      id: 'stop',
      title: 'How a program stops',
      blocks: [
        'A program stops when its agent is deleted, when the kernel stops, when the instance receives `shutdown` (a reload sends it), when one of the program’s tasks is cancelled ([Tasks](/fantastic/foundations/kernel/tasks/)), when `hello` mismatches, or when the process exits on its own. Unless it exited, the kernel kills the program’s whole session.',
        'Whatever the cause, every call in flight settles at once as `transport_closed` with the reason as its message. Later calls get the same refusal with a hint: `fix the bundle, then the root’s reload_bundle restarts it`. Nothing respawns the process.',
        { code: '{"error": "…", "reason": "transport_closed", "hint": "fix the bundle, then the root’s reload_bundle restarts it"}', label: 'a call to a stopped program (fields, not exact text)' },
        'When the process exits by itself, the reason is `<id>: its program exited (code N)`. `exit_code` is kept, and the instance emits `{"type": "status", "phase": "stopped", "reason": "exited", "code": N}`. The kernel reads stdout and stderr so that a chatty program never blocks on a full pipe, and it keeps the last 2000 characters of stderr.',
        '`reflect` on an instance shows the state: `id`, `sentence`, `base`, `bundle`, `folder`, `program` (`not started`, `starting`, `running` or `stopped`) and `security`. When they exist it adds `exit_code`, `program_error` (the stop reason) and `stderr_tail`, which is usually where a crash’s traceback is.',
        { video: 'stop' },
      ],
    },
    {
      id: 'both',
      title: 'Rust and Python',
      blocks: [
        'The Rust crate describes itself as the Python `py_agent.tools`, “text for text”, and the two runtimes follow the same protocol, refusals and `reflect` fields. One small difference: Rust also compares the number of verbs in `hello`, so a verb listed twice fails, while Python compares them as sets. The Rust crate registers only in a build with the `full` feature ([Bundles](/fantastic/foundations/kernel/bundles/)).',
      ],
    },
  ],
  sources: [
    ['py_agent in Rust: start, hello, call, stop', src(R, 280)],
    ['py_agent in Python: _start, _hello, _call, _stop', src(`${PY}/tools.py`, 194)],
    ['fantastic_agent.py: serve, send, emit', src(`${PY}/fantastic_agent.py`, 74)],
    ['the relay: send and emit ops (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/relay.rs', 394)],
    ['the child’s environment and fds (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/spawn.rs', 91)],
    ['tests: verbs, mismatch, exit, delete, cancel', src('src/lib/rust/crates/bundles/fantastic-py-agent/src/tests.rs', 123)],
  ],
  clips: {
    hello: {
      title: 'hello: the program names its verbs',
      caption: 'The kernel starts the program for agent tool with FANTASTIC_CTRL_FD. The program writes hello with [echo]. They match bundle.yaml, so the instance is running. A second program writes hello with [echo, shout] against a bundle that declares only echo, and the instance stops with “they must match”.',
    },
    call: {
      title: 'A call, a result, a raise',
      caption: 'A caller sends {type: echo} to tool. The kernel forwards call rid 1 with the whole payload. The handler returns {echo: "hi"}, which goes back as result rid 1, and the caller receives it. A handler that raises answers {error: "echo raised ValueError"} and the program keeps running.',
    },
    out: {
      title: 'send and emit from inside a handler',
      caption: 'While answering call rid 2, the handler writes send to agent store. The kernel sends it as tool, checks the gate, and returns reply rid 1 with the data. The handler then writes emit progress, which a watcher of tool sees, and finishes with result rid 2.',
    },
    stop: {
      title: 'When the process stops',
      caption: 'A call rid 3 is in flight. The program exits with code 1. The in-flight call settles as transport_closed with “its program exited (code 1)”, the instance emits status stopped, and the next call is refused with the hint to use reload_bundle. Nothing respawns.',
    },
  },
}
