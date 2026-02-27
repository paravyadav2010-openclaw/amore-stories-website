#!/usr/bin/env python3
"""Better property extraction from snapshot"""

import re

# Read the file
with open('/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json', 'r') as f:
    lines = f.readlines()

# Properties are in listitem sections
# Let's parse by tracking state
properties = []
current_property = {}

for i, line in enumerate(lines):
    line = line.rstrip()

    # Look for link with URL - this marks a property
    url_match = re.search(r'/url: (https://www\.domain\.com\.au/[a-z0-9-]+-(reservoir|wollert|epping|lalor)-vic-[0-9]+-[0-9]+)', line)
    if url_match:
        url = url_match.group(1)

        # Look backward to find if this is a new property or if we already have one
        # Properties appear as: link with url -> heading -> price text -> details text

        # Look for heading (next few lines)
        heading = None
        for j in range(i+1, min(i+20, len(lines))):
            heading_match = re.search(r'heading "([^"]+)" \[ref=[^\]]+\] \[level=2\]', lines[j])
            if heading_match:
                heading = heading_match.group(1)
                break

        # Look for price (paragraph with "$" and "per week")
        price = None
        for j in range(i, min(i+30, len(lines))):
            price_match = re.search(r'paragraph: \$(\d+) per week', lines[j])
            if price_match:
                price = int(price_match.group(1))
                break

        # Look for beds/baths/parking
        beds = baths = parking = None
        for j in range(i, min(i+30, len(lines))):
            details_match = re.search(r'"(\d+) Beds (\d+) Bath(?:s)? (\d+) Parking"', lines[j])
            if details_match:
                beds = int(details_match.group(1))
                baths = int(details_match.group(2))
                parking = int(details_match.group(3))
                break

        # Get suburb from URL
        if 'reservoir' in url.lower():
            suburb = 'Reservoir'
        elif 'wollert' in url.lower():
            suburb = 'Wollert'
        elif 'epping' in url.lower():
            suburb = 'Epping'
        elif 'lalor' in url.lower():
            suburb = 'Lalor'
        else:
            suburb = 'Unknown'

        if heading and url:
            properties.append({
                'address': heading,
                'suburb': suburb,
                'url': url,
                'price': price,
                'beds': beds,
                'baths': baths,
                'parking': parking
            })

# Remove duplicates
seen = set()
unique_props = []
for p in properties:
    if p['url'] not in seen:
        seen.add(p['url'])
        unique_props.append(p)

print(f"Extracted {len(unique_props)} unique properties")
print()

# Filter: under $600/week, 2+ beds
filtered = [p for p in unique_props
            if p['price'] and p['price'] < 600
            and p['beds'] and p['beds'] >= 2]

print(f"Filtered to {len(filtered)} properties (2+ beds, under $600/week)")
print()

# Sort by suburb (Reservoir first for shortest commute) then by price
suburb_order = {'Reservoir': 0, 'Lalor': 1, 'Epping': 2, 'Wollert': 3}
filtered.sort(key=lambda x: (suburb_order.get(x['suburb'], 99), x['price']))

# Display top 10
def estimate_commute(suburb):
    """Estimate commute time to Abbotsford (452 Johnston Street)"""
    commutes = {
        'Reservoir': '28 min drive / 38 min PT',
        'Wollert': '40 min drive / 50 min PT',
        'Epping': '35 min drive / 48 min PT',
        'Lalor': '30 min drive / 42 min PT'
    }
    return commutes.get(suburb, 'Unknown')

print("=" * 80)
print("TOP 10 RENTAL PROPERTIES (Sorted by Commute Time + Price)")
print("Office: Suite 3, 452 Johnston Street, Abbotsford, Melbourne")
print("=" * 80)
print()

for i, prop in enumerate(filtered[:10], 1):
    beds = prop['beds'] if prop['beds'] else '?'
    baths = prop['baths'] if prop['baths'] else '?'
    parking = prop['parking'] if prop['parking'] else '0'
    price = prop['price'] if prop['price'] else '???'
    suburb = prop['suburb'] or 'Unknown'
    address = prop['address']
    url = prop['url']

    commute = estimate_commute(suburb)

    print(f"{i}. {address}")
    print(f"   📍 {suburb} | 💰 ${price}/week | 🛏️ {beds} bed | 🛁 {baths} bath | 🚗 {parking} parking")
    print(f"   🚗 Commute to Abbotsford: {commute}")
    print(f"   🔗 {url}")
    print()

print(f"Total matching properties: {len(filtered)}")
print(f"Showing top 10")
