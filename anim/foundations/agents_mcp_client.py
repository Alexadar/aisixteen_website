"""Foundations — Agents › MCP client. Three clips, each one mechanism on fantastic main.

tools: boot asks the server who it is (server/discover) and lists its tools; each tool becomes a
       verb of the agent (docs of=<id>); a tool named like a kernel verb is skipped
       (mcp-client lib.rs:400-531, 115-122, 194-236; tools.py:100-178).
call:  send {type: <tool>, …} is a tools/call; the answer is {content, structured?}; isError adds
       error; a name the server never listed is refused unhandled
       (lib.rs:533-596, 335-352, 704-725; tools.py:228-303).
wire:  the key is read from the credential store before every request and sent as a Bearer key;
       server/discover goes first in 2026-07-28; an older server gets initialize and a session
       (lib.rs:154-163; wire.rs:11-27, 441-512; credentials.rs:140-182).
Ids, tool names and keys are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"tools": "McpTools", "call": "McpCall", "wire": "McpWire"}
OG = "tools"


def rows(items, size=18):
    """items: (text, colour) pairs, stacked left-aligned."""
    return VGroup(*[mono(t, size, c) for t, c in items]).arrange(DOWN, aligned_edge=LEFT, buff=0.16)


def fly(scene, p, a, b, run=0.7):
    """A message pill appears at a, travels to b."""
    p.move_to(a)
    scene.play(FadeIn(p, shift=UP * 0.1), run_time=0.3)
    scene.play(p.animate.move_to(b), run_time=run, rate_func=smooth)


class McpTools(FScene):
    """boot lists the server's tools; each becomes a verb."""

    TITLE = "Tools become verbs"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        gh = Node("gh", w=1.6, h=0.9, color=BLUE, size=26).move_to([-4.8, 1.0, 0])
        srv = Node("remote MCP server", w=3.6, h=0.9, color=MUTED, size=20).move_to([4.4, 1.0, 0])
        self.play(FadeIn(gh), FadeIn(srv), run_time=0.5)

        self.say("boot asks the server who it is.")
        d = pill("server/discover", color=CYAN, size=19)
        fly(self, d, [-1.7, 1.0, 0], [1.2, 1.0, 0])
        self.play(srv.tinted(GREEN, 0.3), run_time=0.3)
        self.play(FadeOut(d), run_time=0.2)

        self.say("Then it lists the tools, page by page.")
        tl = pill("tools/list", color=CYAN, size=19)
        fly(self, tl, [-1.7, 1.0, 0], [1.2, 1.0, 0])
        back = pill("4 tools", color=AMBER, size=19)
        self.play(FadeTransform(tl, back), run_time=0.4)
        self.play(back.animate.move_to([-1.7, 1.0, 0]), run_time=0.7, rate_func=smooth)
        self.play(FadeOut(back), run_time=0.2)

        self.say("Each tool is now a verb of gh. docs shows them.")
        pc, pt = panel("docs of=gh", 11.0, 2.3, 0, -1.3)
        lst = rows([
            ("create_issue   args: title:str (req), body:str?", GREEN),
            ("list_issues    args: state:str?", GREEN),
            ("add_label      args: issue:int (req), name:str (req)", GREEN),
            ("reflect        skipped: the kernel answers that verb", RED),
        ], size=18).move_to(pc).align_to(pc, LEFT).shift(RIGHT * 0.4)
        self.play(FadeIn(pc), FadeIn(pt), FadeIn(lst), gh.tinted(GREEN, 0.3), run_time=0.7)
        self.wait(0.6)
        self.finish()


class McpCall(FScene):
    """A send is a tools/call; the three ways it can end."""

    TITLE = "A send is a tools/call"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        a = Node("a", w=1.2, h=0.9, color=BLUE, size=26).move_to([-5.8, 1.0, 0])
        gh = Node("gh", w=1.6, h=0.9, color=BLUE, size=26).move_to([-1.0, 1.0, 0])
        srv = Node("MCP server", w=2.8, h=0.9, color=MUTED, size=20).move_to([5.3, 1.0, 0])
        rc, rt = panel("the answer", 11.6, 1.7, 0, -1.2)
        self.play(FadeIn(a), FadeIn(gh), FadeIn(srv), FadeIn(rc), FadeIn(rt), run_time=0.6)

        def show(items, size=19):
            g = rows(items, size).move_to(rc).align_to(rc, LEFT).shift(RIGHT * 0.4)
            return g

        self.say("a sends gh a tool name and its arguments.")
        s1 = pill('{"type": "create_issue", "title": "Bug"}', color=CYAN, size=17)
        fly(self, s1, [-3.4, 1.9, 0], [-3.4, 1.9, 0], 0.1)
        self.play(FadeOut(s1), run_time=0.15)
        call = pill("tools/call create_issue", color=CYAN, size=16)
        fly(self, call, [2.0, 1.0, 0], [2.6, 1.0, 0], 0.4)
        ok = show([("content: [{type: text, text: \"issue #7\"}]", GREEN), ("structured: {number: 7}", GREEN)])
        self.play(FadeOut(call), FadeIn(ok), srv.tinted(GREEN, 0.3), run_time=0.5)
        self.wait(0.8)

        self.say("A tool that fails adds error, so the call settles errored.")
        c2 = pill("tools/call add_label", color=CYAN, size=16)
        fly(self, c2, [2.0, 1.0, 0], [2.6, 1.0, 0], 0.4)
        bad = show([("error: label not found", RED), ("content: [{type: text, text: \"label not found\"}]", MUTED)])
        self.play(FadeOut(c2), FadeTransform(ok, bad), srv.tinted(RED, 0.25), run_time=0.5)
        self.wait(0.8)

        self.say("A name the server never listed is refused. Nothing is sent.")
        s3 = pill('{"type": "delete_repo"}', color=CYAN, size=17).move_to([-3.4, 1.9, 0])
        self.play(FadeIn(s3, shift=UP * 0.1), run_time=0.3)
        no = show([("unhandled: the MCP server has no tool 'delete_repo'", RED), ("hint: its tools: create_issue, … (docs of=gh)", MUTED)])
        self.play(FadeOut(s3), FadeTransform(bad, no), gh.tinted(RED, 0.25), srv.tinted(MUTED, 0.16), run_time=0.5)
        self.wait(0.6)
        self.finish()


class McpWire(FScene):
    """The key is read per request; the wire speaks the server's era."""

    TITLE = "The key and the wire"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        cs = Node("creds", w=1.8, h=0.9, color=GREEN, size=24).move_to([-5.8, 1.1, 0])
        gh = Node("gh", w=1.6, h=0.9, color=BLUE, size=26).move_to([-1.6, 1.1, 0])
        srv = Node("MCP server", w=2.8, h=0.9, color=MUTED, size=20).move_to([4.9, 1.1, 0])
        self.play(FadeIn(cs), FadeIn(gh), FadeIn(srv), run_time=0.5)

        self.say("Before every request, gh reads its key from the store.")
        g = pill("get {ref, host}", color=CYAN, size=17)
        fly(self, g, [-3.7, 1.9, 0], [-3.7, 1.9, 0], 0.1)
        k = pill("api_key", color=AMBER, size=17)
        self.play(FadeTransform(g, k), run_time=0.4)
        self.play(k.animate.move_to([-3.7, 0.4, 0]), run_time=0.4)
        self.wait(0.3)

        self.say("The key goes out as a Bearer key, to that host only.")
        b = pill("Authorization: Bearer", color=AMBER, size=17)
        self.play(FadeOut(k), run_time=0.15)
        fly(self, b, [1.2, 1.1, 0], [3.0, 1.1, 0], 0.7)
        self.play(FadeOut(b), run_time=0.2)

        pc, pt = panel("what the server speaks", 11.6, 2.3, 0, -1.3)
        r1 = rows([
            ("2026-07-28   server/discover answers", GREEN),
            ("one POST per request, no session", MUTED),
        ], 18)
        r2 = rows([
            ("older        discover refused, initialize instead", AMBER),
            ("MCP-Session-Id on every later POST", MUTED),
        ], 18)
        r1.move_to(pc).align_to(pc, LEFT).shift(RIGHT * 0.4).shift(UP * 0.55)
        r2.move_to(pc).align_to(pc, LEFT).shift(RIGHT * 0.4).shift(DOWN * 0.5)
        self.play(FadeIn(pc), FadeIn(pt), run_time=0.3)
        self.say("server/discover goes first, in protocol 2026-07-28.")
        self.play(FadeIn(r1), srv.tinted(GREEN, 0.3), run_time=0.5)
        self.wait(0.6)
        self.say("A server that only speaks an older version gets initialize.")
        self.play(FadeIn(r2), srv.tinted(AMBER, 0.3), run_time=0.5)
        self.wait(0.6)
        self.finish()
