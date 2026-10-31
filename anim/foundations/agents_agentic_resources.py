"""Foundations — Agents › Agentic resources and tasks. Three clips, one mechanism each.

Ids and values are illustrative; verbs, shapes and orders are not.
- cards: a role card names a tier KEY; spawn makes a child of the caller, who gets pause/resume/stop
  (agentic_resources lib.rs:368-387, 443, 548-561, 646-672; cards.rs:52-115).
- limits: the cap counts every spawned agent that still exists; report frees nothing,
  delete_agent does (lib.rs:446-460, 1029-1073, 1142-1159; readme.md:14,16).
- tasks: add / assign / reassign with a history of {from, to, by, at}
  (task_registry lib.rs:502-600; readme.md:28-30).
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"cards": "RoleCard", "limits": "SlotsLimit", "tasks": "TaskHolder"}
OG = "cards"


class RoleCard(FScene):
    TITLE = "A role card becomes an agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        box, ttl = panel("reviewer.md", 4.4, 2.0, -4.6, 0.55)
        l1 = mono("name:   reviewer", 19, INK)
        l2 = mono("tier:   fast", 19, AMBER)
        l3 = mono("grants: $registry: [report]", 19, MUTED)
        lines = VGroup(l1, l2, l3).arrange(DOWN, aligned_edge=LEFT, buff=0.22).move_to(box)
        self.say("A role card names a tier key, never a model.")
        self.play(FadeIn(box), FadeIn(ttl), FadeIn(lines), run_time=0.6)
        tier = pill('tiers["fast"]: backend fields', color=AMBER, size=17).move_to([-4.5, -1.25, 0])
        self.play(FadeIn(tier, shift=UP * 0.1), run_time=0.5)
        self.wait(0.6)

        lead = Node("lead", w=1.5, color=BLUE).move_to([1.8, 1.5, 0])
        reg = Node("registry", w=2.0, color=VIOLET).move_to([5.4, 1.5, 0])
        self.say("lead sends spawn to the registry, which reads the card.")
        self.play(FadeIn(lead), FadeIn(reg), run_time=0.5)
        msg = pill("spawn reviewer", color=CYAN, size=18).move_to([1.8, 2.25, 0])
        self.play(FadeIn(msg), run_time=0.3)
        self.play(msg.animate.move_to([5.4, 2.25, 0]), run_time=0.8, rate_func=smooth)
        self.play(reg.tinted(VIOLET, 0.35), run_time=0.3)

        child = Node("reviewer-1", w=2.3, color=GREEN).move_to([1.8, -0.35, 0])
        edge = Line(lead.get_bottom(), child.get_top(), color=LINE, stroke_width=2.2)
        self.say("The child is the caller's child. lead may pause, resume, stop it.")
        self.play(FadeOut(msg), Create(edge), FadeIn(child), run_time=0.6)
        ctl = pill("lead: pause resume stop", color=CYAN, size=18).move_to([1.8, -1.25, 0])
        sp = mono("spawned_by: registry · role: reviewer", 17, DIM).move_to([1.8, -1.95, 0])
        self.play(FadeIn(ctl, shift=UP * 0.1), FadeIn(sp), run_time=0.5)
        self.finish()


class SlotsLimit(FScene):
    TITLE = "Limits count every agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        reg = Node("registry", w=2.0, color=VIOLET).move_to([-4.8, 1.5, 0])
        lim = pill('limits {"total": 2}', color=AMBER, size=18).move_to([-4.8, 0.65, 0])

        def count(n):
            return mono(f"running {n} / max 2", 22, INK).move_to([-4.8, -0.2, 0])

        cnt = count(0)
        xs = [-0.6, 2.0, 4.6]
        self.say("spawn counts every agent the registry made that still exists.")
        self.play(FadeIn(reg), FadeIn(lim), FadeIn(cnt), run_time=0.6)

        def spawn(i, name):
            n = Node(name, w=1.4, color=BLUE).move_to([xs[i], 1.5, 0])
            self.play(FadeIn(n, shift=DOWN * 0.1), run_time=0.4)
            return n

        w1 = spawn(0, "w1")
        c = count(1)
        self.play(FadeTransform(cnt, c), run_time=0.3)
        cnt = c
        w2 = spawn(1, "w2")
        c = count(2)
        self.play(FadeTransform(cnt, c), run_time=0.3)
        cnt = c

        ghost = Node("w3", w=1.4, color=DIM, fill_alpha=0.0).move_to([xs[2], 1.5, 0])
        ghost.box.set_stroke(DIM, width=2)
        self.say("A third spawn is refused: nothing is created.")
        self.play(FadeIn(ghost), run_time=0.3)
        err = mono("limit · scope total · 2 running, max 2", 20, RED).move_to([2.6, 0.45, 0])
        self.play(ghost.box.animate.set_stroke(RED), FadeIn(err), run_time=0.4)
        self.wait(0.9)

        self.say("w1 reports done. It still holds its slot.")
        done = pill("report done", color=GREEN, size=17).move_to([xs[0], 2.4, 0])
        self.play(w1.tinted(GREEN, 0.3), FadeIn(done), run_time=0.5)
        self.play(Indicate(err, color=RED, scale_factor=1.05), run_time=0.6)
        self.wait(0.6)

        self.say("Only delete_agent frees a slot. Then the spawn passes.")
        dele = pill("delete_agent w1", color=CYAN, size=17).move_to([xs[0], 2.4, 0])
        self.play(FadeTransform(done, dele), run_time=0.4)
        c = count(1)
        self.play(FadeOut(w1), FadeTransform(cnt, c), run_time=0.5)
        cnt = c
        w3 = Node("w3", w=1.4, color=GREEN).move_to([xs[2], 1.5, 0])
        c = count(2)
        self.play(FadeOut(err), FadeOut(dele), FadeOut(ghost), FadeIn(w3), FadeTransform(cnt, c), run_time=0.6)
        self.finish()


class TaskHolder(FScene):
    TITLE = "Who holds the task"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        tb, tt = panel("task t1", 6.0, 1.9, -3.9, 0.6)
        src = mono("source: gh:o/r#12", 20, INK)
        hold = mono("holder: null", 20, MUTED)
        rows = VGroup(src, hold).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to(tb)
        hb, ht = panel("history", 5.4, 1.9, 3.5, 0.6)
        self.say("add creates t1 with a source and no holder.")
        self.play(FadeIn(tb), FadeIn(tt), FadeIn(rows), FadeIn(hb), FadeIn(ht), run_time=0.6)
        msg = pill("add t1 gh:o/r#12", color=CYAN, size=18).move_to([-3.9, -1.2, 0])
        self.play(FadeIn(msg, shift=UP * 0.1), run_time=0.4)
        self.wait(0.6)

        def holder(s, color):
            h = mono(f"holder: {s}", 20, color)
            h.move_to(hold).align_to(hold, LEFT)
            return h

        def swap_msg(s, color):
            m = pill(s, color=color, size=18).move_to([-3.9, -1.2, 0])
            return m

        self.say("assign gives it to lead-a. The history keeps the step.")
        m2 = swap_msg("assign t1 lead-a", CYAN)
        h2 = holder("lead-a", GREEN)
        r1 = mono("null → lead-a  by lead-a", 18, INK).move_to([3.5, 1.0, 0])
        self.play(FadeTransform(msg, m2), FadeTransform(hold, h2), FadeIn(r1), run_time=0.6)
        hold, msg = h2, m2
        self.wait(0.6)

        self.say("A second assign is refused: the task is already held.")
        m3 = swap_msg("assign t1 lead-b → already_held", RED)
        self.play(FadeTransform(msg, m3), run_time=0.4)
        msg = m3
        self.wait(0.9)

        self.say("reassign moves it, here to a whole subtree.")
        m4 = swap_msg("reassign t1 {subtree: team-b}", CYAN)
        h4 = holder("{subtree: team-b}", GREEN)
        r2 = mono("lead-a → subtree team-b", 18, INK).move_to([3.5, 0.45, 0])
        self.play(FadeTransform(msg, m4), FadeTransform(hold, h4), FadeIn(r2), run_time=0.6)
        self.finish()
