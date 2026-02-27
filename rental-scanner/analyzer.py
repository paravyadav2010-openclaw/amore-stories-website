#!/usr/bin/env python3
"""
Property Analyzer
Scores rental properties by value and quality
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
import re

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR / "data"
CONFIG_FILE = SCRIPT_DIR / "config.json"

# Load config
with open(CONFIG_FILE, 'r') as f:
    config = json.load(f)

def extract_price(price_str):
    """Extract numeric price from string like '$550/week'"""
    if not price_str:
        return None

    # Extract number
    match = re.search(r'\$?([\d,]+)', price_str)
    if match:
        return int(match.group(1).replace(',', ''))

    return None

def extract_bedrooms(bed_str):
    """Extract bedroom count"""
    if not bed_str:
        return None

    match = re.search(r'(\d+)', bed_str)
    if match:
        return int(match.group(1))

    return None

def calculate_price_score(property_data):
    """Score based on price per bedroom"""
    price = extract_price(property_data.get('price'))
    beds = extract_bedrooms(property_data.get('bedrooms'))

    if not price or not beds:
        return 50  # Neutral score if can't calculate

    price_per_bed = price / beds
    max_price = config["search"]["maxPrice"]

    # Lower is better (within reason)
    if price_per_bed <= 200:
        return 100
    elif price_per_bed <= 250:
        return 90
    elif price_per_bed <= 300:
        return 80
    elif price_per_bed <= 350:
        return 60
    else:
        return 40

def calculate_location_score(property_data):
    """Score based on suburb/quality"""
    suburbs = config["search"]["suburbs"]

    # Could add more sophisticated scoring here
    # For now, just check if it's in preferred suburbs
    address = property_data.get('address', '').lower()

    for suburb in suburbs:
        if suburb.lower() in address:
            return 80

    return 60  # Neutral for other suburbs

def calculate_new_listing_bonus(property_data):
    """Bonus for new listings"""
    scanned_at = property_data.get('scannedAt')
    if not scanned_at:
        return 0

    scan_date = datetime.fromisoformat(scanned_at)
    hours_old = (datetime.now() - scan_date).total_seconds() / 3600

    # Newer = higher bonus
    if hours_old < 1:
        return 100
    elif hours_old < 24:
        return 80
    elif hours_old < 48:
        return 60
    elif hours_old < 72:
        return 40
    else:
        return 20

def calculate_overall_score(property_data):
    """Calculate overall property score"""
    price_score = calculate_price_score(property_data) * config["scoring"]["priceWeight"]
    location_score = calculate_location_score(property_data) * config["scoring"]["locationWeight"]
    new_bonus = calculate_new_listing_bonus(property_data) * config["scoring"]["newListingBonus"]

    overall = price_score + location_score + new_bonus

    # Add score to property data
    property_data['score'] = round(overall, 1)
    property_data['scoreBreakdown'] = {
        'price': round(price_score, 1),
        'location': round(location_score, 1),
        'newBonus': round(new_bonus, 1)
    }

    return property_data

def analyze_all_properties():
    """Analyze all properties in database"""
    props_file = DATA_DIR / "properties.json"

    if not props_file.exists():
        print("No properties to analyze")
        return []

    with open(props_file, 'r') as f:
        properties = json.load(f)

    analyzed = []

    for prop_id, prop in properties.items():
        analyzed_prop = calculate_overall_score(prop)
        analyzed.append(analyzed_prop)

    # Sort by score (descending)
    analyzed.sort(key=lambda x: x['score'], reverse=True)

    # Filter by minimum score
    min_score = config["filters"]["minScore"]
    filtered = [p for p in analyzed if p['score'] >= min_score]

    print(f"Analyzed {len(analyzed)} properties")
    print(f"Qualifying (score >= {min_score}): {len(filtered)}")

    return filtered

def get_top_properties(count=None):
    """Get top N properties by score"""
    if not count:
        count = config["newsletter"]["maxPicks"]

    analyzed = analyze_all_properties()
    return analyzed[:count]

if __name__ == "__main__":
    top_properties = get_top_properties()

    print("\n" + "="*60)
    print("TOP PROPERTIES")
    print("="*60)

    for i, prop in enumerate(top_properties, 1):
        print(f"\n{i}. Score: {prop['score']}/100")
        print(f"   Price: {prop.get('price', 'N/A')}")
        print(f"   Address: {prop.get('address', 'N/A')}")
        print(f"   Beds: {prop.get('bedrooms', 'N/A')}")
