// User. Every claim is in coder/tmp/foundations/facts/canvas_user.md (fantastic main 22f88cb8).
import { src, tree } from '../lib.js'

const U = 'src/tui/bundles/fantastic-user/src'

export default {
  headline: 'User: the one human as an agent',
  description: 'How the Aisixteen Fantastic user agent makes every call of the canvas and the terminal: forward, the call gate’s view of it, around, path and inquiries.',
  summary: 'user is the human as an agent: every canvas call is user.forward, sent as user.',
  cover: { clip: 'forward' },
  about: ['Aisixteen Fantastic', 'Agent identity'],
  lead: [
    'The kernel knows only agents, so the person at the keyboard is one too. It is called `user`, its handler is `user.tools`, and every call the terminal and the canvas make goes out through it. That makes `user` the sender: its grants are the ones checked, and replies route back to it.',
    'This page covers what `user` does with a call from a canvas tab, why the [call gate](/fantastic/foundations/protocol/call-gate/) judges it and not the tab, and the other verbs it answers: `around`, `path` and the inquiries. The canvas leg that carries the tab’s frames is in [Web agents](/fantastic/foundations/agents/web/#ws). The `user` agent described here is the one in the Rust canvas host.',
  ],
  sections: [
    {
      id: 'one-human',
      title: 'One human, one agent',
      blocks: [
        'The agent id is `user`. In the terminal the code says the terminal “IS an agent on the spine, not a client of a server”, and its reads and acts go out as the **sender** `user`.',
        'In the canvas tree `user` is the root of the host’s web agents: `web` is its child, and the canvas leg `canvas_ws` and the page server `canvas_page` sit under `web`. `user` also carries a `page_loader` field naming `web_loader`, the agent that holds the canvas page’s records.',
        { code: 'user\n└── web\n    ├── canvas_ws\n    └── canvas_page', label: 'the canvas host’s first agents' },
        'A canvas tab never calls a host agent itself. The leg’s only call target is `user`: `user`’s `callable_by` names `canvas_ws` with `user`’s own verbs, and `canvas_ws`’s `can_call` is rewritten to `user`, plus each connected page’s own agents. Beyond that the leg holds only `watch` and `emit` on every agent, and `state_subscribe` on the root and the kernel. Every call to a host agent goes through `user`.',
      ],
    },
    {
      id: 'forward',
      title: 'forward: the call leaves as user',
      blocks: [
        'The page wraps each call to a host agent as `forward {target, payload, timeout?}` (**forward** is the verb that carries a call) and sends it to `user`. A call addressed to `user` itself is sent as its own payload, unwrapped.',
        { code: '{"type": "forward", "target": "notes",\n "payload": {"type": "reflect"}}', label: 'what the page sends user (illustrative target)' },
        '`user` sends `payload` to `target` from inside its own handler, so the sender of that onward send is `user`. The reply comes back verbatim, binary bodies included. The verb needs a non-empty `target` string and a `payload` object, or it answers `bad_arg`; a `timeout` must be a number.',
        'There is no default timeout. The call lasts as long as the target takes, which matters for an AI turn that runs for minutes. A `timeout` that is given is honoured, and a call that runs out with no result answers `timed_out`.',
        '`forward` adds no secret marks of its own, so values travel and are recorded as they are. A secret mark the caller put under `payload` is carried onto the onward send, so [records](/fantastic/foundations/kernel/records/) mask it the same way. Who may call `forward` is `user`’s `callable_by` and nothing else.',
        { video: 'forward' },
        'A tab checks at start that it is admitted. It sends `user.forward` of `reflect` to `kernel`, and if the answer’s reason is `unauthorized` the page shows the refusal and runs nothing else.',
      ],
    },
    {
      id: 'gate',
      title: 'What the gate sees',
      blocks: [
        'Because the onward send is `user`’s, the call gate checks `user`’s `can_call` and the target’s `callable_by`, as it does for any send. The tab’s own rights do not enter into it.',
        'The canvas host writes both edges for `user` by grants. `user`, the canvas’s AI agents and a few host helpers hold every agent on both edges, in the code’s words **god mode by grants**: the target’s `callable_by` names each holder and each holder’s `can_call` names the target. The human reshapes them with `update_agent`. A cabinet’s agents are not reached this way.',
        'So narrowing `user`’s `can_call` is how the person limits what the canvas can do. The next `forward` is refused at egress, with the refusal the [call gate](/fantastic/foundations/protocol/call-gate/) describes.',
        'Every agent except stores and a cabinet’s agents may also `send` to `user`, on both edges, so that an exec agent’s monitor delivery, a sub-routine the AI built or an inquiry’s answer can reach it.',
        'The reverse is refused. `send` is not a verb of the human, and `user` answers it with reason `unhandled` and the text “use `forward`”.',
        { video: 'gate' },
      ],
    },
    {
      id: 'around',
      title: 'around and path',
      blocks: [
        '`around {canvas?, view?, theme?, x, y, radius}` lists the cells of a page view that lie within `radius` of a point, nearest first. It reads the page records, defaulting to the main canvas, the view `view_root` and the theme `canvas`. A cell’s rectangle comes from the view’s layout for that theme.',
        { code: '{"view": "view_root", "members": [{"id": …, "kind": …, "title": …,\n  "rect": {"x": …, "y": …, "w": …, "h": …}, "distance": …, "backend_id": …}]}', label: 'around (shape; backend_id when the cell has one)' },
        'Distance runs to the rectangle’s nearest edge and is 0 inside it. `x`, `y` and `radius` must be numbers with `radius` above 0, or the reply is `bad_arg`. An unknown view is `not_found`.',
        'The caller’s own grants judge the result. A caller with no origin, the shell, sees every cell. Any other caller sees a cell only if its `can_call` holds an entry `<tree guid>|<id>` for the cell or an ancestor, or `<tree guid>|*`; `*|*` covers every tree.',
        '`path {rescan?}` answers `{dirs, executables, self}`: the PATH directories, every executable on them by name with its full path, and the running fantastic’s own executable. PATH is this process’s merged with the login shell’s, because a CLI started from a service has a narrower one. The first directory wins, and `executables.fantastic` is always the running one.',
        'The scan runs when `user` boots and stays in RAM; `rescan: true` scans again. What a name means, a coding agent or an editor, is for the caller to decide.',
      ],
    },
    {
      id: 'inquiries',
      title: 'Inquiries: an agent asks the person',
      blocks: [
        'An agent that needs the person sends `user` an `inquiry {text, kind?, options?, request_id?}`. The `kind` is `text` (the default), `single`, `multi` or `confirm`; `single` and `multi` need `options`. Nothing suspends. `user` accepts it at once and holds it as open.',
        { code: '{"accepted": true, "re": 4655, "request_id": null, "open": 1}', label: 'the inquiry reply (illustrative pid)' },
        '`re` is the pid of the task the inquiry runs under, and it is the handle for the answer. `inquiries {asker?}` lists the open ones, oldest first, and the canvas shows each as a card in the asker’s chat.',
        '`answer_inquiry {re, answer}` takes words, a list of picks or true or false. `user` sends the asker a `send` on its own thread, then closes the inquiry. If the answer does not reach the asker, the inquiry stays open and the reply is `refused`.',
        { code: '[reply to 4655 · user inquiry]\n<answer>yes</answer>\n<request_id></request_id>', label: 'what the asker reads (illustrative pid)' },
        'Open inquiries live in RAM only. A host restart forgets them, and the asker’s own history keeps the question.',
        { video: 'inquiry' },
      ],
    },
    {
      id: 'more',
      title: 'The rest, and the Python twin',
      blocks: [
        '`user` also answers `export_subtree` and `import_subtree`, which write an agent and everything under it as a blueprint folder and bring one back as a live subtree. They are not covered here.',
        'The Python `user.tools` answers only `reflect`, `export_subtree` and `import_subtree`. `forward`, `around`, `path` and the inquiries are verbs of the Rust canvas host.',
      ],
    },
  ],
  sources: [
    ['user bundle: verbs, forward, around, the send refusal', src(`${U}/lib.rs`, 1)],
    ['inquiries: ask, list, answer', src(`${U}/inquiries.rs`, 1)],
    ['grants.rs: how page grants decide what around shows', src(`${U}/grants.rs`, 1)],
    ['path.rs: the human’s programs', src(`${U}/path.rs`, 1)],
    ['web.rs: the canvas tree and the leg that reaches only user', src('src/tui/src/kern/web.rs', 1)],
    ['reach.rs: god mode by grants, and the way back', src('src/tui/src/kern/reach.rs', 1)],
    ['user_bridge.ts: the page wraps every call as forward', src('src/tui/web/canvas/src/user_bridge.ts', 1)],
    ['Python user.tools', src('src/lib/python/bundled_agents/io/user/src/user/tools.py', 1)],
  ],
  clips: {
    forward: {
      title: 'Every call goes out as user',
      caption: 'A canvas tab wraps its call as forward {target: "notes", payload: {type: "reflect"}} and sends it to user. user sends the payload to notes with its own id as the sender. notes replies, and the reply comes back to the tab verbatim, with no default timeout.',
    },
    gate: {
      title: 'The gate judges user’s grants',
      caption: 'With user.can_call and notes.callable_by both granting, a forward gets its reply. The person narrows user.can_call with update_agent and the next forward is refused at egress. A send to user itself is refused with reason unhandled: send is not a verb of the human.',
    },
    inquiry: {
      title: 'An inquiry is held, then answered',
      caption: 'The agent ai_1 sends user an inquiry of kind confirm. user answers {accepted: true, re: 4655} at once and holds it in RAM. The person calls answer_inquiry with re 4655 and yes, and ai_1 receives “[reply to 4655 · user inquiry]” with yes on its own thread.',
    },
  },
}
