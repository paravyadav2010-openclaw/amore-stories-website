# Melbourne Rental Tracker

Automated rental property search and tracking for Melbourne suburbs.

## Current Setup

✅ **Already Running:** Automated search via cron job (10am & 10pm NZT)
- Suburbs: Wollert, Epping, Reservoir, South Morang
- 2+ bedrooms, max $600/week
- Results sent to your Telegram automatically

## Requirements

- 2+ bedrooms (houses, units, apartments)
- Max $600/week
- Near public transport
- <1 hour commute to Abbotsford office (Suite 3, 452 Johnston Street)

## How It Works

1. **Cron Job** (every 12 hours):
   - Spawns sub-agent to search Domain.com.au
   - Uses Agent Browser CLI for direct property links
   - Sends results to your Telegram

2. **Property Tracker** (coming soon):
   - Stores all found properties in `properties-db.json`
   - Compares new search results with previous
   - Flags truly NEW properties only
   - Tracks property status (new, viewed, applied)

## Files

- `properties-db.json` — Property database
- `previous-properties.json` — Previous run (for comparison)
- `track.py` — Property tracking script

## Manual Commands

**Check tracker status:**
```bash
cd /Users/ava/.openclaw/workspace/rental-tracker
python3 track.py status
```

**Add properties from search results:**
```bash
python3 track.py add results.json
```

## Next Steps

The automated search is already working. To add tracking:

1. Get the next search results from Telegram
2. Save them as `results.json` in this directory
3. Run: `python3 track.py add results.json`
4. The system will flag which properties are truly new

This way you'll only get alerts for brand-new listings! 🏠
