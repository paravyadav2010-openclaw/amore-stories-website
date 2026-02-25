#!/usr/bin/env python3
"""
Search Domain.com.au for Melbourne rental properties
Fetches actual property listings with direct links
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
import json

# Suburbs with their Domain.com.au search URLs
SUBURB_URLS = {
    'reservoir': 'https://www.domain.com.au/rent/reservoir-vic-3073?sort=date-desc',
    'epping': 'https://www.domain.com.au/rent/epping-vic-3076?sort=date-desc',
    'lalor': 'https://www.domain.com.au/rent/lalor-vic-3075?sort=date-desc',
    'wollert': 'https://www.domain.com.au/rent/wollert-vic-3750?sort=date-desc',
    'thomastown': 'https://www.domain.com.au/rent/thomastown-vic-3074?sort=date-desc',
    'preston': 'https://www.domain.com.au/rent/preston-vic-3072?sort=date-desc',
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def scrape_domain_properties(suburb, url):
    """Scrape property listings from Domain.com.au"""

    print(f"  Searching {suburb}...")

    try:
        response = requests.get(url, headers=HEADERS, timeout=30)

        if response.status_code != 200:
            print(f"    Error: HTTP {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        properties = []

        # Find property listing cards - try multiple selectors
        selectors = [
            'article',
            'div[data-testid="listing-card"]',
            'a[href*="/address/"]',
        ]

        all_cards = []
        for selector in selectors:
            cards = soup.select(selector)
            if cards:
                all_cards = cards
                break

        for card in all_cards[:10]:  # Get first 10 properties
            try:
                # Extract property link
                link_elem = card.find('a', href=True) or card
                link = link_elem.get('href', '') if isinstance(link_elem, dict) else link_elem.get('href', '')

                if not link.startswith('http'):
                    link = f"https://www.domain.com.au{link}"

                # Extract title/address
                title_elem = card.find(['h2', 'h3', 'h4'], class_=lambda x: x and any('css-' in str(x.get('class', [])) for _ in x.get('class', [])))
                if not title_elem:
                    title_elem = card.find(['h2', 'h3', 'h4'])

                title = title_elem.get_text(strip=True) if title_elem else "Property"

                # Extract price
                price_elem = card.find(string=re.compile(r'\$'))
                price = price_elem.get_text(strip=True) if price_elem else "Price not listed"

                # Extract features (bedrooms, bathrooms, parking)
                features = []
                feature_pattern = re.compile(r'(\d+)\s+(bed|bath|car)', re.IGNORECASE)
                feature_matches = feature_pattern.findall(str(card))
                features = feature_matches

                # Extract suburb and postcode from URL
                suburb_upper = suburb.upper()

                property_data = {
                    'title': title[:80],  # Truncate long titles
                    'address': title[:100],
                    'price': price,
                    'link': link,
                    'suburb': suburb_upper,
                    'features': ', '.join([f"{n} {t}" for n, t in features]),
                    'searched_at': datetime.now().isoformat()
                }

                properties.append(property_data)

            except Exception as e:
                continue

        print(f"    Found {len(properties)} properties")
        return properties

    except Exception as e:
        print(f"    Error scraping {suburb}: {e}")
        return []

def format_results(all_properties):
    """Format results for display"""

    if not all_properties:
        return "No properties found."

    output = []
    output.append(f"# Melbourne Rental Properties")
    output.append(f"Searched at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S AEDT')}")
    output.append(f"Total properties found: {len(all_properties)}\n")

    # Group by suburb
    by_suburb = {}
    for prop in all_properties:
        suburb = prop['suburb']
        if suburb not in by_suburb:
            by_suburb[suburb] = []
        by_suburb[suburb].append(prop)

    # Display by suburb
    for suburb, properties in by_suburb.items():
        output.append(f"\n## {suburb} ({len(properties)} properties)\n")

        for i, prop in enumerate(properties, 1):
            output.append(f"### {i}. {prop['address']}")
            output.append(f"**Price:** {prop['price']}")
            if prop['features']:
                output.append(f"**Features:** {prop['features']}")
            output.append(f"**🔗 Direct Link:** {prop['link']}")
            output.append("")

    return '\n'.join(output)

def main():
    """Main function"""

    print("🏠 Searching Melbourne Rental Properties")
    print("=" * 60)
    print(f"Suburbs: {', '.join([s.title() for s in SUBURB_URLS.keys()])}")
    print()

    all_properties = []

    # Search each suburb
    for suburb, url in SUBURB_URLS.items():
        properties = scrape_domain_properties(suburb, url)
        if properties:
            all_properties.extend(properties)

    # Format and save results
    if all_properties:
        formatted = format_results(all_properties)

        # Save to file
        filename = 'melbourne_rental_properties_found.md'
        with open(filename, 'w') as f:
            f.write(formatted)

        # Print to console
        print(formatted)

        print("\n" + "=" * 60)
        print(f"✅ Search Complete!")
        print(f"📄 Results saved to: {filename}")
        print(f"🔗 Found {len(all_properties)} property listings with direct links")

        # Print quick links summary
        print("\n🚀 Quick Links (first 20):")
        for i, prop in enumerate(all_properties[:20], 1):
            print(f"{i}. {prop['link']}")

    else:
        print("\n❌ No properties found")

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main())
