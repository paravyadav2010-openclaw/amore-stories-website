#!/usr/bin/env python3
"""
Quick rental search - extract properties from agent-browser snapshots
"""

import subprocess
import json
import re

# Suburb commute times (total including walks)
COMMUTE_TIMES = {
    'preston': {'base_min': 30, 'base_max': 42, 'transport': 'train'},
    'reservoir': {'base_min': 46, 'base_max': 58, 'transport': 'train'},
    'thomastown': {'base_min': 58, 'base_max': 70, 'transport': 'train'},
    'bundoora': {'base_min': 55, 'base_max': 68, 'transport': 'bus'},
    'lalor': {'base_min': 66, 'base_max': 78, 'transport': 'train'},
    'epping': {'base_min': 55, 'base_max': 68, 'transport': 'train'},
    'south-morang': {'base_min': 58, 'base_max': 70, 'transport': 'train'},
}

SUBURBS = ["preston-vic-3072", "reservoir-vic-3073", "thomastown-vic-3077", "bundoora-vic-3083", "lalor-vic-3075", "epping-vic-3076", "south-morang-vic-3752"]
MAX_BUDGET = 600
MIN_BEDROOMS = 2

def extract_properties_from_snapshot(snapshot_text, suburb):
    """Extract property info from snapshot text"""
    properties = []

    # Find all property blocks by looking for price patterns
    price_pattern = r'paragraph: \$(\d+) per week'
    lines = snapshot_text.split('\n')

    for i, line in enumerate(lines):
        price_match = re.search(price_pattern, line)
        if not price_match:
            continue

        price = int(price_match.group(1))
        if price > MAX_BUDGET:
            continue

        # Look ahead for property details
        property_info = {
            'price': price,
            'suburb': suburb.split('-')[0].title(),
            'url': None,
            'address': None,
            'beds': 0,
            'inspection': None
        }

        # Scan next 30 lines for details
        for j in range(i+1, min(i+30, len(lines))):
            # URL
            url_match = re.search(r'/url: (https://www\.domain\.com\.au/[^\s"\'\)]+)', lines[j])
            if url_match and not property_info['url']:
                property_info['url'] = url_match.group(1)

            # Address/heading
            heading_match = re.search(r'heading "([^"]+), ' + suburb.split('-')[0].upper() + '"', lines[j])
            if heading_match and not property_info['address']:
                property_info['address'] = heading_match.group(1)

            # Bedrooms
            beds_match = re.search(r'(\d+)\s+Beds?', lines[j])
            if beds_match and property_info['beds'] == 0:
                property_info['beds'] = int(beds_match.group(1))

            # Inspection
            insp_match = re.search(r'Inspection: ([A-Za-z]+ \d+ [A-Za-z]+, [0-9:]+(?:am|pm))', lines[j])
            if insp_match and not property_info['inspection']:
                property_info['inspection'] = insp_match.group(1)

        # Only add if we have URL, address, and enough bedrooms
        if property_info['url'] and property_info['address'] and property_info['beds'] >= MIN_BEDROOMS:
            properties.append(property_info)

    return properties

def main():
    all_properties = []

    for suburb in SUBURBS:
        suburb_name = suburb.split('-')[0]
        print(f"Searching {suburb_name.title()}...", flush=True)

        # Open browser
        subprocess.run(['agent-browser', 'open', f"https://www.domain.com.au/rent/?suburb={suburb}"],
                      capture_output=True, text=True)

        # Get snapshot
        result = subprocess.run(['agent-browser', 'snapshot', '--format', 'json'],
                              capture_output=True, text=True)

        if result.returncode != 0:
            print(f"  ✗ Failed")
            continue

        # Extract properties
        properties = extract_properties_from_snapshot(result.stdout, suburb)
        print(f"  ✓ {len(properties)} found (2+ beds, <${MAX_BUDGET})")
        all_properties.extend(properties)

    if not all_properties:
        print("\n❌ No properties found matching criteria")
        return 1

    # Sort by commute time
    def get_commute_min(prop):
        commute = COMMUTE_TIMES.get(prop['suburb'].lower(), {'base_min': 999})
        return commute['base_min']

    all_properties.sort(key=get_commute_min)

    print(f"\n{'='*70}")
    print(f"🏠 TOP 10 PROPERTIES (Sorted by Commute Time)")
    print(f"{'='*70}\n")

    for i, prop in enumerate(all_properties[:10], 1):
        commute = COMMUTE_TIMES.get(prop['suburb'].lower(), {'base_min': 0, 'base_max': 0, 'transport': 'unknown'})
        print(f"{i}. {prop['address']}, {prop['suburb']}")
        print(f"   {prop['url']}")
        print(f"   ${prop['price']}/week | {prop['beds']}BR | ~{commute['base_min']}-{commute['base_max']} min ({commute['transport']})")
        if prop['inspection']:
            print(f"   🔔 {prop['inspection']}")
        print()

    print(f"{'='*70}")
    print(f"Total found: {len(all_properties)} properties")
    print(f"Office: Suite 3, 452 Johnston Street, Abbotsford, Melbourne")
    print(f"{'='*70}")

    return 0

if __name__ == '__main__':
    exit(main())
