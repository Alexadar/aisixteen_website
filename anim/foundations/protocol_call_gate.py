"""Foundations — Protocol › Call gate and grants.

Moved from the first draft's kernel.py (the #443 split). Every step drawn here is a behaviour
of the fantastic kernel on main (Rust and Python twins). Ids and agent names are illustrative;
shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, PANEL_HI, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"gate": "K2Gate"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "gate"


class K2Gate(FScene):
    """Two keys, one door: egress (sender's can_call) and ingress (target's callable_by)."""

    EYEBROW = "Fantastic kernel"
    TITLE = "The call gate: both ends must grant"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.55
        a = Node("a", w=1.4, h=1.0, color=BLUE, size=34).move_to([-5.5, Y, 0])
        b = Node("b", w=1.4, h=1.0, color=VIOLET, size=34).move_to([5.5, Y, 0])
        eg_x, in_x = -2.3, 2.3
        wire = DashedLine(a.get_right(), b.get_left(), color=LINE, dash_length=0.14, stroke_width=3)

        def gate(x, label):
            post_t = Line([x, Y + 0.75, 0], [x, Y + 0.25, 0], color=DIM, stroke_width=7)
            post_b = Line([x, Y - 0.25, 0], [x, Y - 0.75, 0], color=DIM, stroke_width=7)
            lab = mono(label, 20, DIM).move_to([x, Y + 1.1, 0])
            return VGroup(post_t, post_b, lab)

        g1, g2 = gate(eg_x, "egress"), gate(in_x, "ingress")
        L, R = -6.55, 6.55

        def grant_a(s, color):
            return mono(f"a.can_call    {s}", 21, color).move_to([0, -0.85, 0]).align_to([L, 0, 0], LEFT)

        def grant_b(s, color):
            return mono(f"b.callable_by {s}", 21, color).move_to([0, -1.45, 0]).align_to([R, 0, 0], RIGHT)

        can = grant_a('{"$self": "*"}', MUTED)
        cby = grant_b('{"$self": "*"}', MUTED)
        msg_y = -2.35
        self.say("Agent a sends reflect to b. Every agent send passes two checks.")
        self.play(FadeIn(a), FadeIn(b), Create(wire), FadeIn(g1), FadeIn(g2), FadeIn(can), FadeIn(cby), run_time=0.9)
        self.wait(0.5)

        def shoot(stop_x):
            d = Dot(a.get_right(), radius=0.12, color=CYAN)
            self.add(d)
            self.play(d.animate.move_to([stop_x, Y, 0]), run_time=0.7, rate_func=smooth)
            return d

        # 1: nothing granted on a's side -> refused at egress
        self.say("Egress: the sender's can_call must name (b, reflect). It does not.")
        d = shoot(eg_x - 0.3)
        err = mono('side: "egress" · a may not call \'reflect\' on b', 21, RED).move_to([0, msg_y, 0])
        self.play(d.animate.set_color(RED), g1.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.1)
        self.play(FadeOut(d), FadeOut(err), g1.animate.set_color(DIM), run_time=0.3)

        # 2: a grants, b does not -> refused at ingress
        self.play(FadeTransform(can, grant_a('{"$self": "*", "b": ["reflect"]}', GREEN)), run_time=0.5)
        self.say("Now a may call it. Ingress: b's callable_by must name (a, reflect).")
        d = shoot(in_x - 0.3)
        self.play(g1.animate.set_color(GREEN), run_time=0.01)
        err = mono('side: "ingress" · b does not accept \'reflect\' from a', 21, RED).move_to([0, msg_y, 0])
        self.play(d.animate.set_color(RED), g2.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.1)
        self.play(FadeOut(d), FadeOut(err), g2.animate.set_color(DIM), run_time=0.3)

        # 3: both grant -> the call passes; the edge is one-way
        self.play(FadeTransform(cby, grant_b('{"$self": "*", "a": ["reflect"]}', GREEN)), run_time=0.5)
        self.say("Both ends grant: the call passes. One edge, one way, one verb.", color=INK)
        d = Dot(a.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(b.get_left()), g2.animate.set_color(GREEN), run_time=1.0, rate_func=smooth)
        self.play(FadeOut(d), b.tinted(GREEN), run_time=0.3)
        ok = mono('status: "completed"', 21, GREEN).move_to([0, msg_y, 0])
        self.play(FadeIn(ok), run_time=0.3)
        self.wait(1.2)

        # operator sends skip the gate
        op = Node("operator · CLI", h=0.66, color=AMBER, size=21).move_to([3.4, 2.35, 0])
        self.say("Operator sends (the CLI, a test driver) are the root of trust and skip the gate.")
        self.play(FadeIn(op), FadeOut(ok), run_time=0.4)
        d = Dot(op.get_right(), radius=0.12, color=AMBER)
        self.add(d)
        self.play(d.animate.move_to(b.get_top()), run_time=0.6)
        self.play(FadeOut(d), Indicate(b, color=AMBER, scale_factor=1.06), run_time=0.4)
        self.finish(2.0)
