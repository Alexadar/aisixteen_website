"""Foundations — Build your own › A view. Three clips on fantastic main (22f88cb8).

starter: view record -> panel sends count as its cell -> agent emits {type: count} -> watch redraws
         (src/tui/starters/python_agent/{bundle.yaml:9, agent.py:36-43, panel.html}; connector.ts:40-57;
         host_views.ts:108-115; html_view.ts:121-124).
edit:    save panel.html -> instances' view written again, no restart; save agent.py -> reload_bundle,
         instances restart (src/tui/src/kern/bundle_watch.rs:1-10, docs/bundles.md:28-33).
tui:     the TUI keys on handler_module; an unknown module gets the generic panel and a callable verb list
         (src/tui/src/panel/mod.rs:1-12,78-95; generic.rs:1-40).
Ids are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"starter": "ViewStarter", "edit": "ViewEdit", "tui": "ViewTui"}
OG = "starter"


class ViewStarter(FScene):
    """Click, verb, event, redraw."""

    TITLE = "A view: click, verb, event, redraw"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        agent = Node("py_ab12_1", w=2.8, h=0.8, color=BLUE, size=26).move_to([4.2, 0.6, 0])
        rec = mono("view: {kind: html, bytes_file: panel.html,", 18, MUTED)
        rec2 = mono("        calls: [hello, count, watch]}", 18, MUTED)
        recg = VGroup(rec, rec2).arrange(DOWN, aligned_edge=LEFT, buff=0.08).next_to(agent, DOWN, buff=0.4)
        recg.align_to([6.4, 0, 0], RIGHT)

        cellbox = card(5.2, 2.8, stroke=CYAN, fill="#121a31").move_to([-3.2, 0.2, 0])
        lab = mono("cell · panel.html", 18, DIM).next_to(cellbox, UP, buff=0.12).align_to(cellbox, LEFT)
        btn = Node("count", w=1.5, h=0.6, color=CYAN, size=22).move_to([-4.3, 0.75, 0])
        out = mono("count = 0", 28, INK).move_to([-2.5, -0.55, 0])

        self.say("The agent's record carries the view; the bundle wrote it.")
        self.play(FadeIn(agent), FadeIn(recg), run_time=0.6)
        self.play(FadeIn(cellbox), FadeIn(lab), FadeIn(btn), FadeIn(out), run_time=0.6)

        self.say("A click sends count, as the cell, through the call gate.")
        m = pill('{"type": "count"}', color=CYAN, size=18).next_to(btn, RIGHT, buff=0.3).shift(DOWN*0.15)
        self.play(FadeIn(m, shift=UP * 0.1), btn.tinted(CYAN, 0.35), run_time=0.4)
        self.play(m.animate.move_to([1.0, 1.6, 0]), run_time=0.8, rate_func=smooth)
        self.play(m.animate.next_to(agent, UP, buff=0.3), agent.tinted(GREEN, 0.3), run_time=0.7)

        self.say("count adds one and emits an event; watch redraws.")
        ev = pill('{"type": "count", "count": 1}', color=AMBER, size=18).next_to(agent, UP, buff=0.3)
        self.play(FadeOut(m), FadeIn(ev), run_time=0.3)
        self.play(ev.animate.move_to([-0.2, -1.6, 0]), run_time=0.9, rate_func=smooth)
        new = mono("count = 1", 28, GREEN).move_to(out)
        self.play(FadeOut(ev), Transform(out, new), run_time=0.4)
        self.finish()


class ViewEdit(FScene):
    """panel.html: redraw. agent.py: restart."""

    TITLE = "Edit a bundle while it runs"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        b = Node("bundle py_ab12", w=3.2, h=0.7, color=VIOLET, size=22).move_to([-4.0, 1.3, 0])
        i1 = Node("py_ab12_1", w=2.3, h=0.7, color=BLUE, size=22).move_to([1.2, 1.3, 0])
        i2 = Node("py_ab12_2", w=2.3, h=0.7, color=BLUE, size=22).move_to([1.2, -0.1, 0])
        self.say("Two instances share one bundle folder.")
        self.play(FadeIn(b), FadeIn(i1), FadeIn(i2), run_time=0.6)

        self.say("Save panel.html: each instance's view is written again.")
        f1 = pill("panel.html saved", color=CYAN, size=19).move_to([-4.0, -0.1, 0])
        self.play(FadeIn(f1, shift=UP * 0.1), run_time=0.4)
        r1 = pill("cell redraws", color=GREEN, size=19).next_to(i1, RIGHT, buff=0.35)
        r2 = pill("cell redraws", color=GREEN, size=19).next_to(i2, RIGHT, buff=0.35)
        self.play(i1.tinted(GREEN, 0.3), i2.tinted(GREEN, 0.3), FadeIn(r1), FadeIn(r2), run_time=0.5)
        n1 = mono("no restart", 20, GREEN).move_to([1.2, -0.9, 0])
        self.play(FadeIn(n1), run_time=0.3)
        self.wait(0.6)

        self.say("Save agent.py: reload_bundle restarts every instance.")
        self.play(FadeOut(f1), FadeOut(r1), FadeOut(r2), FadeOut(n1),
                  i1.tinted(BLUE, 0.16), i2.tinted(BLUE, 0.16), run_time=0.4)
        f2 = pill("agent.py saved", color=CYAN, size=19).move_to([-4.0, -0.1, 0])
        self.play(FadeIn(f2, shift=UP * 0.1), run_time=0.4)
        rl = mono("reload_bundle", 20, AMBER).move_to([-1.2, -1.5, 0])
        self.play(FadeIn(rl), i1.tinted(AMBER, 0.3), i2.tinted(AMBER, 0.3), run_time=0.5)
        s = pill("stopped, started again", color=AMBER, size=19).move_to([3.2, -1.5, 0])
        self.play(FadeIn(s), run_time=0.4)
        self.finish()


class ViewTui(FScene):
    """An unknown module gets the generic panel."""

    TITLE = "The TUI shows the generic panel"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        tree = card(3.6, 2.4, stroke=LINE).move_to([-4.2, 0.1, 0])
        tl = mono("tree", 17, DIM).next_to(tree, UP, buff=0.12).align_to(tree, LEFT)
        a = Node("py_ab12_1", w=2.8, h=0.6, color=BLUE, size=20).move_to([-4.2, 0.7, 0])
        o = Node("term", w=2.8, h=0.6, color=DIM, size=20).move_to([-4.2, -0.2, 0])
        self.say("The shell reads each agent's handler_module.")
        self.play(FadeIn(tree), FadeIn(tl), FadeIn(a), FadeIn(o), run_time=0.6)

        self.say("py_ab12 is a module the shell has no panel for.")
        self.play(a.tinted(AMBER, 0.3), run_time=0.4)

        pane = card(6.6, 3.6, stroke=AMBER).move_to([2.3, 0.1, 0])
        pl = mono("generic panel", 17, DIM).next_to(pane, UP, buff=0.12).align_to(pane, LEFT)
        l1 = txt("A starter python agent", 22, INK)
        l2 = mono("can_call / callable_by", 18, MUTED)
        l3 = mono("verbs: hello, count", 20, CYAN)
        g = VGroup(l1, l2, l3).arrange(DOWN, aligned_edge=LEFT, buff=0.22).move_to(pane).align_to(pane, UP).shift(DOWN * 0.3 + RIGHT * 0.0)
        g.align_to(pane, LEFT).shift(RIGHT * 0.35)
        self.say("It shows the sentence, the grants and the verbs.")
        self.play(FadeIn(pane), FadeIn(pl), FadeIn(g), run_time=0.6)

        self.say("You call a verb; the answer shows verbatim.")
        c = mono("> count", 22, CYAN).next_to(g, DOWN, buff=0.35).align_to(g, LEFT)
        ans = mono('{"count": 1}', 22, GREEN).next_to(c, DOWN, buff=0.15).align_to(g, LEFT)
        self.play(FadeIn(c), run_time=0.3)
        self.play(FadeIn(ans, shift=UP * 0.1), run_time=0.4)
        self.finish()
