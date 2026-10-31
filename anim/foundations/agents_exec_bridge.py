"""Foundations — Agents › Exec bridge. Three clips, each one mechanism on fantastic main.

jobs:     start returns {job_id, status: running} at once; progress lines; job_done; stop
          SIGKILLs the whole session (R/readme.md:30-33,54-57; R/lib.rs:295-297; R/spawn.rs:63-70).
terminal: start with pty {cols, rows} and no command runs the child's $SHELL; write/output;
          ack flow control, pause past 100,000 unacked, resume under 5,000
          (R/lib.rs:944-985; R/pty.rs:26-30,148-170,330-352).
wire:     the child's send frame crosses FANTASTIC_CTRL_FD; the relay sends it as the runner and
          the call gate judges the runner (R/relay.rs:394-432; R/lib.rs:1108-1113).
Ids, commands and targets are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, mono, pill, txt,
)

CLIPS = {"jobs": "ExecJobs", "terminal": "ExecTerminal", "wire": "ExecWire"}
OG = "terminal"


def link(a, b):
    return DashedLine(a.get_right(), b.get_left(), color=LINE, dash_length=0.14, stroke_width=3)


class ExecJobs(FScene):
    """A start is a job: id at once, progress lines, job_done; stop kills the session."""

    TITLE = "A start is a job"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        run = Node("runner", w=1.9, h=0.9, color=AMBER, size=26).move_to([-5.2, 0.4, 0])
        j1 = Node("job 41", w=1.8, h=0.7, color=BLUE, size=24).move_to([-1.6, 1.2, 0])
        j2 = Node("job 42", w=1.8, h=0.7, color=BLUE, size=24).move_to([-1.6, -0.9, 0])
        X = 0.6

        def row(s, y, c):
            return mono(s, 19, c).move_to([0, y, 0]).align_to([X, 0, 0], LEFT)

        self.say("start returns a job id at once. The command runs in the background.")
        self.play(FadeIn(run), run_time=0.4)
        q = pill("start ffmpeg -i in.mp4 out.webm", color=CYAN, size=18).move_to([-4.0, 2.3, 0])
        self.play(FadeIn(q, shift=UP * 0.1), run_time=0.4)
        r = row('{job_id: 41, status: "running"}', 2.05, GREEN)
        self.play(FadeIn(j1), Create(link(run, j1)), FadeIn(r), run_time=0.6)
        self.wait(0.5)

        self.say("Output arrives as progress events, then job_done.")
        p1 = row("progress n=1 frame=24", 1.45, MUTED)
        p2 = row("progress n=2 frame=48", 1.05, MUTED)
        self.play(FadeIn(p1), run_time=0.35)
        self.play(FadeIn(p2), run_time=0.35)
        d = row("job_done exit_code=0 ok", 0.65, GREEN)
        self.play(FadeIn(d), j1.tinted(GREEN, 0.3), run_time=0.45)
        self.wait(0.7)

        self.say("stop sends SIGKILL to the job's whole session.")
        self.play(FadeIn(j2), Create(link(run, j2)), run_time=0.5)
        s = pill("stop 42", color=RED, size=18).move_to([-4.2, -0.5, 0])
        self.play(FadeIn(s, shift=UP * 0.1), run_time=0.4)
        k = row("SIGKILL: command and children", -0.6, RED)
        self.play(j2.tinted(RED, 0.3), FadeIn(k), run_time=0.45)
        e = row("status: stopped", -1.1, RED)
        self.play(FadeIn(e), run_time=0.4)
        t = row("tail 41 -> last 256 KiB kept", -1.9, CYAN)
        self.play(FadeIn(t), run_time=0.4)
        self.finish()


class ExecTerminal(FScene):
    """A terminal is a PTY job; ack is flow control."""

    TITLE = "A terminal on a pseudo-terminal"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        vw = Node("viewer", w=1.9, h=0.9, color=CYAN, size=26).move_to([-5.2, 0.6, 0])
        jb = Node("job 7 · $SHELL", w=3.6, h=0.9, color=BLUE, size=24).move_to([2.2, 0.6, 0])

        self.say("start with pty and no command runs the child's own $SHELL.")
        self.play(FadeIn(vw), run_time=0.4)
        q = pill("start {pty: {cols: 80, rows: 24}}", color=CYAN, size=18).move_to([-2.6, 1.9, 0])
        self.play(FadeIn(q, shift=UP * 0.1), run_time=0.4)
        self.play(FadeIn(jb), Create(link(vw, jb)), run_time=0.5)
        self.wait(0.5)
        self.play(FadeOut(q), run_time=0.2)

        self.say("write types into it. output events carry what it prints.")
        w = pill("write {data: ls}", color=CYAN, size=18).move_to([-2.6, 1.5, 0])
        self.play(FadeIn(w), run_time=0.3)
        self.play(w.animate.move_to([0.2, 1.5, 0]), run_time=0.6)
        self.play(FadeOut(w), jb.tinted(GREEN, 0.25), run_time=0.3)
        o = pill("output {data: README.md src/}", color=GREEN, size=18).move_to([0.2, -0.4, 0])
        self.play(FadeIn(o, shift=DOWN * 0.1), run_time=0.4)
        self.play(o.animate.move_to([-3.4, -0.4, 0]), run_time=0.7)
        self.wait(0.4)
        self.play(FadeOut(o), run_time=0.2)

        self.say("Past 100,000 unacked characters the reader pauses.")
        c1 = mono("unacked 104,200", 24, RED).move_to([-0.2, -1.5, 0])
        c1b = mono("PAUSED", 22, RED).move_to([3.6, -1.5, 0])
        self.play(FadeIn(c1), FadeIn(c1b), jb.tinted(RED, 0.25), run_time=0.5)
        self.wait(0.9)

        self.say("ack lowers the count. Under 5,000 the reader resumes.")
        a = pill("ack {chars: 101,000}", color=CYAN, size=18).move_to([-3.4, -0.6, 0])
        self.play(FadeIn(a, shift=UP * 0.1), run_time=0.3)
        self.play(a.animate.move_to([0.2, -0.6, 0]), run_time=0.6)
        c2 = mono("unacked 3,200", 24, GREEN).move_to([-0.2, -1.5, 0])
        c2b = mono("RESUMED", 22, GREEN).move_to([3.6, -1.5, 0])
        self.play(FadeOut(a), FadeTransform(c1, c2), FadeTransform(c1b, c2b), jb.tinted(GREEN, 0.3), run_time=0.6)
        was = mono("was 104,200", 17, DIM).move_to([-0.2, -2.0, 0])
        self.play(FadeIn(was), run_time=0.3)
        self.finish()


class ExecWire(FScene):
    """The control wire: a child's send is judged as the runner."""

    TITLE = "The control wire"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        ch = Node("child", w=1.6, h=0.9, color=VIOLET, size=26).move_to([-5.3, 0.5, 0])
        rn = Node("runner", w=1.9, h=0.9, color=AMBER, size=26).move_to([-0.6, 0.5, 0])
        st = Node("store", w=1.6, h=0.7, color=GREEN, size=24).move_to([5.0, 1.4, 0])
        ot = Node("other", w=1.6, h=0.7, color=BLUE, size=24).move_to([5.0, -0.4, 0])
        l1 = Line(ch.get_right(), rn.get_left(), color=CYAN, stroke_width=3)
        l2 = DashedLine(rn.get_right(), st.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        l3 = DashedLine(rn.get_right(), ot.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        fd = mono("FANTASTIC_CTRL_FD", 17, DIM).move_to([-2.95, 0.05 + 0.0, 0]).shift(DOWN * 0.6)
        rule = mono("runner.can_call: store", 19, AMBER).move_to([-0.6, -2.1, 0])

        self.say("The child gets one open socket to the spawner.")
        self.play(FadeIn(ch), FadeIn(rn), Create(l1), FadeIn(fd), run_time=0.7)
        self.wait(0.4)
        self.play(FadeIn(st), FadeIn(ot), Create(l2), Create(l3), FadeIn(rule), run_time=0.6)

        self.say("A send frame crosses it. The runner relays it as itself.")
        f = pill('send rid 7 -> store', color=CYAN, size=17).move_to([-3.0, 1.6, 0])
        self.play(FadeIn(f, shift=UP * 0.1), run_time=0.4)
        self.play(f.animate.move_to([-0.6, 1.6, 0]), run_time=0.7)
        self.play(f.animate.move_to([3.0, 1.9, 0]), run_time=0.8)
        self.play(FadeOut(f), st.tinted(GREEN, 0.3), run_time=0.3)

        self.say("The gate allows it, so the reply returns on the same fd.")
        rp = pill("reply rid 7", color=GREEN, size=17).move_to([3.0, 1.9, 0])
        self.play(FadeIn(rp), run_time=0.3)
        self.play(rp.animate.move_to([-3.0, 1.0, 0]), run_time=1.1, rate_func=smooth)
        self.wait(0.5)
        self.play(FadeOut(rp), run_time=0.2)

        self.say("other is not in the runner's can_call, so that send is refused.")
        f2 = pill('send rid 8 -> other', color=CYAN, size=17).move_to([-3.0, 1.6, 0])
        self.play(FadeIn(f2), run_time=0.3)
        self.play(f2.animate.move_to([-0.6, 1.6, 0]), run_time=0.6)
        self.play(f2.animate.move_to([1.7, -0.35, 0]).set_color(RED), ot.tinted(RED, 0.25), run_time=0.8)
        bad = mono("rid 8 -> unauthorized", 19, RED).move_to([2.6, -1.0, 0])
        self.play(FadeIn(bad), run_time=0.4)
        self.finish()
