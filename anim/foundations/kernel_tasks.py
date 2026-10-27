"""Foundations — Kernel › Tasks and waiting.

Three clips (facts: coder/tmp/foundations/facts/kernel_tasks.md). ps: facts 1-9. cancel: facts 15-27.
await: facts 30-41. Every step drawn here is a behaviour of the fantastic kernel on main (Rust and
Python twins). Ids, agent names and task verbs are illustrative; shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, PANEL_HI, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"ps": "K3Ps", "cancel": "K3Cancel", "await": "K3Await"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "cancel"


class K3Cancel(FScene):
    """cancel kills a task and its subtree: hooks first while alive, then leaves-up abort."""

    TITLE = "cancel: a task and its subtree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        s = 22
        t41 = Node("41 lead", color=BLUE, size=s).move_to([-2.5, 1.55, 0])
        t42 = Node("42 planner", color=BLUE, size=s).move_to([-4.0, 0.25, 0])
        t45 = Node("45 notes", color=BLUE, size=s).move_to([-0.6, 0.25, 0])
        t43 = Node("43 exec_bridge", color=BLUE, size=s).move_to([-5.0, -1.05, 0])
        t44 = Node("44 model", color=BLUE, size=s).move_to([-2.3, -1.05, 0])
        e = [connector(t41, t42), connector(t41, t45), connector(t42, t43), connector(t42, t44)]
        proc = pill("child process", AMBER, 18).next_to(t43, DOWN, buff=0.2)
        gen = pill("generating", AMBER, 18).next_to(t44, DOWN, buff=0.2)
        self.say("A send made inside a handler is a child task: work forms a tree, like processes.")
        self.play(LaggedStart(FadeIn(t41), AnimationGroup(Create(e[0]), Create(e[1])), FadeIn(t42), FadeIn(t45),
                              AnimationGroup(Create(e[2]), Create(e[3])), FadeIn(t43), FadeIn(t44), lag_ratio=0.2), run_time=1.4)
        self.play(FadeIn(proc), FadeIn(gen), run_time=0.4)
        self.wait(0.7)

        X = 1.3
        cmd = VGroup(mono("operator:", 19, DIM), mono('{"type": "cancel",', 22, AMBER), mono(' "task_id": 42}', 22, AMBER))
        cmd.arrange(DOWN, aligned_edge=LEFT, buff=0.12).move_to([0, 1.3, 0]).align_to([X, 0, 0], LEFT)
        self.play(FadeIn(cmd, shift=LEFT * 0.2), run_time=0.4)
        sub = VGroup(t42, t43, t44)
        self.say("Phase 1: every on_cancel hook in the subtree runs while all its tasks are alive.")
        self.play(*[n.tinted(AMBER) for n in sub], run_time=0.4)
        k1, k2 = pill("SIGKILL", RED, 18).move_to(proc), pill("closed · done", RED, 18).move_to(gen)
        self.play(FadeTransform(proc, k1), FadeTransform(gen, k2), run_time=0.6)
        proc, gen = k1, k2
        self.wait(0.9)

        self.say("Phase 2: the tasks abort, leaves first. The sibling and the parent keep running.")
        self.play(FadeOut(t43), FadeOut(t44), FadeOut(proc), FadeOut(gen), FadeOut(e[2]), FadeOut(e[3]), run_time=0.6)
        self.play(FadeOut(t42), FadeOut(e[0]), run_time=0.5)
        self.wait(0.3)

        r1 = VGroup(mono("cancel replies", 19, DIM), mono('{"cancelled": true,', 22, GREEN),
                    mono(' "killed": [...]}', 22, GREEN)).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        r2 = VGroup(mono("lead's send to 42 settles", 19, DIM),
                    mono('status: "cancelled"', 22, AMBER)).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        res = VGroup(r1, r2).arrange(DOWN, aligned_edge=LEFT, buff=0.4).move_to([0, -1.05, 0]).align_to([X, 0, 0], LEFT)
        self.play(FadeIn(res, shift=UP * 0.1), Indicate(t45, color=GREEN, scale_factor=1.06), run_time=0.7)
        self.say("The waiting caller gets a cancelled outcome. Nothing raises.", color=INK)
        self.finish(2.4)


class K3Ps(FScene):
    """ps lists one row per in-flight dispatch; `parent` chains the rows into the send tree."""

    TITLE = "ps: the task table"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        s = 22
        t41 = Node("41 lead", color=BLUE, size=s).move_to([-3.7, 1.4, 0])
        t42 = Node("42 planner", color=BLUE, size=s).move_to([-4.7, 0.2, 0])
        t45 = Node("45 notes", color=BLUE, size=s).move_to([-2.3, 0.2, 0])
        t43 = Node("43 exec_bridge", color=BLUE, size=s).move_to([-5.5, -1.0, 0])
        t44 = Node("44 model", color=BLUE, size=s).move_to([-2.9, -1.0, 0])
        e = [connector(t41, t42), connector(t41, t45), connector(t42, t43), connector(t42, t44)]
        self.say("Every in-flight dispatch is a task. A send made inside a handler is its child.")
        self.play(LaggedStart(FadeIn(t41), AnimationGroup(Create(e[0]), Create(e[1])), FadeIn(t42), FadeIn(t45),
                              AnimationGroup(Create(e[2]), Create(e[3])), FadeIn(t43), FadeIn(t44), lag_ratio=0.2), run_time=1.4)
        self.wait(0.5)

        X = -0.9
        cmd = VGroup(mono("operator:", 18, DIM), mono('{"type": "ps"}  to kernel', 21, AMBER))
        cmd.arrange(RIGHT, buff=0.25).move_to([0, 1.55, 0]).align_to([X, 0, 0], LEFT)
        self.say("ps answers with the whole kernel-wide table, oldest row first.")
        self.play(FadeIn(cmd, shift=LEFT * 0.2), run_time=0.4)
        head = ["id", "agent", "parent", "verb"]
        rows = [
            ["41", "lead", "null", "run"],
            ["42", "planner", "41", "plan"],
            ["43", "exec_bridge", "42", "exec"],
            ["44", "model", "42", "send"],
            ["45", "notes", "41", "write"],
            ["46", "kernel", "null", "ps"],
        ]
        cols = [0.0, 0.7, 3.2, 4.6]

        def line(cells, color, size=20):
            g = VGroup(*[mono(c, size, color).move_to([0, 0, 0]) for c in cells])
            for t, x in zip(g, cols):
                t.move_to([X + x, 0, 0], aligned_edge=LEFT)
            return g

        table = VGroup(line(head, DIM, 18), *[line(r, INK) for r in rows])
        for i, g in enumerate(table):
            g.shift(UP * (0.75 - 0.43 * i))
            g.align_to([X, 0, 0], LEFT)
        table[-1].set_color(AMBER)
        self.play(FadeIn(table[0]), LaggedStart(*[FadeIn(r, shift=UP * 0.08) for r in table[1:]], lag_ratio=0.2), run_time=1.4)
        self.wait(0.5)
        self.say("The last row is ps itself: it is a dispatch too. parent links rows into the tree.")
        self.play(Indicate(table[-1], color=AMBER, scale_factor=1.04),
                  Indicate(VGroup(table[2][2], table[3][2]), color=CYAN, scale_factor=1.12), run_time=0.8)
        self.finish(2.4)


class K3Await(FScene):
    """await_set: reports from a set of agents are held; the lead wakes once."""

    TITLE = "await_set: one wake for a set"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        lead = Node("lead", w=1.5, color=BLUE, size=24).move_to([-5.6, 0.2, 0])
        ws = [Node(n, w=1.2, color=BLUE, size=22).move_to([-2.2, y, 0]) for n, y in (("w1", 1.4), ("w2", 0.2), ("w3", -1.0))]
        count = mono("kernel holds 0 of 3", 20, DIM).move_to([-3.9, -2.2, 0])
        self.say("A lead sends await_set to the kernel and keeps working.")
        self.play(FadeIn(lead), *[FadeIn(w) for w in ws], FadeIn(count), run_time=0.6)

        X = 0.8
        cmd = VGroup(mono('await_set {"ids": ["w1","w2","w3"],', 19, AMBER), mono('           "timeout_s": 60}', 19, AMBER))
        cmd.arrange(DOWN, aligned_edge=LEFT, buff=0.08).move_to([0, 1.3, 0]).align_to([X, 0, 0], LEFT)
        rep = mono('answers at once: {"wait_id": 50}', 19, GREEN).move_to([0, 0.4, 0]).align_to([X, 0, 0], LEFT)
        self.play(FadeIn(cmd, shift=LEFT * 0.2), run_time=0.4)
        self.play(FadeIn(rep, shift=UP * 0.1), run_time=0.4)
        self.wait(0.6)

        self.say("Each worker reports. The kernel holds the report; the lead is not woken.")
        self.play(FadeOut(cmd), FadeOut(rep), run_time=0.3)
        for i, w in enumerate(ws):
            m = pill('{"type": "report"}', CYAN, 18).next_to(w, LEFT, buff=0.3)
            held = pill("held", AMBER, 18).next_to(w, RIGHT, buff=0.3)
            self.play(FadeIn(m, shift=LEFT * 0.1), run_time=0.3)
            self.play(m.animate.scale(0.5).set_opacity(0).move_to(lead.get_right() + RIGHT * 1.6), FadeIn(held),
                      Transform(count, mono(f"kernel holds {i + 1} of 3", 20, DIM if i < 2 else GREEN).move_to(count)), run_time=0.7)
        self.wait(0.4)

        self.say("When all three have reported, or timeout_s passes, the lead gets one message.", wait=0.2)
        msg = VGroup(mono("one message to lead:", 18, DIM),
                     mono('{"type": "send", "wait_id": 50,', 20, GREEN),
                     mono(' "done": [{w1}, {w2}, {w3}],', 20, GREEN),
                     mono(' "missing": [], "timed_out": false}', 20, GREEN))
        msg.arrange(DOWN, aligned_edge=LEFT, buff=0.1).move_to([0, 0.2, 0]).align_to([X, 0, 0], LEFT)
        self.play(lead.tinted(GREEN), FadeIn(msg, shift=LEFT * 0.2), run_time=0.7)
        self.finish(2.4)
