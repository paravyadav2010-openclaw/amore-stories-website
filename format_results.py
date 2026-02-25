#!/usr/bin/env python3
"""Format final results for Telegram."""

import json

# Load filtered properties
with open('/Users/ava/.openclaw/workspace/properties_filtered.json', 'r') as f:
    properties = json.load(f)

# Get top 10
top_10 = properties[:10]

# Format output
output_lines = []
output_lines.append("🏠 MELBOURNE RENTAL SEARCH RESULTS")
output_lines.append("=" * 50)
output_lines.append("")
output_lines.append("📍 Office: 452 Johnston Street, Abbotsford, Melbourne VIC 3067")
output_lines.append("💰 Budget: Under $600/week")
output_lines.append("🛏️ Bedrooms: 2+")
output_lines.append("🚗 Commute: <60 minutes")
output_lines.append("")
output_lines.append("TOP 10 PROPERTIES (sorted by commute time):")
output_lines.append("=" * 50)
output_lines.append("")

for i, prop in enumerate(top_10, 1):
    # Format address properly - add "VIC" and postcode if needed
    addr = prop['url_address'].title()
    suburb = prop['suburb']

    output_lines.append(f"Property {i}")
    output_lines.append(f"- Address: {addr}")
    output_lines.append(f"- Price: ${prop['price']}/week")
    output_lines.append(f"- Beds/Baths/Parking: {prop['beds']}/{prop['baths']}/{prop['parking']}")
    output_lines.append(f"- Type: {prop['type']}")
    output_lines.append(f"- Suburb: {suburb}")
    output_lines.append(f"- Commute time to office: {prop['commute_minutes']} minutes")
    output_lines.append(f"- Link: {prop['url']}")
    output_lines.append("")

# Save to file
output_text = '\n'.join(output_lines)
with open('/Users/ava/.openclaw/workspace/rental_results.txt', 'w') as f:
    f.write(output_text)

print("✅ Formatted results saved to /Users/ava/.openclaw/workspace/rental_results.txt")
print("\n" + output_text)
