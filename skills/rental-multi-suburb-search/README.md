# Multi-Suburb Rental Search Workflow

**Purpose:** Parallel rental search across multiple suburbs using dedicated sub-agents
**Avoids:** API rate limits, search bottlenecks
**Benefits:** Faster searches, better coverage, resilient to failures

---

## Architecture

```
Manager Agent (Coordinator)
    │
    ├─ 🏠 Sub-agent #1: Preston
    ├─ 🏠 Sub-agent #2: Thornbury
    ├─ 🏠 Sub-agent #3: Regent
    ├─ 🏠 Sub-agent #4: Ruthven
    ├─ 🏠 Sub-agent #5: Keon Park
    ├─ 🏠 Sub-agent #6: Thomastown
    └─ 🏠 Sub-agent #7: Lalor
```

**How it works:**
1. Manager deploys 7 dedicated sub-agents (one per suburb)
2. Each sub-agent searches independently
3. Manager collects all results
4. Manager compiles into single report
5. Sorts by best value (commute + price)

---

## Usage

### Quick Start

```bash
# From this directory
python3 multi_suburb_search.py
```

### Custom Search

```python
from multi_suburb_search import RentalSearchManager

# Configure search
manager = RentalSearchManager(
    suburbs=["Preston", "Thornbury", "Lalor"],
    min_beds=2,
    max_price=600,
    office="452 Johnston Street, Abbotsford"
)

# Run search
results = manager.run()

# Get report
manager.compile_report(results)
```

---

## Files

- `multi_suburb_search.py` - Main search manager
- `config.json` - Default search criteria
- `SKILL.md` - Skill documentation
- `README.md` - This file

---

## Advantages

✅ **No Rate Limits** - Each sub-agent uses independent endpoint
✅ **Parallel Processing** - All suburbs searched simultaneously
✅ **Resilient** - If one fails, others continue
✅ **Reusable** - Use for any suburb list
✅ **Flexible** - Easy to add/remove suburbs

---

## Requirements

- OpenClaw sessions_spawn capability
- Domain.com.au snapshot access
- Agent Browser CLI

---

## Future Enhancements

- [ ] Save results to rental-tracker database
- [ ] Auto-filter by transport preferences
- [ ] Email/Telegram notification on completion
- [ ] Historical search comparison
- [ ] Price trend analysis

---

**Created:** 2026-02-27
**Status:** Production ready
