// 4. Canvas: an app built on fantastic — pillar page. Published. Overview + one clip (its own:
// anim/foundations/canvas.py) + the list of its articles, which the page adds from registry.json.
import { src } from '../lib.js'

export default {
  headline: 'The canvas: an application made of agents',
  description: 'The Aisixteen Fantastic canvas is an app built on the kernel: a page that is its own kernel in the browser, bridged to the host kernel, where every cell is a view of an agent. The articles in this part cover each piece.',
  summary: 'The browser canvas as an application made of agents: a page kernel bridged to the host, cells that are views of agents, child canvases and the grants between them.',
  cover: { clip: 'cells' },
  about: ['Aisixteen Fantastic', 'Browser canvas', 'Agent user interface'],
  lead: [
    'The canvas is an example of building on the kernel. `fantastic canvas` serves a page from the binary where you build, run and wire systems visually with an AI, and every part of it is an agent.',
  ],
  sections: [
    {
      id: 'overview',
      title: 'A page that is a kernel',
      blocks: [
        'The page is its own kernel in the browser, bridged to the host kernel through the `canvas_ws` leg. It holds no memory and no AI. Every cell is a **view** of a host agent, such as a terminal, an AI chat, a python agent or an MCP server, or page-side content (`html`, `gl`).',
        { video: 'cells' },
        'Double-clicking opens the selector, which lists everything that can be placed there. In the README’s words: “Nothing floats on the canvas; every surface is a cell.”',
        '`new_canvas {name}`, sent to a canvas, makes a **child** canvas under it, and deleting a canvas deletes the canvases it spawned. Each canvas shows only its own subtree and the agents under no canvas. `user`, and every AI under a canvas, may call every host agent with every verb (granted on both sides); you narrow it with `update_agent`.',
      ],
    },
  ],
  sources: [
    ['README.md: the canvas', src('README.md', 305)],
    ['canvas.md', src('src/tui/docs/canvas.md', 11)],
    ['web.rs: the canvas tree, child canvases', src('src/tui/src/kern/web.rs', 1)],
  ],
  clips: {
    cells: {
      title: 'Every cell is a view of an agent',
      caption: 'The canvas page is its own kernel in the browser, bridged to the host kernel through canvas_ws. Each cell on the page is a view of a host agent: a terminal shows an exec_bridge job, a chat shows an AI agent. The page holds no memory and no AI.',
    },
  },
}
