"""Foundations — Canvas › Web MCP. 3 clips, each one mechanism.

two_layers:  the MCP client's tools/call send becomes a task owned by the leg; the carrier never sends
             itself, it hands the batch to the leg's inbound_send, and the outcomes come back
             (T = src/tui: bundles/fantastic-web-mcp/src/lib.rs:10-13,271-288,418-441,552-558).
config_file: on boot the leg reads .fantastic/.mcp.json through the mcp_config bridge, sets
             mcpServers.fantastic and writes only if it changed
             (lib.rs:116-131,160-229; src/kern/mcp_config.rs:1-25).
inquiry:     an agent sends the leg an inquiry, the leg holds it, the person lists and answers it, and
             the answer reaches the asker under the inquiry's pid
             (bundles/fantastic-web-mcp/src/inquiries.rs:4-13,76-184).
Ids and names are illustrative; verbs, shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"two_layers": "TwoLayers", "config_file": "ConfigFile", "inquiry": "Inquiry"}
OG = "two_layers"


def link(a, b, color=LINE):
    return Line(a.get_right(), b.get_left(), color=color, stroke_width=3)


class TwoLayers(FScene):
    """McpCore turns a tool call into a task; the leg sends the batch as itself."""

    TITLE = "A tool call becomes the leg's task"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.5
        client = Node("client", w=1.6, h=0.9, color=DIM, size=24).move_to([-5.3, Y, 0])
        core = Node("McpCore", w=1.9, h=0.9, color=CYAN, size=24).move_to([-2.0, Y, 0])
        leg = Node("mcp", w=1.5, h=0.9, color=BLUE, size=24).move_to([1.3, Y, 0])
        target = Node("files", w=1.6, h=0.9, color=VIOLET, size=24).move_to([4.8, Y, 0])
        l1, l2, l3 = link(client, core), link(core, leg), link(leg, target)

        self.say("A client calls the send tool. McpCore only speaks MCP.")
        self.play(FadeIn(client), FadeIn(core), FadeIn(leg), FadeIn(target),
                  Create(l1), Create(l2), Create(l3), run_time=0.8)
        call = pill("tools/call send", color=CYAN, size=20).next_to(client, UP, buff=0.35)
        self.play(FadeIn(call, shift=UP * 0.1), run_time=0.3)
        self.play(call.animate.next_to(core, UP, buff=0.35), run_time=0.7, rate_func=smooth)

        self.say("It starts a kernel task owned by the leg. ps lists it.")
        task = pill("task 7 (owned by mcp)", color=AMBER, size=20).next_to(core, DOWN, buff=0.45)
        self.play(FadeIn(task, shift=DOWN * 0.1), core.tinted(AMBER, 0.28), run_time=0.5)
        self.wait(0.4)

        self.say("It hands the batch to the leg's inbound_send.")
        hand = pill("inbound_send", color=CYAN, size=20).next_to(leg, UP, buff=0.35)
        self.play(FadeOut(call), FadeIn(hand), run_time=0.6)
        self.play(leg.tinted(BLUE, 0.3), run_time=0.3)

        self.say("The leg sends the item as itself, so its grants decide.")
        item = pill('{"type": "list"}', color=GREEN, size=20).next_to(target, UP, buff=0.35)
        self.play(FadeOut(hand), FadeIn(item), run_time=0.6)
        self.play(target.tinted(GREEN, 0.3), run_time=0.3)

        out = mono('[{"pid": 8, "status": "completed", "result": …}]', 20, GREEN).move_to([0.2, -1.95, 0])
        self.say("The outcomes return when the task ends.", wait=0.2)
        self.play(FadeIn(out), core.tinted(GREEN, 0.3), FadeOut(task), run_time=0.6)
        self.finish()


class ConfigFile(FScene):
    """On boot the leg keeps mcpServers.fantastic right in .fantastic/.mcp.json."""

    TITLE = "The leg keeps .mcp.json right"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.7
        leg = Node("mcp", w=1.5, h=0.9, color=BLUE, size=24).move_to([-5.0, Y, 0])
        bridge = Node("mcp_config", w=2.5, h=0.9, color=VIOLET, size=22).move_to([-0.8, Y, 0])
        f = card(3.4, 0.9, stroke=DIM).move_to([4.2, Y, 0])
        ft = mono(".fantastic/.mcp.json", 19, INK).move_to(f)
        l1, l2 = link(leg, bridge), link(bridge, f)

        self.say("At boot the leg reaches the file through its bridge.")
        self.play(FadeIn(leg), FadeIn(bridge), FadeIn(f), FadeIn(ft), Create(l1), Create(l2), run_time=0.8)
        self.play(leg.tinted(BLUE, 0.3), run_time=0.3)

        before = mono('{"mcpServers": {"other": {…}}}', 20, MUTED).move_to([0, -0.85, 0])
        self.say("It reads the file with read_stream. Other servers stay.")
        rd = pill("read_stream", color=CYAN, size=20).move_to([-2.9, 1.75, 0])
        self.play(FadeIn(rd), FadeIn(before), run_time=0.5)
        self.wait(0.4)

        after = mono('"fantastic": {"command": "/path/fantastic", "args": ["mcp"]}', 20, GREEN).move_to([0, -1.55, 0])
        self.say("It sets mcpServers.fantastic to this binary with args mcp.")
        self.play(FadeIn(after, shift=UP * 0.1), run_time=0.5)
        self.wait(0.4)

        wr = pill("write (only if changed)", color=AMBER, size=20).move_to([1.6, 1.75, 0])
        self.say("It writes back only when the entry changed.")
        self.play(FadeOut(rd), FadeIn(wr), f.animate.set_stroke(GREEN), run_time=0.5)
        note = mono("bad file or no grant: boot answers reason mcp_config", 19, RED).move_to([0, -2.35, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.finish()


class Inquiry(FScene):
    """An agent asks the person through the leg; the answer returns under the same pid."""

    TITLE = "An inquiry waits for the person"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.6
        asker = Node("asker", w=1.7, h=0.9, color=VIOLET, size=24).move_to([-4.8, Y, 0])
        leg = Node("mcp", w=1.5, h=0.9, color=BLUE, size=24).move_to([0.2, Y, 0])
        person = Node("person", w=1.7, h=0.9, color=DIM, size=24).move_to([4.8, Y, 0])
        l1, l2 = link(asker, leg), link(leg, person)

        self.say("An agent sends the leg an inquiry. The leg accepts it at once.")
        self.play(FadeIn(asker), FadeIn(leg), FadeIn(person), Create(l1), Create(l2), run_time=0.8)
        q = pill('inquiry {text: "ship?", kind: confirm}', color=CYAN, size=19).move_to([-2.4, 1.85, 0])
        self.play(FadeIn(q), run_time=0.3)
        self.play(q.animate.move_to([0.2, 1.85, 0]), run_time=0.7, rate_func=smooth)
        ack = mono('{"accepted": true, "re": 12}', 19, GREEN).move_to([-3.6, -0.55, 0])
        self.play(FadeIn(ack), leg.tinted(AMBER, 0.3), run_time=0.4)

        self.say("It holds the question on its record, under pid 12.")
        held = pill("open_inquiries: re 12", color=AMBER, size=20).move_to([1.6, -0.55, 0])
        self.play(FadeOut(q), FadeIn(held), run_time=0.4)
        self.wait(0.5)

        self.say("The person lists inquiries, then sends answer.")
        ans = pill("answer {re: 12, text: yes}", color=CYAN, size=19).move_to([3.6, 1.85, 0])
        self.play(FadeIn(ans), person.tinted(CYAN, 0.25), run_time=0.4)
        self.play(ans.animate.move_to([0.2, 1.85, 0]), run_time=0.8, rate_func=smooth)

        self.say("The asker gets a reply to 12; the inquiry closes.")
        rep = mono("[reply to 12 · mcp inquiry]  yes", 20, GREEN).move_to([-1.0, -2.2, 0])
        self.play(FadeOut(ans), FadeOut(held), FadeIn(rep), asker.tinted(GREEN, 0.3), leg.tinted(BLUE, 0.16), run_time=0.7)
        self.finish()
