#!/usr/bin/env python3
import requests
import json
import re
from bs4 import BeautifulSoup

# Headers to mimic real browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Domain.com.au search URL for Thornbury
url = "https://www.domain.com.au/rent/?suburb=thornbury-vic-3071&bedrooms=2-&price=0-600&sort=date-desc"

print(f"Fetching: {url}")

try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Content length: {len(response.content)}")

    # Save HTML for analysis
    with open('/Users/ava/.openclaw/workspace/rentals/thornbury_page.html', 'w', encoding='utf-8') as f:
        f.write(response.text)

    # Parse HTML
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find property listings
    properties = []

    # Look for property cards - Domain uses data-testid attributes
    property_links = soup.find_all('a', href=re.compile(r'domain\.com\.au/.*-thornbury-vic-3071-\d+'))

    print(f"\nFound {len(property_links)} property links")

    for link in property_links[:20]:  # Limit to first 20
        href = link.get('href')
        if href and 'thornbury-vic-3071' in href:
            full_url = href if href.startswith('http') else f"https://www.domain.com.au{href}"
            properties.append(full_url)

    # Extract property details from the page
    print("\nProperty URLs found:")
    for i, prop_url in enumerate(set(properties), 1):
        print(f"{i}. {prop_url}")

    # Save to JSON
    with open('/Users/ava/.openclaw/workspace/rentals/thornbury_properties.json', 'w') as f:
        json.dump(list(set(properties)), f, indent=2)

    print(f"\nSaved {len(set(properties))} unique property URLs to /Users/ava/.openclaw/workspace/rentals/thornbury_properties.json")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
