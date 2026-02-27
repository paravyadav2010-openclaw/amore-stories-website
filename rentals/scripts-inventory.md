# Rental Search Scripts Inventory

## Bash Scripts (~/.openclaw/workspace/scripts/)

### 1. `rental-search.sh` (Basic)
- **Purpose:** Standard Agent Browser search on Domain.com.au
- **URL:** `/rent/melbourne-region-vic/` with suburb parameters
- **Features:**
  - Takes snapshot of search results
  - Saves to `rentals-$TIMESTAMP.md`
  - Logging enabled
- **Status:** ❌ Not working (redirects to homepage)

### 2. `recent-rental-search.sh` (Recently Listed)
- **Purpose:** Search properties listed in last 5 days
- **URL:** `/rent/` with `sort=date-desc`
- **Suburbs:** Lalor, Epping, Reservoir, Wollert
- **Features:**
  - Date-ascending sort for newest listings
  - Extracts first 5-10 property URLs
  - Saves to `recent-rentals-$TIMESTAMP.md`
- **Status:** ❌ Not working (redirects to homepage)

### 3. `rental-search-manual.sh` (Manual Approach)
- **Purpose:** Opens Domain homepage for manual search entry
- **URL:** `https://www.domain.com.au/rent/`
- **Features:**
  - Takes snapshot of interface
  - Guides manual search entry
  - Saves to `rental-results-$TIMESTAMP.md`
- **Status:** ⚠️ Works but requires manual input

### 4. `standard-rental-search.sh` (Simplified)
- **Purpose:** Direct search URL with standard filters
- **URL:** `/rent/melbourne-region-vic/` with query parameters
- **Features:**
  - Standard Domain search format
  - Price range: $0-$600/week
  - Date-ascending sort
- **Status:** ❌ Not working (redirects to homepage)

---

## Python Scripts (~/.openclaw/workspace/)

### Search Scripts

#### 1. `melbourne_rental_search.py` (6.2KB)
- **Purpose:** Basic Melbourne rental search
- **Likely approach:** Web scraping with requests/BeautifulSoup
- **Status:** Unknown

#### 2. `melbourne_rentals_search_v2.py` (14KB)
- **Purpose:** Enhanced rental search
- **Size:** Largest search script
- **Likely features:** Multiple suburbs, filtering, data extraction
- **Status:** Unknown

#### 3. `melbourne_rentals_weta_fx.py` (12KB)
- **Purpose:** Rental search focused on Weta FX commute
- **Likely features:** Distance/time calculations to office
- **Status:** Unknown

#### 4. `rental-search.py` (6.4KB)
- **Purpose:** Standard rental search implementation
- **Modified:** Feb 26 15:45
- **Status:** Unknown

#### 5. `rental-search-v2.py` (9.9KB)
- **Purpose:** Version 2 of rental search
- **Modified:** Feb 27 10:23
- **Status:** Unknown

#### 6. `rental-search-v3.py` (9.6KB)
- **Purpose:** Version 3 of rental search
- **Modified:** Feb 27 10:25
- **Status:** Unknown

#### 7. `rental-search-agent-browser.py` (11KB)
- **Purpose:** Rental search using Agent Browser CLI
- **Modified:** Feb 27 10:23
- **Features:** Likely browser automation for property extraction
- **Status:** Unknown

#### 8. `rental-search-enhanced.py` (10KB)
- **Purpose:** Enhanced rental search with more features
- **Features:** Unknown
- **Status:** Unknown

### Link Extraction Scripts

#### 9. `melbourne_rental_links.py` (5.3KB)
- **Purpose:** Extract rental property links
- **Likely approach:** Scrape property URLs from search pages
- **Status:** Unknown

#### 10. `melbourne_rental_grok_search.py` (5.0KB)
- **Purpose:** Rental search using Grok API
- **Likely approach:** xAI Grok for AI-powered search
- **Status:** Unknown

### Parsing Scripts

#### 11. `extract-rentals.py` (4.7KB)
- **Purpose:** Extract rental property data
- **Likely features:** Parse property pages for details
- **Status:** Unknown

#### 12. `parse-rentals.py` (3.8KB)
- **Purpose:** Parse rental listings
- **Status:** Unknown

#### 13. `parse-rentals-v2.py` (4.2KB)
- **Purpose:** Version 2 of rental parser
- **Status:** Unknown

#### 14. `parse-rentals-v3.py` (4.2KB)
- **Purpose:** Version 3 of rental parser
- **Status:** Unknown

### Detail Extraction Scripts

#### 15. `rental-details.py` (4.9KB)
- **Purpose:** Extract detailed rental information
- **Likely features:** Price, availability, agent details
- **Status:** Unknown

#### 16. `rental-quick.py` (4.9KB)
- **Purpose:** Quick rental property lookup
- **Likely features:** Fast property data extraction
- **Status:** Unknown

#### 17. `rental-search-quick.py` (4.2KB)
- **Purpose:** Quick rental search implementation
- **Status:** Unknown

#### 18. `rental-search-final.py` (4.7KB)
- **Purpose:** Final version of rental search
- **Status:** Unknown

---

## Skills Available

### 1. `rental-verification` (~/.openclaw/skills/rental-verification/)
- **Purpose:** Verify rental property listings
- **Features:** Check availability status, direct links
- **Platform:** Domain.com.au

### 2. `rental-verification-advanced` (~/.openclaw/skills/rental-verification-advanced/)
- **Purpose:** Advanced rental property verification
- **Features:** Real-time verification, Domain API access, cross-platform validation
- **Platform:** Domain.com.au

---

## Summary

**Bash Scripts:** 4 (all experiencing issues with Domain.com.au blocking)
**Python Scripts:** 18 (multiple versions, status unknown)
**Skills:** 2 (rental verification capabilities)

**Known Issues:**
- Domain.com.au redirects all automated search URLs to homepage
- RealEstate.com.au returns 429 errors (rate limiting)
- Agent Browser snapshots don't capture property listings

**Recommended Next Steps:**
1. Test Python scripts to see if any work
2. Try rental verification skills (may have API access)
3. Manual search with URL submission to scripts for analysis
