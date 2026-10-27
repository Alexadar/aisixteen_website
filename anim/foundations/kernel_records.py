"""Foundations — Kernel › Agents as records. 3 clips, each one mechanism.

record  - create_agent builds one record: minted id, handler_module, flat meta, parent_id last
          (R/lifecycle.rs:51-65 and 132-272, R/agent.rs:52-70 and 138-156, R/authz.rs:105-117).
tree    - one parent per agent, but routing uses a flat id map (R/kernel.rs:110-112, R/agent.rs:82-95).
reflect - tree=ids, ignore_subtrees, bundles=ids, show_subtrees (R/reflect.rs:375-466, R/docs.rs:271-353).
Paths are on fantastic main under src/lib/rust/crates/fantastic-kernel/src. Ids and names are
illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, BRAND, CYAN, DIM, FAINT, GREEN, INK, LINE, MUTED, VIOLET,
    FScene, Node, card, connector, mono, panel, pill, txt,
)

CLIPS = {"record": "RecordFields", "tree": "OneTree", "reflect": "ReflectFlags"}
OG = "record"


def lines(rows, size=19, buff=0.13):
    """A left-aligned block of mono lines; rows are (text, colour)."""
    return VGroup(*[mono(t, size, c) for t, c in rows]).arrange(DOWN, aligned_edge=LEFT, buff=buff)


def small_tree():
    """kernel_state > team (writer, reviewer), files. Returns the nodes, the edges and a group."""
    s = 20
    root = Node("kernel_state", color=BRAND, size=s).move_to([-3.9, 1.6, 0])
    team = Node("team", color=BLUE, size=s).move_to([-5.1, 0.3, 0])
    files = Node("files", color=BLUE, size=s).move_to([-2.6, 0.3, 0])
    writer = Node("writer", color=BLUE, size=s).move_to([-5.9, -1.0, 0])
    reviewer = Node("reviewer", color=BLUE, size=s).move_to([-4.0, -1.0, 0])
    edges = [connector(root, team), connector(root, files), connector(team, writer), connector(team, reviewer)]
    return dict(root=root, team=team, files=files, writer=writer, reviewer=reviewer), edges


class RecordFields(FScene):
    """create_agent names the bundle and the owner; the kernel builds the record."""

    TITLE = "An agent is a record"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        send = lines([
            ('{"type": "create_agent",', AMBER),
            (' "handler_module": "file_bridge.tools",', AMBER),
            (' "parent_id": "kernel_state",', AMBER),
            (' "display_name": "files"}', AMBER),
        ], size=19).move_to([-3.4, 0.5, 0])
        lab = mono("sent to kernel", 17, DIM).next_to(send, UP, buff=0.25).align_to(send, LEFT)
        self.say("create_agent names a bundle and an owner. It sends no id.")
        self.play(FadeIn(lab), FadeIn(send, shift=RIGHT * 0.15), run_time=0.6)
        self.wait(0.5)

        c, t = panel("the record (agent.yaml)", 6.5, 3.6, 3.55, y=-0.1)
        self.play(FadeIn(c), FadeIn(t), run_time=0.4)

        def row(k, v, kc, vc):
            return VGroup(mono(k, 19, kc), mono(v, 19, vc))

        rows = [
            row("id", "file_bridge_3f9a1c", DIM, AMBER),
            row("handler_module", "file_bridge.tools", DIM, BLUE),
            row("display_name", "files", DIM, MUTED),
            row("can_call", '{"$self": "*"}', DIM, CYAN),
            row("callable_by", '{"$self": "*"}', DIM, CYAN),
            row("parent_id", "kernel_state", DIM, GREEN),
        ]
        top = c.get_top()[1] - 0.45
        for i, r in enumerate(rows):
            r[0].move_to([0, 0, 0]).align_to([c.get_left()[0] + 0.3, 0, 0], LEFT)
            r[1].align_to([c.get_left()[0] + 2.75, 0, 0], LEFT)
            r.shift(UP * (top - 0.52 * i - r[0].get_center()[1]))
            r[1].shift(UP * (r[0].get_center()[1] - r[1].get_center()[1]))

        self.say("The kernel mints the id: the bundle name plus six hex digits.")
        self.play(FadeIn(rows[0], shift=UP * 0.1), run_time=0.5)
        self.play(Indicate(rows[0][1], color=AMBER, scale_factor=1.08), run_time=0.5)
        self.play(FadeIn(rows[1], shift=UP * 0.1), run_time=0.4)
        self.say("Every other field is flat, at the top level of the record.")
        self.play(FadeIn(rows[2], shift=UP * 0.1), run_time=0.4)
        self.say("can_call and callable_by start as $self: only the agent itself.")
        self.play(FadeIn(rows[3], shift=UP * 0.1), FadeIn(rows[4], shift=UP * 0.1), run_time=0.5)
        self.wait(0.4)
        self.say("parent_id comes last: where the agent sits is the tree's decision.")
        self.play(FadeIn(rows[5], shift=UP * 0.1), run_time=0.5)
        self.play(Indicate(rows[5][1], color=GREEN, scale_factor=1.08), run_time=0.5)
        self.finish(2.2)


class OneTree(FScene):
    """One owner per agent, one flat map for routing."""

    TITLE = "One tree, one flat map"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        n, e = small_tree()
        self.say("Every agent has one parent. kernel_state is the root.")
        self.play(FadeIn(n["root"]), *[Create(x) for x in e[:2]], FadeIn(n["team"]), FadeIn(n["files"]), run_time=0.7)
        self.play(*[Create(x) for x in e[2:]], FadeIn(n["writer"]), FadeIn(n["reviewer"]), run_time=0.6)
        self.wait(0.3)

        c, t = panel("kernel agents (id -> agent)", 5.4, 3.6, 3.8, y=-0.1)
        ids = ["kernel_state", "team", "files", "writer", "reviewer"]
        rows = VGroup(*[mono(i, 20, MUTED) for i in ids]).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        rows.move_to(c).align_to(c, LEFT).shift(RIGHT * 0.45)
        self.say("The kernel also keeps one flat map from id to agent.")
        self.play(FadeIn(c), FadeIn(t), FadeIn(rows, lag_ratio=0.15), run_time=0.9)
        self.wait(0.4)

        self.say("A send looks the target id up in the map. It does not walk the tree.")
        path = VMobject(color=CYAN, stroke_width=3).set_points_as_corners(
            [[-5.9, -1.65, 0], [-5.9, -2.2, 0], [-2.6, -2.2, 0], [-2.6, -0.55, 0]])
        msg = pill("send", CYAN, 18).move_to([-5.9, -1.65, 0])
        self.play(Create(path), FadeIn(msg), run_time=0.5)
        self.play(MoveAlongPath(msg, path), run_time=1.3, rate_func=smooth)
        hit = rows[2]
        self.play(hit.animate.set_color(CYAN), n["files"].tinted(CYAN, 0.3), run_time=0.4)
        self.wait(0.5)
        self.play(FadeOut(msg), FadeOut(path), hit.animate.set_color(MUTED), n["files"].tinted(BLUE), run_time=0.4)

        self.say("The tree is ownership: team's subtree is what delete takes with it.")
        sub = [n["team"], n["writer"], n["reviewer"]]
        tag = pill("subtree of team", AMBER, 17).move_to([-5.0, -2.05, 0])
        self.play(*[x.tinted(AMBER, 0.28) for x in sub], FadeIn(tag), run_time=0.5)
        self.finish(2.4)


class ReflectFlags(FScene):
    """reflect shapes its answer with tree, ignore_subtrees, bundles and show_subtrees."""

    TITLE = "reflect: look without flooding"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        n, e = small_tree()
        self.add(*n.values(), *e)
        c, t = panel("reply (nodes shortened)", 6.8, 2.5, 3.5, y=-0.75)
        self.add(c, t)
        req = None
        rep = None

        def request(s):
            return pill(s, AMBER, 19).move_to([3.5, 1.55, 0])

        def reply(rows):
            g = lines(rows, 19, 0.15)
            g.move_to(c).align_to(c, LEFT).shift(RIGHT * 0.3)
            return g

        def swap(new_req, new_rep, tr=0.6):
            nonlocal req, rep
            if req is None:
                self.play(FadeIn(new_req, shift=DOWN * 0.1), run_time=0.3)
                self.play(FadeIn(new_rep, shift=UP * 0.1), run_time=tr)
            else:
                self.play(FadeTransform(req, new_req), run_time=0.3)
                self.play(FadeTransform(rep, new_rep), run_time=tr)
            req, rep = new_req, new_rep

        self.say("tree=ids is the cheap scan: every id below, depth first.")
        swap(request('reflect tree=ids'), reply([
            ('"tree": ["kernel_state", "team",', GREEN),
            ('"writer", "reviewer", "files"]', GREEN),
        ]))
        self.wait(0.5)

        self.say('ignore_subtrees=["team"] folds a branch to a stub. pruned counts 3.')
        swap(request('reflect ignore_subtrees=["team"]'), reply([
            ('{"id": "kernel_state", "children": [', GREEN),
            ('{"id": "team", "pruned": 3},', AMBER),
            ('{"id": "files", "children": []}]}', GREEN),
        ]))
        stub = pill("pruned: 3", AMBER, 17).next_to(n["team"], DOWN, buff=0.35)
        self.play(FadeOut(n["writer"]), FadeOut(n["reviewer"]), FadeOut(e[2]), FadeOut(e[3]),
                  n["team"].tinted(AMBER, 0.28), FadeIn(stub), run_time=0.6)
        self.wait(0.5)

        self.say("bundles=ids lists the kinds of agent that could be created.")
        self.play(FadeIn(n["writer"]), FadeIn(n["reviewer"]), FadeIn(e[2]), FadeIn(e[3]), FadeOut(stub),
                  n["team"].tinted(BLUE), run_time=0.5)
        swap(request('reflect bundles=ids'), reply([
            ('"bundles": ["exec_bridge",', CYAN),
            ('"file_bridge", "web_rest", ...]', CYAN),
        ]))
        self.wait(0.4)

        self.say('show_subtrees=["team"] answers with only that branch.')
        swap(request('reflect show_subtrees=["team"]'), reply([
            ('[{"id": "team", "children": [', GREEN),
            ('{"id": "writer", "children": []},', GREEN),
            ('{"id": "reviewer", "children": []}]}]', GREEN),
        ]))
        self.play(n["root"].animate.set_opacity(0.3), n["files"].animate.set_opacity(0.3),
                  e[0].animate.set_opacity(0.3), e[1].animate.set_opacity(0.3), run_time=0.5)
        self.finish(1.8)
