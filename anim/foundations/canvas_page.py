"""Foundations — Canvas › Canvas page. 3 clips, each one mechanism.

embed: build.rs runs pack.sh -> canvas.zip (readme.md, bundle.min.js, bundle.min.js.map) ->
       include_bytes! into the binary; a failed pack fails the build
       (src/tui/bundles/fantastic-canvas-page/build.rs:1-40; lib.rs:29).
serve: GET /canvas_page/file/index.html; web sends read_stream as itself (both grants in
       kern/web.rs:331-335); canvas_page answers head + bytes, or not_found (lib.rs:75-95).
boot:  the page kernel's reflect through user.forward; unauthorized stops it; pick a canvas,
       load records, boot the root, mount (web/canvas/src/main.ts:118-223; user_bridge.ts:23-26).
Ids are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"embed": "Embed", "serve": "Serve", "boot": "Boot"}
OG = "serve"


class Embed(FScene):
    """build.rs packs the page and embeds it."""

    TITLE = "Packed at build, embedded in the binary"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.3
        app = Node("canvas app", w=2.3, h=0.9, color=BLUE, size=22).move_to([-5.0, Y, 0])
        zipn = Node("canvas.zip", w=2.3, h=0.9, color=AMBER, size=22).move_to([-0.6, Y, 0])
        binn = Node("binary", w=2.0, h=0.9, color=GREEN, size=24).move_to([4.6, Y, 0])
        a1 = Arrow(app.get_right(), zipn.get_left(), buff=0.1, color=CYAN, stroke_width=3)
        a2 = Arrow(zipn.get_right(), binn.get_left(), buff=0.1, color=CYAN, stroke_width=3)

        self.say("build.rs runs pack.sh over the canvas app.")
        self.play(FadeIn(app), run_time=0.4)
        l1 = pill("pack.sh", color=CYAN, size=19).next_to(a1, UP, buff=0.15)
        self.play(Create(a1), FadeIn(l1), run_time=0.5)
        self.play(FadeIn(zipn), run_time=0.4)
        entries = VGroup(
            mono("readme.md", 19, MUTED), mono("bundle.min.js", 19, MUTED), mono("bundle.min.js.map", 19, MUTED)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.14).next_to(zipn, DOWN, buff=0.45)
        self.say("One zip, three entries. The whole page is one file.")
        self.play(FadeIn(entries, shift=UP * 0.1), run_time=0.6)
        self.wait(0.3)

        self.say("include_bytes! puts the zip inside the binary.")
        l2 = pill("include_bytes!", color=CYAN, size=19).next_to(a2, UP, buff=0.15)
        self.play(Create(a2), FadeIn(l2), run_time=0.5)
        self.play(FadeIn(binn), run_time=0.4)
        self.play(binn.tinted(GREEN, 0.3), run_time=0.3)
        note = mono("a failed pack fails the build", 20, RED).move_to([0, -2.4, 0])
        self.play(FadeIn(note, shift=UP * 0.1), run_time=0.4)
        self.finish()


class Serve(FScene):
    """web reads as itself; canvas_page answers read_stream."""

    TITLE = "Serving it: the web host reads as itself"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.4
        br = Node("browser", w=1.9, h=0.9, color=DIM, size=22).move_to([-5.3, Y, 0])
        web = Node("web", w=1.5, h=0.9, color=BLUE, size=24).move_to([-1.2, Y, 0])
        cp = Node("canvas_page", w=2.5, h=0.9, color=BLUE, size=22).move_to([4.2, Y, 0])
        l1 = Line(br.get_right(), web.get_left(), color=LINE, stroke_width=3)
        l2 = Line(web.get_right(), cp.get_left(), color=LINE, stroke_width=3)

        self.say("A browser asks web for the page.")
        self.play(FadeIn(br), FadeIn(web), FadeIn(cp), Create(l1), Create(l2), run_time=0.7)
        req = pill("GET /canvas_page/file/index.html", color=CYAN, size=17).move_to([-3.3, Y + 1.0, 0])
        self.play(FadeIn(req), run_time=0.3)
        self.play(req.animate.move_to([-3.3, Y + 1.0, 0]), run_time=0.2)
        self.wait(0.3)

        self.say("web reads as itself. Both ends grant read_stream.")
        g1 = mono("web.can_call", 17, GREEN).move_to([-0.2, Y - 1.0, 0])
        g2 = mono("canvas_page.callable_by", 17, GREEN).move_to([3.6, Y - 1.0, 0])
        rs = pill("read_stream", color=AMBER, size=19).move_to([1.5, Y + 0.65, 0])
        self.play(FadeIn(g1), FadeIn(g2), FadeIn(rs, shift=RIGHT * 0.2), run_time=0.6)
        self.play(rs.animate.move_to([2.6, Y + 0.65, 0]), cp.tinted(GREEN, 0.3), run_time=0.6)
        self.wait(0.3)

        self.say("It answers with a head and the bytes.")
        head = mono('{"path": "index.html", "next_offset": 173, "eof": true}', 17, MUTED).move_to([2.6, -2.15, 0])
        self.play(FadeOut(rs), FadeIn(head, shift=LEFT * 0.2), run_time=0.5)
        ok = pill("index.html served", color=GREEN, size=19).move_to([-3.3, Y + 1.0, 0])
        self.play(ReplacementTransform(req, ok), run_time=0.5)
        self.finish()


class Boot(FScene):
    """The page kernel's first steps."""

    TITLE = "What the page does when it loads"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        page = Node("page kernel", w=2.4, h=0.9, color=VIOLET, size=22).move_to([-4.8, 0.9, 0])
        user = Node("user", w=1.5, h=0.9, color=BLUE, size=24).move_to([-0.4, 0.9, 0])
        host = Node("kernel", w=1.8, h=0.9, color=BLUE, size=24).move_to([4.2, 0.9, 0])
        l1 = Line(page.get_right(), user.get_left(), color=LINE, stroke_width=3)
        l2 = Line(user.get_right(), host.get_left(), color=LINE, stroke_width=3)

        self.say("Every host call goes through user.forward.")
        self.play(FadeIn(page), FadeIn(user), FadeIn(host), Create(l1), Create(l2), run_time=0.7)
        q = pill("reflect", color=CYAN, size=19).move_to([-3.1, 1.85, 0])
        self.play(FadeIn(q), run_time=0.25)
        self.play(q.animate.move_to([1.9, 1.85, 0]), run_time=0.9, rate_func=smooth)
        self.play(FadeOut(q), host.tinted(GREEN, 0.3), user.tinted(GREEN, 0.3), run_time=0.3)
        self.wait(0.2)

        steps = VGroup(
            mono("1  reflect kernel: admitted", 19, GREEN),
            mono("2  pick a canvas (?canvas=, main, first)", 19, INK),
            mono("3  load records through the loader", 19, INK),
            mono("4  boot the root: mint the guid", 19, INK),
            mono("5  mount the canvas", 19, INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2).move_to([0, -1.5, 0])
        self.say("An unauthorized reply would stop here. This one passes.")
        self.play(FadeIn(steps[0], shift=RIGHT * 0.2), run_time=0.4)
        self.wait(0.4)
        self.say("Then it picks a canvas, loads records, boots, mounts.")
        for s in steps[1:]:
            self.play(FadeIn(s, shift=RIGHT * 0.2), run_time=0.45)
        self.play(page.tinted(GREEN, 0.3), run_time=0.3)
        self.finish()
