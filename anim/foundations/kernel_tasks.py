"""Foundations — Kernel › Tasks and waiting.

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
CLIPS = {"cancel": "K3Cancel"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "cancel"


class K3Cancel(FScene):
    """cancel kills a task and its subtree: hooks first while alive, then leaves-up abort."""

    EYEBROW = "Fantastic kernel"
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
