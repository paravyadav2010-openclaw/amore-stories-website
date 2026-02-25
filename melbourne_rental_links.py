#!/usr/bin/env python3
"""
Melbourne Rental Property Search Links
Generates direct search links for Melbourne rental properties
"""

from datetime import datetime

# Preferred suburbs with postcodes
SUBURBS = {
    'reservoir': {
        'name': 'Reservoir',
        'postcode': 3073,
        'domain_url': 'https://www.domain.com.au/rent/reservoir-vic-3073?sort=date-desc',
        'realestate_url': 'https://www.realestate.com.au/rent/in-reservoir+vic-3073/list-1?source=location-search'
    },
    'epping': {
        'name': 'Epping',
        'postcode': 3076,
        'domain_url': 'https://www.domain.com.au/rent/epping-vic-3076?sort=date-desc',
        'realestate_url': 'https://www.realestate.com.au/rent/in-epping+vic-3076/list-1?source=location-search'
    },
    'lalor': {
        'name': 'Lalor',
        'postcode': 3075,
        'domain_url': 'https://www.domain.com.au/rent/lalor-vic-3075?sort=date-desc',
        'realestate_url': 'https://www.realestate.com.au/rent/in-lalor+vic-3075/list-1?source=location-search'
    },
    'wollert': {
        'name': 'Wollert',
        'postcode': 3750,
        'domain_url': 'https://www.domain.com.au/rent/wollert-vic-3750?sort=date-desc',
        'realestate_url': 'https://www.realestate.com.au/rent/in-wollert+vic-3750/list-1?source=location-search'
    },
    'thomastown': {
        'name': 'Thomastown',
        'postcode': 3074,
        'domain_url': 'https://www.domain.com.au/rent/thomastown-vic-3074?sort=date-desc',
        'realestate_url': 'https://www.realestate.com.au/rent/in-thomastown+vic-3074/list-1?source=location-search'
    },
    'preston': {
        'name': 'Preston',
        'postcode': 3072,
        'domain_url': 'https://www.domain.com.au/rent/preston-vic-3072?sort=date-desc',
        'realestate_url': 'https://www.realestate.com.au/rent/in-preston+vic-3072/list-1?source=location-search'
    },
}

SEARCH_FILTERS = {
    'houses_3br': '&bedrooms=3&propertyTypes=house',
    'houses_4br': '&bedrooms=4&propertyTypes=house',
    'under_650': '&price=0-650',
    'under_700': '&price=0-700',
    'under_750': '&price=0-750',
}

def generate_search_links():
    """Generate direct search links"""

    results = []

    for suburb_key, suburb_data in SUBURBS.items():
        results.append({
            'suburb': suburb_data['name'],
            'postcode': suburb_data['postcode'],
            'domain_search': suburb_data['domain_url'],
            'domain_houses_3br_under_650': f"{suburb_data['domain_url']}{SEARCH_FILTERS['houses_3br']}{SEARCH_FILTERS['under_650']}",
            'realestate_search': suburb_data['realestate_url'],
        })

    return results

def format_results(results):
    """Format results as markdown"""

    output = []
    output.append(f"# Melbourne Rental Property Search Links")
    output.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} AEDT\n")

    output.append("## Quick Links by Suburb\n")
    output.append("*Click any link below to view available rental properties*\n")

    for i, result in enumerate(results, 1):
        output.append(f"\n### {i}. {result['suburb']} (VIC {result['postcode']})")
        output.append("\n**Domain.com.au**")
        output.append(f"- [All Properties]({result['domain_search']})")
        output.append(f"- [Houses 3BR under $650/week]({result['domain_houses_3br_under_650']})")
        output.append("\n**Realestate.com.au**")
        output.append(f"- [All Properties]({result['realestate_search']})")

    # Add combined search link
    output.append("\n---\n")
    output.append("## Combined Search Links\n")

    all_domain = "https://www.domain.com.au/rent/melbourne-region-vic?suburbs=reservoir,epping,lalor,wollert,thomastown,preston&sort=date-desc&bedrooms=3&price=0-650"
    output.append(f"- **All Suburbs - Domain**: [Houses 3BR under $650]({all_domain})")

    output.append("\n## Search Filters\n")
    output.append("To modify these searches, add these filters to any URL:")
    output.append("| Filter | URL Parameter |")
    output.append("|--------|---------------|")
    output.append("| 3 Bedrooms | `&bedrooms=3` |")
    output.append("| 4 Bedrooms | `&bedrooms=4` |")
    output.append("| Under $650/week | `&price=0-650` |")
    output.append("| Under $700/week | `&price=0-700` |")
    output.append("| Under $750/week | `&price=0-750` |")
    output.append("| Houses only | `&propertyTypes=house` |")
    output.append("| Townhouses only | `&propertyTypes=townhouse` |")
    output.append("| Apartments only | `&propertyTypes=apartment%2Cunit` |")

    return '\n'.join(output)

def main():
    """Main function"""

    results = generate_search_links()

    content = format_results(results)

    # Save to file
    filename = 'melbourne_rental_search_links.md'
    with open(filename, 'w') as f:
        f.write(content)

    print(f"🏠 Melbourne Rental Search Links Generated")
    print("=" * 60)
    print(f"✅ {len(results)} suburbs configured")
    print(f"📄 Results saved to: {filename}")
    print()
    print("🔍 Click any link to view properties:")
    print()

    for i, result in enumerate(results, 1):
        print(f"{i}. {result['suburb']} (VIC {result['postcode']})")
        print(f"   Domain: {result['domain_houses_3br_under_650']}")
        print(f"   RE:   {result['realestate_search']}")
        print()

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main())
