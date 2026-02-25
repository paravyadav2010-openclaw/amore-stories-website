#!/usr/bin/env python3
"""Script to collect property data from Domain.com.au search results."""

import subprocess
import json
import re
import time

# List of property link refs from the first page
property_refs = [
    'e26',  # 10/21 Irving Avenue, PRAHRAN
    'e30',  # 18 Vicosa Drive, ARMSTRONG CREEK
    'e34',  # 40 Brittas Street, WOODSTOCK
    'e38',  # 30 Harriott Rd, ARMSTRONG CREEK
    'e42',  # 10 Tritones Wy, ARMSTRONG CREEK
    'e46',  # 19 Picture Street, MAMBOURIN
    'e50',  # 11 Newcastle Road, ROCKBANK
    'e56',  # 113/7 Dudley Street, CAULFIELD EAST
    'e62',  # 2/37 Victoria St, ELSTERNWICK
    'e68',  # 39 Nova Circuit, BUNDOORA
    'e74',  # 37 Yucca Street, WYNDHAM VALE
    'e80',  # 10 Thaine Way, DOREEN
    'e86',  # 1/15 Kendall Street, ELWOOD
    'e92',  # 6/62-64 Truganini Road, CARNEGIE
    'e98',  # 14 Modular St, CHARLEMONT
    'e104', # 14/425 Toorak Road, TOORAK
    'e110', # 2/573 Neerim Road, HUGHESDALE
    'e116', # 30 Pine Cone Walk, FRASER RISE
    'e122', # 3/15 State Street, OAKLEIGH EAST
    'e128', # 205/450 Bell Street, PRESTON
    'e134'  # 13/157 Brighton Road, ELWOOD
]

def run_command(cmd):
    """Run a shell command and return output."""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    return result.stdout.strip()

def extract_property_details(text):
    """Extract property details from the text content."""
    # Extract price
    price_match = re.search(r'\$(\d+)\s+per week', text)
    price = price_match.group(1) if price_match else 'N/A'

    # Extract address - everything between "per week" and "Beds" or "House/Apartment"
    address_match = re.search(r'per week\s+(.+?)(?=\d+\s+Beds|House|Apartment)', text)
    address = address_match.group(1).strip() if address_match else 'N/A'

    # Extract beds
    beds_match = re.search(r'(\d+)\s+Beds', text)
    beds = beds_match.group(1) if beds_match else 'N/A'

    # Extract baths
    baths_match = re.search(r'(\d+)\s+Bath', text)
    baths = baths_match.group(1) if baths_match else 'N/A'

    # Extract parking
    parking_match = re.search(r'(\d+)\s+Parking', text)
    parking = parking_match.group(1) if parking_match else '0'

    # Extract property type
    type_match = re.search(r'(House|Apartment|Townhouse|Unit|Flat|Studio)', text)
    property_type = type_match.group(1) if type_match else 'N/A'

    # Check if available (skip if leased, deposit taken, under contract)
    unavailable_keywords = ['Leased', 'Deposit Taken', 'Under Contract']
    is_available = not any(keyword in text for keyword in unavailable_keywords)

    # Extract suburb from address
    suburb_match = re.search(r'([A-Z][a-zA-Z\s]+) VIC \d+', address)
    suburb = suburb_match.group(1).strip() if suburb_match else 'N/A'

    return {
        'price': price,
        'address': address,
        'beds': beds,
        'baths': baths,
        'parking': parking,
        'type': property_type,
        'suburb': suburb,
        'available': is_available
    }

def collect_properties():
    """Collect data for all properties."""
    properties = []

    for i, ref in enumerate(property_refs, 1):
        print(f"⏳ Collecting property {i}/{len(property_refs)}...")

        try:
            # Click on property
            run_command(f'agent-browser click @{ref}')
            time.sleep(3)

            # Get URL
            url = run_command('agent-browser get url')

            # Get property details text
            text = run_command('agent-browser get text .css-3hv1uk')

            # Extract details
            details = extract_property_details(text)
            details['url'] = url
            details['ref'] = ref

            print(f"✅ {details['address']} - ${details['price']}/week")

            if details['available']:
                properties.append(details)

            # Go back to search results
            run_command('agent-browser back')
            time.sleep(2)

        except Exception as e:
            print(f"❌ Error collecting property {i}: {e}")
            run_command('agent-browser back')
            time.sleep(2)

    return properties

if __name__ == '__main__':
    print("🔍 Collecting property data...")
    properties = collect_properties()

    # Save to file
    with open('/Users/ava/.openclaw/workspace/properties.json', 'w') as f:
        json.dump(properties, f, indent=2)

    print(f"\n✅ Collected {len(properties)} available properties")
    print(f"📁 Saved to /Users/ava/.openclaw/workspace/properties.json")

    # Print summary
    for i, p in enumerate(properties, 1):
        print(f"{i}. {p['address']} - ${p['price']}/week - {p['beds']} beds")
