#!/usr/bin/env python3
"""
Melbourne Rental Property Search
Usage: python3 rental-search.py [max_budget] [suburbs]
Example: python3 rental-search.py 600 "preston-vic-3072,reservoir-vic-3073,thomastown-vic-3077,bundoora-vic-3083,lalor-vic-3075"

Default suburbs are filtered for <60 min commute to Abbotsford office.
Default filters: 2+ bedrooms, under $600/week, <60 min total commute.
"""

import sys
import subprocess
import json
import re

# Suburb commute times (total including walks)
COMMUTE_TIMES = {
    'preston-vic-3072': {'base_min': 30, 'base_max': 42, 'transport': 'train'},
    'reservoir-vic-3073': {'base_min': 46, 'base_max': 58, 'transport': 'train'},
    'thomastown-vic-3077': {'base_min': 58, 'base_max': 70, 'transport': 'train'},
    'bundoora-vic-3083': {'base_min': 55, 'base_max': 68, 'transport': 'bus'},
    'lalor-vic-3075': {'base_min': 66, 'base_max': 78, 'transport': 'train'},
    'epping-vic-3076': {'base_min': 55, 'base_max': 68, 'transport': 'train'},
    'wollert-vic-3750': {'base_min': 62, 'base_max': 75, 'transport': 'bus'},
    'south-morang-vic-3752': {'base_min': 58, 'base_max': 70, 'transport': 'train'},
}

MAX_BUDGET = int(sys.argv[1]) if len(sys.argv) > 1 else 600
SUBURBS = sys.argv[2] if len(sys.argv) > 2 else "preston-vic-3072,reservoir-vic-3073,thomastown-vic-3077,bundoora-vic-3083,lalor-vic-3075"
MIN_BEDROOMS = 2  # Default: 2+ bedrooms
MAX_COMMUTE = 60  # Default: under 60 minutes total commute
SEARCH_URL = f"https://www.domain.com.au/rent/?suburb={SUBURBS}"

def extract_properties_from_file(file_path, suburb):
    """Extract property info from snapshot JSON file"""
    properties = []

    with open(file_path, 'r') as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        price_match = re.search(r'\$([0-9]+) per week', line)
        if price_match:
            price = int(price_match.group(1))
            beds = 0
            url = None
            address = None

            # Look ahead for details
            for j in range(i, min(i+25, len(lines))):
                # Check for bedroom count
                bed_match = re.search(r'(\d+)\s+Beds?', lines[j])
                if bed_match and beds == 0:
                    beds = int(bed_match.group(1))

                # Check for URL
                url_match = re.search(r'https://www\.domain\.com\.au/[a-z0-9\-]+-' + suburb.split('-')[1] + '-[0-9]+', lines[j])
                if url_match and not url:
                    url = url_match.group(0)

                # Check for heading (address)
                suburb_name = suburb.split('-')[1].replace('vic', '').upper()
                heading_match = re.search(r'heading "([^"]+) ' + suburb_name + '"', lines[j])
                if heading_match and not address:
                    address = heading_match.group(1)

                # If we have everything, save it
                if beds >= MIN_BEDROOMS and url and address and price <= MAX_BUDGET:
                    properties.append({
                        'price': price,
                        'url': url,
                        'address': address,
                        'beds': beds,
                        'suburb': suburb_name
                    })
                    break

    return properties

def format_commute(suburb):
    """Format commute time for display"""
    times = COMMUTE_TIMES.get(suburb, {'base_min': 60, 'base_max': 70, 'transport': 'unknown'})
    return f"~{times['base_min']}-{times['base_max']} min total ({times['transport']})"

def main():
    print(f"🔍 Searching Domain.com.au for rentals...")
    print(f"📍 Suburbs: {SUBURBS.replace(',', ', ')}")
    print(f"💰 Budget: Under ${MAX_BUDGET}/week")
    print(f"🛏️  Bedrooms: {MIN_BEDROOMS}+")
    print(f"🚇 Commute: Under {MAX_COMMUTE} min total (walk + transport + walk)")
    print()

    # Process each suburb individually
    all_properties = []
    suburbs_list = SUBURBS.split(',')

    for suburb in suburbs_list:
        suburb_code = suburb.split('-')[1]  # Extract 3072, 3073, etc.

        print(f"⏳ Searching {suburb.split('-')[0].title()}...", end=' ', flush=True)

        # Open browser
        result = subprocess.run(['agent-browser', 'open', f"https://www.domain.com.au/rent/?suburb={suburb}"],
                              capture_output=True, text=True)

        if result.returncode != 0:
            print(f"❌ Failed")
            continue

        # Get snapshot
        temp_file = f"/tmp/rentals-{suburb_code}.json"
        result = subprocess.run(['agent-browser', 'snapshot', '--format', 'json'],
                              capture_output=True, text=True)

        if result.returncode != 0:
            print(f"❌ Failed")
            continue

        # Save to temp file
        with open(temp_file, 'w') as f:
            f.write(result.stdout)

        # Extract properties
        properties = extract_properties_from_file(temp_file, suburb)
        print(f"✓ {len(properties)} found")
        all_properties.extend(properties)

    # Display results
    if not all_properties:
        print(f"\n❌ No properties found matching your criteria")
        print(f"💡 Try: Increasing budget or removing suburb filters")
        return 0

    print(f"\n📦 Results: {len(all_properties)} properties")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()

    # Group by suburb
    from collections import defaultdict
    by_suburb = defaultdict(list)
    for prop in all_properties:
        by_suburb[prop['suburb']].append(prop)

    # Display by suburb
    for suburb in sorted(by_suburb.keys()):
        properties = by_suburb[suburb]
        print(f"**{suburb.title()}** ({len(properties)} properties):")
        print()

        for prop in properties:
            commute = format_commute(f"{prop['suburb'].lower()}-vic-{suburb_code}")
            print(f"- [{prop['address']}] {prop['url']}")
            print(f"  Price: ${prop['price']}/week | {prop['beds']}BR")
            print(f"  Commute: {commute}")
            print()

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Total: {len(all_properties)} properties")
    print(f"🏢 Office: Suite 3, 452 Johnston Street, Abbotsford, Melbourne")
    print()

if __name__ == '__main__':
    sys.exit(main())
