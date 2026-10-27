"""Foundations — Kernel › Lifecycle.

Moved from the first draft's kernel.py (the #443 split). Every step drawn here is a behaviour
of the fantastic kernel on main (Rust and Python twins). Ids and agent names are illustrative;
shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, PANEL_HI, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"create": "K4Create", "start": "K4Start", "stop": "K4Stop", "delete": "K4Delete"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "start"


class _Console:
    """A column of operator calls and replies on the right half of the frame."""

    X, TOP = 0.5, 1.9

    def console(self):
        self.log = VGroup()

    def put(self, *lines):
        g = VGroup(*lines).arrange(DOWN, aligned_edge=LEFT, buff=0.09)
        if len(self.log):
            g.next_to(self.log, DOWN, buff=0.2, aligned_edge=LEFT)
        else:
            g.move_to([0, self.TOP, 0]).align_to([self.X, 0, 0], LEFT).shift(DOWN * g.height / 2)
        g.align_to([self.X, 0, 0], LEFT)
        self.log.add(g)
        self.play(FadeIn(g, shift=UP * 0.1), run_time=0.4)
        return g


class K4Create(FScene, _Console):
    """create_agent: parent_id is required; the child is registered, then booted right away."""

    TITLE = "create_agent: placement is stated"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.console()
        s = 22
        root = Node("kernel_state", color=BRAND, size=s).move_to([-4.3, 1.6, 0])
        mem = Node("memory", color=BLUE, size=s).move_to([-5.9, 0.35, 0])
        lead = Node("lead", w=1.3, color=BLUE, size=s).move_to([-2.7, 0.35, 0])
        e = [connector(root, mem), connector(root, lead)]
        self.say("A tree of agents. Every agent has exactly one parent.")
        self.play(FadeIn(root), *[Create(l) for l in e], FadeIn(mem), FadeIn(lead), run_time=0.7)
        self.wait(0.3)

        self.say("No parent_id, no agent: placement is never inferred from who sent the call.")
        self.put(mono('create_agent {"handler_module":', 20, AMBER), mono('  "ram_store.tools"}', 20, AMBER))
        self.put(mono('reason: "missing_arg"', 20, RED), mono('arg: "parent_id"', 20, RED))
        self.wait(0.6)

        self.say("With parent_id the child is registered under that parent...")
        self.put(mono('create_agent {"handler_module":', 20, AMBER), mono('  "ram_store.tools",', 20, AMBER),
                 mono('  "parent_id": "lead"}', 20, AMBER))
        new = Node("ram_store_a3f9c1", color=GREEN, size=20).move_to([-2.7, -0.95, 0])
        edge = connector(lead, new)
        self.play(Create(edge), FadeIn(new, shift=UP * 0.1), run_time=0.6)
        idnote = pill("id minted", AMBER, 17).next_to(new, DOWN, buff=0.18)
        self.play(FadeIn(idnote), run_time=0.3)
        self.wait(0.4)

        self.say("...and booted right away, by the kernel, before the reply.")
        boot = pill("boot", CYAN, 18).next_to(new, LEFT, buff=0.25)
        self.play(FadeIn(boot), new.tinted(CYAN), run_time=0.4)
        self.play(new.tinted(BLUE), run_time=0.4)
        self.put(mono('{"id": "ram_store_a3f9c1",', 20, GREEN), mono(' "parent_id": "lead", ...}', 20, GREEN))
        self.finish(2.4)


class K4Start(FScene, _Console):
    """kernel_start: refuses without a memory store; root, store, probe, flusher, then the rest."""

    TITLE = "kernel_start: the order of boot"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.console()
        s = 22
        root = Node("kernel_state", color=BRAND, size=s).move_to([-4.0, 1.6, 0])
        mem = Node("memory", color=BLUE, size=s).move_to([-5.6, 0.35, 0])
        lead = Node("lead", w=1.3, color=BLUE, size=s).move_to([-3.6, 0.35, 0])
        web = Node("web", w=1.2, color=BLUE, size=s).move_to([-1.9, 0.35, 0])
        e = [connector(root, mem), connector(root, lead), connector(root, web)]
        self.say("A loaded tree, nobody booted yet. The root names no memory store.")
        self.play(FadeIn(root), *[Create(l) for l in e], FadeIn(mem), FadeIn(lead), FadeIn(web), run_time=0.7)
        self.wait(0.3)

        self.say("kernel_start fails loud: there is no built-in default store.")
        self.put(mono('kernel_start', 21, AMBER))
        self.put(mono('reason: "missing_arg"', 20, RED), mono('arg: "memory_store_id"', 20, RED))
        self.wait(0.6)

        self.say("Name the store on the root, then start again.")
        self.put(mono('update_agent {"id": "kernel_state",', 19, AMBER), mono('  "memory_store_id": "memory"}', 19, AMBER))
        self.put(mono('kernel_start', 21, AMBER))

        def mark(n, label, color, to, dy=0.7):
            p = pill(label, color, 17).next_to(to, DOWN, buff=0.18)
            self.play(FadeIn(p, shift=UP * 0.08), n.tinted(color) if n is not None else Wait(0.01), run_time=0.4)
            return p

        self.say("1. The root boots first: it mints the kernel's guid.")
        p1 = mark(root, "1 boot", CYAN, root)
        self.say("2. Then the store, before anyone who might call it.")
        p2 = mark(mem, "2 boot", CYAN, mem)
        self.say("3. The kernel probes the store, then starts flushing rows into it.")
        p3 = pill("3 probe", AMBER, 17).next_to(p2, DOWN, buff=0.14)
        self.play(FadeIn(p3), run_time=0.35)
        p4 = pill("flusher", GREEN, 17).next_to(p3, DOWN, buff=0.14)
        self.play(FadeIn(p4), run_time=0.35)
        self.say("4. Every other agent boots, in registration order.")
        p5 = mark(lead, "4 boot", CYAN, lead)
        p6 = mark(web, "5 boot", CYAN, web)
        self.play(*[n.tinted(BLUE) for n in (root, mem, lead, web)], run_time=0.4)
        self.put(mono('started: true, store: "memory"', 20, GREEN), mono('booted: [kernel_state, memory,', 20, GREEN),
                 mono('  lead, web]', 20, GREEN))
        self.finish(2.4)


class K4Stop(FScene, _Console):
    """shutdown_agents drains and tells agents; kernel_stop acks, then stops the process."""

    TITLE = "shutdown_agents and kernel_stop"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.console()
        s = 22
        root = Node("kernel_state", color=BRAND, size=s).move_to([-3.8, 1.6, 0])
        lead = Node("lead", w=1.3, color=BLUE, size=s).move_to([-5.4, 0.35, 0])
        web = Node("web", w=1.2, color=BLUE, size=s).move_to([-2.1, 0.35, 0])
        task = Node("task 7", w=1.6, color=AMBER, size=20).move_to([-5.4, -0.95, 0])
        e = [connector(root, lead), connector(root, web), connector(lead, task)]
        self.say("A running kernel, with one task still in flight under lead.")
        self.play(FadeIn(root), *[Create(l) for l in e], FadeIn(lead), FadeIn(web), FadeIn(task), run_time=0.8)
        self.wait(0.3)

        self.put(mono('shutdown_agents', 21, AMBER))
        self.say("1. Drain: new work is refused. Work already in flight may finish.")
        drain = pill("draining", RED, 17).next_to(root, RIGHT, buff=0.3)
        self.play(FadeIn(drain), run_time=0.4)
        self.say("2. Every agent that advertises shutdown is told, all at once.")
        s1 = pill("shutdown", CYAN, 17).next_to(lead, RIGHT, buff=0.2)
        s2 = pill("shutdown", CYAN, 17).next_to(web, DOWN, buff=0.2)
        self.play(FadeIn(s1), FadeIn(s2), lead.tinted(CYAN), web.tinted(CYAN), run_time=0.5)
        self.say("3. Work that does not finish in time is cancelled, hooks first.")
        self.wait(0.4)
        self.play(task.tinted(RED), run_time=0.4)
        self.play(FadeOut(task), FadeOut(e[2]), run_time=0.4)
        self.put(mono('drained: true, shut: [lead, web]', 20, GREEN), mono('cancelled: [7]', 20, GREEN))
        self.wait(0.4)

        self.say("kernel_stop acknowledges first, then stops the process.", color=INK)
        self.put(mono('kernel_stop', 21, AMBER))
        self.put(mono('{"type": "kernel_stop", "ok": true}', 20, GREEN))
        self.wait(0.4)
        steps = VGroup(*[mono(t, 20, MUTED) for t in
                         ("~100 ms later", "calls settle, last rows flush", "agent shutdown hooks run", "lock released, exit 0")])
        steps.arrange(DOWN, aligned_edge=LEFT, buff=0.12).next_to(self.log, DOWN, buff=0.25, aligned_edge=LEFT)
        for i, st in enumerate(steps):
            self.play(FadeIn(st, shift=UP * 0.08), run_time=0.35)
            if i:
                self.play(st.animate.set_color(GREEN), run_time=0.2)
        self.play(*[n.tinted(FAINT, 0.1) for n in (root, lead, web)], run_time=0.5)
        self.finish(2.2)


class K4Delete(FScene):
    """delete_agent cascades deepest-first; delete_lock refuses; grants naming the dead are pruned."""

    TITLE = "delete_agent: the whole subtree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        s = 22
        root = Node("kernel_state", color=BRAND, size=s).move_to([-3.3, 1.6, 0])
        team = Node("team", color=BLUE, size=s).move_to([-4.9, 0.35, 0])
        x = Node("x", w=1.0, color=BLUE, size=s).move_to([-1.5, 0.35, 0])
        wr = Node("writer", color=BLUE, size=s).move_to([-6.0, -0.95, 0])
        rv = Node("reviewer", color=BLUE, size=s).move_to([-3.75, -0.95, 0])
        e = [connector(root, team), connector(root, x), connector(team, wr), connector(team, rv)]
        lock = pill("delete_lock", AMBER, 17).next_to(rv, DOWN, buff=0.18)
        grants = VGroup(mono("x.can_call", 19, DIM), mono('{"$self": "*", "writer": ["reflect"]}', 20, MUTED))
        grants.arrange(DOWN, aligned_edge=LEFT, buff=0.1).move_to([0, -2.2, 0]).align_to([-6.55, 0, 0], LEFT)
        self.say("A tree of agents. reviewer carries delete_lock; x may call writer.")
        self.play(FadeIn(root), *[Create(l) for l in e[:2]], FadeIn(team), FadeIn(x), run_time=0.6)
        self.play(*[Create(l) for l in e[2:]], FadeIn(wr), FadeIn(rv), FadeIn(lock), FadeIn(grants), run_time=0.6)
        self.wait(0.4)

        # a console on the right: each operator call, then its reply
        X, top = 0.4, 1.9
        log = VGroup()

        def put(*lines):
            g = VGroup(*lines).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
            if len(log):
                g.next_to(log, DOWN, buff=0.22, aligned_edge=LEFT)
            else:
                g.move_to([0, top, 0]).align_to([X, 0, 0], LEFT).shift(DOWN * g.height / 2)
            g.align_to([X, 0, 0], LEFT)
            log.add(g)
            self.play(FadeIn(g, shift=UP * 0.1), run_time=0.4)
            return g

        put(mono('delete_agent {"id": "team"}', 21, AMBER))
        self.say("Any lock in the subtree refuses the whole delete, and names the blocker.")
        put(mono('reason: "locked"', 20, RED), mono('blocked_by: "reviewer"', 20, RED))
        self.play(Indicate(lock, color=RED), run_time=0.4)
        self.wait(0.5)
        put(mono('update_agent {"id": "reviewer",', 21, AMBER), mono('  "delete_lock": false}', 21, AMBER))
        self.play(FadeOut(lock, shift=DOWN * 0.2), run_time=0.4)
        put(mono('delete_agent {"id": "team"}', 21, AMBER))

        self.say("Deepest first: each agent runs its on_delete hook, then leaves the tree.")
        for n, edge in ((wr, e[2]), (rv, e[3])):
            hook = pill("on_delete", AMBER, 17).next_to(n, DOWN, buff=0.18)
            self.play(FadeIn(hook), n.tinted(AMBER), run_time=0.3)
            self.play(FadeOut(n), FadeOut(hook), FadeOut(edge), run_time=0.35)
        hook = pill("on_delete", AMBER, 17).next_to(team, DOWN, buff=0.18)
        self.play(FadeIn(hook), team.tinted(AMBER), run_time=0.3)
        self.play(FadeOut(team), FadeOut(hook), FadeOut(e[0]), run_time=0.35)
        put(mono('{"deleted": true, "id": "team"}', 20, GREEN))

        self.say("Then every deleted id is pruned from other agents' grants.", color=INK)
        g2 = mono('{"$self": "*"}', 20, GREEN).move_to(grants[1]).align_to(grants[1], LEFT)
        self.play(FadeTransform(grants[1], g2), run_time=0.7)
        self.finish(2.4)
