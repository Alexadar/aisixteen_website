"""Foundations — Canvas › User home store. Three clips, each one mechanism on fantastic main.

blueprint: persist_record refuses a record that carries identity, wiring or grants (NOT_SAVED),
           and writes a clean one to <home>/user/setups/ai_agent/<name>.yaml, answering
           {name, version, path} (bundles/fantastic-user-home-store/src/lib.rs:61-72, 248-314).
guard:     the file is 0600, written by temp + rename; the version is a hash of the bytes; a save
           with a stale if_match is refused, load_tree again and retry (lib.rs:178-246, 305-311).
apply:     prefer marks a default; spawn makes an AI agent from the named or preferred set-up and
           the creator adds the id (src/tui/src/kern/backend.rs:192-219; lib.rs:368-392).
Names, ids and versions are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"blueprint": "HsBlueprint", "guard": "HsGuard", "apply": "HsApply"}
OG = "blueprint"


def lines(rows, size=18, buff=0.13):
    return VGroup(*[mono(t, size, c) for t, c in rows]).arrange(DOWN, aligned_edge=LEFT, buff=buff)


class HsBlueprint(FScene):
    """A saved set-up carries config only; identity, wiring and grants are refused."""

    TITLE = "A blueprint, not an agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        rc, rt = panel("record to save", 5.9, 2.6, -3.75, 0.35)
        store = Node("user_home", w=2.2, h=0.8, color=GREEN, size=22).move_to([2.2, 0.35, 0])
        fc, ft = panel("<home>/user/setups/ai_agent/", 4.6, 1.1, 4.2, -2.0)
        self.play(FadeIn(rc), FadeIn(rt), FadeIn(store), FadeIn(fc), FadeIn(ft), run_time=0.6)

        self.say("A record: a handler_module plus that bundle's config.")
        base = lines([("handler_module: demo_backend.tools", INK), ("model: m-1", INK)])
        base.next_to(rc.get_corner(UL), DR, buff=0.3)
        self.play(FadeIn(base), run_time=0.5)
        extra = lines([("id: ai_1", AMBER), ("can_call: {...}", AMBER)])
        extra.next_to(base, DOWN, buff=0.13).align_to(base, LEFT)
        self.play(FadeIn(extra), run_time=0.4)

        self.say("With an id or grants on it, persist_record refuses the save.")
        m = pill("persist_record opus", color=CYAN, size=19).move_to([0.3, 1.55, 0])
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        self.play(m.animate.next_to(store, UP, buff=0.3), run_time=0.7)
        err = mono("invalid_meta · drop id, can_call", 18, RED).next_to(store, DOWN, buff=0.25).shift(LEFT * 0.5)
        self.play(m[0].animate.set_stroke(RED), m[1].animate.set_color(RED), store.tinted(RED, 0.3), FadeIn(err), run_time=0.4)
        self.wait(0.9)
        self.play(FadeOut(m), FadeOut(err), FadeOut(extra), store.tinted(GREEN, 0.16), run_time=0.4)

        self.say("Without them it passes the bundle's checks and is written.")
        m2 = pill("persist_record opus", color=CYAN, size=19).move_to([0.3, 1.55, 0])
        self.play(FadeIn(m2, shift=UP * 0.1), run_time=0.3)
        self.play(m2.animate.next_to(store, UP, buff=0.3), run_time=0.6)
        self.play(m2[0].animate.set_stroke(GREEN), m2[1].animate.set_color(GREEN), store.tinted(GREEN, 0.3), run_time=0.3)
        f = Node("opus.yaml  0600", w=3.2, h=0.6, color=GREEN, size=20).move_to(fc).shift(DOWN * 0.1)
        self.play(FadeIn(f), run_time=0.4)
        res = mono("-> {name, version, path}", 18, GREEN).next_to(store, DOWN, buff=0.25).shift(LEFT * 0.3)
        self.play(FadeIn(res), run_time=0.4)
        self.wait(0.3)
        self.finish()


class HsGuard(FScene):
    """Private files, atomic writes, and a version that refuses a lost update."""

    TITLE = "Two fantastics, one file"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        a = Node("fantastic A", w=2.4, color=BLUE, size=20).move_to([-5.4, 0.6, 0])
        b = Node("fantastic B", w=2.4, color=VIOLET, size=20).move_to([-5.4, -1.4, 0])
        fc, ft = panel("opus.yaml · 0600 · dirs 0700", 4.4, 1.6, 3.3, -0.2)
        ver = mono("version  a1b2", 24, AMBER).move_to(fc)
        self.play(FadeIn(a), FadeIn(b), FadeIn(fc), FadeIn(ft), FadeIn(ver), run_time=0.6)

        self.say("Both read opus with load_tree and get its version.")
        ra = pill("load_tree -> a1b2", color=CYAN, size=18).next_to(a, RIGHT, buff=0.3)
        rb = pill("load_tree -> a1b2", color=CYAN, size=18).next_to(b, RIGHT, buff=0.3)
        self.play(FadeIn(ra), FadeIn(rb), run_time=0.5)
        self.wait(0.4)
        self.play(FadeOut(ra), FadeOut(rb), run_time=0.3)

        self.say("B saves first: temp file, then rename. The version moves.")
        sb = pill("persist_record opus", color=CYAN, size=18).next_to(b, RIGHT, buff=0.3)
        self.play(FadeIn(sb), run_time=0.3)
        self.play(sb.animate.move_to([-1.9, -1.4, 0]), run_time=0.7)
        ver2 = mono("version  c3d4", 24, AMBER).move_to(fc)
        self.play(FadeOut(ver), FadeIn(ver2), b.tinted(GREEN, 0.3), FadeOut(sb), run_time=0.5)

        self.say("A saves with if_match a1b2. The file has changed, so it is refused.")
        sa = pill("persist_record  if_match a1b2", color=CYAN, size=18).next_to(a, RIGHT, buff=0.3)
        self.play(FadeIn(sa), run_time=0.3)
        self.play(sa.animate.move_to([-1.7, 0.6, 0]), run_time=0.7)
        err = mono("bad_arg · changed since you read it", 17, RED).next_to(fc, DOWN, buff=0.35)
        hint = mono("load_tree again, then retry", 17, MUTED).next_to(err, DOWN, buff=0.12)
        self.play(sa[0].animate.set_stroke(RED), sa[1].animate.set_color(RED), a.tinted(RED, 0.3), FadeIn(err), FadeIn(hint), run_time=0.5)
        self.wait(1.2)
        self.finish()


class HsApply(FScene):
    """The default set-up makes a new AI agent; the creator adds the rest."""

    TITLE = "From a set-up to an agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        sc, st = panel("load_tree · saved", 3.6, 2.0, -4.9, 0.35)
        rows = lines([("opus", INK), ("sonnet", INK)], size=22, buff=0.2)
        rows.move_to(sc).shift(LEFT * 0.7)
        self.play(FadeIn(sc), FadeIn(st), FadeIn(rows), run_time=0.6)

        self.say("prefer marks one as the default. Nothing is a default until then.")
        star = pill("preferred", color=AMBER, size=17).next_to(rows[0], RIGHT, buff=0.3)
        self.play(FadeIn(star, shift=LEFT * 0.1), rows[0].animate.set_color(AMBER), run_time=0.5)
        self.wait(0.4)

        self.say("spawn with no name reads the preferred set-up.")
        sp = pill("spawn", color=CYAN, size=19).move_to([-0.6, 1.5, 0])
        self.play(FadeIn(sp, shift=UP * 0.1), run_time=0.4)
        self.play(sp.animate.move_to([-0.6, 0.35, 0]), run_time=0.5)
        self.wait(0.2)

        self.say("The agent gets the record's config. Its id is made at creation.")
        ag = card(4.4, 2.2, stroke=BLUE).move_to([4.5, 0.35, 0])
        ahead = mono("ai_3f9a1c02", 22, BLUE).next_to(ag.get_top(), DOWN, buff=0.22).align_to(ag, LEFT).shift(RIGHT * 0.4)
        body = lines([("model: m-1", INK), ("+ id, memory store", AMBER), ("+ grants", AMBER)], size=18)
        body.next_to(ahead, DOWN, buff=0.18)
        body.align_to(ahead, LEFT)
        self.play(sp.animate.move_to(ag.get_left() + LEFT * 0.4), run_time=0.4)
        self.play(FadeOut(sp), FadeIn(ag), FadeIn(ahead), run_time=0.4)
        self.play(FadeIn(body), run_time=0.5)
        self.wait(0.4)
        self.finish()
