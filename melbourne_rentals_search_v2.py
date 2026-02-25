#!/usr/bin/env python3
"""
Melbourne Rental Property Search for Weta FX Relocation - Version 2
Uses Domain.com.au search URL with proper query parameters
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
from urllib.parse import urljoin, urlparse, quote

class RentalSearcher:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        })
        
    def search_domain(self, suburbs, min_beds=2, max_price=600):
        """Search Domain.com.au for rental properties using search URL"""
        all_properties = []
        
        # Build the search URL with multiple suburbs
        # Format: suburb=wollert-vic-3027,epping-vic-3076,reservoir-vic-3073,south-morang-vic-3752
        suburb_params = []
        
        suburb_postcodes = {
            'wollert': '3027',
            'epping': '3076',
            'reservoir': '3073',
            'south morang': '3752'
        }
        
        for suburb in suburbs:
            postcode = suburb_postcodes.get(suburb.lower(), '')
            suburb_name = suburb.replace(' ', '-').lower()
            if postcode:
                suburb_params.append(f"{suburb_name}-vic-{postcode}")
        
        suburbs_str = ','.join(suburb_params)
        
        # Domain search URL
        url = f"https://www.domain.com.au/rent/?suburb={suburbs_str}&bedrooms={min_beds}-3&price=0-{max_price}&excludedeposittaken=1&sort=price-asc"
        
        print(f"\n🔍 Searching Domain.com.au...")
        print(f"   URL: {url[:100]}...")
        
        try:
            # First request to get the page
            response = self.session.get(url, timeout=30)
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 403:
                print("   ❌ Access denied (403) - Domain.com.au blocking requests")
                print("   💡 Try accessing the search URL directly in a browser")
                return []
            elif response.status_code != 200:
                print(f"   ❌ Error: HTTP {response.status_code}")
                return []
            
            # Save HTML for debugging
            html_file = '/Users/ava/.openclaw/workspace/domain_search.html'
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(response.text)
            print(f"   💾 HTML saved to: {html_file}")
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try to find listings using various selectors
            print("   📄 Parsing listings...")
            
            # Look for script tags with embedded data (Domain often puts data in JSON)
            scripts = soup.find_all('script')
            for script in scripts:
                script_text = script.string
                if script_text and ('listings' in script_text or 'results' in script_text):
                    print("   🔍 Found potential data script")
                    # Try to extract JSON data
                    json_match = re.search(r'\{.*\}', script_text, re.DOTALL)
                    if json_match:
                        try:
                            data = json.loads(json_match.group(0))
                            print(f"   📊 Data found: {list(data.keys())[:5]}")
                        except:
                            pass
            
            # Try standard listing selectors
            selectors = [
                'li[data-testid="listing"]',
                'div[data-testid="listing"]',
                'article[data-testid="listing"]',
                'li.css-1s4q8g9',
                'article.css-1g5wz4p',
                'div.listing-card',
                'article.listing-card',
                'div.search-results__listing'
            ]
            
            listings = []
            for selector in selectors:
                found = soup.select(selector)
                if found:
                    print(f"   ✅ Found {len(found)} listings with selector: {selector}")
                    listings = found
                    break
            
            if not listings:
                # Last resort: look for all links to property pages
                all_links = soup.find_all('a', href=re.compile(r'/address/|/\d+'))
                print(f"   🔍 Found {len(all_links)} property links")
                listings = all_links[:20]
            
            print(f"   Processing {len(listings)} listings...")
            
            for i, listing in enumerate(listings[:15]):  # Limit to first 15
                try:
                    # Extract link
                    if listing.name == 'a':
                        link_elem = listing
                    else:
                        link_elem = listing.find('a', href=re.compile(r'/address/|/\d+'))
                    
                    if not link_elem:
                        continue
                    
                    relative_url = link_elem.get('href', '')
                    if not relative_url or not relative_url.startswith('/'):
                        continue
                    
                    full_url = urljoin('https://www.domain.com.au', relative_url)
                    
                    # Extract title/address
                    title = link_elem.get_text(strip=True)
                    if not title or len(title) < 10:
                        title = link_elem.get('title', '')
                    
                    # Look for price nearby
                    price = "N/A"
                    price_numeric = 999999
                    
                    # Try to find price in the listing
                    if listing.name == 'a':
                        # Look for price in sibling elements
                        parent = listing.parent
                        if parent:
                            price_elem = parent.find(text=re.compile(r'\$\d+'))
                            if price_elem:
                                price = price_elem.strip()
                                price_match = re.search(r'\$(\d+)', price)
                                if price_match:
                                    price_numeric = int(price_match.group(1))
                    else:
                        price_elem = listing.find(text=re.compile(r'\$\d+'))
                        if price_elem:
                            price = price_elem.strip()
                            price_match = re.search(r'\$(\d+)', price)
                            if price_match:
                                price_numeric = int(price_match.group(1))
                    
                    # Skip if too expensive
                    if price_numeric > max_price:
                        continue
                    
                    # Extract beds/baths
                    beds = "2+"
                    baths = "1+"
                    cars = "N/A"
                    
                    # Try to extract features
                    all_text = listing.get_text()
                    beds_match = re.search(r'(\d+)\s*bed', all_text, re.I)
                    if beds_match:
                        beds = beds_match.group(1)
                        if int(beds) < min_beds:
                            continue
                    
                    baths_match = re.search(r'(\d+)\s*bat', all_text, re.I)
                    if baths_match:
                        baths = baths_match.group(1)
                    
                    cars_match = re.search(r'(\d+)\s*car', all_text, re.I)
                    if cars_match:
                        cars = cars_match.group(1)
                    
                    # Determine property type
                    prop_type = "Unknown"
                    title_lower = title.lower()
                    if 'house' in title_lower:
                        prop_type = "House"
                    elif 'townhouse' in title_lower:
                        prop_type = "Townhouse"
                    elif 'unit' in title_lower or 'apartment' in title_lower:
                        prop_type = "Unit"
                    
                    # Determine suburb from URL or title
                    suburb = "Unknown"
                    for sub in suburbs:
                        if sub.lower() in title_lower:
                            suburb = sub.title()
                            break
                    
                    if suburb == "Unknown":
                        # Try to extract from URL
                        url_path = urlparse(full_url).path
                        for sub, code in suburb_postcodes.items():
                            if code in url_path:
                                suburb = sub.title()
                                break
                    
                    # Transport info
                    transport_stations = self.get_transport_for_suburb(suburb.lower())
                    commute_time = self.get_commute_time(suburb.lower())
                    
                    property_data = {
                        'title': title[:70],
                        'address': title[:60],
                        'price': price,
                        'price_numeric': price_numeric,
                        'beds': beds,
                        'baths': baths,
                        'cars': cars,
                        'type': prop_type,
                        'url': full_url,
                        'suburb': suburb,
                        'transport': transport_stations,
                        'commute_time': commute_time,
                        'inspection': 'Contact agent',
                        'available': True
                    }
                    
                    all_properties.append(property_data)
                    
                except Exception as e:
                    print(f"   Error parsing listing {i}: {e}")
                    continue
            
            print(f"   ✅ Found {len(all_properties)} valid properties")
            
        except Exception as e:
            print(f"   ❌ Error searching Domain: {e}")
            import traceback
            traceback.print_exc()
        
        return all_properties
    
    def get_transport_for_suburb(self, suburb):
        """Get nearby train stations for suburb"""
        transport_map = {
            'wollert': ['Epping Station (2.5km)', 'South Morang Station (4km)'],
            'epping': ['Epping Station', 'Epping Plaza Station'],
            'reservoir': ['Reservoir Station', 'Ruthven Station', 'Keon Park Station'],
            'south morang': ['South Morang Station', 'Epping Station']
        }
        return transport_map.get(suburb.lower(), ['Contact agent'])
    
    def get_commute_time(self, suburb):
        """Get estimated commute time to Abbotsford (Weta FX)"""
        commute_times = {
            'wollert': '45-55 minutes',
            'epping': '40-50 minutes',
            'reservoir': '35-45 minutes',
            'south morang': '40-50 minutes'
        }
        return commute_times.get(suburb.lower(), '~50 minutes')

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
    suburbs = ['wollert', 'epping', 'reservoir', 'south morang']
    
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
