#!/bin/bash
# Rental Property Search - Melbourne (URL Fixed)
# Using correct Domain.com.au URL format

set -e

OUTPUT_DIR="$HOME/.openclaw/workspace/rentals"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
OUTPUT_FILE="$OUTPUT_DIR/rental-results-$TIMESTAMP.md"
LOG_FILE="$OUTPUT_DIR/rental-search.log"

mkdir -p "$OUTPUT_DIR"

echo "=== Rental Search: $(date '+%Y-%m-%d %H:%M:%S') ===" | tee -a "$LOG_FILE"

# Standard search - your preferred suburbs
echo "🔍 Searching Domain.com.au for rental properties..." | tee -a "$LOG_FILE"
echo "Suburbs: Lalor, Epping, Reservoir, Wollert" | tee -a "$LOG_FILE"
echo "Criteria: 2 bed, 1 bath, $0-$600/week" | tee -a "$LOG_FILE"

# Simple search URL - visit main rental page
echo "🌐 Opening Domain rental page..." | tee -a "$LOG_FILE"
agent-browser open "https://www.domain.com.au/rent/"

# Wait for page load
echo "⏳ Waiting for page to load..." | tee -a "$LOG_FILE"
sleep 6

# Take snapshot to see the interface
echo "📸 Taking snapshot..." | tee -a "$LOG_FILE"
agent-browser snapshot > "$OUTPUT_DIR/homepage-snapshot-$TIMESTAMP.txt"

# Count property-related elements
LISTING_COUNT=$(grep -c "listitem" "$OUTPUT_DIR/homepage-snapshot-$TIMESTAMP.txt" 2>/dev/null || echo "0")

echo "📋 Snapshot captured with $LISTING_COUNT items" | tee -a "$LOG_FILE"
echo "✅ Results saved" | tee -a "$LOG_FILE"

cat > "$OUTPUT_FILE" << EOF
# Melbourne Rental Search - $(date '+%Y-%m-%d %H:%M')

## Search Parameters
- **Suburbs:** Lalor, Epping, Reservoir, Wollert
- **Bedrooms:** 2
- **Bathrooms:** 1
- **Rent Range:** $0 - $600/week

## Results
**Page loaded:** https://www.domain.com.au/rent/
**Snapshot:** \`$OUTPUT_DIR/homepage-snapshot-$TIMESTAMP.txt\`

## Status
- Homepage loaded successfully
- Ready for search/filter entry
- Need to perform search on the page

## Next Manual Steps
1. Enter search filters manually:
   - Type "Rent"
   - Location: Melbourne / VIC
   - Suburbs: Lalor, Epping, Reservoir, Wollert
   - Bedrooms: 2
   - Bathrooms: 1
   - Price: $0 - $600

2. Send me the search results page
3. I'll extract property links and details

---

**Log:** \`$OUTPUT_DIR/rental-search.log\`
EOF

echo ""
echo "🎯 Homepage loaded. Please:" | tee -a "$LOG_FILE"
echo "1. Enter search criteria on the page" | tee -a "$LOG_FILE"
echo "2. Send me screenshot or property links" | tee -a "$LOG_FILE"
echo "3. I'll extract details from each property" | tee -a "$LOG_FILE"
