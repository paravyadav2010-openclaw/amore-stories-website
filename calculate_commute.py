#!/usr/bin/env python3
"""Calculate commute times from each suburb to Abbotsford."""

import json

# Approximate commute times from Melbourne suburbs to Abbotsford (in minutes)
# These are estimates based on typical peak hour driving/public transport times
suburb_commute_times = {
    'Prahran': 25,      # Inner southeast, very close
    'Caulfield East': 30,  # Inner southeast, close
    'Elsternwick': 25,     # Inner southeast
    'Elwood': 25,          # Inner southeast
    'Carnegie': 30,        # Inner southeast
    'Toorak': 20,          # Inner southeast, very close
    'Hughesdale': 35,      # Southeast
    'Oakleigh East': 40,   # Southeast
    'Bundoora': 35,        # North
    'Preston': 30,         # North, close
    'Armstrong Creek': 60, # Geelong area, far southwest
    'Woodstock': 50,       # North
    'Mambourin': 65,       # Wyndham area, far west
    'Rockbank': 70,        # Far west
    'Wyndham Vale': 65,    # Far west
    'Doreen': 45,         # Outer north
    'Charlemont': 60,      # Geelong area
    'Fraser Rise': 55,     # Far west
    'N/A': 999  # Unknown
}

# Load properties
with open('/Users/ava/.openclaw/workspace/properties_final.json', 'r') as f:
    properties = json.load(f)

print("🚗 Calculating commute times to 452 Johnston Street, Abbotsford...")

# Add commute time to each property
for prop in properties:
    suburb = prop.get('suburb', 'N/A')
    commute = suburb_commute_times.get(suburb, 999)
    prop['commute_minutes'] = commute
    prop['available'] = commute < 60  # Filter to <60 min

    status = "✅" if commute < 60 else "❌"
    print(f"{status} {prop['url_address']}, {suburb}: ~{commute} min")

# Filter and sort
available_properties = [p for p in properties if p['available'] and p['commute_minutes'] < 60]
available_properties.sort(key=lambda x: x['commute_minutes'])

print(f"\n✅ Found {len(available_properties)} properties with <60 min commute")

# Save filtered results
with open('/Users/ava/.openclaw/workspace/properties_filtered.json', 'w') as f:
    json.dump(available_properties, f, indent=2)

print(f"📁 Saved to /Users/ava/.openclaw/workspace/properties_filtered.json")

# Print top properties
print("\n🏠 Top Properties (sorted by commute time):")
for i, p in enumerate(available_properties[:10], 1):
    print(f"{i}. {p['url_address']}, {p['suburb']} - ${p['price']}/week - {p['beds']}/{p['baths']}/{p['parking']} - {p['commute_minutes']} min")
