# Melbourne Rental Tracker - Requirements

## Property Criteria

- **Bedrooms:** 2+ (houses, units, apartments)
- **Budget:** Max $600/week
- **Location:** Near public transport
- **Commute:** <1 hour to office (Suite 3, 452 Johnston Street, Abbotsford)
- **Suburbs:** Wollert, Epping, Reservoir, South Morang (expand as needed)

## Features

1. **Scheduled Searches** — Run 2x daily (10am, 10pm NZT)
2. **New Listing Detection** — Compare with previous results, flag new only
3. **Telegram Alerts** — Immediate notification for new properties
4. **Property Status Tracking** — Available, Inspection Booked, Applied
5. **Direct Links** — Agent Browser CLI gets actual property URLs

## Workflow

```
1. Search Domain.com.au via Agent Browser CLI
2. Extract property details (price, beds, address, URL, suburb)
3. Filter by criteria (price ≤ $600, beds ≥ 2)
4. Compare with stored results
5. Send Telegram alert for NEW properties only
6. Update property database (JSON)
```

## Office Location

**Weta FX Office:** Suite 3, 452 Johnston Street, Abbotsford, Melbourne
- Transport zone: Zone 1
- Nearby stations: Victoria Park, Collingwood, North Richmond
