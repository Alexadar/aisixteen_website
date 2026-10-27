"""Foundations — Protocol › Ledger and dead letters. Three clips:
  ledger      call + settle rows, flush, dead letter, restart, recorded outcome, ack (facts 1, 6-8, 12, 17, 24, 28, 30)
  deadletter  which statuses are dead letters, the on_deadletter event, pruning, ack (facts 11, 12, 17, 24, 26)
  stop        graceful stop vs crash (facts 31, 33-37)

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
CLIPS = {"ledger": "K5Ledger", "deadletter": "DeadLetters", "stop": "StopAndCrash"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "ledger"


class K5Ledger(FScene):
    """Executions: call + settle rows, flush to the store, a dead letter, restart, dedup, ack."""

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
        ys = [Y + 1.1, Y + 0.6, Y + 0.1, Y - 0.4, Y - 0.9]

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
        c7 = row("call", "fetch-7", "", CYAN, 0, "ram")
        d1 = row("settle", "fetch-7", "failed", RED, 1, "ram")
        self.play(FadeIn(c7, shift=RIGHT * 0.2), run_time=0.3)
        self.play(FadeIn(d1, shift=RIGHT * 0.2), run_time=0.4)
        ev = mono("on_deadletter", 18, RED).move_to(inbox_box)
        self.play(TransformFromCopy(d1, ev), Transform(c7, row("call", "fetch-7", "", CYAN, 2, "st")),
                  Transform(d1, row("settle", "fetch-7", "failed", RED, 3, "st")), run_time=0.8)
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
        a1 = row("ack", "fetch-7", "", AMBER, 4, "st")
        self.play(FadeIn(a1, shift=LEFT * 0.2), FadeOut(ev), run_time=0.5)
        self.finish(2.4)


class DeadLetters(FScene):
    """Which endings are dead letters, the event, pruning, ack."""

    TITLE = "Dead letters"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        pan, pan_t = panel("ledger (illustrative ids)", 8.4, 3.9, -1.55, 0.0)
        self.play(FadeIn(pan), FadeIn(pan_t), run_time=0.4)
        x0 = pan.get_left()[0] + 0.3
        ys = [1.2, 0.6, 0.0, -0.6, -1.2]

        def row(i, rid, target, status, color):
            a = mono(rid, 20, AMBER)
            b = mono(target, 20, INK)
            c = mono(status, 20, color)
            for m, dx in ((a, 0.0), (b, 1.1), (c, 3.3)):
                m.move_to([x0 + dx, ys[i], 0], aligned_edge=LEFT)
                # align on the text baseline, so descenders (p, y) do not lift a row
                fs = m.font_size if hasattr(m, "font_size") else 20
                depth = mono("p", 20, INK).get_bottom()[1] - mono("a", 20, INK).get_bottom()[1]
                low = any(ch in "gjpqy" for ch in m.text) if hasattr(m, "text") else False
                m.shift(UP * (ys[i] - (m.get_bottom()[1] - (depth if low else 0.0)) - 0.08))
            return VGroup(a, b, c)

        self.say("Each call ends in a status. completed and errored are not dead letters.")
        r = [row(0, "61", "fetcher", "completed", GREEN), row(1, "62", "notes", "errored", MUTED)]
        self.play(*[FadeIn(m, shift=RIGHT * 0.2) for m in r], run_time=0.6)
        self.wait(0.4)

        self.say("failed, timed_out and cancelled are dead letters.")
        r += [row(2, "63", "fetcher", "failed", RED), row(3, "64", "parse", "timed_out", RED),
              row(4, "65", "build", "cancelled", RED)]
        self.play(*[FadeIn(m, shift=RIGHT * 0.2) for m in r[2:]], run_time=0.6)
        caller = Node("lead", w=1.6, color=BLUE, size=22).move_to([5.3, 1.0, 0])
        ev = pill("on_deadletter", RED, 19).move_to([5.3, -0.1, 0])
        self.play(FadeIn(caller), run_time=0.3)
        self.play(TransformFromCopy(r[2], ev), run_time=0.7)
        self.wait(0.5)

        self.say("Pruning keeps unacked dead letters; the rest go oldest first.")
        self.play(FadeOut(r[0], shift=LEFT * 0.2), FadeOut(r[1], shift=LEFT * 0.2), run_time=0.6)
        self.play(*[m.animate.shift(UP * 1.2) for m in r[2:]], run_time=0.5)
        self.wait(0.5)

        self.say("ack_deadletter retires one. An acked dead letter may be pruned.", color=INK)
        ack = pill("acked", AMBER, 18).move_to([x0 + 5.7, ys[2] + 1.2, 0])
        self.play(FadeIn(ack, scale=1.2), run_time=0.5)
        self.finish(2.4)


class StopAndCrash(FScene):
    """Graceful stop settles in-flight calls as cancelled; a crash leaves no settle row."""

    TITLE = "Graceful stop and crash"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        xs = [-4.45, 0.0, 4.45]

        def lane(y, labels, colors, title, title_color):
            t = mono(title, 18, title_color).move_to([-6.2, y + 0.75, 0], aligned_edge=LEFT)
            nodes = [Node(l, w=3.7, color=c, size=19).move_to([x, y, 0]) for l, c, x in zip(labels, colors, xs)]
            return t, nodes

        self.say("Graceful stop: in-flight calls are cancelled and settled.")
        t1, n1 = lane(0.95, ["kernel_stop", "call 71: cancelled", "settle row flushed"], [CYAN, RED, GREEN],
                      "graceful stop", CYAN)
        self.play(FadeIn(t1), FadeIn(n1[0]), run_time=0.4)
        a1 = Arrow(n1[0].get_right(), n1[1].get_left(), buff=0.1, color=LINE, stroke_width=3, max_tip_length_to_length_ratio=0.3)
        self.play(GrowArrow(a1), FadeIn(n1[1]), run_time=0.6)
        self.say("The final flush writes the settle rows while the store is alive.")
        a2 = Arrow(n1[1].get_right(), n1[2].get_left(), buff=0.1, color=LINE, stroke_width=3, max_tip_length_to_length_ratio=0.3)
        self.play(GrowArrow(a2), FadeIn(n1[2]), run_time=0.6)
        dl = pill("dead letter", RED, 19).next_to(n1[1], DOWN, buff=0.22)
        self.play(FadeIn(dl), run_time=0.4)
        self.wait(0.4)

        self.say("Crash: no drain, no final flush. A call in flight has no settle row.")
        t2, n2 = lane(-1.2, ["process killed", "call 72: in flight", "no settle row"], [RED, BLUE, MUTED],
                      "crash", RED)
        self.play(FadeIn(t2), FadeIn(n2[0]), run_time=0.4)
        a3 = Arrow(n2[0].get_right(), n2[1].get_left(), buff=0.1, color=LINE, stroke_width=3, max_tip_length_to_length_ratio=0.3)
        a4 = Arrow(n2[1].get_right(), n2[2].get_left(), buff=0.1, color=LINE, stroke_width=3, max_tip_length_to_length_ratio=0.3)
        self.play(GrowArrow(a3), FadeIn(n2[1]), run_time=0.6)
        self.play(GrowArrow(a4), FadeIn(n2[2]), run_time=0.6)
        self.say("It is not a dead letter. Re-sending its name runs it again.", color=INK)
        rs = pill("re-send runs it", AMBER, 19).next_to(n2[1], DOWN, buff=0.22)
        self.play(FadeIn(rs), run_time=0.4)
        self.finish(2.4)
