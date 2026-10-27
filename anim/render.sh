#!/usr/bin/env bash
# Render + compress the Foundations animations. Needs uv, ffmpeg and curl.
#   anim/render.sh --article K            every clip of article K (scenes in anim/foundations/K.py)
#   anim/render.sh K/clip                 one clip (a bare clip name works when it is unique)
#   anim/render.sh --preview K/clip       quick 480p contact sheet in anim/.out/K/ (nothing published)
#   anim/render.sh --list                 every article key with its clips
# Outputs: media/fantastic/foundations/<path>/<clip>.{mp4,webm,webp} (+ og.jpg) and the
# per-article manifest src/data/foundations/clips/K.json. Renders of different articles can
# run in parallel (each uses anim/.media/K and anim/.out/K). The venv (anim/.venv), the fonts
# (anim/.fonts), Manim's media (anim/.media) and raw renders (anim/.out) are local and
# gitignored; only the compressed clips and the manifest are committed.
set -euo pipefail
cd "$(dirname "$0")"
command -v ffmpeg >/dev/null || { echo "ffmpeg is required (brew install ffmpeg)"; exit 1; }
if [ ! -x .venv/bin/python ]; then
  uv venv -q -p 3.12 .venv
  VIRTUAL_ENV=.venv uv pip install -q -r requirements.txt
fi
# The site's typefaces (SIL OFL), from the Google Fonts repository.
mkdir -p .fonts
fetch() { [ -s ".fonts/$1" ] || curl -fsSL -o ".fonts/$1" "https://github.com/google/fonts/raw/main/ofl/$2"; }
fetch Inter.ttf 'inter/Inter%5Bopsz,wght%5D.ttf'
fetch SpaceGrotesk.ttf 'spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf'
fetch JetBrainsMono.ttf 'jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf'
export OMP_NUM_THREADS="${OMP_NUM_THREADS:-2}"
exec nice -n 15 .venv/bin/python render.py "$@"
