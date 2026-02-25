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
- **Last push:** 2026-02-25 15:XX NZT

## Obsidian Vault
- **Location:** ~/Documents/Obsidian Notes
- **Status:** Git-based sync (manual setup needed)
- **GitHub Repo:** https://github.com/paravyadav2010-openclaw/openclaw-workspace.git

### Setup Instructions

#### Desktop (Option A - Recommended - Clone to New Location)
```bash
# 1. Clone GitHub repo to sync location
git clone git@github.com:paravyadav2010-openclaw/openclaw-workspace.git ~/Documents/Obsidian-Sync

# 2. Move existing vault into cloned repo
mv ~/Documents/"Obsidian Notes"/* ~/Documents/Obsidian-Sync/

# 3. Open Obsidian Settings → Open Folder: ~/Documents/Obsidian-Sync
```

#### Desktop (Option B - Initialize Git in Place)
```bash
# 1. Initialize git in current vault
cd ~/Documents/"Obsidian Notes"
git init
git remote add origin git@github.com:paravyadav2010-openclaw/openclaw-workspace.git
git add -A
git commit -m "Initial commit: Obsidian vault"
git push -u origin main
```

#### Mobile (iOS/Android)
1. Install **Obsidian Git** plugin from Community Plugins
2. Settings → Third-party plugin → Obsidian Git → Enable
3. Add GitHub repo: `git@github.com:paravyadav2010-openclaw/openclaw-workspace.git`
4. Generate GitHub Personal Access Token: https://github.com/settings/tokens (classic, repo scope, no expiry)
5. In Obsidian Git plugin settings → Add Token
6. Pull to sync from GitHub

### Sync Frequency
- **Desktop:** Every 2 hours via backup-hourly.sh
- **Mobile:** Manual pull or auto-sync in Obsidian Git plugin

### Notes
- Create GitHub token with no expiry for best experience
- Merge conflicts happen if both devices edit same file - handle manually
- **Note:** Obsidian vault is in separate git repo and synced first, then workspace

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
