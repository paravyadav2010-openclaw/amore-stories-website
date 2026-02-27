#!/usr/bin/env python3
"""Parse properties from snapshot using proper YAML-like structure parsing"""

import re

# Read the file
with open('/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json', 'r') as f:
    content = f.read()

# Split by property listings - each property has a link with an image description
# Pattern: - link "Picture of [ADDRESS]" [ref=...]:
# Then later: - link "[ADDRESS], SUBURB" [ref=...]:
# With heading, price, and details

# Find all property blocks
properties = []

# Pattern to find property blocks
# Each property block starts with: - link "Picture of"
# And contains: URL, heading, price, and details

# Split content into property blocks
# Each property appears between "Picture of" patterns
blocks = content.split('- link "Picture of')

for block in blocks[1:]:  # Skip first empty split
    # Extract URL from this block
    url_match = re.search(r'/url: (https://www\.domain\.com\.au/[a-z0-9-]+-(reservoir|wollert|epping|lalor)-vic-[0-9]+-[0-9]+)', block)
    if not url_match:
        continue

    url = url_match.group(1)

    # Extract heading (second link in the block has the clean address)
    heading_match = re.search(r'- link "[^"]+, [A-Z]+" \[ref=[^\]]+\]:\s+- /url: ' + re.escape(url) + r'\s+- heading "([^"]+)"', block)
    if not heading_match:
        # Try simpler pattern
        heading_match = re.search(r'heading "([^"]+)" \[ref=[^\]]+\] \[level=2\]', block)

    heading = heading_match.group(1) if heading_match else None

    # Extract price
    price_match = re.search(r'- paragraph: \$(\d+) per week', block)
    price = int(price_match.group(1)) if price_match else None

    # Extract beds/baths/parking
    # Pattern: "X Beds Y Baths Z Parking House Inspection: ..."
    details_match = re.search(r'- text: "?(\d+) Beds (\d+) Bath(?:s)? (\d+) Parking', block)
    if not details_match:
        details_match = re.search(r'"(\d+) Beds (\d+) Bath(?:s)? (\d+) Parking', block)

    beds = baths = parking = None
    if details_match:
        beds = int(details_match.group(1))
        baths = int(details_match.group(2))
        parking = int(details_match.group(3))

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

    if url and heading:
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

# Debug: print all properties if filter is empty
if len(filtered) == 0:
    print("DEBUG: All extracted properties:")
    for p in unique_props:
        print(f"  {p['address']} | ${p['price']}/week | {p['beds']} bed | {p['suburb']}")
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
