# MEMORY - Curated Wisdom

> This is your long-term memory. Distilled insights, decisions, learnings that matter.

## Key Decisions

### 2026-02-27 - Unified Second Brain
**Decision:** Obsidian-OpenClaw is the single source of truth for all knowledge.

**Why:**
- Prevents file scattering
- One place to look for everything
- Zettelkasten connections work
- No duplication between systems

**What Changed:**
- Daily logs → `01-Journal/YYYY-MM-DD.md`
- Permanent wisdom → `04-Permanent Notes/`
- Quick captures → `02-Inbox/`
- Workspace files → System config only (not knowledge)

---

## Learnings

### Automation & Systems
- **File watchers need debouncing** → Avoid multiple rapid syncs
- **Git race conditions** → Frequent auto-commits can cause divergence
- **Consolidated structures** → Reduce cognitive load vs scattered folders

### Rental Search
- **Domain.com.au scraping protection** → Use Agent Browser CLI instead of direct API
- **Individual suburb searches** → Better than combined searches (too many results)
- **Availability filtering** → Skip "Leased", "Deposit Taken", "Under Contract"

### OpenClaw Setup
- **Kimi k2.5 unreliable in macOS VM** → Default to zai/glm-4.7
- **Gateway running on loopback** → Only local clients can connect
- **Token limits matter** → Track usage in every response

---

## Active Projects

### Australia Relocation (March 2026)
**Status:** In Progress

**Areas:**
- Rental property search (Melbourne suburbs: Lalor, Epping, Reservoir, Wollert)
- Immigration logistics
- Financial planning (tax, banking)
- Vehicle decision (transport Holden Equinox vs. purchase in AU)
- Childcare & schooling research

**Office:** Suite 3, 452 Johnston Street, Abbotsford, Melbourne
**Employer:** Weta FX (Visual Effects)

### Wife's Portfolio Website
**Status:** Active

**Features:**
- Beautiful, interactive design
- Parallax animations
- Showcase for graphic design work

---

## Personal Context

### Family
- **Household:** 2 adults + 1 child (daughter, under 2 years)
- **Wife:** Communications advisor/graphic designer (10+ years experience)
- **Current:** Job hunting in Australia

### Work
- **Current:** Weta FX, Wellington, NZ (Senior Rotoscope Artist, 50h/week)
- **Starting:** Weta FX, Melbourne, Australia (March 2026)
- **Career:** Visual effects, rotoscope artist since 2019

### Interests
- Cricket (weekend cricketer, wicket-keeper)
- Swimming
- Technology (Python, JavaScript, React)
- Photography
- Meditation & personal development
- Electric vehicles (researching Tesla Model Y, BYD, novated leases)

---

## Technical Setup

### Git Backup
- **Workspace:** https://github.com/paravyadav2010-openclaw/openclaw-workspace.git
- **Obsidian:** Same repo (vault has own .git)
- **Sync:** Auto every 2 hours (workspace), file watcher (Obsidian)

### Obsidian Vaults
- **Primary:** ~/Documents/Obsidian-OpenClaw (main second brain)
- **Legacy:** ~/Documents/Obsidian Notes (migrated, now redundant)

### OpenClaw Environment
- **Runtime:** macOS virtual machine
- **Gateway:** Enabled, fully configured
- **Tools:** All enabled (exec security: full)
- **Model:** zai/glm-4.7 (default)

---

*Last Updated: 2026-02-27*
