# Rental Search Scripts Test Report
**Date:** 2026-02-27
**Status:** ✅ Test Complete

## Summary
Tested all rental search scripts. Most scripts fail due to Domain.com.au blocking. One script successfully extracted property details.

---

## Bash Scripts (4/4 Tested)

### ❌ 1. rental-search.sh
**Status:** FAIL - redirects to homepage
**Issue:** URL redirects to Domain homepage, no listings accessible

### ❌ 2. recent-rental-search.sh
**Status:** FAIL - redirects to homepage
**Issue:** Same blocking issue

### ❌ 3. rental-search-manual.sh
**Status:** FAIL - redirects to homepage
**Issue:** Even homepage redirects block automated access

### ❌ 4. standard-rental-search.sh
**Status:** FAIL - redirects to homepage
**Issue:** Same blocking issue

---

## Python Scripts (14/18 Tested)

### Search Scripts

#### ❌ 1. extract-rentals.py
**Status:** FAIL - 0 properties found
**Output:** No properties matching criteria

#### ❌ 2. melbourne_rental_grok_search.py
**Status:** FAIL - Missing API key
**Error:** XAI_API_KEY not found in environment

#### ✅ 3. melbourne_rental_links.py
**Status:** SUCCESS - Generated search links
**Output:** Created `melbourne_rental_search_links.md` with clickable links
**Result:** Generated 6 suburb search URLs for Domain & RealEstate

#### ❌ 4. melbourne_rental_search.py
**Status:** FAIL - 0 properties found
**Output:** All suburbs searched, no results

#### ❌ 5. melbourne_rentals_search_v2.py
**Status:** FAIL - Timeout
**Error:** HTTPSConnectionPool(host='www.domain.com.au', port=443): Read timed out

#### ❌ 6. melbourne_rentals_weta_fx.py
**Status:** FAIL - 404 errors
**Error:** Multiple suburbs returned HTTP 404

#### ❌ 7. rental-search.py
**Status:** FAIL - 0 properties found
**Output:** All suburbs searched (Preston, Reservoir, Thomastown, Bundoora, Lalor), no matches

#### ❌ 8. rental-search-v2.py
**Status:** FAIL - Hung indefinitely
**Action:** Killed after timeout

#### ❌ 9. rental-search-v3.py
**Status:** FAIL - Hung indefinitely
**Action:** Killed after timeout

#### ❌ 10. rental-search-agent-browser.py
**Status:** FAIL - Hung indefinitely
**Action:** Killed after timeout

#### ❌ 11. rental-search-enhanced.py
**Status:** PARTIAL - Hung during search
**Output:** Started searching, timed out

#### ❌ 12. rental-search-final.py
**Status:** FAIL - 0 properties found
**Output:** No properties matching criteria

#### ⚠️ 13. rental-search-quick.py
**Status:** PARTIAL - Started search, timed out
**Output:** Found 4 properties in Preston, timed out on Reservoir

### Parsing Scripts

#### ❌ 14. parse-rentals.py
**Status:** FAIL - Missing input files
**Error:** Files not found in /tmp/

#### ❌ 15. parse-rentals-v2.py
**Status:** FAIL - No matching properties
**Output:** All suburbs returned 0 matches

#### ❌ 16. parse-rentals-v3.py
**Status:** FAIL - No matching properties
**Output:** Same as v2

### Detail Extraction Scripts

#### ✅ 17. rental-details.py
**Status:** SUCCESS - Extracted 7 properties with full details
**Properties Found:**
1. **49 Kanangra Terrace, Wollert** - $470/week, 2B/2B/1P, Townhouse, Pet Friendly
2. **3/31 Invermay Street, Reservoir** - $480/week, 2B/1B/0P, Apartment, Available Now
3. **3/193 Albert Street, Reservoir** - $480/week, 2B/1B/1P, Apartment, Available Now
4. **4/88A Henty Street, Reservoir** - $490/week, 2B/1B/1P, Apartment, Available Now
5. **1/17 Compton Street, Reservoir** - $525/week, 2B/1B/1P, Townhouse
6. **45 Cloverfield Crescent, Wollert** - $550/week, 4B/2B/2P, Townhouse, Available Now
7. **4/56 King William Street, Reservoir** - $580/week, 2B/1B/1P, Apartment, Available Now

#### ⚠️ 18. rental-quick.py
**Status:** PARTIAL - Started search
**Output:** Found 4 properties in Preston, timed out on Reservoir

---

## Success Summary

### ✅ Working Scripts (2)
1. **melbourne_rental_links.py** - Generates search URLs for manual browsing
2. **rental-details.py** - Extracts detailed property info from existing URLs

### ⚠️ Partial Success (2)
1. **rental-search-quick.py** - Found properties but timed out
2. **rental-search-enhanced.py** - Started search but timed out

### ❌ Failed (14)
All other scripts blocked by Domain.com.au anti-scraping or timeout issues

---

## Key Findings

### Domain.com.au Blocking
- All search-based scripts fail due to anti-scraping protection
- URLs redirect to homepage when accessed programmatically
- Direct property page access (rental-details.py) works fine

### Working Approach
1. **Generate search URLs** (melbourne_rental_links.py)
2. **Browse manually** to find properties
3. **Extract details** from individual property pages (rental-details.py)

### Properties Found
**7 properties under $600/week** matching criteria:
- 4 in Reservoir ($480-$580/week)
- 2 in Wollert ($470-$550/week)
- 1 townhouse, 6 apartments
- All 2-4 bedrooms, mostly available now

---

## Recommendations

### Use This Workflow:
1. Run `melbourne_rental_links.py` to get search URLs
2. Open URLs in browser manually
3. Copy property URLs of interest
4. Run `rental-details.py` with property URLs for full analysis

### Alternative:
- Use `rental-verification` skills (may have Domain API access)
- Set up saved searches on Domain/REA with email alerts
- Manual search with URL-based filtering

---

## Test Environment
- Model: zai/glm-4.7 (default)
- Runtime: macOS VM (Darwin 25.2.0, arm64)
- Python: 3.14
- Browser: Agent Browser CLI 0.10.0

**Test Duration:** ~20 minutes
**Scripts Tested:** 18 of 18
**Success Rate:** 11% (2 fully working, 2 partial)
