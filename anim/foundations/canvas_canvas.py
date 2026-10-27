"""Foundations — Canvas › Canvas. 3 clips, each one mechanism of the view.

place: place {kind: html, x, y} on view_root, rect written to layout_canvas, then move
  (canvas_agent.ts:166-233, layout.ts:231-241).
wire: wire writes can_call / callable_by; hide / show keep the agent and its rect
  (canvas_agent.ts:277-333, layout.ts:274-287).
selector: double-click adds selector_<hex>, tiles, a pick places the cell, the selector deletes
  itself (selector_agent.ts:44-57, canvas.ts:1984-1993, 2104).
Ids are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"place": "Place", "wire": "WireHide", "selector": "Selector"}
OG = "place"


def view_frame():
    c = card(8.0, 4.3).move_to([-1.2, -0.3, 0])
    t = mono("view_root", size=17, color=DIM).next_to(c, UP, buff=0.14).align_to(c, LEFT).shift(RIGHT * 0.06)
    return c, t


def cell(label, w, h, color, pos):
    b = RoundedRectangle(corner_radius=0.1, width=w, height=h, stroke_color=color, stroke_width=2.4,
                         fill_color=color, fill_opacity=0.16)
    l = mono(label, size=18, color=INK).move_to(b)
    return VGroup(b, l).move_to(pos)


class Place(FScene):
    TITLE = "Place and move a cell"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c, t = view_frame()
        lay = card(3.7, 1.5).move_to([4.9, 0.6, 0])
        lt = mono("layout_canvas", size=17, color=DIM).next_to(lay, UP, buff=0.14).align_to(lay, LEFT)
        self.play(FadeIn(c), FadeIn(t), FadeIn(lay), FadeIn(lt), run_time=0.5)

        self.say("place sends kind html, x 80, y 60 to view_root.")
        msg = pill('place {kind: html, x: 80, y: 60}', color=CYAN, size=18).move_to([2.6, 2.45, 0])
        self.play(FadeIn(msg, shift=DOWN * 0.1), run_time=0.4)
        cl = cell("html_1a2b", 2.6, 1.7, BLUE, [-3.6, 0.6, 0])
        self.play(FadeOut(msg), FadeIn(cl, scale=0.9), run_time=0.5)

        self.say("Its rectangle is written to the layout, not to the cell.")
        r1 = mono('html_1a2b: x 80, y 60, 480x320', size=13, color=AMBER).move_to(lay).shift(UP * 0.1)
        self.play(FadeIn(r1), run_time=0.4)
        self.wait(0.5)

        self.say("move rewrites only that rectangle.", wait=0.2)
        r2 = mono('html_1a2b: x 400, y 60, 480x320', size=13, color=AMBER).move_to(r1)
        self.play(cl.animate.move_to([0.8, 0.6, 0]), Transform(r1, r2), run_time=0.9, rate_func=smooth)
        self.play(cl[0].animate.set_stroke(GREEN).set_fill(GREEN, opacity=0.22), run_time=0.3)
        self.wait(0.3)
        self.finish()


class WireHide(FScene):
    TITLE = "Wire, hide and show"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c, t = view_frame()
        a = cell("chart_1", 2.0, 1.2, BLUE, [-3.7, 0.5, 0])
        b = cell("feed_1", 2.0, 1.2, VIOLET, [1.3, 0.5, 0])
        self.play(FadeIn(c), FadeIn(t), FadeIn(a), FadeIn(b), run_time=0.5)

        self.say("wire adds watch on both cells, one grant per side.")
        w = pill('wire chart_1 -> feed_1 [watch]', color=CYAN, size=17).move_to([2.6, 2.45, 0])
        g1 = mono("can_call: feed_1 [watch]", size=13, color=GREEN).next_to(a, DOWN, buff=0.25).shift(RIGHT * 0.1)
        g2 = mono("callable_by: chart_1 [watch]", size=13, color=GREEN).next_to(b, DOWN, buff=0.25).shift(LEFT * 0.35)
        ar = Arrow(a.get_right(), b.get_left(), color=CYAN, buff=0.08, stroke_width=3)
        self.play(FadeIn(w, shift=DOWN * 0.1), run_time=0.4)
        self.play(Create(ar), FadeIn(g1), FadeIn(g2), run_time=0.7)
        self.wait(0.4)

        self.say("hide takes feed_1 off the view; its agent keeps running.")
        h = pill('hide {id: feed_1}', color=AMBER, size=17).move_to(w)
        run = mono("agent running, rect kept", size=15, color=AMBER).move_to([5.0, 0.5, 0])
        self.play(Transform(w, h), run_time=0.3)
        self.play(FadeOut(b), FadeOut(g2), FadeOut(ar), FadeIn(run), run_time=0.6)
        self.wait(0.4)

        self.say("show puts it back where it was.", wait=0.1)
        s = pill('show {id: feed_1}', color=GREEN, size=17).move_to(w)
        self.play(Transform(w, s), run_time=0.3)
        self.play(FadeIn(b), FadeIn(g2), FadeIn(ar), FadeOut(run), run_time=0.6)
        self.wait(0.3)
        self.finish()


class Selector(FScene):
    TITLE = "The selector popup"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c, t = view_frame()
        self.play(FadeIn(c), FadeIn(t), run_time=0.4)

        self.say("A double-click on empty canvas adds a selector agent.")
        spot = Dot([-3.4, 0.9, 0], radius=0.09, color=CYAN)
        ring = Circle(radius=0.4, color=CYAN, stroke_width=2).move_to(spot)
        sel = Node("selector_3f9a1c20", w=3.5, color=AMBER, size=17).move_to([2.6, 2.45, 0])
        self.play(FadeIn(spot), Create(ring), run_time=0.5)
        self.play(FadeIn(sel, shift=DOWN * 0.1), run_time=0.4)

        self.say("tiles lists what can be made there.")
        pop = card(3.6, 2.6).move_to([-0.9, 0.0, 0])
        tiles = VGroup(*[pill(n, color=col, size=16) for n, col in
                         [("terminal", BLUE), ("html", BLUE), ("file tree", BLUE), ("claude", VIOLET)]])
        tiles.arrange(DOWN, buff=0.18).move_to(pop)
        self.play(FadeIn(pop), FadeIn(tiles), run_time=0.6)
        self.wait(0.5)

        self.say("A pick is placed at the spot, and the selector deletes itself.")
        newcell = cell("html_5d7e", 2.4, 1.5, GREEN, [-2.5, 0.4, 0])
        self.play(FadeOut(pop), FadeOut(tiles), FadeOut(sel), FadeOut(ring), FadeOut(spot),
                  FadeIn(newcell, scale=0.9), run_time=0.7)
        self.wait(0.3)
        self.finish()
