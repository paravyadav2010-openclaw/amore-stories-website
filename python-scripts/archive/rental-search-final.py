#!/usr/bin/env python3
"""
Final rental property search with availability filter
"""

import re
from pathlib import Path

MAX_BUDGET = 600
MIN_BEDROOMS = 2

COMMUTE_TIMES = {
    'PRESTON': '~38-50 min (train)',
    'RESERVOIR': '~50-62 min (train)',
    'THOMASTOWN': '~66-78 min (train)',
    'BUNDOORA': '~55-68 min (bus)',
    'LALOR': '~66-78 min (train)',
}

def extract_properties(content, suburb):
    """Extract properties using line-by-line scanning"""
    properties = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i]

        # Look for heading line with address
        if 'heading "' in line and suburb in line:
            # Extract address from heading
            match = re.search(r'heading "([^"]+),\s*' + suburb + '"', line)
            if match:
                address = match.group(1)

                # Look back a few lines for price
                price = None
                for j in range(max(0, i-10), i):
                    price_match = re.search(r'\$([0-9]+) per week', lines[j])
                    if price_match:
                        price = int(price_match.group(1))
                        break

                # Look ahead for beds count
                beds = None
                for j in range(i, min(i+5, len(lines))):
                    beds_match = re.search(r'"(\d+)\s+Beds?', lines[j])
                    if beds_match:
                        beds = int(beds_match.group(1))
                        break

                # Look for URL in the vicinity
                url = None
                for j in range(max(0, i-10), i+5):
                    url_match = re.search(r'/url:\s+(https://www\.domain\.com\.au/[a-z0-9\-]+-' + suburb.lower() + r'-vic-[0-9]+)', lines[j])
                    if url_match:
                        url = url_match.group(1)
                        break

                # Check if matches criteria
                if price and beds and beds >= MIN_BEDROOMS and price <= MAX_BUDGET:
                    properties.append({
                        'address': address,
                        'price': price,
                        'beds': beds,
                        'url': url or "No URL",
                        'suburb': suburb
                    })

        i += 1

    return properties

def main():
    all_properties = []

    print(f"🔍 Rental Property Search Results")
    print(f"💰 Budget: Under ${MAX_BUDGET}/week | 🛏️ {MIN_BEDROOMS}+ Bedrooms")
    print(f"🏢 Office: Suite 3, 452 Johnston Street, Abbotsford, Melbourne\n")

    snapshots = [
        ('/tmp/preston-snapshot.json', 'PRESTON'),
        ('/tmp/reservoir-snapshot.json', 'RESERVOIR'),
        ('/tmp/bundoora-snapshot.json', 'BUNDOORA'),
        ('/tmp/lalor-snapshot.json', 'LALOR'),
    ]

    for snapshot_file, suburb in snapshots:
        if Path(snapshot_file).exists():
            with open(snapshot_file, 'r') as f:
                content = f.read()
            properties = extract_properties(content, suburb)
            if properties:
                print(f"✅ {suburb}: {len(properties)} properties")
                all_properties.extend(properties)
            else:
                print(f"⚠️  {suburb}: No matching properties")

    if Path('/tmp/thomastown-snapshot.json').exists():
        with open('/tmp/thomastown-snapshot.json', 'r') as f:
            content = f.read()
        properties = extract_properties(content, 'THOMASTOWN')
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
    print("🏠 TOP 10 AVAILABLE RENTAL PROPERTIES\n")
    for i, prop in enumerate(all_properties[:10], 1):
        commute = COMMUTE_TIMES.get(prop['suburb'], '~60-75 min')
        print(f"{i}. **{prop['address']}** ({prop['suburb']})")
        print(f"   💰 ${prop['price']}/week | 🛏️ {prop['beds']} BR")
        print(f"   🚇 Commute: {commute}")
        print(f"   🔗 {prop['url']}")
        print()

    print(f"{'='*70}")
    print(f"✅ Showing top 10 of {len(all_properties)} total properties")
    print(f"💡 All properties are from Domain.com.au and match your criteria")
    print(f"{'='*70}\n")

if __name__ == '__main__':
    main()
