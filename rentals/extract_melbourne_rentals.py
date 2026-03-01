#!/usr/bin/env python3
"""
Extract Melbourne rental properties from Domain.com.au snapshot.
Criteria: 2+ bedrooms, under $600/week, Wollert/Epping/Reservoir/South Morang
"""

import json
import re
from typing import List, Dict

def load_snapshot(file_path: str) -> dict:
    """Load snapshot JSON file."""
    with open(file_path, 'r') as f:
        return json.load(f)

def extract_properties(snapshot: dict) -> List[Dict]:
    """Extract property information from snapshot."""
    properties = []

    def traverse(obj, current_prop=None):
        """Recursively traverse the JSON structure."""
        if isinstance(obj, dict):
            # Look for property URLs
            if '/url' in obj:
                url = obj.get('/url', '')
                # Check if it's a Domain.com.au property URL
                if 'domain.com.au/' in url and '/rent/' not in url and len(url.split('/')) > 6:
                    if not current_prop:
                        current_prop = {'url': url}
                    else:
                        current_prop['url'] = url

            # Look for price (per week)
            if 'paragraph' in obj:
                text = obj.get('paragraph', '')
                price_match = re.search(r'\$([0-9]+) per week', text)
                if price_match:
                    price = int(price_match.group(1))
                    if not current_prop:
                        current_prop = {'price': price}
                    else:
                        current_prop['price'] = price

            # Look for beds/baths/parking and inspection times
            if 'text' in obj and isinstance(obj['text'], str):
                text = obj['text']
                # Extract beds, baths, parking
                beds_match = re.search(r'([0-9]+) Beds', text)
                baths_match = re.search(r'([0-9]+) Bath', text)
                parking_match = re.search(r'([0-9]+|\-|\s) Parking', text)

                # Extract property type
                prop_type = None
                if 'House' in text:
                    prop_type = 'House'
                elif 'Townhouse' in text:
                    prop_type = 'Townhouse'
                elif 'Apartment' in text or 'Unit' in text or 'Flat' in text:
                    prop_type = 'Apartment/Unit'

                # Extract inspection times
                inspection_match = re.search(r'Inspection: (.+)', text)

                # Extract suburb from URL
                url = current_prop.get('url', '') if current_prop else ''
                suburb_match = re.search(r'(wollert|epping|reservoir|south-morang|morang)-vic-[0-9]+', url, re.IGNORECASE)
                suburb = ''
                if suburb_match:
                    suburb_str = suburb_match.group(1)
                    suburb = suburb_str.title()
                    if suburb == 'Morang':
                        suburb = 'South Morang'

                # Extract address from URL (property number + street)
                address_match = re.search(r'/(.+)-vic-[0-9]+-[0-9]+', url)
                address = ''
                if address_match:
                    address_parts = address_match.group(1).split('-')
                    # Reconstruct address
                    if address_parts:
                        address = ' '.join([p.title() for p in address_parts])

                if beds_match or baths_match or prop_type or inspection_match:
                    if not current_prop:
                        current_prop = {}
                    if beds_match:
                        current_prop['beds'] = int(beds_match.group(1))
                    if baths_match:
                        current_prop['baths'] = int(baths_match.group(1))
                    if prop_type:
                        current_prop['type'] = prop_type
                    if inspection_match:
                        current_prop['inspection'] = inspection_match.group(1)
                    if suburb:
                        current_prop['suburb'] = suburb
                    if address:
                        current_prop['address'] = address

            # Continue traversing
            for key, value in obj.items():
                traverse(value, current_prop)

        elif isinstance(obj, list):
            for item in obj:
                # Check if we have a complete property
                if current_prop and all(k in current_prop for k in ['url', 'price', 'beds', 'suburb']):
                    # Avoid duplicates
                    if current_prop not in properties:
                        properties.append(current_prop)
                    current_prop = None
                traverse(item, current_prop)

        # Final check before returning
        if current_prop and all(k in current_prop for k in ['url', 'price', 'beds', 'suburb']):
            if current_prop not in properties:
                properties.append(current_prop)

    traverse(snapshot)
    return properties

def filter_properties(properties: List[Dict]) -> List[Dict]:
    """Filter properties based on criteria."""
    filtered = []
    for prop in properties:
        # Filter: 2+ bedrooms, under $600/week
        if prop.get('beds', 0) >= 2 and prop.get('price', 1000) < 600:
            filtered.append(prop)
    return filtered

def sort_properties(properties: List[Dict]) -> List[Dict]:
    """Sort properties by price (lowest first)."""
    return sorted(properties, key=lambda x: x.get('price', 999))

def generate_report(properties: List[Dict]) -> str:
    """Generate formatted report."""
    if not properties:
        return "No properties found matching criteria."

    report = []
    report.append("=" * 80)
    report.append(f"MELBOURNE RENTAL PROPERTY SEARCH RESULTS")
    report.append(f"Total Properties: {len(properties)}")
    report.append(f"Criteria: 2+ Bedrooms, Under $600/week")
    report.append("=" * 80)
    report.append("")

    # Group by suburb
    suburbs = {}
    for prop in properties:
        suburb = prop.get('suburb', 'Unknown')
        if suburb not in suburbs:
            suburbs[suburb] = []
        suburbs[suburb].append(prop)

    for suburb in sorted(suburbs.keys()):
        report.append(f"\n📍 {suburb.upper()}")
        report.append("-" * 80)
        for i, prop in enumerate(sorted(suburbs[suburb], key=lambda x: x.get('price', 999)), 1):
            address = prop.get('address', 'Unknown Address')
            price = prop.get('price', 0)
            beds = prop.get('beds', 0)
            baths = prop.get('baths', 0)
            prop_type = prop.get('type', 'Unknown')
            url = prop.get('url', '')
            inspection = prop.get('inspection', 'Not listed')

            # Estimate commute time to Abbotsford
            # Wollert: ~45-60 min, Epping: ~40-55 min, Reservoir: ~25-35 min, South Morang: ~45-60 min
            commute_map = {
                'Wollert': '45-60 min',
                'Epping': '40-55 min',
                'Reservoir': '25-35 min',
                'South Morang': '45-60 min'
            }
            commute = commute_map.get(prop.get('suburb', ''), 'Unknown')

            # Estimate transport
            transport_map = {
                'Wollert': 'Near South Morang train line (via Epping station)',
                'Epping': 'Epping train station (South Morang line)',
                'Reservoir': 'Reservoir train station (South Morang line)',
                'South Morang': 'South Morang train station (end of line)'
            }
            transport = transport_map.get(prop.get('suburb', ''), 'Unknown')

            report.append(f"\n{i}. {address.title()} - ${price}/week - {beds} Beds/{baths} Baths - {prop_type}")
            report.append(f"   {url}")
            report.append(f"   📍 Suburb: {prop.get('suburb', '')}")
            report.append(f"   🚇 Transport: {transport}")
            report.append(f"   🚗 Commute: {commute} to Abbotsford")
            report.append(f"   👀 Inspections: {inspection}")

    return "\n".join(report)

def main():
    """Main execution."""
    snapshot_path = '/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json'

    print("⏳ Loading snapshot...")
    snapshot = load_snapshot(snapshot_path)

    print("⏳ Extracting properties...")
    properties = extract_properties(snapshot)

    print(f"⏳ Found {len(properties)} total properties")
    print(f"⏳ Filtering properties (2+ beds, under $600/week)...")
    filtered = filter_properties(properties)

    print(f"⏳ Sorting by price...")
    sorted_props = sort_properties(filtered)

    print("⏳ Generating report...")
    report = generate_report(sorted_props)

    print(report)

    # Save to file
    output_path = '/Users/ava/.openclaw/workspace/rentals/melbourne_rental_report_2026-03-01.txt'
    with open(output_path, 'w') as f:
        f.write(report)

    print(f"\n✅ Report saved to: {output_path}")

if __name__ == '__main__':
    main()
