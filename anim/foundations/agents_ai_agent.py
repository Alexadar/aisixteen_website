"""Foundations — Agents › AI agent. Four clips, each one mechanism of ai_core.

Every step drawn here is a behaviour on fantastic main (Rust and Python twins), see
coder/tmp/foundations/facts/agents_ai_agent.md: pass = agent_loop.rs run_generation, assembly.rs
(facts 8, 9, 17, 34); chain = route.rs (24-27); nudge = route.rs NO_CALL_NUDGE, MAX_SILENT_TURNS
(29-31); pause = pause.rs (50-53). Ids and row numbers are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"pass": "AA1Pass", "chain": "AA2Chain", "nudge": "AA3Nudge", "pause": "AA4Pause"}
OG = "chain"


def arrow(a, b, color=CYAN, sw=3):
    return Arrow(a, b, buff=0.08, stroke_width=sw, color=color, max_tip_length_to_length_ratio=0.18)


class AA1Pass(FScene):
    """One pass: prompt parts and store rows to the provider, tokens back, two rows appended."""

    TITLE = "One pass: rows and a prompt in, a stream out"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        self.say("A send reaches the AI agent: one pass.")
        c, t = panel("prompt, in this order", 3.8, 3.3, -4.5, 0.2)
        lines = [("{tree}", CYAN), ("{self}", BLUE), ("{howto}", MUTED), ("rows from the store", GREEN)]
        nodes = VGroup(*[Node(s, w=3.2, h=0.52, color=col, size=19) for s, col in lines])
        for i, n in enumerate(nodes):
            n.move_to([-4.5, 1.2 - i * 0.7, 0])
        self.play(FadeIn(c), FadeIn(t), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(n, shift=RIGHT * 0.1) for n in nodes], lag_ratio=0.25), run_time=1.4)

        prov = Node("provider", w=2.2, h=0.8, color=VIOLET, size=24).move_to([0.4, 0.2, 0])
        self.say("The provider streams text. It knows no tools.")
        self.play(FadeIn(prov), run_time=0.4)
        a1 = arrow([-2.55, 0.2, 0], [-0.8, 0.2, 0])
        self.play(GrowArrow(a1), run_time=0.5)
        out_c, out_t = panel("tokens", 3.6, 1.5, 4.8, 0.2)
        a2 = arrow([1.6, 0.2, 0], [2.95, 0.2, 0], color=VIOLET)
        tok = mono('<call name="send">', 19, VIOLET).move_to([4.8, 0.45, 0])
        tok2 = mono("… or an answer", 19, MUTED).move_to([4.8, -0.05, 0])
        self.play(GrowArrow(a2), FadeIn(out_c), FadeIn(out_t), run_time=0.5)
        self.play(FadeIn(tok), run_time=0.5)
        self.play(FadeIn(tok2), prov.tinted(VIOLET, 0.35), run_time=0.5)

        self.say("Two rows are appended to the store.")
        r1 = Node("user · #41", w=2.0, h=0.5, color=GREEN, size=18).move_to([-5.4, -2.2, 0])
        r2 = Node("assistant · #42", w=2.4, h=0.5, color=GREEN, size=18).move_to([-2.9, -2.2, 0])
        self.play(FadeIn(r1, shift=UP * 0.15), run_time=0.4)
        self.play(FadeIn(r2, shift=UP * 0.15), run_time=0.4)
        self.say("Thinking is stripped before the answer is stored.", wait=0.8)
        self.finish()


class AA2Chain(FScene):
    """A chain: pass 1 writes two calls; one reply batch lands on the agent; pass 2 writes done."""

    TITLE = "A chain is passes joined by replies"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        agent = Node("agent", w=1.8, h=0.8, color=BLUE, size=24).move_to([-4.4, 0.2, 0])
        notes = Node("notes", w=1.6, color=GREEN, size=22).move_to([1.8, 1.2, 0])
        files = Node("files", w=1.6, color=GREEN, size=22).move_to([1.8, -0.8, 0])
        self.say("Pass 1: the model writes two calls in one answer.")
        self.play(FadeIn(agent), FadeIn(notes), FadeIn(files), run_time=0.5)
        p1 = pill("pass 1", color=VIOLET).next_to(agent, UP, buff=0.35)
        self.play(FadeIn(p1), run_time=0.3)
        out1 = arrow(agent.get_right() + UP * 0.15, notes.get_left(), CYAN)
        out2 = arrow(agent.get_right() + DOWN * 0.15, files.get_left(), CYAN)
        c1 = pill("read", color=CYAN, size=18).move_to([-1.2, 0.95, 0])
        c2 = pill("list", color=CYAN, size=18).move_to([-1.2, -0.55, 0])
        self.play(GrowArrow(out1), GrowArrow(out2), FadeIn(c1), FadeIn(c2), run_time=0.8)

        self.say("They run together. The replies return as one batch.")
        self.play(notes.tinted(GREEN, 0.4), files.tinted(GREEN, 0.4), run_time=0.4)
        self.play(FadeOut(out1), FadeOut(out2), FadeOut(c1), FadeOut(c2), run_time=0.3)
        batch = pill("reply batch · 2 of 2", color=AMBER).move_to([3.2, 0.2, 0])
        self.play(FadeIn(batch, scale=0.9), run_time=0.4)
        self.play(batch.animate.move_to([-0.9, 0.2, 0]), run_time=0.9)

        self.say("It lands on the agent. That starts pass 2.")
        p2 = pill("pass 2", color=VIOLET).move_to(p1)
        self.play(FadeOut(notes), FadeOut(files), batch.animate.move_to(agent.get_center()).set_opacity(0), Transform(p1, p2),
                  agent.tinted(VIOLET, 0.3), run_time=0.7)
        self.remove(batch)
        done = pill("done", color=GREEN, size=22).move_to([-1.4, 0.2, 0])
        dn = arrow(agent.get_right(), done.get_left(), GREEN)
        self.play(GrowArrow(dn), FadeIn(done, shift=RIGHT * 0.2), run_time=0.5)
        self.say("done ends the chain: nothing runs, nothing reminds.", wait=0.5)
        self.play(agent.tinted(GREEN, 0.35), run_time=0.4)
        self.finish()


class AA3Nudge(FScene):
    """A turn with no call is reminded and rerolled; ten silent turns in a row give up."""

    TITLE = "A turn with no call is reminded"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        agent = Node("agent", w=1.8, h=0.8, color=BLUE, size=24).move_to([-4.8, 0.9, 0])
        self.say("The agent answers with prose and no call.")
        self.play(FadeIn(agent), run_time=0.4)
        prose = pill("prose, no <call>", color=MUTED).move_to([-1.9, 1.7, 0])
        a1 = arrow(agent.get_right() + UP * 0.15, prose.get_left(), MUTED, 2.4)
        self.play(GrowArrow(a1), FadeIn(prose), run_time=0.6)

        self.say("Nothing ran. The router stores a reminder.")
        rem = pill("[no call was dispatched]", color=AMBER).move_to([-0.7, 0.2, 0])
        a2 = arrow(rem.get_left(), agent.get_right() + DOWN * 0.2, AMBER, 2.4)
        self.play(FadeIn(rem, shift=LEFT * 0.2), GrowArrow(a2), run_time=0.6)

        cells = VGroup(*[Node(str(i + 1), w=0.7, h=0.6, color=DIM, size=18, fill_alpha=0.06) for i in range(10)])
        cells.arrange(RIGHT, buff=0.2).move_to([0, -1.3, 0])
        cap = mono("silent turns in a row", 18, DIM).next_to(cells, DOWN, buff=0.3)
        self.say("Each silent turn in a row is counted.")
        self.play(FadeIn(cells), FadeIn(cap), run_time=0.5)
        self.play(cells[0].tinted(AMBER, 0.45), run_time=0.3)
        for i in range(1, 9):
            self.play(cells[i].tinted(AMBER, 0.45), run_time=0.14)
        self.say("The tenth ends the chain: gave_up.")
        self.play(cells[9].tinted(RED, 0.5), run_time=0.3)
        gave = pill("done · reason: gave_up", color=RED).move_to([3.4, 1.7, 0])
        self.play(FadeIn(gave, shift=LEFT * 0.2), agent.tinted(RED, 0.3), run_time=0.5)
        self.say("Any call resets the count; done ends it at once.", wait=0.6)
        self.finish()


class AA4Pause(FScene):
    """pause writes a pause row; sends become held rows; resume releases them in order."""

    TITLE = "pause holds, resume releases in order"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        agent = Node("agent", w=1.8, h=0.8, color=BLUE, size=24).move_to([-4.4, 1.0, 0])
        gen = pill("generating", color=VIOLET).next_to(agent, RIGHT, buff=0.5)
        self.say("The agent is generating.")
        self.play(FadeIn(agent), FadeIn(gen), run_time=0.5)

        self.say("pause stops it and writes a pause row.")
        r_pause = Node("pause", w=1.7, h=0.55, color=AMBER, size=19).move_to([-5.0, -1.2, 0])
        self.play(FadeOut(gen), agent.tinted(AMBER, 0.3), FadeIn(r_pause, shift=UP * 0.15), run_time=0.7)

        self.say("Sends while paused become held rows.")
        s1 = pill("send A", color=CYAN, size=19).move_to([4.4, 1.0, 0])
        self.play(FadeIn(s1), run_time=0.3)
        self.play(s1.animate.move_to([-2.0, 1.0, 0]), run_time=0.7)
        h1 = Node("held A", w=1.7, h=0.55, color=DIM, size=19).move_to([-2.9, -1.2, 0])
        self.play(Transform(s1, h1), run_time=0.6)
        s2 = pill("send B", color=CYAN, size=19).move_to([4.4, 1.0, 0])
        self.play(FadeIn(s2), run_time=0.3)
        self.play(s2.animate.move_to([-2.0, 1.0, 0]), run_time=0.7)
        h2 = Node("held B", w=1.7, h=0.55, color=DIM, size=19).move_to([-0.8, -1.2, 0])
        self.play(Transform(s2, h2), run_time=0.6)

        self.say("resume writes a resume row, then releases both.")
        r_res = Node("resume", w=1.7, h=0.55, color=GREEN, size=19).move_to([1.3, -1.2, 0])
        self.play(FadeIn(r_res, shift=UP * 0.15), agent.tinted(GREEN, 0.3), run_time=0.5)
        t1 = pill("turn: A", color=GREEN, size=19).move_to([-2.9, -0.5, 0])
        self.play(t1.animate.move_to([-2.2, 1.0, 0]), run_time=0.7)
        t2 = pill("turn: B", color=GREEN, size=19).move_to([-0.8, -0.5, 0])
        self.play(t2.animate.move_to([-0.2, 1.0, 0]), run_time=0.7)
        self.say("In arrival order, each as a fresh turn.", wait=0.6)
        self.finish()
