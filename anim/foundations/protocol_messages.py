"""Foundations — Protocol › Messages and verbs.

Moved from the first draft's kernel.py (the #443 split). Every step drawn here is a behaviour
of the fantastic kernel on main (Rust and Python twins). Ids and agent names are illustrative;
shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, PANEL_HI, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"batch": "K1Batch"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "batch"


class K1Batch(FScene):
    """One batch, many calls: registered at once, run concurrently, answered in input order."""

    EYEBROW = "Fantastic kernel"
    TITLE = "One send, a batch of calls"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        xs = (-4.5, 0, 4.5)
        W, H = 4.2, 3.4
        pa, ta = panel("send  [items]", W, H, xs[0])
        pb, tb = panel("ps  ·  task table", W, H, xs[1])
        pc, tc = panel("reply  ·  input order", W, H, xs[2])
        items = [("notes", "reflect"), ("kernel", "list_agents"), ("kernel", "ps")]
        rows_y = (1.0, 0.15, -0.7)

        item_rows = VGroup(*[
            VGroup(mono(f"{i + 1}", 20, DIM), mono(f"{t}", 21, CYAN), mono(f"· {v}", 21, INK)).arrange(RIGHT, buff=0.16)
            .move_to([xs[0], y, 0]).align_to(pa, LEFT).shift(RIGHT * 0.3)
            for i, ((t, v), y) in enumerate(zip(items, rows_y))
        ])
        self.say("A model's turn fans out into three calls: one send, one batch.")
        self.play(FadeIn(pa), FadeIn(ta), LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in item_rows], lag_ratio=0.25), run_time=1.0)
        self.wait(0.6)

        # launch: the whole batch is registered before the first await
        self.say("The kernel registers the whole batch first: three tasks in ps before any reply.")
        self.play(FadeIn(pb), FadeIn(tb), FadeIn(pc), FadeIn(tc), run_time=0.4)
        pids = (41, 42, 43)
        task_rows, bars, tracks = VGroup(), [], []
        for (t, v), y, pid in zip(items, rows_y, pids):
            r = VGroup(mono(str(pid), 21, AMBER), mono(t, 21, CYAN), mono(v, 21, INK)).arrange(RIGHT, buff=0.18)
            r.move_to([xs[1], y + 0.12, 0]).align_to(pb, LEFT).shift(RIGHT * 0.28)
            track = Line([xs[1] - 1.75, y - 0.25, 0], [xs[1] + 1.75, y - 0.25, 0], color=LINE, stroke_width=6)
            task_rows.add(r)
            tracks.append(track)
        flights = [Dot(item_rows[i].get_right() + RIGHT * 0.1, radius=0.07, color=CYAN) for i in range(3)]
        self.play(*[FadeIn(d) for d in flights], run_time=0.2)
        self.play(*[d.animate.move_to(task_rows[i].get_left() + LEFT * 0.15) for i, d in enumerate(flights)],
                  run_time=0.6, rate_func=smooth)
        self.play(*[FadeOut(d) for d in flights], *[FadeIn(r) for r in task_rows], *[Create(t) for t in tracks], run_time=0.35)
        self.wait(0.7)

        # run concurrently; finish in any order (3, then 1, then 2)
        self.say("They run concurrently and finish in any order...")
        slots = []
        for i, y in enumerate(rows_y):
            s = VGroup(mono(f"{i + 1}", 20, DIM), mono("...", 21, FAINT)).arrange(RIGHT, buff=0.3)
            s.move_to([xs[2], y, 0]).align_to(pc, LEFT).shift(RIGHT * 0.3)
            slots.append(s)
        self.play(*[FadeIn(s) for s in slots], run_time=0.3)
        fill = [Line(t.get_start(), t.get_start() + RIGHT * 0.001, color=CYAN, stroke_width=6) for t in tracks]
        for f in fill:
            self.add(f)
        speeds = (1.0, 1.0, 1.0)
        finish_order = (2, 0, 1)
        lengths = [t.get_length() for t in tracks]

        def grow(i, frac):
            s = tracks[i].get_start()
            return Line(s, s + RIGHT * max(lengths[i] * frac, 0.001), color=CYAN, stroke_width=6)

        # three stages: each stage completes one more task
        progress = [0.0, 0.0, 0.0]
        targets = ([0.55, 0.4, 1.0], [1.0, 0.75, 1.0], [1.0, 1.0, 1.0])
        for stage, done in zip(targets, finish_order):
            anims = []
            for i in range(3):
                if progress[i] < 1.0:
                    anims.append(Transform(fill[i], grow(i, stage[i])))
            self.play(*anims, run_time=0.9, rate_func=linear)
            progress = list(stage)
            out = VGroup(mono(f"{done + 1}", 20, DIM), mono(f"pid {pids[done]}", 21, AMBER),
                         mono("completed", 21, GREEN)).arrange(RIGHT, buff=0.3)
            out.move_to(slots[done]).align_to(slots[done], LEFT)
            self.play(FadeOut(task_rows[done]), FadeOut(fill[done]), FadeOut(tracks[done]),
                      FadeTransform(slots[done], out), run_time=0.45)
            slots[done] = out
        self.wait(0.3)
        self.say("...but the reply keeps input order: one {pid, status, result} per item.", color=INK)
        shape = mono('[{pid, status, result}, ...]', 20, MUTED).next_to(pc, DOWN, buff=0.22)
        self.play(FadeIn(shape, shift=UP * 0.1), Indicate(VGroup(*slots), color=GREEN, scale_factor=1.04), run_time=0.8)
        self.finish(2.4)
