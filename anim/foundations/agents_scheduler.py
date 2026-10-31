"""Foundations — Agents › Scheduler. Three clips, each one mechanism on fantastic main.

add:  schedule stores {id, target, payload, interval_seconds, next_run = now + interval,
      run_count 0}; a present-but-wrong interval is bad_arg (tools.py:348-392, 85-101).
fire: due -> run_count+1, next_run, save FIRST -> one batch send AS THE SCHEDULER (gate) ->
      schedule_fired to the scheduler's own inbox and history; target gets the payload once
      (tools.py:222-238, 260-306).
wake: the loop sleeps to the earliest next_run, never a fixed tick; a pause or a change pokes it;
      resume of a paused schedule fires only if its next_run has passed (tools.py:208-250, 422-461).
Ids and times are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"add": "SchedAdd", "fire": "SchedFire", "wake": "SchedWake"}
OG = "fire"


def lines(rows, size=18, color=INK, buff=0.13):
    return VGroup(*[mono(r, size, color) for r in rows]).arrange(DOWN, aligned_edge=LEFT, buff=buff)


class SchedAdd(FScene):
    """schedule stores a record; a wrong interval is refused."""

    TITLE = "Add a schedule"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        who = Node("caller", w=1.7, h=0.8, color=BLUE, size=24).move_to([-5.3, 0.9, 0])
        sc = Node("scheduler", w=2.3, h=0.9, color=GREEN, size=24).move_to([-1.2, 0.9, 0])
        rc, rt = panel("schedules.yaml", 4.4, 2.6, 3.9, 0.95)
        self.play(FadeIn(who), FadeIn(sc), FadeIn(rc), FadeIn(rt), run_time=0.6)

        self.say("schedule names a target, a payload and an interval.")
        m = pill("schedule  every 30 s", color=CYAN, size=19).move_to([-5.0, -0.5, 0])
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        self.play(m.animate.move_to([-1.6, -0.5, 0]), run_time=0.7, rate_func=smooth)
        rec = lines(["id: sch_a1b2c3", "target: monitor", "payload: {type: reflect}",
                     "interval_seconds: 30", "next_run: now + 30", "run_count: 0"], size=17)
        rec.next_to(rc.get_corner(UL), DR, buff=0.3)
        rid = pill("sch_a1b2c3", color=AMBER, size=18).move_to([-3.6, -1.35, 0])
        self.play(FadeOut(m), FadeIn(rec), sc.tinted(GREEN, 0.3), run_time=0.5)
        self.play(FadeIn(rid), run_time=0.3)
        self.wait(0.5)

        self.say("A wrong interval is refused, not guessed.")
        bad = pill('interval_seconds: "60"', color=CYAN, size=18).move_to([-5.0, -2.3, 0])
        self.play(FadeIn(bad, shift=UP * 0.1), run_time=0.4)
        self.play(bad.animate.move_to([-2.0, -2.3, 0]), run_time=0.6)
        err = mono("bad_arg · an int >= 1", 18, RED).move_to([2.2, -2.3, 0])
        self.play(bad[0].animate.set_stroke(RED), bad[1].animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(0.9)
        self.finish()


class SchedFire(FScene):
    """A due schedule is counted and saved, then sent as the scheduler."""

    TITLE = "A fire goes out as the scheduler"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        sc = Node("scheduler", w=2.3, h=0.9, color=GREEN, size=24).move_to([-4.6, 0.9, 0])
        gate = Node("gate", w=1.2, h=0.8, color=AMBER, size=22).move_to([-0.3, 0.9, 0])
        tg = Node("monitor", w=2.0, h=0.9, color=BLUE, size=24).move_to([4.2, 0.9, 0])
        self.play(FadeIn(sc), FadeIn(gate), FadeIn(tg), run_time=0.5)
        rec = mono("run_count: 0   next_run: t+30", 18, MUTED).move_to([-3.4, -0.3, 0])
        self.play(FadeIn(rec), run_time=0.3)

        self.say("Due: count the fire and save the schedule first.")
        rec2 = mono("run_count: 1   next_run: t+60", 18, GREEN).move_to(rec)
        self.play(FadeTransform(rec, rec2), sc.tinted(GREEN, 0.3), run_time=0.6)
        self.wait(0.4)

        self.say("Then the payload is sent as the scheduler.")
        p = pill('{"type": "reflect"}', color=CYAN, size=18).move_to([-4.6, 2.0, 0])
        self.play(FadeIn(p, shift=UP * 0.1), run_time=0.3)
        self.play(p.animate.move_to([-0.3, 2.0, 0]), run_time=0.6)
        chk = mono("can_call + callable_by", 16, AMBER).next_to(gate, DOWN, buff=0.25)
        self.play(FadeIn(chk), gate.tinted(GREEN, 0.3), run_time=0.4)
        self.play(p.animate.move_to([4.2, 2.0, 0]), run_time=0.6)
        self.play(tg.tinted(GREEN, 0.3), run_time=0.3)

        self.say("The event goes to the scheduler, not to the target.", wait=0.2)
        ev = pill("schedule_fired  result", color=GREEN, size=18).move_to([4.2, -0.4, 0])
        self.play(FadeIn(ev), run_time=0.3)
        self.play(ev.animate.move_to([-3.4, -1.7, 0]), run_time=0.9, rate_func=smooth)
        hist = mono("history: sch_a1b2c3 completed", 18, GREEN).move_to([-0.6, -2.5, 0])
        self.play(FadeIn(hist), run_time=0.4)
        self.wait(0.4)
        self.finish()


class SchedWake(FScene):
    """The loop sleeps until the earliest next_run; a change wakes it."""

    TITLE = "Sleeping until the next fire"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        line = Line([-5.8, 0.4, 0], [5.8, 0.4, 0], color=LINE, stroke_width=3)
        tl = mono("time", 16, MUTED).move_to([5.4, 0.0, 0])
        self.play(Create(line), FadeIn(tl), run_time=0.5)

        def tick(x, col):
            return Line([x, 0.25, 0], [x, 0.55, 0], color=col, stroke_width=4)

        self.say("Two schedules: every 5 s and every 600 s.")
        a = [tick(-5.0 + 1.4 * i, BLUE) for i in range(5)]
        b = tick(5.0, VIOLET)
        la = mono("sch_a  5 s", 17, BLUE).move_to([-4.2, 1.2, 0])
        lb = mono("sch_b  600 s", 17, VIOLET).move_to([4.6, 1.2, 0])
        self.play(FadeIn(la), FadeIn(lb), FadeIn(b), run_time=0.4)
        mark = Dot([-5.8, 0.4, 0], color=AMBER, radius=0.11)
        self.play(FadeIn(mark), run_time=0.2)
        sleep = mono("sleeps until the earliest next_run", 18, MUTED).move_to([0, -0.7, 0])
        self.play(FadeIn(sleep), run_time=0.3)
        for t in a[:3]:
            self.play(mark.animate.move_to(t.get_center()), run_time=0.55, rate_func=smooth)
            self.play(FadeIn(t), t.animate.set_color(GREEN), run_time=0.15)

        self.say("pause keeps next_run; resume fires only if that time has passed.")
        self.play(FadeOut(sleep), run_time=0.2)
        ps = pill("pause sch_a", color=CYAN, size=18).move_to([-2.0, -1.0, 0])
        old = tick(-0.8, DIM)
        nr = mono("old next_run", 16, DIM).move_to([-0.8, -0.2, 0])
        self.play(FadeIn(ps, shift=UP * 0.1), la.animate.set_color(DIM), FadeIn(old), FadeIn(nr), run_time=0.4)
        self.play(mark.animate.move_to([1.2, 0.4, 0]), run_time=0.9, rate_func=smooth)
        sl = mono("time moves on; sch_a is paused", 18, MUTED).move_to([0, -1.9, 0])
        self.play(FadeIn(sl), run_time=0.3)
        self.wait(0.5)
        rs = pill("resume: due if next_run has passed", color=GREEN, size=18).move_to([-1.2, -1.0, 0])
        fire = tick(1.2, GREEN)
        self.play(FadeTransform(ps, rs), FadeOut(sl), la.animate.set_color(BLUE), run_time=0.5)
        self.play(FadeIn(fire), run_time=0.4)
        self.wait(0.4)
        self.finish()
