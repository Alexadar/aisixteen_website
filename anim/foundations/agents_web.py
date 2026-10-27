"""Foundations — Agents › Web agents. 4 clips, each one mechanism.

mount:      boot asks each child for get_routes, the routes join the table (literal paths before
            patterns), and only then the host listens
            (R/fantastic-web/src/lib.rs:368-430; routes.rs:163-201; fantastic-web-ws lib.rs:112-117).
duplicates: a second leg declaring the same literal route is refused naming both; a shared
            pattern is allowed (routes.rs:229-253; tests_duplicate_route.rs).
guard:      Host and Origin are checked in front of every route; no Origin passes to the leg
            (origin.rs:102-150).
file:       the file route hands the fetch to the web agent, which sends read_stream as itself,
            so both halves of the call gate decide (lib.rs:264-271, 500-525; handlers.rs:166-237).
R = src/lib/rust/crates/bundles. Ids and names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"mount": "Mount", "duplicates": "Duplicates", "guard": "Guard", "file": "FileRoute"}
OG = "mount"


def left_text(s, size, color, x, y):
    m = mono(s, size, color)
    m.move_to([x, y, 0]).align_to([x, 0, 0], LEFT)
    return m


class Mount(FScene):
    """boot: get_routes from each child, then listen."""

    TITLE = "Boot: ask the children, then listen"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        web = Node("web", w=1.6, h=0.95, color=BLUE, size=28).move_to([-5.4, 0.2, 0])
        ws = Node("web_ws", w=1.9, h=0.8, color=BLUE, size=22).move_to([-2.4, 1.2, 0])
        rest = Node("web_rest", w=1.9, h=0.8, color=BLUE, size=22).move_to([-2.4, -0.8, 0])
        e1 = Line(web.get_right(), ws.get_left(), color=LINE, stroke_width=3)
        e2 = Line(web.get_right(), rest.get_left(), color=LINE, stroke_width=3)
        card_, title = panel("route table", 6.6, 3.7, 3.55, 0.1)

        X = 0.5
        ys = [1.2, 0.6, 0.0, -0.6, -1.2]
        r_fav = left_text("GET   /_assets/favicon.png", 19, MUTED, X, ys[0])
        r_file = left_text("GET   /{agent_id}/file/{path}", 19, MUTED, X, ys[1])
        r_ref = left_text("GET   /rest_1/_reflect", 19, CYAN, X, ys[1])
        r_ws = left_text("WS    /{host_id}/ws", 19, CYAN, X, ys[2])
        r_post = left_text("POST  /rest_1/{target_id}", 19, CYAN, X, ys[3])

        self.say("A web agent starts with two baked routes.")
        self.play(FadeIn(web), FadeIn(card_), FadeIn(title), FadeIn(r_fav), FadeIn(r_file), run_time=0.7)
        self.wait(0.3)

        self.say("It asks each child for its routes with get_routes.")
        self.play(FadeIn(ws), FadeIn(rest), Create(e1), Create(e2), run_time=0.5)
        q1 = pill("get_routes", color=AMBER, size=18).move_to(web.get_right() + RIGHT * 0.2 + UP * 0.4)
        q2 = q1.copy()
        self.add(q2)
        self.play(FadeIn(q1), run_time=0.2)
        self.play(q1.animate.move_to(ws.get_left() + LEFT * 1.15 + UP * 0.35),
                  q2.animate.move_to(rest.get_left() + LEFT * 1.15 + DOWN * 0.35), run_time=0.8, rate_func=smooth)
        self.play(FadeOut(q1), FadeOut(q2), ws.tinted(AMBER, 0.3), rest.tinted(AMBER, 0.3), run_time=0.3)

        self.say("Each answers with plain data. The paths join the table.")
        self.play(ws.tinted(GREEN, 0.3), run_time=0.25)
        self.play(FadeIn(r_ws, shift=LEFT * 0.4), r_file.animate.move_to([X, ys[4], 0]).align_to([X, 0, 0], LEFT), run_time=0.7)
        self.play(rest.tinted(GREEN, 0.3), run_time=0.25)
        self.play(FadeIn(r_ref, shift=LEFT * 0.4), FadeIn(r_post, shift=LEFT * 0.4), run_time=0.6)
        # literal before pattern: the _reflect row sits above the patterns
        self.play(r_ref.animate.move_to([X, ys[1], 0]).align_to([X, 0, 0], LEFT),
                  r_ws.animate.move_to([X, ys[2], 0]).align_to([X, 0, 0], LEFT), run_time=0.4)
        self.wait(0.4)

        self.say("Only then does the host bind its port and listen.")
        ls = pill("listening on 127.0.0.1:8000", color=GREEN, size=19).move_to([-3.2, -2.2, 0])
        self.play(web.tinted(GREEN, 0.3), FadeIn(ls, shift=UP * 0.1), run_time=0.5)
        self.finish()


class Duplicates(FScene):
    """Two legs, one literal route: refused; a shared pattern is allowed."""

    TITLE = "Two legs, one literal route"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        a = Node("ws_a", w=1.7, h=0.8, color=BLUE, size=22).move_to([-5.6, 1.1, 0])
        b = Node("ws_b", w=1.7, h=0.8, color=BLUE, size=22).move_to([-5.6, 0.0, 0])
        c = Node("ws_c", w=1.7, h=0.8, color=BLUE, size=22).move_to([-5.6, -1.1, 0])
        card_, title = panel("route table", 7.6, 2.2, 1.6, 0.8)
        X = -1.9
        r_a = left_text("WS   /app/ws          ws_a", 19, GREEN, X, 1.3)
        r_b = left_text("WS   /{host_id}/ws    ws_b", 19, GREEN, X, 0.65)

        self.say("ws_a declares the literal route /app/ws. It mounts.")
        self.play(FadeIn(a), FadeIn(b), FadeIn(c), FadeIn(card_), FadeIn(title), run_time=0.6)
        d = Dot(a.get_right(), radius=0.1, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to([X - 0.2, 1.3, 0]), run_time=0.6, rate_func=smooth)
        self.play(FadeOut(d), FadeIn(r_a), a.tinted(GREEN, 0.3), run_time=0.3)

        self.say("ws_b declares a pattern. Patterns are shared, so it mounts too.")
        d = Dot(b.get_right(), radius=0.1, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to([X - 0.2, 0.65, 0]), run_time=0.6, rate_func=smooth)
        self.play(FadeOut(d), FadeIn(r_b), b.tinted(GREEN, 0.3), run_time=0.3)
        self.wait(0.3)

        self.say("ws_c declares /app/ws again. The first match would hide it.")
        d = Dot(c.get_right(), radius=0.1, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to([X - 0.2, 0.0, 0]), run_time=0.6, rate_func=smooth)
        self.play(d.animate.set_color(RED), c.tinted(RED, 0.3), run_time=0.3)
        e1 = mono("web: route WS /app/ws declared by ws_c", 20, RED).move_to([1.6, -1.35, 0])
        e2 = mono("is already declared by ws_a", 20, RED).move_to([1.6, -1.8, 0])
        self.play(FadeOut(d), FadeIn(e1), FadeIn(e2), run_time=0.4)
        self.say("The host refuses it and names both. The table keeps the first.")
        self.finish()


class Guard(FScene):
    """The Host and Origin guard stands in front of every route."""

    TITLE = "The guard in front of every route"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.5
        client = Node("client", w=1.7, h=0.95, color=DIM, size=26).move_to([-5.6, Y, 0])
        guard = Node("guard", w=1.8, h=1.1, color=AMBER, size=26).move_to([-0.8, Y, 0])
        leg = Node("web_ws", w=1.9, h=0.95, color=BLUE, size=24).move_to([4.6, Y, 0])
        w1 = DashedLine(client.get_right(), guard.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        w2 = DashedLine(guard.get_right(), leg.get_left(), color=LINE, dash_length=0.14, stroke_width=3)

        self.say("A web host bound to localhost:8000 checks every request.")
        self.play(FadeIn(client), FadeIn(guard), FadeIn(leg), Create(w1), Create(w2), run_time=0.8)
        self.wait(0.2)

        def attempt(label, ok, verdict, say, color_end):
            self.say(say)
            p = pill(label, color=CYAN, size=18).move_to([-3.4, Y + 1.0, 0])
            self.play(FadeIn(p), run_time=0.25)
            self.play(p.animate.move_to([-0.8, Y + 1.0, 0]), run_time=0.7, rate_func=smooth)
            res = mono(verdict, 21, color_end).move_to([-0.8, -1.6, 0])
            if ok:
                self.play(guard.tinted(GREEN, 0.3), FadeOut(p), run_time=0.3)
                d = Dot(guard.get_right(), radius=0.11, color=CYAN)
                self.add(d)
                self.play(d.animate.move_to(leg.get_left()), run_time=0.7, rate_func=smooth)
                self.play(FadeOut(d), leg.tinted(GREEN, 0.3), FadeIn(res), run_time=0.4)
            else:
                self.play(guard.tinted(RED, 0.35), p.animate.set_color(RED), FadeIn(res), run_time=0.4)
                self.wait(0.9)
                self.play(FadeOut(p), FadeOut(res), guard.tinted(AMBER, 0.16), run_time=0.3)
            return res

        attempt("GET  Host: evil.example", False, "403  foreign Host",
                "A GET whose Host is not the host's own is refused.", RED)
        attempt("POST  Origin: evil.example", False, "403  foreign Origin",
                "A POST from a foreign browser Origin is refused.", RED)
        attempt("POST  (no Origin)", True, "passes: the leg's ingress_rule decides",
                "No Origin (curl, a CLI): the guard passes it on to the leg.", GREEN)
        self.finish()


class FileRoute(FScene):
    """The file route: the web agent reads as itself, so the call gate decides."""

    TITLE = "Serving a file as the web agent"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.8
        br = Node("browser", w=1.8, h=0.95, color=DIM, size=24).move_to([-5.6, Y, 0])
        web = Node("web", w=1.5, h=0.95, color=BLUE, size=26).move_to([-1.6, Y, 0])
        fl = Node("files", w=1.7, h=0.95, color=VIOLET, size=26).move_to([2.6, Y, 0])
        w1 = Line(br.get_right(), web.get_left(), color=LINE, stroke_width=3)
        w2 = Line(web.get_right(), fl.get_left(), color=LINE, stroke_width=3)
        req = pill("GET /files/file/logo.png", color=CYAN, size=18).move_to([-3.6, Y + 0.95, 0])

        self.say("A browser asks the web agent for /files/file/logo.png.")
        self.play(FadeIn(br), FadeIn(web), FadeIn(fl), Create(w1), Create(w2), run_time=0.8)
        self.play(FadeIn(req), run_time=0.3)
        self.play(req.animate.move_to([-1.6, Y + 0.95, 0]), run_time=0.7, rate_func=smooth)
        self.play(FadeOut(req), web.tinted(BLUE, 0.35), run_time=0.3)

        self.say("The web agent reads it as itself: read_stream to files.")
        g1 = left_text('web.can_call       files: ["read_stream"]', 20, GREEN, -6.4, -1.05)
        g2 = left_text('files.callable_by  web: ["read_stream"]', 20, GREEN, -6.4, -1.6)
        rs = pill("read_stream", color=AMBER, size=18).move_to([0.5, Y + 0.95, 0])
        self.play(FadeIn(g1), FadeIn(g2), FadeIn(rs), run_time=0.5)
        d = Dot(web.get_right(), radius=0.11, color=AMBER)
        self.add(d)
        self.play(d.animate.move_to(fl.get_left()), run_time=0.7, rate_func=smooth)
        self.play(FadeOut(d), FadeOut(rs), fl.tinted(GREEN, 0.3), run_time=0.3)

        self.say("Both halves of the gate grant: 256 KiB chunks stream back.")
        ok = left_text("200  logo.png", 21, GREEN, -6.4, Y - 0.95)
        d1 = Dot(fl.get_left(), radius=0.11, color=GREEN)
        self.add(d1)
        self.play(d1.animate.move_to(web.get_right()), run_time=0.6, rate_func=smooth)
        self.play(d1.animate.move_to(br.get_right()), run_time=0.6, rate_func=smooth)
        self.play(FadeOut(d1), br.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.3)
        self.wait(0.6)

        self.say("Empty files.callable_by: the gate refuses, the browser gets 404.")
        g2b = left_text("files.callable_by  {}", 20, RED, -6.4, -1.6)
        no = left_text("404  reason unauthorized, side, hint", 21, RED, -6.4, Y - 0.95)
        self.play(FadeTransform(g2, g2b), FadeOut(ok), br.tinted(DIM, 0.16), fl.tinted(VIOLET, 0.16), run_time=0.5)
        d2 = Dot(web.get_right(), radius=0.11, color=AMBER)
        self.add(d2)
        self.play(d2.animate.move_to(fl.get_left()), run_time=0.7, rate_func=smooth)
        self.play(d2.animate.set_color(RED), fl.tinted(RED, 0.3), run_time=0.3)
        self.play(FadeOut(d2), br.tinted(RED, 0.3), FadeIn(no), run_time=0.4)
        self.finish()
