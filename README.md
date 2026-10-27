# AISixteen — one-page site

A minimal, fast Vite + React site to showcase AISixteen apps. Configured to build into `docs/` so it can be deployed with GitHub Pages.

## Quick start

- Requirements: Node.js 18+ and npm
- Install deps and run the dev server:

```bash
npm install
npm run dev
```

Open the printed local URL (usually <http://localhost:5173>).

## Structure

- `index.html` — Vite entry
- `src/` — React app
- `media/` — public assets (already includes `logo.png`)
- `vite.config.js` — configured to output to `docs/`
- `docs/` — build output (what GitHub Pages serves)

## Add or edit apps

Edit `src/data/apps.js` to manage the cards on the page.

## Build

### Quick Build (Automated)

Use the automated build script for a complete build and deployment process:

```bash
./build.sh
```

This script will:
- Clean the `docs/` directory
- Run the build process
- Ensure CNAME is set to `aisixteen.com`
- Commit all changes to git

### Manual Build

```bash
npm run build
```

This generates the static site in `docs/` and creates `docs/404.html` for SPA fallback.

## Deploy to GitHub Pages

You have two options: a project site or a user/organization site.

### Option A — Project site (recommended)

1. Create a new GitHub repository, e.g. `aisixteen-site`.
2. Push this code to that repo.
3. Build locally so `docs/` exists:

   ```bash
   npm install
   npm run build
   ```
   
4. Commit the build output:

   ```bash
   git add .
   git commit -m "feat: initial site"
   git push origin main
   ```
   
5. On GitHub: Settings → Pages → Build and deployment → Source: "Deploy from a branch".
6. Set Branch to `main` and Folder to `/docs`.
7. Save. Your site will be available at:
   `https://<username>.github.io/<repo>/`

If deploying under a subpath like `/aisixteen-site/`, update `base` in `vite.config.js` to `'/<repo>/'` and rebuild:

```js
// vite.config.js
export default () => ({
   // ...
   base: '/aisixteen-site/',
})
```

The logo path already uses `import.meta.env.BASE_URL` so it will load correctly under a subpath.

### Option B — User/Org site (`<username>.github.io`)

1. Name the repository exactly `your-username.github.io`.
2. Keep `base: '/'` in `vite.config.js` (already set).
3. Build and push to `main` with `docs/` committed, then enable Pages from `main` → `/docs` as above.

## Local preview of the production build

```bash
npm run build
npm run preview
```

## Custom domain (optional)

If you use a custom domain, add a `CNAME` file to `docs/` with your domain name after building. Example:

```bash
echo "aisixteen.com" > docs/CNAME
```


Then set the same custom domain in the repo’s Pages settings.

## License

MIT — do whatever you want, no warranty.

## Layout tests

`npm run test:layout` runs Playwright against the built `docs/` in Chromium, Firefox and
WebKit, on desktop and phone sizes (`playwright.config.mjs`, `tests/layout.spec.mjs`). It checks
that no page scrolls sideways at any common width, that nothing moves after load (scroll
reveals, the /fantastic/ reel, the video), that the reel keeps one size on every slide with its
drawings inside it, and that no script throws. Install the browsers once with
`npx playwright install chromium firefox webkit`, or run one, e.g. `--project=chromium`.
The `Layout tests` workflow runs all of them on every pull request.

## Foundations animations (Manim)

`/fantastic/foundations/` (articles in `src/data/foundations.js`, pages in `src/site/foundations.jsx`)
embeds short animations rendered with [Manim Community](https://www.manim.community/). The scenes
are in `anim/foundations/` (`kernel.py`, `folding.py`, shared look in `common.py`); render and
compress them with:

```bash
anim/render.sh                    # every clip
anim/render.sh k2_gate            # one clip
anim/render.sh --preview k2_gate  # quick 480p contact sheet in anim/.out, nothing published
```

It needs `uv`, `ffmpeg` and `curl`; it creates `anim/.venv`, fetches the site's fonts into
`anim/.fonts`, renders at 1080p and writes a 720p H.264 MP4, a VP9 WebM and a WebP poster per clip to
`media/fantastic/foundations/<article>/`, plus durations in `src/data/foundations-videos.json`.
Only those final files are committed; the venv, fonts, Manim's media dir and raw renders are
gitignored. Then `npm run build` as usual.
