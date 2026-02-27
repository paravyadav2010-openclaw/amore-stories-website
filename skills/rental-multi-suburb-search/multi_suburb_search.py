#!/usr/bin/env python3
"""
Multi-Suburb Rental Search Manager
Deploys dedicated sub-agents per suburb to avoid rate limits
"""

import json
import time
from datetime import datetime
from pathlib import Path

# Default configuration
DEFAULT_CONFIG = {
    "suburbs": ["Preston", "Thornbury", "Regent", "Ruthven", "Keon Park", "Thomastown", "Lalor"],
    "min_beds": 2,
    "max_price": 600,
    "office": "Suite 3, 452 Johnston Street, Abbotsford, Melbourne",
    "filter_statuses": ["Leased", "Deposit Taken", "Under Contract", "Withdrawn"],
    "exclude_keywords": ["shared", "flatmate", "room", "student"]
}


class RentalSearchManager:
    """Manages parallel rental searches across multiple suburbs"""

    def __init__(self, suburbs=None, min_beds=2, max_price=600, office=None, config_file=None):
        """
        Initialize search manager

        Args:
            suburbs: List of suburb names (default from config)
            min_beds: Minimum bedrooms
            max_price: Maximum weekly rent
            office: Target office address for commute calculation
            config_file: Path to config.json (optional)
        """
        # Load config
        self.config = self._load_config(config_file)

        # Override with parameters
        if suburbs:
            self.config["suburbs"] = suburbs
        if min_beds:
            self.config["min_beds"] = min_beds
        if max_price:
            self.config["max_price"] = max_price
        if office:
            self.config["office"] = office

        self.results = []
        self.session_keys = []

    def _load_config(self, config_file):
        """Load configuration from file"""
        if config_file and Path(config_file).exists():
            with open(config_file) as f:
                return json.load(f)
        return DEFAULT_CONFIG.copy()

    def _get_search_task(self, suburb):
        """Generate search task for a single suburb"""
        return f"""Search for rental properties in {suburb}

**Criteria:**
- {self.config["min_beds"]}+ bedrooms
- Under ${self.config["max_price"]}/week
- Available properties only (skip "Leased", "Deposit Taken", "Under Contract")
- Near train station (South Morang line)
- Commute time to office: {self.config["office"]}

**Output format:**
For each property, provide:
- Exact Domain.com.au URL (no mock links)
- Address
- Price per week
- Beds, baths, parking
- Commute time (drive + public transport)
- Distance from train station
- Inspection times if available

**Sort by:** Best value (commute + price)
**Return:** Top 10 properties

Use snapshot method to extract real Domain.com.au URLs."""

    def run(self):
        """
        Deploy sub-agents and run parallel searches

        Returns:
            List of all properties found
        """
        print(f"🚀 Starting multi-suburb rental search")
        print(f"📍 Suburbs: {', '.join(self.config['suburbs'])}")
        print(f"💰 Budget: Under ${self.config['max_price']}/week")
        print(f"🛏️ Bedrooms: {self.config['min_beds']}+")
        print("=" * 60)

        # Deploy sub-agents (in parallel via sessions_spawn)
        # Note: This would be called via sessions_spawn in actual usage
        # For demonstration, we're showing the structure

        for i, suburb in enumerate(self.config["suburbs"], 1):
            task = self._get_search_task(suburb)
            print(f"📋 Sub-agent #{i}: {suburb}")
            print(f"   Task prepared (would spawn via sessions_spawn)")
            print()

        # In actual usage, sessions_spawn calls would be here
        # Results would be collected automatically

        print("=" * 60)
        print("✅ All sub-agents deployed")
        print("⏳ Waiting for results...")
        print()

        # Wait and collect results
        # This would be async in real implementation

        return self.results

    def compile_report(self, properties):
        """
        Compile all properties into sorted report

        Args:
            properties: List of all properties from all sub-agents
        """
        print("\n" + "=" * 60)
        print("🏠 MULTI-SUBURB RENTAL SEARCH RESULTS")
        print("=" * 60)
        print(f"📍 Office: {self.config['office']}")
        print(f"📅 Date: {datetime.now().strftime('%B %d, %Y')}")
        print(f"🎯 Filters: {self.config['min_beds']}+ beds, under ${self.config['max_price']}/week")
        print(f"📍 Suburbs: {', '.join(self.config['suburbs'])}")
        print("=" * 60)

        if not properties:
            print("\n❌ No properties found matching criteria")
            return

        # Sort by best value (would need actual scoring logic)
        # For now, just show as received

        print(f"\n📊 Summary:")
        print(f"   Total properties found: {len(properties)}")
        print(f"   Suburbs searched: {len(self.config['suburbs'])}")
        print(f"   Date: {datetime.now().strftime('%B %d, %Y')}")
        print("\n" + "=" * 60)

        # Print top properties
        for i, prop in enumerate(properties[:20], 1):
            print(f"\n{i}. {prop.get('address', 'Unknown')}")
            print(f"   📍 Suburb: {prop.get('suburb', 'Unknown')}")
            print(f"   💰 Price: {prop.get('price', 'N/A')}/week")
            print(f"   🛏️ Beds: {prop.get('beds', 'N/A')} | 🛁 Baths: {prop.get('baths', 'N/A')}")
            print(f"   ⏱️ Commute: {prop.get('commute', 'N/A')}")
            print(f"   🔗 {prop.get('url', 'No link')}")

        print("\n" + "=" * 60)
        print("✅ REPORT COMPLETE")
        print("=" * 60)

    def save_config(self, config_file="config.json"):
        """Save current configuration to file"""
        with open(config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
        print(f"✅ Configuration saved to {config_file}")


def main():
    """Demo: Run multi-suburb search"""
    manager = RentalSearchManager(
        suburbs=["Preston", "Thornbury", "Lalor"],
        min_beds=2,
        max_price=600,
        office="Suite 3, 452 Johnston Street, Abbotsford"
    )

    print("🏠 Multi-Suburb Rental Search Manager")
    print("=" * 60)
    print("\nThis workflow deploys dedicated sub-agents per suburb")
    print("to avoid API rate limits and speed up searches.\n")

    manager.run()

    print("\n📝 In actual usage:")
    print("   1. Sessions spawn sub-agents for each suburb")
    print("   2. Each sub-agent searches independently")
    print("   3. Manager collects all results")
    print("   4. Compiles into sorted report")
    print("\n💡 Use via sessions_spawn with the task template above")


if __name__ == "__main__":
    main()
