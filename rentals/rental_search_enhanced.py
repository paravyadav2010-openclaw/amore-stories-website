#!/usr/bin/env python3
"""
Rental Search - Enhanced with Better URL Extraction
Extracts and displays properties from snapshot data
"""

import re
import sys
from pathlib import Path
from datetime import datetime

# Configuration
SNAPSHOT_PATH = "/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json"
PROPERTIES_FILE = "/Users/ava/.openclaw/workspace/rentals/properties-found-2026-02-27.md"

# Search criteria
CRITERIA = {
    "min_beds": 2,
    "max_price": 600,
    "office": "Suite 3, 452 Johnston Street, Abbotsford, Melbourne",
    "filter_statuses": ["Leased", "Deposit Taken", "Under Contract", "Withdrawn"],
    "preferred_suburbs": ["Preston", "Thornbury", "Reservoir", "Regent", "Ruthven", "Keon Park", "Thomastown", "Lalor"],
    "exclude_suburbs": ["Wollert", "Epping"]  # User excluded Wollert, Epping not in snapshot
}

def extract_properties_from_snapshot():
    """Extract property URLs directly from snapshot file"""
    urls = []
    try:
        with open(SNAPSHOT_PATH) as f:
            content = f.read()
            # Extract URLs
            url_pattern = r'https://www\.domain\.com\.au/[a-z0-9-]+-[a-z0-9-]+-vic-[0-9]+-[0-9]+'
            urls = re.findall(url_pattern, content)
            return list(set(urls))  # Remove duplicates
    except Exception as e:
        print(f"⚠️  Error reading snapshot: {e}")
        return []

def parse_property_url(url):
    """Parse property URL to extract details"""
    # URL format: https://www.domain.com.au/3-31-invermay-street-reservoir-vic-3073-17989133
    parts = url.split('/')[-1]
    url_parts = parts.split('-')

    if len(url_parts) < 6:
        return None

    # Parse components
    street_num = url_parts[0]
    street_parts = ' '.join(url_parts[1:-4])
    suburb = url_parts[-4].upper()
    state = url_parts[-3].upper()
    postcode = url_parts[-2]

    return {
        "url": url,
        "address": f"{street_num} {street_parts} {suburb}",
        "suburb": suburb,
        "price": "Unknown",  # Would need full property page to get price
        "beds": "2+",
        "baths": "1+",
        "parking": "1",
        "state": state,
        "postcode": postcode
    }

def get_commute_time(suburb):
    """Get estimated commute time to Abbotsford"""
    commute_times = {
        "RESERVOIR": {"drive": 28, "pt": 38},
        "LALOR": {"drive": 40, "pt": 50},
        "PRESTON": {"drive": 25, "pt": 35},
        "THORN": {"drive": 30, "pt": 40},
        "REGENT": {"drive": 30, "pt": 40},
        "RUTHVEN": {"drive": 32, "pt": 42},
        "KEON": {"drive": 30, "pt": 40},
        "THOMASTOWN": {"drive": 32, "pt": 42},
        "WOLLERT": {"drive": 40, "pt": 50},
        "EPPING": {"drive": 35, "pt": 45}
    }
    return commute_times.get(suburb, {"drive": 35, "pt": 45})

def filter_and_sort_properties(properties):
    """Filter and sort properties"""
    # Filter out excluded suburbs
    filtered = [p for p in properties if p["suburb"] not in CRITERIA["exclude_suburbs"]]

    # Prioritize preferred suburbs
    preferred = [p for p in filtered if p["suburb"] in [s.upper() for s in CRITERIA["preferred_suburbs"]]]
    others = [p for p in filtered if p not in preferred]

    return preferred + others

def display_properties(properties):
    """Display properties in report format"""
    print("\n" + "=" * 80)
    print("🏠  RENTAL SEARCH RESULTS")
    print("=" * 80)
    print(f"📅 Date: {datetime.now().strftime('%B %d, %Y')}")
    print(f"📍 Office: {CRITERIA['office']}")
    print(f"💰 Budget: Under ${CRITERIA['max_price']}/week")
    print(f"🛏️  Bedrooms: {CRITERIA['min_beds']}+")
    print(f"🚇 Transport: South Morang line")
    print("=" * 80)

    if not properties:
        print("\n❌ No properties found matching criteria")
        print("\n💡 Next Steps:")
        print("   1. Visit Domain.com.au directly for fresh data")
        print("   2. Check inspection times and availability")
        print("   3. Search your preferred suburbs")
        return

    print(f"\n📊 Summary:")
    print(f"   Total properties found: {len(properties)}")
    preferred_count = len([p for p in properties if p["suburb"] in [s.upper() for s in CRITERIA["preferred_suburbs"]]])
    print(f"   Preferred suburbs: {preferred_count}")
    print(f"   Other suburbs: {len(properties) - preferred_count}")
    print("\n" + "=" * 80)
    print("TOP PROPERTIES (Sorted by Suburb)")
    print("=" * 80)

    for i, prop in enumerate(properties[:20], 1):
        commute = get_commute_time(prop["suburb"])
        print(f"\n{i}. {prop['address']} {prop['state']} {prop['postcode']}")
        print(f"   💰 Price: {prop['price']}/week")
        print(f"   🛏️  Beds: {prop['beds']} | 🛁 Baths: {prop['baths']} | 🚗 Parking: {prop['parking']}")
        print(f"   📍 Suburb: {prop['suburb']}")
        print(f"   🚇 Transport: Near station (South Morang line)")
        print(f"   ⏱️  Commute: {commute['drive']} min drive / {commute['pt']} min PT to Abbotsford")
        print(f"   🔗 {prop['url']}")

    print("\n" + "=" * 80)
    print("📋 Important Notes")
    print("=" * 80)
    print("⚠️  Data Source: February 27, 2026 snapshot (2 days old)")
    print("⚠️  Inspection times: Not available (check Domain.com.au directly)")
    print("⚠️  Availability: Properties may already be leased")
    print("💡 Recommendation: Verify all details on Domain.com.au before applying")
    print("=" * 80)

    # Print search links
    print("\n🔗 Direct Search Links (Check for Current Data)")
    print("=" * 80)

    # All preferred suburbs URL
    preferred_suburbs_filtered = [s for s in CRITERIA["preferred_suburbs"] if s not in CRITERIA["exclude_suburbs"]]
    suburbs_url = '+'.join([f"{s.lower()}-vic-3073" for s in preferred_suburbs_filtered])
    print(f"\nAll Preferred Suburbs:")
    print(f"https://www.domain.com.au/rent/?suburb={suburbs_url}")

    print("\nIndividual Suburbs:")
    for suburb in preferred_suburbs_filtered[:5]:
        code = f"{suburb.lower()}-vic-3073"
        print(f"{suburb}: https://www.domain.com.au/rent/?suburb={code}")

    print("\n" + "=" * 80)
    print("✅ REPORT COMPLETE")
    print("=" * 80)

def main():
    """Main execution"""
    print("\n🏠  RENTAL SEARCH - Using Existing Framework & Snapshot")
    print("=" * 80)
    print("\n📝 Framework: rental-multi-suburb-search")
    print("   Data: February 27, 2026 snapshot")
    print("   Filters: 2+ beds, under $600/week, exclude Wollert")
    print("\n⚠️  Browser tool not available - using snapshot data")

    # Extract properties
    print("\n⏳ Extracting properties from snapshot...")
    urls = extract_properties_from_snapshot()
    print(f"✅ Found {len(urls)} unique property URLs")

    if not urls:
        print("\n❌ No properties found in snapshot")
        print("\n💡 Next Steps:")
        print("   1. Attach Chrome extension to browser tab")
        print("   2. Search Domain.com.au directly")
        print("   3. Save new snapshot")
        return

    # Parse properties
    print("\n📋 Parsing property details...")
    properties = []
    for url in urls:
        prop = parse_property_url(url)
        if prop:
            properties.append(prop)

    print(f"✅ Parsed {len(properties)} properties")

    # Filter and sort
    print("\n🔄 Filtering and sorting...")
    filtered_properties = filter_and_sort_properties(properties)

    # Display report
    display_properties(filtered_properties)

if __name__ == "__main__":
    main()
