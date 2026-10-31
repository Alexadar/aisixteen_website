"""Foundations — Agents › Bridge. Three clips, each one mechanism of the ws_bridge agent.

frames:   forward -> a raw call frame with a boot-nonce id, held in pending, settled by a reply frame
          or an error frame ("remote error: …")
          (R/lib.rs:36-47, 1155-1190, 1476-1510; facts 9, 10, 12, 16)
watch:    watch_remote -> a watch frame; only events whose src is on the watch list reach the inbox
          (R/lib.rs:1243-1295, 1446-1472; fact 19)
lifetime: boot -> bridge_up; the peer drops -> one bridge_down and pending forwards fail; no redial
          until reconnect, which mints a new nonce
          (R/lib.rs:876-941, 1106-1109, 1519-1532; facts 6, 12, 21, 22)
(R = src/lib/rust/crates/bundles/fantastic-bridge/src.) Ids are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"frames": "Frames", "watch": "Watch", "lifetime": "Lifetime"}
OG = "frames"

BX, LX, Y = -4.4, 4.4, 0.35          # bridge x, far leg x, node row
UP_Y, DN_Y = 1.45, -0.75             # outbound and inbound lanes


def stage(scene):
    """The two ends and the socket between them; returns (bridge, leg, wire)."""
    bridge = Node("ws_bridge", w=2.2, h=0.9, color=CYAN, size=22).move_to([BX, Y, 0])
    leg = Node("web_ws", w=1.8, h=0.9, color=BLUE, size=22).move_to([LX, Y, 0])
    wire = DashedLine(bridge.get_right(), leg.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
    k1 = mono("kernel A", 17, DIM).next_to(bridge, UP, buff=1.45)
    k2 = mono("kernel B", 17, DIM).next_to(leg, UP, buff=1.45)
    scene.play(FadeIn(bridge), FadeIn(leg), Create(wire), FadeIn(k1), FadeIn(k2), run_time=0.7)
    return bridge, leg, wire


def out(scene, label, color=CYAN, run=1.0):
    p = pill(label, color=color, size=19).move_to([BX + 1.6, UP_Y, 0])
    scene.play(FadeIn(p), run_time=0.25)
    scene.play(p.animate.move_to([LX - 1.6, UP_Y, 0]), run_time=run, rate_func=smooth)
    return p


def back(scene, label, color=GREEN, run=1.0):
    p = pill(label, color=color, size=19).move_to([LX - 1.6, DN_Y, 0])
    scene.play(FadeIn(p), run_time=0.25)
    scene.play(p.animate.move_to([BX + 1.6, DN_Y, 0]), run_time=run, rate_func=smooth)
    return p


class Frames(FScene):
    TITLE = "A forward becomes a call frame"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        bridge, leg, wire = stage(self)
        pc, pt = panel("pending", 3.6, 0.9, BX, -2.2)
        self.play(FadeIn(pc), FadeIn(pt), run_time=0.3)

        self.say("A forward takes a fresh id and waits in pending.")
        w1 = mono("br-ab12-1", 20, AMBER).move_to(pc)
        self.play(FadeIn(w1), bridge.tinted(CYAN, 0.35), run_time=0.4)

        self.say("It ships a plain call frame to the far web_ws.")
        c1 = out(self, "call br-ab12-1")
        self.play(FadeOut(c1), leg.tinted(CYAN, 0.35), run_time=0.3)

        self.say("A reply frame with the same id settles it.")
        r1 = back(self, "reply br-ab12-1")
        res = mono("data", 20, GREEN).move_to(pc)
        self.play(FadeOut(r1), ReplacementTransform(w1, res), run_time=0.4)
        self.wait(0.3)

        self.say("An error frame comes back as a remote error.")
        w2 = mono("br-ab12-2", 20, AMBER).move_to(pc)
        self.play(FadeOut(res), FadeIn(w2), run_time=0.3)
        c2 = out(self, "call br-ab12-2", run=0.8)
        self.play(FadeOut(c2), run_time=0.2)
        e2 = back(self, "error br-ab12-2", color=RED, run=0.8)
        res2 = mono("remote error: …", 20, RED).move_to(pc)
        self.play(FadeOut(e2), ReplacementTransform(w2, res2), leg.tinted(RED, 0.3), run_time=0.4)
        self.finish()


class Watch(FScene):
    TITLE = "Watching a remote agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        bridge, leg, wire = stage(self)
        wc, wt = panel("watch list", 3.6, 0.9, BX, -2.2)
        self.play(FadeIn(wc), FadeIn(wt), run_time=0.3)

        self.say("watch_remote sends a watch frame and notes the name.")
        wf = out(self, "watch src1")
        w1 = mono("src1", 20, AMBER).move_to(wc)
        self.play(FadeOut(wf), FadeIn(w1), leg.tinted(CYAN, 0.35), run_time=0.4)

        self.say("An event for src1 is re-emitted on the bridge inbox.")
        ev = back(self, "event src1", color=CYAN)
        inbox = pill("inbox: payload + src", color=GREEN, size=19).move_to([BX, 1.4, 0])
        self.play(ReplacementTransform(ev, inbox), bridge.tinted(GREEN, 0.3), run_time=0.5)
        self.wait(0.4)

        self.say("An event for a name not on the list is dropped.")
        ev2 = back(self, "event src2", color=CYAN, run=0.8)
        drop = mono("dropped", 20, RED).next_to(ev2, RIGHT, buff=0.3)
        self.play(ev2.animate.set_color(RED), FadeIn(drop), run_time=0.4)
        self.play(FadeOut(ev2), run_time=0.3)
        self.finish()


class Lifetime(FScene):
    TITLE = "A leg’s lifetime"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        bridge, leg, wire = stage(self)
        sc, st = panel("bridge events", 3.6, 0.9, BX, -2.2)
        self.play(FadeIn(sc), FadeIn(st), run_time=0.3)

        self.say("boot dials the peer and emits bridge_up.")
        up = mono("bridge_up", 20, GREEN).move_to(sc)
        self.play(FadeIn(up), bridge.tinted(GREEN, 0.3), leg.tinted(GREEN, 0.3), run_time=0.5)

        self.say("A forward, br-ab12-1, is waiting when the peer drops.")
        w1 = pill("pending br-ab12-1", color=AMBER, size=19).move_to([BX + 1.6, UP_Y, 0])
        self.play(FadeIn(w1), run_time=0.3)
        self.play(leg.tinted(RED, 0.3), wire.animate.set_color(RED), run_time=0.5)

        self.say("One bridge_down, and the forward fails.")
        down = mono("bridge_down", 20, RED).move_to(sc)
        self.play(ReplacementTransform(up, down), bridge.tinted(RED, 0.3), run_time=0.4)
        fail = pill("transport closed", color=RED, size=19).move_to(w1)
        self.play(ReplacementTransform(w1, fail), run_time=0.4)
        self.wait(0.5)

        self.say("Nothing redials itself. reconnect boots with a new nonce.")
        rc = pill("reconnect", color=CYAN, size=19).move_to([0, DN_Y, 0])
        self.play(FadeOut(fail), FadeIn(rc), run_time=0.4)
        up2 = mono("bridge_up", 20, GREEN).move_to(sc)
        new = pill("call br-cd34-1", color=GREEN, size=19).move_to([BX + 1.6, UP_Y, 0])
        self.play(ReplacementTransform(down, up2), bridge.tinted(GREEN, 0.3), leg.tinted(GREEN, 0.3),
                  wire.animate.set_color(LINE), FadeIn(new), run_time=0.6)
        self.finish()
