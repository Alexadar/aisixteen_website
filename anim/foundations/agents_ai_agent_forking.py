"""Foundations — Agents › AI agent › Forking and marks. SEED (batch 3): one clip so far.

`fork` moved here from Context folding in batch 3 (was CF4Fork there): mark a turn boundary;
fork {at} copies rows <= at under a new key with the same ids; a cut inside a turn is refused
with cuts_turn. The writer re-checks it against fantastic main and adds 2 to 4 more clips.
Row ids are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, RED, VIOLET,
    FScene, Node, mono,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"fork": "FK1Fork"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "fork"

CELL = 0.66
GAP = 0.1
STEP = CELL + GAP


def cell(label, color=BLUE, w=CELL, size=20, alpha=0.16):
    return Node(str(label), w=w, h=CELL, color=color, size=size, fill_alpha=alpha)


def lane_label(s, y, x=-6.55):
    return mono(s, 19, DIM).move_to([0, y, 0]).align_to([x, 0, 0], LEFT)


def place_row(cells, x0, y):
    """Lay cells left to right from x0 (left edge), each cell keeping its own width."""
    x = x0
    for c in cells:
        c.move_to([x + c.width / 2, y, 0])
        x += c.width + GAP
    return cells


def bracket(mobs, color, label, up=True, size=18):
    g = VGroup(*mobs)
    y = g.get_top()[1] + 0.16 if up else g.get_bottom()[1] - 0.16
    l, r = g.get_left()[0], g.get_right()[0]
    tick = 0.12 if up else -0.12
    line = VGroup(Line([l, y - tick, 0], [l, y, 0]), Line([l, y, 0], [r, y, 0]), Line([r, y, 0], [r, y - tick, 0]))
    line.set_stroke(color, width=3)
    t = mono(label, size, color)
    t.next_to(line, UP if up else DOWN, buff=0.1)
    return VGroup(line, t)


class FK1Fork(FScene):
    """mark a turn boundary; fork {at} copies rows <= at under a new key with the same ids."""

    TITLE = "fork: a new agent on the same prefix"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0 = -4.6
        AY, FY = 1.0, -1.25
        self.play(FadeIn(lane_label("agent", AY)), run_time=0.2)
        rows = [cell(i) for i in range(1, 11)]
        place_row(rows, X0, AY)
        turns = [(0, 3), (3, 6), (6, 10)]
        self.say("An agent's history: rows grouped in turns.")
        self.play(LaggedStart(*[FadeIn(r, shift=LEFT * 0.15) for r in rows], lag_ratio=0.1), run_time=1.1)
        tb = VGroup(*[bracket(rows[a:b], DIM, f"turn", up=False, size=16) for a, b in turns])
        self.play(FadeIn(tb), run_time=0.4)

        # mark at a turn boundary
        bx = (rows[5].get_right()[0] + rows[6].get_left()[0]) / 2
        flag = VGroup(Line([bx, AY - 0.45, 0], [bx, AY + 0.75, 0], color=VIOLET, stroke_width=3),
                      mono('mark "draft-ready"', 19, VIOLET).move_to([bx + 1.3, AY + 0.9, 0]))
        self.say('mark {label: "draft-ready"} pins a turn boundary that fork always accepts.')
        self.play(FadeIn(flag), run_time=0.5)
        self.wait(0.5)

        # a cut inside a turn is refused
        cx = rows[4].get_center()[0]
        cur = Triangle(color=RED, fill_opacity=1).scale(0.12).rotate(PI).move_to([cx, AY + 0.55, 0])
        err = mono('fork {"at": 5}  ->  reason: "cuts_turn"', 20, RED).move_to([0.6, -0.2, 0])
        self.say("fork at row 5 would cut a turn in half: refused, cuts_turn.")
        self.play(FadeIn(cur), FadeIn(err), run_time=0.4)
        self.wait(0.9)
        self.play(FadeOut(cur), FadeOut(err), run_time=0.3)

        # fork at the mark: rows 1..6 copied under the fork's own key, same ids
        cmd = mono('fork {"at": 6}', 21, AMBER).move_to([0.6, -0.2, 0])
        self.say("fork at 6: a new agent gets a copy of rows 1 to 6, with the same ids.")
        self.play(FadeIn(cmd), FadeIn(lane_label("fork", FY)), run_time=0.4)
        copies = [r.copy() for r in rows[:6]]
        targets = [r.copy().move_to([r.get_center()[0], FY, 0]) for r in rows[:6]]
        for c in copies:
            self.add(c)
        self.play(*[c.animate.move_to(t) for c, t in zip(copies, targets)], run_time=0.9)
        same = bracket(copies, GREEN, "same bytes: the parent's cache hits", up=False, size=18)
        self.play(FadeIn(same), *[c.tinted(GREEN, 0.2) for c in copies], run_time=0.5)
        self.wait(0.6)

        # diverge: one kernel counter -> new rows take new ids on each side
        self.say("Then they diverge. Later rows, folds and forgets on one side never reach the other.", color=INK)
        a_new = [cell(i, color=CYAN) for i in (11, 12)]
        place_row(a_new, rows[-1].get_right()[0] + GAP, AY)
        f_new = [cell(i, color=CYAN) for i in (13, 14)]
        place_row(f_new, copies[-1].get_right()[0] + GAP, FY)
        self.play(LaggedStart(FadeIn(a_new[0]), FadeIn(f_new[0]), FadeIn(a_new[1]), FadeIn(f_new[1]), lag_ratio=0.3), run_time=1.0)
        self.finish(2.4)
