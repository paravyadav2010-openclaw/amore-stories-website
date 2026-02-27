#!/usr/bin/env python3
"""
Quick Start Example - Multi-Suburb Rental Search
Run this to deploy parallel searches across multiple suburbs
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from multi_suburb_search import RentalSearchManager


def quick_start_3_suburbs():
    """Quick search across 3 popular suburbs"""
    manager = RentalSearchManager(
        suburbs=["Preston", "Thornbury", "Reservoir"],
        min_beds=2,
        max_price=600,
        office="Suite 3, 452 Johnston Street, Abbotsford"
    )
    manager.run()
    return manager


def train_station_priority():
    """Search all South Morang line suburbs"""
    manager = RentalSearchManager(
        suburbs=["Preston", "Thornbury", "Regent", "Ruthven",
                 "Keon Park", "Thomastown", "Lalor"],
        min_beds=2,
        max_price=600,
        office="Suite 3, 452 Johnston Street, Abbotsford"
    )
    manager.run()
    return manager


def budget_search_strict():
    """Strict budget search - under $500/week"""
    manager = RentalSearchManager(
        suburbs=["Preston", "Thornbury", "Lalor"],
        min_beds=2,
        max_price=500,  # Strict budget
        office="Suite 3, 452 Johnston Street, Abbotsford"
    )
    manager.run()
    return manager


def main():
    """Quick start menu"""
    print("\n🏠 Multi-Suburb Rental Search - Quick Start")
    print("=" * 60)
    print("\nSelect a search type:")
    print("\n1. Quick search (3 suburbs)")
    print("2. Train station priority (7 suburbs - South Morang line)")
    print("3. Budget-focused (3 suburbs, under $500)")
    print("4. Custom search")
    print("\nOr run directly with Python:")
    print("   python3 quick_start.py --type 1")
    print("   python3 quick_start.py --type 2")
    print("   python3 quick_start.py --type 3\n")

    # Check for command line args
    if len(sys.argv) > 1:
        search_type = sys.argv[1]
        if search_type in ["--type", "-t"]:
            if len(sys.argv) > 2:
                type_num = sys.argv[2]

                if type_num == "1":
                    print("\n🚀 Running Quick Search (3 suburbs)...")
                    return quick_start_3_suburbs()
                elif type_num == "2":
                    print("\n🚀 Running Train Station Priority (7 suburbs)...")
                    return train_station_priority()
                elif type_num == "3":
                    print("\n🚀 Running Budget Search (under $500)...")
                    return budget_search_strict()
                else:
                    print(f"\n❌ Invalid type: {type_num}")
                    print("   Use 1, 2, or 3")
                    return None

    print("\n💡 To run actual searches via OpenClaw:")
    print("   Use sessions_spawn to deploy sub-agents for each suburb")
    print("   See SKILL.md for detailed instructions\n")


if __name__ == "__main__":
    main()
