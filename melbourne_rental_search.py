#!/usr/bin/env python3
"""
Melbourne Rental Property Search
Scrapes Domain.com.au for rental properties in preferred suburbs
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
import sys

# Preferred suburbs for Melbourne search
SUBURBS = {
    'reservoir': {'postcodes': [3073, 3074, 3075, 3076], 'name': 'Reservoir'},
    'epping': {'postcodes': [3076, 3076], 'name': 'Epping'},
    'lalor': {'postcodes': [3075], 'name': 'Lalor'},
    'thomastown': {'postcodes': [3074], 'name': 'Thomastown'},
    'preston': {'postcodes': [3072], 'name': 'Preston'},
}

SEARCH_CONFIG = {
    'property_type': 'house',  # house, apartment, townhouse, etc.
    'max_price': 650,  # Weekly rent in AUD
    'bedrooms': 3,  # Minimum 3 bedrooms
    'results_per_page': 20
}

def search_domain(suburb, postcode):
    """Search Domain.com.au for rental properties"""

    base_url = "https://www.domain.com.au/rent"

    params = {
        'postcode': postcode,
        'suburb': suburb,
        'sort': 'date-desc',  # Newest first
        'excludedepots': 'true',
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=30)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            properties = []

            # Find property cards
            property_cards = soup.find_all('article', class_='css-1n3w9j')

            for card in property_cards[:SEARCH_CONFIG['results_per_page']]:
                try:
                    # Extract property details
                    title_elem = card.find('h2', class_='css-3y6b0o')
                    price_elem = card.find('span', class_='css-6j5u5q')
                    link_elem = card.find('a', class_='css-1g0w99')

                    if not all([title_elem, price_elem, link_elem]):
                        continue

                    title = title_elem.get_text(strip=True)
                    price = price_elem.get_text(strip=True)
                    link = f"https://www.domain.com.au{link_elem.get('href')}"

                    # Extract address and details
                    address_elem = card.find('p', class_='css-15n9w6')
                    address = address_elem.get_text(strip=True) if address_elem else title

                    # Extract property features
                    features = {}
                    feature_items = card.find_all('span', class_='css-8i5bc2')
                    for item in feature_items:
                        text = item.get_text(strip=True)
                        if 'bed' in text.lower():
                            features['bedrooms'] = text
                        elif 'bath' in text.lower():
                            features['bathrooms'] = text
                        elif 'car' in text.lower():
                            features['parking'] = text

                    property_data = {
                        'title': title,
                        'address': address,
                        'price': price,
                        'link': link,
                        'suburb': suburb,
                        'postcode': postcode,
                        'features': features,
                        'searched_at': datetime.now().isoformat()
                    }

                    properties.append(property_data)

                except Exception as e:
                    print(f"Error parsing property: {e}")
                    continue

            return properties

    except Exception as e:
        print(f"Error searching Domain.com.au: {e}")
        return []

def search_all_suburbs():
    """Search all preferred suburbs"""

    all_results = []

    for suburb_name, suburb_data in SUBURBS.items():
        print(f"Searching {suburb_data['name']}...")

        for postcode in suburb_data['postcodes']:
            properties = search_domain(suburb_name, postcode)

            if properties:
                all_results.extend(properties)

                print(f"  Found {len(properties)} properties in {suburb_data['name']} ({postcode})")

    return all_results

def format_results(results):
    """Format results for display"""

    if not results:
        return "No properties found."

    output = []
    output.append(f"# Melbourne Rental Properties - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    output.append(f"Search completed: {len(results)} properties found\n")

    # Group by suburb
    by_suburb = {}
    for prop in results:
        suburb = prop['suburb']
        if suburb not in by_suburb:
            by_suburb[suburb] = []
        by_suburb[suburb].append(prop)

    for suburb, properties in by_suburb.items():
        output.append(f"\n## {suburb.upper()} ({len(properties)} properties)")

        for i, prop in enumerate(properties[:5], 1):  # Show top 5 per suburb
            output.append(f"\n### {i}. {prop['address']}")
            output.append(f"**Price:** {prop['price']}")
            output.append(f"**Features:** {', '.join(prop['features'].values())}")
            output.append(f"**Link:** {prop['link']}")

        if len(properties) > 5:
            output.append(f"\n*... and {len(properties) - 5} more properties*")

    return '\n'.join(output)

def save_results(results, filename='melbourne_rental_search_results.md'):
    """Save results to markdown file"""

    content = format_results(results)

    with open(filename, 'w') as f:
        f.write(content)

    print(f"\nResults saved to: {filename}")

def main():
    """Main function"""

    print("🏠 Melbourne Rental Property Search")
    print("=" * 50)
    print(f"Searching: {', '.join([s['name'] for s in SUBURBS.values()])}")
    print(f"Max price: ${SEARCH_CONFIG['max_price']}/week")
    print(f"Minimum bedrooms: {SEARCH_CONFIG['bedrooms']}")
    print()

    # Search all suburbs
    results = search_all_suburbs()

    # Save results
    save_results(results)

    # Print summary
    print("\n" + "=" * 50)
    print(f"✅ Complete! Found {len(results)} properties")
    print(f"📄 Results saved to: melbourne_rental_search_results.md")

    return 0

if __name__ == '__main__':
    sys.exit(main())
