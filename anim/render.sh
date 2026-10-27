#!/usr/bin/env bash
# Render + compress the Foundations animations. Needs uv, ffmpeg and curl.
#   anim/render.sh                    every clip, published to media/fantastic/foundations/
#   anim/render.sh k2_gate            one clip
#   anim/render.sh --preview k2_gate  quick 480p contact sheet in anim/.out (nothing published)
# The venv (anim/.venv), the fonts (anim/.fonts), Manim's media (anim/.media) and raw
# renders (anim/.out) are local and gitignored; only the compressed clips are committed.
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
exec .venv/bin/python render.py "$@"
