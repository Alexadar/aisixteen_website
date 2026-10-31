"""Foundations — Kernel › Bundles and twin runtimes. 3 clips, one mechanism each.

resolve: handler_module -> Rust registry / Python entry-point catalog; unknown name refused
         (rust bundle.rs:3-8, 363-381; send.rs:233-239; python _bundles.py:104-133).
folder:  bundle.yaml loads at boot, checks, then an instance starts the program (hello)
         (folders.rs:35-122; kernel_state tools.py:147-204; py_agent tools.py:1-20).
twin:    the same reflect to both kernels; same 14 kernel verbs; only `runtime` differs
         (reflect.rs:343; _agent.py:1717; kernel_verbs.rs:15-47; _agent.py:129-161).
Ids and file names are illustrative; shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"resolve": "BResolve", "folder": "BFolder", "twin": "BTwin"}
OG = "resolve"


class BResolve(FScene):
    """A handler_module resolves in the Rust registry or the Python entry-point catalog."""

    TITLE = "From handler_module to code"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        rec = VGroup(mono("handler_module", 18, DIM), mono('"file_bridge.tools"', 22, AMBER)).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
        rc = card(rec.width + 0.5, rec.height + 0.4, stroke=AMBER, fill=AMBER, opacity=0.1).move_to([-4.6, 0.3, 0])
        rec.move_to(rc)
        self.say("An agent's record names a handler_module.")
        self.play(FadeIn(VGroup(rc, rec)), run_time=0.5)

        rust = Node("Rust: linked registry", w=4.4, color=BLUE, size=20).move_to([0.5, 1.2, 0])
        py = Node("Python: entry points", w=4.4, color=BLUE, size=20).move_to([0.5, -0.6, 0])
        bundle = Node("file_bridge", w=2.2, color=GREEN, size=22).move_to([5.0, 0.3, 0])
        a1 = Arrow(rc.get_right(), rust.get_left(), buff=0.12, color=CYAN, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        a2 = Arrow(rc.get_right(), py.get_left(), buff=0.12, color=CYAN, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        self.say("Rust looks it up in a registry of crates linked at build time.")
        self.play(FadeIn(rust), Create(a1), run_time=0.7)
        self.say("Python finds it in the fantastic.bundles entry-point catalog.")
        self.play(FadeIn(py), Create(a2), run_time=0.7)
        b1 = Arrow(rust.get_right(), bundle.get_left(), buff=0.12, color=GREEN, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        b2 = Arrow(py.get_right(), bundle.get_left(), buff=0.12, color=GREEN, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        self.say("Both reach the same bundle.")
        self.play(FadeIn(bundle), Create(b1), Create(b2), run_time=0.8)
        self.wait(0.6)

        bad = pill("absent_bundle.tools", AMBER, 20).move_to([-3.9, -2.0, 0])
        err = pill("No module named 'absent_bundle'", RED, 20).move_to([2.4, -2.0, 0])
        ar = Arrow(bad.get_right(), err.get_left(), buff=0.12, color=RED, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        self.say("A name in neither is refused with the same text.")
        self.play(FadeIn(bad), Create(ar), FadeIn(err), run_time=0.8)
        self.finish()


class BFolder(FScene):
    """A folder bundle: checked at boot, then an instance starts its program."""

    TITLE = "A folder bundle loads at boot"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        c, t = panel("bundles/notes/bundle.yaml", 5.4, 2.3, -4.0, y=0.3)
        lines = VGroup(
            mono("base: py_agent", 20, CYAN),
            mono("sentence: Keeps short notes.", 20, INK),
            mono("command: [python3, agent.py]", 20, INK),
            mono("verbs: {add: ...}", 20, INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.16).move_to(c)
        self.say("At boot the kernel reads the folder's bundle.yaml.")
        self.play(FadeIn(c), FadeIn(t), FadeIn(lines), run_time=0.6)
        self.wait(0.5)

        chk = [pill("name is valid", GREEN, 19), pill("not a built-in", GREEN, 19), pill("base + sentence", GREEN, 19)]
        col = VGroup(*chk).arrange(DOWN, aligned_edge=LEFT, buff=0.2).move_to([3.2, 0.9, 0])
        reg = pill("registered: notes", GREEN, 20).move_to([3.2, -0.9, 0])
        self.say("It checks the name, that it shadows no built-in, then base and sentence.")
        self.play(LaggedStart(*[FadeIn(p, shift=RIGHT * 0.1) for p in chk], lag_ratio=0.4), run_time=1.4)
        self.play(FadeIn(reg, shift=UP * 0.1), run_time=0.4)
        self.wait(0.5)

        inst = Node("notes_1", w=2.0, color=BLUE, size=22).move_to([1.4, 0.7, 0])
        prog = Node("agent.py", w=2.0, color=AMBER, size=22).move_to([5.0, 0.7, 0])
        link = Line(inst.get_right(), prog.get_left(), color=LINE, stroke_width=2.4)
        self.say("An instance starts the program and waits for its hello.")
        self.play(FadeOut(col), FadeOut(reg), run_time=0.4)
        self.play(FadeIn(inst), FadeIn(prog), Create(link), run_time=0.7)
        hello = pill('{"op": "hello", "verbs": ["add"]}', CYAN, 18).move_to(prog.get_top() + UP * 0.55 + LEFT * 1.2)
        self.play(FadeIn(hello), run_time=0.3)
        self.play(hello.animate.move_to(inst.get_top() + UP * 0.55 + RIGHT * 1.2), run_time=0.9)
        ok = pill("verbs match bundle.yaml", GREEN, 19).move_to([3.2, -0.7, 0])
        self.play(inst.tinted(GREEN, 0.3), FadeIn(ok), FadeOut(hello), run_time=0.5)
        self.say("The verbs equal bundle.yaml's, so the agent is live.", wait=0.3)
        self.finish()


class BTwin(FScene):
    """The same reflect goes to a Rust and a Python kernel; only `runtime` differs."""

    TITLE = "Rust and Python, one set of verbs"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        send = pill('[{"target": "kernel", "payload": {"type": "reflect"}}]', CYAN, 19).move_to([0, 1.7, 0])
        rk = Node("Rust kernel", w=3.0, color=BLUE, size=22).move_to([-3.6, 0.4, 0])
        pk = Node("Python kernel", w=3.0, color=BLUE, size=22).move_to([3.6, 0.4, 0])
        a1 = Arrow(send.get_bottom() + LEFT * 1.5, rk.get_top(), buff=0.1, color=CYAN, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        a2 = Arrow(send.get_bottom() + RIGHT * 1.5, pk.get_top(), buff=0.1, color=CYAN, stroke_width=3, max_tip_length_to_length_ratio=0.2)
        self.say("The same message goes to both kernels.")
        self.play(FadeIn(send), FadeIn(rk), FadeIn(pk), Create(a1), Create(a2), run_time=0.9)
        self.wait(0.4)

        r1 = pill('"runtime": "rust"', GREEN, 20).next_to(rk, DOWN, buff=0.3)
        r2 = pill('"runtime": "python"', GREEN, 20).next_to(pk, DOWN, buff=0.3)
        self.say("Each reports a runtime field. Only its value differs.")
        self.play(FadeIn(r1, shift=DOWN * 0.1), FadeIn(r2, shift=DOWN * 0.1), run_time=0.6)
        self.wait(0.6)

        verbs = VGroup(
            mono("create_agent  delete_agent  update_agent  list_agents  ps", 18, INK),
            mono("cancel  ledger  ack_deadletter  kernel_start  shutdown_agents", 18, INK),
            mono("kernel_stop  await_set  await_cancel  docs", 18, INK),
        ).arrange(DOWN, buff=0.14)
        vc = card(verbs.width + 0.7, verbs.height + 0.5, stroke=LINE).move_to([0, -2.0, 0])
        verbs.move_to(vc)
        lab = mono("the same 14 kernel verbs", 18, DIM).next_to(vc, UP, buff=0.12).align_to(vc, LEFT)
        self.say("Both answer the same fourteen kernel verbs.")
        self.play(FadeIn(vc), FadeIn(verbs), FadeIn(lab), run_time=0.7)
        self.finish()
