#!/usr/bin/env python3
"""Parse and fix property data from the collected JSON."""

import json
import re

def parse_property_text(text):
    """Extract property details from the raw text."""
    # Extract price
    price_match = re.search(r'\$(\d+)\s+per week', text)
    price = price_match.group(1) if price_match else 'N/A'

    # Extract beds - look for pattern like "31812 Beds" where postcode runs into bed count
    # The postcode is 4 digits, then the bed count
    beds_match = re.search(r'VIC\s+\d{4}(\d+)\s+Beds', text)
    if not beds_match:
        # Try alternative pattern
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

    # Extract address - more robust extraction
    # Pattern: after "per week" until "VIC"
    address_match = re.search(r'per\s+week(.+?)VIC\s+\d{4}', text)
    if address_match:
        address = address_match.group(1).strip() + " VIC"
    else:
        address = 'N/A'

    # Extract suburb from address or text
    suburb_match = re.search(r'([A-Z][a-zA-Z\s]+)\s+VIC', text)
    if suburb_match:
        suburb = suburb_match.group(1).strip()
    else:
        suburb = 'N/A'

    # Check availability
    unavailable_keywords = ['Leased', 'Deposit Taken', 'Under Contract']
    is_available = not any(keyword in text for keyword in unavailable_keywords)

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

def get_address_from_url(url):
    """Extract address from Domain URL."""
    # Pattern: https://www.domain.com.au/10-21-irving-avenue-prahran-vic-3181-17994723
    match = re.search(r'domain\.com\.au/(.+?)-vic-\d{4}', url)
    if match:
        # Replace hyphens with spaces and capitalize
        addr = match.group(1).replace('-', ' ').title()
        return addr
    return 'N/A'

# Load properties
with open('/Users/ava/.openclaw/workspace/properties.json', 'r') as f:
    properties = json.load(f)

print("🔧 Fixing property data...")

# Fix each property
for i, prop in enumerate(properties):
    url = prop.get('url', '')
    # Extract address from URL as fallback
    url_address = get_address_from_url(url)
    print(f"\n{i+1}. URL address: {url_address}")
    print(f"   Original price: ${prop.get('price', 'N/A')}/week")
    print(f"   Original beds: {prop.get('beds', 'N/A')}")

    # Store URL-based address
    prop['url_address'] = url_address

    # Try to improve bed count extraction
    beds = prop.get('beds', 'N/A')
    if beds and beds != 'N/A' and len(beds) > 2:
        # Extract last digit(s) before " Beds"
        match = re.search(r'(\d+)', beds)
        if match:
            # Try to get a realistic bed count (1-5 usually)
            bed_num = match.group(1)
            if len(bed_num) > 1:
                # Last digit is likely the actual bed count
                prop['beds'] = bed_num[-1] if bed_num[-1].isdigit() else 'N/A'
            else:
                prop['beds'] = bed_num

    print(f"   Fixed beds: {prop.get('beds', 'N/A')}")

    # Extract suburb from URL address
    suburb_match = re.search(r'([A-Z][a-zA-Z\s]+)\s+Vic', url_address)
    if suburb_match:
        prop['suburb'] = suburb_match.group(1).strip()

# Save updated properties
with open('/Users/ava/.openclaw/workspace/properties_fixed.json', 'w') as f:
    json.dump(properties, f, indent=2)

print(f"\n✅ Fixed {len(properties)} properties")
print(f"📁 Saved to /Users/ava/.openclaw/workspace/properties_fixed.json")

# Print summary
print("\n📊 Property Summary:")
for i, p in enumerate(properties[:20], 1):
    print(f"{i}. {p['url_address']} - ${p['price']}/week - {p['beds']} beds - {p['suburb']}")
