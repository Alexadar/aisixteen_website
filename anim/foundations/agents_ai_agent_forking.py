"""Foundations — Agents › AI agent › Forking and marks. Three clips.

fork:  mark a turn boundary; fork {at} copies rows <= at under a new key with the same ids; a cut
       inside a turn is refused with cuts_turn (fork.rs:109-130, 276-283, 370-404).
folds: a fold straddling `at` is refused cuts_fold; a fold whose members are all <= at is copied
       whole (fork.rs:90-107, 131-156).
warm:  fork_points reports warm for 300 s after a send ends; several forks of one mark start
       from the same rows (constants.rs:191-193, fork.rs:445-449, tests_fork.rs:642).
Row ids and agent names are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, RED, VIOLET,
    FScene, Node, mono, pill,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"fork": "FK1Fork", "folds": "FK2Folds", "warm": "FK3Warm"}
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
        self.say('Marked when row 6 was the newest; rows 7 to 10 came after.')
        self.wait(0.9)

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
        same = bracket(copies, GREEN, "same bytes: the cache can hit", up=False, size=18)
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


class FK2Folds(FScene):
    """A fold whose members straddle `at` is refused; a fold wholly at or below `at` is copied."""

    TITLE = "fork and folds: whole or refused"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0 = -4.6
        AY, FY = 1.0, -1.45
        self.play(FadeIn(lane_label("agent", AY)), run_time=0.2)
        rows = [cell(i) for i in range(1, 9)]
        f9, f10 = cell("F9", VIOLET, size=18), cell("F10", VIOLET, w=0.8, size=18)
        allc = rows + [f9, f10]
        place_row(allc, X0, AY)
        self.say("Rows 1 to 8, a fold 9 over rows 2 and 3, a fold 10 over rows 6 and 7.")
        self.play(LaggedStart(*[FadeIn(c, shift=LEFT * 0.15) for c in allc], lag_ratio=0.08), run_time=1.2)
        b9 = bracket(rows[1:3], VIOLET, "fold 9", up=False, size=16)
        b10 = bracket(rows[5:7], VIOLET, "fold 10", up=False, size=16)
        self.play(FadeIn(b9), FadeIn(b10), run_time=0.5)
        self.wait(0.4)

        # fork at 6: fold 10 has a member on each side
        cx = rows[5].get_center()[0]
        cur = Triangle(color=RED, fill_opacity=1).scale(0.12).rotate(PI).move_to([cx, AY + 0.55, 0])
        err = mono('fork {"at": 6}  ->  reason: "cuts_fold"', 20, RED).move_to([0.6, -0.4, 0])
        self.say("fork at 6: fold 10 has member 6 before the cut and 7 after. Refused.")
        self.play(FadeIn(cur), FadeIn(err), f10.tinted(RED, 0.3), run_time=0.5)
        self.wait(1.0)
        self.play(FadeOut(cur), FadeOut(err), f10.tinted(VIOLET, 0.16), run_time=0.3)

        # fork at 4: fold 9 is wholly at or below, so it comes along
        cmd = mono('fork {"at": 4}', 21, AMBER).move_to([0.6, -0.4, 0])
        self.say("fork at 4: rows 1 to 4 come along, and so does fold 9, whole.")
        self.play(FadeIn(cmd), FadeIn(lane_label("fork", FY)), run_time=0.4)
        picked = rows[:4] + [f9]
        copies = [c.copy() for c in picked]
        slots = [X0 + i * STEP + CELL / 2 for i in range(5)]
        for c in copies:
            self.add(c)
        self.play(*[c.animate.move_to([x, FY, 0]) for c, x in zip(copies, slots)], run_time=0.9)
        note = bracket(copies, GREEN, "rows 1-4 and fold 9; fold 10 stays", up=False, size=18)
        self.play(FadeIn(note), *[c.tinted(GREEN, 0.2) for c in copies[:4]], copies[4].tinted(VIOLET, 0.3), run_time=0.5)
        self.finish(2.4)


class FK3Warm(FScene):
    """fork_points says warm for 300 s after a send; several forks of one mark share a prefix."""

    TITLE = "warm: fork while the prefix is cached"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0 = -4.6
        AY = 0.95
        rows = [cell(i) for i in range(1, 7)]
        place_row(rows, X0, AY)
        self.play(FadeIn(lane_label("agent", AY + 0.75)), run_time=0.2)
        self.say("A send ends. warm: within 300 s of the last send.")
        self.play(LaggedStart(*[FadeIn(r, shift=LEFT * 0.15) for r in rows], lag_ratio=0.1), run_time=0.9)
        bx = rows[5].get_right()[0] + GAP / 2
        flag = VGroup(Line([bx, AY - 0.45, 0], [bx, AY + 0.45, 0], color=VIOLET, stroke_width=3),
                      mono('mark "briefing"', 19, VIOLET).move_to([bx + 1.4, AY + 0.1, 0]))
        self.play(FadeIn(flag), run_time=0.4)

        # the clock
        W = 9.2
        left = -W / 2
        BY = -2.1
        track = Rectangle(width=W, height=0.2, stroke_color=LINE, stroke_width=2, fill_color=LINE, fill_opacity=0.35)
        track.move_to([0, BY, 0])
        t0 = mono("send ends", 17, DIM).move_to([left + 0.7, BY - 0.38, 0])
        t1 = mono("300 s", 17, DIM).move_to([-left - 0.45, BY - 0.38, 0])
        w1 = W
        fill1 = Rectangle(width=w1, height=0.2, stroke_width=0, fill_color=GREEN, fill_opacity=0.9)
        fill1.move_to([left + w1 / 2, BY, 0])
        t2 = mono('> 300 s', 17, RED).move_to([-left + 0.1, BY + 0.0, 0]).shift(RIGHT * 0.0)
        warm_t = pill('fork_points  ->  warm: true', color=GREEN).move_to([-1.5, BY + 0.5, 0])
        self.play(FadeIn(track), FadeIn(t0), FadeIn(t1), FadeIn(warm_t), run_time=0.4)
        self.play(GrowFromEdge(fill1, LEFT), run_time=1.2, rate_func=linear)

        # three forks of the same mark, inside the window
        names = ["a", "b", "c"]
        forks = [Node(f"fork {n}: rows 1-6", w=3.0, color=BLUE, size=18) for n in names]
        for f, x in zip(forks, (-3.7, 0.0, 3.7)):
            f.move_to([x, -0.6, 0])
        lines = [Line([bx, AY - 0.5, 0], f.get_top(), color=CYAN, stroke_width=2.4) for f in forks]
        self.say("Three forks of the same mark start from the same rows, same ids.")
        self.play(LaggedStart(*[AnimationGroup(Create(l), FadeIn(f)) for l, f in zip(lines, forks)], lag_ratio=0.3),
                  run_time=1.6)
        self.wait(0.5)

        # the window closes
        self.say("After 300 s without a send, warm is false.", color=INK)
        self.play(fill1.animate.set_fill(RED, opacity=0.9), FadeIn(t2.move_to([-left + 1.05, BY, 0])), run_time=1.0)
        cold_t = pill('fork_points  ->  warm: false', color=RED).move_to(warm_t)
        self.play(FadeOut(warm_t), FadeIn(cold_t), run_time=0.4)
        self.finish(2.4)
