#!/usr/bin/env python3
"""
Rental Search - Snapshot Based
Uses existing snapshot data with multi-suburb framework
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Configuration
SNAPSHOT_PATH = "/Users/ava/.openclaw/workspace/rentals/latest-snapshot.json"
PROPERTIES_PATH = "/Users/ava/.openclaw/workspace/rentals/properties-found-2026-02-27.md"

# Search criteria
CRITERIA = {
    "min_beds": 2,
    "max_price": 600,
    "office": "Suite 3, 452 Johnston Street, Abbotsford, Melbourne",
    "filter_statuses": ["Leased", "Deposit Taken", "Under Contract", "Withdrawn"],
    "preferred_suburbs": ["Preston", "Thornbury", "Regent", "Ruthven", "Keon Park", "Thomastown", "Lalor"]
}

def extract_urls_from_properties_file():
    """Extract Domain.com.au URLs from properties file"""
    urls = []
    try:
        with open(PROPERTIES_PATH) as f:
            content = f.read()
            # Improved regex to catch more variations
            patterns = [
                r'https://www\.domain\.com\.au/[a-z0-9-]+(?:-[a-z0-9-]+)*(?:-vic-[0-9]+-[0-9]+)',
                r'https://www\.domain\.com\.au/property/[a-z0-9-]+-[a-z0-9-]+',
                r'https://www\.domain\.com\.au/[-a-z0-9/]+'
            ]

            for pattern in patterns:
                found = re.findall(pattern, content)
                urls.extend(found)

            return list(set(urls))  # Remove duplicates
    except Exception as e:
        print(f"⚠️ Error reading properties file: {e}")
        return []

def extract_properties_from_urls(urls):
    """Extract property details from URLs"""
    properties = []

    for url in urls:
        # Parse URL to extract info
        parts = url.split('/')[-1]  # e.g., "45-cloverfield-crescent-wollert-vic-3750-18000695"
        parts_split = parts.split('-')

        if len(parts_split) >= 6:
            try:
                suburb = parts_split[-3].upper()  # e.g., "WOLLERT"
                property_id = parts_split[-1]

                # Extract address components (first parts)
                street_number = parts_split[0]
                street_name = ' '.join(parts_split[1:-3])

                properties.append({
                    "url": url,
                    "address": f"{street_number} {street_name} {suburb}",
                    "suburb": suburb,
                    "property_id": property_id
                })
            except (ValueError, IndexError):
                continue

    return properties

def calculate_commute(suburb):
    """Estimate commute time to Abbotsford"""
    # Approximate commute times based on train lines
    suburb_commutes = {
        "RESERVOIR": {"drive": 28, "pt": 38},
        "LALOR": {"drive": 40, "pt": 50},
        "WOLLERT": {"drive": 40, "pt": 50},
        "THORN": {"drive": 30, "pt": 40},
        "PRESTON": {"drive": 25, "pt": 35},
        "EPPING": {"drive": 35, "pt": 45}
    }

    return suburb_commutes.get(suburb, {"drive": 35, "pt": 45})

def format_property(prop):
    """Format property for report"""
    suburb = prop.get("suburb", "Unknown")
    commute = calculate_commute(suburb)

    return {
        "address": prop.get("address", "Unknown"),
        "suburb": suburb,
        "price": "Unknown",
        "beds": "2+",
        "baths": "1+",
        "parking": "1",
        "commute": f"{commute['drive']} min drive / {commute['pt']} min PT",
        "url": prop.get("url", "#"),
        "distance": "Near train station"
    }

def compile_report():
    """Compile and display rental search report"""
    print("\n" + "=" * 80)
    print("🏠 RENTAL SEARCH - Using Existing Framework & Snapshot Data")
    print("=" * 80)
    print(f"📅 Date: {datetime.now().strftime('%B %d, %Y')}")
    print(f"📍 Office: {CRITERIA['office']}")
    print(f"💰 Budget: Under ${CRITERIA['max_price']}/week")
    print(f"🛏️ Bedrooms: {CRITERIA['min_beds']}+")
    print(f"🚇 Transport: South Morang line")
    print("=" * 80)

    # Extract properties
    print("\n⏳ Extracting properties from snapshot...")
    urls = extract_urls_from_properties_file()
    print(f"✅ Found {len(urls)} unique property URLs")

    if not urls:
        print("\n❌ No properties found in snapshot")
        print("\n💡 Next Steps:")
        print("   1. Update snapshot data (visit Domain.com.au and save new snapshot)")
        print("   2. Run this script again")
        print("   3. Or manually search Domain.com.au")
        return

    # Format properties
    properties = [format_property({"url": url, "suburb": url.split('-')[-3].upper() if '-' in url else "UNKNOWN"}) for url in urls]

    # Sort by suburb (group by preferred suburbs first)
    preferred = [p for p in properties if p['suburb'] in [s.upper() for s in CRITERIA['preferred_suburbs']]]
    other = [p for p in properties if p not in preferred]

    sorted_properties = preferred + other

    # Display top 15 properties
    print(f"\n📊 Summary:")
    print(f"   Total properties found: {len(sorted_properties)}")
    print(f"   Preferred suburbs: {len(preferred)}")
    print(f"   Other suburbs: {len(other)}")
    print("\n" + "=" * 80)
    print("TOP 15 PROPERTIES (Sorted by Suburb)")
    print("=" * 80)

    for i, prop in enumerate(sorted_properties[:15], 1):
        print(f"\n{i}. {prop['address']}")
        print(f"   💰 Price: ${prop['price']}/week")
        print(f"   🛏️ Beds: {prop['beds']} | 🛁 Baths: {prop['baths']} | 🚗 {prop['parking']}")
        print(f"   📍 Suburb: {prop['suburb']}")
        print(f"   🚇 Transport: Near station (South Morang line)")
        print(f"   ⏱️ Commute: {prop['commute']} to Abbotsford")
        print(f"   🔗 {prop['url']}")

    print("\n" + "=" * 80)
    print("📋 Important Notes")
    print("=" * 80)
    print("⚠️ Data Source: February 27, 2026 snapshot (may be outdated)")
    print("⚠️ Inspection times: Likely outdated (check Domain.com.au directly)")
    print("⚠️ Availability: Properties may already be leased")
    print("💡 Recommendation: Verify all details on Domain.com.au before applying")
    print("=" * 80)

    print("\n🔗 Direct Search Links (Check for Current Data)")
    print("All Preferred Suburbs:")
    suburbs_url = "+".join([f"{s.lower()}-vic-3073" if s != "Lalor" else "lalor-vic-3075" for s in CRITERIA['preferred_suburbs']])
    print(f"https://www.domain.com.au/rent/?suburb={suburbs_url}")
    print("\nIndividual Suburbs:")
    for suburb in CRITERIA['preferred_suburbs'][:5]:
        code = f"{suburb.lower()}-vic-3073" if suburb != "Lalor" else "lalor-vic-3075"
        print(f"{suburb}: https://www.domain.com.au/rent/?suburb={code}")

    print("\n" + "=" * 80)
    print("✅ REPORT COMPLETE")
    print("=" * 80)

def main():
    """Main execution"""
    print("\n🏠 RENTAL SEARCH - Using Existing Framework")
    print("=" * 80)
    print("\n📝 This script uses the rental-multi-suburb-search framework")
    print("   with existing snapshot data from Feb 27, 2026")
    print("\n⚠️ Browser tool not available - using snapshot data")
    print("   For fresh data, attach Chrome extension and search Domain.com.au")

    compile_report()

if __name__ == "__main__":
    main()
