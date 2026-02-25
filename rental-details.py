#!/usr/bin/env python3
"""
Fetch property details from Domain.com.au for rental search results
"""

import requests
import re
import json
from bs4 import BeautifulSoup

def parse_property(html_content, url):
    """Parse property details from Domain HTML"""
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract key info
    price_elem = soup.find(text=re.compile(r'\$\d+ per week'))
    price = price_elem.strip() if price_elem else "N/A"

    # Extract beds, baths, parking
    beds_elem = soup.find(text=re.compile(r'\d+\s*Beds?'))
    baths_elem = soup.find(text=re.compile(r'\d+\s*Baths?'))
    parking_elem = soup.find(text=re.compile(r'\d+\s*Parking'))

    beds = beds_elem.strip() if beds_elem else "N/A"
    baths = baths_elem.strip() if baths_elem else "N/A"
    parking = parking_elem.strip() if parking_elem else "N/A"

    # Extract property type
    type_elem = soup.find(text=re.compile(r'(Townhouse|House|Apartment|Unit|Flat)', re.I))
    property_type = type_elem.strip() if type_elem else "N/A"

    # Extract availability
    available_elem = soup.find(text=re.compile(r'Date Available', re.I))
    available = available_elem.parent.text.strip() if available_elem else "N/A"

    # Extract inspection times
    inspections = []
    inspection_section = soup.find('h2', text=re.compile(r'Inspection', re.I))
    if inspection_section:
        inspection_list = inspection_section.find_next('ul', class_='css-xj3y2b')
        if inspection_list:
            for item in inspection_list.find_all('li'):
                inspections.append(item.text.strip())

    # Extract address
    address_elem = soup.find('h1')
    address = address_elem.text.strip() if address_elem else url

    # Extract suburb from address
    suburb_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+VIC\s+\d+', address)
    suburb = suburb_match.group(1) if suburb_match else "Unknown"

    return {
        'address': address,
        'suburb': suburb,
        'price': price,
        'beds': beds,
        'baths': baths,
        'parking': parking,
        'type': property_type,
        'available': available,
        'inspections': inspections,
        'url': url
    }

def main():
    """Main function"""
    properties = [
        ('https://www.domain.com.au/49-kanangra-terrace-wollert-vic-3750-15072119', '49 Kanangra Terrace, Wollert'),
        ('https://www.domain.com.au/3-31-invermay-street-reservoir-vic-3073-17989133', '3/31 Invermay Street, Reservoir'),
        ('https://www.domain.com.au/3-193-albert-street-reservoir-vic-3073-17987874', '3/193 Albert Street, Reservoir'),
        ('https://www.domain.com.au/4-88a-henty-street-reservoir-vic-3073-18000753', '4/88A Henty Street, Reservoir'),
        ('https://www.domain.com.au/1-17-compton-street-reservoir-vic-3073-17979326', '1/17 Compton Street, Reservoir'),
        ('https://www.domain.com.au/45-cloverfield-crescent-wollert-vic-3750-18000695', '45 Cloverfield Crescent, Wollert'),
        ('https://www.domain.com.au/4-56-king-william-street-reservoir-vic-3073-17995449', '4/56 King William Street, Reservoir'),
    ]

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }

    results = []

    for url, name in properties:
        try:
            print(f"Fetching: {name}")
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                details = parse_property(response.text, url)
                results.append(details)
                print(f"  ✓ {details['price']} - {details['beds']}")
            else:
                print(f"  ✗ Status {response.status_code}")
        except Exception as e:
            print(f"  ✗ Error: {e}")

    # Print results
    print("\n" + "="*80)
    print("MELBOURNE RENTAL PROPERTIES SUMMARY")
    print("="*80)

    # Sort by price (extract numeric value)
    def extract_price(prop):
        match = re.search(r'\$(\d+)', prop['price'])
        return int(match.group(1)) if match else 9999

    results.sort(key=extract_price)

    for i, prop in enumerate(results, 1):
        print(f"\n{i}. {prop['address']} - {prop['price']} - {prop['beds']}/{prop['baths']}/{prop['parking']} - {prop['type']}")
        print(f"   {prop['url']}")
        print(f"   📍 Suburb: {prop['suburb']}")
        print(f"   ✅ Available: {prop['available']}")

        # Estimate commute to Abbotsford (based on suburb)
        commute_times = {
            'Wollert': '65-75 minutes',
            'Reservoir': '38-50 minutes',
            'Epping': '45-55 minutes',
            'South Morang': '55-65 minutes'
        }
        print(f"   🚗 Commute to Abbotsford: {commute_times.get(prop['suburb'], 'Unknown')}")

        if prop['inspections']:
            print(f"   👀 Inspections:")
            for inspection in prop['inspections']:
                print(f"      • {inspection}")
        else:
            print(f"   👀 Inspections: Contact agent")

if __name__ == '__main__':
    main()
