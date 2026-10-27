"""Foundations — Agents › AI agent › Model backends. Three clips, each one mechanism.

surface: one agent surface in ai-core; five providers only stream raw text — facts 1-6, 22, 29
         (provider.rs:1-10, lib.rs of each backend).
caching: the same history under caching none / cleanup / provider_cache; only anthropic
         declares provider_cache, the others refuse it — facts 14, 32-36 (caching.rs:1-13, 127-142).
retries: transport_retries 2: 503, notice row, 2 s, 503, notice row, 4 s, success — facts 42-44
         (verbs.rs:1288-1349).
Row ids and the agent name are illustrative; verbs, modes, backoff and notice text are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

CLIPS = {"surface": "BK1Surface", "caching": "BK2Caching", "retries": "BK3Retries"}
OG = "surface"


class BK1Surface(FScene):
    """One agent surface; five providers that only stream raw text."""

    TITLE = "Five backends, one agent surface"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        agent = Node("agent", w=1.5, color=BLUE).move_to([-5.3, -0.2, 0])
        core = card(2.5, 1.5, stroke=VIOLET, fill=VIOLET, opacity=0.1).move_to([-2.4, -0.2, 0])
        core_t = VGroup(mono("ai-core", 21, VIOLET), mono("history", 17, DIM), mono("<call> parse", 17, DIM))
        core_t.arrange(DOWN, buff=0.1).move_to(core)
        names = [
            ("anthropic", "/v1/messages", CYAN),
            ("vllm", "/chat/completions", CYAN),
            ("ollama", "/api/chat", CYAN),
            ("responses", "/v1/responses", CYAN),
            ("foundation_models", "on-device", AMBER),
        ]
        ys = [1.55, 0.75, -0.05, -0.85, -1.65]
        nodes = [Node(n, w=3.0, h=0.56, color=c, size=19).move_to([1.4, y, 0]) for (n, _, c), y in zip(names, ys)]
        wires = [mono(w, 17, DIM).move_to([4.55, y, 0]).align_to([3.55, 0, 0], LEFT) for (_, w, _), y in zip(names, ys)]
        links = [Line(core.get_right(), n.get_left(), color=LINE, stroke_width=2) for n in nodes]

        self.say("send runs one turn in ai-core, whichever backend the agent uses.")
        self.play(FadeIn(agent), FadeIn(core), FadeIn(core_t), run_time=0.6)
        send = pill('send {"text": …}', color=CYAN, size=17).next_to(agent, UP, buff=0.35)
        self.play(FadeIn(send, shift=UP * 0.1), run_time=0.3)
        self.play(send.animate.move_to([-3.6, 1.6, 0]), run_time=0.7)
        self.say("Each backend is a provider: messages in, raw text out.")
        self.play(*[Create(l) for l in links], LaggedStart(*[FadeIn(n) for n in nodes], lag_ratio=0.12),
                  LaggedStart(*[FadeIn(w) for w in wires], lag_ratio=0.12), run_time=1.3)
        self.play(FadeOut(send), run_time=0.2)

        self.say("No native tool API: the model writes <call> as plain text.")
        tok = pill("<call name=…>", color=GREEN, size=17).move_to(nodes[0].get_left() + LEFT * 0.4)
        self.play(FadeIn(tok), run_time=0.3)
        self.play(tok.animate.move_to(core.get_right() + LEFT * 0.0 + UP * 0.9 + RIGHT * 0.2), run_time=0.8)
        self.play(core_t[2].animate.set_color(GREEN), FadeOut(tok), run_time=0.4)
        self.say("ai-core parses it and routes the call, the same for every provider.", wait=0.8)
        self.finish()


class BK2Caching(FScene):
    """The caching modes, and which backend accepts provider_cache."""

    TITLE = "caching: one history, three views"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        W, G = 0.62, 0.12
        X0 = -4.2
        lanes = [("none", 1.35), ("cleanup", 0.2), ("provider_cache", -0.95)]

        def row(y, drop=()):
            cells = []
            for i in range(1, 7):
                color = VIOLET if i == 5 else BLUE
                c = Node(str(i), w=W, h=0.6, color=color, size=19, fill_alpha=0.16)
                c.move_to([X0 + (i - 1) * (W + G) + W / 2, y, 0])
                cells.append(c)
            return cells

        labels = [mono(n, 18, DIM).move_to([-6.55, y, 0]).align_to([-6.6, 0, 0], LEFT) for n, y in lanes]
        rows = [row(y) for _, y in lanes]
        self.say("Rows 1 to 6 are stored; row 5 is a fold. The mode picks the view.")
        self.play(*[FadeIn(l) for l in labels], run_time=0.3)
        self.play(*[LaggedStart(*[FadeIn(c) for c in r], lag_ratio=0.05) for r in rows], run_time=1.0)

        self.say("none sends every row. cleanup, the default, trims some out.")
        self.play(rows[1][2].animate.set_opacity(0.15), rows[1][3].animate.set_opacity(0.15), run_time=0.6)
        self.wait(0.4)

        self.say("provider_cache sends every row, plus two markers.")
        xp = rows[2][1].get_right()[0] + G / 2
        xf = rows[2][4].get_right()[0] + G / 2
        m1 = Line([xp, -0.55, 0], [xp, -1.35, 0], color=AMBER, stroke_width=4)
        m2 = Line([xf, -0.55, 0], [xf, -1.35, 0], color=VIOLET, stroke_width=4)
        t1 = mono("primer", 16, AMBER).next_to(m1, DOWN, buff=0.1)
        t2 = mono("last fold", 16, VIOLET).next_to(m2, DOWN, buff=0.1)
        self.play(FadeIn(m1), FadeIn(m2), FadeIn(t1), FadeIn(t2), run_time=0.6)

        self.say("Only anthropic turns them into cache_control; the rest refuse.")
        ok = pill("anthropic: cache_control", color=GREEN, size=18).move_to([3.9, -0.65, 0])
        no = pill("vllm, ollama: refused", color=RED, size=17).move_to([3.9, -1.3, 0])
        no2 = pill("responses, foundation_models: refused", color=RED, size=17).move_to([3.9, -1.85, 0])
        self.play(FadeIn(ok, shift=LEFT * 0.1), run_time=0.4)
        self.play(FadeIn(no, shift=LEFT * 0.1), FadeIn(no2, shift=LEFT * 0.1), run_time=0.4)
        self.wait(0.4)
        self.finish()


class BK3Retries(FScene):
    """transport_retries: a dropped link is retried, visibly, with a growing backoff."""

    TITLE = "transport_retries: a visible retry"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        cfg = pill("transport_retries: 2", color=AMBER, size=19).move_to([-4.6, 1.0, 0])
        steps = [
            ("pass 1", "HTTP 503", RED, -4.9),
            ("wait", "2 s", DIM, -2.65),
            ("pass 2", "HTTP 503", RED, -0.4),
            ("wait", "4 s", DIM, 1.85),
            ("pass 3", "ok", GREEN, 4.1),
        ]

        def step_card(a, b, color, x):
            c = card(1.95, 1.0, stroke=color, fill=color, opacity=0.1).move_to([x, -0.3, 0])
            t = VGroup(mono(a, 18, MUTED), mono(b, 22, color)).arrange(DOWN, buff=0.12).move_to(c)
            return VGroup(c, t)

        cards = [step_card(*s) for s in steps]
        self.say("The record asks for up to 2 retries when the link drops.")
        self.play(FadeIn(cfg), run_time=0.4)
        self.say("Pass 1 gets a 503, a gateway error. That is the link, so it is retried.")
        self.play(FadeIn(cards[0]), run_time=0.4)

        rows = []

        def notice(n, y):
            r = mono(f"[retry {n}/2] the link dropped (…) — retrying the turn", 17, MUTED)
            r.move_to([0, y, 0])
            b = card(r.width + 0.4, 0.5, stroke=AMBER, fill=AMBER, opacity=0.08).move_to(r)
            return VGroup(b, r)

        n1 = notice(1, -1.65)
        self.say("A notice row is stored and a retrying status goes out.")
        self.play(FadeIn(n1, shift=UP * 0.1), run_time=0.4)
        self.say("Then it waits 2 s and runs the pass again.")
        self.play(FadeIn(cards[1]), run_time=0.4)
        self.play(FadeIn(cards[2]), run_time=0.4)
        n2 = notice(2, -2.35)
        self.say("A second 503: another notice row, and a 4 s wait.")
        self.play(FadeIn(n2, shift=UP * 0.1), run_time=0.4)
        self.play(FadeIn(cards[3]), run_time=0.4)
        self.say("Pass 3 succeeds. Out of retries, the turn would fail.")
        self.play(FadeIn(cards[4]), run_time=0.4)
        self.wait(0.4)
        self.finish()
