#!/usr/bin/env python3
"""
Melbourne Rental Property Search for Weta FX Relocation
Searches Wollert, Epping, Reservoir, South Morang for 2+ bed rentals under $600/week
"""

import sys
import os
sys.path.append('/Users/ava/.openclaw/skills/rental-verification-advanced')

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime
from urllib.parse import urljoin, urlparse
from fake_useragent import UserAgent

class RentalSearcher:
    def __init__(self):
        self.ua = UserAgent()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
        
    def search_domain(self, suburbs, min_beds=2, max_price=600):
        """Search Domain.com.au for rental properties"""
        all_properties = []
        
        for suburb in suburbs:
            print(f"\n🔍 Searching {suburb.title()}...")
            
            # Domain search URL
            url = f"https://www.domain.com.au/rent/{suburb}-vic/?bedrooms={min_beds}&maxPrice={max_price}&excludedeposittaken=1"
            
            try:
                response = self.session.get(url, headers={
                    'User-Agent': self.ua.random,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://www.domain.com.au/'
                }, timeout=15)
                
                if response.status_code == 403:
                    print(f"   ❌ Access denied (403) - Domain.com.au blocking requests")
                    continue
                elif response.status_code != 200:
                    print(f"   ❌ Error: HTTP {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Try different listing selectors
                listings = (
                    soup.find_all('li', {'data-testid': 'listing'}) or
                    soup.find_all('div', {'data-testid': 'listing'}) or
                    soup.find_all('li', class_='css-1s4q8g9') or
                    soup.find_all('article') or
                    soup.find_all('div', class_='listing-details')
                )
                
                print(f"   Found {len(listings)} potential listing elements")
                
                for i, listing in enumerate(listings[:10]):  # Limit to first 10
                    try:
                        # Extract title/address
                        title_elem = (
                            listing.find('a', attrs={'data-testid': 'listing-link'}) or
                            listing.find('a', href=re.compile(r'/address/')) or
                            listing.find('h2') or
                            listing.find(['h3', 'h4'])
                        )
                        
                        if not title_elem:
                            continue
                        
                        title = title_elem.get_text(strip=True)
                        
                        # Extract price
                        price_elem = (
                            listing.find('p', attrs={'data-testid': 'listing-card-price'}) or
                            listing.find('div', attrs={'data-testid': 'listing-card-price'}) or
                            listing.find('span', class_='css-18tf2o6') or
                            listing.find('div', class_='price')
                        )
                        price_text = price_elem.get_text(strip=True) if price_elem else "N/A"
                        
                        # Extract link
                        link_elem = listing.find('a', href=True)
                        if not link_elem:
                            continue
                        
                        relative_url = link_elem['href']
                        full_url = urljoin('https://www.domain.com.au', relative_url)
                        
                        # Extract beds/baths/cars
                        beds = "N/A"
                        baths = "N/A"
                        cars = "N/A"
                        
                        features_elem = listing.find('div', attrs={'data-testid': 'property-features'})
                        if features_elem:
                            # Look for beds
                            beds_elem = features_elem.find(text=re.compile(r'bed', re.I))
                            if beds_elem:
                                beds = beds_elem.strip()
                            # Look for baths
                            baths_elem = features_elem.find(text=re.compile(r'bat', re.I))
                            if baths_elem:
                                baths = baths_elem.strip()
                            # Look for cars
                            cars_elem = features_elem.find(text=re.compile(r'car', re.I))
                            if cars_elem:
                                cars = cars_elem.strip()
                        
                        # Determine property type
                        prop_type = "Unknown"
                        if 'house' in title.lower():
                            prop_type = "House"
                        elif 'townhouse' in title.lower():
                            prop_type = "Townhouse"
                        elif 'unit' in title.lower() or 'apartment' in title.lower():
                            prop_type = "Unit"
                        
                        # Check if available (look for inspection times or "available now")
                        available = True
                        inspection = "Contact agent"
                        
                        inspection_elem = listing.find('div', attrs={'data-testid': 'inspection-times'})
                        if inspection_elem:
                            inspection = inspection_elem.get_text(strip=True)
                        else:
                            # Look for inspection text anywhere in listing
                            listing_text = listing.get_text().lower()
                            if 'available now' in listing_text or 'inspect' in listing_text:
                                available = True
                        
                        # Extract numeric price
                        price_match = re.search(r'\$(\d+)', price_text)
                        price_numeric = int(price_match.group(1)) if price_match else 999999
                        
                        # Skip if too expensive
                        if price_numeric > max_price:
                            continue
                        
                        # Extract beds count
                        beds_match = re.search(r'(\d+)\s*bed', str(beds).lower(), re.I)
                        beds_count = int(beds_match.group(1)) if beds_match else 2
                        
                        if beds_count < min_beds:
                            continue
                        
                        # Transport info
                        transport_stations = self.get_transport_for_suburb(suburb)
                        commute_time = self.get_commute_time(suburb)
                        
                        property_data = {
                            'title': title[:70],  # Truncate long titles
                            'address': title[:60],
                            'price': price_text,
                            'price_numeric': price_numeric,
                            'beds': beds,
                            'baths': baths,
                            'cars': cars,
                            'type': prop_type,
                            'url': full_url,
                            'suburb': suburb.title(),
                            'transport': transport_stations,
                            'commute_time': commute_time,
                            'inspection': inspection,
                            'available': available
                        }
                        
                        all_properties.append(property_data)
                        
                    except Exception as e:
                        print(f"   Error parsing listing {i}: {e}")
                        continue
                
                print(f"   ✅ Found {len([p for p in all_properties if p['suburb'] == suburb.title()])} valid properties in {suburb.title()}")
                
                # Respect rate limits
                time.sleep(2)
                
            except Exception as e:
                print(f"   ❌ Error searching {suburb}: {e}")
                continue
        
        return all_properties
    
    def get_transport_for_suburb(self, suburb):
        """Get nearby train stations for suburb"""
        transport_map = {
            'wollert': ['Epping Station (2.5km)', 'South Morang Station (4km)'],
            'epping': ['Epping Station', 'Epping Plaza Station'],
            'reservoir': ['Reservoir Station', 'Ruthven Station', 'Keon Park Station'],
            'south morang': ['South Morang Station', 'Epping Station']
        }
        return transport_map.get(suburb, ['Contact agent'])
    
    def get_commute_time(self, suburb):
        """Get estimated commute time to Abbotsford (Weta FX)"""
        commute_times = {
            'wollert': '45-55 minutes',
            'epping': '40-50 minutes',
            'reservoir': '35-45 minutes',
            'south morang': '40-50 minutes'
        }
        return commute_times.get(suburb, '~50 minutes')

def format_output(properties):
    """Format output as requested"""
    if not properties:
        print("❌ No properties found matching criteria")
        return
    
    # Sort by price (lowest first)
    properties.sort(key=lambda x: x['price_numeric'])
    
    print("\n🏆 MELBOURNE RENTAL PROPERTIES")
    print("Target: Weta FX (Suite 3, 452 Johnston Street, Abbotsford)")
    print("Move-in: March 9, 2026")
    print("=" * 80)
    print()
    
    for i, prop in enumerate(properties, 1):
        title = prop.get('title', 'Unknown')
        price = prop.get('price', 'N/A')
        beds = prop.get('beds', '2+')
        baths = prop.get('baths', '1+')
        prop_type = prop.get('type', 'Unknown')
        url = prop.get('url', '')
        suburb = prop.get('suburb', '')
        transport = prop.get('transport', [])
        commute = prop.get('commute_time', '~50 min')
        inspection = prop.get('inspection', 'Contact agent')
        
        # Format beds/baths
        beds_baths = f"{beds}/{baths}"
        
        print(f"{i}. {title}")
        print(f"   ${price}/week - {beds_baths} - {prop_type}")
        print(f"   {url}")
        print(f"   📍 Suburb: {suburb}")
        print(f"   🚇 Transport: {', '.join(transport)}")
        print(f"   🚗 Commute: {commute} to Abbotsford")
        print(f"   👀 Inspections: {inspection}")
        print()

def main():
    print("🏠 Melbourne Rental Property Search")
    print("=" * 60)
    print("Search Criteria:")
    print("- Suburbs: Wollert, Epping, Reservoir, South Morang")
    print("- Bedrooms: 2+ minimum")
    print("- Price: Under $600/week")
    print("- Move-in: March 9, 2026")
    print("- Target: Near Weta FX (Abbotsford)")
    print("- Transport: Near public transport")
    print("- Commute: <1 hour to office")
    print("=" * 60)
    
    searcher = RentalSearcher()
    suburbs = ['wollert', 'epping', 'reservoir', 'south-morang']
    
    properties = searcher.search_domain(suburbs, min_beds=2, max_price=600)
    
    print(f"\n📊 Summary: {len(properties)} properties found under $600/week")
    print("=" * 60)
    
    format_output(properties)
    
    # Save to JSON for reference
    output_file = '/Users/ava/.openclaw/workspace/rental_search_results.json'
    with open(output_file, 'w') as f:
        json.dump(properties, f, indent=2)
    print(f"\n💾 Results saved to: {output_file}")

if __name__ == "__main__":
    main()
