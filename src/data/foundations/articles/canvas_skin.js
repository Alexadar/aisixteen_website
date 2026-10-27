import { src, tree } from '../lib.js'

const B = 'src/tui/web/canvas/src/bundles'

export default {
  headline: 'Skin and backgrounds: how the canvas looks, as agents',
  description: 'How Aisixteen Fantastic styles the canvas with agents: a skin of design tokens, a theme for where cells sit, and a GL background, each changed live with a send.',
  summary: 'A skin of design tokens, a theme for cell placement, a GL background: three things on three agents, all changed with a send.',
  cover: { clip: 'three' },
  about: ['Aisixteen Fantastic', 'Design tokens', 'Theming'],
  lead: [
    'How the canvas looks is not a setting file. It is state on agents, and an AI cell or a person changes it with the same send they use for everything else.',
    'The code keeps three things apart. A **skin** is how everything is coloured and shaped. A **theme** is where the cells sit. A **background** is the picture behind the cells. This page covers the skin and the background and shows where the theme fits.',
  ],
  sections: [
    {
      id: 'three',
      title: 'Three things, three agents',
      blocks: [
        'Each of the three has its own agent on the page, and none of them moves the others. The page-side agents are TypeScript, packed into the binary with the canvas; the code has no Rust or Python twin for them. Their verbs are reached like any other, through the [call gate](/fantastic/foundations/protocol/call-gate/).',
        { table: { head: ['', 'answers', 'lives on', 'state'], rows: [
          ['skin', 'colours, radii, fonts, shadows, motion, and the backdrop', 'the `skin` agent', '`skins`, `user_skins`'],
          ['theme', 'where the cells sit: `free` or `column`', 'the canvas theme agent, `layout_<theme>` agents', '`user_themes`, `hidden_themes`'],
          ['background', 'one GL scene behind every cell', 'the view’s `background` agent', '`bg_source`'],
        ] } },
        'The docs say it directly: a skin “never moves a cell”. The theme, by contrast, changes the cells’ rectangles and never an agent. The [Canvas](/fantastic/foundations/canvas/canvas/) article covers cell placement.',
        { video: 'three' },
      ],
    },
    {
      id: 'skin',
      title: 'The skin: design tokens in a record',
      blocks: [
        'A skin is a document of **design tokens** in a subset of the W3C Design Tokens format (2025.10), plus a **backdrop**, `web` or `native`. The `skin` agent is one per canvas, a delete-locked child of the page root, made when missing. Its record holds two fields:',
        { list: [
          '`skins`: `{web, native}`, the name of the skin used on each backdrop. The defaults are the stock skins `dark` (web) and `glass` (native).',
          '`user_skins`: `[{name, base, note, tokens}]`, skins written by an AI or a human. `tokens` is a partial document merged over `base`, which is a stock skin or another user skin.',
        ] },
        'The skin in use is the slot for this tab’s backdrop. A plain browser tab has no shell flag, so it is always `web`. One canvas can therefore show `glass` in the app’s window and `dark` in a browser tab at the same time.',
        'The agent answers six verbs.',
        { table: { head: ['verb', 'what it does'], rows: [
          ['`list`', 'stock skins, your skins, the two slots, this tab’s backdrop and `in_use`'],
          ['`get {name}`', 'the tokens as authored, and `merged`, the full document that compiles'],
          ['`schema`', 'the format, supported and refused features, and every token with its type and CSS name'],
          ['`use {name, backdrop?}`', 'sets a slot, by default this tab’s'],
          ['`add {name, base, tokens, note?}`', 'adds or replaces one of yours'],
          ['`delete {name}`', 'removes one of yours'],
        ] } },
      ],
    },
    {
      id: 'write',
      title: 'Writing a skin',
      blocks: [
        'A new look is one `add` and one `use`. The `add` carries only what changes; the rest comes from `base`. A token you give replaces the base’s whole token, and groups merge deeply.',
        { code: 'add {name: "ocean", base: "dark", tokens: {color: {accent: {base: {$value:\n  {colorSpace: "srgb", components: [0.2, 0.7, 0.9]}}}}}}\nuse {name: "ocean"}', label: 'the skin agent’s own example (shortened)' },
        'Before it stores anything, `add` checks the name (1 to 40 characters of `a-z`, `0-9`, `_`, `-`), that it is not a stock name, that `base` exists and has no cycle, and that the merged document compiles. A bad token is refused with its path. The same name replaces the old skin, and if it is in use the page shows the new version at once.',
        'A colour is `srgb` with `components` in 0 to 1, an optional `alpha`, and an optional `hex` that must equal the components. Tokens marked `opaque` must have alpha 1, because the canvas mixes them with its `tint()` helper. Aliases such as `"{color.accent.base}"` are followed, and a `palette.*` group holds free alias targets that are never compiled.',
        'The format refuses `$ref`, `$extends`, `$root`, the types `strokeStyle`, `border`, `transition`, `gradient` and `typography`, and any colour space other than `srgb`.',
        { video: 'skin' },
      ],
    },
    {
      id: 'apply',
      title: 'How the page applies it',
      blocks: [
        'The page compiles a skin to one CSS custom property per token, named `--fc-` plus the path with dots as dashes. All of them sit in one `<style id="fantastic-skin">` at the start of the head, and `<html>` gets `data-skin` and `data-backdrop`. Switching skins replaces that stylesheet’s text and the browser restyles every view from the new variables, and the canvas also redraws the view (a native backdrop hides the background).',
        'The page watches the `skin` record and applies again whenever `skins` or `user_skins` changes, so a send from anywhere shows at once. A skin that cannot apply is logged and shown as a toast, and the page keeps the skin it shows.',
        '`use` refuses a skin whose backdrop is `native` for the `web` slot, as `bad_arg`, because nothing is behind a browser tab. A web skin may sit in the `native` slot. `delete` refuses a skin that is in a slot or is another skin’s base.',
        { note: 'Font sizes, weights, line heights and layout geometry are not tokens. The docs keep them literal so that a skin never moves a cell.' },
      ],
    },
    {
      id: 'background',
      title: 'The background: a GL source on its own agent',
      blocks: [
        'Every view has exactly one **background** agent, a child of the view. The root view’s is `background` and is delete-locked, so it can only be updated; a nested view’s is `<view>_bg`. Its one piece of state is `bg_source`.',
        '`bg_source` is JavaScript, run as `new Function("THREE", "scene", "t", "onFrame", "cleanup", bytes)` in the page’s shared three.js scene, behind every cell. The agent answers `set_bg {bytes}`, `default_bg`, `clear_bg` and `get_bg`, and `set_bg` refuses a source that does not compile, with the error and `reason` `bad_arg`. The record grants these verbs by name to the view (its parent) and to the backgrounds agent; no one else may call them.',
        'People and AI cells rarely call that agent directly. The page’s **backgrounds agent** (file `backgrounds_agent.ts`, called the canvas theme agent in its own header) manages a list and applies a choice by calling `set_bg` on the view’s background.',
        { list: [
          'Stock backgrounds are Isoline, Glyph, Copper and Moire. `delete` hides a stock one and `restore_stock` brings all back.',
          '`add {name, note?, bytes}` adds your own as a full GL source. `add {name, note?, body, sets?}` writes only a body on the stock prelude. Either must compile.',
          '`set {name, set?}` applies one, `random` picks one, `none` clears, and `default` restores Isoline in its Ember colour set.',
          '`rotate {on, every_s?}` picks a random one every `every_s` seconds. The default is 60, and values under 5 fall back to it.',
        ] },
        'Its record keeps `user_bgs`, `hidden_stock`, `current` and `rotate`, so the choice survives a reload. The agent is granted `set_bg`, `clear_bg`, `default_bg` and `get_bg` on the background at both ends, as the [call gate](/fantastic/foundations/protocol/call-gate/) requires.',
        { video: 'background' },
        'Under a `native` skin the page draws no background, because the window’s own material shows through. The background’s record is untouched, so a web skin brings it back. A skin change also redraws the view.',
      ],
    },
    {
      id: 'theme',
      title: 'Where the theme fits',
      blocks: [
        'The canvas theme agent also keeps the themes, and they are a different thing from a skin. A theme is `{name, layout, trigger}`, where `layout` is `free` or `column`. The stock themes are `canvas` (free) and `mobile` (one column, for tabs under 768 px wide).',
        'With the view’s `theme` set to `auto`, the page takes the first theme whose width trigger matches the tab, yours first, otherwise the first without a trigger. The verbs are `themes`, `use_theme`, `add_theme`, `delete_theme` and `restore_themes`; the stock `canvas` cannot be deleted or hidden; edit it with `add_theme`.',
        'Positions live in one `layout_<theme>` agent per theme under the view. Switching theme moves the cells and never the agents. The [Canvas](/fantastic/foundations/canvas/canvas/) article follows from there.',
      ],
    },
  ],
  sources: [
    ['the skin agent: verbs, record, refusals', src(`${B}/skin/skin_agent.ts`, 128)],
    ['applying a skin: one style element', src(`${B}/skin/apply.ts`, 13)],
    ['the token format and what it refuses', src(`${B}/skin/tokens.ts`, 67)],
    ['the token schema (every token)', src(`${B}/skin/schema.ts`, 26)],
    ['the background agent', src(`${B}/canvas/background_agent.ts`, 50)],
    ['the backgrounds agent (and themes)', src(`${B}/backgrounds/backgrounds_agent.ts`, 96)],
    ['themes and layouts', src(`${B}/canvas/layout.ts`, 63)],
    ['docs: skins', src('src/tui/docs/skins.md')],
  ],
  clips: {
    three: {
      title: 'Skin, theme, background',
      caption: 'Three cards, three agents. The skin agent holds design tokens and a backdrop. The canvas theme agent holds themes: where the cells sit, free or column. The view’s background agent holds one GL source. A change to one leaves the other two as they were.',
    },
    skin: {
      title: 'Add a skin, use it',
      caption: 'The skin agent receives add with name ocean, base dark and one accent token. The merged document compiles, so ocean is stored. use ocean sets the web slot, and the single fantastic-skin stylesheet is replaced. A native skin sent to the web slot is refused with bad_arg.',
    },
    background: {
      title: 'Set a background',
      caption: 'The backgrounds agent receives set with the name Isoline. It sends set_bg with the GL source to the view’s background agent, which checks that the source compiles and stores it as bg_source. A source that does not compile is refused with bad_arg. Under a native skin the background is not drawn.',
    },
  },
}
