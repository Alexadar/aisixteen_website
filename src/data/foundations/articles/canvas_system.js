import { src, tree } from '../lib.js'

const T = 'src/tui'
const SA = `${T}/bundles/fantastic-system-agents/src`
const VM = `${T}/crates/fantastic-system/src`

export default {
  headline: 'System agents: power, network, audio, displays, notifications and lock',
  description: 'How six Aisixteen Fantastic agents turn a Linux machine’s power, network, audio, displays, notifications and lock screen into verbs an AI calls like any other agent.',
  summary: 'The machine as six agents: a pure model, a driver, and one OS port, with refusals that say why.',
  cover: { clip: 'layers' },
  about: ['Aisixteen Fantastic', 'Operating system', 'Agents'],
  lead: [
    'The **system agents** are six agents that stand for the machine itself: `power`, `network`, `audio`, `displays`, `notifications` and `lock`. They are the agents of fantastic OS, and they are Rust only: the code on `main` has no Python twin.',
    'An AI calls them like any other agent: `reflect`, `state`, then their verbs. This page shows how each one is built, what it refuses and why, and why `lock` answers `user` alone.',
  ],
  sections: [
    {
      id: 'made',
      title: 'Where they come from',
      blocks: [
        '`fantastic system` and `fantastic canvas system` name the **system recipe**. On start, it makes each of the six agents under `user`. If an agent already exists, it updates it instead and resets its view, its `callable_by` and its display name, so a new build’s view replaces the old one.',
        'Each agent gets an html view, which is a canvas cell, and `user` is granted the agent’s verbs. A view only sends to its own agent id.',
        'The recipe is Linux only. Anywhere else it is refused with “`system` needs Linux with D-Bus: the system agents are fantastic OS’s”. For how a canvas shows a view, see [Views of agents](/fantastic/foundations/canvas/views/).',
        { table: { head: ['agent', 'handler', 'the machine side'], rows: [
          ['`power`', '`power.tools`', 'UPower and logind: battery, lid, power off, reboot, suspend, hibernate'],
          ['`network`', '`network.tools`', 'NetworkManager: devices, Wi-Fi access points, saved connections'],
          ['`audio`', '`audio.tools`', 'PipeWire: `pw-dump` reads, `wpctl` acts'],
          ['`displays`', '`displays.tools`', '`wlr-randr` for outputs; logind for the backlight'],
          ['`notifications`', '`notifications.tools`', 'the session bus: the agent is the notification server'],
          ['`lock`', '`lock.tools`', 'logind’s session lock and a PIN kept as a hash'],
        ] } },
      ],
    },
    {
      id: 'layers',
      title: 'Model, driver, port',
      blocks: [
        'Every agent is built in three layers. The **ViewModel** is pure: `reduce(event)` is its only mutation and returns **effects** as plain data, and `state()` is what a view draws. Time arrives as a number in an event, and nothing in the model touches the OS.',
        'The **driver** is one task per agent. It feeds events in, runs each effect through the **OS port**, and feeds the answers back. Only the Linux side of the port talks to the machine: D-Bus, `wpctl`, `wlr-randr`. On any other OS the port refuses.',
        'When a reduce changes the state, the driver emits `{"type": "state", "state": …}` to the agent’s watchers. It emits at most once per 100 ms, and always the latest state. A tick reaches each model every 5 seconds, so a model can re-read the machine or expire an item.',
        'A verb’s reply is the state after its effects ran, or the first refusal. A change made elsewhere reaches the watchers too, because the port reports OS-side changes as events. A canvas cell watches the agent over its socket leg and receives each emit as an `event` frame ([Web agents](/fantastic/foundations/agents/web/#ws)).',
        { video: 'layers' },
      ],
    },
    {
      id: 'refusals',
      title: 'Unavailable, and refusals that say why',
      blocks: [
        'When a service is missing, the agent still exists. `reflect` and `state` say `available: false` with a `why`, and every other verb is refused with the reason `unavailable`. The boot does not fail.',
        'A refusal is `{error, reason}`, the shape from [Refusals](/fantastic/foundations/protocol/refusals/). The reasons here are these.',
        { table: { head: ['reason', 'meaning'], rows: [
          ['`unavailable`', 'the service is not there, or a read has not succeeded yet'],
          ['`denied`', 'the OS asked for authentication or said no'],
          ['`unsupported`', 'this machine cannot do it, or the verb is not offered in this state'],
          ['`failed`', 'any other OS error'],
          ['`bad_arg`, `not_found`', 'a verb’s arguments: missing or wrong, or naming nothing that exists'],
        ] } },
        'The power verbs show the pattern. logind reports `can` for each of `power_off`, `reboot`, `suspend` and `hibernate` as `yes`, `no`, `challenge` or `na`, and the model reads it at start and again every 30 seconds. A verb runs only when its `can` is `yes`.',
        { code: 'yes        -> the call runs\nchallenge  -> denied: "needs authentication — is the polkit rule installed?"\nno, na     -> unsupported: "this machine cannot"', label: 'power: logind’s can decides' },
        'The decision is made in the model, before the OS is asked. Nothing in these agents is interactive: there is no authentication prompt. On fantastic OS, a polkit rule lets the user `fantastic` power off, reboot, suspend and hibernate, and use NetworkManager.',
        { video: 'refusal' },
      ],
    },
    {
      id: 'agents',
      title: 'What each agent adds',
      blocks: [
        { h3: 'network' },
        'Verbs: `scan`, `connect {ssid, password?}`, `activate {uuid}`, `deactivate {iface}`, `forget {uuid}` and `set_wireless {enabled}`. `connect` activates a saved connection with that SSID, and otherwise makes a new one. It refuses with `bad_arg` for a missing `ssid`, a missing password or a WPA password that is not 8 to 63 characters or 64 hex digits. It refuses `enterprise` and `wep` networks as `unsupported`, and refuses with `not_found` when the SSID is not in range. The password is held in a type that does not serialize, so it is not in the state.',
        { h3: 'audio' },
        'Verbs: `set_volume {volume, id?}`, `set_mute {muted, id?}` and `set_default {id}`. Without `id` they act on the default sink. A volume is clamped to 0.0 to 1.5. The state follows `pw-dump --monitor`, so a change made by another program reaches the watchers.',
        { h3: 'displays' },
        'Verbs: `set_output {name, mode?, scale?, transform?, position?, enabled?}` and `set_brightness {value}`. `wlr-randr` has no change stream, so the state is read every 5 seconds and after each verb. Turning off the last enabled output is refused as `unsupported`, because it would leave no screen.',
        { h3: 'notifications' },
        'This agent is the session’s notification server: it owns `org.freedesktop.Notifications`, so a notification from any program lands in `state`. The state keeps at most 50 items. The default lifetime is 8 seconds, and the model expires items on its own clock. Verbs: `notify`, `dismiss`, `dismiss_all`, `invoke` and `set_dnd`. With do-not-disturb on, new items still arrive, marked `quiet`.',
      ],
    },
    {
      id: 'lock',
      title: 'lock: for the person only',
      blocks: [
        'The `lock` agent drives the kiosk’s PIN lock screen. The Home page draws the overlay while `state.locked` is true. The code calls it “a kiosk UI lock, not a security boundary”.',
        'Its verbs are `lock`, `unlock {pin}`, `set_pin {new, old?}`, `clear_pin {pin}`, `set_auto_lock {minutes}` and `activity`. A PIN is text of 4 to 12 digits. Nothing locks until a PIN exists: `lock` is refused as `unsupported` with “set a PIN first, or nothing could unlock the screen”.',
        'After the fifth wrong PIN in a row, `retry_at_ms` is set; each try before it is refused `retry_later`. The first wait is 30 seconds, and it doubles up to 15 minutes. While a PIN is being checked, another PIN verb is refused `busy`.',
        { code: '{"available": true, "locked": true, "has_pin": true,\n "auto_lock_min": 10, "failures": 5, "retry_at_ms": 1760000000000}', label: 'lock state (illustrative values)' },
        'Unlike the other five, `lock` is not granted to an AI. The recipe’s grant code narrows it: the `callable_by` of `lock` keeps `user` alone, and no AI holder is granted `lock` in its `can_call`. The [call gate](/fantastic/foundations/protocol/call-gate/) therefore refuses an AI’s call at the caller’s own end first, so it never reaches `lock`, and no AI can unlock the screen or change the PIN.',
        { video: 'lock' },
      ],
    },
  ],
  sources: [
    ['The six agents and their ids', src(`${SA}/lib.rs`, 15)],
    ['The driver: events, effects, 100 ms emit', src(`${SA}/driver.rs`, 1)],
    ['The OS port and its errors', src(`${SA}/sys/mod.rs`, 15)],
    ['The recipe that makes them under user', src(`${T}/src/kern/system.rs`, 19)],
    ['Power: logind’s can decides', src(`${VM}/power.rs`, 225)],
    ['Lock: PIN, waits, refusals', src(`${VM}/lock.rs`, 14)],
    ['lock is narrowed to user', src(`${T}/src/kern/reach.rs`, 164)],
    ['The pure models', tree(VM)],
  ],
  clips: {
    layers: {
      title: 'Model, driver, port',
      caption: 'A verb reaches the power model as an event. The model returns an effect as data, the driver runs it through the OS port, and the answer comes back as an event. The driver then emits one state to the watchers.',
    },
    refusal: {
      title: 'logind’s can decides',
      caption: 'The power agent holds can for each verb. suspend, with can yes, runs and returns the state. reboot, with can challenge, is refused denied. hibernate, with can na, is refused unsupported. The model decides before the OS is asked.',
    },
    lock: {
      title: 'lock answers user alone',
      caption: 'An AI calls lock and the gate refuses it at its own end: no AI holder is granted lock, and lock’s callable_by names user only. The person sends unlock with a wrong PIN five times in a row. After the fifth, each try gets retry_later; the first wait is 30 seconds and it doubles up to 15 minutes.',
    },
  },
}
