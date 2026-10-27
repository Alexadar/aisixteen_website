"""Foundations — 5. Build your own (pillar page). One clip.

From fantastic main (src/tui/docs/bundles.md): a BUNDLE is code in .fantastic/bundles/<name>/
(bundle.yaml with its verbs, agent.py, panel.html); an AGENT is a record that names it
(handler_module: <bundle name>); instances are named <name>_<n>; saving agent.py restarts every
instance at once. The bundle name py_ab12 is illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED,
    FScene, Node, card, mono, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"bundle": "BuildBundle"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "bundle"


class BuildBundle(FScene):
    """One folder bundle, two agents that are instances of it, one save restarts both."""

    EYEBROW = "Build your own"
    TITLE = "One bundle, many agents"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.0
        folder = card(5.6, 3.3).move_to([-3.4, Y, 0])
        folder_t = mono(".fantastic/bundles/py_ab12/", 18, DIM).next_to(folder, UP, buff=0.14).align_to(folder, LEFT).shift(RIGHT * 0.06)
        files = VGroup(*[mono(f, 24, INK) for f in ("bundle.yaml", "agent.py", "panel.html")]).arrange(DOWN, aligned_edge=LEFT, buff=0.42)
        files.move_to(folder).align_to(folder, LEFT).shift(RIGHT * 0.5)
        notes = VGroup(*[mono(n, 19, DIM) for n in ("its verbs", "the code", "its view")])
        for n, f in zip(notes, files):
            n.next_to(f, RIGHT, buff=0.35).align_to(folder, RIGHT).shift(LEFT * 0.35)

        self.say("A bundle is code: a folder with its verbs, its program and its view.")
        self.play(FadeIn(folder), FadeIn(folder_t), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(VGroup(f, n), shift=RIGHT * 0.15) for f, n in zip(files, notes)], lag_ratio=0.3), run_time=1.0)
        self.wait(0.6)

        agents = VGroup()
        for i, y in enumerate((Y + 0.95, Y - 0.95)):
            name = Node(f"py_ab12_{i + 1}", w=3.4, color=BLUE).move_to([4.2, y + 0.22, 0])
            rec = mono("handler_module: py_ab12", 16, MUTED).next_to(name, DOWN, buff=0.14)
            agents.add(VGroup(name, rec))
        self.say("An agent is a record that names the bundle. One bundle, many agents.")
        arrows = VGroup(*[Arrow(folder.get_right(), a[0].get_left(), buff=0.15, color=LINE, stroke_width=3,
                                max_tip_length_to_length_ratio=0.08) for a in agents])
        for a, ar in zip(agents, arrows):
            self.play(GrowArrow(ar), FadeIn(a, shift=LEFT * 0.2), run_time=0.6)
        self.wait(0.6)

        self.say("Save agent.py, and every instance restarts at once.")
        self.play(files[1].animate.set_color(AMBER), run_time=0.35)
        pulses = [a[0].box.copy().set_fill(opacity=0).set_stroke(AMBER, width=4) for a in agents]
        self.play(*[ar.animate.set_color(AMBER) for ar in arrows], run_time=0.4)
        self.play(*[a[0].tinted(AMBER, 0.28) for a in agents], *[FadeIn(p) for p in pulses], run_time=0.35)
        self.play(*[p.animate.scale(1.12).set_stroke(opacity=0) for p in pulses], run_time=0.6)
        self.play(*[a[0].tinted(GREEN, 0.2) for a in agents], *[ar.animate.set_color(LINE) for ar in arrows],
                  files[1].animate.set_color(INK), run_time=0.4)
        restarted = VGroup(*[mono("restarted", 17, GREEN).next_to(a[0], RIGHT, buff=0.2) for a in agents])
        for r, a in zip(restarted, agents):
            r.next_to(a[0], UP, buff=0.08).align_to(a[0], RIGHT)
        self.play(FadeIn(restarted), run_time=0.3)
        self.say("Each agent keeps its own record.")
        self.wait(0.8)
        self.finish()
