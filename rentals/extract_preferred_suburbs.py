#!/usr/bin/env python3
"""
Extract Melbourne rental properties from Domain.com.au snapshot text file.
Criteria: 2+ bedrooms, under $600/week, Preferred Suburbs only
Preferred Suburbs: Preston, Thornbury, Regent, Ruthven, Keon Park, Thomastown, Lalor
EXCLUDED: Wollert, Epping, South Morang
"""

import re
from typing import List, Dict

def extract_properties_from_text(file_path: str) -> List[Dict]:
    """Extract property information from snapshot text file."""
    properties = []

    with open(file_path, 'r') as f:
        content = f.read()

    # Find all property URLs for preferred suburbs
    url_pattern = r'url: (https://www\.domain\.com\.au/[a-z0-9-]+-(preston|thornbury|regent|ruthven|keon-park|thomastown|lalor)-vic-[0-9]+-[0-9]+)'
    urls = re.findall(url_pattern, content)

    # Extract unique URLs
    unique_urls = set(url[0] for url in urls)

    # For each URL, find associated property details
    for url in unique_urls:
        # Extract suburb
        suburb_match = re.search(r'(preston|thornbury|regent|ruthven|keon-park|thomastown|lalor)-vic-[0-9]+', url, re.IGNORECASE)
        suburb = ''
        if suburb_match:
            suburb_str = suburb_match.group(1).lower()
            suburb_map = {
                'keon-park': 'Keon Park'
            }
            suburb = suburb_map.get(suburb_str, suburb_str.title())

        # Extract address from URL
        address_match = re.search(r'/([^/]+)-vic-[0-9]+-[0-9]+$', url)
        address = ''
        if address_match:
            address = address_match.group(1).replace('-', ' ').title()

        # Find price near the URL in the content
        url_index = content.find(url)
        if url_index != -1:
            # Get context around URL (within 5000 characters)
            context_start = max(0, url_index - 2000)
            context_end = min(len(content), url_index + 3000)
            context = content[context_start:context_end]

            # Find price
            price_match = re.search(r'\$([0-9]+) per week', context)
            price = int(price_match.group(1)) if price_match else None

            # Find beds/baths
            beds_match = re.search(r'([0-9]+) Beds', context)
            baths_match = re.search(r'([0-9]+) Bath', context)
            beds = int(beds_match.group(1)) if beds_match else None
            baths = int(baths_match.group(1)) if baths_match else None

            # Find property type
            prop_type = None
            if 'House' in context:
                prop_type = 'House'
            elif 'Townhouse' in context:
                prop_type = 'Townhouse'
            elif 'Apartment' in context or 'Unit' in context or 'Flat' in context:
                prop_type = 'Apartment/Unit'

            # Find inspection times
            inspection_match = re.search(r'Inspection: (.+?)(?="|$)', context)
            inspection = inspection_match.group(1).strip() if inspection_match else 'Not listed'

            # Only add if we have essential info
            if url and price and beds:
                properties.append({
                    'url': url,
                    'address': address,
                    'suburb': suburb,
                    'price': price,
                    'beds': beds,
                    'baths': baths if baths else 0,
                    'type': prop_type or 'Unknown',
                    'inspection': inspection
                })

    return properties

def filter_properties(properties: List[Dict]) -> List[Dict]:
    """Filter properties based on criteria."""
    filtered = []
    for prop in properties:
        # Filter: 2+ bedrooms, under $600/week
        if prop.get('beds', 0) >= 2 and prop.get('price', 1000) < 600:
            filtered.append(prop)
    return filtered

def sort_by_commute(properties: List[Dict]) -> List[Dict]:
    """Sort properties by commute time (shortest first)."""
    # Commute times to Abbotsford office (estimates)
    commute_map = {
        'Preston': 28,      # minutes drive
        'Thornbury': 32,
        'Reservoir': 28,
        'Regent': 35,
        'Ruthven': 38,
        'Keon Park': 40,
        'Thomastown': 42,
        'Lalor': 48
    }

    def get_commute(prop):
        suburb = prop.get('suburb', '')
        return commute_map.get(suburb, 60)  # Default to 60 min if unknown

    return sorted(properties, key=lambda x: (get_commute(x), x.get('price', 999)))

def generate_report(properties: List[Dict]) -> str:
    """Generate formatted report."""
    if not properties:
        return "No properties found matching criteria."

    report = []
    report.append("=" * 80)
    report.append("MELBOURNE RENTAL PROPERTY SEARCH RESULTS")
    report.append(f"Total Properties: {len(properties)}")
    report.append("Criteria: 2+ Bedrooms, Under $600/week, <60 min commute")
    report.append("Suburbs: Preston, Thornbury, Regent, Ruthven, Keon Park, Thomastown, Lalor")
    report.append("Office: Suite 3, 452 Johnston Street, Abbotsford")
    report.append("=" * 80)
    report.append("")

    # Group by suburb
    suburbs = {}
    for prop in properties:
        suburb = prop.get('suburb', 'Unknown')
        if suburb not in suburbs:
            suburbs[suburb] = []
        suburbs[suburb].append(prop)

    # Sort suburbs by commute time
    suburb_commute_order = ['Preston', 'Thornbury', 'Reservoir', 'Regent', 'Ruthven', 'Keon Park', 'Thomastown', 'Lalor']

    for suburb in suburb_commute_order:
        if suburb not in suburbs:
            continue

        report.append(f"\n📍 {suburb.upper()}")
        report.append("-" * 80)

        suburb_props = suburbs[suburb]
        # Sort by price within suburb
        for i, prop in enumerate(sorted(suburb_props, key=lambda x: x.get('price', 999)), 1):
            address = prop.get('address', 'Unknown Address')
            price = prop.get('price', 0)
            beds = prop.get('beds', 0)
            baths = prop.get('baths', 0)
            prop_type = prop.get('type', 'Unknown')
            url = prop.get('url', '')
            inspection = prop.get('inspection', 'Not listed')

            # Estimate commute time to Abbotsford
            commute_map = {
                'Preston': '28 min drive / 38 min PT',
                'Thornbury': '32 min drive / 42 min PT',
                'Reservoir': '28 min drive / 38 min PT',
                'Regent': '35 min drive / 48 min PT',
                'Ruthven': '38 min drive / 52 min PT',
                'Keon Park': '40 min drive / 55 min PT',
                'Thomastown': '42 min drive / 58 min PT',
                'Lalor': '48 min drive / 62 min PT'
            }
            commute = commute_map.get(prop.get('suburb', ''), 'Unknown')

            # Estimate transport
            transport_map = {
                'Preston': 'Preston train station (South Morang line)',
                'Thornbury': 'Thornbury train station (South Morang line)',
                'Reservoir': 'Reservoir train station (South Morang line)',
                'Regent': 'Reservoir train station (Regent stop)',
                'Ruthven': 'Reservoir train station (Ruthven stop)',
                'Keon Park': 'Keon Park train station (South Morang line)',
                'Thomastown': 'Thomastown train station (South Morang line)',
                'Lalor': 'Lalor train station (South Morang line)'
            }
            transport = transport_map.get(prop.get('suburb', ''), 'Unknown')

            report.append(f"\n{i}. {address} - ${price}/week - {beds} Beds/{baths} Baths - {prop_type}")
            report.append(f"   URL: {url}")
            report.append(f"   🚇 Transport: {transport}")
            report.append(f"   🚗 Commute: {commute} to Abbotsford")
            report.append(f"   👀 Inspections: {inspection}")

    return "\n".join(report)

def main():
    """Main execution."""
    snapshot_path = '/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json'

    print("⏳ Loading snapshot...")
    properties = extract_properties_from_text(snapshot_path)

    print(f"⏳ Found {len(properties)} total properties")
    print(f"⏳ Filtering properties (2+ beds, under $600/week)...")
    filtered = filter_properties(properties)

    print(f"⏳ Sorting by commute time...")
    sorted_props = sort_by_commute(filtered)

    print("⏳ Generating report...")
    report = generate_report(sorted_props)

    print(report)

    # Save to file
    output_path = '/Users/ava/.openclaw/workspace/rentals/preferred_suburbs_report_2026-03-02.txt'
    with open(output_path, 'w') as f:
        f.write(report)

    print(f"\n✅ Report saved to: {output_path}")

if __name__ == '__main__':
    main()
