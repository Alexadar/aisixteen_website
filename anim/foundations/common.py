"""Shared look for the Foundations animations: the site's colours and type.

Colours come from src/site/site.css (:root). Text is Space Grotesk (titles), Inter (prose)
and JetBrains Mono (code), registered from anim/.fonts (fetched by anim/render.sh, not
committed). No LaTeX: every label is a Text.
"""
from pathlib import Path

import manimpango
from manim import (
    BOLD, DOWN, LEFT, NORMAL, RIGHT, UP, UL, ORIGIN,
    Arrow, Circle, Create, DashedLine, Dot, FadeIn, FadeOut, Line, Rectangle,
    RoundedRectangle, Scene, Text, VGroup, config, linear, smooth, rate_functions,
)

FONTS = Path(__file__).resolve().parent.parent / ".fonts"
for _f in sorted(FONTS.glob("*.ttf")):
    manimpango.register_font(str(_f))

# site.css tokens
BG = "#0b1020"
PANEL = "#121a31"
PANEL_HI = "#18223f"
INK = "#e6e9f2"
MUTED = "#aab2c8"
DIM = "#8891a8"
FAINT = "#4d5672"
LINE = "#2b3555"
BRAND = "#7c5cff"
CYAN = "#55d3ff"
BLUE = "#3d82d8"
GREEN = "#4fc27a"
VIOLET = "#b48cff"
AMBER = "#f2c94c"
RED = "#ff6b81"

DISPLAY = "Space Grotesk"
BODY = "Inter"
MONO = "JetBrains Mono"

config.background_color = BG
config.frame_rate = 30


def txt(s, size=26, color=INK, weight=NORMAL, font=BODY):
    return Text(s, font=font, font_size=size, color=color, weight=weight)


def mono(s, size=22, color=INK, weight=NORMAL):
    return Text(s, font=MONO, font_size=size, color=color, weight=weight)


def card(w, h, stroke=LINE, fill=PANEL, r=0.16, sw=2, opacity=1.0):
    return RoundedRectangle(corner_radius=r, width=w, height=h, stroke_color=stroke,
                            stroke_width=sw, fill_color=fill, fill_opacity=opacity)


class Node(VGroup):
    """A rounded box with a centred mono label: an agent, a task, a row."""

    def __init__(self, label, w=None, h=0.62, color=BLUE, size=22, fill_alpha=0.16, text_color=INK, font=MONO):
        self.label = Text(label, font=font, font_size=size, color=text_color)
        width = w if w is not None else self.label.width + 0.5
        self.box = RoundedRectangle(corner_radius=0.12, width=width, height=h, stroke_color=color,
                                    stroke_width=2.4, fill_color=color, fill_opacity=fill_alpha)
        self.label.move_to(self.box)
        super().__init__(self.box, self.label)
        self.color_ = color

    def tinted(self, color, alpha=0.22):
        """An animation target: the same node in another colour."""
        return self.box.animate.set_stroke(color).set_fill(color, opacity=alpha)


def pill(s, color=GREEN, size=20):
    t = mono(s, size=size, color=color)
    b = RoundedRectangle(corner_radius=0.17, width=t.width + 0.36, height=t.height + 0.24,
                         stroke_color=color, stroke_width=1.6, fill_color=color, fill_opacity=0.12)
    t.move_to(b)
    return VGroup(b, t)


def connector(a, b, color=LINE, sw=2.2):
    """An elbow-free tree edge from the bottom of a to the top of b."""
    return Line(a.get_bottom(), b.get_top(), color=color, stroke_width=sw)


class FScene(Scene):
    """A Foundations clip: eyebrow + title top left, one narration line at the bottom."""

    EYEBROW = ""
    TITLE = ""

    def header(self):
        eb = mono(self.EYEBROW.upper(), size=19, color="#8dbbff")
        dot = Dot(radius=0.045, color=CYAN).next_to(eb, LEFT, buff=0.16)
        ti = txt(self.TITLE, size=38, weight=BOLD, font=DISPLAY)
        g = VGroup(VGroup(dot, eb), ti).arrange(DOWN, aligned_edge=LEFT, buff=0.16)
        g.to_corner(UL, buff=0.5)
        self.add(g)
        self._note = None
        return g

    def say(self, s, wait=0.0, color=MUTED):
        """Swap the narration line (bottom centre)."""
        new = txt(s, size=28, color=color)
        if new.width > 13.2:
            new.scale_to_fit_width(13.2)
        new.move_to([0, -3.42, 0])
        if self._note is None:
            self.play(FadeIn(new, shift=UP * 0.12), run_time=0.45)
        else:
            self.play(FadeOut(self._note, shift=UP * 0.12), FadeIn(new, shift=UP * 0.12), run_time=0.45)
        self._note = new
        if wait:
            self.wait(wait)

    def finish(self, hold=2.2):
        """Hold the final state (the poster frame), then fade to the background so the loop is seamless."""
        self.wait(hold)
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.6)
        self.wait(0.25)
