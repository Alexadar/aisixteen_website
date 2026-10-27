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
CLIPS = {"gate": "K2Gate", "verbs": "CallGateVerbs", "spawn": "CallGateSpawn"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "gate"


class K2Gate(FScene):
    """Two keys, one door: egress (sender's can_call) and ingress (target's callable_by)."""

    EYEBROW = "Protocol · Call gate"
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
        L, R = -6.4, 6.4

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


class CallGateVerbs(FScene):
    """A grant names verbs, and each end keeps its own list.
    can_call / callable_by matching: R/authz.rs:119-129, 137-168; P/_authz.py:98-104, 120-160."""

    EYEBROW = "Protocol · Call gate"
    TITLE = "Grants are per verb, on both ends"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.9
        a = Node("a", w=1.4, h=1.0, color=BLUE, size=34).move_to([-5.5, Y, 0])
        b = Node("b", w=1.4, h=1.0, color=VIOLET, size=34).move_to([5.5, Y, 0])
        wire = DashedLine(a.get_right(), b.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        L, R = -6.4, 6.4

        def grant_a(s, color):
            return mono(f"a.can_call    {s}", 21, color).move_to([0, -0.7, 0]).align_to([L, 0, 0], LEFT)

        def grant_b(s, color):
            return mono(f"b.callable_by {s}", 21, color).move_to([0, -1.3, 0]).align_to([R, 0, 0], RIGHT)

        can = grant_a('{"$self": "*", "b": ["reflect"]}', GREEN)
        cby = grant_b('{"$self": "*", "a": ["reflect"]}', GREEN)
        out_y = -2.3
        self.say("Both ends name b and a, for the verb reflect only.")
        self.play(FadeIn(a), FadeIn(b), Create(wire), FadeIn(can), FadeIn(cby), run_time=0.9)
        self.wait(0.4)

        def send(verb, stop_x=None, color=CYAN):
            lab = pill(verb, color=color, size=20).move_to([0, Y + 0.8, 0])
            d = Dot(a.get_right(), radius=0.12, color=color)
            self.add(d)
            self.play(FadeIn(lab), run_time=0.25)
            end = b.get_left() if stop_x is None else [stop_x, Y, 0]
            self.play(d.animate.move_to(end), run_time=0.8, rate_func=smooth)
            return d, lab

        d, lab = send("reflect")
        ok = mono('reflect: completed', 21, GREEN).move_to([0, out_y, 0])
        self.play(FadeOut(d), b.tinted(GREEN), FadeIn(ok), run_time=0.4)
        self.wait(0.8)
        self.play(FadeOut(lab), FadeOut(ok), run_time=0.3)

        self.say("A different verb is not in a's list: refused at egress.")
        d, lab = send("ps", stop_x=-2.3)
        err = mono('side: "egress" · a may not call \'ps\' on b', 21, RED).move_to([0, out_y, 0])
        self.play(d.animate.set_color(RED), lab.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.0)
        self.play(FadeOut(d), FadeOut(lab), FadeOut(err), run_time=0.3)

        self.play(FadeTransform(can, grant_a('{"$self": "*", "b": "*"}', GREEN)), run_time=0.5)
        self.say("a now holds every verb on b. b still lists only reflect: ingress refuses.")
        d, lab = send("ps", stop_x=2.3)
        err = mono('side: "ingress" · b does not accept \'ps\' from a', 21, RED).move_to([0, out_y, 0])
        self.play(d.animate.set_color(RED), lab.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.0)
        self.play(FadeOut(d), FadeOut(lab), FadeOut(err), run_time=0.3)

        self.play(FadeTransform(cby, grant_b('{"$self": "*", "a": "*"}', GREEN)), run_time=0.5)
        self.say("Both ends hold \"*\": every verb passes.", color=INK)
        d, lab = send("ps")
        ok = mono('ps: completed', 21, GREEN).move_to([0, out_y, 0])
        self.play(FadeOut(d), b.tinted(GREEN), FadeIn(ok), run_time=0.4)
        self.finish(2.0)


class CallGateSpawn(FScene):
    """A spawn cannot hand out more than the spawner holds; the card's grants land on both ends.
    escalation: AR/lib.rs:716-757, PAR/tools.py:435-462; edges and undo: AR/lib.rs:766-815, PAR/tools.py:465-516."""

    EYEBROW = "Protocol · Call gate"
    TITLE = "Spawn grants stay within the spawner"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 1.0
        lead = Node("lead", w=1.5, h=0.9, color=BLUE, size=28).move_to([-5.3, Y, 0])
        files = Node("files", w=1.5, h=0.9, color=AMBER, size=28).move_to([5.3, Y, 0])
        held = mono('lead.can_call  {"$self": "*", "files": ["read"]}', 21, MUTED).move_to([0, -0.55, 0])
        held.align_to([-6.4, 0, 0], LEFT)
        self.say("lead holds only read on files. It spawns a worker from a card.")
        self.play(FadeIn(lead), FadeIn(files), FadeIn(held), run_time=0.7)
        self.wait(0.4)

        card1 = mono('card.grants  files: ["read", "write"]', 21, CYAN).move_to([0, -1.25, 0])
        card1.align_to([-6.4, 0, 0], LEFT)
        self.play(FadeIn(card1), run_time=0.4)
        self.say("write is not in lead's can_call: refused, and nothing is created.")
        err = mono("not_allowed · lead may not grant 'write' on 'files'", 21, RED).move_to([0, -2.2, 0])
        self.play(FadeIn(err), card1.animate.set_color(RED), run_time=0.5)
        self.wait(1.6)

        card2 = mono('card.grants  files: ["read"]', 21, CYAN).move_to([0, -1.25, 0])
        card2.align_to([-6.4, 0, 0], LEFT)
        self.play(FadeOut(err), FadeTransform(card1, card2), run_time=0.5)
        self.say("Within what lead holds: the worker is created as lead's child.")
        worker = Node("worker", w=1.5, h=0.9, color=GREEN, size=26).move_to([0, Y, 0])
        link = Line(lead.get_right(), worker.get_left(), color=BLUE, stroke_width=3)
        self.play(FadeIn(worker, shift=UP * 0.1), Create(link), run_time=0.6)

        self.say("Both ends of the edge are written, or the whole spawn is undone.")
        e1 = mono('worker.can_call    files: ["read"]', 21, GREEN).move_to([0, -2.0, 0])
        e1.align_to([-6.4, 0, 0], LEFT)
        e2 = mono('files.callable_by  worker: ["read"]', 21, GREEN).move_to([0, -2.6, 0])
        e2.align_to([-6.4, 0, 0], LEFT)
        edge = DashedLine(worker.get_right(), files.get_left(), color=GREEN, dash_length=0.14, stroke_width=3)
        self.play(FadeIn(e1), run_time=0.4)
        self.play(FadeIn(e2), Create(edge), run_time=0.6)
        self.finish(2.2)
