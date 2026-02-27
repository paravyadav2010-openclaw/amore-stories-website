# Rental Property Search Guide

## Domain.com.au Search - Step by Step

## Problem
Domain.com.au URLs with suburb lists are returning 404 errors. The URL structure may have changed.

## Solution - Manual Search

### Option 1: Direct Manual Search
1. Visit: https://www.domain.com.au/rent/
2. Click "Find a Property"
3. Enter search criteria:
   - **Location:** Melbourne VIC
   - **Suburbs:** Lalor, Epping, Reservoir, Wollert (select all)
   - **Bedrooms:** 2
   - **Bathrooms:** 1
   - **Price:** $0 - $600 per week
   - **Sort by:** Date available (newest first)

### Option 2: Use Agent Browser
1. `agent-browser open "https://www.domain.com.au/rent/"`
2. Take snapshot: `agent-browser snapshot -i`
3. Find search filters in snapshot
4. Fill in criteria using `agent-browser fill` and `agent-browser click`

### Option 3: Alternative Search Sites
- **Realestate.com.au:** https://www.realestate.com.au/rent/
- **AllHomes.com.au:** https://www.allhomes.com.au/rent/vic/melbourne/

## What I Can Help With

Once you have search results:
1. Send me screenshots of property listings
2. Send me individual property URLs
3. I'll extract details for each:
   - Rent price
   - Availability status
   - Bedrooms/Bathrooms
   - Address
   - Agent contact
   - Commute to Weta FX office

## Recommendation
Use **Option 1** (Direct Manual Search) - it's the most reliable method right now.

---

**Date:** 2026-02-27
