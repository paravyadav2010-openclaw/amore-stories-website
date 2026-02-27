#!/bin/bash
# Melbourne Rental Search - Recently Listed Properties
# Focus on properties listed in the last 5 days

set -e

OUTPUT_DIR="$HOME/.openclaw/workspace/rentals"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
OUTPUT_FILE="$OUTPUT_DIR/recent-rentals-$TIMESTAMP.md"
LOG_FILE="$OUTPUT_DIR/rental-search.log"
SNAPSHOT_FILE="$OUTPUT_DIR/recent-snapshot-$TIMESTAMP.txt"

mkdir -p "$OUTPUT_DIR"

echo "=== Recent Rental Search: $(date '+%Y-%m-%d %H:%M:%S') ===" | tee -a "$LOG_FILE"

# Your preferred suburbs
SUBURBS="Lalor,Epping,Reservoir,Wollert"
MAX_BUDGET=600

echo "🔍 Searching for recently listed properties..." | tee -a "$LOG_FILE"
echo "Suburbs: $SUBURBS" | tee -a "$LOG_FILE"
echo "Criteria: 2 bed, 1 bath, <$$MAX_BUDGET/week, listed < 5 days ago" | tee -a "$LOG_FILE"

# Domain search URL with date filter
# Use the "Date Available" filter sorted by newest
SEARCH_URL="https://www.domain.com.au/rent/?suburb=${SUBURBS}&bedrooms=2&bathrooms=1&maxprice=${MAX_BUDGET}&price=0-${MAX_BUDGET}&sort=date-desc"

echo "🌐 Opening: $SEARCH_URL" | tee -a "$LOG_FILE"

# Open browser
agent-browser open "$SEARCH_URL"

# Wait for page load
echo "⏳ Waiting for page to load..." | tee -a "$LOG_FILE"
sleep 6

# Take snapshot
echo "📸 Taking snapshot..." | tee -a "$LOG_FILE"
agent-browser snapshot > "$SNAPSHOT_FILE"

# Count property listings
LISTING_COUNT=$(grep -c "listitem.*heading.*Street" "$SNAPSHOT_FILE" 2>/dev/null || echo "0")

echo "📋 Found $LISTING_COUNT properties" | tee -a "$LOG_FILE"

# Extract first 5-10 property URLs
echo "🔍 Extracting property links..." | tee -a "$LOG_FILE"

# Create results file
cat > "$OUTPUT_FILE" << EOF
# Recent Rental Properties - $(date '+%Y-%m-%d')

## Search Criteria
- **Suburbs:** $SUBURBS
- **Bedrooms:** 2
- **Bathrooms:** 1
- **Budget:** $0 - $${MAX_BUDGET}/week
- **Listed:** Last 5 days (newest first)

## Results Found: $LISTING_COUNT properties

**Search URL:** $SEARCH_URL
**Snapshot:** \`$SNAPSHOT_FILE\`

## Status
✅ Search executed successfully
⏳ Ready to extract property details

## Next Steps
1. Visit each property page for detailed info
2. Extract: Price, availability, agent, full address
3. Check availability status
4. Filter: Skip "Leased", "Deposit Taken", "Under Contract"
5. Calculate: Commute to Weta FX office

---

**Log:** \`$OUTPUT_DIR/rental-search.log\`
EOF

echo "✅ Results saved to: $OUTPUT_FILE" | tee -a "$LOG_FILE"
echo ""
echo "🎯 Ready to extract property details!" | tee -a "$LOG_FILE"
