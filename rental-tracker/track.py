#!/usr/bin/env python3
"""
Property Tracker - Stores and detects new rental listings
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# File paths
WORKSPACE = Path("/Users/ava/.openclaw/workspace/rental-tracker")
DB_FILE = WORKSPACE / "properties-db.json"
PREVIOUS_DB = WORKSPACE / "previous-properties.json"


def load_database():
    """Load property database."""
    if not DB_FILE.exists():
        return {
            "last_updated": None,
            "search_criteria": {},
            "properties": []
        }
    with open(DB_FILE) as f:
        return json.load(f)


def save_database(db):
    """Save property database."""
    with open(DB_FILE, "w") as f:
        json.dump(db, f, indent=2)


def archive_current():
    """Archive current database as previous."""
    if DB_FILE.exists():
        import shutil
        shutil.copy(DB_FILE, PREVIOUS_DB)


def add_properties(new_properties):
    """
    Add new properties to database.
    Returns list of truly new properties (not in previous DB).
    """
    # Load current DB
    db = load_database()

    # Archive current as previous
    archive_current()

    # Get existing URLs
    existing_urls = {prop["url"] for prop in db["properties"]}

    # Add new properties
    truly_new = []
    for prop in new_properties:
        if prop["url"] not in existing_urls:
            prop["status"] = "new"
            prop["first_seen"] = datetime.now().isoformat()
            prop["last_seen"] = datetime.now().isoformat()
            truly_new.append(prop)
            db["properties"].append(prop)
        else:
            # Update existing property
            for existing in db["properties"]:
                if existing["url"] == prop["url"]:
                    existing["last_seen"] = datetime.now().isoformat()
                    existing.update(prop)

    # Update timestamp
    db["last_updated"] = datetime.now().isoformat()

    # Save
    save_database(db)

    return truly_new


def get_status():
    """Get tracking statistics."""
    db = load_database()
    total = len(db["properties"])
    new = sum(1 for p in db["properties"] if p["status"] == "new")
    return {
        "total": total,
        "new": new,
        "last_updated": db["last_updated"]
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 track.py [add|status]")
        sys.exit(1)

    action = sys.argv[1]

    if action == "status":
        stats = get_status()
        print(f"📊 Property Tracker Status")
        print(f"   Total tracked: {stats['total']}")
        print(f"   New properties: {stats['new']}")
        print(f"   Last updated: {stats['last_updated']}")

    elif action == "add":
        if len(sys.argv) < 3:
            print("Usage: python3 track.py add <json_file>")
            sys.exit(1)

        json_file = Path(sys.argv[2])
        with open(json_file) as f:
            new_props = json.load(f)

        truly_new = add_properties(new_props)
        print(f"✅ Added {len(new_props)} truly new properties")
