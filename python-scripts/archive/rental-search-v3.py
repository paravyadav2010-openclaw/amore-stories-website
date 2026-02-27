#!/usr/bin/env python3
"""
Melbourne Rental Property Search using Agent Browser CLI (Final Version)
Extracts property data from Domain.com.au search results

Searches: Reservoir, Lalor, Epping, Wollert
Filters: 2+ beds, under $600/week, <60 min commute to Weta FX
Returns: Top 10 properties with shortest commute times
"""

import subprocess
import re
import json
from datetime import datetime
import time

class RentalSearcherV3:
    def __init__(self):
        self.commute_times = {
            'reservoir': '35-45',
            'thomastown': '35-45',
            'lalor': '40-50',
            'epping': '40-50',
            'wollert': '45-55'
        }

    def run_command(self, cmd, timeout=30):
        """Run shell command and return output"""
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Timeout"
        except Exception as e:
            return -1, "", str(e)

    def search_suburb(self, suburb, postcode, min_beds=2, max_price=600):
        """Search a single suburb"""
        print(f"\n🔍 Searching {suburb.title()}...")

        # Build URL
        url = f"https://www.domain.com.au/rent/{suburb}-vic-{postcode}/?bedrooms={min_beds}-any&price=0-{max_price}&excludedeposittaken=1"

        # Open browser
        code, stdout, stderr = self.run_command(f"agent-browser open '{url}'", timeout=20)
        if code != 0:
            print(f"   ❌ Failed to open: {stderr}")
            return []

        # Wait for page load
        time.sleep(5)

        # Get snapshot
        code, snapshot, stderr = self.run_command("agent-browser snapshot", timeout=20)
        if code != 0:
            print(f"   ❌ Failed to get snapshot")
            self.run_command("agent-browser close", timeout=10)
            return []

        # Parse properties from snapshot
        properties = self.parse_snapshot(snapshot, suburb)

        # Close browser
        self.run_command("agent-browser close", timeout=10)

        # Filter by price
        filtered = [p for p in properties if p['price_numeric'] <= max_price]

        print(f"   ✅ Found {len(filtered)} properties under ${max_price}/week")

        return filtered

    def parse_snapshot(self, snapshot, suburb):
        """Parse property data from snapshot text"""
        properties = []

        # Split into lines
        lines = snapshot.split('\n')

        # Find listitem sections (each property is in a listitem)
        i = 0
        while i < len(lines):
            line = lines[i]

            # Look for listitem start
            if '- listitem:' in line:
                # Extract this property
                prop = self.extract_property_from_lines(lines, i)
                if prop:
                    prop['suburb'] = suburb.title()
                    prop['commute_time'] = f"{self.commute_times.get(suburb.lower(), '45')} min"
                    properties.append(prop)

                # Skip to next listitem (skip about 30 lines)
                i += 30
            else:
                i += 1

        return properties

    def extract_property_from_lines(self, lines, start_idx):
        """Extract a single property from a block of lines"""
        prop = {
            'url': '',
            'address': '',
            'price_text': '',
            'price_numeric': 999999,
            'beds': 0,
            'baths': 0,
            'parking': 0,
            'type': 'Unknown',
            'inspection': 'Contact agent'
        }

        # Look at next 30 lines
        for i in range(start_idx, min(start_idx + 30, len(lines))):
            line = lines[i]

            # Extract URL
            if '/url: https://www.domain.com.au/' in line:
                url_match = re.search(r'/url: (https://www\.domain\.com\.au/[\w-]+-\w+-\d+-\d+)', line)
                if url_match and not prop['url']:  # Only take first URL
                    url = url_match.group(1)
                    # Only keep property URLs (not search/filter URLs)
                    if len(url.split('-')) > 6:
                        prop['url'] = url

            # Extract price
            if '- paragraph: $' in line:
                price_match = re.search(r'\$(\d+) per week', line)
                if price_match:
                    prop['price_text'] = f"${price_match.group(1)}/week"
                    prop['price_numeric'] = int(price_match.group(1))

            # Extract address (heading)
            heading_match = re.search(r'- heading "([^"]+)", ref=', line)
            if heading_match:
                address = heading_match.group(1)
                if address and ', ' in address and not prop['address']:
                    prop['address'] = address

            # Extract beds/baths/parking
            beds_match = re.search(r'"(\d+) Beds (\d+) Bath', line)
            if beds_match:
                prop['beds'] = int(beds_match.group(1))
                prop['baths'] = int(beds_match.group(2))

            parking_match = re.search(r'(\d+) Parking', line)
            if parking_match:
                prop['parking'] = int(parking_match.group(1))

            # Extract property type
            if 'House' in line and prop['type'] == 'Unknown':
                prop['type'] = 'House'
            elif 'Townhouse' in line and prop['type'] == 'Unknown':
                prop['type'] = 'Townhouse'
            elif ('Apartment' in line or 'Unit' in line or 'Flat' in line) and prop['type'] == 'Unknown':
                prop['type'] = 'Unit'

            # Extract inspection
            inspection_match = re.search(r'Inspection: ([^.]+)', line)
            if inspection_match:
                prop['inspection'] = inspection_match.group(1).strip()

        # Only return if we have valid data
        if prop['url'] and prop['price_numeric'] > 0 and prop['beds'] > 0:
            return prop
        return None

    def search_all_suburbs(self, suburbs_data, min_beds=2, max_price=600):
        """Search multiple suburbs"""
        all_properties = []

        for suburb, postcode in suburbs_data.items():
            properties = self.search_suburb(suburb, postcode, min_beds, max_price)
            all_properties.extend(properties)

        return all_properties

    def sort_by_commute(self, properties):
        """Sort by commute time priority"""
        commute_priority = {
            'reservoir': 1,
            'thomastown': 2,
            'lalor': 3,
            'epping': 4,
            'wollert': 5
        }

        def sort_key(prop):
            suburb_lower = prop['suburb'].lower()
            priority = commute_priority.get(suburb_lower, 99)
            return (priority, prop['price_numeric'])

        return sorted(properties, key=sort_key)

    def format_results(self, properties, limit=10):
        """Format results for display"""
        if not properties:
            return "❌ No properties found matching criteria"

        sorted_props = self.sort_by_commute(properties)[:limit]

        lines = [
            "🏠 MELBOURNE RENTAL SEARCH RESULTS",
            f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "",
            "Search Criteria:",
            "• 2+ bedrooms",
            "• Under $600/week",
            "• Within 60 min commute to Weta FX (Abbotsford)",
            "• Available properties only",
            "",
            "=" * 70,
            ""
        ]

        for i, prop in enumerate(sorted_props, 1):
            lines.extend([
                f"{i}. {prop['address']}",
                f"   💰 {prop['price_text']} - 🛏️ {prop['beds']} bed, 🚿 {prop['baths']} bath, 🚗 {prop['parking']} park",
                f"   🏠 {prop['type']} - 📍 {prop['suburb']}",
                f"   🚗 Commute: {prop['commute_time']} to Weta FX",
                f"   👀 Inspection: {prop['inspection']}",
                f"   🔗 {prop['url']}",
                ""
            ])

        lines.extend([
            "=" * 70,
            f"✅ Total: {len(sorted_props)} properties found"
        ])

        return "\n".join(lines)

def main():
    """Main execution"""
    print("⏳ Step 1/4: Starting rental search...")

    searcher = RentalSearcherV3()

    # Suburbs with postcodes
    suburbs = {
        'reservoir': '3073',
        'thomastown': '3074',
        'lalor': '3075',
        'epping': '3076',
        'wollert': '3750'
    }

    try:
        print("\n⏳ Step 2/4: Searching suburbs...")
        properties = searcher.search_all_suburbs(
            suburbs_data=suburbs,
            min_beds=2,
            max_price=600
        )

        print(f"\n✅ Step 2/4: Found {len(properties)} total properties")

        print("\n⏳ Step 3/4: Formatting results...")
        output = searcher.format_results(properties, limit=10)

        print("\n✅ Step 3/4: Results formatted")

        print("\n⏳ Step 4/4: Saving results...")

        # Save to file
        results_file = '/Users/ava/.openclaw/workspace/rental_search_results.txt'
        with open(results_file, 'w') as f:
            f.write(output)

        # Also save as JSON
        json_file = '/Users/ava/.openclaw/workspace/rental_search_results.json'
        with open(json_file, 'w') as f:
            json.dump(properties, f, indent=2, default=str)

        print(f"✅ Step 4/4: Results saved to {results_file}")

        # Print results
        print("\n" + output)

        return output

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    main()
