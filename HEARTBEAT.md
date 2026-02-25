# Heartbeat Task Checklist

## Periodic Tasks (Every Heartbeat)

**Daily:**
- Review recent memories (today + yesterday)
- Check for pending action items
- Review HEARTBEAT_STATE.json for any pending items
- Check PICKUP.md for paused projects

## Scheduled Tasks (Cron)

### Weekly Review (Every Monday 9 AM NZT)
🔔 WEEKLY MEMORY REVIEW - Monday Morning

Tasks:
1. Review recent memories (last 7 days)
2. Check MEMORY.md for outdated info to archive
3. Store key decisions from past week
4. Verify all memory files are intact
5. Update project status notes

### Monthly Audit (1st of Month 10 AM NZT)
📅 MONTHLY MEMORY AUDIT - 1st of Month

Full Memory Audit Checklist:
1. Full memory audit: what's working, what's missing
2. Update TOOLS.md with any new API keys or services
3. Review memory file organization
4. Check tag consistency
5. Archive old memory files (older than 6 months)
6. Review and update AGENTS.md if needed
7. Verify all skills are documented
8. Clean up any temporary files

## Heartbeat State Management

**File:** `HEARTBEAT_STATE.json`

**State tracking:**
- last_checked: ISO timestamp
- pending_tasks: array of pending items
- completed_tasks: array of completed items
- next_schedule: ISO timestamp for next heartbeat

**Default heartbeat prompt:**
`Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. If nothing needs attention, reply HEARTBEAT_OK.`
