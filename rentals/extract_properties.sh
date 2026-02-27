#!/bin/bash
# Extract property details from snapshot and analyze

SNAPSHOT="/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json"

# Extract properties with their URLs, prices, and details
# Looking for property listings in the structured format

echo "Extracting properties from snapshot..."
echo ""

# Create temp file for extracted data
TEMP_FILE=$(mktemp)

# Extract property entries - these are in list items with links and prices
# Pattern: listitem with link containing URL and paragraph with price

# Extract each property block and parse
python3 << 'EOF'
import re
import sys

# Read the file
with open('/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json', 'r') as f:
    content = f.read()

# Pattern to find property listings
# Properties appear as listitem elements with URL, address, price, and details

# Find all property URLs first
url_pattern = r'/url: (https://www\.domain\.com\.au/[a-z0-9-]+-(reservoir|wollert|epping|lalor)-vic-[0-9]+-[0-9]+)'
urls = re.findall(url_pattern, content)

# Get unique URLs
unique_urls = list(set([u[0] for u in urls]))
print(f"Found {len(unique_urls)} property URLs")

# Now extract details for each property by looking around each URL
properties = []

for url in unique_urls:
    # Find the section around this URL
    url_pos = content.find(url)
    if url_pos == -1:
        continue

    # Extract a chunk around the URL (2000 chars before and after)
    start = max(0, url_pos - 2000)
    end = min(len(content), url_pos + 2000)
    chunk = content[start:end]

    # Extract address (heading)
    heading_match = re.search(r'heading "([^"]+)" \[ref=[^\]]+\] \[level=2\]', chunk)
    if heading_match:
        address = heading_match.group(1)
    else:
        # Try alternative pattern
        heading_match2 = re.search(r'heading "([^"]+)"', chunk)
        address = heading_match2.group(1) if heading_match2 else "Unknown"

    # Extract price (paragraph with "$" and "per week")
    price_match = re.search(r'paragraph: \$(\d+) per week', chunk)
    price = int(price_match.group(1)) if price_match else None

    # Extract beds/baths/parking from text field
    # Pattern: "X Beds Y Baths Z Parking" or similar
    details_match = re.search(r'text: "?(\d+) Beds (\d+) Bath(s)? (\d+) Parking"?', chunk)
    if details_match:
        beds = int(details_match.group(1))
        baths = int(details_match.group(2))
        parking = int(details_match.group(4))
    else:
        # Try alternative pattern
        details_match2 = re.search(r'(\d+)\s*Beds?\s*(\d+)\s*Baths?\s*(\d+)\s*Parking', chunk)
        if details_match2:
            beds = int(details_match2.group(1))
            baths = int(details_match2.group(2))
            parking = int(details_match2.group(3))
        else:
            beds = baths = parking = None

    # Determine suburb from URL
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

    properties.append({
        'address': address,
        'suburb': suburb,
        'url': url,
        'price': price,
        'beds': beds,
        'baths': baths,
        'parking': parking
    })

# Remove duplicates (by URL)
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
EOF
