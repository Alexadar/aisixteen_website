"""Foundations — Protocol › Refusals. Three clips, one mechanism each.

Facts: coder/tmp/foundations/facts/refusals.md (fantastic main b175660c).
- shape:   a refused send answers {error, reason, hint, ...facts} (R/refusal.rs:8-16, 113-140; P/_refusal.py:92-107).
- branch:  the caller branches on `reason`, a closed set; each code carries its facts
           (R/refusal.rs:36-100; gate side R/send/gate.rs:129-158; not_here R/refusal.rs:275).
- recover: unknown_agent lists the live ids and flags a copied placeholder (R/refusal.rs:296-321);
           the caller resends with a real id and it completes.
Ids and agent names are illustrative; shapes, field names and codes are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"shape": "RShape", "branch": "RBranch", "recover": "RRecover"}
OG = "shape"


def field_row(key, val, kcolor, vcolor=INK, size=21):
    k = mono(key, size=size, color=kcolor)
    v = mono(val, size=size, color=vcolor)
    return k, v


class RShape(FScene):
    """One refusal shape: error for the person, reason for the machine, hint for the repair."""

    TITLE = "One shape for every refusal"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        a = Node("lead", w=1.5, color=BLUE).move_to([-5.4, 0.9, 0])
        k = Node("kernel", w=1.8, color=VIOLET).move_to([-5.4, -1.2, 0])
        self.say("lead creates an agent with an id already taken.")
        self.play(FadeIn(a), FadeIn(k), run_time=0.5)
        msg = pill('{"type": "create_agent", "id": "dup"}', color=CYAN, size=16).next_to(a, RIGHT, buff=0.3)
        self.play(FadeIn(msg), run_time=0.3)
        self.play(FadeOut(msg), run_time=0.4)

        box = card(8.0, 3.6, stroke=RED, fill="#1a1020").move_to([2.4, -0.15, 0])
        self.play(FadeIn(box), a.tinted(RED, 0.25), run_time=0.4)
        rows = [
            ("error", '"agent \'dup\' exists"', AMBER),
            ("reason", '"exists"', RED),
            ("hint", '"pick another id, or update the existing agent"', GREEN),
            ("id", '"dup"', CYAN),
        ]
        keys, vals = [], []
        for i, (kk, vv, c) in enumerate(rows):
            kt, vt = field_row(kk, vv, c)
            if kk == "hint":
                vt = mono(vv, size=15, color=INK)
            kt.move_to([0, 1.1 - i * 0.78, 0]).align_to([-1.4, 0, 0], LEFT)
            vt.move_to([0, kt.get_center()[1], 0]).align_to([0.25, 0, 0], LEFT)
            keys.append(kt)
            vals.append(vt)
        notes = ["a person reads this", "a machine branches on this", "what to do instead", "a fact about this refusal"]
        self.say("The answer has one shape, whichever verb failed.")
        for i in range(4):
            self.play(FadeIn(VGroup(keys[i], vals[i]), shift=RIGHT * 0.1), run_time=0.4)
        self.say("error is for a person, reason is for a machine.")
        self.play(Indicate(keys[1], color=RED, scale_factor=1.08), run_time=0.8)
        self.say("hint says what to do. Extra facts like id sit beside them.", wait=0.4)
        self.play(Indicate(keys[2], color=GREEN, scale_factor=1.08), run_time=0.8)
        self.finish()


class RBranch(FScene):
    """A caller branches on reason, never on the prose; each code carries its facts."""

    TITLE = "Branch on reason"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.say("reason comes from a closed list of codes.")
        rows = [
            ("unauthorized", "side", "read side: egress or ingress", RED),
            ("unknown_agent", "agents", "pick one of agents", AMBER),
            ("missing_arg", "arg", "add the argument it names", CYAN),
            ("locked", "id", "clear delete_lock, send again", VIOLET),
            ("not_here", "verb", "address the root, kernel", BLUE),
        ]
        y0 = 1.05
        head = VGroup(
            mono("reason", 17, DIM).move_to([-5.0, y0 + 0.62, 0]),
            mono("carries", 17, DIM).move_to([-1.55, y0 + 0.62, 0]),
            mono("the caller then", 17, DIM).move_to([2.55, y0 + 0.62, 0]),
        )
        self.play(FadeIn(head), run_time=0.3)
        groups = []
        for i, (code, fact, act, c) in enumerate(rows):
            y = y0 - i * 0.78
            p = pill(code, color=c, size=20).move_to([-5.0, y, 0])
            p.align_to([-6.2, 0, 0], LEFT)
            f = mono(fact, 20, MUTED).move_to([-1.55, y, 0])
            ar = Arrow([-0.6, y, 0], [0.1, y, 0], buff=0, color=LINE, stroke_width=3, max_tip_length_to_length_ratio=0.35)
            t = txt(act, size=24, color=INK).move_to([0.35, y, 0]).align_to([0.35, 0, 0], LEFT)
            g = VGroup(p, f, ar, t)
            groups.append(g)
            self.play(FadeIn(g, shift=RIGHT * 0.1), run_time=0.45)
        self.say("Each code names a kind of refusal, so verbs that fail alike share it.", wait=0.6)
        self.play(Indicate(groups[0][0], color=RED, scale_factor=1.06), run_time=0.7)
        self.finish()


class RRecover(FScene):
    """A model copies a placeholder id; the refusal lists the real ids and the next send completes."""

    TITLE = "Recover from a refusal"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        cl = Node("model", w=1.5, color=VIOLET).move_to([-5.4, 1.0, 0])
        ke = Node("kernel", w=1.8, color=BLUE).move_to([5.3, 1.0, 0])
        self.say("A model copies the id from an example and sends.")
        self.play(FadeIn(cl), FadeIn(ke), run_time=0.5)
        m1 = pill('{"type": "reflect"} to "<id>"', color=CYAN, size=19).move_to([-1.9, 1.0, 0])
        self.play(FadeIn(m1), run_time=0.3)
        self.play(m1.animate.move_to([3.0, 1.0, 0]).set_opacity(0.0), run_time=0.8, rate_func=smooth)

        box = card(10.6, 2.6, stroke=RED, fill="#1a1020").move_to([0.4, -1.0, 0])
        lines = [
            ("reason", '"unknown_agent"', RED),
            ("agents", '["fetcher", "lead", "notes"]', AMBER),
            ("hint", '"\'<id>\' is a PLACEHOLDER ... use one of agents"', GREEN),
        ]
        self.say("The kernel refuses, lists the live ids and flags the placeholder.")
        self.play(FadeIn(box), cl.tinted(RED, 0.25), run_time=0.4)
        grp = []
        for i, (kk, vv, c) in enumerate(lines):
            kt = mono(kk, 20, c)
            vt = mono(vv, 20, INK if i < 2 else MUTED)
            y = -0.35 - i * 0.62
            kt.move_to([0, y, 0]).align_to([-4.6, 0, 0], LEFT)
            vt.move_to([0, y, 0]).align_to([-3.1, 0, 0], LEFT)
            r = VGroup(kt, vt)
            grp.append(r)
            self.play(FadeIn(r, shift=RIGHT * 0.1), run_time=0.45)
        self.say("The model reads the hint and picks a real id.", wait=0.5)
        m2 = pill('{"type": "reflect"} to "fetcher"', color=CYAN, size=19).move_to([-1.9, 1.0, 0])
        self.play(FadeIn(m2), run_time=0.3)
        self.play(m2.animate.move_to([3.0, 1.0, 0]), run_time=0.8, rate_func=smooth)
        self.play(ke.tinted(GREEN, 0.3), cl.tinted(GREEN, 0.25), FadeOut(m2), FadeOut(box), *[FadeOut(r) for r in grp], run_time=0.5)
        done = card(7.0, 1.5, stroke=GREEN, fill="#10201a").move_to([0.4, -1.0, 0])
        res = VGroup(mono("status", 22, GREEN), mono('"completed"', 22, INK)).arrange(RIGHT, buff=0.4).move_to(done)
        self.say("The second send completes.", wait=0.2)
        self.play(FadeIn(done), FadeIn(res), run_time=0.4)
        self.finish()
