"""Render the Foundations animations with Manim, then compress them for the web.

    anim/render.sh --article K            every clip of article K (anim/foundations/K.py)
    anim/render.sh K/clip [K/clip ...]    these clips (a bare clip name works when it is unique)
    anim/render.sh --preview K/clip       fast 480p render + contact sheet in anim/.out/K/, nothing published
    anim/render.sh --preview --article K  the same for every clip of K
    anim/render.sh --list                 every article key and its clips

Clips are found without a shared table: each scene file anim/foundations/<key>.py (key as in
src/data/foundations/registry.json) declares

    CLIPS = {"clip": "SceneClass", ...}   # clip name -> scene class
    OG = "clip"                           # whose final frame becomes the article's og.jpg

For each clip it writes, under media/fantastic/foundations/<path>/ (path from registry.json):
    <clip>.mp4   H.264, yuv420p, 1280x720, 30 fps, +faststart
    <clip>.webm  VP9, 1280x720, 30 fps
    <clip>.webp  poster (the held final state)
    og.jpg       for the OG clip only
and records duration and sizes in src/data/foundations/clips/<key>.json (that article's own
manifest, read by the site build). Each run uses its own Manim media dir, anim/.media/<key>/,
and raw files in anim/.out/<key>/, and cleans only those, so renders of different articles can
run in parallel. Everything under anim/.media and anim/.out is gitignored.
"""
import ast
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
MEDIA_ROOT = ANIM / ".media"
OUT_ROOT = ANIM / ".out"
PUBLISH = ROOT / "media" / "fantastic" / "foundations"
DATA = ROOT / "src" / "data" / "foundations"
REGISTRY = DATA / "registry.json"
MANIFESTS = DATA / "clips"

# The poster is the held final state: every scene ends with a hold, then a 0.85 s fade.
POSTER_FROM_END = 1.35
# Over this, the run prints a warning: aim well under 200 KB per file.
BUDGET = 200 * 1024


def registry_paths():
    nodes = json.loads(REGISTRY.read_text())["nodes"]
    return {n["key"]: n["path"] for n in nodes}


def scene_decl(path):
    """CLIPS and OG from a scene file, read without importing it (no Manim needed)."""
    clips, og = None, None
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            name = node.targets[0].id
            if name == "CLIPS":
                clips = ast.literal_eval(node.value)
            elif name == "OG":
                og = ast.literal_eval(node.value)
    return clips, og


def articles():
    """{key: (scene file, {clip: class}, og clip)} for every scene file, checked against the registry."""
    paths = registry_paths()
    found = {}
    for f in sorted(SCENES.glob("*.py")):
        if f.name.startswith("_") or f.stem == "common":
            continue
        if f.stem not in paths:
            sys.exit(f"{f.relative_to(ROOT)}: no node with key {f.stem!r} in {REGISTRY.relative_to(ROOT)}")
        clips, og = scene_decl(f)
        if not clips:
            sys.exit(f"{f.relative_to(ROOT)}: declare CLIPS = {{'clip': 'SceneClass'}} at module level")
        if og is not None and og not in clips:
            sys.exit(f"{f.relative_to(ROOT)}: OG = {og!r} is not one of its CLIPS")
        found[f.stem] = (f, clips, og or next(iter(clips)))
    return found


def run(cmd):
    print("+", " ".join(str(c) for c in cmd), flush=True)
    env = dict(os.environ, PYTHONPATH=str(SCENES))  # scenes import common.py
    subprocess.run([str(c) for c in cmd], check=True, env=env)


def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         check=True, capture_output=True, text=True).stdout.strip()
    return float(out)


def manim(key, file, scene, quality):
    media = MEDIA_ROOT / key
    run([sys.executable, "-m", "manim", "render", f"-q{quality}", "--fps", "30", "--disable_caching",
         "--media_dir", media, file, scene])
    folder = {"l": "480p30", "m": "720p30", "h": "1080p30"}[quality]
    return media / "videos" / file.stem / folder / f"{scene}.mp4"


def preview(key, file, clip, scene):
    raw = manim(key, file, scene, "l")
    out = OUT_ROOT / key
    out.mkdir(parents=True, exist_ok=True)
    dur = probe_duration(raw)
    sheet = out / f"{clip}-sheet.png"
    n = 8
    run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-vf",
         f"fps={n / dur:.4f},scale=640:-1,tile=2x4", "-frames:v", "1", sheet])
    poster = out / f"{clip}-poster-preview.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(dur - POSTER_FROM_END, 0):.2f}", "-i", raw, "-frames:v", "1", poster])
    print(f"preview {key}/{clip}: {dur:.2f}s -> {sheet} (poster frame: {poster})")


def publish(key, path, file, clip, scene, og):
    raw = manim(key, file, scene, "h")  # 1080p, downscaled below: sharper text than a 720p render
    dest = PUBLISH / path
    dest.mkdir(parents=True, exist_ok=True)
    mp4, webm, webp = dest / f"{clip}.mp4", dest / f"{clip}.webm", dest / f"{clip}.webp"
    scale = "scale=1280:720:flags=lanczos"
    run(["nice", "-n", "15", "ffmpeg", "-v", "error", "-y", "-i", raw, "-an", "-vf", scale, "-r", "30",
         "-c:v", "libx264", "-preset", "veryslow", "-tune", "animation", "-crf", "30",
         "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", mp4])
    run(["nice", "-n", "15", "ffmpeg", "-v", "error", "-y", "-i", raw, "-an", "-vf", scale, "-r", "30",
         "-c:v", "libvpx-vp9", "-crf", "52", "-b:v", "0", "-deadline", "good", "-cpu-used", "1",
         "-row-mt", "1", "-threads", "2", "-pix_fmt", "yuv420p", webm])
    dur = probe_duration(mp4)
    out = OUT_ROOT / key
    out.mkdir(parents=True, exist_ok=True)
    png = out / f"{clip}-poster.png"
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(dur - POSTER_FROM_END, 0):.2f}", "-i", raw,
         "-frames:v", "1", "-vf", scale, png])
    Image.open(png).convert("RGB").save(webp, "WEBP", quality=82, method=6)
    if clip == og:  # the article's social card (og:image): JPEG for every crawler
        Image.open(png).convert("RGB").save(dest / "og.jpg", "JPEG", quality=85, optimize=True, progressive=True)
    return {
        "duration": round(dur, 2), "width": 1280, "height": 720,
        "bytes": {"mp4": mp4.stat().st_size, "webm": webm.stat().st_size, "webp": webp.stat().st_size},
    }


def resolve(targets, arts):
    """[(key, clip)] from 'K/clip' or a bare, unique clip name."""
    out = []
    for t in targets:
        if "/" in t:
            key, clip = t.split("/", 1)
            if key not in arts or clip not in arts[key][1]:
                sys.exit(f"unknown clip {t}; see anim/render.sh --list")
            out.append((key, clip))
            continue
        hits = [(k, t) for k, (_, clips, _) in arts.items() if t in clips]
        if len(hits) != 1:
            sys.exit(f"clip {t!r} matches {len(hits)} articles; name it as <key>/{t} (anim/render.sh --list)")
        out.append(hits[0])
    return out


def main(argv):
    arts = articles()
    paths = registry_paths()
    if "--list" in argv:
        for k, (f, clips, og) in arts.items():
            print(f"{k:42} {paths[k]:36} {', '.join(clips)}  (og: {og})")
        return
    is_preview = "--preview" in argv
    args = [a for a in argv if not a.startswith("--")]
    if "--article" in argv:
        if len(args) != 1 or args[0] not in arts:
            sys.exit(f"--article takes one key with a scene file; known: {list(arts)}")
        todo = [(args[0], c) for c in arts[args[0]][1]]
    elif args:
        todo = resolve(args, arts)
    else:
        sys.exit(__doc__)
    if is_preview:
        for key, clip in todo:
            f, clips, _ = arts[key]
            preview(key, f, clip, clips[clip])
        return
    by_key = {}
    for key, clip in todo:
        by_key.setdefault(key, []).append(clip)
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    for key, clips_todo in by_key.items():
        f, clips, og = arts[key]
        man_path = MANIFESTS / f"{key}.json"
        manifest = json.loads(man_path.read_text()) if man_path.exists() else {}
        for clip in clips_todo:
            manifest[clip] = publish(key, paths[key], f, clip, clips[clip], og)
            man_path.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
        for clip in clips_todo:
            m = manifest[clip]
            sizes = "  ".join(f"{ext} {b / 1024:.0f} KB{' (over 200 KB!)' if b > BUDGET else ''}" for ext, b in m["bytes"].items())
            print(f"{key}/{clip}: {m['duration']}s  {sizes}")
        if "--keep" not in argv:
            shutil.rmtree(MEDIA_ROOT / key, ignore_errors=True)


if __name__ == "__main__":
    main(sys.argv[1:])
