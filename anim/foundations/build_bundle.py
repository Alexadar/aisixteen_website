"""Foundations — Build your own › A bundle. 4 clips, one mechanism each.

twin:   one handler_module, two files: Python entry point + VERBS/handler, Rust register + impl Bundle
        (scheduler pyproject.toml:13-17, tools.py:514-532; fantastic-cli main.rs:115, scheduler lib.rs:210-261).
docs:   the verb table becomes `docs` oneliners; reflect carries no verbs
        (_docs.py:30-47, 86-98; bundle.rs:118-122; test_scheduler.py:50-65).
record: validate_meta(meta, record) judges the state a write would make, at create and update
        (bundle.rs:80-92; lifecycle.rs:235; kernel.rs:389; static_loader tools.py:88-99).
checks: unknown verb -> unhandled (contract unknown-verb), the bundle's tests, the parity diff
        (cases.json:44-52; e2e/parity bundle_verbs.py:187-198; CONTRIBUTING.md:33-48).
Ids are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"twin": "BTwin", "docs": "BDocs", "record": "BRecord", "checks": "BChecks"}
OG = "twin"


def arrow(a, b, color=CYAN):
    return Arrow(a, b, buff=0.1, color=color, stroke_width=3, max_tip_length_to_length_ratio=0.2)


class BTwin(FScene):
    """One handler_module, two files that answer it."""

    TITLE = "One bundle, a file in each runtime"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        py_reg = pill("pyproject.toml: fantastic.bundles", AMBER, 18).move_to([-3.4, 1.5, 0])
        py_code = Node("tools.py: VERBS + handler()", w=4.6, color=BLUE, size=19).move_to([-3.4, 0.4, 0])
        self.say("Python: publish the module as an entry point, then write handler().")
        self.play(FadeIn(py_reg), FadeIn(py_code), run_time=0.7)
        self.wait(0.3)

        rs_reg = pill("main.rs: reg.register(...)", AMBER, 18).move_to([-3.4, -0.9, 0])
        rs_code = Node("lib.rs: impl Bundle, handle()", w=5.0, color=BLUE, size=19).move_to([-3.4, -2.0, 0])
        self.say("Rust: implement Bundle, then register the crate.")
        self.play(FadeIn(rs_reg), FadeIn(rs_code), run_time=0.7)
        self.wait(0.3)

        hm = Node("scheduler.tools", w=3.2, color=GREEN, size=22).move_to([3.6, -0.3, 0])
        a1 = arrow(py_code.get_right(), hm.get_left() + UP * 0.2, GREEN)
        a2 = arrow(rs_code.get_right(), hm.get_left() + DOWN * 0.2, GREEN)
        self.say("Both answer to the same handler_module.")
        self.play(FadeIn(hm), Create(a1), Create(a2), run_time=0.8)
        verbs = mono("schedule  list  pause  history ...", 18, INK).next_to(hm, DOWN, buff=0.55)
        self.play(FadeIn(verbs), hm.tinted(GREEN, 0.3), run_time=0.5)
        self.say("Same verbs, one set of docs.", wait=0.3)
        self.finish()


class BDocs(FScene):
    """The verb table is the verb docs; reflect does not carry them."""

    TITLE = "Verbs and their docs"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c, t = panel("VERBS (Python)  /  verb_docs() (Rust)", 5.6, 2.5, -3.6, y=0.3)
        rows = VGroup(
            mono('"schedule": "args: target, ..."', 17, INK),
            mono('"pause": "args: schedule_id?. ..."', 17, INK),
            mono('"history": "args: limit? ..."', 17, INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.22).move_to(c)
        self.say("Each verb has one doc, written once in the bundle.")
        self.play(FadeIn(c), FadeIn(t), FadeIn(rows), run_time=0.7)
        self.wait(0.4)

        req = pill('{"type": "docs", "of": "sched1"}', CYAN, 18).move_to([3.4, 1.9, 0])
        out = VGroup(
            mono("schedule: args: target ...", 17, GREEN),
            mono("pause: args: schedule_id? ...", 17, GREEN),
            mono("history: args: limit? ...", 17, GREEN),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        oc = card(out.width + 0.6, out.height + 0.5, stroke=GREEN).move_to([3.4, 0.3, 0])
        out.move_to(oc)
        self.say("docs serves each doc cut short (shortened here).")
        self.play(FadeIn(req, shift=DOWN * 0.1), run_time=0.4)
        self.play(FadeIn(oc), FadeIn(out), run_time=0.6)
        self.wait(0.4)

        rq = pill('{"type": "reflect"}', CYAN, 18).move_to([-3.6, -2.0, 0])
        rr = pill("no verbs, no emits", RED, 18).move_to([2.2, -2.0, 0])
        ar = arrow(rq.get_right(), rr.get_left(), RED)
        self.say("A reflect says what the agent is, not how to call it.")
        self.play(FadeIn(rq), Create(ar), FadeIn(rr), run_time=0.8)
        self.finish()


class BRecord(FScene):
    """validate_meta judges the record a write would produce."""

    TITLE = "validate_meta judges the record"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        rec = VGroup(mono("record (now)", 16, DIM), mono("manifest: fantastic.yaml", 19, AMBER)).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
        rc = card(rec.width + 0.5, rec.height + 0.4, stroke=AMBER, fill=AMBER, opacity=0.1).move_to([-4.6, 1.3, 0])
        rec.move_to(rc)
        self.say("A write names a patch. The bundle sees the patch and the record.")
        self.play(FadeIn(VGroup(rc, rec)), run_time=0.5)

        vm = Node("validate_meta(meta, record)", w=4.6, color=BLUE, size=19).move_to([1.0, 1.3, 0])
        p1 = pill('update_agent  manifest: ""', CYAN, 18).move_to([-3.4, -0.4, 0])
        a1 = arrow(p1.get_top(), vm.get_bottom() + LEFT * 1.4, CYAN)
        self.play(FadeIn(vm), FadeIn(p1), Create(a1), run_time=0.7)
        no = pill("invalid_meta: manifest must be a non-empty path string", RED, 17).move_to([1.0, -1.7, 0])
        a2 = arrow(vm.get_bottom() + RIGHT * 1.0, no.get_top(), RED)
        self.say("An empty path is refused before the record changes.")
        self.play(Create(a2), FadeIn(no), vm.tinted(RED, 0.25), run_time=0.7)
        self.wait(0.6)

        p2 = pill('update_agent  manifest: "team.yaml"', CYAN, 18).move_to([-3.2, -0.4, 0])
        ok = pill("accepted: the record changes", GREEN, 18).move_to([1.0, -1.7, 0])
        self.say("A non-empty path passes, on create as on update.")
        self.play(FadeOut(a2), FadeOut(no), FadeOut(p1), FadeOut(a1), vm.tinted(BLUE, 0.16), run_time=0.4)
        a3 = arrow(p2.get_top(), vm.get_bottom() + LEFT * 1.4, CYAN)
        a4 = arrow(vm.get_bottom() + RIGHT * 1.0, ok.get_top(), GREEN)
        self.play(FadeIn(p2), Create(a3), run_time=0.5)
        self.play(Create(a4), FadeIn(ok), vm.tinted(GREEN, 0.25), run_time=0.7)
        self.finish()


class BChecks(FScene):
    """What a new bundle is held to before it ships."""

    TITLE = "Three checks for a new bundle"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        b = Node("tally.tools", w=2.8, color=BLUE, size=22).move_to([-4.4, 0.3, 0])
        self.say("A new bundle meets three checks.")
        self.play(FadeIn(b), run_time=0.4)

        rows = [
            ("unknown verb answers unhandled", "contract unknown-verb case; scheduler parity case"),
            ("its own tests pass in each runtime it ships in", "py tests/, rust tests.rs"),
            ("Rust diffs clean against Python", "e2e/parity bundle_verbs"),
        ]
        ys = [1.5, 0.3, -0.9]
        last = []
        for (what, where), y in zip(rows, ys):
            p = pill(what, GREEN, 18).move_to([1.6, y, 0])
            w = mono(where, 15, DIM).next_to(p, DOWN, buff=0.08)
            a = arrow(b.get_right(), p.get_left(), GREEN)
            last.append((p, w, a))
        self.say("An unknown verb is answered with unhandled.")
        self.play(Create(last[0][2]), FadeIn(last[0][0]), FadeIn(last[0][1]), run_time=0.8)
        self.say("Its own tests run in the language it is written in.")
        self.play(Create(last[1][2]), FadeIn(last[1][0]), FadeIn(last[1][1]), run_time=0.8)
        self.say("A twin is diffed against Python, the reference.")
        self.play(Create(last[2][2]), FadeIn(last[2][0]), FadeIn(last[2][1]), run_time=0.8)
        self.play(b.tinted(GREEN, 0.3), run_time=0.4)
        self.finish()
