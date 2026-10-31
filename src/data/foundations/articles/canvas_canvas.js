// Canvas › Canvas. Facts: coder/tmp/foundations/facts/canvas_canvas.md (fantastic main 22f88cb8).
import { src } from '../lib.js'

const BUNDLES = 'src/tui/web/canvas/src/bundles'

export default {
  headline: 'The canvas view: placing, moving, wiring and hiding cells',
  description: 'How the Aisixteen Fantastic canvas view places, moves, wires, hides and removes cells with its own verbs, where a cell’s position is stored, and how the double-click selector works.',
  summary: 'The view’s verbs over its cells: place, move, wire, hide, show, remove, and the selector popup.',
  cover: { clip: 'place' },
  about: ['Aisixteen Fantastic', 'Browser canvas', 'Agent user interface'],
  lead: [
    'A canvas page holds one **view**, `view_root`, and the view owns the cells on it. The page kernel has no verbs that create or delete agents anywhere. The view answers them for its own cells, so a human and an AI change the canvas through the same messages.',
    'This page covers those verbs, in the order you use them: `place`, `move`, `wire`, `hide`, `show` and `remove`, then the selector that a double-click opens. What a cell draws is covered in the other pages of this part.',
  ],
  sections: [
    {
      id: 'view',
      title: 'The view owns its cells',
      blocks: [
        'The page’s root agent, `canvas`, has no editing verb; asked for one, it answers that the view is the one to talk to. It holds the one view, and the view’s cells are the view’s children. The view answers `place`, `move`, `fit`, `update`, `wire`, `remove`, `hide`, `show`, `open`, `tree`, `theme` and `terminal_renderer`.',
        'The view is page-side TypeScript, packed into the binary. Calls reach it like calls to any agent, so the [call gate](/fantastic/foundations/protocol/call-gate/) judges them. The address of the root view is `<page guid>|view_root` (see [the canvas overview](/fantastic/foundations/canvas/)).',
      ],
    },
    {
      id: 'place',
      title: 'Place: a new cell at x, y',
      blocks: [
        'A `place` names what to make and where. The `kind` is `html`, `gl`, `terminal` or `chat`, or a `handler_module` that names any page bundle. `x` and `y` are required numbers in view coordinates, and a call without them is refused with `reason: "bad_arg"`.',
        'A `terminal` or `chat` cell needs a `backend_id`, the host agent it shows. A `place` with only a `backend_id` and no kind makes a view of that agent, drawn the way the agent’s own record says.',
        'The cell gets the id you pass, or `<kind>_` and eight hex digits. An id that already exists is refused with `reason: "exists"`, and the hint says to `update` it or `remove` it first. A cell with no size starts at 480 by 320.',
        { code: '[{"target": "<page guid>|view_root", "payload": {"type": "place", "kind": "html", "x": 80, "y": 60, "bytes": "<b>hello</b>"}}]', label: 'place an html cell (illustrative guid)' },
        'The body of an `html` or `gl` cell is `bytes`, taken verbatim. An html body that is empty, a placeholder or truncated is refused with the reason. `place` and `update` set only `display_name`, `html`, `gl_source`, `trusted`, `readme`, `can_call` and `callable_by`, and a field `place` does not take comes back in `ignored`. If the html calls an agent that the cell’s `can_call` lacks, the reply names the missing grants.',
        { video: 'place' },
      ],
    },
    {
      id: 'move',
      title: 'Move: a position lives in the layout',
      blocks: [
        'A cell’s `x`, `y`, `width` and `height` are not on the cell. They are in the view’s **layout** for the theme in use: one `layout.ts` child agent per theme, named `layout_<theme>`, whose `rects` map a cell id to its rectangle.',
        { code: 'layout_canvas   rects: {"html_1a2b3c4d": {"x": 80, "y": 60, "width": 480, "height": 320}}', label: 'a layout agent’s record (illustrative id)' },
        '`move {id, x?, y?, width?, height?}` rounds the values and merges them over the cell’s old rectangle in that layout. A `move` with no geometry is refused, and so is an id that is not a cell of this view. Dragging a cell by its head writes the same rectangle. `place` and `update` write their geometry there too.',
        'There are two stock themes. `canvas` is the free two-dimensional canvas. `mobile` is one column, 400 wide, and `auto` (the default) picks `mobile` in a tab narrower than 768 px. `theme {name}` chooses one. Switching moves the cells, never the agents, because each theme has its own `rects`.',
        'A cell with no rectangle in the theme in use is placed once by the layout. The free theme puts it in the nearest free space around the centre of what the tab shows, 24 px from other cells. The column puts it at the bottom.',
      ],
    },
    {
      id: 'wire',
      title: 'Wire: write a grant on both cells',
      blocks: [
        '`wire {sender, receiver, verbs}` is a grant. It adds the verbs to the sender’s `can_call` for the receiver and to the receiver’s `callable_by` for the sender. It writes each side only when that side is a cell of this view, because another agent’s record is not the view’s to write. A host agent as receiver gets only the sender’s side.',
        'The reply is `{wired: {sender, receiver, verbs}}`. The verbs are merged as a set, so a repeated `wire` adds nothing twice. A `wire` where neither agent is a cell of the view is refused with `not_found`. A `wire` without a sender, a receiver or a non-empty list of verbs is refused with `bad_arg`. The rule that decides whether the send then passes is the [call gate](/fantastic/foundations/protocol/call-gate/): both ends must grant it.',
        { code: '[{"target": "<page guid>|view_root", "payload": {"type": "wire", "sender": "chart_1", "receiver": "feed_1", "verbs": ["watch"]}}]', label: 'wire (illustrative ids)' },
        { video: 'wire' },
      ],
    },
    {
      id: 'hide',
      title: 'Hide, show and remove',
      blocks: [
        'Three verbs take a cell away, and they differ in what they leave. `hide {id}` takes the cell off the view. Its agent keeps running and its rectangles are kept. The id goes on the view’s own `hidden` list, which holds for every theme, so a reload keeps the cell hidden.',
        '`show {id, x?, y?}` removes the id from that list and the cell mounts again, live. The `x` and `y` are used only when the cell was hidden. A cell that is already shown keeps its place, and `move` is the verb for moving it. `hide` and `show` refuse anything that is not a cell, such as the background, a selector or a layout.',
        '`remove {id}` deletes the cell from the view and clears its hidden entry. The layout drops the rectangles of a cell that is gone. The click on a cell’s ✕ sends a hide. Shift+✕ and right-click then Delete delete the agent, and the head menu also offers Export…',
      ],
    },
    {
      id: 'selector',
      title: 'The selector: a popup that is an agent',
      blocks: [
        'A double-click on empty canvas, or Ctrl-K (Cmd-K on a Mac), adds a **selector** agent at that spot. A double-click inside a cell’s frame does not. Its id is `selector_` and eight hex digits, and its record holds the spot in view coordinates (`x`, `y`) and on the screen (`sx`, `sy`).',
        'The selector’s `boot` opens the popup on top of everything. When you pick a tile, press Esc or click away, the selector deletes itself, and what you picked is made at its spot. It is never a cell: the canvas draws no frame for it, and one left by a closed tab is removed when the page loads.',
        'While it exists, anyone with the grant can send it `tiles {typed?}`. The reply is `{tiles: [{label, kind, section, hint}]}`, the kinds a cell can be made of here for that text. The tiles come in sections: `host`, `coding`, `bundles`, `page`, `page_bundles` and `chats`. The built-in ones are `terminal`, `python agent`, `mcp connector`, `user store`, `html`, `stream`, `file tree`, `preview`, `canvas theme` and `tips`, plus the AI agent tile. The `coding` section lists `fantastic`, `claude`, `codex`, `aider` and `opencode` when they are on your `PATH`.',
        { video: 'selector' },
      ],
    },
  ],
  sources: [
    ['canvas_agent.ts: the view and its verbs', src(`${BUNDLES}/canvas/canvas_agent.ts`, 164)],
    ['canvas_agent.ts: wire', src(`${BUNDLES}/canvas/canvas_agent.ts`, 277)],
    ['layout.ts: rects per theme, hidden', src(`${BUNDLES}/canvas/layout.ts`, 4)],
    ['cell_menu.ts: ✕ hides, Shift+✕ deletes', src(`${BUNDLES}/canvas/cell_menu.ts`, 5)],
    ['selector_agent.ts: the selector', src(`${BUNDLES}/canvas/selector_agent.ts`, 4)],
    ['action_popup.ts: the tiles', src(`${BUNDLES}/canvas/action_popup.ts`, 96)],
    ['canvas.md: the view’s verbs', src('src/tui/docs/canvas.md', 1)],
  ],
  clips: {
    place: {
      title: 'Place and move a cell',
      caption: 'A send of place {kind: html, x: 80, y: 60} goes to view_root. The cell appears at 480 by 320, and its rectangle is written to layout_canvas. A move {id, x: 400} then rewrites only that rectangle. The cell itself is untouched.',
    },
    wire: {
      title: 'Wire, hide and show',
      caption: 'Cells chart_1 and feed_1 sit on the view. wire {sender: chart_1, receiver: feed_1, verbs: [watch]} adds watch to chart_1’s can_call and to feed_1’s callable_by. hide {id: feed_1} then takes feed_1 off the view and its agent keeps running, and show brings it back at the same place.',
    },
    selector: {
      title: 'The selector popup',
      caption: 'A double-click on empty canvas adds selector_3f9a1c20 at that spot and its popup opens. tiles answers with the sections of what can be made. The human picks html, the cell is placed at the spot, and the selector deletes itself.',
    },
  },
}
