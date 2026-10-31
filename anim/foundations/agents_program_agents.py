"""Foundations — Agents › Program agents. Four clips, each one mechanism on fantastic main (df457a0f).

hello: the program's first message names its verbs; they must equal bundle.yaml's, else the
       instance stops saying so (py_agent lib.rs:366-401; tools.py:242-255).
call:  call {rid, payload} -> handler -> result {rid}; a raising handler answers {error}
       (lib.rs:483-518; fantastic_agent.py:94-116).
out:   inside a handler, send (as the agent, gated) and emit (an event on the agent)
       (fantastic_agent.py:74-87; relay.rs:394-447).
stop:  an exit settles in-flight calls transport_closed, status stopped, hint reload_bundle
       (lib.rs:447-469,485-494,534-536).
Ids and agent names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"hello": "Hello", "call": "CallResult", "out": "SendEmit", "stop": "Stops"}
OG = "call"

KX, PX = -3.6, 3.6  # kernel column, program column


def wire(a, b, color=LINE):
    return DashedLine(a.get_right(), b.get_left(), color=color, dash_length=0.14, stroke_width=3)


def hop(scene, p, to, run_time=0.8):
    scene.play(p.animate.move_to(to), run_time=run_time, rate_func=smooth)


class Hello(FScene):
    TITLE = "hello: the program names its verbs"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        k = Node("kernel", w=1.8, h=0.8, color=CYAN, size=24).move_to([KX, 0.9, 0])
        p = Node("tool program", w=2.8, h=0.8, color=BLUE, size=22).move_to([PX, 0.9, 0])
        yaml = card(3.2, 0.7).move_to([KX, -0.5, 0])
        ylab = mono("verbs: echo", 20, AMBER).move_to(yaml)

        self.say("The kernel starts the command with FANTASTIC_CTRL_FD.")
        self.play(FadeIn(k), FadeIn(yaml), FadeIn(ylab), run_time=0.5)
        w = wire(k, p)
        self.play(FadeIn(p), Create(w), run_time=0.6)
        self.wait(0.3)

        self.say("Its first message is hello, with the verbs it serves.")
        h = pill('hello [echo]', color=CYAN, size=20).next_to(p, DOWN, buff=0.45)
        self.play(FadeIn(h, shift=UP * 0.1), run_time=0.4)
        self.play(h.animate.next_to(yaml, RIGHT, buff=0.25), run_time=0.9, rate_func=smooth)
        self.play(Indicate(ylab, color=GREEN, scale_factor=1.08), run_time=0.5)

        self.say("They equal bundle.yaml's verbs: the instance is running.")
        ok = pill("running", color=GREEN, size=22).next_to(k, UP, buff=0.3)
        self.play(FadeOut(h), k.tinted(GREEN, 0.3), p.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.5)
        self.wait(0.9)

        self.say("A program that serves other verbs is killed; reflect says why.")
        self.play(FadeOut(ok), k.tinted(CYAN, 0.16), p.tinted(RED, 0.3), run_time=0.4)
        h2 = pill('hello [echo, shout]', color=CYAN, size=20).next_to(p, DOWN, buff=0.45)
        self.play(FadeIn(h2, shift=UP * 0.1), run_time=0.4)
        self.play(h2.animate.next_to(yaml, RIGHT, buff=0.25), run_time=0.9, rate_func=smooth)
        self.play(Indicate(ylab, color=RED, scale_factor=1.08), run_time=0.5)
        bad = pill("stopped: must match", color=RED, size=20).next_to(k, UP, buff=0.3)
        self.play(FadeOut(h2), FadeIn(bad), run_time=0.4)
        self.finish()


class CallResult(FScene):
    TITLE = "A call, a result, a raise"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c = Node("caller", w=1.6, h=0.8, color=BLUE, size=22).move_to([-6.0, 0.4, 0])
        k = Node("kernel", w=1.6, h=0.8, color=CYAN, size=22).move_to([-2.2, 0.4, 0])
        p = Node("tool", w=2.0, h=0.8, color=GREEN, size=22).move_to([3.4, 0.4, 0])
        self.play(FadeIn(c), FadeIn(k), FadeIn(p), Create(wire(c, k)), Create(wire(k, p)), run_time=0.6)

        self.say("send {type: echo} to tool: the kernel forwards it as a call.")
        m = pill('{type: echo, text: hi}', color=CYAN, size=18).next_to(c, UP, buff=0.35)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        hop(self, m, k.get_top() + UP * 0.35, 0.6)
        call = pill('call rid 1', color=AMBER, size=18).move_to(k.get_top() + UP * 0.35)
        self.play(Transform(m, call), run_time=0.3)
        hop(self, m, p.get_top() + UP * 0.35, 0.8)

        self.say("The handler returns an answer; it travels back as result rid 1.")
        h = mono("echo(p) -> {echo: hi}", 19, GREEN).next_to(p, DOWN, buff=0.4)
        self.play(FadeIn(h), p.tinted(GREEN, 0.3), run_time=0.4)
        res = pill('result rid 1', color=GREEN, size=18).move_to(p.get_top() + UP * 0.35)
        self.play(Transform(m, res), run_time=0.3)
        hop(self, m, k.get_top() + UP * 0.35, 0.8)
        hop(self, m, c.get_top() + UP * 0.35, 0.6)
        got = mono("{echo: hi}", 19, GREEN).next_to(c, DOWN, buff=0.4)
        self.play(FadeIn(got), FadeOut(m), run_time=0.3)
        self.wait(0.4)

        self.say("A handler that raises answers {error}; the program keeps running.")
        self.play(FadeOut(h), FadeOut(got), run_time=0.3)
        r = mono("echo raised ValueError", 19, RED).next_to(p, DOWN, buff=0.4)
        self.play(FadeIn(r), p.tinted(RED, 0.25), run_time=0.4)
        err = pill('{error: echo raised ValueError}', color=RED, size=17).next_to(c, DOWN, buff=0.4).shift(RIGHT * 1.8)
        self.play(FadeIn(err), p.tinted(GREEN, 0.3), run_time=0.5)
        self.finish()


class SendEmit(FScene):
    TITLE = "send and emit from inside a handler"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        k = Node("kernel", w=1.6, h=0.8, color=CYAN, size=22).move_to([-1.0, 0.5, 0])
        p = Node("tool program", w=2.6, h=0.8, color=GREEN, size=22).move_to([-5.0, 0.5, 0])
        s = Node("store", w=1.6, h=0.8, color=BLUE, size=22).move_to([4.9, 1.4, 0])
        wch = Node("watcher", w=1.8, h=0.8, color=VIOLET, size=22).move_to([4.9, -0.7, 0])
        self.play(FadeIn(p), FadeIn(k), FadeIn(s), FadeIn(wch), Create(wire(p, k)), run_time=0.6)

        self.say("Answering call rid 2, the handler writes send to store.")
        m = pill('send store', color=CYAN, size=18).next_to(p, UP, buff=0.35)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        hop(self, m, k.get_top() + UP * 0.35, 0.8)

        self.say("The kernel sends it as tool; the call gate decides.")
        g = pill("can_call / callable_by", color=AMBER, size=17).next_to(k, DOWN, buff=0.35)
        self.play(FadeIn(g), run_time=0.3)
        self.play(Indicate(g, color=GREEN, scale_factor=1.05), run_time=0.5)
        self.play(m.animate.next_to(s, LEFT, buff=0.2), run_time=0.8, rate_func=smooth)
        self.play(s.tinted(GREEN, 0.3), FadeOut(m), run_time=0.3)
        rep = pill('reply rid 1 {data}', color=GREEN, size=18).move_to(k.get_top() + UP * 0.35 + RIGHT * 1.6)
        self.play(FadeIn(rep), run_time=0.3)
        hop(self, rep, p.get_top() + UP * 0.35, 0.9)
        self.play(FadeOut(rep), FadeOut(g), run_time=0.3)

        self.say("emit writes an event on tool's inbox; a watcher sees it.")
        e = pill('emit {type: progress}', color=VIOLET, size=18).next_to(p, UP, buff=0.35)
        self.play(FadeIn(e, shift=UP * 0.1), run_time=0.4)
        hop(self, e, k.get_top() + UP * 0.35, 0.7)
        self.play(e.animate.next_to(wch, LEFT, buff=0.2), run_time=0.8, rate_func=smooth)
        self.play(wch.tinted(VIOLET, 0.35), run_time=0.3)
        self.say("Then it finishes with result rid 2.", wait=0.2)
        self.finish()


class Stops(FScene):
    TITLE = "When the process stops"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c = Node("caller", w=1.6, h=0.8, color=BLUE, size=22).move_to([-6.0, 0.6, 0])
        k = Node("kernel", w=1.6, h=0.8, color=CYAN, size=22).move_to([-2.2, 0.6, 0])
        p = Node("tool", w=2.0, h=0.8, color=GREEN, size=22).move_to([3.4, 0.6, 0])
        self.play(FadeIn(c), FadeIn(k), FadeIn(p), Create(wire(c, k)), Create(wire(k, p)), run_time=0.6)

        self.say("Call rid 3 is in flight in the program.")
        m = pill('call rid 3', color=AMBER, size=18).next_to(k, UP, buff=0.35)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        hop(self, m, p.get_top() + UP * 0.35, 0.8)

        self.say("The program exits with code 1. Nothing respawns it.")
        self.play(p.tinted(RED, 0.3), FadeOut(m), run_time=0.4)
        ex = pill('exit 1', color=RED, size=20).next_to(p, DOWN, buff=0.35)
        self.play(FadeIn(ex), run_time=0.3)
        st = mono("status {phase: stopped}", 18, RED).next_to(k, DOWN, buff=0.35)
        self.play(FadeIn(st), k.tinted(RED, 0.2), run_time=0.4)

        self.say("The in-flight call settles transport_closed with the reason.")
        r = pill('transport_closed: its program exited (code 1)', color=RED, size=17).next_to(c, UP, buff=0.35).shift(RIGHT * 2.8)
        self.play(FadeIn(r, shift=LEFT * 0.2), run_time=0.5)
        self.wait(0.5)

        self.say("Later calls get the hint: reload_bundle restarts it.")
        self.play(FadeOut(r), FadeOut(st), run_time=0.3)
        h = VGroup(mono("transport_closed", 20, RED), mono("hint: reload_bundle", 20, AMBER)).arrange(DOWN, buff=0.12)
        h.next_to(c, DOWN, buff=0.35).shift(RIGHT * 1.2)
        self.play(FadeIn(h), run_time=0.4)
        self.finish()
