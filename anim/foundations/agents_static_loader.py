"""Foundations — Agents › Static loader. Three clips.

hydrate: boot reads the manifest, create_agent per entry with parent_id = loader (lib.rs:120-273, tools.py:102-218).
reapply: existing ids are re-applied with update_agent; can_call merged over $self; handler_module fixed (lib.rs:172-240).
closed:  agent-sent boot refused as unauthorized; roster agents are deny-all (lib.rs:125-127, lib.rs:16-18).
Ids are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, BRAND, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

CLIPS = {"hydrate": "Hydrate", "reapply": "Reapply", "closed": "Closed"}
OG = "hydrate"


def manifest_card(x=-4.6, y=-0.2):
    c = card(3.9, 2.5, stroke=LINE).move_to([x, y, 0])
    lines = VGroup(
        mono("fantastic.yaml", 18, AMBER),
        mono("agents:", 17, MUTED),
        mono("- id: memory", 17, INK),
        mono("- id: worker", 17, INK),
        mono("\u00a0\u00a0can_call:", 17, MUTED),
        mono("\u00a0\u00a0\u00a0\u00a0memory: [set, read]", 17, CYAN),
    ).arrange(DOWN, aligned_edge=LEFT, buff=0.1).move_to(c)
    return VGroup(c, lines)


class Hydrate(FScene):
    TITLE = "Boot: each entry becomes a child"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        man = manifest_card()
        loader = Node("static_loader", w=2.6, color=BRAND, size=20).move_to([1.0, 1.4, 0])
        self.say("Boot: the loader reads its manifest.")
        self.play(FadeIn(man), FadeIn(loader), run_time=0.5)
        rd = pill("read", AMBER, 17).next_to(loader, LEFT, buff=0.3)
        self.play(FadeIn(rd), run_time=0.5)

        self.say("It calls create_agent for each entry, parent_id = the loader.")
        mem = Node("memory", w=1.8, color=BLUE, size=20).move_to([-0.3, -0.5, 0])
        wor = Node("worker", w=1.8, color=BLUE, size=20).move_to([2.9, -0.5, 0])
        e1, e2 = connector(loader, mem), connector(loader, wor)
        self.play(Create(e1), FadeIn(mem, shift=UP * 0.1), run_time=0.6)
        self.play(Create(e2), FadeIn(wor, shift=UP * 0.1), run_time=0.6)

        self.say("Baseline $self grant, plus the can_call the file names.")
        g = pill("$self", GREEN, 17).next_to(mem, DOWN, buff=0.2)
        g2 = pill("$self + memory", CYAN, 17).next_to(wor, DOWN, buff=0.2)
        self.play(FadeIn(g), FadeIn(g2), run_time=0.4)

        rep = mono('{"booted": true, "created": ["memory", "worker"]}', 19, GREEN).move_to([2.0, -2.5, 0])
        self.play(FadeIn(rep, shift=UP * 0.1), run_time=0.4)
        self.say("The reply lists what was created.", wait=0.6)
        self.finish()


class Reapply(FScene):
    TITLE = "Reboot: the manifest is re-applied"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        man = manifest_card()
        loader = Node("static_loader", w=2.6, color=BRAND, size=20).move_to([1.0, 1.4, 0])
        mem = Node("memory", w=1.8, color=BLUE, size=20).move_to([-0.3, -0.5, 0])
        wor = Node("worker", w=1.8, color=BLUE, size=20).move_to([2.9, -0.5, 0])
        e1, e2 = connector(loader, mem), connector(loader, wor)
        self.say("After a restart, both agents are already in the tree.")
        self.play(FadeIn(man), FadeIn(loader), FadeIn(mem), FadeIn(wor), Create(e1), Create(e2), run_time=0.7)

        self.say("Existing ids are not created again: update_agent re-applies them.")
        u = pill("update_agent", CYAN, 18).next_to(wor, DOWN, buff=0.2)
        self.play(FadeIn(u), wor.tinted(CYAN, 0.35), mem.tinted(CYAN, 0.35), run_time=0.5)
        self.play(wor.tinted(BLUE), mem.tinted(BLUE), run_time=0.4)

        self.say("can_call is merged over $self, so the baseline survives.")
        m = pill("{$self, memory}", GREEN, 17).next_to(u, DOWN, buff=0.15)
        self.play(FadeIn(m), run_time=0.4)
        self.wait(0.5)

        rep = mono('{"booted": true, "reapplied": ["memory", "worker"]}', 19, GREEN).move_to([1.4, -2.6, 0])
        self.play(FadeIn(rep, shift=UP * 0.1), run_time=0.4)
        self.say("The reply lists the ids under reapplied.", wait=0.8)

        self.say("Had the file changed worker's handler_module, boot would fail.")
        bad = mono('"booted": false  handler_module is fixed at create', 18, RED).move_to([1.4, -2.6, 0])
        self.play(FadeOut(rep), FadeIn(bad, shift=UP * 0.1), wor.tinted(RED, 0.35), run_time=0.5)
        self.finish()


class Closed(FScene):
    TITLE = "An agent-sent boot is refused"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        root = Node("kernel_state", w=2.6, color=BRAND, size=20).move_to([3.4, 1.5, 0])
        loader = Node("static_loader", w=2.6, color=BRAND, size=20).move_to([-3.4, 1.5, 0])
        wor = Node("worker", w=1.8, color=BLUE, size=20).move_to([-3.4, -0.9, 0])
        e = connector(loader, wor)
        self.say("worker is a roster agent that has been granted boot on the loader.")
        self.play(FadeIn(root), FadeIn(loader), FadeIn(wor), Create(e), run_time=0.7)

        self.say("Granted or not, the loader refuses an agent-sent boot before the file is read.")
        m = pill("boot", CYAN, 18).next_to(wor, UP, buff=0.35)
        self.play(FadeIn(m), run_time=0.3)
        self.play(m.animate.move_to([-3.4, 0.35, 0]), run_time=0.5)
        r = mono('reason: "unauthorized"', 20, RED).move_to([-0.2, 0.0, 0])
        self.play(FadeIn(r, shift=UP * 0.1), loader.tinted(RED, 0.3), run_time=0.4)
        self.play(FadeOut(m), loader.tinted(BRAND), run_time=0.3)

        self.say("worker asks the root for create_agent: refused, deny-all grants it nothing.")
        m2 = pill("create_agent", CYAN, 18).next_to(wor, RIGHT, buff=0.3)
        self.play(FadeIn(m2), run_time=0.3)
        self.play(m2.animate.move_to([3.4, 0.35, 0]), run_time=0.8)
        r2 = mono('refused', 20, RED).move_to([3.4, -0.4, 0])
        self.play(FadeIn(r2, shift=UP * 0.1), root.tinted(RED, 0.3), run_time=0.4)
        self.play(FadeOut(m2), root.tinted(BRAND), run_time=0.3)

        self.say("The roster stays what the file declared.", wait=0.5)
        self.finish()
