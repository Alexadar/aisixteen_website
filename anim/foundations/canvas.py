"""Foundations — 4. Canvas: an app built on fantastic (pillar page). One clip.

From fantastic main: the canvas page is its own kernel in the browser, bridged to the host
kernel through the canvas_ws leg; it holds no memory and no AI; every cell is a view of a host
agent (README.md "The canvas", src/tui/docs/canvas.md:11-14). Terminals are exec_bridge PTY
jobs (README.md). Agent ids are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"cells": "CanvasCells"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "cells"


class CanvasCells(FScene):
    """The page kernel, the canvas_ws bridge, and cells that are views of host agents."""

    TITLE = "Every cell is a view of an agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.05
        page = card(5.4, 4.0).move_to([-3.6, Y, 0])
        page_t = mono("page kernel · browser", 18, DIM).next_to(page, UP, buff=0.14).align_to(page, LEFT).shift(RIGHT * 0.06)
        host = card(4.0, 4.0).move_to([4.3, Y, 0])
        host_t = mono("host kernel", 18, DIM).next_to(host, UP, buff=0.14).align_to(host, LEFT).shift(RIGHT * 0.06)

        self.say("The canvas page is its own kernel, in the browser.")
        self.play(FadeIn(page), FadeIn(page_t), run_time=0.6)
        self.wait(0.6)

        ws = pill("canvas_ws", color=CYAN, size=22).move_to([0.95, Y, 0])
        self.say("It is bridged to the host kernel through canvas_ws.")
        self.play(FadeIn(host), FadeIn(host_t), FadeIn(ws), run_time=0.6)
        l1 = Line(page.get_right(), ws.get_left(), color=CYAN, stroke_width=3)
        l2 = Line(ws.get_right(), host.get_left(), color=CYAN, stroke_width=3)
        self.play(Create(l1), Create(l2), run_time=0.5)
        self.wait(0.5)

        exec_ = Node("exec_bridge", w=2.9, color=GREEN).move_to([4.3, Y + 0.85, 0])
        ai = Node("ai", w=2.9, color=VIOLET).move_to([4.3, Y - 0.85, 0])
        self.play(FadeIn(exec_, shift=LEFT * 0.2), FadeIn(ai, shift=LEFT * 0.2), run_time=0.5)

        def cell(label, color, y):
            box = card(3.9, 1.3, stroke=color, fill=color, opacity=0.1).move_to([-3.6, y, 0])
            t = txt(label, 24, INK).move_to(box)
            return VGroup(box, t)

        term = cell("terminal", GREEN, Y + 0.85)
        chat = cell("AI chat", VIOLET, Y - 0.85)
        self.say("Each cell on the page is a view of a host agent.")
        for c, target, color in ((term, exec_, GREEN), (chat, ai, VIOLET)):
            self.play(FadeIn(c, scale=0.95), run_time=0.45)
            path = VMobject(stroke_color=color, stroke_width=2.4).set_points_as_corners([
                c.get_right(), [ws.get_left()[0] - 0.1, c.get_y(), 0], [ws.get_right()[0] + 0.1, target.get_y(), 0], target.get_left()])
            dash = DashedVMobject(path, num_dashes=28)
            dot = Dot(c.get_right(), radius=0.07, color=color)
            self.play(Create(dash), run_time=0.5)
            self.play(MoveAlongPath(dot, path), run_time=0.7, rate_func=smooth)
            self.play(FadeOut(dot), target.tinted(color, 0.3), run_time=0.3)

        self.say("The page holds no memory and no AI: the agents live on the host.")
        self.wait(1.2)
        self.finish()
