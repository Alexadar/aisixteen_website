"""Foundations — Agents › File agent. 3 clips, each one mechanism.

text  - read returns numbered lines and a version; write with if_match refuses a changed file
        (R/text.rs:243-307 read, 103-113 version, 166-179 mismatch, 310-347 write).
edit  - edit verifies every hunk of every file first; one failing hunk writes nothing
        (R/text.rs:664-700, R/lib.rs:1109-1118).
watch - watch_path emits changed {path, kind} on the bridge's inbox: added, modified, deleted
        (R/watch.rs:36-100, 455-465).
R = src/lib/rust/crates/bundles/fantastic-file/src on fantastic main. Ids, hashes and file
names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"text": "TextVersion", "edit": "EditTransaction", "watch": "WatchPath"}
OG = "text"


def lines_group(rows, size=18, buff=0.16):
    """A left-aligned block of mono lines; rows are (text, colour)."""
    return VGroup(*[mono(t, size, c) for t, c in rows]).arrange(DOWN, aligned_edge=LEFT, buff=buff)


class TextVersion(FScene):
    """read gives a version; write with if_match refuses a document that has changed."""

    TITLE = "read, then write only if unchanged"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        c, t = panel("notes.md on disk", 6.0, 3.0, -3.6, y=-0.15)
        l1 = mono("1  # Plan", 20, INK)
        l2 = mono("2  ship friday", 20, INK)
        l3 = mono("3  demo", 20, INK)
        body = VGroup(l1, l2, l3).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        body.move_to(c).align_to(c, LEFT).shift(RIGHT * 0.4 + UP * 0.45)
        ver = mono("version 5e0b94a1c2d7f3a8", 18, AMBER).move_to(c).align_to(c, LEFT).shift(RIGHT * 0.4 + DOWN * 1.05)
        self.say("read returns numbered lines and a version: a hash of the file.")
        self.play(FadeIn(c), FadeIn(t), FadeIn(body), FadeIn(ver), run_time=0.7)

        q = pill('read {path: "notes.md"}', CYAN, 18).move_to([3.4, 1.5, 0])
        self.play(FadeIn(q, shift=LEFT * 0.1), run_time=0.4)
        held = pill("you hold 5e0b…", AMBER, 18).move_to([3.4, 0.5, 0])
        self.play(FadeIn(held, shift=DOWN * 0.1), run_time=0.5)
        self.wait(0.5)

        self.say("Another writer changes the file, so its version changes.")
        l2n = mono("2  ship monday", 20, INK).move_to(l2).align_to(l2, LEFT)
        vern = mono("version c41d02e7b9a6f358", 18, AMBER).move_to(ver).align_to(ver, LEFT)
        self.play(Transform(l2, l2n), Transform(ver, vern), l2n.animate.set_color(AMBER), run_time=0.6)
        self.play(Indicate(ver, color=AMBER, scale_factor=1.05), run_time=0.5)
        self.wait(0.3)

        self.say("write with if_match is checked against the file as it is now.")
        w = pill('write {if_match: "5e0b…"}', CYAN, 18).move_to([3.4, -0.7, 0])
        self.play(FadeIn(w, shift=LEFT * 0.1), run_time=0.4)
        no = pill("version_mismatch: nothing written", RED, 18).move_to([3.4, -1.55, 0])
        self.play(w.animate.set_color(RED), FadeIn(no, shift=UP * 0.1), run_time=0.5)
        self.wait(0.9)

        self.say("Read again, then write with the new version: it lands.")
        self.play(FadeOut(w), FadeOut(no), FadeOut(held), FadeOut(q), run_time=0.4)
        q2 = pill("read -> c41d…", CYAN, 18).move_to([3.4, 1.5, 0])
        w2 = pill('write {if_match: "c41d…"}', GREEN, 18).move_to([3.4, 0.5, 0])
        self.play(FadeIn(q2), run_time=0.3)
        self.play(FadeIn(w2, shift=LEFT * 0.1), run_time=0.4)
        l3n = mono("3  demo, then retro", 20, GREEN).move_to(l3).align_to(l3, LEFT)
        vern2 = mono("version 7a2f19d0e45b8c63", 18, GREEN).move_to(ver).align_to(ver, LEFT)
        self.play(Transform(l3, l3n), Transform(ver, vern2), run_time=0.6)
        ok = pill("{path, size, version}", GREEN, 18).move_to([3.4, -0.55, 0])
        self.play(FadeIn(ok, shift=UP * 0.1), run_time=0.4)
        self.finish(2.2)


class EditTransaction(FScene):
    """edit checks every hunk of every file before it writes anything."""

    TITLE = "edit: every hunk, or nothing"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        c, t = panel("edit: the patch in bytes", 6.4, 2.3, -3.5, y=0.7)
        r1 = mono("hunk 1  a.py  timeout = 5", 18, INK)
        r2 = mono("hunk 2  b.py  retries = 3", 18, INK)
        rows = VGroup(r1, r2).arrange(DOWN, aligned_edge=LEFT, buff=0.35)
        rows.move_to(c).align_to(c, LEFT).shift(RIGHT * 0.4)
        self.say("edit lists the files and one patch. Each SEARCH must match once.")
        self.play(FadeIn(c), FadeIn(t), FadeIn(rows), run_time=0.7)

        a = Node("a.py", w=1.7, color=BLUE).move_to([2.6, 1.3, 0])
        b = Node("b.py", w=1.7, color=BLUE).move_to([2.6, 0.1, 0])
        self.play(FadeIn(a), FadeIn(b), run_time=0.5)

        self.say("Every hunk is checked against its file before anything is written.")
        ok1 = pill("matches once", GREEN, 18).next_to(a, RIGHT, buff=0.35)
        self.play(FadeIn(ok1, shift=RIGHT * 0.1), a.tinted(GREEN, 0.25), run_time=0.5)
        bad = pill("no_match", RED, 18).next_to(b, RIGHT, buff=0.35)
        self.play(FadeIn(bad, shift=RIGHT * 0.1), b.tinted(RED, 0.25), run_time=0.5)
        self.wait(0.4)

        self.say("One hunk fails, so nothing is written, in any file.")
        res = pill("a hunk did not apply: nothing written", RED, 18).move_to([0, -1.55, 0])
        self.play(FadeIn(res, shift=UP * 0.1), run_time=0.5)
        same = mono("a.py and b.py are unchanged", 18, MUTED).move_to([0, -2.2, 0])
        self.play(FadeIn(same), a.tinted(BLUE, 0.16), run_time=0.5)
        self.wait(0.9)

        self.say("Fix the search text: both files land together.")
        self.play(FadeOut(res), FadeOut(same), FadeOut(bad), FadeOut(ok1), run_time=0.4)
        fixed = mono("hunk 2  b.py  retries = 4", 18, GREEN).move_to(r2).align_to(r2, LEFT)
        self.play(Transform(r2, fixed), run_time=0.5)
        o1 = pill("written", GREEN, 18).next_to(a, RIGHT, buff=0.35)
        o2 = pill("written", GREEN, 18).next_to(b, RIGHT, buff=0.35)
        self.play(a.tinted(GREEN, 0.3), b.tinted(GREEN, 0.3), FadeIn(o1), FadeIn(o2), run_time=0.6)
        done = pill("{edited: true, edits: [a.py, b.py]}", GREEN, 18).move_to([0, -1.55, 0])
        self.play(FadeIn(done, shift=UP * 0.1), run_time=0.5)
        self.finish(2.2)


class WatchPath(FScene):
    """watch_path turns every change on disk into one changed event with a kind."""

    TITLE = "watch_path: changes arrive as events"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)

        c, t = panel("docs/ on disk", 3.8, 3.1, -4.7, y=-0.1)
        e1 = mono("a.md", 20, INK)
        e2 = mono("b.md", 20, INK)
        ents = VGroup(e1, e2).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        ents.move_to(c).align_to(c, LEFT).shift(RIGHT * 0.5 + UP * 0.5)
        files = Node("file_bridge", w=2.1, color=BLUE).move_to([-0.9, 1.0, 0])
        ic, it = panel("inbox of file_bridge: changed", 4.6, 3.1, 4.4, y=-0.1)
        self.say("watch_path puts an exposed folder under a disk watcher.")
        self.play(FadeIn(c), FadeIn(t), FadeIn(ents), FadeIn(files), FadeIn(ic), FadeIn(it), run_time=0.8)
        wp = pill('watch_path {path: "docs"}', CYAN, 17).move_to([-0.9, 2.0, 0])
        self.play(FadeIn(wp, shift=DOWN * 0.1), run_time=0.4)
        self.play(files.tinted(CYAN, 0.28), run_time=0.4)
        self.wait(0.3)

        def event(text, color, y):
            return mono(text, 18, color).move_to([ic.get_left()[0] + 0.35, y, 0], aligned_edge=LEFT)

        self.say("a.md grows: the same file, a new size. One event, kind modified.")
        self.play(Indicate(e1, color=AMBER, scale_factor=1.15), run_time=0.6)
        ev1 = event("docs/a.md    modified", AMBER, 0.7)
        self.play(FadeIn(ev1, shift=LEFT * 0.15), run_time=0.5)
        self.wait(0.3)

        self.say("Another process adds c.md. Any writer counts.")
        e3 = mono("c.md", 20, GREEN).next_to(e2, DOWN, buff=0.3).align_to(e2, LEFT)
        self.play(FadeIn(e3, shift=DOWN * 0.1), run_time=0.5)
        ev2 = event("docs/c.md    added", GREEN, 0.0)
        self.play(FadeIn(ev2, shift=LEFT * 0.15), run_time=0.5)
        self.wait(0.3)

        self.say("b.md is deleted: the kind is deleted.")
        self.play(e2.animate.set_color(RED), run_time=0.4)
        self.play(FadeOut(e2), run_time=0.4)
        ev3 = event("docs/b.md    deleted", RED, -0.7)
        self.play(FadeIn(ev3, shift=LEFT * 0.15), run_time=0.5)
        self.finish(2.2)
