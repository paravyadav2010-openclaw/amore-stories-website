#!/usr/bin/env python3
"""Analyze rental properties from snapshot and calculate commute times"""

import json
import re
from typing import List, Dict, Any

# Load the snapshot
with open('/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json', 'r') as f:
    data = json.load(f)

# Extract property details from the structured data
def extract_properties(data) -> List[Dict[str, Any]]:
    properties = []

    # Helper to extract text from nested structures
    def get_text(element, field='text'):
        if isinstance(element, dict):
            return element.get(field, '')
        return str(element) if element else ''

    # Find all list items that contain properties
    def find_properties(element, depth=0):
        if depth > 20:  # Prevent infinite recursion
            return

        if isinstance(element, dict):
            # Check if this looks like a property listing
            heading = None
            price_text = None
            details_text = None
            url = None

            # Look for heading
            if 'heading' in element:
                heading = element['heading']

            # Look for URL
            if 'link' in element:
                if isinstance(element['link'], dict):
                    url = element['link'].get('/url', '')
                elif isinstance(element['link'], list) and len(element['link']) > 0:
                    if isinstance(element['link'][0], dict):
                        url = element['link'][0].get('/url', '')

            # Look for price (paragraph with "$" and "per week")
            if 'paragraph' in element:
                para = element['paragraph']
                if isinstance(para, str) and '$' in para and 'per week' in para:
                    price_text = para

            # Look for beds/baths/parking
            if 'text' in element:
                text = element['text']
                if isinstance(text, str) and ('Beds' in text or 'bath' in text.lower()):
                    details_text = text

            # If we found enough info, try to extract details
            if heading or (price_text and url):
                prop = {}

                # Parse address from heading or URL
                if heading:
                    # Heading format: "ADDRESS, SUBURB" [level=2]
                    if isinstance(heading, dict):
                        heading_text = heading.get('#text', heading.get('text', ''))
                    elif isinstance(heading, str):
                        heading_text = heading
                    else:
                        heading_text = str(heading)
                elif url:
                    # Extract from URL
                    match = re.search(r'/([a-z0-9-]+)-(reservoir|wollert|epping|lalor)-vic-', url)
                    if match:
                        heading_text = match.group(1).replace('-', ' ').title()
                    else:
                        heading_text = url
                else:
                    heading_text = "Unknown"

                # Parse price
                price = None
                if price_text:
                    match = re.search(r'\$(\d+)', price_text)
                    if match:
                        price = int(match.group(1))

                # Parse beds/baths/parking from details
                beds = baths = parking = None
                if details_text:
                    beds_match = re.search(r'(\d+)\s*Beds?', details_text)
                    baths_match = re.search(r'(\d+)\s*Baths?', details_text)
                    parking_match = re.search(r'(\d+)\s*Parking', details_text)
                    if beds_match:
                        beds = int(beds_match.group(1))
                    if baths_match:
                        baths = int(baths_match.group(1))
                    if parking_match:
                        parking = int(parking_match.group(1))

                # Get suburb from URL or heading
                suburb = None
                if url:
                    if 'reservoir' in url:
                        suburb = 'Reservoir'
                    elif 'wollert' in url:
                        suburb = 'Wollert'
                    elif 'epping' in url:
                        suburb = 'Epping'
                    elif 'lalor' in url:
                        suburb = 'Lalor'
                elif heading_text:
                    for s in ['Reservoir', 'Wollert', 'Epping', 'Lalor']:
                        if s.upper() in heading_text.upper():
                            suburb = s
                            break

                if url and heading_text:
                    prop = {
                        'address': heading_text,
                        'suburb': suburb,
                        'url': url,
                        'price': price,
                        'beds': beds,
                        'baths': baths,
                        'parking': parking,
                        'details_text': details_text,
                        'price_text': price_text
                    }
                    properties.append(prop)

        # Recursively search
        if isinstance(element, dict):
            for key, value in element.items():
                find_properties(value, depth + 1)
        elif isinstance(element, list):
            for item in element:
                find_properties(item, depth + 1)

    find_properties(data)
    return properties

# Extract all properties
all_properties = extract_properties(data)

# Filter: under $600/week, 2+ beds
filtered = [p for p in all_properties
            if p['price'] and p['price'] < 600
            and p['beds'] and p['beds'] >= 2]

# Remove duplicates
seen_urls = set()
unique_properties = []
for p in filtered:
    if p['url'] not in seen_urls:
        seen_urls.add(p['url'])
        unique_properties.append(p)

# Sort by price (cheapest first)
unique_properties.sort(key=lambda x: x['price'])

# Print results
print(f"Found {len(unique_properties)} properties matching criteria (2+ beds, under $600/week):")
print()

# Estimate commute times to Abbotsford (452 Johnston Street)
# Approximate distances:
# - Reservoir: ~12-15km, 25-35 min by car, 35-45 min by public transport
# - Wollert: ~20-25km, 35-45 min by car, 45-60 min by public transport
# - Epping: ~18-22km, 30-40 min by car, 40-55 min by public transport
# - Lalor: ~15-18km, 25-35 min by car, 35-50 min by public transport

def estimate_commute(suburb: str) -> str:
    """Estimate commute time to Abbotsford"""
    commutes = {
        'Reservoir': '28 min drive / 38 min PT',
        'Wollert': '40 min drive / 50 min PT',
        'Epping': '35 min drive / 48 min PT',
        'Lalor': '30 min drive / 42 min PT'
    }
    return commutes.get(suburb, 'Unknown')

# Sort by commute (Reservoir first, then Lalor, then Epping, then Wollert)
suburb_order = {'Reservoir': 0, 'Lalor': 1, 'Epping': 2, 'Wollert': 3}
unique_properties.sort(key=lambda x: (suburb_order.get(x['suburb'], 99), x['price']))

# Display top 10
for i, prop in enumerate(unique_properties[:10], 1):
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

print(f"Total properties found: {len(unique_properties)}")
print(f"Showing top 10 by commute time and price")
