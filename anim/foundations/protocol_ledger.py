"""Foundations — Protocol › Ledger and dead letters.

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
CLIPS = {"ledger": "K5Ledger"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "ledger"


class K5Ledger(FScene):
    """Executions: call + settle rows, flush to the store, a dead letter, restart, dedup, ack."""

    EYEBROW = "Fantastic kernel"
    TITLE = "Every call is an execution"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.1
        ram, ram_t = panel("kernel RAM", 4.2, 3.2, -1.85, Y)
        st, st_t = panel("memory store (persistent)", 4.95, 3.2, 4.05, Y)
        caller = Node("caller", color=BLUE, size=22).move_to([-5.55, 1.1, 0])
        inbox_box = card(2.15, 0.8, stroke=LINE).move_to([-5.55, -0.25, 0])
        inbox = mono("inbox", 17, DIM).next_to(inbox_box, UP, buff=0.1)
        self.play(FadeIn(ram), FadeIn(ram_t), FadeIn(st), FadeIn(st_t), FadeIn(caller), FadeIn(inbox), FadeIn(inbox_box), run_time=0.6)
        ys = [Y + 1.05, Y + 0.45, Y - 0.15, Y - 0.75]

        def row(kind, name, status, color, i, where):
            g = VGroup(mono(kind, 20, color), mono(name, 20, INK), mono(status, 20, color)).arrange(RIGHT, buff=0.22)
            panel_ = ram if where == "ram" else st
            g.move_to([0, ys[i], 0]).align_to(panel_, LEFT).shift(RIGHT * 0.3)
            return g

        self.say('A named call ("id": "ingest-42" on the item): a call row, then a settle row.')
        r1 = row("call", "ingest-42", "", CYAN, 0, "ram")
        self.play(FadeIn(r1, shift=RIGHT * 0.2), run_time=0.4)
        r2 = row("settle", "ingest-42", "completed", GREEN, 1, "ram")
        self.play(FadeIn(r2, shift=RIGHT * 0.2), run_time=0.4)
        self.say("The rows flush into the kernel's memory store; a settled call leaves RAM.")
        self.play(Transform(r1, row("call", "ingest-42", "", CYAN, 0, "st")),
                  Transform(r2, row("settle", "ingest-42", "completed", GREEN, 1, "st")), run_time=0.8)
        self.wait(0.4)

        self.say("A call that settles failed, timed_out or cancelled is a dead letter.")
        d1 = row("settle", "fetch-7", "failed", RED, 0, "ram")
        self.play(FadeIn(d1, shift=RIGHT * 0.2), run_time=0.4)
        ev = mono("on_deadletter", 18, RED).move_to(inbox_box)
        self.play(TransformFromCopy(d1, ev), Transform(d1, row("settle", "fetch-7", "failed", RED, 2, "st")), run_time=0.8)
        self.wait(0.6)

        self.say("The process restarts. RAM starts empty; the store still holds every row.")
        badge = pill("restart", RED, 20).move_to(ram)
        self.play(FadeIn(badge, scale=1.2), ram.animate.set_stroke(RED), run_time=0.35)
        self.wait(0.5)
        self.play(FadeOut(badge), ram.animate.set_stroke(LINE), run_time=0.35)

        self.say("Re-send ingest-42: the store is read before dispatch, so the recorded outcome returns.")
        d = Dot(caller.get_right(), radius=0.1, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(r2.get_left() + LEFT * 0.2), run_time=0.8)
        self.play(Indicate(r2, color=GREEN, scale_factor=1.05), d.animate.move_to(caller.get_right()), run_time=0.6)
        back = VGroup(mono("completed", 19, GREEN), mono("handler not run", 17, DIM)).arrange(DOWN, buff=0.08)
        back.next_to(inbox_box, DOWN, buff=0.3)
        self.play(FadeOut(d), FadeIn(back), run_time=0.3)
        self.wait(0.5)

        self.say("ack_deadletter retires the dead letter. Nothing re-sends it on its own.", color=INK)
        a1 = row("ack", "fetch-7", "", AMBER, 3, "st")
        self.play(FadeIn(a1, shift=LEFT * 0.2), FadeOut(ev), run_time=0.5)
        self.finish(2.4)
