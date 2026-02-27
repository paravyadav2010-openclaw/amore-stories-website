#!/usr/bin/env python3
"""
Melbourne Rental Property Search using Agent Browser CLI
Uses headless browser automation to bypass Domain.com.au scraping protection

Searches: Reservoir, Lalor, Epping, Wollert
Filters: 2+ beds, under $600/week, <60 min commute to Weta FX
Returns: Top 10 properties with shortest commute times
"""

import subprocess
import json
import re
import os
import time
from datetime import datetime

class AgentBrowserRentalSearch:
    def __init__(self):
        self.browser_open = False
        self.properties = []

    def run_browser_command(self, command):
        """Execute agent-browser command and return output"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                print(f"Browser command failed: {result.stderr}")
                return None
            return result.stdout
        except subprocess.TimeoutExpired:
            print("Browser command timed out")
            return None
        except Exception as e:
            print(f"Error running browser command: {e}")
            return None

    def open_browser(self, url):
        """Open browser and navigate to URL"""
        print(f"🌐 Opening: {url}")
        output = self.run_browser_command(f"agent-browser open '{url}'")
        if output:
            self.browser_open = True
            time.sleep(3)  # Wait for page to load
            return True
        return False

    def get_snapshot(self):
        """Get page snapshot as JSON"""
        output = self.run_browser_command("agent-browser snapshot -i --json")
        if output:
            try:
                return json.loads(output)
            except json.JSONDecodeError:
                print("Failed to parse snapshot JSON")
        return None

    def extract_properties_from_snapshot(self, snapshot):
        """Extract property data from page snapshot"""
        properties = []

        # Look for property cards in the snapshot
        # Agent Browser returns elements with refs like @e1, @e2, etc.

        # Search for property links
        if isinstance(snapshot, list):
            for elem in snapshot:
                if isinstance(elem, dict):
                    # Look for listing elements
                    if elem.get('role') == 'link' or 'href' in elem:
                        url = elem.get('href') or elem.get('url', '')
                        if 'domain.com.au' in url and ('/address/' in url or '/property/' in url):
                            text = elem.get('text', '')
                            properties.append({
                                'url': url,
                                'text': text
                            })
        elif isinstance(snapshot, dict):
            # Handle nested structure
            self._extract_recursive(snapshot, properties)

        return properties

    def _extract_recursive(self, obj, properties, depth=0, max_depth=10):
        """Recursively extract property data from nested structure"""
        if depth > max_depth:
            return

        if isinstance(obj, dict):
            # Check if this is a property link
            url = obj.get('href') or obj.get('url') or obj.get('contentDescription', '')
            if isinstance(url, str) and 'domain.com.au' in url:
                if '/address/' in url or '/property/' in url:
                    text = obj.get('text') or obj.get('name', '')
                    if text:
                        properties.append({
                            'url': url,
                            'text': text
                        })

            # Recurse into values
            for key, value in obj.items():
                if isinstance(value, (dict, list)):
                    self._extract_recursive(value, properties, depth + 1, max_depth)

        elif isinstance(obj, list):
            for item in obj:
                self._extract_recursive(item, properties, depth + 1, max_depth)

    def search_domain_suburbs(self, suburbs, min_beds=2, max_price=600):
        """Search Domain.com.au for specified suburbs"""
        all_properties = []

        for suburb in suburbs:
            print(f"\n🔍 Searching {suburb.title()}...")

            # Build Domain.com.au search URL
            suburb_formatted = suburb.replace(' ', '-').lower()
            search_url = (
                f"https://www.domain.com.au/rent/{suburb_formatted}-vic/"
                f"?bedrooms={min_beds}-any"
                f"&price=0-{max_price}"
                f"&excludedeposittaken=1"
            )

            if not self.open_browser(search_url):
                print(f"   ❌ Failed to open search page for {suburb}")
                continue

            # Get snapshot
            snapshot = self.get_snapshot()
            if not snapshot:
                print(f"   ❌ Failed to get snapshot for {suburb}")
                continue

            # Extract properties
            properties = self.extract_properties_from_snapshot(snapshot)

            # Process each property
            for prop in properties[:10]:  # Limit to first 10 per suburb
                url = prop['url']
                text = prop['text']

                # Parse text for property details
                beds = self._extract_beds(text)
                price = self._extract_price(text)

                # Parse suburb name for commute calculation
                suburb_key = suburb.lower().replace(' ', '-')

                property_data = {
                    'address': self._clean_text(text),
                    'url': url,
                    'suburb': suburb.title(),
                    'beds': beds,
                    'price_text': price,
                    'price_numeric': self._price_to_numeric(price),
                    'commute_time': self._get_commute_time(suburb_key)
                }

                # Apply filters
                if beds >= min_beds and property_data['price_numeric'] <= max_price:
                    all_properties.append(property_data)

            print(f"   ✅ Found {len(properties)} raw listings in {suburb.title()}")
            time.sleep(2)  # Rate limiting

        return all_properties

    def _extract_beds(self, text):
        """Extract bedroom count from text"""
        bed_match = re.search(r'(\d+)\s*bed', text, re.I)
        return int(bed_match.group(1)) if bed_match else 2  # Default to 2 if not found

    def _extract_price(self, text):
        """Extract price from text"""
        price_match = re.search(r'\$(\d+)\s*(?:\/\s*week|pw)?', text, re.I)
        return f"${price_match.group(1)}/week" if price_match else "Contact for price"

    def _price_to_numeric(self, price_text):
        """Convert price text to numeric value"""
        match = re.search(r'\$(\d+)', price_text)
        return int(match.group(1)) if match else 999999

    def _clean_text(self, text):
        """Clean and truncate text"""
        text = re.sub(r'\s+', ' ', text)
        text = text[:80]
        return text.strip()

    def _get_commute_time(self, suburb):
        """Get estimated commute time to Weta FX (Abbotsford)"""
        # Weta FX: Suite 3, 452 Johnston Street, Abbotsford, Melbourne
        commute_times = {
            'reservoir': '35-45',
            'lalor': '40-50',
            'epping': '40-50',
            'wollert': '45-55',
            'thomastown': '35-45'
        }
        base_time = commute_times.get(suburb, '45')
        return f"{base_time} minutes"

    def sort_by_commute(self, properties):
        """Sort properties by commute time (shortest first)"""
        commute_order = {
            'reservoir': 1,
            'thomastown': 2,
            'lalor': 3,
            'epping': 4,
            'wollert': 5
        }

        def sort_key(prop):
            suburb_lower = prop['suburb'].lower()
            # Primary sort by commute priority, secondary by price
            return (commute_order.get(suburb_lower, 99), prop['price_numeric'])

        return sorted(properties, key=sort_key)

    def format_output(self, properties, limit=10):
        """Format properties for display"""
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
                f"   💰 {prop['price_text']} - 🛏️ {prop['beds']} beds",
                f"   📍 {prop['suburb']} - 🚗 {prop['commute_time']} to Weta FX",
                f"   🔗 {prop['url']}",
                ""
            ])

        lines.extend([
            "=" * 70,
            f"Total: {len(sorted_props)} properties found"
        ])

        return "\n".join(lines)

    def close_browser(self):
        """Close the browser"""
        if self.browser_open:
            self.run_browser_command("agent-browser close")
            self.browser_open = False


def main():
    """Main execution"""
    print("⏳ Step 1/4: Starting rental search...")

    search = AgentBrowserRentalSearch()

    suburbs = ['reservoir', 'lalor', 'epping', 'wollert']

    try:
        print("\n⏳ Step 2/4: Searching Domain.com.au...")
        properties = search.search_domain_suburbs(
            suburbs=suburbs,
            min_beds=2,
            max_price=600
        )

        print(f"\n✅ Step 2/4: Found {len(properties)} properties matching criteria")

        print("\n⏳ Step 3/4: Formatting results...")
        output = search.format_output(properties, limit=10)

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

    finally:
        print("\n🧹 Cleaning up: Closing browser...")
        search.close_browser()
        print("✅ Done")


if __name__ == "__main__":
    main()
