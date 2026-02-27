#!/usr/bin/env python3
"""
Rental Property Scanner
Scans Domain.com.au for rental properties matching criteria
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
CONFIG_FILE = SCRIPT_DIR / "config.json"
DATA_DIR = SCRIPT_DIR / "data"
OUTPUT_DIR = SCRIPT_DIR / "output"
LOGS_DIR = SCRIPT_DIR / "logs"

# Create directories
DATA_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# Load config
with open(CONFIG_FILE, 'r') as f:
    config = json.load(f)

def log(message):
    """Log to file and stdout"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_line = f"[{timestamp}] {message}"
    print(log_line)

    log_file = LOGS_DIR / "scanner.log"
    with open(log_file, 'a') as f:
        f.write(log_line + "\n")

def run_agent_browser(url):
    """Run Agent Browser CLI to fetch page"""
    cmd = [
        "agent-browser",
        "open",
        url,
        "--snapshot",
        "--wait", "3"
    ]

    log(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=SCRIPT_DIR)

    if result.returncode != 0:
        log(f"❌ Error: {result.stderr}")
        return None

    return result.stdout

def construct_search_url():
    """Construct Domain.com.au search URL from config"""
    site = config["search"]["site"]
    suburbs = config["search"]["suburbs"]
    bedrooms = config["search"]["bedrooms"]
    max_price = config["search"]["maxPrice"]

    # Domain.com.au URL format
    suburb_params = "%2C".join(suburbs)
    url = f"https://{site}/rent/?suburb={suburb_params}&price=0-{max_price}&bedrooms={bedrooms}&sort=updated-desc"

    log(f"Search URL: {url}")
    return url

def extract_properties_from_snapshot(snapshot_text):
    """Extract property data from Agent Browser snapshot"""
    properties = []

    # This is a simplified version - real parsing would need more sophisticated
    # pattern matching from the actual snapshot output
    # For now, we'll implement a basic structure

    # Look for property cards in the snapshot
    lines = snapshot_text.split('\n')
    current_property = {}

    for line in lines:
        line = line.strip()

        # Detect property indicators (simplified)
        if '$' in line and '/week' in line:
            if current_property:
                properties.append(current_property)
            current_property = {'price': line}
        elif 'bed' in line.lower():
            current_property['bedrooms'] = line
        elif 'bath' in line.lower():
            current_property['bathrooms'] = line
        elif 'parking' in line.lower() or 'car' in line.lower():
            current_property['parking'] = line

    # Add last property
    if current_property:
        properties.append(current_property)

    log(f"Extracted {len(properties)} properties from snapshot")
    return properties

def filter_properties(properties):
    """Apply filters to properties"""
    filtered = []
    exclude_statuses = config["filters"]["excludeStatuses"]

    for prop in properties:
        # Skip if matches exclude keywords
        details = prop.get('details', '').lower()
        if any(keyword in details for keyword in config["filters"]["excludeKeywords"]):
            continue

        # Add timestamp
        prop['scannedAt'] = datetime.now().isoformat()
        prop['source'] = config["search"]["site"]

        filtered.append(prop)

    log(f"Filtered to {len(filtered)} properties after applying criteria")
    return filtered

def load_existing_properties():
    """Load previously scanned properties to avoid duplicates"""
    props_file = DATA_DIR / "properties.json"

    if not props_file.exists():
        return {}

    with open(props_file, 'r') as f:
        data = json.load(f)
        return data

def save_properties(properties):
    """Save properties to data file"""
    props_file = DATA_DIR / "properties.json"

    # Load existing
    existing = load_existing_properties()

    # Add new properties
    new_count = 0
    for prop in properties:
        # Create unique ID from address/price
        prop_id = f"{prop.get('address', 'unknown')}_{prop.get('price', '0')}"

        if prop_id not in existing:
            existing[prop_id] = prop
            new_count += 1

    # Save
    with open(props_file, 'w') as f:
        json.dump(existing, f, indent=2)

    log(f"💾 Saved {new_count} new properties (total: {len(existing)})")
    return new_count

def main():
    """Main scanner function"""
    log("=" * 60)
    log("🏠 RENTAL SCANNER STARTED")
    log("=" * 60)

    # Construct search URL
    url = construct_search_url()

    # Run Agent Browser
    snapshot = run_agent_browser(url)

    if not snapshot:
        log("❌ Failed to get snapshot")
        sys.exit(1)

    # Extract properties
    properties = extract_properties_from_snapshot(snapshot)

    if not properties:
        log("⚠️ No properties found - may need to adjust extraction logic")
        sys.exit(1)

    # Filter
    filtered = filter_properties(properties)

    # Save
    new_count = save_properties(filtered)

    # Summary
    log("=" * 60)
    log(f"✅ SCAN COMPLETE")
    log(f"Total scanned: {len(properties)}")
    log(f"After filtering: {len(filtered)}")
    log(f"New properties: {new_count}")
    log("=" * 60)

if __name__ == "__main__":
    main()
