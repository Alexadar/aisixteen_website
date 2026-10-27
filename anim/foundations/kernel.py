"""Foundations 1 — Kernel: agents and messaging. Five clips, each one mechanism.

Every step drawn here is a behaviour of the fantastic kernel on origin/main (Rust and
Python twins). Ids and agent names are illustrative; shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, PANEL_HI, RED, VIOLET,
    FScene, Node, card, connector, mono, pill, txt,
)


def panel(title, w, h, x, y=0.15):
    c = card(w, h).move_to([x, y, 0])
    t = mono(title, size=17, color=DIM).next_to(c, UP, buff=0.14).align_to(c, LEFT).shift(RIGHT * 0.06)
    return c, t


class K1Batch(FScene):
    """One batch, many calls: registered at once, run concurrently, answered in input order."""

    EYEBROW = "Fantastic kernel"
    TITLE = "One send, a batch of calls"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        xs = (-4.5, 0, 4.5)
        W, H = 4.2, 3.4
        pa, ta = panel("send  [items]", W, H, xs[0])
        pb, tb = panel("ps  ·  task table", W, H, xs[1])
        pc, tc = panel("reply  ·  input order", W, H, xs[2])
        items = [("notes", "reflect"), ("kernel", "list_agents"), ("kernel", "ps")]
        rows_y = (1.0, 0.15, -0.7)

        item_rows = VGroup(*[
            VGroup(mono(f"{i + 1}", 20, DIM), mono(f"{t}", 21, CYAN), mono(f"· {v}", 21, INK)).arrange(RIGHT, buff=0.16)
            .move_to([xs[0], y, 0]).align_to(pa, LEFT).shift(RIGHT * 0.3)
            for i, ((t, v), y) in enumerate(zip(items, rows_y))
        ])
        self.say("A model's turn fans out into three calls: one send, one batch.")
        self.play(FadeIn(pa), FadeIn(ta), LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in item_rows], lag_ratio=0.25), run_time=1.0)
        self.wait(0.6)

        # launch: the whole batch is registered before the first await
        self.say("The kernel registers the whole batch first: three tasks in ps before any reply.")
        self.play(FadeIn(pb), FadeIn(tb), FadeIn(pc), FadeIn(tc), run_time=0.4)
        pids = (41, 42, 43)
        task_rows, bars, tracks = VGroup(), [], []
        for (t, v), y, pid in zip(items, rows_y, pids):
            r = VGroup(mono(str(pid), 21, AMBER), mono(t, 21, CYAN), mono(v, 21, INK)).arrange(RIGHT, buff=0.18)
            r.move_to([xs[1], y + 0.12, 0]).align_to(pb, LEFT).shift(RIGHT * 0.28)
            track = Line([xs[1] - 1.75, y - 0.25, 0], [xs[1] + 1.75, y - 0.25, 0], color=LINE, stroke_width=6)
            task_rows.add(r)
            tracks.append(track)
        flights = [Dot(item_rows[i].get_right() + RIGHT * 0.1, radius=0.07, color=CYAN) for i in range(3)]
        self.play(*[FadeIn(d) for d in flights], run_time=0.2)
        self.play(*[d.animate.move_to(task_rows[i].get_left() + LEFT * 0.15) for i, d in enumerate(flights)],
                  run_time=0.6, rate_func=smooth)
        self.play(*[FadeOut(d) for d in flights], *[FadeIn(r) for r in task_rows], *[Create(t) for t in tracks], run_time=0.35)
        self.wait(0.7)

        # run concurrently; finish in any order (3, then 1, then 2)
        self.say("They run concurrently and finish in any order...")
        slots = []
        for i, y in enumerate(rows_y):
            s = VGroup(mono(f"{i + 1}", 20, DIM), mono("...", 21, FAINT)).arrange(RIGHT, buff=0.3)
            s.move_to([xs[2], y, 0]).align_to(pc, LEFT).shift(RIGHT * 0.3)
            slots.append(s)
        self.play(*[FadeIn(s) for s in slots], run_time=0.3)
        fill = [Line(t.get_start(), t.get_start() + RIGHT * 0.001, color=CYAN, stroke_width=6) for t in tracks]
        for f in fill:
            self.add(f)
        speeds = (1.0, 1.0, 1.0)
        finish_order = (2, 0, 1)
        lengths = [t.get_length() for t in tracks]

        def grow(i, frac):
            s = tracks[i].get_start()
            return Line(s, s + RIGHT * max(lengths[i] * frac, 0.001), color=CYAN, stroke_width=6)

        # three stages: each stage completes one more task
        progress = [0.0, 0.0, 0.0]
        targets = ([0.55, 0.4, 1.0], [1.0, 0.75, 1.0], [1.0, 1.0, 1.0])
        for stage, done in zip(targets, finish_order):
            anims = []
            for i in range(3):
                if progress[i] < 1.0:
                    anims.append(Transform(fill[i], grow(i, stage[i])))
            self.play(*anims, run_time=0.9, rate_func=linear)
            progress = list(stage)
            out = VGroup(mono(f"{done + 1}", 20, DIM), mono(f"pid {pids[done]}", 21, AMBER),
                         mono("completed", 21, GREEN)).arrange(RIGHT, buff=0.3)
            out.move_to(slots[done]).align_to(slots[done], LEFT)
            self.play(FadeOut(task_rows[done]), FadeOut(fill[done]), FadeOut(tracks[done]),
                      FadeTransform(slots[done], out), run_time=0.45)
            slots[done] = out
        self.wait(0.3)
        self.say("...but the reply keeps input order: one {pid, status, result} per item.", color=INK)
        shape = mono('[{pid, status, result}, ...]', 20, MUTED).next_to(pc, DOWN, buff=0.22)
        self.play(FadeIn(shape, shift=UP * 0.1), Indicate(VGroup(*slots), color=GREEN, scale_factor=1.04), run_time=0.8)
        self.finish(2.4)


class K2Gate(FScene):
    """Two keys, one door: egress (sender's can_call) and ingress (target's callable_by)."""

    EYEBROW = "Fantastic kernel"
    TITLE = "The call gate: both ends must grant"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.55
        a = Node("a", w=1.4, h=1.0, color=BLUE, size=34).move_to([-5.5, Y, 0])
        b = Node("b", w=1.4, h=1.0, color=VIOLET, size=34).move_to([5.5, Y, 0])
        eg_x, in_x = -2.3, 2.3
        wire = DashedLine(a.get_right(), b.get_left(), color=LINE, dash_length=0.14, stroke_width=3)

        def gate(x, label):
            post_t = Line([x, Y + 0.75, 0], [x, Y + 0.25, 0], color=DIM, stroke_width=7)
            post_b = Line([x, Y - 0.25, 0], [x, Y - 0.75, 0], color=DIM, stroke_width=7)
            lab = mono(label, 20, DIM).move_to([x, Y + 1.1, 0])
            return VGroup(post_t, post_b, lab)

        g1, g2 = gate(eg_x, "egress"), gate(in_x, "ingress")
        L, R = -6.55, 6.55

        def grant_a(s, color):
            return mono(f"a.can_call    {s}", 21, color).move_to([0, -0.85, 0]).align_to([L, 0, 0], LEFT)

        def grant_b(s, color):
            return mono(f"b.callable_by {s}", 21, color).move_to([0, -1.45, 0]).align_to([R, 0, 0], RIGHT)

        can = grant_a('{"$self": "*"}', MUTED)
        cby = grant_b('{"$self": "*"}', MUTED)
        msg_y = -2.35
        self.say("Agent a sends reflect to b. Every agent send passes two checks.")
        self.play(FadeIn(a), FadeIn(b), Create(wire), FadeIn(g1), FadeIn(g2), FadeIn(can), FadeIn(cby), run_time=0.9)
        self.wait(0.5)

        def shoot(stop_x):
            d = Dot(a.get_right(), radius=0.12, color=CYAN)
            self.add(d)
            self.play(d.animate.move_to([stop_x, Y, 0]), run_time=0.7, rate_func=smooth)
            return d

        # 1: nothing granted on a's side -> refused at egress
        self.say("Egress: the sender's can_call must name (b, reflect). It does not.")
        d = shoot(eg_x - 0.3)
        err = mono('side: "egress" · a may not call \'reflect\' on b', 21, RED).move_to([0, msg_y, 0])
        self.play(d.animate.set_color(RED), g1.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.1)
        self.play(FadeOut(d), FadeOut(err), g1.animate.set_color(DIM), run_time=0.3)

        # 2: a grants, b does not -> refused at ingress
        self.play(FadeTransform(can, grant_a('{"$self": "*", "b": ["reflect"]}', GREEN)), run_time=0.5)
        self.say("Now a may call it. Ingress: b's callable_by must name (a, reflect).")
        d = shoot(in_x - 0.3)
        self.play(g1.animate.set_color(GREEN), run_time=0.01)
        err = mono('side: "ingress" · b does not accept \'reflect\' from a', 21, RED).move_to([0, msg_y, 0])
        self.play(d.animate.set_color(RED), g2.animate.set_color(RED), FadeIn(err), run_time=0.4)
        self.wait(1.1)
        self.play(FadeOut(d), FadeOut(err), g2.animate.set_color(DIM), run_time=0.3)

        # 3: both grant -> the call passes; the edge is one-way
        self.play(FadeTransform(cby, grant_b('{"$self": "*", "a": ["reflect"]}', GREEN)), run_time=0.5)
        self.say("Both ends grant: the call passes. One edge, one way, one verb.", color=INK)
        d = Dot(a.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(b.get_left()), g2.animate.set_color(GREEN), run_time=1.0, rate_func=smooth)
        self.play(FadeOut(d), b.tinted(GREEN), run_time=0.3)
        ok = mono('status: "completed"', 21, GREEN).move_to([0, msg_y, 0])
        self.play(FadeIn(ok), run_time=0.3)
        self.wait(1.2)

        # operator sends skip the gate
        op = Node("operator · CLI", h=0.66, color=AMBER, size=21).move_to([3.4, 2.35, 0])
        self.say("Operator sends (the CLI, a test driver) are the root of trust and skip the gate.")
        self.play(FadeIn(op), FadeOut(ok), run_time=0.4)
        d = Dot(op.get_right(), radius=0.12, color=AMBER)
        self.add(d)
        self.play(d.animate.move_to(b.get_top()), run_time=0.6)
        self.play(FadeOut(d), Indicate(b, color=AMBER, scale_factor=1.06), run_time=0.4)
        self.finish(2.0)


class K3Cancel(FScene):
    """cancel kills a task and its subtree: hooks first while alive, then leaves-up abort."""

    EYEBROW = "Fantastic kernel"
    TITLE = "cancel: a task and its subtree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        s = 22
        t41 = Node("41 lead", color=BLUE, size=s).move_to([-2.5, 1.55, 0])
        t42 = Node("42 planner", color=BLUE, size=s).move_to([-4.0, 0.25, 0])
        t45 = Node("45 notes", color=BLUE, size=s).move_to([-0.6, 0.25, 0])
        t43 = Node("43 exec_bridge", color=BLUE, size=s).move_to([-5.0, -1.05, 0])
        t44 = Node("44 model", color=BLUE, size=s).move_to([-2.3, -1.05, 0])
        e = [connector(t41, t42), connector(t41, t45), connector(t42, t43), connector(t42, t44)]
        proc = pill("child process", AMBER, 18).next_to(t43, DOWN, buff=0.2)
        gen = pill("generating", AMBER, 18).next_to(t44, DOWN, buff=0.2)
        self.say("A send made inside a handler is a child task: work forms a tree, like processes.")
        self.play(LaggedStart(FadeIn(t41), AnimationGroup(Create(e[0]), Create(e[1])), FadeIn(t42), FadeIn(t45),
                              AnimationGroup(Create(e[2]), Create(e[3])), FadeIn(t43), FadeIn(t44), lag_ratio=0.2), run_time=1.4)
        self.play(FadeIn(proc), FadeIn(gen), run_time=0.4)
        self.wait(0.7)

        X = 1.3
        cmd = VGroup(mono("operator:", 19, DIM), mono('{"type": "cancel",', 22, AMBER), mono(' "task_id": 42}', 22, AMBER))
        cmd.arrange(DOWN, aligned_edge=LEFT, buff=0.12).move_to([0, 1.3, 0]).align_to([X, 0, 0], LEFT)
        self.play(FadeIn(cmd, shift=LEFT * 0.2), run_time=0.4)
        sub = VGroup(t42, t43, t44)
        self.say("Phase 1: every on_cancel hook in the subtree runs while all its tasks are alive.")
        self.play(*[n.tinted(AMBER) for n in sub], run_time=0.4)
        k1, k2 = pill("SIGKILL", RED, 18).move_to(proc), pill("closed · done", RED, 18).move_to(gen)
        self.play(FadeTransform(proc, k1), FadeTransform(gen, k2), run_time=0.6)
        proc, gen = k1, k2
        self.wait(0.9)

        self.say("Phase 2: the tasks abort, leaves first. The sibling and the parent keep running.")
        self.play(FadeOut(t43), FadeOut(t44), FadeOut(proc), FadeOut(gen), FadeOut(e[2]), FadeOut(e[3]), run_time=0.6)
        self.play(FadeOut(t42), FadeOut(e[0]), run_time=0.5)
        self.wait(0.3)

        r1 = VGroup(mono("cancel replies", 19, DIM), mono('{"cancelled": true,', 22, GREEN),
                    mono(' "killed": [...]}', 22, GREEN)).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        r2 = VGroup(mono("lead's send to 42 settles", 19, DIM),
                    mono('status: "cancelled"', 22, AMBER)).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        res = VGroup(r1, r2).arrange(DOWN, aligned_edge=LEFT, buff=0.4).move_to([0, -1.05, 0]).align_to([X, 0, 0], LEFT)
        self.play(FadeIn(res, shift=UP * 0.1), Indicate(t45, color=GREEN, scale_factor=1.06), run_time=0.7)
        self.say("The waiting caller gets a cancelled outcome. Nothing raises.", color=INK)
        self.finish(2.4)


class K4Delete(FScene):
    """delete_agent cascades deepest-first; delete_lock refuses; grants naming the dead are pruned."""

    EYEBROW = "Fantastic kernel"
    TITLE = "delete_agent: the whole subtree"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        s = 22
        root = Node("kernel_state", color=BRAND, size=s).move_to([-3.3, 1.6, 0])
        team = Node("team", color=BLUE, size=s).move_to([-4.9, 0.35, 0])
        x = Node("x", w=1.0, color=BLUE, size=s).move_to([-1.5, 0.35, 0])
        wr = Node("writer", color=BLUE, size=s).move_to([-6.0, -0.95, 0])
        rv = Node("reviewer", color=BLUE, size=s).move_to([-3.75, -0.95, 0])
        e = [connector(root, team), connector(root, x), connector(team, wr), connector(team, rv)]
        lock = pill("delete_lock", AMBER, 17).next_to(rv, DOWN, buff=0.18)
        grants = VGroup(mono("x.can_call", 19, DIM), mono('{"$self": "*", "writer": ["reflect"]}', 20, MUTED))
        grants.arrange(DOWN, aligned_edge=LEFT, buff=0.1).move_to([0, -2.2, 0]).align_to([-6.55, 0, 0], LEFT)
        self.say("A tree of agents. reviewer carries delete_lock; x may call writer.")
        self.play(FadeIn(root), *[Create(l) for l in e[:2]], FadeIn(team), FadeIn(x), run_time=0.6)
        self.play(*[Create(l) for l in e[2:]], FadeIn(wr), FadeIn(rv), FadeIn(lock), FadeIn(grants), run_time=0.6)
        self.wait(0.6)

        # a console on the right: each operator call, then its reply
        X, top = 0.4, 1.9
        log = VGroup()

        def put(*lines):
            g = VGroup(*lines).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
            if len(log):
                g.next_to(log, DOWN, buff=0.22, aligned_edge=LEFT)
            else:
                g.move_to([0, top, 0]).align_to([X, 0, 0], LEFT).shift(DOWN * g.height / 2)
            g.align_to([X, 0, 0], LEFT)
            log.add(g)
            self.play(FadeIn(g, shift=UP * 0.1), run_time=0.4)
            return g

        put(mono('delete_agent {"id": "team"}', 21, AMBER))
        self.say("Any lock in the subtree refuses the whole delete, and names the blocker.")
        put(mono('reason: "locked"', 20, RED), mono('blocked_by: "reviewer"', 20, RED))
        self.play(Indicate(lock, color=RED), run_time=0.6)
        self.wait(0.7)
        put(mono('update_agent {"id": "reviewer",', 21, AMBER), mono('  "delete_lock": false}', 21, AMBER))
        self.play(FadeOut(lock, shift=DOWN * 0.2), run_time=0.4)
        put(mono('delete_agent {"id": "team"}', 21, AMBER))

        self.say("Deepest first: each agent runs its on_delete hook, then leaves the tree.")
        for n, edge in ((wr, e[2]), (rv, e[3])):
            hook = pill("on_delete", AMBER, 17).next_to(n, DOWN, buff=0.18)
            self.play(FadeIn(hook), n.tinted(AMBER), run_time=0.3)
            self.play(FadeOut(n), FadeOut(hook), FadeOut(edge), run_time=0.35)
        hook = pill("on_delete", AMBER, 17).next_to(team, DOWN, buff=0.18)
        self.play(FadeIn(hook), team.tinted(AMBER), run_time=0.3)
        self.play(FadeOut(team), FadeOut(hook), FadeOut(e[0]), run_time=0.35)
        put(mono('{"deleted": true, "id": "team"}', 20, GREEN))

        self.say("Then every deleted id is pruned from other agents' grants.", color=INK)
        g2 = mono('{"$self": "*"}', 20, GREEN).move_to(grants[1]).align_to(grants[1], LEFT)
        self.play(FadeTransform(grants[1], g2), run_time=0.7)
        self.finish(2.4)


class K5Ledger(FScene):
    """Executions: call + settle rows, flush to the store, a dead letter, restart, dedup, ack."""

    EYEBROW = "Fantastic kernel"
    TITLE = "Every call is an execution"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.1
        ram, ram_t = panel("kernel RAM", 4.2, 3.2, -1.85, Y)
        st, st_t = panel("memory store (persistent)", 4.95, 3.2, 4.05, Y)
        caller = Node("caller", color=BLUE, size=22).move_to([-5.55, 1.1, 0])
        inbox_box = card(2.15, 0.8, stroke=LINE).move_to([-5.55, -0.25, 0])
        inbox = mono("inbox", 17, DIM).next_to(inbox_box, UP, buff=0.1)
        self.play(FadeIn(ram), FadeIn(ram_t), FadeIn(st), FadeIn(st_t), FadeIn(caller), FadeIn(inbox), FadeIn(inbox_box), run_time=0.6)
        ys = [Y + 1.05, Y + 0.45, Y - 0.15, Y - 0.75]

        def row(kind, name, status, color, i, where):
            g = VGroup(mono(kind, 20, color), mono(name, 20, INK), mono(status, 20, color)).arrange(RIGHT, buff=0.22)
            panel_ = ram if where == "ram" else st
            g.move_to([0, ys[i], 0]).align_to(panel_, LEFT).shift(RIGHT * 0.3)
            return g

        self.say('A named call ("id": "ingest-42" on the item): a call row, then a settle row.')
        r1 = row("call", "ingest-42", "", CYAN, 0, "ram")
        self.play(FadeIn(r1, shift=RIGHT * 0.2), run_time=0.4)
        r2 = row("settle", "ingest-42", "completed", GREEN, 1, "ram")
        self.play(FadeIn(r2, shift=RIGHT * 0.2), run_time=0.4)
        self.say("The rows flush into the kernel's memory store; a settled call leaves RAM.")
        self.play(Transform(r1, row("call", "ingest-42", "", CYAN, 0, "st")),
                  Transform(r2, row("settle", "ingest-42", "completed", GREEN, 1, "st")), run_time=0.8)
        self.wait(0.4)

        self.say("A call that settles failed, timed_out or cancelled is a dead letter.")
        d1 = row("settle", "fetch-7", "failed", RED, 0, "ram")
        self.play(FadeIn(d1, shift=RIGHT * 0.2), run_time=0.4)
        ev = mono("on_deadletter", 18, RED).move_to(inbox_box)
        self.play(TransformFromCopy(d1, ev), Transform(d1, row("settle", "fetch-7", "failed", RED, 2, "st")), run_time=0.8)
        self.wait(0.6)

        self.say("The process restarts. RAM starts empty; the store still holds every row.")
        badge = pill("restart", RED, 20).move_to(ram)
        self.play(FadeIn(badge, scale=1.2), ram.animate.set_stroke(RED), run_time=0.35)
        self.wait(0.5)
        self.play(FadeOut(badge), ram.animate.set_stroke(LINE), run_time=0.35)

        self.say("Re-send ingest-42: the store is read before dispatch, so the recorded outcome returns.")
        d = Dot(caller.get_right(), radius=0.1, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(r2.get_left() + LEFT * 0.2), run_time=0.8)
        self.play(Indicate(r2, color=GREEN, scale_factor=1.05), d.animate.move_to(caller.get_right()), run_time=0.6)
        back = VGroup(mono("completed", 19, GREEN), mono("handler not run", 17, DIM)).arrange(DOWN, buff=0.08)
        back.next_to(inbox_box, DOWN, buff=0.3)
        self.play(FadeOut(d), FadeIn(back), run_time=0.3)
        self.wait(0.5)

        self.say("ack_deadletter retires the dead letter. Nothing re-sends it on its own.", color=INK)
        a1 = row("ack", "fetch-7", "", AMBER, 3, "st")
        self.play(FadeIn(a1, shift=LEFT * 0.2), FadeOut(ev), run_time=0.5)
        self.finish(2.4)
