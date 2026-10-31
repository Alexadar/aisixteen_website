"""Foundations — Protocol › Messages and verbs. Three clips, each one mechanism.

batch    one send of three items: all registered in ps first, run concurrently, answered in
         input order (rust send.rs:462-471, 515-565; python _agent.py:667-721).
statuses five items settle into the five statuses and their result bodies
         (rust outcome.rs:55-65, send.rs:1595-1630; python _kernel.py:256-262).
reflect  reflect says what an agent is, docs says how to call it, then the verb is sent
         (rust reflect.rs:175-205, send/kernel_verbs.rs:101-106, docs.rs:1-10).
Ids, targets and agent names are illustrative; shapes, verbs and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, PANEL_HI, RED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"batch": "K1Batch", "statuses": "Statuses", "reflect": "Reflect"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "batch"


class K1Batch(FScene):
    """One batch, many calls: registered at once, run concurrently, answered in input order."""

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


class Statuses(FScene):
    """Five items, five statuses: how each ends and what its result holds."""

    TITLE = "Five statuses"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X_PID, X_ITEM, X_ST, X_RES = -6.4, -5.0, -1.55, 0.75
        ys = (1.25, 0.45, -0.35, -1.15, -1.95)
        card_bg = card(13.4, 4.55, stroke=LINE).move_to([0, -0.35, 0])

        def head(s, x):
            return mono(s, 17, DIM).move_to([x, 1.95, 0]).align_to([x, 0, 0], LEFT)

        heads = VGroup(head("pid", X_PID), head("target · verb", X_ITEM), head("status", X_ST), head("result", X_RES))
        rows = [
            ("41", "notes · reflect", "completed", GREEN, '{"id": "notes", "sentence": ...}'),
            ("42", "files · read", "errored", RED, '{"error": ...}'),
            ("null", "ghost · reflect", "failed", RED, '{"error": "no agent \'ghost\'", ...}'),
            ("43", "job · run", "cancelled", MUTED, '{"cancelled": true}'),
            ("44", "slow · run", "timed_out", AMBER, '{"error": ..., "reason": "timeout"}'),
        ]

        def left(m, x, y):
            return m.move_to([x, y, 0]).align_to([x, 0, 0], LEFT)

        left_cols = []
        for (pid, item, st, col, res), y in zip(rows, ys):
            c_pid = left(mono(pid, 20, AMBER if pid != "null" else FAINT), X_PID, y)
            c_item = left(mono(item, 20, CYAN), X_ITEM, y)
            c_st = left(pill(st, color=col, size=20), X_ST - 0.18, y)
            c_res = left(mono(res, 19, MUTED), X_RES, y)
            left_cols.append((c_pid, c_item, c_st, c_res))

        self.say("One send of five items. Each one settles in exactly one status.")
        self.play(FadeIn(card_bg), FadeIn(heads), LaggedStart(*[
            FadeIn(VGroup(r[0], r[1]), shift=RIGHT * 0.15) for r in left_cols], lag_ratio=0.15), run_time=1.1)
        self.wait(0.2)

        def reveal(idxs, line, color=MUTED):
            self.say(line, color=color)
            self.play(*[FadeIn(VGroup(left_cols[i][2], left_cols[i][3])) for i in idxs], run_time=0.45)
            self.wait(0.3)

        reveal([0], "completed: the handler ran and returned. The reply is passed through.")
        reveal([1], "errored: the handler ran and returned a map with a truthy error.")
        reveal([2], "failed: refused before dispatch (pid null), or the handler raised.")
        reveal([3, 4], "cancelled: killed by cancel. timed_out: its own deadline expired.")
        self.say("Every item gets an answer; nothing propagates out of send.", color=INK)
        self.finish(1.6)


class Reflect(FScene):
    """reflect says what an agent is; docs says how to call it; then the verb."""

    TITLE = "reflect, docs, then the verb"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        W, H, y0 = 6.2, 3.0, -0.55
        xl, xr = -3.5, 3.5
        pl, tl = panel("reflect  ·  what it is", W, H, xl, y0)
        pr, tr = panel("docs  ·  how to call it", W, H, xr, y0)
        req_y = 1.95

        req1 = pill('{"target": "notes", "payload": {"type": "reflect"}}', color=CYAN, size=14).move_to([xl, req_y, 0])
        req2 = pill('{"target": "kernel", "payload": {"type": "docs", "of": "notes"}}', color=CYAN, size=14).move_to([xr, req_y, 0])
        req1.scale_to_fit_width(min(req1.width, 6.1)).move_to([xl, req_y, 0])
        req2.scale_to_fit_width(min(req2.width, 6.1)).move_to([xr, req_y, 0])

        def lines(items, x, color):
            g = VGroup(*[mono(t, 20, c) for t, c in items]).arrange(DOWN, aligned_edge=LEFT, buff=0.24)
            return g.move_to([x, y0 - 0.05, 0]).align_to([x - W / 2 + 0.35, 0, 0], LEFT)

        left_lines = lines([
            ("id, sentence, display_name", INK), ("description?, parent_id", INK), ("handler_module", INK),
            ("can_call, callable_by", AMBER), ("tree?  bundles?  readme?", MUTED)], xl, CYAN)
        right_lines = lines([
            ("of: notes", INK), ("tier: oneliners", INK), ("verbs: one signature each", GREEN),
            ('tier: "detailed"  full text', MUTED), ("emits · cancel · notes", MUTED)], xr, CYAN)

        self.say("reflect asks an agent what it is: identity, state and its grants.")
        self.play(FadeIn(pl), FadeIn(tl), FadeIn(req1, shift=DOWN * 0.1), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(m, shift=RIGHT * 0.1) for m in left_lines], lag_ratio=0.15), run_time=1.2)
        self.wait(0.8)

        self.say("docs, sent to the kernel, says how to call it: its verbs.")
        self.play(FadeIn(pr), FadeIn(tr), FadeIn(req2, shift=DOWN * 0.1), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(m, shift=RIGHT * 0.1) for m in right_lines], lag_ratio=0.15), run_time=1.2)
        self.wait(0.8)

        verb = pill('{"target": "notes", "payload": {"type": "<verb>", ...}}', color=GREEN, size=16)
        verb.scale_to_fit_width(min(verb.width, 8.2)).move_to([0, -2.6, 0])
        self.say("Then send the verb. There is no client library: the protocol is the API.", color=INK)
        self.play(FadeIn(verb, shift=UP * 0.1), run_time=0.7)
        self.finish(2.4)
