#!/usr/bin/env python3
"""
Enhanced Melbourne Rental Property Search
Features: Smart filters, property saving, inspection reminders
"""

import sys
import subprocess
import json
import re
from datetime import datetime, timedelta
from collections import defaultdict

# Suburb commute times (total including walks)
COMMUTE_TIMES = {
    'preston-vic-3072': {'base_min': 30, 'base_max': 42, 'transport': 'train', 'name': 'Preston'},
    'reservoir-vic-3073': {'base_min': 46, 'base_max': 58, 'transport': 'train', 'name': 'Reservoir'},
    'thomastown-vic-3077': {'base_min': 58, 'base_max': 70, 'transport': 'train', 'name': 'Thomastown'},
    'bundoora-vic-3083': {'base_min': 55, 'base_max': 68, 'transport': 'bus', 'name': 'Bundoora'},
    'lalor-vic-3075': {'base_min': 66, 'base_max': 78, 'transport': 'train', 'name': 'Lalor'},
}

# Smart filters
SMART_FILTERS = {
    'cheapest': lambda p: p['price'],
    'shortest': lambda p: COMMUTE_TIMES.get(f"{p['suburb_name'].lower()}-vic-{p['suburb_code']}", {}).get('base_min', 999),
    'largest': lambda p: -p['beds'],
}

def parse_inspection_time(text):
    """Parse inspection time from property description"""
    # Match patterns like "Sat 21 Feb, 11:30am"
    pattern = r'(?:Inspection:)?\s*([A-Z][a-z]{2})\s+(\d+)\s+([A-Z][a-z]{3}),\s*(\d+:\d+[ap]m)'
    match = re.search(pattern, text)
    if match:
        day, date, month, time = match.groups()
        try:
            return f"{day} {date} {month} at {time}"
        except:
            return None
    return None

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
            details = []
            inspection = None

            for j in range(i, min(i+30, len(lines))):
                # Extract bedroom count
                bed_match = re.search(r'(\d+)\s+Beds?', lines[j])
                if bed_match and beds == 0:
                    beds = int(bed_match.group(1))

                # Extract URL
                url_match = re.search(r'https://www\.domain\.com\.au/[a-z0-9\-]+-' + suburb.split('-')[1] + '-[0-9]+', lines[j])
                if url_match and not url:
                    url = url_match.group(0)

                # Extract address
                suburb_name = suburb.split('-')[1].replace('vic', '').upper()
                heading_match = re.search(r'heading "([^"]+) ' + suburb_name + '"', lines[j])
                if heading_match and not address:
                    address = heading_match.group(1)

                # Extract details (baths, parking)
                bath_match = re.search(r'(\d+)\s+Baths?', lines[j])
                if bath_match:
                    details.append(f"{bath_match.group(1)}BA")

                park_match = re.search(r'(\d+)\s+Parking', lines[j])
                if park_match:
                    details.append(f"{park_match.group(1)}CP")

                # Extract inspection time
                if not inspection:
                    inspection = parse_inspection_time(lines[j])

                # Check if we have everything
                if beds >= 2 and url and address:
                    suburb_info = COMMUTE_TIMES.get(suburb, {})
                    properties.append({
                        'price': price,
                        'url': url,
                        'address': address,
                        'beds': beds,
                        'baths': int(details[0].replace('BA', '')) if 'BA' in str(details) else 0,
                        'parking': int(details[1].replace('CP', '')) if 'CP' in str(details) else 0,
                        'suburb': suburb_info.get('name', suburb_name),
                        'suburb_code': suburb.split('-')[1],
                        'commute_min': suburb_info.get('base_min', 60),
                        'commute_max': suburb_info.get('base_max', 75),
                        'transport': suburb_info.get('transport', 'unknown'),
                        'inspection': inspection,
                        'suburb_name': suburb_info.get('name', suburb_name),
                    })
                    break

    return properties

def save_favorite_property(property):
    """Save property to favorites file"""
    fav_file = '/Users/ava/.openclaw/workspace/favorite-properties.json'

    # Load existing favorites
    favorites = []
    try:
        with open(fav_file, 'r') as f:
            favorites = json.load(f)
    except:
        pass

    # Check if already saved
    for fav in favorites:
        if fav['url'] == property['url']:
            print(f"✓ Property already saved to favorites")
            return

    # Add new favorite
    property['saved_at'] = datetime.now().isoformat()
    favorites.append(property)

    # Save
    with open(fav_file, 'w') as f:
        json.dump(favorites, f, indent=2)

    print(f"✓ Saved to favorites")

def format_property(prop, show_commute=True):
    """Format property for display"""
    result = f"- [{prop['address']}] {prop['url']}\n"
    result += f"  Price: ${prop['price']}/week | {prop['beds']}BR {prop['baths']}BA {prop['parking']}CP"

    if show_commute:
        result += f"\n  Commute: ~{prop['commute_min']}-{prop['commute_max']} min ({prop['transport']})"

    if prop['inspection']:
        result += f"\n  📅 Inspection: {prop['inspection']}"

    return result

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 rental-search-enhanced.py search [filter]")
        print("    filters: cheapest, shortest, largest")
        print("  python3 rental-search-enhanced.py save <url>")
        print("  python3 rental-search-enhanced.py favorites")
        print("  python3 rental-search-enhanced.py inspections")
        sys.exit(1)

    command = sys.argv[1].lower()

    # Save favorite property
    if command == 'save' and len(sys.argv) > 2:
        # This would integrate with search results
        print("Use with search results: property will be marked as favorite")
        return 0

    # Show favorites
    if command == 'favorites':
        fav_file = '/Users/ava/.openclaw/workspace/favorite-properties.json'
        try:
            with open(fav_file, 'r') as f:
                favorites = json.load(f)
                print(f"📋 Favorite Properties ({len(favorites)}):")
                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                for fav in favorites:
                    print(format_property(fav))
                    print()
        except:
            print("No favorites saved yet")
        return 0

    # Show upcoming inspections
    if command == 'inspections':
        fav_file = '/Users/ava/.openclaw/workspace/favorite-properties.json'
        try:
            with open(fav_file, 'r') as f:
                favorites = json.load(f)
                inspections = [f for f in favorites if f['inspection']]

                if not inspections:
                    print("No upcoming inspections found")
                    return 0

                print(f"📅 Upcoming Inspections ({len(inspections)}):")
                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                for insp in inspections:
                    print(f"{insp['inspection']}")
                    print(f"  {insp['address']}")
                    print(f"  {insp['url']}")
                    print()
        except:
            print("No favorites saved yet")
        return 0

    # Search properties
    if command == 'search':
        filter_type = sys.argv[2] if len(sys.argv) > 2 else None

        print(f"🔍 Searching Domain.com.au...")
        print(f"📍 Suburbs: Preston, Reservoir, Thomastown, Bundoora, Lalor")
        print(f"💰 Budget: Under $600/week")
        print(f"🛏️  Bedrooms: 2+")
        print()

        # Search each suburb
        all_properties = []
        suburbs = ['preston-vic-3072', 'reservoir-vic-3073', 'thomastown-vic-3077', 'bundoora-vic-3083', 'lalor-vic-3075']

        for suburb in suburbs:
            suburb_code = suburb.split('-')[1]
            print(f"⏳ Searching {COMMUTE_TIMES[suburb]['name']}...", end=' ', flush=True)

            result = subprocess.run(['agent-browser', 'open', f"https://www.domain.com.au/rent/?suburb={suburb}"],
                                  capture_output=True, text=True)

            if result.returncode != 0:
                print(f"❌")
                continue

            temp_file = f"/tmp/rentals-{suburb_code}.json"
            result = subprocess.run(['agent-browser', 'snapshot', '--format', 'json'],
                                  capture_output=True, text=True)

            if result.returncode != 0:
                print(f"❌")
                continue

            with open(temp_file, 'w') as f:
                f.write(result.stdout)

            properties = extract_properties_from_file(temp_file, suburb)
            properties = [p for p in properties if p['price'] <= 600]
            print(f"✓ {len(properties)} found")
            all_properties.extend(properties)

        # Apply smart filter
        if filter_type and filter_type in SMART_FILTERS:
            print(f"\n🎯 Filter: {filter_type}")
            all_properties.sort(key=SMART_FILTERS[filter_type])
            all_properties = all_properties[:10]  # Top 10

        # Display results
        if not all_properties:
            print(f"\n❌ No properties found")
            return 0

        print(f"\n📦 Results: {len(all_properties)} properties")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print()

        for prop in all_properties:
            print(format_property(prop))
            print()

        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"✅ Total: {len(all_properties)} properties")

    return 0

if __name__ == '__main__':
    sys.exit(main())
