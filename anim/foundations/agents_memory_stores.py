"""Foundations — Agents › Memory stores. 4 clips, each one mechanism.

owners:  rows are keyed (owner, id), the owner is the caller; an `owner` argument is ignored —
         ram_store lib.rs:6-11, 428-440; contract/memory_store/cases.json:6-25 (facts 2, 3, 5).
cascade: a fold row's refs shrink as its members are pruned; the fold stays with refs [] —
         sqlite_store lib.rs:64-90; ram_store lib.rs:234-277; cases.json:46-57 (facts 9, 10, 12).
file:    sqlite_store keeps one file at `path`; a stop checkpoints and keeps it, delete_agent
         removes the file with its -wal and -shm — sqlite_store lib.rs:609-624, 1110-1126 (facts 25, 26).
choose:  the root and each AI agent name their store in memory_store_id; the CLI blueprint wires a
         ram_store for the kernel and a sqlite_store for AI agents — blueprint.yaml:35-50, 62-70 (facts 27, 31).
Ids and agent names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"owners": "Owners", "cascade": "Cascade", "file": "OneFile", "choose": "Choose"}
OG = "cascade"


def cell(label, color=BLUE, w=0.8, h=0.56, size=20):
    return Node(str(label), w=w, h=h, color=color, size=size)


class Owners(FScene):
    """Rows are keyed (owner, id); the owner is whoever called."""

    TITLE = "Rows are keyed by who wrote them"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        box = card(8.0, 3.3, stroke=LINE).move_to([2.2, -0.2, 0])
        tag = mono("one store", 17, DIM).next_to(box, UP, buff=0.12).align_to(box, LEFT)
        ya, yb = 0.45, -0.85
        la = mono("g1|alice", 20, BLUE).move_to([-0.7, ya, 0])
        lb = mono("g1|bob", 20, GREEN).move_to([-0.7, yb, 0])
        la.align_to([-1.5, 0, 0], LEFT)
        lb.align_to([-1.5, 0, 0], LEFT)
        alice = Node("alice", w=1.5, color=BLUE).move_to([-5.4, ya, 0])
        bob = Node("bob", w=1.5, color=GREEN).move_to([-5.4, yb, 0])
        self.play(FadeIn(box), FadeIn(tag), FadeIn(la), FadeIn(lb), FadeIn(alice), FadeIn(bob), run_time=0.6)

        def land(who, y, color, label, x):
            c = cell(label, color).move_to([x, y, 0])
            self.play(FadeIn(c, shift=RIGHT * 0.2), run_time=0.4)
            return c

        self.say("alice appends row 101. It lands under her key.")
        m = pill('append {id: 101}', BLUE, 18).next_to(alice, UP, buff=0.3).set_x(-4.9)
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.3)
        a1 = land(alice, ya, BLUE, "101", 1.3)
        self.play(FadeOut(m), run_time=0.2)

        self.say("bob appends 101 too. Another owner, so no clash.")
        m = pill('append {id: 101}', GREEN, 18).next_to(bob, DOWN, buff=0.3).set_x(-4.9)
        self.play(FadeIn(m, shift=DOWN * 0.1), run_time=0.3)
        b1 = land(bob, yb, GREEN, "101", 1.3)
        self.play(FadeOut(m), run_time=0.2)

        self.say("An owner field in the payload is ignored.")
        m = pill('append {owner: "g1|bob", id: 5}', AMBER, 18).move_to([-3.6, 2.0, 0])
        self.play(FadeIn(m, shift=DOWN * 0.1), run_time=0.3)
        a2 = land(alice, ya, BLUE, "5", 2.3)
        self.play(a2.animate.scale(1.0), run_time=0.1)
        self.wait(0.4)
        self.play(FadeOut(m), run_time=0.2)

        self.say("Each caller reads only its own rows.")
        hi = SurroundingRectangle(VGroup(la, a1, a2), color=BLUE, buff=0.18, stroke_width=3)
        self.play(Create(hi), b1.animate.set_opacity(0.35), lb.animate.set_opacity(0.35), run_time=0.5)
        self.finish()


class Cascade(FScene):
    """Pruning a member removes it from the fold's refs; the fold row stays."""

    TITLE = "Prune cascades to fold refs"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c1 = cell("1").move_to([-4.2, -0.9, 0])
        c2 = cell("2").move_to([-2.6, -0.9, 0])
        f3 = Node("3  fold", w=1.6, h=0.62, color=VIOLET, size=20).move_to([-3.4, 0.8, 0])
        n4 = cell("4 note", color=CYAN, w=1.5).move_to([-0.3, -0.9, 0])
        l1 = Line(f3.get_bottom() + LEFT * 0.4, c1.get_top(), color=VIOLET, stroke_width=2.4)
        l2 = Line(f3.get_bottom() + RIGHT * 0.4, c2.get_top(), color=VIOLET, stroke_width=2.4)
        refs = mono("refs: [1, 2]", 24, VIOLET).move_to([3.6, 0.8, 0])
        cap = mono("fold_refs rows, FK ON DELETE CASCADE", 17, DIM).move_to([3.6, 1.45, 0])

        self.say("A fold row names its members in refs.")
        self.play(LaggedStart(FadeIn(c1), FadeIn(c2), FadeIn(n4), FadeIn(f3), lag_ratio=0.2), run_time=1.0)
        self.play(Create(l1), Create(l2), FadeIn(refs), FadeIn(cap), run_time=0.6)
        self.wait(0.4)

        self.say("prune {before_id: 2} deletes row 1. The ref goes with it.")
        p = pill("pruned: 1", GREEN, 18).move_to([3.6, -0.3, 0])
        self.play(c1.animate.set_opacity(0.15), l1.animate.set_stroke(RED), FadeIn(p, shift=UP * 0.1), run_time=0.5)
        r2 = mono("refs: [2]", 24, VIOLET).move_to(refs)
        self.play(FadeOut(c1), FadeOut(l1), FadeTransform(refs, r2), run_time=0.5)
        self.wait(0.4)

        self.say("prune {ids: [2]} deletes row 2. The fold stays, with refs [].")
        p2 = pill("pruned: 1", GREEN, 18).move_to(p)
        self.play(c2.animate.set_opacity(0.15), l2.animate.set_stroke(RED), run_time=0.4)
        r3 = mono("refs: []", 24, VIOLET).move_to(refs)
        self.play(FadeOut(c2), FadeOut(l2), FadeTransform(r2, r3), FadeTransform(p, p2), run_time=0.5)
        self.play(Indicate(f3, color=VIOLET, scale_factor=1.06), run_time=0.5)
        self.finish()


class OneFile(FScene):
    """sqlite_store keeps one file; a stop keeps it, delete_agent removes it."""

    TITLE = "One file per store"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        def files(x):
            g = VGroup(
                Node("memory.db", w=3.4, h=0.56, color=GREEN, size=19),
                Node("memory.db-wal", w=3.4, h=0.56, color=AMBER, size=19),
                Node("memory.db-shm", w=3.4, h=0.56, color=AMBER, size=19),
            ).arrange(DOWN, buff=0.18)
            return g.move_to([x, 0.15, 0])

        left, right = files(-3.4), files(3.4)
        tl = txt("kernel stop", 24, INK).move_to([-3.4, 1.75, 0])
        tr = txt("delete_agent", 24, INK).move_to([3.4, 1.75, 0])
        path = mono('path: ".fantastic/memory.db"', 20, CYAN).move_to([0, 1.1, 0])
        path.move_to([0, -1.55, 0])

        self.say("An open sqlite_store is the file at its path, in WAL mode.")
        self.play(FadeIn(left), FadeIn(right), FadeIn(tl), FadeIn(tr), FadeIn(path), run_time=0.7)
        self.wait(0.4)

        self.say("A kernel stop folds the WAL into the file and keeps it.")
        kept = pill("kept", GREEN, 18).next_to(left[0], RIGHT, buff=0.25)
        self.play(FadeOut(left[1]), FadeOut(left[2]), FadeIn(kept), run_time=0.6)
        self.wait(0.3)

        self.say("delete_agent removes the file with its -wal and -shm.")
        gone = pill("gone", RED, 18).move_to([3.4, 0.15, 0])
        self.play(*[g.animate.set_opacity(0.18) for g in right], run_time=0.4)
        self.play(FadeOut(right), FadeIn(gone), run_time=0.4)
        self.finish()


class Choose(FScene):
    """Which store is used is the record's field: memory_store_id."""

    TITLE = "Which store is configuration"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        root = Node("kernel root", w=2.4, color=BLUE).move_to([-4.6, 0.9, 0])
        ai = Node("helper (AI agent)", w=3.6, color=VIOLET).move_to([-4.6, -1.0, 0])
        ram = Node("kernel_memory", w=2.9, color=AMBER).move_to([2.2, 0.9, 0])
        sql = Node("memory", w=2.9, color=GREEN).move_to([2.2, -1.0, 0])
        rk = mono("ram_store", 17, DIM).next_to(ram, DOWN, buff=0.1)
        sk = mono("sqlite_store", 17, DIM).next_to(sql, DOWN, buff=0.1)

        def link(a, b, label, color):
            ar = Arrow(a.get_right(), b.get_left(), buff=0.12, color=color, stroke_width=3, max_tip_length_to_length_ratio=0.12)
            t = mono(label, 18, color).next_to(ar, UP, buff=0.08)
            return VGroup(ar, t)

        l1 = link(root, ram, "memory_store_id", AMBER)
        l2 = link(ai, sql, "memory_store_id", GREEN)

        self.say("The root names the kernel's store in memory_store_id.")
        self.play(FadeIn(root), FadeIn(ram), FadeIn(rk), run_time=0.5)
        self.play(FadeIn(l1), run_time=0.5)

        self.say("Each AI agent names its own. Nothing falls back to RAM.")
        self.play(FadeIn(ai), FadeIn(sql), FadeIn(sk), run_time=0.5)
        self.play(FadeIn(l2), run_time=0.5)
        self.wait(0.4)

        self.say("Same verbs on both. After a restart only the file has rows.")
        a = pill("RAM: empty", AMBER, 18).next_to(rk, DOWN, buff=0.15)
        s = pill("file: rows read back", GREEN, 18).next_to(sk, DOWN, buff=0.15)
        self.play(ram.animate.set_opacity(0.4), FadeIn(a, shift=UP * 0.1), run_time=0.5)
        self.play(FadeIn(s, shift=UP * 0.1), Indicate(sql, color=GREEN, scale_factor=1.05), run_time=0.5)
        self.finish()
