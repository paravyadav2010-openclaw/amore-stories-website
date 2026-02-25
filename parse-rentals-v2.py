#!/usr/bin/env python3
"""
Parse rental property snapshots and extract matching properties
"""

import re
import json
from pathlib import Path

# Search parameters
MAX_BUDGET = 600
MIN_BEDROOMS = 2

COMMUTE_TIMES = {
    'PRESTON': '~38-50 min (train)',
    'RESERVOIR': '~50-62 min (train)',
    'THOMASTOWN': '~66-78 min (train)',
    'BUNDOORA': '~55-68 min (bus)',
    'LALOR': '~66-78 min (train)',
}

def parse_snapshot(file_path, suburb_name):
    """Parse a snapshot file and extract property details"""
    if not Path(file_path).exists():
        return []

    with open(file_path, 'r') as f:
        content = f.read()

    properties = []

    # Split content into property listings by looking for "Picture of" links
    # Each property starts with a link containing "Picture of"
    property_blocks = re.split(r'- link "Picture of', content)[1:]  # Skip first empty element

    for block in property_blocks:
        # Extract address from heading
        heading_match = re.search(r'heading "([^"]+)\s+' + suburb_name + '"', block)
        if not heading_match:
            continue
        address = heading_match.group(1)

        # Extract price
        price_match = re.search(r'paragraph: \\$([0-9]+) per week', block)
        if not price_match:
            continue
        price = int(price_match.group(1))

        # Extract bedroom count
        beds_match = re.search(r'(\d+)\s+Beds?', block)
        if not beds_match:
            continue
        beds = int(beds_match.group(1))

        # Extract URL from the link
        url_match = re.search(r'/url:\s+(https://www\.domain\.com\.au/[a-z0-9\-]+-' + suburb_name.lower() + r'-[0-9]+)', block)
        url = url_match.group(1) if url_match else "No URL"

        # Check if property matches criteria
        if beds >= MIN_BEDROOMS and price <= MAX_BUDGET:
            properties.append({
                'address': address,
                'price': price,
                'beds': beds,
                'url': url,
                'suburb': suburb_name
            })

    return properties

def main():
    all_properties = []

    # Parse each suburb snapshot
    snapshots = [
        ('/tmp/preston-snapshot.json', 'PRESTON'),
        ('/tmp/reservoir-snapshot.json', 'RESERVOIR'),
        ('/tmp/bundoora-snapshot.json', 'BUNDOORA'),
        ('/tmp/lalor-snapshot.json', 'LALOR'),
    ]

    print(f"🔍 Rental Property Search Results")
    print(f"💰 Budget: Under ${MAX_BUDGET}/week | 🛏️ {MIN_BEDROOMS}+ Bedrooms\n")

    for snapshot_file, suburb in snapshots:
        properties = parse_snapshot(snapshot_file, suburb)
        if properties:
            print(f"✅ {suburb}: {len(properties)} properties")
            all_properties.extend(properties)
        else:
            print(f"⚠️  {suburb}: No matching properties")

    # Also check Thomastown if file exists
    if Path('/tmp/thomastown-snapshot.json').exists():
        properties = parse_snapshot('/tmp/thomastown-snapshot.json', 'THOMASTOWN')
        if properties:
            print(f"✅ THOMASTOWN: {len(properties)} properties")
            all_properties.extend(properties)
        else:
            print(f"⚠️  THOMASTOWN: No matching properties")

    # Display results
    print(f"\n{'='*70}")
    print(f"📦 Total properties found: {len(all_properties)}")
    print(f"{'='*70}\n")

    if not all_properties:
        print("❌ No properties found matching your criteria")
        print(f"💡 Try: Increasing budget or removing suburb filters")
        return

    # Sort by price (cheapest first)
    all_properties.sort(key=lambda x: x['price'])

    # Display top 10 properties
    print("🏠 TOP 10 RENTAL PROPERTIES\n")
    for i, prop in enumerate(all_properties[:10], 1):
        commute = COMMUTE_TIMES.get(prop['suburb'], '~60-75 min')
        print(f"{i}. **{prop['address']}** ({prop['suburb']})")
        print(f"   💰 ${prop['price']}/week | 🛏️ {prop['beds']} BR")
        print(f"   🚇 Commute: {commute}")
        print(f"   🔗 {prop['url']}")
        print()

    print(f"{'='*70}")
    print(f"✅ Showing top 10 of {len(all_properties)} total properties")
    print(f"🏢 Office: Suite 3, 452 Johnston Street, Abbotsford, Melbourne")
    print(f"{'='*70}\n")

if __name__ == '__main__':
    main()
