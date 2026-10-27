"""Foundations — Build your own › A program agent. Three clips on fantastic main (22f88cb8).

scaffold: the starter's four files are copied into bundles/py_<hex>/ and one instance runs
          (bundle_watch.rs:238-264; backend.rs:237-269).
verb:     a verb is in agent.py's fa.serve AND bundle.yaml verbs; unequal lists stop the
          instance, "they must match" (starter agent.py:4-5; py_agent lib.rs:366-398).
save:     a save of the program restarts every instance and a call in flight settles
          transport_closed "reloaded"; a save of panel.html only redraws
          (bundle_watch.rs:1-10; fantastic-core lib.rs:729-787).
Ids and the verb shout are illustrative; shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"scaffold": "Scaffold", "verb": "VerbTwice", "save": "SaveReloads"}
OG = "verb"


class Scaffold(FScene):
    TITLE = "The starter becomes a bundle"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.say("Double-click “python agent”: the starter is copied.")
        src_ = card(3.6, 2.6).move_to([-4.2, -0.3, 0])
        st = VGroup(*[mono(s, 20, MUTED) for s in
                      ["bundle.yaml", "agent.py", "panel.html", "fantastic_agent.py"]]).arrange(DOWN, aligned_edge=LEFT, buff=0.22).move_to(src_)
        stl = txt("starter", 22, AMBER).next_to(src_, UP, buff=0.15)
        self.play(FadeIn(src_), FadeIn(st), FadeIn(stl), run_time=0.6)

        dst = card(4.0, 2.6, stroke=BLUE).move_to([0.9, -0.3, 0])
        dl = mono("bundles/py_ab12/", 20, BLUE).next_to(dst, UP, buff=0.15)
        files = st.copy().move_to(dst)
        self.play(FadeIn(dst), FadeIn(dl), run_time=0.4)
        self.play(TransformFromCopy(st, files), run_time=1.0, rate_func=smooth)

        self.say("The kernel loads the bundle and places one instance.")
        inst = Node("py_ab12_1", w=2.5, h=0.8, color=BLUE, size=22).move_to([5.0, -0.3, 0])
        ln = DashedLine(dst.get_right(), inst.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        self.play(Create(ln), FadeIn(inst), run_time=0.6)
        ok = pill("running", color=GREEN, size=22).next_to(inst, UP, buff=0.3)
        self.play(inst.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.5)
        self.say("Edit the files in the new folder: the agent follows.", wait=0.8)
        self.finish()


class VerbTwice(FScene):
    TITLE = "A verb lives in two places"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        py = card(5.6, 1.2).move_to([-3.4, 0.8, 0])
        pyl = txt("agent.py", 22, BLUE).next_to(py, UP, buff=0.12)
        pys = mono("fa.serve: hello, count", 20, INK).move_to(py)
        ym = card(5.6, 1.2).move_to([3.4, 0.8, 0])
        yml = txt("bundle.yaml", 22, BLUE).next_to(ym, UP, buff=0.12)
        yms = mono("verbs: hello, count", 20, INK).move_to(ym)
        self.say("The program serves the verbs that bundle.yaml declares.")
        self.play(FadeIn(py), FadeIn(pyl), FadeIn(pys), FadeIn(ym), FadeIn(yml), FadeIn(yms), run_time=0.6)
        eq = pill("equal: running", color=GREEN, size=22).move_to([0, -0.9, 0])
        self.play(FadeIn(eq), py.animate.set_stroke(GREEN), ym.animate.set_stroke(GREEN), run_time=0.5)
        self.wait(0.6)

        self.say("Add shout to agent.py only: hello differs.")
        pys2 = mono("fa.serve: hello, count, shout", 20, INK).move_to(py)
        bad = pill("stopped: they must match", color=RED, size=22).move_to([0, -0.9, 0])
        self.play(Transform(pys, pys2), FadeOut(eq), py.animate.set_stroke(RED), ym.animate.set_stroke(RED), run_time=0.5)
        self.play(FadeIn(bad), run_time=0.4)
        self.wait(0.8)

        self.say("Add it to bundle.yaml too: the lists are equal.")
        yms2 = mono("verbs: hello, count, shout", 20, INK).move_to(ym)
        self.play(Transform(yms, yms2), FadeOut(bad), run_time=0.5)
        ok = pill("equal: running", color=GREEN, size=22).move_to([0, -0.9, 0])
        self.play(FadeIn(ok), py.animate.set_stroke(GREEN), ym.animate.set_stroke(GREEN), run_time=0.5)
        self.finish()


class SaveReloads(FScene):
    TITLE = "A save restarts every instance"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        i1 = Node("py_ab12_1", w=2.4, h=0.8, color=GREEN, size=22).move_to([0.2, 1.0, 0])
        i2 = Node("py_ab12_2", w=2.4, h=0.8, color=GREEN, size=22).move_to([0.2, -0.5, 0])
        f = card(3.0, 0.9, stroke=AMBER).move_to([-5.2, 0.25, 0])
        fl = mono("agent.py", 22, AMBER).move_to(f)
        self.say("A call is in flight on py_ab12_1.")
        self.play(FadeIn(i1), FadeIn(i2), FadeIn(f), FadeIn(fl), run_time=0.5)
        call = pill("slow ...", color=CYAN, size=20).next_to(i1, RIGHT, buff=0.3)
        self.play(FadeIn(call), run_time=0.3)

        self.say("agent.py is saved: reload_bundle restarts both.")
        w = pill("reload_bundle", color=VIOLET, size=20).move_to([-2.0, 0.25, 0])
        self.play(Indicate(fl, color=AMBER), FadeIn(w), run_time=0.6)
        self.play(i1.tinted(RED, 0.3), i2.tinted(RED, 0.3), run_time=0.4)
        gone = pill("transport_closed: reloaded", color=RED, size=20).next_to(i1, RIGHT, buff=0.3)
        self.play(Transform(call, gone), run_time=0.4)
        self.play(i1.tinted(GREEN, 0.3), i2.tinted(GREEN, 0.3), FadeOut(w), run_time=0.5)
        self.wait(0.4)

        self.say("panel.html is saved: no restart, only a redraw.")
        pf = card(3.0, 0.9, stroke=BLUE).move_to([-5.2, -1.8, 0])
        pfl = mono("panel.html", 22, BLUE).move_to(pf)
        self.play(FadeIn(pf), FadeIn(pfl), run_time=0.3)
        rd = pill("view redrawn", color=CYAN, size=20).move_to([0.2, -1.8, 0])
        self.play(Indicate(pfl, color=BLUE), FadeIn(rd), run_time=0.6)
        self.finish()
