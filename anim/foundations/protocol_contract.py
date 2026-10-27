"""Foundations — Protocol › The contract. Three clips, one mechanism each.

Facts: coder/tmp/foundations/facts/protocol_contract.md (fantastic main b175660c).
- replay: one cases.json, each runtime sends every case to its own kernel and holds the
          reply to `expect` (a subset) — contract/conformance/cases.json:22-41;
          P/tests/conformance/test_c21_transport_symmetry.py:100-105; Rust c21_conformance.rs:124-162;
          TS c21_conformance.test.ts:119-144.
- legs:   Python replays the file on five transport legs and diffs each reply with the in-proc
          reply, except `pairwise: false` cases, which are shape-checked (py :365-410;
          cases.json:78-79, 91-92).
- named:  differences are named: `$root` is each runtime's root id, and the TS driver skips a case
          BY NAME (cases.json:3; ts c21_conformance.test.ts:48-63).
Ids and values are illustrative where the sheet says so; shapes, field names and verbs are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"replay": "Replay", "legs": "Legs", "named": "Named"}
OG = "replay"

RUNTIMES = [("Python", BLUE), ("Rust", AMBER), ("TS", VIOLET)]


def case_card(name, send, expect, x=-3.7, y=0.35):
    box = card(6.2, 2.5, stroke=CYAN, fill="#101a33").move_to([x, y, 0])
    head = mono("cases.json", size=17, color=DIM).next_to(box, UP, buff=0.14).align_to(box, LEFT).shift(RIGHT * 0.06)
    n = mono(name, size=24, color=CYAN, weight=BOLD)
    s = mono("send    " + send, size=19)
    e = mono("expect  " + expect, size=19, color=GREEN)
    g = VGroup(n, s, e).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to(box)
    return VGroup(box, g), head, g


class Replay(FScene):
    """One file of cases; every runtime sends them to its own kernel and gets the expected reply."""

    TITLE = "One file of cases, every runtime"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.say("The cases are data: a send, and what the reply must hold.")
        box, head, g = case_card("custom-verb", '{"type": "poke", "value": 41}', '{"poked": 41}')
        self.play(FadeIn(box), FadeIn(head), run_time=0.5)

        ys = [1.2, 0.0, -1.2]
        nodes = []
        for (name, c), y in zip(RUNTIMES, ys):
            nodes.append(Node(name, w=1.7, color=c).move_to([1.5, y, 0]))
        self.say("Each runtime sends every case to its own kernel.", wait=0.2)
        self.play(*[FadeIn(n) for n in nodes], run_time=0.5)
        arrows = [Arrow(box[0].get_right() + [0, 0, 0], n.get_left(), buff=0.12, color=MUTED, stroke_width=2.4,
                        max_tip_length_to_length_ratio=0.12) for n in nodes]
        self.play(*[Create(a) for a in arrows], run_time=0.6)

        self.say("Each reply must hold what the case expects.")
        replies = [pill('{"poked": 41}', color=GREEN, size=18).move_to([4.95, y, 0]) for y in ys]
        self.play(*[FadeIn(r, shift=LEFT * 0.1) for r in replies], *[n.tinted(GREEN, 0.25) for n in nodes], run_time=0.6)
        self.wait(0.5)

        # second case: a refusal is part of the contract too
        self.say("Refusals are cases too: a reason, not prose.")
        self.play(FadeOut(VGroup(*replies)), run_time=0.3)
        g2 = VGroup(
            mono("unknown-agent", size=24, color=CYAN, weight=BOLD),
            mono('send    {"type": "reflect"} to c21_nobody', size=17),
            mono('expect  {"reason": "unknown_agent"}', size=19, color=GREEN),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to(box[0])
        self.play(FadeOut(g), FadeIn(g2), run_time=0.4)
        replies2 = [pill('reason: unknown_agent', color=GREEN, size=17).move_to([4.9, y, 0]) for y in ys]
        self.play(*[FadeIn(r, shift=LEFT * 0.1) for r in replies2], run_time=0.5)
        self.say("Same case, same answer, in Python, Rust and TS.", wait=0.2, color=INK)
        self.finish()


class Legs(FScene):
    """Python also sends each case down five transports and diffs every reply with the in-proc reply."""

    TITLE = "Five transports, one answer"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        legs = ["in-proc", "ws-bridge", "web-rest", "exec-guest", "relay-tunnel"]
        ys = [1.55, 0.7, -0.15, -1.0, -1.85]
        self.say("Python replays the cases on five legs of one kernel.")
        nodes = [Node(n, w=2.7, color=(AMBER if i == 0 else BLUE), size=20).move_to([-4.3, y, 0])
                 for i, (n, y) in enumerate(zip(legs, ys))]
        self.play(*[FadeIn(n) for n in nodes], run_time=0.6)

        self.say("Every reply is a JSON round trip, so wires compare equally.", wait=0.2)
        replies = [pill('{"poked": 41}', color=CYAN, size=18).move_to([0.9, y, 0]) for y in ys]
        self.play(*[FadeIn(r, shift=LEFT * 0.1) for r in replies], run_time=0.5)

        self.say("Each leg is diffed with the in-proc reply.")
        tags = [mono("reference", size=18, color=AMBER).move_to([4.6, ys[0], 0])]
        tags += [mono("= in-proc", size=18, color=GREEN).move_to([4.6, y, 0]) for y in ys[1:]]
        self.play(*[FadeIn(t) for t in tags], *[n.tinted(GREEN, 0.25) for n in nodes[1:]], run_time=0.6)
        self.wait(0.4)

        self.say("A reply that depends on the viewer is checked for shape only.")
        ledger = [pill('{"executions": [...], "next": ...}', color=CYAN, size=15).move_to([0.9, y, 0]) for y in ys]
        shape = [mono("pairwise: false", size=17, color=AMBER).move_to([4.8, y, 0]) for y in ys]
        self.play(*[ReplacementTransform(a, b) for a, b in zip(replies, ledger)],
                  *[ReplacementTransform(a, b) for a, b in zip(tags, shape)], run_time=0.7)
        self.say("ledger is scoped to the sender, so its legs differ by design.", wait=0.3, color=INK)
        self.finish()


class Named(FScene):
    """Differences between runtimes are written down: a placeholder, and a skip by name."""

    TITLE = "Differences are named"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.say("A case can name the runtime's own value: $root.")
        box, head, g = case_card("reflect-kernel", '{"type": "reflect"} to kernel', '{"id": "$root"}')
        self.play(FadeIn(box), FadeIn(head), run_time=0.5)
        ys = [1.2, 0.0, -1.2]
        nodes = [Node(n, w=1.7, color=c).move_to([1.5, y, 0]) for (n, c), y in zip(RUNTIMES, ys)]
        self.play(*[FadeIn(n) for n in nodes], run_time=0.5)
        self.say("Each driver swaps in its own root id before it compares.", wait=0.2)
        roots = [pill('{"id": "kernel_state"}', color=GREEN, size=17).move_to([4.9, y, 0]) for y in ys]
        self.play(*[FadeIn(r, shift=LEFT * 0.1) for r in roots], run_time=0.6)
        self.wait(0.4)

        self.say("A runtime that does not own a verb skips the case by name.")
        g2 = VGroup(
            mono("list-agents-limited", size=22, color=CYAN, weight=BOLD),
            mono('send    {"type": "list_agents", "limit": 2}', size=16),
            mono('expect  keys: agents, next', size=19, color=GREEN),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to(box[0])
        self.play(FadeOut(g), FadeOut(VGroup(*roots)), FadeIn(g2), run_time=0.5)
        res = [pill("passes", color=GREEN, size=18).move_to([4.9, ys[0], 0]),
               pill("passes", color=GREEN, size=18).move_to([4.9, ys[1], 0]),
               pill("skipped, named", color=AMBER, size=18).move_to([4.9, ys[2], 0])]
        self.play(*[FadeIn(r) for r in res], run_time=0.5)
        self.say("Anything not named must pass.", wait=0.2, color=INK)
        self.finish()
