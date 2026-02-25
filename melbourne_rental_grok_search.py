#!/usr/bin/env python3
"""
Search Melbourne Rental Properties using xAI Grok API
Returns actual property listings with direct links
"""

import os
import requests
import json
from datetime import datetime

# Get API key from environment
XAI_API_KEY = os.getenv('XAI_API_KEY', '')

if not XAI_API_KEY:
    print("❌ Error: XAI_API_KEY not found in environment")
    print("Please set it with: export XAI_API_KEY='your-key'")
    exit(1)

def search_rentals_with_grok(query):
    """Search for rental properties using xAI Grok"""

    url = "https://api.x.ai/v1/responses"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {XAI_API_KEY}"
    }

    # Use web_search tool with domain restrictions
    payload = {
        "input": [
            {
                "role": "user",
                "content": query
            }
        ],
        "tools": [
            {
                "type": "web_search",
                "web_search": {
                    "allowed_domains": [
                        "domain.com.au",
                        "realestate.com.au"
                    ]
                }
            }
        ],
        "temperature": 0.0
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)

        if response.status_code != 200:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return None

        data = response.json()

        # Extract content and citations
        if 'output' not in data or len(data['output']) == 0:
            print("❌ No results returned")
            return None

        output = data['output'][0]['content']
        citations = data.get('citations', [])

        return {
            'content': output,
            'citations': citations
        }

    except Exception as e:
        print(f"❌ Error searching: {e}")
        return None

def format_search_results(results, suburbs):
    """Format search results for display"""

    if not results:
        return f"No rental properties found for {', '.join(suburbs)}."

    output = []
    output.append(f"# Melbourne Rental Properties")
    output.append(f"Searched: {', '.join(suburbs)}")
    output.append(f"Found: {len(results['citations'])} results")
    output.append(f"\nSearched at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Extract property listings from the AI response
    content = results['content']

    # Add citations (direct links to sources)
    if results['citations']:
        output.append("\n## 🔍 Property Listings Found\n")

        for i, citation in enumerate(results['citations'], 1):
            output.append(f"\n### {i}. {citation.get('title', 'Property Listing')}")

            if 'url' in citation:
                output.append(f"**Direct Link:** {citation['url']}")

            if 'title' in citation:
                output.append(f"**Title:** {citation['title']}")

            if 'description' in citation:
                output.append(f"**Description:** {citation['description']}")

        output.append("\n---")
        output.append("\n## 📝 AI Summary\n")
        output.append(content)

    return '\n'.join(output)

def main():
    """Main search function"""

    suburbs = ["Reservoir", "Epping", "Lalor", "Wollert", "Thomastown", "Preston"]

    print("🏠 Searching Melbourne Rental Properties using xAI Grok")
    print("=" * 60)
    print(f"Suburbs: {', '.join(suburbs)}")
    print(f"API: xAI Grok (grok-3-flash)")
    print()

    # Build comprehensive search query
    query = f"""Find available rental houses in Melbourne Australia in these suburbs: {', '.join(suburbs)}.

For each property found, provide:
1. Direct link to the property listing page (URL)
2. Property address
3. Weekly rental price in AUD
4. Number of bedrooms
5. Property type (house, townhouse, etc.)
6. Brief description

Focus on:
- 3+ bedroom houses
- Weekly rent under $650 AUD
- Recently listed properties

Search on: domain.com.au and realestate.com.au

Format the response as a clear list with direct URLs for each property."""

    print("🔍 Searching...")
    results = search_rentals_with_grok(query)

    if results:
        formatted = format_search_results(results, suburbs)

        # Save to file
        filename = 'melbourne_rental_properties_found.md'
        with open(filename, 'w') as f:
            f.write(formatted)

        # Print to console
        print(formatted)

        print("\n" + "=" * 60)
        print(f"✅ Search Complete!")
        print(f"📄 Results saved to: {filename}")
        print(f"🔗 Found {len(results['citations'])} property listings")

        # Print quick links
        if results['citations']:
            print("\n🚀 Quick Links:")
            for i, citation in enumerate(results['citations'][:10], 1):
                if 'url' in citation:
                    print(f"{i}. {citation['url']}")

    else:
        print("\n❌ Failed to retrieve results")

    return 0

if __name__ == '__main__':
    import sys
    sys.exit(main())
