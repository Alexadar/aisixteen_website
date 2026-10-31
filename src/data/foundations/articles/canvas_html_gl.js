// Canvas › HTML and GL agents. Facts: coder/tmp/foundations/facts/canvas_html_gl.md
// Format: see src/data/foundations/STYLE.md and articles/_template.js.
import { src } from '../lib.js'

const B = 'src/tui/web/canvas/src/bundles'

export default {
  headline: 'HTML and GL agents: a page or a WebGL scene as an agent',
  description: 'How Aisixteen Fantastic page agents work: html_agent holds a sandboxed panel body whose calls are gated by the cell’s can_call; gl_agent holds a THREE scene that runs in the page itself.',
  summary: 'An html agent is a sandboxed panel with a connector; a gl agent is a scene in a shared THREE renderer.',
  cover: { clip: 'html_set' },
  about: ['Aisixteen Fantastic', 'Canvas', 'WebGL'],
  lead: [
    'Two kinds of cell on a canvas hold content instead of fronting a host agent. An **html agent** holds the body of a web page. A **gl agent** holds the source of a WebGL scene. Both are ordinary agents with a record, verbs and a `can_call`.',
    'They are page-side TypeScript: they run in the browser’s kernel, and the code says each was ported from a host Python bundle that no longer exists. So this page describes one implementation, with no Rust or Python twin.',
  ],
  sections: [
    {
      id: 'html',
      title: 'An html agent holds a body',
      blocks: [
        'The handler module is `html_agent.ts`. The body is a string in the agent’s `meta.html`. `get_html` returns `{id, html}`, and `set_html` replaces the body. A cell answers `get_html` and `set_html` (`render_html` is a second name for `get_html`), plus the three `panel_*` relay verbs the panel’s own calls use; any other verb is refused with `unhandled` and a hint that placing, moving and wiring cells are the view’s verbs.',
        'A view creates the cell with `place {kind: "html", …}` and changes it with `update {id, bytes}`; those verbs belong to the canvas view, covered in [Canvas](/fantastic/foundations/canvas/canvas/). `set_html` takes the markup as `bytes`, verbatim. After it stores the body, the agent emits `{"type": "reload_html"}` on itself, and the cell’s panel draws the new body in place.',
        'A **page bundle** is a folder under the canvas’s `bundles/` whose `bundle.yaml` has `base: html_agent`, a `sentence` and an `html:` body. Every instance starts with that body until it gets its own from `set_html`. The page kernel loads these. They are not the host’s [folder bundles](/fantastic/foundations/kernel/bundles/#folder-bundles), which extend only `py_agent`.',
        { video: 'html_set' },
      ],
    },
    {
      id: 'check',
      title: 'What counts as a body',
      blocks: [
        'Before it writes a body, `set_html` checks the shapes that never render a panel. It refuses a body that is empty, has no element (it reads as text), opens a `<script>`, `<style>` or `<textarea>` and never closes it, or ends inside a tag. The last two are what a truncated body looks like. The page bundle’s own `html:` gets the same check when the bundle loads.',
        { code: '{"error": "html_agent: the html body is not html — it is empty", "reason": "bad_arg", "arg": "bytes", "hint": "send the panel\'s WHOLE markup as <bytes>…</bytes> — verbatim, nothing elided"}', label: 'the refusal (the reason after the dash varies)' },
        'A refusal is data, so the AI that wrote the body reads it and sends the whole markup again ([Refusals](/fantastic/foundations/protocol/refusals/)). A reply that passes is `{ok: true, bytes: N}`, possibly with the grant hint below.',
      ],
    },
    {
      id: 'sandbox',
      title: 'The sandbox and the connector',
      blocks: [
        'The panel draws the body in an `iframe` whose `srcdoc` is a small document: a `<script>` with the connector in `<head>`, then the body. The frame has `sandbox="allow-scripts"`, so it runs scripts with a null origin. If the agent’s record has `trusted: true`, the frame has no sandbox and shares the page’s origin. The code reserves that for the operator’s own content.',
        'The connector defines `fantastic` in the frame, and its only channel to the outside is `postMessage` to the page.',
        { table: { head: ['call', 'what it does'], rows: [
          ['`await fantastic.send(target, payload)`', 'one send; resolves with the reply'],
          ['`fantastic.emit(target, payload)`', 'an event into the target’s inbox; no reply'],
          ['`fantastic.watch(src, cb)`', 'events of `src`; returns a function that stops it'],
          ['`fantastic.onMessage(cb)`', 'messages sent to this cell'],
          ['`fantastic.openCanvas(id)`', 'the page loads that canvas'],
        ] } },
        'The page relays each call to the kernel as the cell’s own agent, not as the operator. A `send` reaches the kernel through the cell’s `panel_send`, so the [call gate](/fantastic/foundations/protocol/call-gate/) judges it: the cell’s `can_call` and the target’s `callable_by` must both name the verb. An `emit` needs `emit` in the cell’s `can_call`, and a target on the page’s kernel must also name it in `callable_by`. A `watch` is gated too, and a refused one comes back to the frame as an event holding the refusal, so it does not look like a subscription that works.',
        { video: 'connector' },
      ],
    },
    {
      id: 'hint',
      title: 'The grant hint',
      blocks: [
        'A refused call inside a panel never reaches the AI that wrote it. So the write that sets the body says what is missing. It scans the body for `fantastic.send`, `fantastic.watch` and `fantastic.emit` calls with a literal target. For a `send` with `type: "name"` written inline it records that verb; otherwise it records `*`. It compares the result with the cell’s `can_call`.',
        { code: '{"ok": true, "bytes": 212, "grants_missing": {"runner": ["start", "watch"]}, "hint": "this cell\'s html calls runner but its can_call does not name it — those calls will be refused. Grant it from the view: update {id: …, fields: {can_call: …}}"}', label: 'set_html reply with a hint (illustrative ids)' },
        'The hint only reads the body. It never writes a grant. The grant is a separate write on the view: `update` with `can_call`, or `wire {sender, receiver, verbs}`, which adds the verbs to the sender’s `can_call` and the receiver’s `callable_by`. The view’s `place` and `update` replies carry the same hint.',
      ],
    },
    {
      id: 'gl',
      title: 'A gl agent holds a scene',
      blocks: [
        'The handler module is `gl_agent.ts`. The source is a string of JavaScript in `meta.gl_source`. `get_gl_view` returns `{id, source}`, and `set_gl_source {source}` stores a new source and emits `reload_html` on the agent. It has no html check and no grant hint.',
        'The canvas draws all GL cells into **one shared THREE renderer, scene and camera**, which follow the canvas’s pan and zoom. For a member that is not a view bundle, the canvas calls `get_gl_view`. If a source comes back, it installs it into the GL host, which makes one `THREE.Group` for that cell.',
        'The host compiles the source with `new Function("THREE", "scene", "t", "onFrame", "cleanup", source)`. Here `scene` is the cell’s own group. Unlike an html panel, the source runs in the page itself, not in a frame. The source adds objects to its group and registers behaviour:',
        { list: [
          'Without `hz`, `onFrame(cb)` runs `cb(time)` on every frame and every frame is drawn. With `{hz}`, the callback makes a frame due at most `hz` times a second; it also runs on any frame drawn for another reason (a pan, a zoom, another cell). A frame with nothing due is not drawn.',
          '`t.emit(target, payload)` goes out as the cell’s agent, gated by its `can_call` and the target’s `callable_by`, and is dropped when denied. `t.onMessage(cb)` receives what is emitted to the cell. `t.agent_id` is the cell’s id.',
          '`cleanup` is an array; functions pushed on it run when the view is torn down.',
        ] },
        'When a view is replaced, the host runs its cleanup functions, removes its group and disposes its geometries, materials and textures. It then mounts the new source in the same place. What triggers this is the host’s `updateView`, which refetches `get_gl_view` and swaps that cell’s group; `set_gl_source` only stores the source and emits `reload_html`. Sibling views are untouched. A source that throws while mounting is logged and removed, and the other views keep drawing. With no GL view left, the render loop stops.',
        { video: 'gl_scene' },
        { note: 'A GL source is not sandboxed. `t` also carries the page’s host link (`call`, `subscribeState`), which is not gated by the cell’s `can_call`. Only `t.emit` and `onMessage` are the cell’s own. Treat a GL source as page code.' },
      ],
    },
  ],
  sources: [
    ['html_agent: get_html, set_html, page bundles', src(`${B}/html_agent/html_agent.ts`, 31)],
    ['the html check and its refusal', src(`${B}/html_check.ts`, 11)],
    ['the connector injected into the frame', src(`${B}/html_agent/connector.ts`, 40)],
    ['html_view: sandbox, srcdoc and the postMessage relay', src(`${B}/html_agent/html_view.ts`, 50)],
    ['panel_send, panel_emit, panel_watch', src(`${B}/panel_relay.ts`, 17)],
    ['the grant hint', src(`${B}/html_agent/grant_hint.ts`, 9)],
    ['gl_agent: get_gl_view, set_gl_source', src(`${B}/gl_agent/gl_agent.ts`, 14)],
    ['the GL host: shared scene, mountSource, teardown', src(`${B}/canvas/gl_host.ts`, 171)],
  ],
  clips: {
    html_set: {
      title: 'set_html: refused, then accepted',
      caption: 'The view places cell panel1. A set_html whose body is plain text with no element is refused as bad_arg and the cell keeps its old body. A set_html with a button and a script is stored in meta.html, the agent emits reload_html, and the panel draws the new body.',
    },
    connector: {
      title: 'The frame calls out through the cell',
      caption: 'Inside the sandboxed frame of cell panel1, fantastic.send("runner", start) posts a message to the page. The page relays it as panel1 through the call gate. Panel1’s can_call names runner, so the reply returns to the frame. A second send to store is not named, so the gate refuses it.',
    },
    gl_scene: {
      title: 'GL cells share one scene',
      caption: 'The canvas calls get_gl_view on cell gl1 and gets a source. The GL host makes a group for gl1 inside the shared scene and runs the source with scene, t, onFrame and cleanup. A second cell gl2 gets its own group. When the host updates gl1, its cleanup runs, its group is replaced, and gl2 keeps drawing.',
    },
  },
}
