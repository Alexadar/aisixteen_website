"""Foundations — Canvas › System agents. 3 clips, each one mechanism.

layers:  event -> reduce -> effect -> port -> event; state emitted once, <=1 per 100 ms
         (bundles/fantastic-system-agents/src/driver.rs:1-5,117-143,165-176).
refusal: power verb runs only when its `can` is yes; challenge -> denied; na -> unsupported
         (crates/fantastic-system/src/power.rs:225-241).
lock:    lock.callable_by names user alone (src/tui/src/kern/reach.rs:164-167); wrong PINs:
         5 free, then retry_later, 30 s doubling to 15 min (crates/fantastic-system/src/lock.rs:14-23,169-172).
Ids and names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"layers": "Layers", "refusal": "Refusal", "lock": "LockClip"}
OG = "layers"


def edge(a, b, color=LINE):
    return Line(a.get_right(), b.get_left(), color=color, stroke_width=3)


class Layers(FScene):
    TITLE = "Model, driver, port"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        vm = Node("power model", w=2.6, h=1.0, color=BLUE, size=22).move_to([-4.3, 0.2, 0])
        drv = Node("driver", w=2.0, h=1.0, color=VIOLET, size=24).move_to([0, 0.2, 0])
        port = Node("OS port", w=2.0, h=1.0, color=GREEN, size=24).move_to([4.2, 0.2, 0])
        e1, e2 = edge(vm, drv), edge(drv, port)
        self.say("The model is pure. The driver runs it against an OS port.")
        self.play(FadeIn(vm), FadeIn(drv), FadeIn(port), Create(e1), Create(e2), run_time=0.7)

        ev = pill("event: suspend", color=CYAN, size=19).move_to([-2.1, 1.6, 0])
        self.say("A verb becomes an event; reduce returns an effect as data.")
        self.play(FadeIn(ev), run_time=0.4)
        self.play(ev.animate.move_to([-4.3, 1.5, 0]), vm.tinted(AMBER, 0.3), run_time=0.6)
        eff = pill("effect: Call(Suspend)", color=AMBER, size=19).move_to([-2.1, 1.6, 0])
        self.play(FadeOut(ev), FadeIn(eff), run_time=0.4)
        self.play(eff.animate.move_to([2.1, 1.6, 0]), run_time=0.7)
        self.play(port.tinted(AMBER, 0.3), run_time=0.3)

        self.say("The answer returns as an event. The state changed.")
        ans = pill("event: Changed", color=GREEN, size=19).move_to([2.1, -1.0, 0])
        self.play(FadeOut(eff), FadeIn(ans), port.tinted(GREEN, 0.3), run_time=0.4)
        self.play(ans.animate.move_to([-4.0, -1.0, 0]), run_time=0.9)
        self.play(vm.tinted(GREEN, 0.3), run_time=0.3)

        self.say("The driver emits one state, at most once per 100 ms.", wait=0.3)
        st = pill('{"type": "state", "state": …}', color=CYAN, size=19).move_to([0, -2.1, 0])
        self.play(FadeOut(ans), drv.tinted(VIOLET, 0.35), FadeIn(st, shift=DOWN * 0.1), run_time=0.5)
        self.finish()


class Refusal(FScene):
    TITLE = "logind’s can decides"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        agent = Node("power", w=1.8, h=0.9, color=BLUE, size=26).move_to([-4.7, 0.2, 0])
        self.play(FadeIn(agent), run_time=0.4)
        rows = [("suspend", "yes", GREEN, "runs, returns state"),
                ("reboot", "challenge", AMBER, "denied"),
                ("hibernate", "na", RED, "unsupported")]
        self.say("Each power verb has a can: yes, no, challenge or na.")
        items = []
        for i, (v, can, col, out) in enumerate(rows):
            y = 1.5 - i * 1.3
            verb = mono(v, 22, INK).move_to([-1.9, y, 0])
            c = pill("can " + can, color=col, size=19).move_to([0.9, y, 0])
            items.append((verb, c, out, col, y))
            self.play(FadeIn(verb), FadeIn(c), run_time=0.4)
        for verb, c, out, col, y in items:
            r = pill(out, color=col, size=19).move_to([4.3, y, 0])
            if out.startswith("runs"):
                self.say("Only yes lets the call run.")
            elif out == "denied":
                self.say("challenge is denied: no prompt, a polkit rule decides.")
            else:
                self.say("na is unsupported: this machine cannot.")
            self.play(FadeIn(r, shift=RIGHT * 0.1), run_time=0.5)
        self.say("The model decides before the OS is asked.", wait=0.5)
        self.finish()


class LockClip(FScene):
    TITLE = "lock answers user alone"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ai = Node("AI", w=1.4, h=0.9, color=VIOLET, size=26).move_to([-5.0, 1.2, 0])
        person = Node("user", w=1.6, h=0.9, color=BLUE, size=26).move_to([-5.0, -1.4, 0])
        lock = Node("lock", w=1.8, h=1.0, color=AMBER, size=26).move_to([-0.6, -0.1, 0])
        self.say("lock is callable by user only.")
        grant = mono('lock.callable_by  {"user": [...]}', 17, GREEN).move_to([1.2, 1.9, 0])
        self.play(FadeIn(ai), FadeIn(person), FadeIn(lock), FadeIn(grant), run_time=0.7)

        self.say("An AI is not granted lock. The gate refuses it.")
        m = pill("unlock", color=CYAN, size=19).move_to([-3.2, 1.2, 0])
        self.play(FadeIn(m), run_time=0.3)
        self.play(m.animate.move_to([-1.6, 0.8, 0]), run_time=0.6)
        self.play(FadeOut(m), run_time=0.2)
        ref = pill("refused: not granted", color=RED, size=18).move_to([3.8, 0.8, 0])
        self.play(FadeIn(ref), ai.tinted(RED, 0.3), run_time=0.4)

        self.say("After the fifth wrong PIN, each try waits.")
        wrong = pill("unlock {pin} x5: wrong_pin", color=AMBER, size=18).move_to([-2.6, -2.0, 0])
        self.play(FadeIn(wrong), run_time=0.4)
        self.play(wrong.animate.move_to([-1.8, -1.4, 0]), run_time=0.5)
        wait = pill("retry_later: 30 s … 15 min", color=RED, size=18).move_to([3.7, -1.4, 0])
        self.play(FadeIn(wait), lock.tinted(RED, 0.3), run_time=0.4)
        self.say("The wait doubles, up to 15 minutes.", wait=0.5)
        self.finish()
