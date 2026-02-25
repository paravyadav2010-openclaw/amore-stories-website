#!/usr/bin/env python3
"""Final cleanup and suburb extraction."""

import json
import re

# Mapping of addresses to suburbs based on URLs
address_suburb_map = {
    '10 21 Irving Avenue Prahran': 'Prahran',
    '18 Vicosa Drive Armstrong Creek': 'Armstrong Creek',
    '40 Brittas Street Woodstock': 'Woodstock',
    '30 Harriott Rd Armstrong Creek': 'Armstrong Creek',
    '10 Tritones Wy Armstrong Creek': 'Armstrong Creek',
    '19 Picture Street Mambourin': 'Mambourin',
    '11 Newcastle Road Rockbank': 'Rockbank',
    '113 7 Dudley Street Caulfield East': 'Caulfield East',
    '2 37 Victoria St Elsternwick': 'Elsternwick',
    '39 Nova Circuit Bundoora': 'Bundoora',
    '37 Yucca Street Wyndham Vale': 'Wyndham Vale',
    '10 Thaine Way Doreen': 'Doreen',
    '1 15 Kendall Street Elwood': 'Elwood',
    '6 62 64 Truganini Road Carnegie': 'Carnegie',
    '14 Modular St Charlemont': 'Charlemont',
    '14 425 Toorak Road Toorak': 'Toorak',
    '2 573 Neerim Road Hughesdale': 'Hughesdale',
    '30 Pine Cone Walk Fraser Rise': 'Fraser Rise',
    '3 15 State Street Oakleigh East': 'Oakleigh East',
    '205 450 Bell Street Preston': 'Preston',
    '13 157 Brighton Road Elwood': 'Elwood'
}

# Load properties
with open('/Users/ava/.openclaw/workspace/properties_fixed.json', 'r') as f:
    properties = json.load(f)

print("🔧 Adding suburbs...")

for prop in properties:
    addr = prop.get('url_address', '')
    if addr in address_suburb_map:
        prop['suburb'] = address_suburb_map[addr]
        print(f"✅ {addr} -> {address_suburb_map[addr]}")

# Save updated properties
with open('/Users/ava/.openclaw/workspace/properties_final.json', 'w') as f:
    json.dump(properties, f, indent=2)

print(f"\n✅ Updated {len(properties)} properties with suburbs")
print(f"📁 Saved to /Users/ava/.openclaw/workspace/properties_final.json")

# Print final summary
print("\n🏠 Final Property List:")
for i, p in enumerate(properties[:20], 1):
    print(f"{i}. {p['url_address']}, {p['suburb']} - ${p['price']}/week - {p['beds']}/{p['baths']}/{p['parking']} - {p['type']}")
