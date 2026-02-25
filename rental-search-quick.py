#!/usr/bin/env python3
"""
Quick Rental Search - searches all specified suburbs and extracts matching properties
"""

import subprocess
import json
import re

# Search parameters
MAX_BUDGET = 600
MIN_BEDROOMS = 2
SUBURBS = {
    'preston-vic-3072': 'Preston',
    'reservoir-vic-3073': 'Reservoir',
    'thomastown-vic-3077': 'Thomastown',
    'bundoora-vic-3083': 'Bundoora',
    'lalor-vic-3075': 'Lalor',
}

COMMUTE_TIMES = {
    'Preston': '~38-50 min (train)',
    'Reservoir': '~50-62 min (train)',
    'Thomastown': '~66-78 min (train)',
    'Bundoora': '~55-68 min (bus)',
    'Lalor': '~66-78 min (train)',
}

def extract_properties(snapshot_text, suburb_name):
    """Extract property info from snapshot text"""
    properties = []

    # Find all property listings
    pattern = r'heading "([^"]+)\s+' + suburb_name + r'.*?\$([0-9]+)\s+per\s+week.*?(\d+)\s+Beds?'
    for match in re.finditer(pattern, snapshot_text, re.DOTALL):
        address = match.group(1)
        price = int(match.group(2))
        beds = int(match.group(3))

        if beds >= MIN_BEDROOMS and price <= MAX_BUDGET:
            # Try to find URL
            url_pattern = r'/url:\s+(https://www\.domain\.com\.au/[a-z0-9\-]+-' + suburb_name.lower() + '-[0-9]+)'
            url_match = re.search(url_pattern, match.group(0))
            url = url_match.group(1) if url_match else "No URL found"

            properties.append({
                'address': address,
                'price': price,
                'beds': beds,
                'url': url,
                'suburb': suburb_name
            })

    return properties

def search_suburb(suburb_code, suburb_name):
    """Search a single suburb"""
    print(f"⏳ Searching {suburb_name}...", end=' ', flush=True)

    # Open browser
    url = f"https://www.domain.com.au/rent/?suburb={suburb_code}"
    result = subprocess.run(['agent-browser', 'open', url],
                          capture_output=True, text=True, timeout=30)

    if result.returncode != 0:
        print(f"❌ Failed")
        return []

    # Get snapshot
    result = subprocess.run(['agent-browser', 'snapshot', '--format', 'json'],
                          capture_output=True, text=True, timeout=30)

    if result.returncode != 0:
        print(f"❌ Failed")
        return []

    # Extract properties
    properties = extract_properties(result.stdout, suburb_name)
    print(f"✓ {len(properties)} matches")
    return properties

def main():
    all_properties = []

    print(f"🔍 Rental Property Search")
    print(f"📍 Suburbs: {', '.join(SUBURBS.values())}")
    print(f"💰 Budget: Under ${MAX_BUDGET}/week")
    print(f"🛏️  Bedrooms: {MIN_BEDROOMS}+")
    print()

    # Search each suburb
    for suburb_code, suburb_name in SUBURBS.items():
        try:
            properties = search_suburb(suburb_code, suburb_name)
            all_properties.extend(properties)
        except Exception as e:
            print(f"❌ Error searching {suburb_name}: {e}")

    # Display results
    if not all_properties:
        print(f"\n❌ No properties found matching your criteria")
        return 0

    print(f"\n📦 Results: {len(all_properties)} properties")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    # Sort by price (cheapest first)
    all_properties.sort(key=lambda x: x['price'])

    # Display each property
    for i, prop in enumerate(all_properties[:10], 1):  # Top 10
        commute = COMMUTE_TIMES.get(prop['suburb'], '~60-75 min')
        print(f"{i}. **{prop['address']}, {prop['suburb']}**")
        print(f"   💰 ${prop['price']}/week | 🛏️ {prop['beds']} BR")
        print(f"   🚇 Commute: {commute}")
        print(f"   🔗 {prop['url']}")
        print()

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Total: {len(all_properties)} properties")
    print(f"🏢 Office: Suite 3, 452 Johnston Street, Abbotsford, Melbourne\n")

if __name__ == '__main__':
    main()
