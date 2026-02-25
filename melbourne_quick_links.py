#!/usr/bin/env python3
"""
Quick Melbourne Rental Property Links
Direct links to Domain.com.au search results for your preferred suburbs
"""

from datetime import datetime

# Direct search URLs for each suburb with filters
PROPERTIES = {
    'Reservoir (VIC 3073)': {
        'all': 'https://www.domain.com.au/rent/reservoir-vic-3073?sort=date-desc',
        'houses_3br_under_650': 'https://www.domain.com.au/rent/reservoir-vic-3073?sort=date-desc&bedrooms=3&propertyTypes=house&price=0-650',
    },
    'Epping (VIC 3076)': {
        'all': 'https://www.domain.com.au/rent/epping-vic-3076?sort=date-desc',
        'houses_3br_under_650': 'https://www.domain.com.au/rent/epping-vic-3076?sort=date-desc&bedrooms=3&propertyTypes=house&price=0-650',
    },
    'Lalor (VIC 3075)': {
        'all': 'https://www.domain.com.au/rent/lalor-vic-3075?sort=date-desc',
        'houses_3br_under_650': 'https://www.domain.com.au/rent/lalor-vic-3075?sort=date-desc&bedrooms=3&propertyTypes=house&price=0-650',
    },
    'Wollert (VIC 3750)': {
        'all': 'https://www.domain.com.au/rent/wollert-vic-3750?sort=date-desc',
        'houses_3br_under_650': 'https://www.domain.com.au/rent/wollert-vic-3750?sort=date-desc&bedrooms=3&propertyTypes=house&price=0-650',
    },
    'Thomastown (VIC 3074)': {
        'all': 'https://www.domain.com.au/rent/thomastown-vic-3074?sort=date-desc',
        'houses_3br_under_650': 'https://www.domain.com.au/rent/thomastown-vic-3074?sort=date-desc&bedrooms=3&propertyTypes=house&price=0-650',
    },
    'Preston (VIC 3072)': {
        'all': 'https://www.domain.com.au/rent/preston-vic-3072?sort=date-desc',
        'houses_3br_under_650': 'https://www.domain.com.au/rent/preston-vic-3072?sort=date-desc&bedrooms=3&propertyTypes=house&price=0-650',
    },
}

def main():
    """Display property search links"""

    print("🏠 Melbourne Rental Property Search Links")
    print("=" * 70)
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S AEDT')}")
    print()

    print("🔍 Click any link below to see available properties\n")

    for i, (suburb_name, links) in enumerate(PROPERTIES.items(), 1):
        print(f"\n{i}. {suburb_name}")
        print("-" * 70)
        print(f"   🏠 All Properties:")
        print(f"      {links['all']}")
        print(f"\n   🏠 Houses (3BR) under $650/week:")
        print(f"      {links['houses_3br_under_650']}")
        print()

    print("=" * 70)
    print()
    print("📝 Notes:")
    print("   • Links are filtered for houses with 3+ bedrooms")
    print("   • Max price: $650/week")
    print("   • Results sorted by newest first")
    print("   • Direct Domain.com.au listings")
    print()
    print("💡 Tip: These links show real-time available properties!")
    print("💡 Tip: Use browser extensions to filter further")

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main())
