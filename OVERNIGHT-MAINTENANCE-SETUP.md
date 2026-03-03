# Overnight Self-Maintenance - Setup Complete

## Overview

Automated overnight maintenance jobs are now configured to run daily at 4:00 AM and 4:30 AM NZT.

## Schedule

### 4:00 AM Daily - Self-Maintenance
- **Script:** `~/.openclaw/workspace/maintenance-4am.sh`
- **Purpose:** Keep OpenClaw updated and healthy

**Tasks:**
1. ✏️ Update OpenClaw CLI, packages, and skills
2. 🔄 Restart OpenClaw Gateway
3. 📊 Report results to monitoring
4. 🚨 Alert if anything fails

**What gets updated:**
- OpenClaw CLI (npm)
- Python packages (requirements.txt)
- All skills (skill requirements.txt)

---

### 4:30 AM Daily - Backup & Secret Scan
- **Script:** `~/.openclaw/workspace/maintenance-430am.sh`
- **Purpose:** Backup critical files and scan for leaked secrets

**Tasks:**
1. 📁 Identify all critical files (SOUL.md, MEMORY.md, configs, skills, workspace)
2. 🔍 Scan for leaked secrets and replace with placeholders like [API_KEY]
3. 📦 Commit with date and change summary
4. 📤 Push to private backup repo on GitHub
5. 🚨 Alert if anything fails

**Critical Files Scanned:**
- SOUL.md, USER.md, MEMORY.md
- AGENTS.md, TOOLS.md, HEARTBEAT.md
- MODEL-PREFERENCES.md, IDENTITY.md
- rentals/, skills/, memory/
- ~/.openclaw/cron/
- ~/.openclaw/openclaw.json

**Secret Patterns Detected:**
- OpenAI API keys (sk-, pk-)
- Anthropic API keys (gsk_)
- Google API keys (AIza...)
- AWS access keys (AKIA...)
- GitHub tokens (ghp_)
- Slack tokens (xoxb-)
- Bearer tokens
- API keys and passwords

---

## Log Files

**4:00 AM Maintenance:**
```
~/.openclaw/workspace/maintenance-4am.log
```

**4:30 AM Backup:**
```
~/.openclaw/workspace/maintenance-430am.log
```

---

## Manual Execution

```bash
# Run 4:00 AM maintenance
~/.openclaw/workspace/maintenance-4am.sh

# Run 4:30 AM backup
~/.openclaw/workspace/maintenance-430am.sh

# Check logs
tail -f ~/.openclaw/workspace/maintenance-4am.log
tail -f ~/.openclaw/workspace/maintenance-430am.log
```

---

## Disable Jobs

```bash
# Edit cron jobs
cd ~/.openclaw/cron
# Disable jobs in jobs.json (set "enabled": false)
```

---

## Troubleshooting

**Gateway fails to restart:**
```bash
# Manual restart
openclaw gateway stop
sleep 5
openclaw gateway start
openclaw gateway status
```

**Git push fails:**
```bash
# Check remote
cd ~/.openclaw/workspace
git remote -v

# Push manually
git push origin main
```

---

## Cron Job IDs

- `maintenance-4am-daily` - Overnight Self-Maintenance 4am
- `overnight-backup-430am` - Overnight Backup & Secret Scan 430am

---

## Status

✅ Scripts created and tested
✅ Scripts made executable
✅ Cron jobs added to jobs.json
✅ TOOLS.md updated with documentation

---

**Setup Complete!**

First run scheduled:
- 4:00 AM: Overnight Self-Maintenance
- 4:30 AM: Backup & Secret Scan

Check logs tomorrow morning to verify everything works correctly.
