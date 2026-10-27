"""SEED (batch 4): the template, unchanged below this line. The writer replaces the example.

Foundations — Agents › Exec bridge. N clips, each one mechanism.
Say here, in one line per clip, which behaviour on fantastic main it draws and where
(path:line from your fact sheet). Ids and agent names are illustrative; verbs, shapes and
orders are not.

Rules (src/data/foundations/STYLE.md): Text only (txt / mono from common.py), never LaTeX,
Tex or MathTex; colours and fonts only from common.py; 6–20 s; at most ~5 labels on screen at
once; one narration line at a time (self.say); end with self.finish() (hold, then the fade).
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

# Clips of this article: clip name -> scene class. The clip name is the file name
# (media/fantastic/foundations/<path>/<clip>.mp4) and the key in the article's `clips`.
CLIPS = {"example": "Example"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "example"


class Example(FScene):
    """One mechanism, drawn in a few steps."""

    # No EYEBROW: header() writes it for you from this file's key, always "<Pillar> · <Article>"
    # (common.eyebrow / eyebrow_for), e.g. "Protocol · Call gate". Setting EYEBROW is an error.
    TITLE = "A short title"         # the clip's title, as in the article's clips.<name>.title

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        a = Node("a", w=1.4, color=BLUE).move_to([-3.5, 0.3, 0])
        b = Node("b", w=1.4, color=GREEN).move_to([3.5, 0.3, 0])
        self.say("Agent a sends reflect to b.")
        self.play(FadeIn(a), FadeIn(b), run_time=0.5)

        msg = pill('{"type": "reflect"}', color=CYAN).next_to(a, UP, buff=0.3)
        self.play(FadeIn(msg, shift=UP * 0.1), run_time=0.4)
        self.play(msg.animate.next_to(b, UP, buff=0.3), run_time=0.9, rate_func=smooth)
        self.play(b.tinted(GREEN, 0.3), run_time=0.3)

        self.say("b answers with what it is.", wait=0.8)
        self.finish()  # the held final state is the poster, then a fade so the loop is seamless
