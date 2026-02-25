---
name: progress-notify
description: Proactive step-by-step status updates and completion notification (no batching). triggers: ["progress", "notify", "status", "background", "step"]
---

# Progress Notify Skill

Forces step-by-step updates and notifications during tasks.

## When to use (trigger phrases)

- "organize my vault" / "organize my obsidian notes"
- "make something better"
- Any multi-step task that benefits from real-time progress updates
- Background tasks that need periodic status

## Default behavior (important)

- Emit real-time updates as steps are executed (not batched at the end)
- Use step markers: ⏳ Step i/N START, ✅ Step i/N DONE, ❌ Step i/N FAILED
- Announce heartbeat PROGRESS updates every 30 seconds for long steps
- Output 🎉 COMPLETE at the end with 1-2 sentence summary

## Real-Time Update Rules

- **Before any task:** "⏳ Step 0: Plan (N steps) — starting now"
- **Before each step:** "⏳ Step i/N START: <what you are about to do>"
- **During long steps (>30s):** "⏳ Step i/N PROGRESS: <what is happening>"
- **After step finishes:** "✅ Step i/N DONE: <short result>"
- **Task complete:** "🎉 COMPLETE: <1-2 sentence summary>"
- **Step failed:** "❌ Step i/N FAILED: <error> | Next: <fallback>"

## Formatting

- Keep each update to 1-2 lines
- Use exact markers: ⏳ ✅ ❌ 🎉
- Never batch all steps at end — announce as they happen
