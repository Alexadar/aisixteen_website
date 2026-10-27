"""Foundations — Protocol › The idea.

Three clips. Ids and agent names are illustrative; the shapes and the routing are real:
  peers   - human `user`, a model, a program as flat peers; every send goes through the kernel
            (facts 1, 2, 9, 21, 23, 26, 29 in facts/idea.md)
  table   - the tree is ownership; routing resolves an id in one flat table (facts 8, 9, 10)
  reflect - one batch of reflect to three agents, answered in input order (facts 4, 13, 14, 17)
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

CLIPS = {"peers": "Peers", "table": "Table", "reflect": "Reflect"}
OG = "peers"


class Peers(FScene):
    EYEBROW = "Protocol"
    TITLE = "Three peers, one mediator"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        k = Node("kernel", w=2.0, h=0.8, color=CYAN, size=26).move_to([0, -0.1, 0])
        user = Node("user", w=1.7, color=GREEN).move_to([-4.6, 1.3, 0])
        ai = Node("ai", w=1.7, color=VIOLET).move_to([4.6, 1.3, 0])
        tool = Node("tool", w=1.7, color=BLUE).move_to([0, -2.1, 0])
        kinds = [txt("human", 22, MUTED).next_to(user, UP, buff=0.18),
                 txt("model", 22, MUTED).next_to(ai, UP, buff=0.18),
                 txt("program", 22, MUTED).next_to(tool, DOWN, buff=0.18)]
        self.say("A human, a model and a program are all agents with an id.")
        self.play(FadeIn(k), *[FadeIn(n) for n in (user, ai, tool)], *[FadeIn(t) for t in kinds], run_time=0.8)
        def edge(n, toward):
            c, d = n.get_center(), toward - n.get_center()
            hw, hh = n.box.width / 2, n.box.height / 2
            t = min(hw / abs(d[0]) if abs(d[0]) > 1e-6 else 1e9, hh / abs(d[1]) if abs(d[1]) > 1e-6 else 1e9)
            return c + d * t

        links = [Line(edge(n, k.get_center()), edge(k, n.get_center()), color=LINE, stroke_width=2.2).set_z_index(-1)
                 for n in (user, ai, tool)]
        self.play(*[Create(l) for l in links], run_time=0.5)
        self.wait(0.5)

        idx = {id(user): 0, id(ai): 1, id(tool): 2}
        idx = {k_: v for k_, v in idx.items()}

        def hop(a, b, label, color=CYAN):
            p = pill(label, color=color, size=18).move_to(a.get_center())
            self.play(FadeIn(p), run_time=0.2)
            via = k.get_top() + UP * 0.45
            self.play(p.animate.move_to(via), run_time=0.7, rate_func=smooth)
            self.play(k.tinted(CYAN, 0.35), run_time=0.2)
            self.play(p.animate.move_to(b.get_center() + DOWN * 0.0), run_time=0.7, rate_func=smooth)
            self.play(FadeOut(p), b.tinted(b.color_, 0.35), run_time=0.25)
            self.play(b.tinted(b.color_, 0.16), k.tinted(CYAN, 0.16), run_time=0.2)
            self.play(links[idx[id(a)]].animate.set_color(color), links[idx[id(b)]].animate.set_color(color), run_time=0.3)

        self.say("The human's send goes to the kernel, which routes it to the model.")
        hop(user, ai, "send")
        self.say("The model's call goes to the program the same way.")
        hop(ai, tool, "call", VIOLET)
        self.say("No peer calls another directly. The kernel mediates.", wait=0.6)
        self.finish()


class Table(FScene):
    EYEBROW = "Protocol"
    TITLE = "Routing by id, not by tree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        pa, ta = panel("tree  ·  ownership", 5.2, 3.7, -3.4, y=0.0)
        pb, tb = panel("agents  ·  one table", 4.6, 3.7, 3.7, y=0.0)
        self.say("Agents form a tree. Each one is made under a parent.")
        self.play(FadeIn(pa), FadeIn(ta), run_time=0.4)
        kn = Node("kernel", w=1.8, color=CYAN).move_to([-3.4, 1.15, 0])
        no = Node("notes", w=1.6, color=BLUE).move_to([-3.4, 0.1, 0])
        wo = Node("worker", w=1.6, color=BLUE).move_to([-3.4, -0.95, 0])
        c1, c2 = connector(kn, no), connector(no, wo)
        self.play(FadeIn(kn), run_time=0.3)
        self.play(Create(c1), FadeIn(no), run_time=0.4)
        self.play(Create(c2), FadeIn(wo), run_time=0.4)

        self.say("The kernel also keeps one flat table of every id.")
        self.play(FadeIn(pb), FadeIn(tb), run_time=0.4)
        rows = VGroup(*[
            VGroup(mono(i, 21, AMBER), mono("->", 21, DIM), mono(h, 19, MUTED)).arrange(RIGHT, buff=0.2)
            for i, h in (("kernel", "none"), ("notes", "file_bridge"), ("worker", "py_agent"))
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.38).move_to(pb).shift(UP * 0.1)
        self.play(LaggedStart(*[FadeIn(r, shift=LEFT * 0.15) for r in rows], lag_ratio=0.25), run_time=0.9)
        self.wait(0.4)

        self.say("A send to worker is looked up in the table...")
        m = pill('worker', color=CYAN, size=18).move_to([0.3, 2.0, 0])
        self.play(FadeIn(m), run_time=0.3)
        box = SurroundingRectangle(rows[2], color=AMBER, buff=0.1, corner_radius=0.08)
        self.play(m.animate.move_to([0.3, -0.95, 0]), Create(box), run_time=0.7)
        self.say("...and delivered directly. notes is never visited.")
        self.play(m.animate.move_to(wo.get_right() + RIGHT * 0.1 + RIGHT * m.width / 2), run_time=0.7, rate_func=smooth)
        self.play(wo.tinted(GREEN, 0.3), FadeOut(m), run_time=0.3)
        self.finish()


class Reflect(FScene):
    EYEBROW = "Protocol"
    TITLE = "Every agent answers reflect"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        pa, ta = panel("send  [items]", 3.8, 3.5, -4.9, y=0.0)
        pb, tb = panel("reply  ·  input order", 6.8, 3.5, 3.3, y=0.0)
        self.say("One batch: the same reflect, sent to three agents.")
        self.play(FadeIn(pa), FadeIn(ta), run_time=0.4)
        ids = ("kernel", "user", "ai")
        rows = VGroup(*[
            VGroup(mono(str(i + 1), 20, DIM), mono(t, 21, CYAN), mono("· reflect", 21, INK)).arrange(RIGHT, buff=0.16)
            for i, t in enumerate(ids)
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.55).move_to(pa)
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in rows], lag_ratio=0.25), run_time=0.9)
        self.wait(0.4)

        self.say("Each agent answers with what it is, in input order.")
        self.play(FadeIn(pb), FadeIn(tb), run_time=0.4)
        sents = (("kernel", "Fantastic kernel."), ("user", "the one human"), ("ai", "a model backend"))
        reps = VGroup(*[
            VGroup(mono(str(i + 1), 20, DIM), mono(f'id "{a}"', 20, AMBER), mono(f'sentence "{s}"', 17, MUTED)).arrange(RIGHT, buff=0.18)
            for i, (a, s) in enumerate(sents)
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.55).move_to(pb)
        for r in reps:
            self.play(FadeIn(r, shift=LEFT * 0.15), run_time=0.5)
            self.wait(0.2)
        self.say("Every agent has this one self-description.", wait=0.5)
        self.finish()
