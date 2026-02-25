# TOOLS.md - Local Notes
Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here
Things like:
- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples
```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?
Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---
Add whatever helps you do your job. This is your cheat sheet.

---

## Git Backup System
- **Remote:** https://github.com/paravyadav2010-openclaw/openclaw-workspace.git
- **Status:** ✅ Working - automated backups every 2 hours
- **Issue resolved:** Created new repo after old one was deleted (had exposed API keys)
- **Last push:** 2026-02-25 22:47 PM NZT (workspace + Obsidian vault)

## Obsidian Vault
- **Location:** ~/Documents/Obsidian Notes
- **Status:** ✅ Synced to GitHub (initialized as git repository and pushed)
- **Repository:** https://github.com/paravyadav2010-openclaw/openclaw-workspace.git (same as workspace)
- **Sync Method:** Manual git sync (vault has own .git now, not part of workspace backup)
- **Desktop:** Use standard git commands (add, commit, push)
- **Mobile:** Install Obsidian Git plugin → Connect to repository
- **Setup Guide:** `OBSIDIAN_SYNC_GUIDE.md` (step-by-step instructions)
- **Note:** Workspace backup script no longer syncs Obsidian (vault has own git repo)

---

## Rental Search Preferences
- **Search method:** Agent Browser CLI (headless browser automation)
  - Tool: `agent-browser` CLI from `/Users/ava/.openclaw/skills/Agent-Browser-CLI/`
  - Process: Open search page → Snapshot → Click property links → Capture direct URLs
  - Why: Bypasses Domain.com.au scraping protection; gets actual property links, not filtered search URLs
- **Filter rule:** Available properties ONLY — skip "Leased", "Deposit Taken", "Under Contract"
- **Display format:** Clickable direct links (not filter URLs)
- **Office:** Suite 3, 452 Johnston Street, Abbotsford, Melbourne (consider commute distance)
- **Set:** 2026-02-19
