"""Foundations — Kernel › Lifecycle.

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
CLIPS = {"delete": "K4Delete"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "delete"


class K4Delete(FScene):
    """delete_agent cascades deepest-first; delete_lock refuses; grants naming the dead are pruned."""

    EYEBROW = "Fantastic kernel"
    TITLE = "delete_agent: the whole subtree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        s = 22
        root = Node("kernel_state", color=BRAND, size=s).move_to([-3.3, 1.6, 0])
        team = Node("team", color=BLUE, size=s).move_to([-4.9, 0.35, 0])
        x = Node("x", w=1.0, color=BLUE, size=s).move_to([-1.5, 0.35, 0])
        wr = Node("writer", color=BLUE, size=s).move_to([-6.0, -0.95, 0])
        rv = Node("reviewer", color=BLUE, size=s).move_to([-3.75, -0.95, 0])
        e = [connector(root, team), connector(root, x), connector(team, wr), connector(team, rv)]
        lock = pill("delete_lock", AMBER, 17).next_to(rv, DOWN, buff=0.18)
        grants = VGroup(mono("x.can_call", 19, DIM), mono('{"$self": "*", "writer": ["reflect"]}', 20, MUTED))
        grants.arrange(DOWN, aligned_edge=LEFT, buff=0.1).move_to([0, -2.2, 0]).align_to([-6.55, 0, 0], LEFT)
        self.say("A tree of agents. reviewer carries delete_lock; x may call writer.")
        self.play(FadeIn(root), *[Create(l) for l in e[:2]], FadeIn(team), FadeIn(x), run_time=0.6)
        self.play(*[Create(l) for l in e[2:]], FadeIn(wr), FadeIn(rv), FadeIn(lock), FadeIn(grants), run_time=0.6)
        self.wait(0.6)

        # a console on the right: each operator call, then its reply
        X, top = 0.4, 1.9
        log = VGroup()

        def put(*lines):
            g = VGroup(*lines).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
            if len(log):
                g.next_to(log, DOWN, buff=0.22, aligned_edge=LEFT)
            else:
                g.move_to([0, top, 0]).align_to([X, 0, 0], LEFT).shift(DOWN * g.height / 2)
            g.align_to([X, 0, 0], LEFT)
            log.add(g)
            self.play(FadeIn(g, shift=UP * 0.1), run_time=0.4)
            return g

        put(mono('delete_agent {"id": "team"}', 21, AMBER))
        self.say("Any lock in the subtree refuses the whole delete, and names the blocker.")
        put(mono('reason: "locked"', 20, RED), mono('blocked_by: "reviewer"', 20, RED))
        self.play(Indicate(lock, color=RED), run_time=0.6)
        self.wait(0.7)
        put(mono('update_agent {"id": "reviewer",', 21, AMBER), mono('  "delete_lock": false}', 21, AMBER))
        self.play(FadeOut(lock, shift=DOWN * 0.2), run_time=0.4)
        put(mono('delete_agent {"id": "team"}', 21, AMBER))

        self.say("Deepest first: each agent runs its on_delete hook, then leaves the tree.")
        for n, edge in ((wr, e[2]), (rv, e[3])):
            hook = pill("on_delete", AMBER, 17).next_to(n, DOWN, buff=0.18)
            self.play(FadeIn(hook), n.tinted(AMBER), run_time=0.3)
            self.play(FadeOut(n), FadeOut(hook), FadeOut(edge), run_time=0.35)
        hook = pill("on_delete", AMBER, 17).next_to(team, DOWN, buff=0.18)
        self.play(FadeIn(hook), team.tinted(AMBER), run_time=0.3)
        self.play(FadeOut(team), FadeOut(hook), FadeOut(e[0]), run_time=0.35)
        put(mono('{"deleted": true, "id": "team"}', 20, GREEN))

        self.say("Then every deleted id is pruned from other agents' grants.", color=INK)
        g2 = mono('{"$self": "*"}', 20, GREEN).move_to(grants[1]).align_to(grants[1], LEFT)
        self.play(FadeTransform(grants[1], g2), run_time=0.7)
        self.finish(2.4)
