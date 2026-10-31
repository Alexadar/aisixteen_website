"""Foundations — Canvas › User. 3 clips, each one mechanism.

forward: a canvas tab's call to an agent goes to `user` as forward {target, payload}; user sends the
         payload itself; the reply comes back verbatim (src/tui/web/canvas/src/user_bridge.ts:21-24;
         bundles/fantastic-user/src/lib.rs:202-253).
gate:    the onward send is user's, so the call gate judges user's can_call; narrowing it gives an
         egress refusal; `send` on user is refused (lib.rs:454-460; kern/reach.rs:1-25).
inquiry: an agent's inquiry is accepted at once and held; the person's answer comes back on the
         asker's thread (bundles/fantastic-user/src/inquiries.rs:52-148).
Ids and names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"forward": "Forward", "gate": "Gate", "inquiry": "Inquiry"}
OG = "forward"


def edge(a, b, color=LINE):
    return Line(a.get_right(), b.get_left(), color=color, stroke_width=3)


class Forward(FScene):
    """A tab's call leaves as user."""

    TITLE = "Every call goes out as user"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        tab = Node("canvas tab", w=2.1, color=CYAN, size=20).move_to([-5.2, 0.3, 0])
        user = Node("user", w=1.6, h=0.9, color=BLUE, size=26).move_to([-1.1, 0.3, 0])
        tgt = Node("notes", w=1.6, h=0.9, color=GREEN, size=24).move_to([4.3, 0.3, 0])
        e1, e2 = edge(tab, user), edge(user, tgt)
        self.say("A tab never calls an agent itself. It calls user.")
        self.play(FadeIn(tab), FadeIn(user), FadeIn(tgt), Create(e1), Create(e2), run_time=0.7)

        m1 = mono('{"type": "forward", "target": "notes",', 17, CYAN)
        m2 = mono(' "payload": {"type": "reflect"}}', 17, CYAN)
        msg = VGroup(m1, m2).arrange(DOWN, aligned_edge=LEFT, buff=0.06)
        bg = card(msg.width + 0.4, msg.height + 0.3, stroke=CYAN).move_to(msg)
        wrap = VGroup(bg, msg).move_to([-3.15, 1.7, 0])
        self.say("The page wraps the call as forward {target, payload}.")
        self.play(FadeIn(wrap, shift=DOWN * 0.1), run_time=0.5)
        self.play(wrap.animate.move_to([-3.15, 1.15, 0]).scale(0.8), run_time=0.7)
        self.play(user.tinted(AMBER, 0.3), run_time=0.3)

        self.say("user sends the payload to notes. Its own id is the sender.")
        out = pill('{"type": "reflect"}', color=CYAN, size=18).move_to([1.7, 1.0, 0])
        frm = mono("from: user", 17, AMBER).next_to(out, DOWN, buff=0.15)
        self.play(FadeIn(out), FadeIn(frm), run_time=0.4)
        self.play(VGroup(out, frm).animate.move_to([2.2, 1.0, 0]), run_time=0.6)
        self.play(tgt.tinted(AMBER, 0.3), run_time=0.3)

        self.say("The reply comes back verbatim, with no default timeout.")
        rep = pill('{"id": "notes", …}', color=GREEN, size=18).move_to([1.7, -0.6, 0])
        self.play(FadeOut(out), FadeOut(frm), tgt.tinted(GREEN, 0.3), FadeIn(rep), run_time=0.4)
        self.play(rep.animate.move_to([-3.2, -0.6, 0]), run_time=0.8)
        self.play(user.tinted(GREEN, 0.3), tab.tinted(GREEN, 0.3), run_time=0.3)
        self.finish()


class Gate(FScene):
    """user's grants decide; send is not its verb."""

    TITLE = "The gate judges user's grants"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        user = Node("user", w=1.6, h=0.9, color=BLUE, size=26).move_to([-4.6, 0.6, 0])
        tgt = Node("notes", w=1.6, h=0.9, color=GREEN, size=24).move_to([4.2, 0.6, 0])
        grant = mono('user.can_call  {"notes": ["*"]}', 18, GREEN).move_to([-0.2, 2.0, 0])
        grant2 = mono('notes.callable_by  {"user": ["*"]}', 18, GREEN).move_to([-0.2, 1.5, 0])
        link = edge(user, tgt, GREEN)
        self.say("By default user holds god mode: both edges are granted.")
        self.play(FadeIn(user), FadeIn(tgt), FadeIn(grant), FadeIn(grant2), Create(link), run_time=0.8)
        ok = pill("forward → reply", color=GREEN, size=19).move_to([-0.2, -0.1, 0])
        self.play(FadeIn(ok), run_time=0.4)
        self.wait(0.5)

        self.say("The human narrows it with update_agent. The next forward is refused.")
        self.play(FadeOut(ok), FadeOut(grant), run_time=0.3)
        grant_n = mono("user.can_call  {}", 18, RED).move_to([-0.2, 2.0, 0])
        self.play(FadeIn(grant_n), link.animate.set_color(RED), user.tinted(RED, 0.25), run_time=0.5)
        ref1 = mono('{"reason": "unauthorized", "side": "egress"}', 19, RED).move_to([-0.2, -0.1, 0])
        self.play(FadeIn(ref1, shift=UP * 0.1), run_time=0.5)
        self.wait(0.6)

        self.say("send is not a verb of the human. Use forward.")
        self.play(FadeOut(ref1), FadeOut(grant2), FadeOut(grant_n), run_time=0.3)
        s = mono('{"type": "send"} → user', 19, CYAN).move_to([0, 1.7, 0])
        r = mono('{"reason": "unhandled"}', 19, RED).move_to([0, -0.1, 0])
        self.play(FadeIn(s), user.tinted(BLUE, 0.16), link.animate.set_color(LINE), run_time=0.3)
        self.play(FadeIn(r, shift=UP * 0.1), run_time=0.5)
        self.finish()


class Inquiry(FScene):
    """An agent asks the person; the answer comes back later."""

    TITLE = "An inquiry is held, then answered"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ai = Node("ai_1", w=1.5, h=0.9, color=VIOLET, size=26).move_to([-5.0, 0.6, 0])
        user = Node("user", w=1.6, h=0.9, color=BLUE, size=26).move_to([0.2, 0.6, 0])
        book, bt = panel("open inquiries (RAM)", 3.6, 1.5, 4.5, 0.6)
        self.say("An agent sends user an inquiry and keeps working.")
        self.play(FadeIn(ai), FadeIn(user), FadeIn(book), FadeIn(bt), run_time=0.6)
        q = pill('inquiry {"kind": "confirm"}', color=CYAN, size=18).next_to(ai, UP, buff=0.4).shift(RIGHT * 0.9)
        self.play(FadeIn(q), run_time=0.3)
        self.play(q.animate.next_to(user, UP, buff=0.4), run_time=0.8)

        self.say("user accepts it at once and holds it, under re = its pid.")
        acc = pill('{"accepted": true, "re": 4655}', color=AMBER, size=18).move_to([-2.4, -0.7, 0])
        row = mono("re 4655 · ai_1 · confirm", 17, AMBER).move_to(book.get_center())
        self.play(FadeOut(q), FadeIn(row), user.tinted(AMBER, 0.3), run_time=0.4)
        self.play(FadeIn(acc), run_time=0.3)
        self.wait(0.5)

        self.say("The person answers: answer_inquiry {re, answer}.")
        ans = mono("answer_inquiry  re 4655 → yes", 18, CYAN).move_to([2.6, -1.4, 0])
        self.play(FadeIn(ans), run_time=0.4)
        self.play(FadeOut(row), FadeOut(acc), run_time=0.3)
        back = pill("[reply to 4655 · user inquiry]  yes", color=GREEN, size=18).move_to([-2.2, 0.0, 0])
        self.say("It arrives on the asker's own thread.")
        self.play(FadeIn(back), run_time=0.3)
        self.play(back.animate.next_to(ai, DOWN, buff=0.4).shift(RIGHT * 1.6), ai.tinted(GREEN, 0.3), run_time=0.9)
        self.finish()
