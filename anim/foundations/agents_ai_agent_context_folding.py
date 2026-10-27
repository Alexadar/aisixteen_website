"""Foundations — Agents › AI agent › Context folding. Four clips, each one mechanism of ai_core + the memory stores.

Every step drawn here is a behaviour on origin/main (Rust and Python twins): folds are
appended rows with refs, the view renders a fold at its anchor, three adjacent folds at the
head fold as a group, clear deletes
nothing and forget deletes only rows no longer visible. Row ids are illustrative.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BG, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, PANEL, RED, VIOLET,
    FScene, Node, card, mono, pill, txt,
)

# Clips of this article: clip name -> scene class. Files: media/fantastic/foundations/<path>/<clip>.*
CLIPS = {"fold": "CF1Fold", "levels": "CF2Levels", "cache": "CF3Cache", "forget": "CF5Forget"}
# The clip whose final frame becomes the article's og.jpg (social card).
OG = "fold"

CELL = 0.66
GAP = 0.1
STEP = CELL + GAP


def cell(label, color=BLUE, w=CELL, size=20, alpha=0.16):
    return Node(str(label), w=w, h=CELL, color=color, size=size, fill_alpha=alpha)


def lane_label(s, y, x=-6.55):
    return mono(s, 19, DIM).move_to([0, y, 0]).align_to([x, 0, 0], LEFT)


def place_row(cells, x0, y):
    """Lay cells left to right from x0 (left edge), each cell keeping its own width."""
    x = x0
    for c in cells:
        c.move_to([x + c.width / 2, y, 0])
        x += c.width + GAP
    return cells


def bracket(mobs, color, label, up=True, size=18):
    g = VGroup(*mobs)
    y = g.get_top()[1] + 0.16 if up else g.get_bottom()[1] - 0.16
    l, r = g.get_left()[0], g.get_right()[0]
    tick = 0.12 if up else -0.12
    line = VGroup(Line([l, y - tick, 0], [l, y, 0]), Line([l, y, 0], [r, y, 0]), Line([r, y, 0], [r, y - tick, 0]))
    line.set_stroke(color, width=3)
    t = mono(label, size, color)
    t.next_to(line, UP if up else DOWN, buff=0.1)
    return VGroup(line, t)


class CF1Fold(FScene):
    """context_fold: one appended row with refs; the view puts it at its anchor; the prefix stays."""

    TITLE = "A fold is a new row"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0 = -4.4
        SY, VY = 0.75, -1.15
        self.play(FadeIn(lane_label("store", SY)), FadeIn(lane_label("view", VY)), run_time=0.3)
        store = [cell(i) for i in range(1, 13)]
        place_row(store, X0, SY)
        sysc = cell("sys", color=DIM, w=0.9, size=18)
        view = [sysc] + [cell(i) for i in range(1, 13)]
        place_row(view, X0 - 0.9 - GAP, VY)  # the system block leads every prompt
        self.say("Every message is a row in the agent's memory store. The view is what the model reads.")
        self.play(FadeIn(sysc), run_time=0.2)
        self.play(LaggedStart(*[AnimationGroup(FadeIn(s, shift=LEFT * 0.15), FadeIn(v, shift=LEFT * 0.15))
                                for s, v in zip(store, view[1:])], lag_ratio=0.18), run_time=1.8)
        self.wait(0.4)

        cmd = mono('context_fold {"from": 3, "to": 8}', 21, AMBER)
        cmd.move_to([0, 3.05, 0]).align_to([6.55, 0, 0], RIGHT)
        rng = bracket(view[3:9], AMBER, "range", up=False)
        self.say("Fold rows 3 to 8 by hand, with the operator verb context_fold.")
        self.play(FadeIn(cmd), FadeIn(rng), *[v.tinted(AMBER, 0.2) for v in view[3:9]], run_time=0.6)
        self.wait(0.5)

        # 1: one fold row appended to the store; its refs name the members
        f_store = cell(13, color=AMBER, alpha=0.3)
        f_store.move_to(store[-1].get_center() + RIGHT * STEP)
        self.say("One fold row is appended to the store. Its refs name the members; nothing is deleted.")
        self.play(FadeIn(f_store, shift=LEFT * 0.2), run_time=0.4)
        arcs = VGroup(*[ArcBetweenPoints(f_store.get_top(), store[i].get_top(), angle=PI / 4.2,
                                         color=AMBER, stroke_width=2, stroke_opacity=0.75) for i in range(2, 8)])
        self.play(LaggedStart(*[Create(a) for a in arcs], lag_ratio=0.12), run_time=0.9)
        self.wait(0.4)

        # 2: the view renders the fold at its anchor (row 3) in place of its members
        fold_v = Node("[fold 13 · 6 refs · L1]", h=CELL, color=AMBER, size=19, fill_alpha=0.22)
        fold_v.move_to([view[3].get_left()[0] + fold_v.width / 2, VY, 0])
        after = view[9:]
        after_target = VGroup(*[c.copy() for c in after])
        place_row(list(after_target), fold_v.get_right()[0] + GAP, VY)
        self.say("In the view the fold sits at its anchor, row 3, in place of its members.")
        self.play(FadeOut(rng), ReplacementTransform(VGroup(*view[3:9]), fold_v),
                  *[Transform(c, t) for c, t in zip(after, after_target)], run_time=1.0)
        self.wait(0.5)

        # 3: the prefix before the range is byte-identical
        keep = bracket(view[0:3], GREEN, "same bytes", up=False)
        self.say("Everything before the range keeps its exact bytes, so a prompt cache can keep that prefix.", color=INK)
        self.play(FadeIn(keep), *[v.tinted(GREEN, 0.2) for v in view[0:3]], run_time=0.6)
        reply = mono('-> {"folded": 13, "rows": 6, "summarized": true}', 20, GREEN).next_to(cmd, DOWN, buff=0.16).align_to(cmd, RIGHT)
        self.play(FadeIn(reply), run_time=0.4)
        self.finish(2.4)


class CF2Levels(FScene):
    """Three adjacent folds at the head fold as a group: L1 -> L2 -> L3. history {fold} walks back down."""

    TITLE = "Folds of folds"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        VY = 0.9
        X0 = -6.3
        self.play(FadeIn(lane_label("view", VY + 0.65, X0)), run_time=0.2)

        def fold_block(level, refs, w=2.0):
            color = {1: AMBER, 2: BRAND, 3: CYAN}[level]
            return Node(f"L{level} · {refs} refs", w=w, h=CELL, color=color, size=19, fill_alpha=0.22)

        # the conversation grows; the oldest finished chain folds, three times
        self.say("Under context_strategy: fold, finished chains at the head fold, oldest first.")
        live = [cell(i, size=17) for i in range(1, 15)]
        place_row(live, X0, VY)
        self.play(LaggedStart(*[FadeIn(c) for c in live], lag_ratio=0.06), run_time=0.9)
        folds = []
        groups = (live[0:5], live[5:9], live[9:14])
        refs = (5, 4, 5)
        x = X0
        rest = list(live)
        for g, n in zip(groups, refs):
            fb = fold_block(1, n)
            fb.move_to([x + fb.width / 2, VY, 0])
            x += fb.width + GAP
            rest = rest[len(g):]
            moves = []
            if rest:
                tgt = [c.copy() for c in rest]
                place_row(tgt, x, VY)
                moves = [c.animate.move_to(t) for c, t in zip(rest, tgt)]
            self.play(ReplacementTransform(VGroup(*g), fb), *moves, run_time=0.6)
            folds.append(fb)
        self.wait(0.4)

        self.say("Three adjacent folds at the head fold as a group: a fold of folds, one level up.")
        l2 = fold_block(2, 3, w=2.4)
        l2.move_to([X0 + l2.width / 2, VY, 0])
        self.play(ReplacementTransform(VGroup(*folds), l2), run_time=0.8)
        self.wait(0.5)

        self.say("And again, later: depth grows like log3 of the history, not one level per cut.")
        more = [fold_block(2, 3, w=2.4) for _ in range(2)]
        place_row([l2] + more, X0, VY)
        self.play(*[FadeIn(m, shift=LEFT * 0.2) for m in more], run_time=0.5)
        l3 = fold_block(3, 3, w=2.4)
        l3.move_to([X0 + l3.width / 2, VY, 0])
        self.play(ReplacementTransform(VGroup(l2, *more), l3), run_time=0.8)
        hdr = mono('[fold 96 · 3 refs · L3] "<title>"', 21, MUTED).next_to(l3, RIGHT, buff=0.4)
        self.play(FadeIn(hdr), run_time=0.4)
        self.wait(0.5)

        # descent: history {fold} opens one level at a time
        self.say("Nothing is lost: history {fold: <id>} opens a fold one level down, as far as needed.", color=INK)
        lvl2 = [fold_block(2, 3, w=2.4) for _ in range(3)]
        place_row(lvl2, X0, VY - 1.25)
        lvl1 = [fold_block(1, n, w=2.0) for n in refs]
        place_row(lvl1, X0, VY - 2.5)
        e1 = VGroup(*[Line(l3.get_bottom(), m.get_top(), color=LINE, stroke_width=2) for m in lvl2])
        e2 = VGroup(*[Line(lvl2[0].get_bottom(), m.get_top(), color=LINE, stroke_width=2) for m in lvl1])
        self.play(Create(e1), LaggedStart(*[FadeIn(m, shift=DOWN * 0.15) for m in lvl2], lag_ratio=0.15), run_time=0.7)
        self.play(Create(e2), LaggedStart(*[FadeIn(m, shift=DOWN * 0.15) for m in lvl1], lag_ratio=0.15), run_time=0.7)
        rows = VGroup(*[cell(i, size=15, w=0.5) for i in range(1, 6)])
        place_row(list(rows), X0 + 2.6, VY - 2.5)
        rows.next_to(lvl1[-1], RIGHT, buff=0.6)
        e3 = Line(lvl1[0].get_right(), rows.get_left(), color=LINE, stroke_width=2)
        self.play(Create(e3), FadeIn(rows), run_time=0.5)
        self.finish(2.4)


class CF3Cache(FScene):
    """Prefix caches compare bytes from the start: append keeps them, a cut misses, a fold misses once."""

    TITLE = "Why folds append, never edit"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0 = -3.4
        ys = (1.55, 0.7, -0.15, -1.0, -1.85)

        def strip(labels, y, kinds):
            cells = []
            for lab, k in zip(labels, kinds):
                w = 0.95 if lab == "sys" else (1.25 if lab == "fold" else CELL)
                color = {"old": BLUE, "hit": GREEN, "miss": AMBER}[k]
                cells.append(cell(lab, color=color, w=w, size=18 if lab in ("sys", "fold") else 20, alpha=0.2))
            place_row(cells, X0, y)
            return VGroup(*cells)

        def name(s, y):
            return mono(s, 20, MUTED).move_to([0, y, 0]).align_to([-6.55, 0, 0], LEFT)

        base = ["sys", 1, 2, 3, 4, 5, 6, 7]
        legend = VGroup(pill("same bytes: cached", GREEN, 18), pill("changed: recomputed", AMBER, 18)).arrange(RIGHT, buff=0.4)
        legend.move_to([0, -2.75, 0])
        self.say("A provider's prompt cache compares bytes from the start of the prompt.")
        s0 = strip(base, ys[0], ["old"] * 8)
        self.play(FadeIn(name("last prompt", ys[0])), FadeIn(s0), FadeIn(legend), run_time=0.6)
        self.wait(0.5)

        self.say("Append a row: the whole old prompt is a cached prefix; only the new row is computed.")
        s1 = strip(base + [8], ys[1], ["hit"] * 8 + ["miss"])
        self.play(FadeIn(name("append", ys[1])), FadeIn(s1, shift=DOWN * 0.1), run_time=0.6)
        self.wait(1.0)

        self.say("Cut rows from the front: everything after the cut has moved, so it misses.")
        s2 = strip(["sys", 3, 4, 5, 6, 7, 8], ys[2], ["hit"] + ["miss"] * 6)
        self.play(FadeIn(name("cut 1-2", ys[2])), FadeIn(s2, shift=DOWN * 0.1), run_time=0.6)
        self.wait(1.0)

        self.say("Fold rows 4-6: the rows before the fold stay cached; it misses from the fold on.")
        s3 = strip(["sys", 1, 2, 3, "fold", 7, 8], ys[3], ["hit"] * 4 + ["miss"] * 3)
        self.play(FadeIn(name("fold 4-6", ys[3])), FadeIn(s3, shift=DOWN * 0.1), run_time=0.6)
        self.wait(1.0)

        self.say("The fold row persists, so the next turn sends the same bytes again: appends hit.", color=INK)
        s4 = strip(["sys", 1, 2, 3, "fold", 7, 8, 9], ys[4], ["hit"] * 7 + ["miss"])
        self.play(FadeIn(name("next turn", ys[4])), FadeIn(s4, shift=DOWN * 0.1), run_time=0.6)
        self.finish(2.4)


class CF5Forget(FScene):
    """context_clear deletes nothing; context_forget prunes only rows the model can no longer see."""

    TITLE = "clear starts over; forget deletes"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        X0 = -5.0
        SY, VY = 0.75, -1.25
        self.play(FadeIn(lane_label("store", SY)), FadeIn(lane_label("view", VY)), run_time=0.3)
        ids = [1, 2, 3, 4, 5, 6, 7, 8]
        store = [cell(i) for i in ids]
        fold = cell(9, color=AMBER, alpha=0.3)
        store.append(fold)
        store += [cell(i) for i in (10, 11)]
        place_row(store, X0, SY)
        arcs = VGroup(*[ArcBetweenPoints(fold.get_top(), store[i].get_top(), angle=PI / 3.2,
                                         color=AMBER, stroke_width=2, stroke_opacity=0.7) for i in range(1, 5)])
        for i in range(1, 5):
            store[i].box.set_fill(opacity=0.06)
        view = [cell(1), Node("[fold 9 · 4 refs]", h=CELL, color=AMBER, size=18, fill_alpha=0.22)] + [cell(i) for i in (6, 7, 8, 10, 11)]
        place_row(view, X0, VY)
        self.say("A store with a fold (9) over rows 2 to 5. The view shows the fold in their place.")
        self.play(*[FadeIn(c) for c in store], Create(arcs), *[FadeIn(v) for v in view], run_time=0.9)
        self.wait(0.8)

        # clear: one clear row appended; the view starts at it; nothing deleted
        cmd = mono('context_clear {"why": "new task"}', 21, AMBER)
        cmd.move_to([0, 2.3, 0]).align_to([6.55, 0, 0], RIGHT)
        clr = cell(12, color=VIOLET, alpha=0.3)
        clr.move_to(store[-1].get_center() + RIGHT * STEP)
        cl_v = Node("[cleared 12 · N rows] new task", h=CELL, color=VIOLET, size=18, fill_alpha=0.22)
        cl_v.move_to([X0 + cl_v.width / 2, VY, 0])
        self.say("context_clear appends one clear row; the view begins at its line. Nothing is deleted.")
        self.play(FadeIn(cmd), run_time=0.3)
        self.play(FadeIn(clr, shift=LEFT * 0.2), run_time=0.4)
        self.play(ReplacementTransform(VGroup(*view), cl_v), run_time=0.7)
        n13 = [cell(i) for i in (13, 14)]
        place_row(n13, clr.get_right()[0] + GAP, SY)
        n13v = [cell(i) for i in (13, 14)]
        place_row(n13v, cl_v.get_right()[0] + GAP, VY)
        self.play(*[FadeIn(c) for c in n13 + n13v], run_time=0.4)
        grep = mono('grep "invoice" -> row 7', 19, CYAN).next_to(store[6], DOWN, buff=0.35)
        self.play(FadeIn(grep), Indicate(store[6], color=CYAN, scale_factor=1.1), run_time=0.6)
        self.wait(0.6)

        # forget: prune rows covered by a fold; keep every fold; the view does not change
        cmd2 = mono("context_forget {}", 21, RED).move_to(cmd).align_to(cmd, RIGHT)
        self.say("context_forget deletes the rows a fold covers. Every fold stays.")
        self.play(FadeOut(grep), FadeTransform(cmd, cmd2), run_time=0.4)
        self.play(*[FadeOut(store[i], scale=0.6) for i in range(1, 5)], FadeOut(arcs), run_time=0.7)
        keep = pill("fold 9 kept: title + summary", AMBER, 17).next_to(fold, DOWN, buff=0.3)
        self.play(FadeIn(keep), run_time=0.4)
        same = bracket([cl_v] + n13v, GREEN, "the next prompt is the same before and after", up=False, size=18)
        self.say("The rows it deletes were already out of view, so the next prompt does not change.", color=INK)
        self.play(FadeIn(same), run_time=0.5)
        self.finish(2.4)
