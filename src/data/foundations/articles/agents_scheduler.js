// Scheduler — Agents. Facts: coder/tmp/foundations/facts/agents_scheduler.md (fantastic main df457a0f).
import { src, tree } from '../lib.js'

export default {
  headline: 'The scheduler: recurring sends that fire as the scheduler',
  description: 'How the Aisixteen Fantastic scheduler repeats a send on a timer: one interval per schedule, a loop that sleeps until the next fire, and every fire sent as the scheduler.',
  summary: 'A schedule repeats one send every N seconds; the loop sleeps until the next fire, and each fire goes out as the scheduler.',
  cover: { clip: 'fire' },
  about: ['Aisixteen Fantastic', 'Task scheduling', 'Recurring jobs'],
  lead: [
    'The **scheduler** is an agent that repeats a send. You give it a target, a payload and an interval in seconds; it sends that payload to that target every interval, and keeps a record of each fire.',
    'This page follows one schedule: how it is added, how a fire goes out, and when the loop wakes. The Rust and Python runtimes answer the same verbs in the same way. Its schedules persist as described in [State and persistence](/fantastic/foundations/kernel/state/).',
  ],
  sections: [
    {
      id: 'add',
      title: 'A schedule is a record with an interval',
      blocks: [
        'The scheduler’s `handler_module` is `scheduler.tools`. Its verbs are `schedule`, `unschedule`, `list`, `pause`, `resume`, `tick_now` and `history`, plus `reflect` and `boot`. Any other verb is refused as unhandled (see [Refusals](/fantastic/foundations/protocol/refusals/)). The kernel sends `boot` to a new agent when it creates it, and `boot` starts the fire loop; a second `boot` changes nothing.',
        '`schedule` takes a `target`, a `payload` and an `interval_seconds`. The payload is the call itself: any verb the target answers, with its arguments. It must carry a `type`. The interval defaults to 60 and must be an integer of at least 1. An optional `fire_timeout` is a positive number of seconds that bounds each fire. Without it a fire waits forever; the kernel does not default it.',
        { code: '{"type": "schedule", "target": "monitor",\n "payload": {"type": "reflect"}, "interval_seconds": 30}\n→ {"schedule_id": "sch_a1b2c3", "schedule": {…}}', label: 'schedule (illustrative ids)' },
        'The scheduler stores a record: `id` (`sch_` and six hex digits), `target`, `payload`, `interval_seconds`, `created_at`, `next_run` (now plus the interval), `run_count` (0) and `paused` (false), and `fire_timeout` if you gave one. The first fire comes one interval after you add the schedule, not at once.',
        'A missing `target` or a payload without a `type` is refused with an error. A value that is present but wrong is refused as `bad_arg`: `interval_seconds: "60"`, `true` or a float, and a `fire_timeout` that is not a positive number. The scheduler does not guess what the caller meant.',
        { video: 'add' },
        'There is no verb that changes an interval. To change a cadence, `unschedule {schedule_id}` and `schedule` again. If the record cannot be saved, `schedule` answers an error and keeps no schedule.',
      ],
    },
    {
      id: 'fire',
      title: 'A fire goes out as the scheduler',
      blocks: [
        'When a schedule is due, the loop first counts the fire: it adds 1 to `run_count`, sets `next_run` to now plus `interval_seconds`, and saves the schedules. Only then does it send. A crash during the send therefore cannot repeat the same tick after a restart. The next fire counts from the tick, so a late tick does not bring a burst of catch-up fires.',
        'Every schedule that is due in the same tick goes out in one batch send, and the items run concurrently, so one slow target does not hold back the others. A schedule’s `fire_timeout` becomes the `timeout` of its item.',
        'The send is the scheduler’s own: the loop is a task that the scheduler’s `boot` spawned, named `tick_loop`, so it shows in `ps` and `cancel` can stop it (see [Tasks and waiting](/fantastic/foundations/kernel/tasks/)). The [call gate](/fantastic/foundations/protocol/call-gate/) judges every fire as any other send from the scheduler: the scheduler’s `can_call` must name the target, and the target’s `callable_by` must name the scheduler. Without both grants each fire is refused, and the refusal lands in the history.',
        { code: 'scheduler.can_call     {"monitor": ["reflect"]}\nmonitor.callable_by    {"scheduler": ["reflect"]}', label: 'the grants a fire needs (illustrative ids)' },
        'After the send, the scheduler records one `schedule_fired` event per fire. It holds `schedule_id`, `scheduler_id`, `target`, `payload`, `result`, `error`, `ts` and `duration_ms`. `result` is the target’s reply when the fire completed. Otherwise `result` is null and `error` is the outcome’s status and its detail. `duration_ms` times the whole batch, so schedules fired together share it.',
        'The event goes to the scheduler’s own inbox and is appended to its history. It does not go to the target. The target gets the payload and nothing else, once per tick. The `history` verb returns at most the newest 500 fires of all the scheduler’s schedules; the history file itself is trimmed back to 500 once it passes 1000.',
        { video: 'fire' },
      ],
    },
    {
      id: 'wake',
      title: 'Sleeping until the next fire',
      blocks: [
        'The loop has no fixed tick. It fires what is due, then sleeps until the earliest `next_run` of any unpaused schedule. A schedule at 5 seconds and one at 10 minutes share one scheduler, and an idle scheduler does not wake at all.',
        'Something wakes the loop early whenever it changes the answer: a schedule is added, removed, paused or resumed, or the scheduler’s own record is updated. Then the loop works out the next fire again.',
        'There are two kinds of pause. `pause {schedule_id}` stops one schedule and keeps its old `next_run`. On `resume {schedule_id}`, if that time has already passed, the schedule is due at once: it fires once and then goes back to its interval. If it has not passed, the schedule waits for the remaining time. `pause` with no id sets `paused` on the scheduler’s own record, and the loop waits until `resume`.',
        { table: { head: ['verb', 'what it does'], rows: [
          ['`unschedule {schedule_id}`', 'removes the schedule; answers `{removed, schedule_id}`'],
          ['`list`', 'every schedule record'],
          ['`tick_now {schedule_id}`', 'counts and fires that schedule now, as the scheduler; leaves `next_run` alone; answers `{fired, schedule_id, result, error}`'],
          ['`history {limit?, schedule_id?}`', 'the newest `limit` fires (1 to 500, default 100) of all schedules, then filtered by `schedule_id`'],
        ] } },
        '`tick_now` answers with the fire’s outcome, not only the fact that it fired. A target that refuses every fire, because the payload’s verb does not exist there, shows up at once in the `error` field. The scheduler gives its verbs to every caller the gate admits: such a caller sees, ticks, pauses and removes every schedule, and reads all the history.',
        { video: 'wake' },
      ],
    },
    {
      id: 'use',
      title: 'What a schedule can send',
      blocks: [
        'A payload is any verb the target answers. `{"type": "send", "text": "…"}` wakes an AI agent with that text. An [exec bridge](/fantastic/foundations/agents/exec-bridge/) `start` runs a one-shot check job on a timer, which suits a source that does not push.',
        'Deleting the scheduler agent (or shutting it down) stops its loop and drops its cached schedules, so an agent created later with the same id does not inherit them.',
      ],
    },
  ],
  sources: [
    ['scheduler readme (Rust)', src('src/lib/rust/crates/bundles/fantastic-scheduler/src/readme.md', 1)],
    ['scheduler (Rust)', src('src/lib/rust/crates/bundles/fantastic-scheduler/src/lib.rs', 530)],
    ['scheduler (Python, canonical)', src('src/lib/python/bundled_agents/scheduler/src/scheduler/tools.py', 208)],
    ['the fire: batch send and the schedule_fired event (Python)', src('src/lib/python/bundled_agents/scheduler/src/scheduler/tools.py', 260)],
    ['the schedule verb (Python)', src('src/lib/python/bundled_agents/scheduler/src/scheduler/tools.py', 348)],
    ['the scheduler crate', tree('src/lib/rust/crates/bundles/fantastic-scheduler')],
  ],
  clips: {
    add: {
      title: 'Add a schedule',
      caption: 'A caller sends schedule with target monitor, a reflect payload and interval_seconds 30. The scheduler stores a record with next_run set to now plus 30 and run_count 0, and answers the schedule_id. A second send with interval_seconds "60" is refused as bad_arg.',
    },
    fire: {
      title: 'A fire goes out as the scheduler',
      caption: 'The schedule is due. The loop adds 1 to run_count, sets next_run and saves, then sends the payload to monitor as the scheduler; the gate checks the scheduler’s can_call and monitor’s callable_by. monitor receives the payload once. The schedule_fired event, with the result, goes to the scheduler’s own inbox and its history.',
    },
    wake: {
      title: 'Sleeping until the next fire',
      caption: 'Two schedules, one every 5 seconds and one every 600, share one scheduler. The loop sleeps until the earlier next_run, fires it and sleeps again. Pausing a schedule takes it out of the wait; resuming it fires it at once only if its old next_run has passed. An idle scheduler sleeps with no wakeups.',
    },
  },
}
