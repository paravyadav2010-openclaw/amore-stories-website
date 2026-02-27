#!/bin/bash
# Rental Search Script for Melbourne Properties
# Uses Agent Browser CLI to search Domain.com.au

set -e

# Configuration
OUTPUT_DIR="$HOME/.openclaw/workspace/rentals"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
OUTPUT_FILE="$OUTPUT_DIR/rentals-$TIMESTAMP.md"
LOG_FILE="$OUTPUT_DIR/rental-search.log"

# Create directories
mkdir -p "$OUTPUT_DIR"

echo "=== Rental Search Started: $(date '+%Y-%m-%d %H:%M:%S') ===" | tee -a "$LOG_FILE"

# Search parameters (can be customized)
SUBURBS="Reservoir, Lalor, Epping, Wollert"
BEDS="2"
BATHS="1"
RENT_MAX="600"

# Domain.com.au search URL
SEARCH_URL="https://www.domain.com.au/rent/melbourne-region-vic/?suburb=${SUBURBS}&bedrooms=${BEDS}&bathrooms=${BATHS}&maxprice=${RENT_MAX}&price=0-600&sort=price-asc"

echo "🌐 Opening Domain.com.au..." | tee -a "$LOG_FILE"
echo "URL: $SEARCH_URL" | tee -a "$LOG_FILE"

# Open search page
agent-browser open "$SEARCH_URL"

# Wait for page to load
echo "⏳ Waiting for page to load..." | tee -a "$LOG_FILE"
sleep 5

# Take snapshot to get property links
echo "📸 Taking snapshot..." | tee -a "$LOG_FILE"
SNAPSHOT_OUTPUT=$(agent-browser snapshot -i)

# Save snapshot for reference
echo "$SNAPSHOT_OUTPUT" > "$OUTPUT_DIR/snapshot-$TIMESTAMP.txt"

echo "📋 Snapshot saved to: $OUTPUT_DIR/snapshot-$TIMESTAMP.txt" | tee -a "$LOG_FILE"

# Create results file
cat > "$OUTPUT_FILE" << EOF
# Melbourne Rental Properties - $(date '+%Y-%m-%d')

**Search Parameters:**
- Suburbs: $SUBURBS
- Bedrooms: $BEDS
- Bathrooms: $BATHS
- Max Rent: $${RENT_MAX}/week

---

## 📋 Search Results

**Status:** Ready to extract property links

### Next Steps:
1. Review snapshot: \`$OUTPUT_DIR/snapshot-$TIMESTAMP.txt\`
2. Click property links using: \`agent-browser click @e1\`
3. Capture direct property URLs
4. Filter by availability (skip "Leased", "Deposit Taken", "Under Contract")

---

**Snapshot:**
\`\`\`
$SNAPSHOT_OUTPUT
\`\`\`

---

**Log:** \`$OUTPUT_DIR/rental-search.log\`
**Search URL:** $SEARCH_URL

---
EOF

echo "✅ Results saved to: $OUTPUT_FILE" | tee -a "$LOG_FILE"
echo ""
echo "🎯 Next commands:" | tee -a "$LOG_FILE"
echo "  agent-browser snapshot -i  # Get property links" | tee -a "$LOG_FILE"
echo "  agent-browser click @e1     # Click property link" | tee -a "$LOG_FILE"
echo ""
echo "=== Rental Search Complete ===" | tee -a "$LOG_FILE"
