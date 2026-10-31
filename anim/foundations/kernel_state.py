"""Foundations — Kernel › State and durability. 3 clips.

ids:     one counter names a call, a task and a settle row; the root record holds only the
         reserved bound — PY/kernel/_kernel.py:485-503, 559-573; rows.rs:11-18 (facts 15-18).
reserve: blocks of 1000, next_id written when the old block is spent, a crash skips ids and a
         restart resumes at the stored bound — _kernel.py:490-503, 1743-1750; rows.rs:87-97
         (facts 19-22).
restart: the tree comes back through a file_bridge at .fantastic; rows come back from
         sqlite_store and are gone from ram_store — tools.py:329-366; store readmes (facts 6, 7, 28, 30).
Ids and agent names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"ids": "Ids", "reserve": "Reserve", "restart": "Restart"}
OG = "restart"


class Ids(FScene):
    """One counter hands out the id of a call, a forked task and a settle row."""

    TITLE = "One counter names everything"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        xs = [-4.2, 0.0, 4.2]
        who = [txt("lead calls planner", 22, DIM), txt("planner forks a task", 22, DIM), txt("kernel settles", 22, DIM)]
        kinds = [Node("call", w=2.2, color=BLUE), Node("task", w=2.2, color=BLUE), Node("settle row", w=2.2, color=GREEN)]
        ids = [pill("41", AMBER, 26), pill("42", AMBER, 26), pill("43", AMBER, 26)]
        for x, w_, k, i in zip(xs, who, kinds, ids):
            k.move_to([x, 0.7, 0])
            w_.next_to(k, UP, buff=0.3)
            i.next_to(k, DOWN, buff=0.35)
        counter = VGroup(card(3.2, 0.8, stroke=VIOLET), mono("counter", 22, VIOLET)).move_to([0, 2.15, 0])
        counter[1].move_to(counter[0])
        counter.to_corner(UR, buff=0.5).shift(DOWN * 0.3)

        self.say("Every id in the kernel comes from one counter.")
        self.play(FadeIn(counter, shift=DOWN * 0.1), run_time=0.4)
        for k, w_, i in zip(kinds, who, ids):
            self.play(FadeIn(w_), FadeIn(k), run_time=0.35)
            self.play(FadeIn(i, shift=DOWN * 0.1), Indicate(counter[0], color=VIOLET, scale_factor=1.04), run_time=0.45)
        self.wait(0.4)

        lt = VGroup(mono("41", 26, AMBER), mono("<", 26, MUTED), mono("42", 26, AMBER), mono("<", 26, MUTED), mono("43", 26, AMBER))
        lt.arrange(RIGHT, buff=0.3).move_to([0, -1.05, 0])
        self.say("Only ever up: a smaller id was created first. No id is reused.")
        self.play(FadeIn(lt, shift=UP * 0.1), run_time=0.5)
        self.wait(0.6)

        rec = VGroup(card(7.0, 0.85, stroke=LINE), mono("root record   next_id: 1001", 22, INK)).move_to([0, -2.2, 0])
        rec[1].move_to(rec[0])
        self.say("The root record stores only the reserved bound.")
        self.play(FadeIn(rec, shift=UP * 0.1), run_time=0.5)
        self.finish()


class Reserve(FScene):
    """Blocks of 1000: the bound is written when a block is spent; a crash skips, never repeats."""

    TITLE = "Ids reserved in blocks"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0, W = -5.5, 11.0
        sx = lambda n: X0 + W * n / 3000.0
        y = 0.7
        blocks = []
        for b in range(3):
            r = Rectangle(width=W / 3 - 0.06, height=0.7, stroke_color=LINE, stroke_width=2,
                          fill_color=LINE, fill_opacity=0.18)
            r.move_to([sx(b * 1000 + 500), y, 0])
            blocks.append(r)
        ticks = VGroup(*[mono(str(v), 18, DIM).move_to([sx(v - 1 if v > 1 else 1) + (0.1 if v == 1 else 0), y - 0.65, 0])
                         for v in (1, 1001, 2001)])
        names = VGroup(*[mono(f"block {b + 1}", 18, DIM).move_to(blocks[b]) for b in range(3)])

        def rec(text, color=INK):
            g = VGroup(card(6.4, 0.8, stroke=color), mono(text, 22, color))
            g[1].move_to(g[0])
            return g.move_to([0, -1.75, 0])

        self.say("A block of 1000 ids is reserved at a time.")
        self.play(FadeIn(VGroup(*blocks)), FadeIn(ticks), FadeIn(names), run_time=0.5)
        self.play(blocks[0].animate.set_stroke(AMBER).set_fill(AMBER, opacity=0.22), run_time=0.3)
        r1 = rec("root record   next_id: 1001", AMBER)
        self.play(FadeIn(r1, shift=UP * 0.1), run_time=0.4)
        mk = Dot(radius=0.11, color=CYAN).move_to([sx(1), y + 0.55, 0])
        lab = mono("id", 18, CYAN).next_to(mk, UP, buff=0.1)
        self.play(FadeIn(mk), FadeIn(lab), run_time=0.3)
        self.play(mk.animate.move_to([sx(1000), y + 0.55, 0]), lab.animate.move_to([sx(1000), y + 0.95, 0]), run_time=0.7)

        self.say("Minting 1001 spends the block: the next one is reserved and written.")
        self.play(mk.animate.move_to([sx(1001), y + 0.55, 0]), lab.animate.move_to([sx(1001), y + 0.95, 0]), run_time=0.3)
        self.play(blocks[1].animate.set_stroke(AMBER).set_fill(AMBER, opacity=0.22), run_time=0.3)
        r2 = rec("root record   next_id: 2001", AMBER)
        self.play(FadeTransform(r1, r2), run_time=0.5)
        self.play(mk.animate.move_to([sx(1500), y + 0.55, 0]), lab.animate.move_to([sx(1500), y + 0.95, 0]), run_time=0.6)

        self.say("A crash at id 1500. The restart resumes at the stored bound.")
        crash = pill("crash", RED, 22).move_to([sx(1500), y + 1.65, 0])
        self.play(FadeIn(crash, shift=DOWN * 0.1), mk.animate.set_color(RED), run_time=0.4)
        self.wait(0.5)
        skipped = Rectangle(width=sx(2000) - sx(1500), height=0.7, stroke_color=RED, stroke_width=2,
                            fill_color=RED, fill_opacity=0.25).move_to([(sx(1500) + sx(2000)) / 2, y, 0])
        sk = mono("skipped", 18, RED).move_to(skipped)
        sk.move_to([sx(1750), y, 0])
        skipped.move_to([sx(1750), y, 0])
        cl = DashedLine([sx(1500), y - 0.4, 0], [sx(1500), y + 0.45, 0], color=RED, stroke_width=2)
        self.play(FadeIn(skipped), FadeIn(sk), FadeIn(cl), FadeOut(crash), names[1].animate.move_to([sx(1250), y, 0]), run_time=0.5)
        reserved = mono("reserved", 16, AMBER).move_to([sx(2500), y + 0.58, 0])
        self.play(mk.animate.move_to([sx(2001), y + 0.55, 0]).set_color(CYAN), lab.animate.move_to([sx(2001), y + 0.95, 0]),
                  blocks[2].animate.set_stroke(AMBER, width=1.5).set_fill(LINE, opacity=0.18), FadeIn(reserved), run_time=0.7)
        r3 = rec("root record   next_id: 3001", AMBER)
        self.play(FadeTransform(r2, r3), run_time=0.5)
        self.say("Ids 1501 to 2000 are skipped. None is issued twice.", color=INK)
        self.finish()


class Restart(FScene):
    """The tree comes back through a file_bridge; rows come back from sqlite_store, not ram_store."""

    TITLE = "What survives a restart"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        rows = [
            ("file_bridge", "agent tree", "agent.yaml files", BLUE),
            ("sqlite_store", "ledger, memory", "one SQLite file", GREEN),
            ("ram_store", "ledger, memory", "RAM", AMBER),
        ]
        ys = [0.9, -0.3, -1.5]
        stores, holds = [], []
        for (name, what, where, col), y in zip(rows, ys):
            s = Node(name, w=2.9, color=col).move_to([-4.3, y, 0])
            h = VGroup(txt(what, 22, INK), txt(where, 18, DIM)).arrange(DOWN, buff=0.06).move_to([-0.3, y, 0])
            stores.append(s)
            holds.append(h)
        arrows = [Arrow(s.get_right(), h.get_left() + LEFT * 0.1, buff=0.12, color=LINE, stroke_width=2.4,
                        max_tip_length_to_length_ratio=0.2) for s, h in zip(stores, holds)]
        self.say("Three agents hold the state: one for the tree, two for rows.")
        self.play(LaggedStart(*[AnimationGroup(FadeIn(s), Create(a), FadeIn(h)) for s, a, h in zip(stores, arrows, holds)],
                              lag_ratio=0.25), run_time=1.6)
        self.wait(0.5)

        bar = pill("restart: the process exits", RED, 22).move_to([0.9, 2.15, 0])
        div = DashedLine([2.35, 1.6, 0], [2.35, -2.3, 0], color=RED, stroke_width=2.2)
        self.say("The process exits and starts again.")
        self.play(FadeIn(bar, shift=DOWN * 0.1), Create(div), run_time=0.6)
        results = [("back", GREEN), ("back", GREEN), ("empty", RED)]
        outs = [pill(t, c, 24).move_to([4.7, y, 0]) for (t, c), y in zip(results, ys)]
        self.wait(0.5)
        self.say("The tree and sqlite_store come back. ram_store is empty.")
        self.play(LaggedStart(*[FadeIn(o, shift=LEFT * 0.15) for o in outs], lag_ratio=0.3), run_time=1.0)
        self.finish()
