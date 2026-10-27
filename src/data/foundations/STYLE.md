# Foundations: how to write an article

Foundations (`/fantastic/foundations/`, GitHub issue aisixteen/fantastic#443) explains how
Aisixteen Fantastic works, one mechanism per page. The source of truth for every claim is the
public fantastic repo on `main`. Where its docs and its code disagree, the code wins.

## Files for an article with key `K`

`K` and the page's path `P` are listed in `src/data/foundations/registry.json`.
`K` is `P` with `/` and `-` replaced by `_`. For example, `protocol/call-gate` has the key
`protocol_call_gate`.

| file | what | who |
|---|---|---|
| `coder/tmp/foundations/facts/K.md` | fact sheet (outside the repo, not committed): copy `facts/_template.md` | writer |
| `src/data/foundations/articles/K.js` | text, sources, clip titles and captions: copy `articles/_template.js` | writer |
| `anim/foundations/K.py` | Manim scenes with `CLIPS` and `OG`: copy `anim/foundations/_template.py` | writer |
| `media/fantastic/foundations/P/<clip>.{mp4,webm,webp}`, `og.jpg` | rendered clips | `anim/render.sh` |
| `src/data/foundations/clips/K.json` | durations and sizes of K's clips | `anim/render.sh` |
| `src/data/foundations/registry.json` | the tree, `status` | **integrator only** |

A writer creates or edits only these files for its own `K`. Do not edit `registry.json`,
`lib.js`, `common.py`, another article's files, `src/site/*`, `scripts/*` or `docs/`.
If a file already exists as a **seed** (`seed: true`, material moved from the first draft),
start from it: re-check every claim, rewrite it to this guide, and delete `seed: true`.

## Steps

1. **Fact sheet.** Read the code on fantastic `main` (read-only; never commit there). Write
   every fact you will use as `claim — path:line`, and record where the docs disagree with the code.
2. **Text.** Fill `articles/K.js`: headline, description, summary, cover, about, lead,
   sections, sources, clips. Each sentence must be backed by a fact in the sheet.
3. **Clips.** Write 3 to 5 scenes in `anim/foundations/K.py` (a pillar or section page has 1).
   List them in `CLIPS = {"name": "SceneClass"}` and set `OG = "name"`. Place each clip with
   `{ video: 'name' }`, and give its title and caption in `clips.name` of `K.js`.
   To reuse a clip that another article owns, use `{ video: 'name', from: 'otherkey' }`.
   Do not re-render or copy it.
4. **Preview, then render:**
   ```sh
   anim/render.sh --preview --article K   # 480p contact sheets in anim/.out/K/, nothing published
   anim/render.sh --article K             # publish every clip of K (or: anim/render.sh K/name)
   ```
   This writes the clips, `og.jpg` and `clips/K.json`. Look at `anim/.out/K/<clip>-poster.png`,
   which is the poster. Each run uses only `anim/.media/K` and `anim/.out/K`, so writers can
   render in parallel.
5. **Check.** To check a planned article as if it were published, set `"status": "published"`
   for K in `registry.json` **locally only**. Do not commit that change.
   ```sh
   PATH=$HOME/.local/node22/bin:$PATH node scripts/build-site.mjs
   PATH=$HOME/.local/node22/bin:$PATH npx playwright test -c playwright.3090.config.mjs
   ```
   The build fails and lists every problem it finds: a missing file, caption or render, a
   seed, a clip count outside 3 to 5, a duplicate section id, or a missing `og.jpg`. Then
   revert `registry.json`. The integrator publishes the page.
6. **Commit** only your files, by explicit path:
   `src/data/foundations/articles/K.js anim/foundations/K.py src/data/foundations/clips/K.json media/fantastic/foundations/P/`.
   Never commit `docs/` or `registry.json`.

## Voice

- Plain, concrete English for a developer who has not seen fantastic. Say what happens, in
  the order it happens.
- Sentences of about 12 to 25 words. Paragraphs of 2 to 4 sentences. One idea per paragraph.
- Use present tense and active voice: "The kernel registers the batch", not "The batch is registered".
- Define a term the first time you use it, in **bold**. Use the code's own names for things.
- No marketing words (powerful, seamless, revolutionary, simply, just) and no comparisons that
  the code does not prove.
- Quote the repo verbatim in “curly quotes” only when its exact wording helps. Name the file in
  `cite`, or in the sentence.
- Say "illustrative" when ids or values are made up. Shapes, verbs, field names and orders are real.

## Code and verbs

- Write verbs, fields, ids and file names as inline code: `send`, `can_call`, `.fantastic/`.
- A send is shown as the code spells it: `[{"target": "kernel", "payload": {"type": "ps"}}]`.
  A verb with arguments in prose is written `cancel {task_id}`.
- Use code blocks (`{ code, label }`) for JSON shapes, records and refusals, and keep them under
  about 8 lines. The label says what the block is, for example `the refusal`, `ps (shape)` or
  `illustrative ids`.
- Name both runtimes when it matters. Write "Rust and Python" and say where they differ.

## Citing

- Every fact is in the fact sheet as `claim — path:line` on fantastic `main`.
- `sources` in `K.js` lists the files a reader would open, as `src('path', line)` or
  `tree('folder')` from `../lib.js`. Use 3 to 8 sources, each specific.
- Do not cite issues, PRs, chats or docs that are not on `main`.

## Never

- Never name or link a private repository (the brief lists them), never mention a fantastic
  subdomain of aisixteen.com, and add no LaunchNest badge.
- No effort hours, no roadmap dates, and no "coming in version X".
- No claim beyond the code: no benchmarks, no "production-ready", and no features that are not on `main`.
- No LaTeX in clips (`Tex`, `MathTex`): use `Text` and `MarkupText` only, through `txt` and `mono`.
- Do not edit files outside your own article (see the table above).

## Clips

- 6 to 20 s each, 1280×720 at 30 fps. One mechanism per clip, drawn in 3 to 5 steps.
- Start with `self.play(FadeIn(self.header()))`, with the pillar as `EYEBROW` and the clip title as `TITLE`.
- One narration line at a time (`self.say("…")`), at most about 70 characters.
- At most about 5 labels on screen at once. Use `Node`, `pill`, `card` and `panel` from `common.py`.
- Use only the palette in `common.py`: BLUE for agents, CYAN for messages and links, GREEN for
  passed and completed, RED for refused and failed, AMBER for ids and pending, VIOLET for AI and
  folds, and DIM or MUTED for secondary text.
- End with `self.finish()`: a 2.2 s hold on the final state (the poster frame), then a 0.85 s
  fade to the background, so the loop is seamless. The poster must show the result.
- Files stay well under 200 KB each. The render prints sizes and flags any file over 200 KB.
  To shrink a file, use fewer moving parts or shorter holds.
- The caption describes what the clip shows, step by step, with the same ids. The page must
  read completely with every video removed.
