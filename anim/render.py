"""Render the Foundations animations with Manim, then compress them for the web.

    anim/render.sh                 # every clip
    anim/render.sh k2_gate cf1_fold  # only these
    anim/render.sh --preview k2_gate # fast 480p render + contact sheet in anim/.out, nothing published

For each clip it writes, under media/fantastic/foundations/<article>/:
    <slug>.mp4   H.264, yuv420p, 1280x720, 30 fps, +faststart
    <slug>.webm  VP9, 1280x720, 30 fps
    <slug>.webp  poster (a frame of the finished state)
and records duration and sizes in src/data/foundations-videos.json (read by the site build).
Everything else (Manim's media dir, raw renders) stays in anim/.media and anim/.out,
which are gitignored.
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

ANIM = Path(__file__).resolve().parent
ROOT = ANIM.parent
SCENES = ANIM / "foundations"
MEDIA_DIR = ANIM / ".media"
OUT = ANIM / ".out"
PUBLISH = ROOT / "media" / "fantastic" / "foundations"
MANIFEST = ROOT / "src" / "data" / "foundations-videos.json"

# slug: (article folder, scene file, scene class)
CLIPS = {
    "k1_batch": ("kernel", "kernel.py", "K1Batch"),
    "k2_gate": ("kernel", "kernel.py", "K2Gate"),
    "k3_cancel": ("kernel", "kernel.py", "K3Cancel"),
    "k4_delete": ("kernel", "kernel.py", "K4Delete"),
    "k5_ledger": ("kernel", "kernel.py", "K5Ledger"),
    "cf1_fold": ("context-folding", "folding.py", "CF1Fold"),
    "cf2_levels": ("context-folding", "folding.py", "CF2Levels"),
    "cf3_cache": ("context-folding", "folding.py", "CF3Cache"),
    "cf4_fork": ("context-folding", "folding.py", "CF4Fork"),
    "cf5_forget": ("context-folding", "folding.py", "CF5Forget"),
}

# The poster is the held final state: every scene ends with a hold, then a 0.85 s fade.
POSTER_FROM_END = 1.35


def run(cmd):
    print("+", " ".join(str(c) for c in cmd), flush=True)
    env = dict(os.environ, PYTHONPATH=str(SCENES))  # scenes import common.py
    subprocess.run([str(c) for c in cmd], check=True, env=env)


def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         check=True, capture_output=True, text=True).stdout.strip()
    return float(out)


def manim(file, scene, quality):
    run([sys.executable, "-m", "manim", "render", f"-q{quality}", "--fps", "30", "--disable_caching",
         "--media_dir", MEDIA_DIR, SCENES / file, scene])
    folder = {"l": "480p30", "m": "720p30", "h": "1080p30"}[quality]
    return MEDIA_DIR / "videos" / Path(file).stem / folder / f"{scene}.mp4"


def preview(slug):
    article, file, scene = CLIPS[slug]
    raw = manim(file, scene, "l")
    OUT.mkdir(exist_ok=True)
    dur = probe_duration(raw)
    sheet = OUT / f"{slug}-sheet.png"
    n = 8
    run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-vf",
         f"fps={n / dur:.4f},scale=640:-1,tile=2x4", "-frames:v", "1", sheet])
    print(f"preview {slug}: {dur:.2f}s -> {sheet}")


def publish(slug):
    article, file, scene = CLIPS[slug]
    raw = manim(file, scene, "h")  # 1080p, downscaled below: sharper text than a 720p render
    dest = PUBLISH / article
    dest.mkdir(parents=True, exist_ok=True)
    name = slug.split("_", 1)[1]
    mp4, webm, webp = dest / f"{name}.mp4", dest / f"{name}.webm", dest / f"{name}.webp"
    scale = "scale=1280:720:flags=lanczos"
    run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-an", "-vf", scale, "-r", "30",
         "-c:v", "libx264", "-preset", "veryslow", "-tune", "animation", "-crf", "30",
         "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", mp4])
    run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-an", "-vf", scale, "-r", "30",
         "-c:v", "libvpx-vp9", "-crf", "52", "-b:v", "0", "-deadline", "good", "-cpu-used", "1",
         "-row-mt", "1", "-pix_fmt", "yuv420p", webm])
    dur = probe_duration(mp4)
    OUT.mkdir(exist_ok=True)
    png = OUT / f"{slug}-poster.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(dur - POSTER_FROM_END, 0):.2f}", "-i", raw,
         "-frames:v", "1", "-vf", scale, png])
    Image.open(png).convert("RGB").save(webp, "WEBP", quality=82, method=6)
    if slug in ("k1_batch", "cf1_fold"):  # the article's social card (og:image): JPEG for every crawler
        Image.open(png).convert("RGB").save(dest / "og.jpg", "JPEG", quality=85, optimize=True, progressive=True)
    return {
        "article": article, "file": name, "duration": round(dur, 2), "width": 1280, "height": 720,
        "bytes": {"mp4": mp4.stat().st_size, "webm": webm.stat().st_size, "webp": webp.stat().st_size},
    }


def main(argv):
    is_preview = "--preview" in argv
    slugs = [a for a in argv if not a.startswith("--")] or list(CLIPS)
    unknown = [s for s in slugs if s not in CLIPS]
    if unknown:
        sys.exit(f"unknown clip(s): {unknown}; known: {list(CLIPS)}")
    if is_preview:
        for s in slugs:
            preview(s)
        return
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    for s in slugs:
        manifest[s] = publish(s)
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
    for s in slugs:
        m = manifest[s]
        print(f"{s}: {m['duration']}s  mp4 {m['bytes']['mp4'] / 1024:.0f} KB  webm {m['bytes']['webm'] / 1024:.0f} KB  webp {m['bytes']['webp'] / 1024:.0f} KB")
    if MEDIA_DIR.exists() and "--keep" not in argv:
        shutil.rmtree(MEDIA_DIR / "videos", ignore_errors=True)


if __name__ == "__main__":
    main(sys.argv[1:])
