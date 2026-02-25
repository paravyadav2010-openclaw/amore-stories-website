#!/usr/bin/env python3
"""
Find Domain.com.au property IDs for specific addresses.
"""
import subprocess
import re
import sys
import time

def search_property(browser_cmd, suburb, address_terms):
    """Search for a property using agent-browser."""
    search_url = f'https://www.domain.com.au/rent/{suburb}/?keywords={address_terms}&excludedeposittaken=1'

    # Open search page
    result = subprocess.run(
        browser_cmd.split(),
        capture_output=True,
        text=True
    )

    # Take snapshot
    time.sleep(2)  # Wait for page to load
    snapshot_result = subprocess.run(
        'agent-browser snapshot --json'.split(),
        capture_output=True,
        text=True
    )

    return snapshot_result.stdout

def parse_property_urls(snapshot_json):
    """Extract property URLs from snapshot JSON."""
    urls = []

    # Look for /url fields in the JSON
    for line in snapshot_json.split('\n'):
        if '"url"' in line and 'domain.com.au' in line:
            # Extract the URL
            match = re.search(r'https://www\.domain\.com\.au/[^"]+', line)
            if match:
                url = match.group(0)
                if url not in urls and len(url) > 50:  # Skip short URLs
                    urls.append(url)

    return urls

def main():
    properties = [
        {
            "name": "3/430 Murray Road, Preston ($400/wk)",
            "suburb": "preston-vic-3072",
            "address": "430-murray-road"
        },
        {
            "name": "1 Davis Street, Preston ($450/wk)",
            "suburb": "preston-vic-3072",
            "address": "davis-street"
        },
        {
            "name": "28 Buller Parade, Lalor ($420/wk)",
            "suburb": "lalor-vic-3075",
            "address": "28-buller-parade"
        },
        {
            "name": "10/25 Newton Crescent, Lalor ($440/wk)",
            "suburb": "lalor-vic-3075",
            "address": "10-25-newton-crescent"
        }
    ]

    # Already found from earlier:
    found_properties = {
        "3/12 Dalgety Street, Preston ($430/wk)": "https://www.domain.com.au/3-12-dalgety-street-preston-vic-3072-17998563"
    }

    print("🔍 Searching for property IDs...\n")

    for prop in properties:
        print(f"⏳ Searching: {prop['name']}")

        # Open search page
        search_url = f"https://www.domain.com.au/rent/{prop['suburb']}/?keywords={prop['address']}&excludedeposittaken=1"
        result = subprocess.run(
            ['agent-browser', 'open', search_url],
            capture_output=True,
            text=True
        )

        print(f"  ✓ Opened search page")

        # Take snapshot
        time.sleep(3)
        snapshot_result = subprocess.run(
            ['agent-browser', 'snapshot', '--json'],
            capture_output=True,
            text=True
        )

        # Parse for URLs
        snapshot_output = snapshot_result.stdout
        urls = []

        # Look for property links in the snapshot
        pattern = r'https://www\.domain\.com\.au/[a-z0-9\-]+-preston-vic-3072-[0-9]+'
        matches = re.findall(pattern, snapshot_output, re.IGNORECASE)

        if matches:
            urls.extend(matches)

        pattern2 = r'https://www\.domain\.com\.au/[a-z0-9\-]+-lalor-vic-3075-[0-9]+'
        matches2 = re.findall(pattern2, snapshot_output, re.IGNORECASE)
        if matches2:
            urls.extend(matches2)

        # Remove duplicates
        urls = list(set(urls))

        if urls:
            print(f"  ✅ Found {len(urls)} potential URL(s):")
            for url in urls[:3]:  # Show first 3
                print(f"     - {url}")
            found_properties[prop['name']] = urls[0]
        else:
            print(f"  ❌ No URLs found")

        print()

    # Add the known property
    print("✅ ALREADY FOUND:")
    print(f"   3/12 Dalgety Street, Preston ($430/wk)")
    print(f"   https://www.domain.com.au/3-12-dalgety-street-preston-vic-3072-17998563")
    print()

    # Summary
    print("=" * 60)
    print("FINAL RESULTS - EXACT PROPERTY URLs")
    print("=" * 60)

    all_properties = [
        "3/430 Murray Road, Preston ($400/wk, shortest commute)",
        "3/12 Dalgety Street, Preston ($430/wk, shortest commute)",
        "1 Davis Street, Preston ($450/wk, shortest commute)",
        "28 Buller Parade, Lalor ($420/wk, cheapest)",
        "10/25 Newton Crescent, Lalor ($440/wk, cheapest)"
    ]

    for prop_name in all_properties:
        # Match the name to found_properties
        found = False
        for key, url in found_properties.items():
            if key.split('(')[0].strip() in prop_name or key in prop_name:
                print(f"\n{prop_name}")
                print(f"🔗 {url}")
                found = True
                break
        if not found:
            print(f"\n{prop_name}")
            print(f"❌ NOT FOUND")

if __name__ == '__main__':
    main()
