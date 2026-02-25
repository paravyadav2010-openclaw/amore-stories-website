#!/bin/bash

# Test Domain.com.au property URLs by trying common listing ID patterns
# Based on observed listing IDs from search results

echo "Testing Domain.com.au property URLs..."
echo ""

# Properties to search for
# 3/430 Murray Road, Preston ($400/wk)
# 1 Davis Street, Preston ($450/wk)
# 28 Buller Parade, Lalor ($420/wk)
# 10/25 Newton Crescent, Lalor ($440/wk)

# Already found:
# 3/12 Dalgety Street, Preston - https://www.domain.com.au/3-12-dalgety-street-preston-vic-3072-17998563

echo "=== Already Found ==="
echo "3/12 Dalgety Street, Preston ($430/wk)"
echo "https://www.domain.com.au/3-12-dalgety-street-preston-vic-3072-17998563"
echo ""

# Use curl to test URLs (returns 200 if exists, 404 if not)
# Pattern: https://www.domain.com.au/{address}-{suburb}-{postcode}-{listing-id}

# Try searching with agent-browser for each property
echo "=== Searching for 3/430 Murray Road, Preston ==="
agent-browser open "https://www.domain.com.au/rent/preston-vic-3072/?keywords=430+murray+road&excludedeposittaken=1" 2>&1 | head -5
sleep 3
echo "Snapshot:"
agent-browser snapshot --json 2>&1 | grep -i "murray\|430" | head -10
echo ""

echo "=== Searching for 1 Davis Street, Preston ==="
agent-browser open "https://www.domain.com.au/rent/preston-vic-3072/?keywords=davis+street&excludedeposittaken=1" 2>&1 | head -5
sleep 3
echo "Snapshot:"
agent-browser snapshot --json 2>&1 | grep -i "davis" | head -10
echo ""

echo "=== Searching for 28 Buller Parade, Lalor ==="
agent-browser open "https://www.domain.com.au/rent/lalor-vic-3075/?keywords=28+buller+parade&excludedeposittaken=1" 2>&1 | head -5
sleep 3
echo "Snapshot:"
agent-browser snapshot --json 2>&1 | grep -i "buller" | head -10
echo ""

echo "=== Searching for 10/25 Newton Crescent, Lalor ==="
agent-browser open "https://www.domain.com.au/rent/lalor-vic-3075/?keywords=10+25+newton+crescent&excludedeposittaken=1" 2>&1 | head -5
sleep 3
echo "Snapshot:"
agent-browser snapshot --json 2>&1 | grep -i "newton" | head -10
echo ""
