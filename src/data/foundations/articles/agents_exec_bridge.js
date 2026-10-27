// Agents › Exec bridge. Facts: coder/tmp/foundations/facts/agents_exec_bridge.md (fantastic main df457a0f).
import { src, tree } from '../lib.js'

export default {
  headline: 'Exec bridge: a sealed command runner with a terminal and a wire',
  description: 'How the Aisixteen Fantastic exec_bridge runs commands as jobs, serves terminals on a pseudo-terminal, and gives each child a control wire back to the kernel.',
  summary: 'Runs allowlisted commands as jobs, serves terminals, and gives each child a wire to the kernel.',
  cover: { clip: 'terminal' },
  about: ['Aisixteen Fantastic', 'Process management', 'Terminal sessions'],
  lead: [
    'The `exec_bridge` agent is the edge where the kernel meets operating-system processes. It starts a command in the background, keeps its output, and can attach a terminal to it. It also hands the child one open socket, so the program can send messages back to the kernel.',
    'The bridge is **sealed by default** and runs only the command lines its operator allowlisted. [Security](/fantastic/foundations/protocol/security/#edges) explains that gate. This page covers what happens after a line passes: jobs, terminals and the wire.',
  ],
  sections: [
    {
      id: 'record',
      title: 'The record decides where and with what',
      blocks: [
        'A `start` names a `command` and its `args`. Everything else about the run comes from the agent’s record, never from the call. `cwd` is required: a bridge without one runs nothing. `env` holds the operator’s extra variables, and `inherit_env` names which of the kernel’s variables pass through (none by default, `["*"]` for all).',
        'A `start` that carries its own `env` or `cwd` is refused. The child’s environment is exactly what the record builds. The kernel’s own environment does not leak in.',
        'A bare command such as `ffmpeg` is looked up on the child’s `PATH` only. If the record passes no `PATH`, the start is refused and the refusal names it. Start an absolute path, or pass `PATH` through `inherit_env`.',
        'The command is one program. If `command` holds several words and `args` is empty, the refusal says to put the arguments in `args`.',
        { code: 'update_agent runner cwd=/srv/work inherit_env=\'["PATH"]\' allowed=\'["ffmpeg .*"]\'', label: 'a record that can run ffmpeg (illustrative id)' },
      ],
    },
    {
      id: 'jobs',
      title: 'A start is a job',
      blocks: [
        'Each `start` creates a **job**. It returns at once with `{job_id, status: "running", pty}`. There is no verb that blocks until the command ends, so many jobs run in parallel. The job’s output arrives as events on the agent: `job_started`, then a `progress` event for each line (`{job_id, n, line, stream}`), then `job_done` with `exit_code` and `ok`.',
        'A job is also a row in the kernel’s task table, and its `job_id` is that row’s id. `ps` lists it and `cancel task_id=<job_id>` ends it. The bridge’s `on_cancel` hook sends SIGKILL to the real process before the task is aborted ([Tasks](/fantastic/foundations/kernel/tasks/)). Deleting the agent or stopping the kernel kills its jobs the same way.',
        'To read output later, `tail` returns the last lines of any job and `grep` returns the lines that match a regex. Each line comes as `{n, stream, line}`. A job keeps its last 256 KiB of lines, and `stream` is `stdout`, `stderr` or `both`.',
        '`stop` sends SIGKILL to the job’s whole session: the command and everything it launched, such as a `server &` or a `nohup`. A process that leaves the session on purpose with `setsid` escapes. `interrupt` sends SIGINT, `clear` forgets finished rows, and leaving out `job_id` applies the verb to every job of the agent.',
        'Nothing restarts a job. `boot` does nothing, because a caller starts a command, not the record. A `monitor` verb can watch a running job and send the lines that match a regex to another agent, so a long run can be stopped early.',
        { video: 'jobs' },
      ],
    },
    {
      id: 'terminal',
      title: 'A terminal is a job on a pseudo-terminal',
      blocks: [
        'A `start` with `pty: {cols, rows}` runs the command on a pseudo-terminal, with `TERM=xterm-256color`. It passes the same gate and the same record rules as any job. If `command` is left out, the bridge runs the child’s own `$SHELL`, read from the environment the record passes down. With no `SHELL` there, the start is refused and says so. The shell is never guessed.',
        'A caller that cannot name its shell, such as a browser page, cannot write an exact `allowed` line for it. The record’s `shell` field permits exactly that one line on a PTY job: `true` for `$SHELL`, `"login"` for `$SHELL -l`. It is one line, not a pattern. Any other argument, and every pipe job, still needs an `allowed` match.',
        'A terminal job streams its output as `output {job_id, data}` events and ends with `job_done {job_id, exit_code, ok}`. You drive it with four verbs:',
        { table: { head: ['verb', 'what it does'], rows: [
          ['`write {job_id, data}`', 'types keystrokes or a paste; written in full and one write at a time per job'],
          ['`resize {job_id, cols, rows}`', 'sets the window size, and the program gets SIGWINCH'],
          ['`ack {job_id, chars}`', 'tells the reader how many characters the viewer has drawn'],
          ['`output {job_id, max_bytes?}`', 'returns the last 256 KiB of output, for a viewer that re-attaches'],
        ] } },
        'The `ack` verb is flow control. When more than 100,000 characters are unacknowledged, the reader stops reading the terminal, so the program fills the tty and slows down. When acknowledgements bring the backlog under 5,000, the reader resumes. An `output` replay clears the backlog, and the reader does not pause for it until that viewer sends its first `ack`.',
        'Each of these is a separate verb at the call gate, so a viewer granted only `status`, `output` and `ack` can watch a terminal but cannot type. Any caller the gate admits to a verb may use it on any job of this agent. `paste_image` saves an image of up to 5 MiB and types its path into the terminal.',
        { video: 'terminal' },
      ],
    },
    {
      id: 'wire',
      title: 'The wire back to the kernel',
      blocks: [
        'The bridge publishes one contract to its children: a **wire**. Each child inherits two environment variables. `FANTASTIC_CTRL_FD` is an already-open socket to the spawner. `FANTASTIC_SELF_ID` is the id of the owning agent, the bridge itself and not the job. Arguments arrive as ordinary argv.',
        'Each frame is `[4-byte big-endian length | kind | rest]`. Kind `T` carries a JSON envelope. Kind `B` carries a binary frame, so raw bytes cross without base64. The child sends six ops: `send`, `emit`, `watch`, `unwatch`, `onmessage` and `offmessage`. The parent answers with `reply`, `event` and `inbox`. A `rid` ties a `send` to its `reply`.',
        { code: '→ {"op": "send", "rid": 7, "target": "store", "payload": {"type": "get"}}\n← {"op": "reply", "rid": 7, "data": {…}}', label: 'a send over the wire (illustrative target)' },
        'The bridge relays a `send` to the kernel untouched. The relay runs as the runner, so the call gate judges the runner: its `can_call` must name the target, and the target’s `callable_by` must name the runner ([Security](/fantastic/foundations/protocol/security/#spawn)). You grant the runner, not the program.',
        'A frame is at most 16 MiB in both runtimes. A longer length prefix is a wire violation, and the relay closes the socket, so large data moves in chunks. When the child reads end-of-file on the fd, the kernel is gone. The child never dials a host. Its traffic goes to the spawner and from there to the kernel.',
        'A program that never reads the fd runs like any other OS process. One that wants a `kernel` object can send the bridge `connector`. That verb works even on a sealed bridge, and its reply is the source of a reference client in Python. The program pastes it at the top of its own file, and it gives `kernel.send`, `emit`, `reflect`, `watch` and `on_message`.',
        { video: 'wire' },
      ],
    },
    {
      id: 'mail',
      title: 'Mail for a running program',
      blocks: [
        'Any verb the bridge does not own is **mail** for the running program. It goes to the program’s `on_message` and is answered `{queued: true}`. With no live job it is an error, because a program that has exited has no inbox. A sealed bridge delivers nothing.',
        'A drive verb (`write`, `resize`, `paste_image`, `stop`, `interrupt` or `clear`) that names another job’s id never reaches a program’s `on_message`. Results come back as whatever the program emits on the bridge’s id.',
      ],
    },
    {
      id: 'limits',
      title: 'What the bridge does not do',
      blocks: [
        'The allowlist names which commands run. It does not contain them. A permitted `python3` still has `open()`, `socket` and `subprocess`. The readme says it plainly: opening this leg grants local code execution to whoever can reach it. Stronger containment would need an operating-system mechanism and is not built.',
        'The bridge starts commands. A folder with a program that answers its own verbs is a different mechanism, covered in [Kernel › Bundles](/fantastic/foundations/kernel/bundles/#folder-bundles).',
        { note: 'You open the bridge with `ingress_rule=allow_all_ingress`. Both runtimes refuse `password_ingress` on this edge when it is written: a process edge has no wire envelope, so no frame can present a token.' },
      ],
    },
  ],
  sources: [
    ['exec_bridge readme (Rust crate)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/readme.md', 1)],
    ['the verbs and the gate (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/lib.rs', 1)],
    ['terminal jobs and flow control (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/pty.rs', 26)],
    ['the control wire relay (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/relay.rs', 41)],
    ['spawning a job and its session kill (Rust)', src('src/lib/rust/crates/bundles/fantastic-exec-bridge/src/spawn.rs', 63)],
    ['the Python bundle', src('src/lib/python/bundled_agents/io/exec_bridge/src/exec_bridge/tools.py', 1)],
    ['the reference wire client (Python)', src('src/lib/python/bundled_agents/io/exec_bridge/src/exec_bridge/_connector.py', 1)],
    ['the exec_bridge folders', tree('src/lib/rust/crates/bundles/fantastic-exec-bridge')],
  ],
  clips: {
    jobs: {
      title: 'A start is a job',
      caption: 'Agent runner is sent start for ffmpeg. The reply returns job 41 as running at once. Lines arrive as progress events, then job_done with exit_code 0. A second job, 42, is stopped: stop sends SIGKILL to its whole session, and its status becomes stopped.',
    },
    terminal: {
      title: 'A terminal on a pseudo-terminal',
      caption: 'A start with pty cols 80 and rows 24 and no command runs the child’s own $SHELL as job 7. Keystrokes go in with write, and output events come back. When more than 100,000 characters are unacked, the reader pauses. After ack brings the backlog under 5,000, it resumes.',
    },
    wire: {
      title: 'The control wire',
      caption: 'The child inherits FANTASTIC_CTRL_FD. It writes a send frame for target store with rid 7. The relay forwards it as the runner. The call gate admits it only if the runner’s can_call names store, and then the reply with rid 7 comes back on the same fd. Without that grant the reply is a refusal.',
    },
  },
}
