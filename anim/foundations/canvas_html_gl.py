"""Foundations — Canvas › HTML and GL agents. Three clips on fantastic main (22f88cb8).

html_set:  set_html refuses a body with no element (html_check.ts:11-38), then stores a good
           one in meta.html and emits reload_html (html_agent.ts:41-54; html_view.ts:90-92).
connector: a sandboxed frame calls fantastic.send; the page relays it as the cell through the
           call gate (connector.ts:40-47; html_view.ts:98-125; panel_relay.ts:21-22).
gl_scene:  get_gl_view -> one THREE.Group per cell in a shared scene; an update runs cleanup
           and swaps only that group (gl_agent.ts:20-25; gl_host.ts:171-234,294-300).
Ids and agent names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"html_set": "HtmlSet", "connector": "Connector", "gl_scene": "GlScene"}
OG = "html_set"


def wire(a, b, color=LINE):
    return DashedLine(a.get_right(), b.get_left(), color=color, dash_length=0.14, stroke_width=3)


def hop(scene, p, to, run_time=0.8):
    scene.play(p.animate.move_to(to), run_time=run_time, rate_func=smooth)


class HtmlSet(FScene):
    TITLE = "set_html: refused, then accepted"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        v = Node("view", w=1.5, h=0.8, color=CYAN, size=22).move_to([-5.2, 0.5, 0])
        c = Node("panel1", w=2.2, h=0.8, color=BLUE, size=22).move_to([-0.6, 0.5, 0])
        body_card, body_lab = panel("meta.html", 3.6, 1.5, 4.3, 0.5)
        old = mono("old body", 20, DIM).move_to(body_card)
        self.say("A view places cell panel1, an html agent.")
        self.play(FadeIn(v), FadeIn(c), FadeIn(body_card), FadeIn(body_lab), FadeIn(old),
                  Create(wire(v, c)), run_time=0.7)

        self.say("set_html with a body that has no element is refused.")
        m = pill("set_html: ready!", color=CYAN, size=19).next_to(v, UP, buff=0.35)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        hop(self, m, c.get_top() + UP * 0.35, 0.8)
        bad = pill("bad_arg: no element", color=RED, size=19).next_to(c, DOWN, buff=0.4)
        self.play(FadeOut(m), c.tinted(RED, 0.3), FadeIn(bad), run_time=0.4)
        self.wait(0.9)

        self.say("A body with markup passes the check and is stored.")
        self.play(FadeOut(bad), c.tinted(BLUE, 0.16), run_time=0.3)
        m2 = pill("set_html: <button>", color=CYAN, size=19).next_to(v, UP, buff=0.35)
        self.play(FadeIn(m2, shift=UP * 0.1), run_time=0.4)
        hop(self, m2, c.get_top() + UP * 0.35, 0.8)
        new = mono("<button>", 22, GREEN).move_to(body_card)
        self.play(FadeOut(m2), c.tinted(GREEN, 0.3), ReplacementTransform(old, new), run_time=0.5)

        self.say("The agent emits reload_html and the panel draws the body.")
        r = pill("emit reload_html", color=VIOLET, size=19).next_to(c, DOWN, buff=0.4)
        ok = pill("ok: true", color=GREEN, size=19).next_to(v, DOWN, buff=0.4)
        self.play(FadeIn(r, shift=UP * 0.1), FadeIn(ok), run_time=0.5)
        self.finish()


class Connector(FScene):
    TITLE = "The frame calls out through the cell"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        fr = card(3.3, 1.5, stroke=BLUE).move_to([-5.0, 0.6, 0])
        frl = mono("sandboxed frame", 17, DIM).next_to(fr, UP, buff=0.14).align_to(fr, LEFT)
        code = mono("fantastic.send", 20, INK).move_to(fr)
        pg = Node("page", w=1.5, h=0.8, color=CYAN, size=22).move_to([-1.2, 0.6, 0])
        gate = Node("gate", w=1.5, h=0.8, color=AMBER, size=22).move_to([1.7, 0.6, 0])
        run = Node("runner", w=1.5, h=0.8, color=GREEN, size=22).move_to([5.7, 1.4, 0])
        sto = Node("store", w=1.5, h=0.8, color=BLUE, size=22).move_to([5.7, -0.5, 0])
        self.say("The frame's only channel is postMessage to the page.")
        self.play(FadeIn(fr), FadeIn(frl), FadeIn(code), FadeIn(pg), FadeIn(gate),
                  FadeIn(run), FadeIn(sto), run_time=0.7)
        can = mono("panel1 can_call: runner [start]", 17, AMBER).next_to(gate, DOWN, buff=0.45)
        self.play(FadeIn(can), run_time=0.3)

        self.say("The page relays it as panel1, so the gate judges it.")
        m = pill("send runner start", color=CYAN, size=18).next_to(fr, RIGHT, buff=0.2).shift(UP * 1.3)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        hop(self, m, pg.get_top() + UP * 0.4, 0.7)
        hop(self, m, gate.get_top() + UP * 0.4, 0.7)

        self.say("runner is named: the call goes through, the reply returns.")
        self.play(Indicate(can, color=GREEN, scale_factor=1.05), run_time=0.5)
        hop(self, m, run.get_left() + LEFT * 1.7, 0.7)
        self.play(run.tinted(GREEN, 0.3), FadeOut(m), run_time=0.3)
        rep = pill("reply", color=GREEN, size=18).move_to(gate.get_top() + UP * 0.4)
        self.play(FadeIn(rep), run_time=0.2)
        hop(self, rep, fr.get_right() + UP * 0.9 + RIGHT * 0.9, 1.0)
        self.play(FadeOut(rep), run_time=0.2)

        self.say("store is not named in can_call: the gate refuses.")
        m2 = pill("send store get", color=CYAN, size=18).next_to(fr, RIGHT, buff=0.2).shift(UP * 1.3)
        self.play(FadeIn(m2, shift=UP * 0.1), run_time=0.4)
        hop(self, m2, gate.get_top() + UP * 0.4, 1.0)
        no = pill("refused", color=RED, size=19).move_to(gate.get_bottom() + DOWN * 1.2)
        self.play(FadeOut(m2), gate.tinted(RED, 0.3), FadeIn(no), run_time=0.4)
        self.finish()


class GlScene(FScene):
    TITLE = "GL cells share one scene"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        cv = Node("canvas", w=1.6, h=0.8, color=CYAN, size=22).move_to([-5.4, 0.5, 0])
        g1 = Node("gl1", w=1.4, h=0.8, color=BLUE, size=22).move_to([-2.4, 1.3, 0])
        g2 = Node("gl2", w=1.4, h=0.8, color=BLUE, size=22).move_to([-2.4, -0.3, 0])
        sc, scl = panel("shared THREE scene", 5.0, 3.0, 3.6, 0.5)
        self.say("The canvas calls get_gl_view on each GL cell.")
        self.play(FadeIn(cv), FadeIn(g1), FadeIn(g2), FadeIn(sc), FadeIn(scl), run_time=0.6)
        m = pill("get_gl_view", color=CYAN, size=18).next_to(cv, UP, buff=0.35)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.3)
        hop(self, m, g1.get_top() + UP * 0.35, 0.7)
        src_ = pill("{source}", color=GREEN, size=18).move_to(g1.get_top() + UP * 0.35)
        self.play(Transform(m, src_), run_time=0.3)

        self.say("Each source runs on its own group in the scene.")
        grp1 = Node("group gl1", w=2.1, h=0.7, color=BLUE, size=19).move_to([3.6, 1.3, 0])
        self.play(FadeOut(m), g1.tinted(GREEN, 0.3), FadeIn(grp1), run_time=0.5)
        grp2 = Node("group gl2", w=2.1, h=0.7, color=BLUE, size=19).move_to([3.6, -0.3, 0])
        self.play(g2.tinted(GREEN, 0.3), FadeIn(grp2), run_time=0.5)
        fr = mono("onFrame(cb, {hz})", 18, VIOLET).move_to([3.6, 0.5, 0])
        self.play(FadeIn(fr), run_time=0.3)
        self.wait(0.5)

        self.say("The host updates gl1: cleanup runs, only its group is swapped.")
        self.play(g1.tinted(AMBER, 0.3), grp1.tinted(AMBER, 0.3), run_time=0.4)
        cl = mono("cleanup()", 18, AMBER).next_to(grp1, UP, buff=0.12)
        self.play(FadeIn(cl), run_time=0.3)
        grp1b = Node("group gl1", w=2.1, h=0.7, color=GREEN, size=19).move_to(grp1)
        self.play(FadeOut(cl), ReplacementTransform(grp1, grp1b), g1.tinted(GREEN, 0.3), run_time=0.5)
        self.play(Indicate(grp2, color=GREEN, scale_factor=1.05), run_time=0.5)
        self.finish()
