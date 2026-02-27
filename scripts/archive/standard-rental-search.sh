#!/bin/bash
# Standard Rental Property Search - Melbourne
# Simplified, direct approach like previous searches

set -e

OUTPUT_DIR="$HOME/.openclaw/workspace/rentals"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
OUTPUT_FILE="$OUTPUT_DIR/rental-search-$TIMESTAMP.md"
LOG_FILE="$OUTPUT_DIR/rental-search.log"

mkdir -p "$OUTPUT_DIR"

echo "=== Rental Search: $(date '+%Y-%m-%d %H:%M:%S') ===" | tee -a "$LOG_FILE"

# Standard search parameters - your preferred suburbs
# Based on USER.md: Lalor, Epping, Reservoir, Wollert
echo "🔍 Searching Domain.com.au for rental properties..." | tee -a "$LOG_FILE"
echo "Suburbs: Lalor, Epping, Reservoir, Wollert" | tee -a "$LOG_FILE"

# Use standard Domain search URL with your suburbs
SEARCH_URL="https://www.domain.com.au/rent/melbourne-region-vic/?suburb=lalor,epping,reservoir,wollert&bedrooms=2&bathrooms=1&price=0-600&sort=date-asc"

echo "🌐 Opening: $SEARCH_URL" | tee -a "$LOG_FILE"

# Use browser tool to search
agent-browser open "$SEARCH_URL"

# Wait for page load
echo "⏳ Waiting for page to load..." | tee -a "$LOG_FILE"
sleep 5

# Take snapshot
echo "📸 Taking snapshot..." | tee -a "$LOG_FILE"
agent-browser snapshot > "$OUTPUT_DIR/snapshot-$TIMESTAMP.txt"

# Count property listings
PROPERTY_COUNT=$(grep -c "listitem.*heading.*Street" "$OUTPUT_DIR/snapshot-$TIMESTAMP.txt" 2>/dev/null || echo "0")

echo "📋 Found $PROPERTY_COUNT properties" | tee -a "$LOG_FILE"
echo "✅ Results saved to: $OUTPUT_DIR/rental-search-$TIMESTAMP.md" | tee -a "$LOG_FILE"

cat > "$OUTPUT_FILE" << EOF
# Melbourne Rental Search - $(date '+%Y-%m-%d')

## Search Parameters
- **Suburbs:** Lalor, Epping, Reservoir, Wollert
- **Bedrooms:** 2
- **Bathrooms:** 1
- **Rent Range:** $0 - $600/week
- **Sort:** Date available (ascending)

## Results Found: $PROPERTY_COUNT properties

**Search URL:** $SEARCH_URL

## Next Steps
1. Review snapshot: \`$OUTPUT_DIR/snapshot-$TIMESTAMP.txt\`
2. Extract property details from each listing
3. Check availability (skip "Leased", "Deposit Taken", "Under Contract")
4. Create summary report with direct links

---

**Log:** \`$OUTPUT_DIR/rental-search.log\`
EOF

echo ""
echo "🎯 Ready for property extraction!" | tee -a "$LOG_FILE"
