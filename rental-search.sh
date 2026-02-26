#!/bin/bash
# Melbourne Rental Property Search Script
# Usage: ./rental-search.sh [max_budget] [suburbs]
# Example: ./rental-search.sh 600 "lalor-vic-3075,epping-vic-3076,reservoir-vic-3073,wollert-vic-3750"

MAX_BUDGET=${1:-600}
SUBURBS=${2:-"lalor-vic-3075,epping-vic-3076,reservoir-vic-3073,wollert-vic-3750"}
SEARCH_URL="https://www.domain.com.au/rent/?suburb=${SUBURBS}"
OUTPUT_FILE="/tmp/rental-results-$(date +%Y%m%d-%H%M%S).json"

echo "🔍 Searching Domain.com.au for rentals under \$$MAX_BUDGET/week..."
echo "📍 Suburbs: ${SUBURBS//,/ }"
echo ""

# Open browser and get snapshot
agent-browser open "$SEARCH_URL" > /dev/null 2>&1
agent-browser snapshot --format json > "$OUTPUT_FILE"

echo "📦 Results:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract properties from JSON using jq if available, otherwise use grep/awk
if command -v jq &> /dev/null; then
  jq -r '
    .[][] | 
    select(.link? or .["/url"]?) | 
    select(.text? | test("\\$[0-9]+ per week")) |
    {
      price: (.text | capture("\\$(?<p>[0-9]+) per week").p),
      url: (.["/url"]? // .link?),
      address: (.heading?.text // .text?),
      details: (.text? // "")
    } |
    select((.price | tonumber) <= '"$MAX_BUDGET"') |
    "- [\(.address // "Unknown")] \(.url)\n  Price: $\(.price)/week \(.details)"
  ' "$OUTPUT_FILE" 2>/dev/null | head -20
else
  # Fallback: extract using grep
  grep -oP 'https://www\.domain\.com\.au/[^\s"]+' "$OUTPUT_FILE" | head -10 | while read url; do
    echo "- $url"
  done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Full snapshot saved to: $OUTPUT_FILE"
