#!/usr/bin/env python3
"""
Search Domain.com.au for rental properties in Keon Park
"""
import requests
from bs4 import BeautifulSoup
import json
import time

# Search URL for Keon Park rentals (2+ beds, under $600)
url = "https://www.domain.com.au/rent/?suburb=keon-park-vic-3073&price=under-600&bedrooms=2-plus"

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
}

print(f"Searching: {url}")
print("-" * 80)

try:
    response = requests.get(url, headers=headers, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Content length: {len(response.content)}")

    # Check if we got redirected or if the page doesn't exist
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        # Check if there are results
        results = soup.find_all('a', href=lambda x: x and 'domain.com.au' in x and 'keon-park' in x.lower())

        if not results:
            # Try broader search for Keon Park
            print("\nNo specific results found. Checking for any Keon Park mentions...")
            if 'keon park' in response.text.lower():
                print("Keon Park mentioned on page but no property links found")
            else:
                print("No Keon Park references found on page")

                # Check if it's a suburb that exists
                if 'suburb not found' in response.text.lower() or 'no results' in response.text.lower():
                    print("\n⚠️ Keon Park may not be listed separately on Domain.com.au")
                    print("It might be grouped under Reservoir (3073) or a nearby suburb")

        # Save the raw HTML for inspection
        with open('/Users/ava/.openclaw/workspace/rentals/keon_park_raw.html', 'w') as f:
            f.write(response.text)
        print(f"\nRaw HTML saved to: keon_park_raw.html")

    else:
        print(f"\n⚠️ Unexpected status code: {response.status_code}")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
