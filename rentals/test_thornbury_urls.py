#!/usr/bin/env python3
"""
Try to find Thornbury rental properties by testing common URL patterns.
Since direct search is blocked, we'll try direct property URL access.
"""

import requests
import re
import time
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
}

# Try a list of known Thornbury streets and some property IDs
# These are based on common streets in Thornbury VIC 3071
test_urls = [
    "https://www.domain.com.au/rent/?suburb=thornbury-vic-3071",
    # Could add specific property URLs if known
]

print("Testing Domain.com.au accessibility...")

for url in test_urls:
    try:
        print(f"\nTrying: {url}")
        response = requests.get(url, headers=headers, timeout=15)
        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            # Try to extract property links
            soup = BeautifulSoup(response.text, 'html.parser')

            # Look for Thornbury property links
            links = soup.find_all('a', href=re.compile(r'thornbury-vic-3071-\d+'))

            print(f"Found {len(links)} Thornbury property links")

            for link in links[:10]:
                href = link.get('href')
                if href:
                    full_url = href if href.startswith('http') else f"https://www.domain.com.au{href}"
                    print(f"  - {full_url}")

        time.sleep(2)  # Be respectful to the server

    except Exception as e:
        print(f"Error: {e}")

print("\nDone.")
