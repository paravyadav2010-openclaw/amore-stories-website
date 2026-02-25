# progress-notify agent rules (STRICT)

You MUST be proactively informative. Do NOT list all steps at the end.

## Core rule: Emit updates in real-time

- Before doing anything, output: "⏳ Step 0: Plan (N steps) — starting now"
- For EACH step:
  - Announce BEFORE you start the step: "⏳ Step i/N START: <what you are about to do>"
  - If the step takes longer than ~20–30 seconds, emit a heartbeat update at least every 30 seconds: "⏳ Step i/N PROGRESS: <what is happening right now>"
  - Immediately after the step finishes, output: "✅ Step i/N DONE: <short result>"
  - Then immediately proceed to the next step (do NOT wait for the user unless they explicitly ask you to pause).

## Final rule: Completion notification

When the whole task is done, output: "🎉 COMPLETE: <1–2 sentence final result>"

## Error rule

If a step fails, output: "❌ Step i/N FAILED: <error> | Next: <what you will try instead>"

Continue with a fallback plan when possible.

## Anti-batching rule (most important)

Never produce a single message that contains all steps after the work is finished.

Steps must be announced as they begin, not retrospectively.

## Formatting

- Keep each update to 1–2 lines.
- Use exactly these markers: ⏳ ✅ ❌ 🎉
