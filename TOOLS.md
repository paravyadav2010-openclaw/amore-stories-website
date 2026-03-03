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

---

## Multi-Agent Strategy (CRITICAL WORKFLOW)

### ⚡ ALWAYS Use Parallel Sub-Agents for Complex Tasks

**Rule:** For any task with 3+ independent units, deploy parallel sub-agents (one per unit)

**Why:**
- ⚡ 3-10x faster than sequential processing
- 🚫 Avoids API rate limits (independent endpoints)
- 💪 Resilient (if one fails, others continue)
- 📊 Better coverage (each task gets dedicated attention)

**When to Use:**
- ✅ Multiple suburbs/locations to search
- ✅ Multiple files to process
- ✅ Multiple datasets to analyze
- ✅ Multiple pages to scrape
- ✅ Any task with independent units

**How to Deploy:**
```python
# ❌ WRONG: One agent doing everything
sessions_spawn(task="Search A, B, C, D, E, F, G", timeout=300)

# ✅ RIGHT: Multiple parallel sub-agents
sessions_spawn(task="Search A", timeout=300)
sessions_spawn(task="Search B", timeout=300)
sessions_spawn(task="Search C", timeout=300)
sessions_spawn(task="Search D", timeout=300)
sessions_spawn(task="Search E", timeout=300)
sessions_spawn(task="Search F", timeout=300)
sessions_spawn(task="Search G", timeout=300)
```

**Examples:**
- Rental search: 1 sub-agent per suburb
- Document batch: 1 sub-agent per file
- Data analysis: 1 sub-agent per dataset
- Web scraping: 1 sub-agent per page

**Rule of Thumb:** 3+ independent units = Deploy 3+ parallel sub-agents

---
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

## Obsidian Vault (Primary)
- **Location:** ~/Documents/Obsidian-OpenClaw
- **Status:** ✅ Main vault, set up 2026-02-27, has .git repo
- **Structure:** 10 folders (Dashboard, Journal, Inbox, Sources, Permanent Notes, Goals & Projects, Business, Home Life, Archive, Templates, Attachments)
- **Workflow:** Capture (Inbox) → Process → Link (Permanent Notes) → Archive
- **Sync Script:** `.obsidian-sync.sh` in vault root

## Obsidian Vault (Legacy)
- **Location:** ~/Documents/Obsidian Notes
- **Status:** Legacy vault, synced to GitHub (same repo as workspace)
- **Repository:** https://github.com/paravyadav2010-openclaw/openclaw-workspace.git
- **Sync Method:** Manual git commands, Obsidian Git plugin (mobile)
- **Setup Guide:** `OBSIDIAN_SYNC_GUIDE.md` (step-by-step instructions)

---

## Rental Search Preferences (CRITICAL RULE)

### ⚠️ MANDATORY: Always Use This Method

**Source:** `/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json`
**Search Date:** Use the most recent snapshot file

**Process:**
1. Read `latest-snapshot.json` from rentals folder
2. Extract property URLs using grep: `grep -oE 'url: https://www\.domain\.com\.com\.au/[a-z0-9-]+-(reservoir|wollert|epping|lalor)-vic-[0-9]+-[0-9]+'`
3. Extract property details (price, beds, baths) from the same file
4. **ALWAYS provide exact, clickable direct links to Domain.com.au properties**

**STRICT RULES:**
- ✅ DO: Use real snapshot data from `/Users/ava/.openclaw/workspace/rentals/`
- ✅ DO: Extract exact URLs like `https://www.domain.com.au/3-31-invermay-street-reservoir-vic-3073-17989133`
- ✅ DO: Provide price, address, beds, baths for each property
- ❌ NEVER: Use mock/test URLs
- ❌ NEVER: Use search filter URLs
- ❌ NEVER: Guess or invent property links

**Backup Method:** If snapshot unavailable, manually search Domain.com.au and extract real URLs

### Search Criteria
- **Suburbs:** Preston, Thornbury, Regent, Ruthven, Keon Park, Thomastown, Lalor (South Morang line stations)
- **Filter rule:** Available properties ONLY — skip "Leased", "Deposit Taken", "Under Contract"
- **Max budget:** Under $600/week
- **Bedrooms:** 2+ minimum
- **Display format:** Clickable direct links (not filter URLs)
- **Office:** Suite 3, 452 Johnston Street, Abbotsford, Melbourne (consider commute distance)
- **Transport priority:** Near train stations (South Morang line for easy access to CBD/Abbotsford)

**Last updated:** 2026-02-27

### ⚠️ RENTAL SEARCH: Use SINGLE Agent Only

**IMPORTANT:** Due to Domain.com.au browser tool limitations, always use **single agent (main session)** for rental searches.

**Why single agent:**
- Browser tool requires Chrome extension attachment → only main session has it
- Sub-agents cannot access browser, leading to failures/timeouts
- Parallel attempts take LONGER than single agent (26-30 min vs ~5 min each)

**AUTO-BEHAVIOR (CRITICAL):** When user asks to "search rentals" or similar:
1. ✅ Use main session browser tool to search Domain.com.au directly
2. ✅ Search 2-3 suburbs at a time sequentially
3. ✅ Preferred suburbs: **Preston, Thornbury, Regent, Ruthven, Keon Park, Thomastown, Lalor**
4. ✅ EXCLUDE: **Wollert** (user explicitly excluded)
5. ✅ Use exact Domain.com.au URLs (no mock links)
6. ✅ Sort by best value (commute + price)
7. ✅ Return with inspection times and transport details

**Search Process:**
1. Use browser tool to visit Domain.com.au
2. Search suburb with filters: 2+ beds, under $600/week
3. Extract exact URLs from search results
4. Visit each property page for details
5. Return top 10 properties per suburb

**When to use multi-suburb skill:**
- ❌ Domain.com.au searches (use single agent main session)
- ✅ Any rental search that doesn't require browser access

**How to Use:**
```bash
cd ~/.openclaw/workspace/skills/rental-multi-suburb-search

# Quick search (3 suburbs)
python3 quick_start.py --type 1

# Train station priority (7 suburbs)
python3 quick_start.py --type 2

# Budget-focused (under $500)
python3 quick_start.py --type 3
```

**Benefits:**
- ✅ No API rate limits (7x faster)
- ✅ Parallel processing (all suburbs simultaneously)
- ✅ Resilient (if one fails, others continue)
- ✅ Reusable (any suburb list, any criteria)

**See:** `WORKFLOW_SUMMARY.md` for full documentation

**Last updated:** 2026-02-27

---

## Browser Testing (CRITICAL RULE)

### ⚠️ MANDATORY: Use agent-browser CLI for Testing

**Golden Rule:** Always use `agent-browser` CLI for screenshots, form testing, and responsive design testing.

**Why agent-browser CLI:**
- ✅ No Chrome extension required
- ✅ Faster and more reliable
- ✅ Works every time without manual setup
- ✅ Headless automation
- ✅ Perfect for automated testing

**❌ Avoid:** `browser` tool (requires Chrome extension attachment - prone to errors)

**Quick Reference:**
```bash
# Open website
agent-browser open https://example.com

# Take screenshots
agent-browser screenshot /path/image.png
agent-browser screenshot --full /path/full.png

# Get interactive elements (for refs)
agent-browser snapshot -i

# Test forms
agent-browser fill @e14 "Test Name"
agent-browser fill @e15 "test@example.com"
agent-browser click @e20

# Test responsive views
agent-browser set viewport 768 1024  # Tablet
agent-browser set viewport 390 844   # Mobile

# Scroll page
agent-browser scroll down 500

# Check for errors
agent-browser errors

# Close browser
agent-browser close
```

**Detailed Instructions:**
- Full guide: `/Users/ava/.openclaw/workspace/learnings/browser-testing-methods.md`
- Skill reference: `~/.openclaw/skills/Agent-Browser-CLI/SKILL.md`

**When to use `browser` tool:**
- Only when Chrome extension is already attached
- Only for complex web UI requiring extension features

**Last updated:** 2026-03-01

---

## Overnight Self-Maintenance (CRITICAL)

### ⚠️ MANDATORY: Daily Overnight Jobs at 4:00 AM & 4:30 AM

**System runs automated maintenance every night to keep OpenClaw healthy and backed up.**

---

### 4:00 AM Daily - Self-Maintenance

**Script:** `~/.openclaw/workspace/maintenance-4am.sh`
**Schedule:** 0 4 * * * (Pacific/Auckland)
**Tasks:**
1. ✏️  Update OpenClaw CLI, packages, and skills
2. 🔄  Restart OpenClaw Gateway
3. 📊  Report results to monitoring
4. 🚨  Alert if anything fails

**What gets updated:**
- OpenClaw CLI (npm)
- Python packages (requirements.txt)
- All skills (skill requirements.txt)

**Logs:** `~/.openclaw/workspace/maintenance-4am.log`

---

### 4:30 AM Daily - Backup & Secret Scan

**Script:** `~/.openclaw/workspace/maintenance-430am.sh`
**Schedule:** 30 4 * * * (Pacific/Auckland)
**Tasks:**
1. 📁  Identify all critical files (SOUL.md, MEMORY.md, configs, skills, workspace)
2. 🔍  Scan for leaked secrets and replace with placeholders like [API_KEY]
3. 📦  Commit with date and change summary
4. 📤  Push to private backup repo on GitHub
5. 🚨  Alert if anything fails

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

**Logs:** `~/.openclaw/workspace/maintenance-430am.log`

---

### How to Manually Run

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

### How to Disable

```bash
# Edit cron jobs
cd ~/.openclaw/cron
jq '.jobs[] | select(.name | contains("Overnight") or contains("maintenance-4am")) | .enabled = false' jobs.json > jobs.tmp
mv jobs.tmp jobs.json
```

---

### Troubleshooting

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

# Add remote if missing
git remote add origin https://github.com/paravyadav2010-openclaw/openclaw-workspace.git

# Push manually
git push origin main
```

**Secret scan finds false positives:**
- Patterns are conservative
- Review `maintenance-430am.log` for details
- Whitelist patterns by editing script if needed

---

**Last updated:** 2026-03-04

---

## Humanizer Skill (CRITICAL)

### ⚠️ MANDATORY: Apply Humanizer to All AI-Generated Content

**Transform AI-written text to sound like YOU, not like a machine.**

---

### When to Use

**ALWAYS apply humanizer before sending AI content to user:**

- ✅ Emails
- ✅ Social media posts
- ✅ Scripts and copy
- ✅ Blog posts
- ✅ Any AI-generated text

---

### Usage

**Command Line:**
```bash
cd ~/.openclaw/workspace/skills/humanizer

# Humanize a file
python3 humanizer.py input.txt

# Humanize text string
python3 humanizer.py --text "Your AI text here"

# Learn from your writing style
python3 humanizer.py --learn ~/Documents/Obsidian-OpenClaw/01-Journal/

# Test with sample text
python3 humanizer.py --test

# Show before/after comparison
python3 humanizer.py --compare
```

**Python Module:**
```python
from humanizer import Humanizer

humanizer = Humanizer()
humanized = humanizer.humanize("Your AI text here")
```

---

### Rules Applied

**1. Em Dashes** — Convert em dashes (—) to regular dashes (--) or rewrite sentence

**2. AI Giveaway Words** — Remove:
- certainly, indeed, delve, navigate, landscape
- furthermore, moreover, consequently, additionally
- utilize, leverage, optimize, enhance, streamline
- seamlessly, comprehensive, robust, cutting-edge

**3. Exclamation Marks** — Limit to 1-2 per paragraph max

**4. Repetitive Starts** — Don't start multiple sentences/bullets with same word

**5. Sentence Variety** — Mix short, medium, long sentences naturally

**6. Formal Transitions** — Remove overly formal phrases (e.g., "Furthermore", "Moreover")

**7. Style Matching** — Learn from user's writing examples

---

### Example

**Before (AI-generated):**
```
Indeed, the solution—while complex—delves into navigating the
landscape of modern productivity. Furthermore, it certainly leverages
multiple strategies to optimize efficiency!

Furthermore, you can implement this easily! Additionally, it's great for teams!
```

**After (Humanized):**
```
The solution, while complex, explores modern productivity. It uses multiple
strategies to improve efficiency.

You can implement this easily. It's also great for teams.
```

---

### Configuration

**Edit `~/.openclaw/workspace/skills/humanizer/config.json` to customize:**

```json
{
  "rules": {
    "max_exclamations_per_paragraph": 2,
    "avoid_words": ["certainly", "indeed", "delve"],
    "sentence_length_variety": true,
    "avoid_repetitive_starts": true,
    "formal_transitions": ["furthermore", "moreover"]
  },
  "style": {
    "tone": "casual-professional",
    "directness": 0.8,
    "contractions": true,
    "common_phrases": ["Here's what I found", "Let me break this down"]
  }
}
```

---

### Learn Your Style

**Create style profile from your writing:**

```bash
# Learn from your journal entries
python3 humanizer.py --learn ~/Documents/Obsidian-OpenClaw/01-Journal/

# View learned patterns
python3 humanizer.py --profile
```

**Detected patterns:**
- Common phrases: "Here's what I found", "Let me break this down"
- Sentence length: Mixed, mostly 10-20 words
- Tone: Direct, casual but professional
- Transitions: Simple (and, also, but)

---

### Automatic Integration

**OpenClaw should apply humanizer automatically:**

```python
from humanizer import Humanizer

humanizer = Humanizer()

# Before sending any AI content to user:
email_content = humanizer.humanize(ai_generated_email)
social_post = humanizer.humanize(ai_generated_post)
script_content = humanizer.humanize(ai_generated_script)

# Send humanized result to user
```

---

### Goal

**Output should sound like YOU, not like AI.**

**Remove AI giveaways:**
- No em dashes (—)
- No "certainly", "indeed", "delve", "navigate", "landscape"
- No excessive exclamation marks
- No repetitive sentence starts
- No overly formal transitions
- Natural sentence length variety
- YOUR voice and style

---

**Last updated:** 2026-03-04
