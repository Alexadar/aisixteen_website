"""Foundations — Build your own › Example: Team. Three clips, one mechanism each.

Ids and values are illustrative; verbs, shapes and orders are not.
- cards: a card's tier must be a template of team.yaml, else the team refuses to start
  (fantastic_team crates/team/src/tree.rs:154-194; roles.rs:21-40; examples/team.yaml:5-57).
- plan: project_lead proposes, waits (over 5 agents), spawns, records each issue in tasks with a
  holder or a subtree, waits with await_set (roles/project_lead.md:29-36; tree.rs:513-517).
- digest: the cadencer rolls the spawned tree up, one line per branch, STALLED when a task holder
  is idle past stall_after (cadencer.rs:176-224, 156-196; board.rs:363-367).
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

CLIPS = {"cards": "TierCards", "plan": "PlanTree", "digest": "Digest"}
OG = "plan"


class TierCards(FScene):
    TITLE = "Cards name a tier, team.yaml defines it"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        box, ttl = panel("team.yaml: templates", 3.6, 2.7, -4.6, 0.2)
        strong = Node("strong", w=2.4, color=VIOLET).move_to([-4.6, 0.85, 0])
        small = Node("small", w=2.4, color=VIOLET).move_to([-4.6, -0.45, 0])
        self.say("team.yaml defines the tiers as templates.")
        self.play(FadeIn(box), FadeIn(ttl), FadeIn(strong), FadeIn(small), run_time=0.6)

        pl = Node("project_lead", w=3.0, color=BLUE).move_to([3.4, 1.2, 0])
        wk = Node("worker", w=3.0, color=BLUE).move_to([3.4, -0.1, 0])
        t1 = mono("tier: strong", 17, AMBER).next_to(pl, LEFT, buff=0.3)
        t2 = mono("tier: small", 17, AMBER).next_to(wk, LEFT, buff=0.3)
        self.say("Each card names a tier key, never a model.")
        self.play(FadeIn(pl), FadeIn(wk), run_time=0.5)
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.4)
        a1 = Arrow(t1.get_left(), strong.get_right(), color=GREEN, buff=0.15, stroke_width=3)
        a2 = Arrow(t2.get_left(), small.get_right(), color=GREEN, buff=0.15, stroke_width=3)
        self.play(GrowArrow(a1), GrowArrow(a2), run_time=0.6)
        self.wait(0.6)

        rv = Node("reviewer", w=3.0, color=BLUE).move_to([3.4, -1.4, 0])
        t3 = mono("tier: fast", 17, AMBER).next_to(rv, LEFT, buff=0.3)
        self.say("A card whose tier is not a template stops the start.")
        self.play(FadeIn(rv), FadeIn(t3), run_time=0.5)
        _c = t3.get_left() + LEFT * 0.5
        x = VGroup(Line(_c + UL * 0.2, _c + DR * 0.2, color=RED, stroke_width=7),
                   Line(_c + UR * 0.2, _c + DL * 0.2, color=RED, stroke_width=7))
        err = mono("refused: tier fast is not a template", 20, RED).move_to([0, -2.55, 0])
        self.play(rv.tinted(RED, 0.3), FadeIn(x), FadeIn(err), run_time=0.5)
        self.finish()


class PlanTree(FScene):
    TITLE = "The project lead grows a tree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        pl = Node("project_lead", w=2.8, color=BLUE).move_to([-3.2, 1.3, 0])
        self.say("It proposes a tree in chat. Six agents is over five: it waits.")
        self.play(FadeIn(pl), run_time=0.4)
        prop = pill("plan: 6 agents", color=AMBER, size=18).next_to(pl, UP, buff=0.25)
        self.play(FadeIn(prop, shift=DOWN * 0.1), run_time=0.4)
        self.wait(0.7)

        yes = pill('user: "yes"', color=CYAN, size=18).move_to([-6.0, 1.3, 0])
        self.play(FadeIn(yes), run_time=0.3)
        self.play(yes.animate.next_to(pl, LEFT, buff=0.2).shift(LEFT * 0.0), run_time=0.7)
        self.play(FadeOut(yes), FadeOut(prop), pl.tinted(GREEN, 0.28), run_time=0.4)

        sub = Node("sub-a", w=1.6, color=BLUE).move_to([-4.6, -0.1, 0])
        w1 = Node("w1", w=1.2, color=BLUE).move_to([-1.9, -0.1, 0])
        w2 = Node("w2", w=1.2, color=BLUE).move_to([-5.5, -1.5, 0])
        w3 = Node("w3", w=1.2, color=BLUE).move_to([-3.7, -1.5, 0])
        w4 = Node("w4", w=1.2, color=BLUE).move_to([-0.4, -0.1, 0])
        edges = [connector(pl, sub), connector(pl, w1), connector(sub, w2), connector(sub, w3), connector(pl, w4)]
        self.say("After yes it spawns a sub-lead and workers through the registry.")
        self.play(*[Create(e) for e in (edges[0], edges[1], edges[4])], FadeIn(sub), FadeIn(w1), FadeIn(w4), run_time=0.6)
        self.play(*[Create(e) for e in edges[2:4]], FadeIn(w2), FadeIn(w3), run_time=0.6)

        tb, tt = panel("tasks", 6.0, 2.1, 3.7, 0.5)
        r1 = mono("o/r#12  holder: w1", 19, INK)
        r2 = mono("o/r#20  holder: {subtree: sub-a}", 19, INK)
        rows = VGroup(r1, r2).arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to(tb)
        self.say("It records each issue in tasks with a holder.")
        self.play(FadeIn(tb), FadeIn(tt), run_time=0.4)
        self.play(FadeIn(r1, shift=RIGHT * 0.1), w1.tinted(GREEN, 0.28), run_time=0.5)
        self.play(FadeIn(r2, shift=RIGHT * 0.1), sub.tinted(GREEN, 0.28), run_time=0.5)
        self.wait(0.5)

        aw = pill("await_set [sub-a, w1]", color=CYAN, size=18).move_to([3.7, -1.5, 0])
        self.say("It waits with await_set. Nothing is deleted.", wait=0.2)
        self.play(FadeIn(aw, shift=UP * 0.1), run_time=0.4)
        self.finish()


class Digest(FScene):
    TITLE = "The cadencer sends one line per branch"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        lead = Node("lead", w=1.5, color=BLUE).move_to([-4.4, 1.2, 0])
        sub = Node("sub-a", w=1.6, color=BLUE).move_to([-4.4, -0.1, 0])
        w1 = Node("w1", w=1.2, color=BLUE).move_to([-5.7, -1.45, 0])
        w2 = Node("w2", w=1.2, color=BLUE).move_to([-3.1, -1.45, 0])
        edges = [connector(lead, sub), connector(sub, w1), connector(sub, w2)]
        cad = Node("cadencer", w=2.0, color=VIOLET).move_to([-0.2, 1.2, 0])
        self.say("On each beat the cadencer reads the spawned tree.")
        self.play(FadeIn(lead), FadeIn(sub), FadeIn(w1), FadeIn(w2), *[Create(e) for e in edges], run_time=0.7)
        self.play(FadeIn(cad), run_time=0.4)
        beat = pill("beat 60 s", color=AMBER, size=17).next_to(cad, UP, buff=0.22)
        self.play(FadeIn(beat), Indicate(cad, color=VIOLET, scale_factor=1.06), run_time=0.6)
        self.wait(0.4)

        self.say("w2 holds a task and has sat idle past stall_after.")
        idle = mono("idle 320 s", 17, RED).next_to(w2, DOWN, buff=0.2)
        self.play(w2.tinted(RED, 0.3), FadeIn(idle), run_time=0.5)
        self.wait(0.6)

        db, dt = panel("digest to lead", 6.4, 1.2, 3.5, -0.5)
        line = mono("sub-a: 2 agents (2 busy) · +0 new · 1 STALLED", 16, INK).move_to(db)
        self.say("The lead gets one roll-up line for sub-a, not one per worker.")
        self.play(FadeOut(beat), FadeIn(db), FadeIn(dt), run_time=0.4)
        self.play(FadeIn(line, shift=LEFT * 0.1), cad.tinted(GREEN, 0.28), run_time=0.6)
        self.wait(0.4)
        self.finish()
