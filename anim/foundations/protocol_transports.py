"""Foundations — Protocol › Transports. 3 clips, each one mechanism.

carriers: one payload through five carriers into one kernel.send
          (R/fantastic-kernel/src/send.rs:484; io-bridge inbound.rs:74-118; web-ws readme.md:7;
          web-rest readme.md:3-15; bridge lib.rs:26,130; T/docs/mcp.md:14-32).
legs:     a wire leg is sealed until opened, then sends the item onward as itself
          (R/fantastic-io-bridge/src/inbound.rs:4-15; ingress/mod.rs:37; deny_inbound.rs:71).
bridge:   kernel to kernel with forward: a call frame to the far web_ws leg, a reply frame back
          (R/bundles/fantastic-bridge/src/lib.rs:26-45,130; readme_ws.md:3-12).
Ids and names are illustrative; verbs, frame shapes and orders are not.
"""
from manim import *  # noqa: F403

from common import (
    AMBER, BLUE, CYAN, DIM, GREEN, INK, LINE, MUTED, RED, VIOLET,
    FScene, Node, card, mono, panel, pill, txt,
)

CLIPS = {"carriers": "Carriers", "legs": "SealedLeg", "bridge": "ForwardBridge"}
OG = "carriers"


class Carriers(FScene):
    """The payload is fixed; only the envelope around it changes."""

    TITLE = "One message, five carriers"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        names = ["in process", "WebSocket", "REST", "bridge", "MCP"]
        wires = [
            'send([{"target": "kernel", "payload": …}])',
            '{"type": "call", "id": "c1", "target": "kernel", "payload": …}',
            'POST /<leg id>/kernel   body = payload',
            '{"type": "forward", "target": "kernel", "payload": …}',
            'tools/call send  {"items": [{"target", "payload"}]}',
        ]
        says = [
            "In process: an agent calls send with a list of items.",
            "WebSocket: a call frame, with an id and a target.",
            "REST: the target is the URL, the payload is the body.",
            "Bridge: a forward item names the remote target.",
            "MCP: the send tool takes the same items.",
        ]
        ys = [1.55, 0.8, 0.05, -0.7, -1.45]
        pills = [pill(n, color=DIM, size=21).move_to([-5.2, y, 0]) for n, y in zip(names, ys)]
        for p in pills:
            p.align_to([-6.5, 0, 0], LEFT)
        payload = pill('{"type": "reflect"}', color=AMBER, size=24).move_to([0.9, 0.05, 0])
        kernel = Node("kernel", w=2.0, h=1.0, color=BLUE, size=28).move_to([5.5, 0.05, 0])
        rails = [Line(p.get_right(), payload.get_left(), color=LINE, stroke_width=2) for p in pills]
        rails = [r.set_opacity(0) for r in rails]
        join = Line(payload.get_right(), kernel.get_left(), color=LINE, stroke_width=3)

        self.say("The message is a payload. The verb is its type.")
        self.play(FadeIn(VGroup(*pills)), FadeIn(payload), FadeIn(kernel), *[Create(r) for r in rails], Create(join), run_time=0.8)
        self.wait(0.2)

        wire = None
        for i, (p, w, s) in enumerate(zip(pills, wires, says)):
            self.say(s)
            new = mono(w, 20, CYAN)
            if new.width > 12.6:
                new.scale_to_fit_width(12.6)
            new.move_to([0, -2.45, 0])
            anims = [p.animate.set_color(CYAN), rails[i].animate.set_color(CYAN)]
            if wire is None:
                anims.append(FadeIn(new))
            else:
                anims.append(FadeTransform(wire, new))
            self.play(*anims, run_time=0.4)
            wire = new
            d = Dot(p.get_right(), radius=0.1, color=CYAN)
            self.add(d)
            self.play(d.animate.move_to(payload.get_left()), run_time=0.3, rate_func=smooth)
            self.play(d.animate.move_to(kernel.get_left()), run_time=0.3, rate_func=smooth)
            self.play(FadeOut(d), p.animate.set_color(GREEN), rails[i].animate.set_color(LINE), run_time=0.2)

        done = mono("every carrier ends in kernel.send([{target, payload}])", 21, GREEN).move_to([0, -2.45, 0])
        self.say("Same payload, same send. The carrier only wraps it.", color=INK)
        self.play(FadeTransform(wire, done), kernel.tinted(GREEN, 0.3), run_time=0.5)
        self.finish(1.0)


class SealedLeg(FScene):
    """A wire leg is sealed until opened; then it is the caller of the onward send."""

    TITLE = "A wire leg is the caller"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.7
        client = Node("client", w=1.7, h=0.95, color=DIM, size=26).move_to([-5.4, Y, 0])
        leg = Node("web_ws", w=1.9, h=0.95, color=BLUE, size=26).move_to([-0.5, Y, 0])
        target = Node("files", w=1.7, h=0.95, color=VIOLET, size=26).move_to([5.0, Y, 0])
        w1 = DashedLine(client.get_right(), leg.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        w2 = DashedLine(leg.get_right(), target.get_left(), color=LINE, dash_length=0.14, stroke_width=3)

        def rule(s, color):
            return mono(f"web_ws.ingress_rule   {s}", 21, color).move_to([0, -0.7, 0]).align_to([-6.4, 0, 0], LEFT)

        r0 = rule("(unset)", MUTED)
        self.say("A client sends a call frame to a web_ws leg. The leg is sealed.")
        self.play(FadeIn(client), FadeIn(leg), FadeIn(target), Create(w1), Create(w2), FadeIn(r0), run_time=0.9)
        self.wait(0.3)

        d = Dot(client.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(leg.get_left() + LEFT * 0.15), run_time=0.8, rate_func=smooth)
        err = mono('edge sealed by policy', 22, RED).move_to([0, -2.35, 0])
        self.play(d.animate.set_color(RED), leg.tinted(RED, 0.3), FadeIn(err), run_time=0.4)
        self.wait(1.2)
        self.play(FadeOut(d), FadeOut(err), leg.tinted(BLUE, 0.16), run_time=0.3)

        self.say("Open it with update_agent: ingress_rule=allow_all_ingress.")
        r1 = rule("allow_all_ingress", GREEN)
        self.play(FadeTransform(r0, r1), run_time=0.5)
        self.wait(0.6)

        self.say("The frame is admitted. The leg sends the item on as itself.")
        d = Dot(client.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(leg.get_left()), run_time=0.7, rate_func=smooth)
        self.play(FadeOut(d), leg.tinted(GREEN, 0.3), run_time=0.3)
        g1 = mono('web_ws.can_call      files: ["reflect"]', 21, GREEN).move_to([0, -1.3, 0]).align_to([-6.4, 0, 0], LEFT)
        g2 = mono('files.callable_by    web_ws: ["reflect"]', 21, GREEN).move_to([0, -1.9, 0]).align_to([-6.4, 0, 0], LEFT)
        self.play(FadeIn(g1), FadeIn(g2), run_time=0.4)
        d2 = Dot(leg.get_right(), radius=0.12, color=CYAN)
        self.add(d2)
        self.play(d2.animate.move_to(target.get_left()), run_time=0.8, rate_func=smooth)
        ok = mono('status: "completed"', 22, GREEN).move_to([3.4, -2.6, 0])
        self.play(FadeOut(d2), target.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.4)
        self.finish()


class ForwardBridge(FScene):
    """Kernel to kernel: forward out as a call frame, reply frame back."""

    TITLE = "Kernel to kernel with forward"

    def construct(self):
        self.play(FadeIn(self.header()), run_time=0.4)
        Y = 0.2
        ca, ta = panel("kernel A", 6.2, 2.6, -3.7, Y)
        cb, tb = panel("kernel B", 6.2, 2.6, 3.7, Y)
        a = Node("a", w=1.1, h=0.9, color=BLUE, size=28).move_to([-5.9, Y, 0])
        bridge = Node("ws_bridge", w=2.2, h=0.9, color=CYAN, size=22).move_to([-2.9, Y, 0])
        leg = Node("web_ws", w=1.7, h=0.9, color=BLUE, size=22).move_to([2.4, Y, 0])
        src = Node("src", w=1.2, h=0.9, color=VIOLET, size=26).move_to([5.6, Y, 0])
        l1 = Line(a.get_right(), bridge.get_left(), color=LINE, stroke_width=3)
        wire = DashedLine(bridge.get_right(), leg.get_left(), color=LINE, dash_length=0.14, stroke_width=3)
        l3 = Line(leg.get_right(), src.get_left(), color=LINE, stroke_width=3)
        wl = mono("ws", 18, DIM).next_to(wire, UP, buff=0.12)

        self.say("Agent a sends its bridge a forward item for the remote src.")
        self.play(FadeIn(ca), FadeIn(ta), FadeIn(cb), FadeIn(tb), FadeIn(a), FadeIn(bridge), FadeIn(leg), FadeIn(src),
                  Create(l1), Create(wire), Create(l3), FadeIn(wl), run_time=0.9)
        fwd = pill("forward src", color=AMBER, size=19).move_to(a.get_top() + UP * 0.5)
        self.play(FadeIn(fwd), run_time=0.3)
        self.play(fwd.animate.move_to(bridge.get_top() + UP * 0.5), run_time=0.8, rate_func=smooth)
        self.play(bridge.tinted(CYAN, 0.35), FadeOut(fwd), run_time=0.3)

        self.say("The bridge ships a plain call frame over the socket.")
        call = pill("call · id · src", color=CYAN, size=19).move_to(bridge.get_top() + UP * 0.5)
        self.play(FadeIn(call), run_time=0.25)
        self.play(call.animate.move_to(leg.get_top() + UP * 0.5), run_time=1.0, rate_func=smooth)
        self.play(FadeOut(call), leg.tinted(CYAN, 0.35), run_time=0.3)

        self.say("Kernel B's leg judges it, as the leg that serves it there.")
        d = Dot(leg.get_right(), radius=0.12, color=CYAN)
        self.add(d)
        self.play(d.animate.move_to(src.get_left()), run_time=0.8, rate_func=smooth)
        self.play(FadeOut(d), src.tinted(GREEN, 0.3), leg.tinted(GREEN, 0.3), run_time=0.3)

        self.say("A reply frame returns the data. a settles completed.")
        rep = pill("reply · id · data", color=GREEN, size=19).move_to(leg.get_bottom() + DOWN * 0.5)
        self.play(FadeIn(rep), run_time=0.25)
        self.play(rep.animate.move_to(bridge.get_bottom() + DOWN * 0.5), run_time=1.0, rate_func=smooth)
        self.play(rep.animate.move_to(a.get_bottom() + DOWN * 0.5), bridge.tinted(GREEN, 0.3), run_time=0.7, rate_func=smooth)
        ok = mono('status: "completed"', 21, GREEN).move_to([-3.7, -2.35, 0])
        self.play(FadeOut(rep), a.tinted(GREEN, 0.3), FadeIn(ok), run_time=0.4)
        self.finish()
