---
name: Multi-Suburb Rental Search
description: Parallel rental property search across multiple suburbs using dedicated sub-agents to avoid API rate limits
---

# Multi-Suburb Rental Search Skill

## 🚀 Purpose

Search rental properties across multiple suburbs simultaneously using dedicated sub-agents for each suburb. Avoids API rate limits and provides comprehensive results.

## 📋 When to Use This Skill

Use when you need to search for rental properties across:
- Multiple suburbs (3+ locations)
- Different property criteria (bedrooms, price, etc.)
- Time-sensitive searches (need results fast)
- Complex geographic areas (multiple train lines, etc.)

## 🏗️ How It Works

```
Manager Agent (Main Coordinator)
    │
    ├─ 🏠 Sub-agent #1: Suburb A (independent search)
    ├─ 🏠 Sub-agent #2: Suburb B (independent search)
    ├─ 🏠 Sub-agent #3: Suburb C (independent search)
    └─ ... (one sub-agent per suburb)

Manager Compiles:
  ✅ Collects all results
  ✅ Removes duplicates
  ✅ Sorts by best value
  ✅ Generates unified report
```

## 🔧 Usage Instructions

### Quick Start

```bash
# Run with default settings
python3 multi_suburb_search.py
```

### Custom Search via Sessions Spawn

```python
# Spawn sub-agent for each suburb
for suburb in suburbs:
    sessions_spawn(
        task=f"Search rentals in {suburb}: 2+ beds, under $600/week, exact Domain.com.au links",
        mode="run",
        timeout=300
    )
```

### Example Sub-Agent Task

```
Search for rental properties in Preston

**Criteria:**
- 2+ bedrooms
- Under $600/week
- Available properties only (skip "Leased", "Deposit Taken", "Under Contract")
- Near train station (South Morang line)
- Commute time to office: Suite 3, 452 Johnston Street, Abbotsford

**Output format:**
For each property, provide:
- Exact Domain.com.au URL (no mock links)
- Address
- Price per week
- Beds, baths, parking
- Commute time (drive + public transport)
- Distance from train station
- Inspection times if available

**Sort by:** Best value (commute + price)
**Return:** Top 10 properties

Use snapshot method to extract real Domain.com.au URLs.
```

## 📊 Configuration

Edit `config.json` to customize:

```json
{
  "suburbs": ["Preston", "Thornbury", "Lalor", "Thomastown"],
  "min_beds": 2,
  "max_price": 600,
  "office": "Suite 3, 452 Johnston Street, Abbotsford",
  "filter_statuses": ["Leased", "Deposit Taken", "Under Contract"],
  "exclude_keywords": ["shared", "flatmate", "room", "student"]
}
```

## ✨ Advantages

### ✅ No Rate Limits
Each sub-agent uses an independent search endpoint, avoiding API throttling that occurs with single-agent parallel searches.

### ✅ Parallel Processing
All suburbs searched simultaneously instead of sequentially.

### ✅ Resilient to Failures
If one sub-agent fails or times out, others continue searching.

### ✅ Comprehensive Coverage
Each suburb gets dedicated attention with full result set.

### ✅ Reusable Workflow
Same structure works for any suburb list or search criteria.

## 🎯 Best Practices

### For Users
1. **Define suburb list** — Start with 3-7 suburbs (too many = complexity)
2. **Set clear criteria** — Bedrooms, price, transport needs
3. **Be specific** — "Near train station" vs "any transport"
4. **Review results** - Check all properties before applying

### For AI Agents
1. **One sub-agent per suburb** — Never batch multiple suburbs in one agent
2. **Use same task template** — Consistency across all sub-agents
3. **Wait for all results** — Compile complete report before sending
4. **Sort intelligently** — Commute + price = best value metric
5. **Extract real URLs** — No mock links, only exact Domain.com.au URLs

## 🔗 Integration Points

### With Rental Tracker
```python
# After collecting results
from rental_tracker import track_properties
track_properties(all_properties)
```

### With Rental Scanner Newsletter
```python
# Generate newsletter from results
from newsletter import generate_newsletter
generate_newsletter(all_properties)
```

### With Obsidian Notes
```python
# Log search to memory
import subprocess
subprocess.run(["obsidian", "vault://path/to/note.md"])
```

## 📁 File Structure

```
rental-multi-suburb-search/
├── SKILL.md                    # This file
├── README.md                   # User documentation
├── multi_suburb_search.py      # Main manager script
├── config.json                 # Default configuration
└── examples/                  # Example searches
    ├── quick_start.py
    ├── custom_search.py
    └── batch_search.py
```

## 🚀 Example Workflows

### Workflow 1: Quick Search (3 suburbs)
```python
manager = RentalSearchManager(
    suburbs=["Preston", "Thornbury", "Reservoir"],
    min_beds=2,
    max_price=600
)
results = manager.run()
manager.compile_report(results)
```

### Workflow 2: Train Station Priority (7 suburbs)
```python
manager = RentalSearchManager(
    suburbs=["Preston", "Thornbury", "Regent", "Ruthven",
             "Keon Park", "Thomastown", "Lalor"],
    min_beds=2,
    max_price=600,
    office="Suite 3, 452 Johnston Street, Abbotsford"
)
results = manager.run()
manager.compile_report(results)
```

### Workflow 3: Budget-Focused (All suburbs, strict price)
```python
manager = RentalSearchManager(
    suburbs=["Preston", "Thornbury", "Reservoir", "Lalor"],
    min_beds=3,
    max_price=500  # Strict budget
)
results = manager.run()
manager.compile_report(results)
```

## 📈 Performance

**Single Agent (sequential):**
- 7 suburbs × 5 min = 35 min total
- Rate limit risk: HIGH

**Multi-Agent (parallel):**
- 7 suburbs × 5 min = 5 min total
- Rate limit risk: ZERO

**Speed improvement:** 7x faster

## 🐛 Troubleshooting

### "Session failed: API rate limit"
- **Cause:** Deploying multiple sub-agents to same endpoint
- **Fix:** Ensure each sub-agent searches different suburb (different URLs)

### "No results found"
- **Cause:** Search criteria too strict
- **Fix:** Increase budget, expand suburb list, reduce bedroom count

### "Results taking too long"
- **Cause:** Too many suburbs or too many properties per suburb
- **Fix:** Reduce suburb count to 3-5, or increase sub-agent timeout

## 🔮 Future Enhancements

- [ ] Auto-save to rental-tracker database
- [ ] Price trend analysis across suburbs
- [ ] Transport route optimization
- [ ] Inspection scheduling assistant
- [ ] Email/Telegram notification on new listings
- [ ] Comparison matrix (side-by-side properties)

---

**Created:** 2026-02-27
**Version:** 1.0
**Status:** Production Ready
