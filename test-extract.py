#!/usr/bin/env python3
"""
Test extraction - debug version
"""

import re

# Test with Preston snapshot
with open('/tmp/preston-snapshot.json', 'r') as f:
    content = f.read()

# Look for all prices
prices = re.findall(r'\\$([0-9]+) per week', content)
print(f"Found {len(prices)} prices: {prices[:10]}")

# Look for all beds
beds = re.findall(r'"(\d+)\s+Beds?', content)
print(f"Found {len(beds)} bed counts: {beds[:10]}")

# Look for all headings with PRESTON
headings = re.findall(r'heading "([^"]+),\s*PRESTON"', content)
print(f"Found {len(headings)} headings: {headings[:5]}")

# Look for URLs
urls = re.findall(r'/url:\s+(https://www\.domain\.com\.au/[a-z0-9\-]+-preston-vic-[0-9]+)', content)
print(f"Found {len(urls)} URLs")
