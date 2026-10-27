"""Foundations — Canvas › Views of agents. Three clips on fantastic main.

choose: viewOf order: record view, exec -> terminal, else the stub (canvas/host_views.ts:83-105).
grant:  a view's calls (+ watch) become the cell's can_call (host_views.ts:108-115);
        the panel's calls are judged by the cell's grant.
tui:    PanelKind::of keys panels off handler_module; term + exec_bridge -> terminal;
        unknown -> generic (src/tui/src/panel/mod.rs:78-96, 255-259).
Ids are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, mono, pill, txt,
)

CLIPS = {"choose": "ViewChoose", "grant": "ViewGrant", "tui": "ViewTui"}
OG = "choose"


def link(a, b, color=LINE):
    return DashedLine(a.get_right(), b.get_left(), color=color, dash_length=0.14, stroke_width=3)


class ViewChoose(FScene):
    """Record view, else the kind's default, else the stub."""

    TITLE = "Record, kind, stub"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ys = [1.3, -0.1, -1.5]
        names = [("py_ab12", BLUE), ("runner", BLUE), ("notes", BLUE)]
        ags = [Node(n, w=1.9, h=0.7, color=c, size=24).move_to([-5.0, y, 0]) for (n, c), y in zip(names, ys)]
        recs = ["view: {kind: html}", "exec_bridge.tools", "no view, no kind"]
        outs = [("its own view", GREEN), ("terminal", CYAN), ("reflect card", AMBER)]

        self.say("Each host agent's record is read in order.")
        self.play(*[FadeIn(a) for a in ags], run_time=0.5)
        rs = []
        for a, r in zip(ags, recs):
            t = mono(r, 19, MUTED).next_to(a, RIGHT, buff=0.3)
            rs.append(t)
        self.play(*[FadeIn(t) for t in rs], run_time=0.5)

        self.say("A record's view comes first.")
        o1 = pill(outs[0][0], color=outs[0][1], size=21).move_to([4.6, ys[0], 0])
        self.play(FadeIn(o1, shift=LEFT * 0.1), ags[0].tinted(GREEN, 0.3), run_time=0.5)
        self.wait(0.5)

        self.say("No view: the kind's default. exec_bridge draws a terminal.")
        o2 = pill(outs[1][0], color=outs[1][1], size=21).move_to([4.6, ys[1], 0])
        self.play(FadeIn(o2, shift=LEFT * 0.1), ags[1].tinted(CYAN, 0.3), run_time=0.5)
        self.wait(0.5)

        self.say("Nothing matches: the stub shows reflect and docs.")
        o3 = pill(outs[2][0], color=outs[2][1], size=21).move_to([4.6, ys[2], 0])
        self.play(FadeIn(o3, shift=LEFT * 0.1), ags[2].tinted(AMBER, 0.3), run_time=0.5)
        self.finish()


class ViewGrant(FScene):
    """The view's calls become the cell's grant."""

    TITLE = "The view’s calls become the cell’s grant"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        rec = Node("py_ab12", w=2.0, h=0.8, color=BLUE, size=26).move_to([4.6, 0.9, 0])
        cell = Node("cell", w=1.8, h=0.8, color=CYAN, size=26).move_to([-4.6, 0.9, 0])

        self.say("The record declares what its view calls.")
        self.play(FadeIn(rec), run_time=0.4)
        v = mono("view.calls: [hello, count]", 21, MUTED).next_to(rec, DOWN, buff=0.95).align_to([6.0, 0, 0], RIGHT)
        self.play(FadeIn(v), run_time=0.4)

        self.say("The cell's grant is derived from them, plus watch.")
        self.play(FadeIn(cell), run_time=0.4)
        g = mono("can_call: {py_ab12: [hello, count, watch]}", 21, GREEN).next_to(cell, DOWN, buff=0.3).align_to(cell, LEFT)
        self.play(FadeIn(g, shift=UP * 0.1), run_time=0.5)
        lk = link(cell, rec, CYAN)
        self.play(Create(lk), run_time=0.4)

        self.say("The panel's hello passes the gate as the cell.")
        m = pill("hello", color=CYAN, size=21).next_to(cell, UP, buff=0.35)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.3)
        self.play(m.animate.next_to(rec, UP, buff=0.35), run_time=0.9, rate_func=smooth)
        self.play(rec.tinted(GREEN, 0.3), run_time=0.3)
        self.wait(0.4)

        self.say("stop is not in the grant, so it is refused.")
        s = pill("stop", color=RED, size=21).next_to(cell, UP, buff=0.35)
        self.play(FadeOut(m), FadeIn(s), run_time=0.3)
        self.play(s.animate.move_to([0, 2.2, 0]), run_time=0.7)
        x = mono("refused", 22, RED).next_to(s, DOWN, buff=0.2)
        self.play(FadeIn(x), run_time=0.3)
        self.finish()


class ViewTui(FScene):
    """The TUI keys a panel off handler_module."""

    TITLE = "A panel per handler_module"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        rows = [
            ("vllm_backend.tools", "AI panel", VIOLET),
            ("term · exec_bridge.tools", "terminal", CYAN),
            ("exec · exec_bridge.tools", "generic", AMBER),
            ("never_seen.tools", "generic", AMBER),
        ]
        ys = [1.5, 0.35, -0.8, -1.95]
        self.say("The tree reflect gives each agent's handler_module.")
        left = [Node(a, w=4.4, h=0.7, color=BLUE, size=21).move_to([-3.2, y, 0]) for (a, _, _), y in zip(rows, ys)]
        self.play(*[FadeIn(n) for n in left], run_time=0.6)

        self.say("Selecting one switches the right pane to its panel.")
        for n, (_, p, c), y in zip(left, rows, ys):
            pl = pill(p, color=c, size=21).move_to([3.7, y, 0])
            self.play(FadeIn(pl, shift=LEFT * 0.1), n.tinted(c, 0.3), run_time=0.45)
        self.wait(0.3)
        self.say("Unknown modules get the generic panel: reflect and every verb.", wait=0.4)
        self.finish()
