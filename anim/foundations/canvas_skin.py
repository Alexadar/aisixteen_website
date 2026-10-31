"""Foundations — Canvas › Skin and backgrounds. Three clips, one mechanism each.

Facts: coder/tmp/foundations/facts/canvas_skin.md (fantastic main 22f88cb8).
- three:      skin, theme and background are three agents with their own state
              (skin_agent.ts:14-19; layout.ts:13-20; background_agent.ts:7-18).
- skin:       add merges tokens over a base and must compile; use sets the slot and the
              page replaces one <style id="fantastic-skin">; native skin refused in web slot
              (skin_agent.ts:165-195; apply.ts:13-33).
- background: the backgrounds agent sends set_bg to the view's background agent, which
              refuses a source that does not compile (backgrounds_agent.ts:107-133;
              background_agent.ts:60-77); a native skin hides it (canvas.ts:1273-1277).
Ids and names are illustrative; verbs, fields and reasons are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"three": "Three", "skin": "SkinAdd", "background": "BgSet"}
OG = "three"


class Three(FScene):
    """A skin, a theme and a background: three agents, three kinds of state."""

    TITLE = "Skin, theme, background"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        specs = [
            ("skin", "how it is drawn", "design tokens + backdrop", "skins, user_skins", BLUE),
            ("canvas theme", "where cells sit", "free or column layout", "user_themes", GREEN),
            ("background", "what is behind", "one GL source", "bg_source", VIOLET),
        ]
        self.say("Three things, each on its own agent.")
        cols = []
        for i, (name, q, what, state, c) in enumerate(specs):
            x = -4.3 + i * 4.3
            box = card(3.8, 3.5, stroke=c, fill="#10131c").move_to([x, 0.0, 0])
            n = Node(name, w=3.0, color=c, size=22).move_to([x, 1.1, 0])
            t1 = txt(q, size=26, color=INK).move_to([x, 0.2, 0])
            t2 = txt(what, size=21, color=MUTED).move_to([x, -0.4, 0])
            t3 = mono(state, size=19, color=AMBER).move_to([x, -1.2, 0])
            g = VGroup(box, n, t1, t2, t3)
            cols.append(g)
            self.play(FadeIn(g, shift=UP * 0.1), run_time=0.5)
        self.say("A skin never moves a cell. A theme moves cells, not agents.", wait=0.5)
        self.play(Indicate(cols[0][1], color=BLUE, scale_factor=1.06), run_time=0.7)
        self.play(Indicate(cols[1][1], color=GREEN, scale_factor=1.06), run_time=0.7)
        self.say("The background is its own agent, one per view.", wait=0.3)
        self.play(Indicate(cols[2][1], color=VIOLET, scale_factor=1.06), run_time=0.7)
        self.finish()


class SkinAdd(FScene):
    """add a skin over dark, use it; the page swaps one stylesheet."""

    TITLE = "Add a skin, use it"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ag = Node("skin", w=1.5, color=BLUE).move_to([-4.6, 0.9, 0])
        pg = card(4.6, 2.5, stroke=LINE, fill="#10131c").move_to([3.6, 0.5, 0])
        pt = mono("<style id=\"fantastic-skin\">", size=17, color=DIM).move_to([3.6, 1.3, 0])
        var = mono("--fc-color-accent-base", size=20, color=MUTED).move_to([3.6, 0.5, 0])
        val = mono("lilac", size=22, color=VIOLET).move_to([3.6, -0.2, 0])
        self.say("A caller sends add: ocean over dark, one accent token.")
        self.play(FadeIn(ag), FadeIn(pg), FadeIn(pt), FadeIn(var), FadeIn(val), run_time=0.5)
        m1 = pill('add {"name": "ocean", "base": "dark"}', color=CYAN, size=18).move_to([-1.0, 1.8, 0])
        self.play(FadeIn(m1), run_time=0.3)
        self.play(m1.animate.move_to([-3.2, 0.9, 0]).scale(0.9), run_time=0.6)
        self.play(FadeOut(m1), run_time=0.2)
        ok = pill("merged compiles: stored in user_skins", color=GREEN, size=18).move_to([-2.2, -0.45, 0])
        self.say("The merged document must compile before it is stored.")
        self.play(FadeIn(ok), run_time=0.4)
        m2 = pill('use {"name": "ocean"}', color=CYAN, size=18).move_to([-1.0, 1.8, 0])
        self.say("use sets the slot; the page replaces one stylesheet.")
        self.play(FadeIn(m2), run_time=0.3)
        self.play(m2.animate.move_to([-3.2, 0.9, 0]).scale(0.9), run_time=0.6)
        self.play(FadeOut(m2), ok.animate.set_opacity(0.4), run_time=0.2)
        val2 = mono("sea blue", size=22, color=CYAN).move_to(val)
        self.play(ReplacementTransform(val, val2), pg.animate.set_stroke(CYAN), ag.tinted(GREEN, 0.3), run_time=0.7)
        bad = pill('use glass in web slot: bad_arg', color=RED, size=18).move_to([0.0, -1.9, 0])
        self.say("A native skin is refused for the web slot.", wait=0.2)
        self.play(FadeIn(bad, shift=UP * 0.1), run_time=0.4)
        self.finish()


class BgSet(FScene):
    """backgrounds set -> set_bg on the view's background; bad source refused."""

    TITLE = "Set a background"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        mg = Node("backgrounds", w=2.2, color=BLUE).move_to([-4.8, 0.9, 0])
        bg = Node("background", w=2.2, color=VIOLET).move_to([0.6, 0.9, 0])
        st = mono("bg_source", size=20, color=AMBER).move_to([0.6, -0.3, 0])
        view = card(3.0, 1.9, stroke=LINE, fill="#10131c").move_to([4.9, 0.7, 0])
        vt = txt("cells over GL", size=22, color=MUTED).move_to(view)
        self.say("A caller sends set Isoline to the backgrounds agent.")
        self.play(FadeIn(mg), FadeIn(bg), FadeIn(st), FadeIn(view), FadeIn(vt), run_time=0.5)
        m1 = pill('set {"name": "Isoline"}', color=CYAN, size=18).move_to([-4.8, 2.0, 0])
        self.play(FadeIn(m1), run_time=0.3)
        self.play(m1.animate.move_to([-4.8, 1.55, 0]).set_opacity(0.0), run_time=0.5)
        m2 = pill("set_bg {bytes}", color=CYAN, size=18).next_to(mg, RIGHT, buff=0.3)
        self.say("It sends set_bg with the GL source to the view's background.")
        self.play(FadeIn(m2), run_time=0.3)
        self.play(m2.animate.next_to(bg, LEFT, buff=0.2), run_time=0.8)
        self.say("The source must compile as new Function(THREE, scene, ...).")
        self.play(bg.tinted(GREEN, 0.3), view.animate.set_stroke(VIOLET), FadeOut(m2), run_time=0.5)
        ok = pill("stored", color=GREEN, size=18).next_to(st, DOWN, buff=0.25)
        self.play(FadeIn(ok), run_time=0.3)
        bad = pill("source does not compile: bad_arg", color=RED, size=18).move_to([-1.9, -1.6, 0])
        self.say("A source that does not compile is refused.", wait=0.2)
        self.play(FadeIn(bad, shift=UP * 0.1), run_time=0.4)
        nat = txt("native skin: not drawn", size=22, color=DIM).move_to([4.9, -1.3, 0])
        self.say("Under a native skin the record stays, but it is not drawn.", wait=0.3)
        self.play(FadeIn(nat), run_time=0.4)
        self.finish()
