"""Foundations — Protocol › Security. Three clips, each one mechanism on fantastic main.

reach:      a new agent holds only {"$self": "*"}; an edge needs both ends written from above
            (P/kernel/_authz.py:34-36,58-59,90-95; R/fantastic-kernel/src/authz.rs:32-33).
credential: an AI backend asks the credential store for `api_key` pinned to the endpoint host;
            another host is refused; the call is recorded as [secret]
            (R/bundles/fantastic-ai-core/src/credentials.rs:1-12; credential_store lib.rs:282-296, 711-718;
            fantastic-kernel/src/secret.rs:1-19).
edges:      exec_bridge sealed by default then allowlisted by regex; file_bridge exposes only its
            `allow` list (exec_bridge lib.rs:4-9,120-158; file_bridge readme.md:19).
Ids, hosts and commands are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, mono, pill, txt,
)

CLIPS = {"reach": "SecReach", "credential": "SecCredential", "edges": "SecEdges"}
OG = "reach"


class SecReach(FScene):
    """No grant, no reach: the baseline is $self; an edge is written on both ends."""

    TITLE = "No grant, no reach"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        w = Node("worker", w=1.9, h=0.9, color=BLUE, size=26).move_to([-5.2, 0.8, 0])
        st = Node("store", w=1.7, h=0.8, color=GREEN, size=26).move_to([5.3, 1.5, 0])
        ot = Node("other", w=1.7, h=0.8, color=VIOLET, size=26).move_to([5.3, 0.1, 0])
        w1 = DashedLine(w.get_right(), st.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        w2 = DashedLine(w.get_right(), ot.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        L, R = -6.5, 6.5

        def can(s, c):
            return mono(f"worker.can_call    {s}", 20, c).move_to([0, -1.25, 0]).align_to([L, 0, 0], LEFT)

        def cby(s, c):
            return mono(f"store.callable_by  {s}", 20, c).move_to([0, -1.8, 0]).align_to([R, 0, 0], RIGHT)

        g1, g2 = can('{"$self": "*"}', MUTED), cby('{"$self": "*"}', MUTED)
        self.say("A new agent can call only itself.")
        self.play(FadeIn(w), FadeIn(st), FadeIn(ot), Create(w1), Create(w2), FadeIn(g1), FadeIn(g2), run_time=0.9)
        self.wait(0.4)

        def shoot(to, stop):
            d = Dot(w.get_right(), radius=0.12, color=CYAN)
            self.add(d)
            end = to.get_left() + (LEFT * stop if stop else 0 * LEFT)
            self.play(d.animate.move_to(end), run_time=0.8, rate_func=smooth)
            return d

        self.say("worker sends get to store. No grant, so the send is refused.")
        d = shoot(st, 2.6)
        err = mono("unauthorized · side: egress", 20, RED).move_to([0, -2.45, 0])
        self.play(d.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.0)
        self.play(FadeOut(d), FadeOut(err), run_time=0.3)

        self.say("Grants come from above: the operator writes both ends of one edge.")
        self.play(FadeTransform(g1, can('{"$self": "*", "store": ["get"]}', GREEN)),
                  FadeTransform(g2, cby('{"$self": "*", "worker": ["get"]}', GREEN)), run_time=0.7)
        self.wait(0.5)
        d = shoot(st, 0)
        ok = mono("get: completed", 20, GREEN).move_to([0, -2.45, 0])
        self.play(FadeOut(d), st.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.4)
        self.wait(0.9)

        self.say("other was never named, so worker still cannot reach it.")
        d = shoot(ot, 2.6)
        bad = mono("unauthorized · side: egress", 20, RED).move_to([0, -2.45, 0])
        self.play(d.animate.set_color(RED), ot.tinted(RED, 0.2), FadeOut(ok), FadeIn(bad), run_time=0.4)
        self.wait(0.8)
        self.play(FadeOut(d), run_time=0.2)
        self.finish()


class SecCredential(FScene):
    """A key by reference, pinned to one host, recorded as [secret]."""

    TITLE = "A key by reference, for one host"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.9
        ai = Node("ai agent", w=2.2, h=0.9, color=VIOLET, size=24).move_to([-5.3, Y, 0])
        cs = Node("creds", w=1.8, h=0.9, color=GREEN, size=26).move_to([0.2, Y, 0])
        host = Node("api.openai.com", w=3.0, h=0.9, color=BLUE, size=20).move_to([5.1, Y, 0])
        rec = mono("credentials: {store, ref}", 18, DIM).move_to([-4.6, -0.8, 0])
        decl = mono("openai/main → api.openai.com", 18, DIM).move_to([0.9, -0.8, 0])
        self.say("The agent's record names a store and a ref. It holds no key.")
        self.play(FadeIn(ai), FadeIn(cs), FadeIn(host), FadeIn(rec), FadeIn(decl), run_time=0.8)
        self.wait(0.7)

        q = pill("get openai/main for api.openai.com", color=CYAN, size=17).move_to([-2.6, Y + 0.95, 0])
        self.say("Before each request it asks the store, naming the host it will call.")
        self.play(FadeIn(q, shift=UP * 0.1), run_time=0.4)
        self.play(q.animate.move_to([-1.2, Y + 0.95, 0]), cs.tinted(GREEN, 0.3), run_time=0.7)
        key = pill("api_key", color=AMBER, size=18).move_to([-2.5, Y - 0.75, 0])
        self.play(FadeOut(q), FadeIn(key), run_time=0.4)
        self.play(key.animate.move_to([-5.0, Y - 0.75, 0]), run_time=0.6)
        self.say("The host matches, so the key is returned and sent to that host only.")
        self.play(key.animate.move_to([3.0, Y - 0.75, 0]), host.tinted(BLUE, 0.3), run_time=1.0, rate_func=smooth)
        self.wait(0.4)
        self.play(FadeOut(key), run_time=0.3)

        q2 = pill("get openai/main for other.example", color=CYAN, size=17).move_to([-2.6, Y + 0.95, 0])
        self.say("A get for any other host is refused. Nothing is read.")
        self.play(FadeIn(q2, shift=UP * 0.1), run_time=0.4)
        self.play(q2.animate.move_to([-1.2, Y + 0.95, 0]).set_color(RED), run_time=0.7)
        err = mono("bound to api.openai.com — refused, nothing read", 19, RED).move_to([0, -1.6, 0])
        self.play(FadeIn(err), run_time=0.4)
        self.wait(1.2)
        self.play(FadeOut(q2), FadeOut(err), run_time=0.3)

        self.say("The ledger and the state stream keep the value as [secret].", color=INK)
        row = mono('get · fields.api_key: [secret]', 21, AMBER).move_to([0, -1.6, 0])
        self.play(FadeIn(row), run_time=0.4)
        self.finish()


class SecEdges(FScene):
    """Sealed by default, then an allowlist (exec) and an allow list (file)."""

    TITLE = "Sealed edges and allowlists"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ag = Node("agent", w=1.7, h=0.9, color=BLUE, size=26).move_to([-6.0, 0.1, 0])
        ex = Node("exec_bridge", w=3.0, h=0.8, color=AMBER, size=22).move_to([-2.6, 1.3, 0])
        fb = Node("file_bridge", w=3.0, h=0.8, color=CYAN, size=22).move_to([-2.6, -1.1, 0])
        l1 = DashedLine(ag.get_right(), ex.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        l2 = DashedLine(ag.get_right(), fb.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        X = -0.7

        def line(s, y, c):
            return mono(s, 20, c).move_to([0, y, 0]).align_to([X, 0, 0], LEFT)

        self.say("A new exec_bridge is sealed: start is refused.")
        self.play(FadeIn(ag), FadeIn(ex), FadeIn(fb), Create(l1), Create(l2), run_time=0.8)
        d = Dot(ag.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(ex.get_left() + LEFT * 0.3), run_time=0.7, rate_func=smooth)
        r1 = line("start → unauthorized", 1.3, RED)
        self.play(d.animate.set_color(RED), ex.tinted(RED, 0.2), FadeIn(r1), run_time=0.4)
        self.wait(0.8)
        self.play(FadeOut(d), run_time=0.2)

        self.say("Opened, it still runs only lines that match an allowed pattern.")
        al = line('allowed: ["ffmpeg .*"]', 1.7, AMBER)
        self.play(ex.tinted(AMBER, 0.16), FadeTransform(r1, line("start curl example.com → refused", 1.1, RED)),
                  FadeIn(al), run_time=0.6)
        d = Dot(ag.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(ex.get_left() + LEFT * 0.3), run_time=0.7, rate_func=smooth)
        self.play(d.animate.set_color(RED), run_time=0.3)
        self.wait(0.7)
        self.play(FadeOut(d), run_time=0.2)
        r2 = line("start ffmpeg -i in.mp4 → runs", 1.1, GREEN)
        d = Dot(ag.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(ex.get_left()), run_time=0.7, rate_func=smooth)
        self.play(FadeOut(d), ex.tinted(GREEN, 0.3), run_time=0.3)
        self.play(*[FadeOut(m) for m in self.mobjects if isinstance(m, Text) and abs(m.get_y() - 1.1) < 0.2 and m.get_x() > -1.0], run_time=0.1)
        self.add(r2)
        self.wait(0.8)

        self.say("file_bridge exposes only the paths in its allow list.")
        fl = line('allow: ["docs"]', -0.7, CYAN)
        self.play(FadeIn(fl), run_time=0.4)
        d = Dot(ag.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(fb.get_left()), run_time=0.7, rate_func=smooth)
        ok = line("read docs/a.txt → ok", -1.2, GREEN)
        self.play(FadeOut(d), fb.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.4)
        self.wait(0.8)
        d = Dot(ag.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(fb.get_left() + LEFT * 0.3), run_time=0.7, rate_func=smooth)
        no = line("read notes/b.txt → not_found", -1.2, RED)
        self.play(d.animate.set_color(RED), fb.tinted(RED, 0.2), FadeTransform(ok, no), run_time=0.4)
        self.wait(0.7)
        self.play(FadeOut(d), run_time=0.2)
        d = Dot(ag.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(fb.get_left() + LEFT * 0.3), run_time=0.7, rate_func=smooth)
        out = line("read ../secret → refused", -1.7, RED)
        self.play(d.animate.set_color(RED), FadeIn(out), run_time=0.4)
        self.wait(0.7)
        self.play(FadeOut(d), run_time=0.2)
        self.finish()
