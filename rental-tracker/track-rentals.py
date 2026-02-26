#!/usr/bin/env python3
"""
Melbourne Rental Tracker
Searches Domain.com.au for rental properties matching criteria and tracks new listings.
"""

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Configuration
MAX_BUDGET = 600  # $/week
MIN_BEDROOMS = 2
OFFICE_ADDRESS = "Suite 3, 452 Johnston Street, Abbotsford"
SUBURBS = ["Wollert", "Epping", "Reservoir", "South Morang"]

# File paths
WORKSPACE = Path("/Users/ava/.openclaw/workspace/rental-tracker")
RESULTS_FILE = WORKSPACE / "results.json"
PREVIOUS_RESULTS_FILE = WORKSPACE / "previous-results.json"
LOG_FILE = WORKSPACE / "tracker.log"


def log(message):
    """Write log message with timestamp."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S NZT")
    log_line = f"[{timestamp}] {message}\n"
    print(log_line.strip())
    LOG_FILE.open("a").write(log_line)


def run_agent_browser_search(suburb):
    """
    Search Domain.com.au for properties in a suburb using Agent Browser CLI.
    Returns list of property URLs found.
    """
    # Domain.com.au search URL with filters
    search_url = (
        f"https://www.domain.com.au/rent/{suburb}-vic-3076"
        f"/?bedrooms=2-any"
        f"&price=0-600"
        f"&exclude=underoffer,deposittaken,leased"
    )

    log(f"Searching {suburb}...")

    try:
        # Open the search page
        subprocess.run(
            ["agent-browser", "open", search_url],
            capture_output=True,
            timeout=60
        )

        # Take snapshot to get property links
        result = subprocess.run(
            ["agent-browser", "snapshot", "-i", "--json"],
            capture_output=True,
            text=True,
            timeout=30
        )

        # Parse snapshot for property links
        # Agent Browser returns JSON with page elements
        # We'll need to extract hrefs from property cards

        properties = []
        if result.returncode == 0:
            # Parse the snapshot output
            # This is a simplified version - actual implementation depends on
            # Agent Browser's JSON output format
            snapshot_data = json.loads(result.stdout)

            # Extract property URLs from the snapshot
            # Look for property card links
            if "elements" in snapshot_data:
                for element in snapshot_data["elements"]:
                    if "href" in element and "/address/" in element["href"]:
                        url = f"https://www.domain.com.au{element['href']}"
                        properties.append({
                            "url": url,
                            "suburb": suburb,
                            "found_at": datetime.now().isoformat()
                        })

        log(f"  Found {len(properties)} properties in {suburb}")
        return properties

    except subprocess.TimeoutExpired:
        log(f"  Timeout searching {suburb}")
        return []
    except Exception as e:
        log(f"  Error searching {suburb}: {e}")
        return []


def get_property_details(url):
    """
    Fetch detailed information from a property page.
    Returns property dict or None if failed.
    """
    try:
        subprocess.run(
            ["agent-browser", "open", url],
            capture_output=True,
            timeout=60
        )

        result = subprocess.run(
            ["agent-browser", "snapshot", "-i", "--json"],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            snapshot_data = json.loads(result.stdout)

            # Extract property details from snapshot
            # Price, bedrooms, address, etc.
            property_info = {
                "url": url,
                "price": None,
                "bedrooms": None,
                "address": None,
                "found_at": datetime.now().isoformat()
            }

            # Parse price (e.g., "$500 per week")
            # Parse bedrooms
            # Parse address

            return property_info

    except Exception as e:
        log(f"Error fetching details for {url}: {e}")

    return None


def filter_by_criteria(properties):
    """
    Filter properties based on budget, bedrooms, and other criteria.
    """
    filtered = []
    for prop in properties:
        # Check price
        if prop.get("price"):
            price_num = int(''.join(filter(str.isdigit, prop["price"])))
            if price_num > MAX_BUDGET:
                continue

        # Check bedrooms
        if prop.get("bedrooms"):
            if prop["bedrooms"] < MIN_BEDROOMS:
                continue

        filtered.append(prop)

    log(f"  Filtered to {len(filtered)} matching properties")
    return filtered


def compare_with_previous(current):
    """
    Compare current results with previous run to identify new listings.
    Returns list of new properties.
    """
    if not PREVIOUS_RESULTS_FILE.exists():
        log("No previous results - all properties are new")
        return current

    with open(PREVIOUS_RESULTS_FILE) as f:
        previous = json.load(f)

    previous_urls = {prop["url"] for prop in previous}

    new_properties = [
        prop for prop in current
        if prop["url"] not in previous_urls
    ]

    log(f"  {len(new_properties)} new properties found")
    return new_properties


def save_results(properties):
    """Save current results to file."""
    with open(RESULTS_FILE, "w") as f:
        json.dump(properties, f, indent=2)


def archive_previous():
    """Archive current results as previous."""
    if RESULTS_FILE.exists():
        subprocess.run(
            ["cp", str(RESULTS_FILE), str(PREVIOUS_RESULTS_FILE)],
            capture_output=True
        )


def send_telegram_alert(properties):
    """
    Send Telegram alert for new properties.
    """
    if not properties:
        log("No new properties to alert")
        return

    # Format message
    message = f"🏠 **NEW RENTALS FOUND**\n\n"
    for i, prop in enumerate(properties[:10], 1):  # Max 10 per alert
        message += f"{i}. {prop.get('address', 'Unknown')}\n"
        message += f"   💰 {prop.get('price', 'Price unknown')}\n"
        message += f"   🛏️ {prop.get('bedrooms', '?')} BR\n"
        message += f"   🔗 {prop['url']}\n\n"

    # Send via Telegram bot (requires integration)
    # This is a placeholder - actual implementation depends on OpenClaw's Telegram integration
    log(f"Alert prepared with {len(properties)} properties")


def main():
    """Main execution flow."""
    log("=" * 60)
    log("MELBOURNE RENTAL TRACKER - SEARCH STARTED")
    log("=" * 60)

    all_properties = []

    # Search each suburb
    for suburb in SUBURBS:
        properties = run_agent_browser_search(suburb)
        all_properties.extend(properties)

    # Get detailed info for each property
    detailed_properties = []
    for prop in all_properties:
        details = get_property_details(prop["url"])
        if details:
            detailed_properties.append(details)

    # Filter by criteria
    matching_properties = filter_by_criteria(detailed_properties)

    # Compare with previous results
    new_properties = compare_with_previous(matching_properties)

    # Save results
    save_results(matching_properties)

    # Send alerts for new properties
    send_telegram_alert(new_properties)

    # Archive for next run
    archive_previous()

    log("=" * 60)
    log("SEARCH COMPLETE")
    log(f"Total found: {len(matching_properties)}")
    log(f"New properties: {len(new_properties)}")
    log("=" * 60)


if __name__ == "__main__":
    main()
