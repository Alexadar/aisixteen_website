"""Foundations — Agents › Credential store. Three clips, each one mechanism on fantastic main.

declare: a ref and its host are declared on the store by update_agent; set takes no host and is
         refused if given one; set stores {host, fields} and the record keeps only the names
         (credential_store lib.rs:631-696, 869-940; readme).
rotate:  an AI backend sends get {ref, host: endpoint} before every request; one set rotates the
         key; forget drops the value and keeps the declaration
         (fantastic-ai-core credentials.rs:154-182; lib.rs:698-743, 772-807).
backends: file (0600 YAML), keychain (service/account item) and env (read-only) hold the value
         (lib.rs:15-27, 395, 425-486, 486-525).
Ids, hosts and keys are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"declare": "CsDeclare", "rotate": "CsRotate", "backends": "CsBackends"}
OG = "backends"


def lines(rows, size=18, color=INK, buff=0.14):
    return VGroup(*[mono(r, size, c if isinstance(c, str) else color) if isinstance(r, str) else r
                    for r, c in [(x, color) if isinstance(x, str) else x for x in rows]]
                  ).arrange(DOWN, aligned_edge=LEFT, buff=buff)


class CsDeclare(FScene):
    """A ref is declared with its host; set takes no host."""

    TITLE = "Declare, then set"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        st = Node("creds", w=1.9, h=0.9, color=GREEN, size=26).move_to([-5.2, 0.6, 0])
        rc, rt = panel("record of creds", 6.6, 2.3, 2.6, 0.95)
        ac, at = panel("at rest (the backend)", 6.6, 1.4, 2.6, -1.55)
        self.play(FadeIn(st), FadeIn(rc), FadeIn(rt), FadeIn(ac), FadeIn(at), run_time=0.6)

        # 1. declare
        self.say("update_agent declares a ref with the one host it may go to.")
        m = pill("update_agent  refs", color=CYAN, size=19).move_to([-4.6, -0.95, 0])
        self.play(FadeIn(m, shift=UP * 0.1), run_time=0.4)
        self.play(m.animate.move_to([-3.2, -0.6, 0]), run_time=0.6)
        rec1 = lines(["refs:", "openai/main:", "host: api.openai.com"], size=18)
        rec1[1].shift(RIGHT * 0.3)
        rec1[2].shift(RIGHT * 0.6)
        rec1.next_to(rc.get_corner(UL), DR, buff=0.3)
        self.play(FadeOut(m), FadeIn(rec1), st.tinted(GREEN, 0.3), run_time=0.5)
        self.wait(0.5)

        # 2. set with a host: refused
        self.say("set takes no host. A send that names one is refused.")
        bad = pill("set  host: evil.example", color=CYAN, size=19).move_to([-4.6, -0.95, 0])
        self.play(FadeIn(bad, shift=UP * 0.1), run_time=0.4)
        self.play(bad.animate.move_to([-3.2, -0.6, 0]), run_time=0.5)
        err = mono("bad_arg · set takes no host", 18, RED).move_to([-3.9, -1.7, 0])
        self.play(bad[0].animate.set_stroke(RED), bad[1].animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(0.9)
        self.play(FadeOut(bad), FadeOut(err), run_time=0.3)

        # 3. set with fields
        self.say("set stores the value beside the declared host. The record keeps names only.")
        ok = pill("set  fields: api_key", color=CYAN, size=19).move_to([-4.6, -0.95, 0])
        self.play(FadeIn(ok, shift=UP * 0.1), run_time=0.4)
        self.play(ok.animate.move_to([-3.2, -0.6, 0]), run_time=0.5)
        rest = lines(["host: api.openai.com", "fields: {api_key: <value>}"], size=18, color=AMBER).move_to(ac).align_to(ac, LEFT).shift(RIGHT * 0.4)
        names = mono("fields: [api_key]", 18, GREEN).next_to(rec1, DOWN, buff=0.14).align_to(rec1[2], LEFT)
        self.play(FadeOut(ok), FadeIn(rest), FadeIn(names), run_time=0.6)
        self.wait(0.6)
        self.finish()


class CsRotate(FScene):
    """The key is read on every request; rotate and forget need no restart."""

    TITLE = "Read on every request"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ai = Node("ai agent", w=2.2, h=0.9, color=VIOLET, size=24).move_to([-5.2, 0.9, 0])
        cs = Node("creds", w=1.8, h=0.9, color=GREEN, size=26).move_to([-0.2, 0.9, 0])
        hs = Node("api.openai.com", w=3.0, h=0.9, color=BLUE, size=21).move_to([4.7, 0.9, 0])
        self.play(FadeIn(ai), FadeIn(cs), FadeIn(hs), run_time=0.5)
        status = mono("openai/main · value: key-A", 20, MUTED).move_to([0, -1.9, 0])
        self.play(FadeIn(status), run_time=0.3)

        def request(key, ok=True):
            g = pill("get  host: api.openai.com", color=CYAN, size=18).move_to([-2.7, 1.95, 0])
            self.play(FadeIn(g, shift=UP * 0.1), run_time=0.3)
            self.play(g.animate.move_to([-2.7, 1.95, 0]).scale(0.96), run_time=0.2)
            if ok:
                r = pill(key, color=AMBER, size=18).move_to([-2.7, 1.95, 0])
                self.play(FadeTransform(g, r), run_time=0.4)
                self.play(r.animate.move_to([4.7, 1.95, 0]), run_time=0.7, rate_func=smooth)
                self.play(hs.tinted(GREEN, 0.3), run_time=0.25)
                self.play(FadeOut(r), hs.tinted(BLUE, 0.16), run_time=0.3)
            else:
                e = mono("not_found · has no value in the backend", 18, RED).move_to([0.9, 1.95, 0])
                self.play(FadeTransform(g, e), cs.tinted(RED, 0.2), run_time=0.4)
                self.wait(1.0)

        self.say("Before each request the agent sends get with the endpoint's host.")
        request("key-A")
        self.say("One set rotates the key. The next request reads the new one.")
        new = mono("openai/main · value: key-B", 20, GREEN).move_to(status)
        self.play(FadeTransform(status, new), run_time=0.5)
        status = new
        request("key-B")
        self.say("forget drops the value. The declaration stays.")
        gone = mono("openai/main · host: api.openai.com · no value", 20, AMBER).move_to(status)
        self.play(FadeTransform(status, gone), run_time=0.5)
        request("", ok=False)
        self.wait(0.4)
        self.finish()


class CsBackends(FScene):
    """Three places a value can rest."""

    TITLE = "Where the value rests"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        specs = [
            ("file", GREEN, -4.5, ["<home>/user/", "credentials/<id>.yaml", "mode 0600", "{host, fields}"]),
            ("keychain", VIOLET, 0.0, ["service: fantastic", "account: <id>/<ref>", "item: {host, fields}"]),
            ("env", AMBER, 4.5, ["api_key ← $OPENAI_KEY", "read-only", "nothing at rest"]),
        ]
        cards = []
        notes = {
            "file": "The default: one YAML file, written 0600.",
            "keychain": "One OS keychain item per ref.",
            "env": "Read-only: the ref names the variable.",
        }
        for name, col, x, rows in specs:
            c = card(3.9, 2.8, stroke=col).move_to([x, 0.2, 0])
            t = mono(name, 24, col, weight=BOLD).move_to([x, 1.2, 0])
            body = lines(rows, size=17, color=INK, buff=0.16).move_to([x, 0.0, 0])
            cards.append((name, c, t, body))
        for name, c, t, body in cards:
            self.say(notes[name])
            self.play(FadeIn(c), FadeIn(t), FadeIn(body), run_time=0.6)
            self.wait(0.7)
        self.say("File and keychain take all four verbs; env is read-only. A get still has to match the declared host.")
        verbs = pill("set · get · list · forget", color=CYAN, size=19).move_to([-2.25, -2.3, 0])
        ro = pill("get · list", color=AMBER, size=19).move_to([4.5, -2.3, 0])
        self.play(FadeIn(verbs), FadeIn(ro), run_time=0.5)
        self.wait(0.6)
        self.finish()
