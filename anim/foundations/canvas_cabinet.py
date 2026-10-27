"""Foundations — Canvas › Cabinet. Three clips, each one mechanism on fantastic main (22f88cb8).

open:    open_cabinet -> new_canvas on the spawning canvas -> cabinet cell + worker; the worker is
         not started (cabinet/tools.py:349-470, 471-530, 599-603).
wiring:  workers message each other (send, reflect), the master calls them in full, a worker holds
         create/place on its canvas and nothing on the root (tools.py:518-573, 101-103).
conclude: status up; conclude {keep:[result]} keeps the canvas and the result, deletes the rest
         (tools.py:754-774, 708-748, 613-632).
Ids and agent names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"open": "Open", "wiring": "Wiring", "conclude": "Conclude"}
OG = "open"


class Open(FScene):
    TITLE = "open_cabinet: a canvas and a worker"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        master = Node("master AI", w=2.0, color=VIOLET).move_to([-5.0, 1.0, 0])
        mgr = Node("manager", w=1.8, color=BLUE).move_to([-1.6, 1.0, 0])
        canvas = Node("canvas_root", w=2.2, color=CYAN).move_to([3.6, 1.0, 0])
        self.say("The master sends open_cabinet {task} to the manager.")
        self.play(FadeIn(master), FadeIn(mgr), FadeIn(canvas), run_time=0.5)
        m = pill("open_cabinet {task}", color=CYAN, size=18).next_to(master, DOWN, buff=0.4)
        self.play(FadeIn(m), run_time=0.3)
        self.play(m.animate.next_to(mgr, DOWN, buff=0.4), run_time=0.8, rate_func=smooth)
        self.play(FadeOut(m), run_time=0.2)

        self.say("The manager asks the spawning canvas for new_canvas.")
        n = pill("new_canvas", color=CYAN, size=18).next_to(mgr, UP, buff=0.35)
        self.play(FadeIn(n), run_time=0.3)
        self.play(n.animate.next_to(canvas, UP, buff=0.35), run_time=0.9, rate_func=smooth)
        self.play(FadeOut(n), run_time=0.2)
        child = Node("canvas_cabinet_alpha", w=3.4, color=CYAN, size=20).move_to([3.6, -0.4, 0])
        link = Line(canvas.get_bottom(), child.get_top(), color=LINE, stroke_width=3)
        self.play(Create(link), FadeIn(child), run_time=0.5)

        self.say("It creates the cabinet cell and its worker AI.")
        cab = Node("cabinet_alpha", w=2.6, color=BLUE, size=20).move_to([-1.6, -0.4, 0])
        wk = Node("cabinet_alpha_worker", w=3.6, color=VIOLET, size=18).move_to([-1.6, -1.8, 0])
        l2 = Line(mgr.get_bottom(), cab.get_top(), color=LINE, stroke_width=3)
        l3 = Line(cab.get_bottom(), wk.get_top(), color=LINE, stroke_width=3)
        self.play(Create(l2), FadeIn(cab), run_time=0.5)
        self.play(Create(l3), FadeIn(wk), run_time=0.5)

        self.say("The worker is not started: the master sends it the task.", wait=0.6)
        t = pill("worker waits", color=AMBER, size=18).next_to(wk, RIGHT, buff=0.4)
        self.play(FadeIn(t), run_time=0.3)
        self.finish()


class Wiring(FScene):
    TITLE = "Grants between workers"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        master = Node("master", w=1.6, color=VIOLET).move_to([0, 1.5, 0])
        wa = Node("alpha_worker", w=2.4, color=BLUE, size=20).move_to([-4.0, -0.4, 0])
        wb = Node("beta_worker", w=2.4, color=BLUE, size=20).move_to([4.0, -0.4, 0])
        root = Node("root", w=1.4, color=MUTED).move_to([0, -2.0, 0])
        self.say("Two cabinets, two workers, one master.")
        self.play(FadeIn(master), FadeIn(wa), FadeIn(wb), FadeIn(root), run_time=0.5)

        self.say("The master may call each worker in full.")
        for w in (wa, wb):
            ar = Arrow(master.get_bottom(), w.get_top(), color=VIOLET, buff=0.1, stroke_width=3)
            self.play(Create(ar), run_time=0.4)
        lab = pill("all verbs", color=VIOLET, size=18).move_to([0, 0.4, 0])
        self.play(FadeIn(lab), run_time=0.3)

        self.say("Workers may only message each other: send, reflect.")
        a2 = DoubleArrow(wa.get_right(), wb.get_left(), color=CYAN, buff=0.1, stroke_width=3)
        l2 = pill("send, reflect", color=CYAN, size=18).next_to(a2, DOWN, buff=0.15)
        self.play(FadeOut(lab), Create(a2), FadeIn(l2), run_time=0.6)

        self.say("No worker holds any grant on the root.")
        dn = Arrow(wa.get_bottom(), root.get_left(), color=RED, buff=0.1, stroke_width=3)
        x = Cross(stroke_color=RED, stroke_width=5).scale(0.2).move_to(dn.point_from_proportion(0.5))
        r = pill("refused", color=RED, size=18).next_to(root, RIGHT, buff=0.3)
        self.play(Create(dn), Create(x), FadeIn(r), run_time=0.5)
        self.finish()


class Conclude(FScene):
    TITLE = "conclude keeps a result"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        cab = Node("cabinet_alpha", w=2.6, color=BLUE, size=20).move_to([-4.6, 1.2, 0])
        wk = Node("alpha_worker", w=2.4, color=VIOLET, size=20).move_to([-4.6, -0.2, 0])
        cv = Node("canvas_cabinet_alpha", w=3.6, color=CYAN, size=18).move_to([2.2, 1.2, 0])
        rep = Node("report", w=1.6, color=GREEN).move_to([0.6, -0.4, 0])
        run = Node("exec runner", w=2.0, color=BLUE, size=20).move_to([3.8, -0.4, 0])
        self.say("The worker builds on its canvas and reports status up.")
        self.play(FadeIn(cab), FadeIn(wk), FadeIn(cv), FadeIn(rep), FadeIn(run), run_time=0.6)
        st = pill('status {line, progress: 100}', color=AMBER, size=18).next_to(wk, DOWN, buff=0.4)
        self.play(FadeIn(st), run_time=0.3)
        self.play(st.animate.next_to(cab, DOWN, buff=1.0).shift(RIGHT * 0.6).set_opacity(0.0), run_time=0.8)
        self.play(cab.tinted(GREEN, 0.3), run_time=0.3)
        self.wait(0.3)

        self.say('conclude {keep: ["report"]} keeps a result on the canvas.')
        k = pill('conclude {keep: [report]}', color=CYAN, size=20).move_to([0, -2.1, 0])
        self.play(FadeIn(k), run_time=0.4)
        self.play(rep.tinted(GREEN, 0.35), run_time=0.3)

        self.say("The cabinet, worker and other equipment are deleted.")
        self.play(*[m.animate.set_opacity(0.0) for m in (cab, wk, run)], run_time=0.7)
        kept = pill("kept: canvas + report", color=GREEN, size=20).move_to([1.6, -1.6, 0])
        self.play(FadeOut(k), FadeIn(kept), run_time=0.4)
        self.finish()
