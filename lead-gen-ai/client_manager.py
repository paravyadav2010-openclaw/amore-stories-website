#!/usr/bin/env python3
"""
Client Management
Create, update, and manage clients
"""

import json
from pathlib import Path
from datetime import datetime

CLIENTS_DIR = Path("clients")
CLIENTS_DIR.mkdir(exist_ok=True)

def create_client():
    """Create a new client"""
    print("\n" + "=" * 60)
    print("👤 CREATE NEW CLIENT")
    print("=" * 60)

    # Get client details
    client = {}

    print("\nClient Information:")
    client["name"] = input("Client name (e.g., Acme SaaS): ").strip()
    client["industry_focus"] = input("Industry focus (e.g., FinTech, SaaS): ").strip()
    client["company_size"] = input("Company size target (e.g., 20-100): ").strip()

    print("\nSearch Criteria:")
    industries_input = input("Target industries (comma-separated, e.g., FinTech,SaaS): ").strip()
    client["industries"] = [i.strip() for i in industries_input.split(",")]

    client["location"] = input("Target locations (e.g., USA,UK,Australia): ").strip()
    client["size"] = int(input("Minimum company size (employees): ").strip())

    print("\nContact Roles:")
    roles_input = input("Target roles (comma-separated, e.g., CEO,CTO,VP Sales): ").strip()
    client["target_roles"] = [r.strip() for r in roles_input.split(",")]

    print("\nQualification Criteria:")
    client["qualification"] = {}

    funding = input("Minimum funding ($X M format, e.g., $1M): ").strip() or "$0M"
    client["qualification"]["funding"] = funding

    revenue = input("Minimum revenue ($X M format, e.g., $1M): ").strip() or "$0M"
    client["qualification"]["revenue"] = revenue

    print("\nService Details:")
    client["tier"] = input("Service tier (Starter/Pro/Enterprise): ").strip() or "Starter"
    client["monthly_leads"] = int(input("Leads per month: ").strip() or "500")
    client["monthly_fee"] = float(input("Monthly fee ($): ").strip() or "1000")
    client["min_score"] = int(input("Minimum qualification score (0-100): ").strip() or "50")

    client["created_at"] = datetime.now().isoformat()
    client["status"] = "active"

    # Save client
    client_file = CLIENTS_DIR / f"{client['name'].lower().replace(' ', '_')}.json"
    with open(client_file, 'w') as f:
        json.dump(client, f, indent=2)

    print("\n" + "=" * 60)
    print("✅ CLIENT CREATED")
    print("=" * 60)
    print(f"Name: {client['name']}")
    print(f"Industry: {client['industry_focus']}")
    print(f"Tier: {client['tier']}")
    print(f"Monthly leads: {client['monthly_leads']}")
    print(f"Monthly fee: ${client['monthly_fee']}")
    print(f"\n📁 Saved to: {client_file}")
    print("=" * 60)

def list_clients():
    """List all clients"""
    print("\n" + "=" * 60)
    print("📋 CLIENTS")
    print("=" * 60)

    client_files = sorted(CLIENTS_DIR.glob("*.json"))

    if not client_files:
        print("\nNo clients found.")
        return

    for client_file in client_files:
        with open(client_file, 'r') as f:
            client = json.load(f)

        status_icon = "🟢" if client["status"] == "active" else "🔴"

        print(f"\n{status_icon} {client['name']}")
        print(f"  Industry: {client['industry_focus']}")
        print(f"  Tier: {client['tier']}")
        print(f"  Leads: {client['monthly_leads']}/month")
        print(f"  Fee: ${client['monthly_fee']}/month")
        print(f"  Status: {client['status']}")

    print("\n" + "=" * 60)

def view_client(client_name):
    """View client details"""
    client_file = CLIENTS_DIR / f"{client_name.lower().replace(' ', '_')}.json"

    if not client_file.exists():
        print(f"❌ Client '{client_name}' not found")
        return

    with open(client_file, 'r') as f:
        client = json.load(f)

    print("\n" + "=" * 60)
    print(f"👤 {client['name'].upper()}")
    print("=" * 60)

    print(f"\n📊 Industry: {client['industry_focus']}")
    print(f"📊 Size target: {client['company_size']}")
    print(f"📊 Tier: {client['tier']}")
    print(f"💰 Monthly fee: ${client['monthly_fee']}")
    print(f"📋 Leads per month: {client['monthly_leads']}")
    print(f"🎯 Minimum score: {client['min_score']}")
    print(f"✅ Status: {client['status']}")

    print("\n🔍 Search Criteria:")
    print(f"  Industries: {', '.join(client['industries'])}")
    print(f"  Location: {client['location']}")
    print(f"  Minimum size: {client['size']} employees")
    print(f"  Target roles: {', '.join(client['target_roles'])}")

    print("\n📊 Qualification:")
    print(f"  Minimum funding: {client['qualification']['funding']}")
    print(f"  Minimum revenue: {client['qualification']['revenue']}")

    print(f"\n📅 Created: {client['created_at']}")
    print("=" * 60)

def main():
    """Main function"""
    print("\n" + "=" * 60)
    print("👤 CLIENT MANAGEMENT")
    print("=" * 60)

    while True:
        print("\nOptions:")
        print("  1. Create new client")
        print("  2. List all clients")
        print("  3. View client details")
        print("  4. Exit")

        choice = input("\nSelect option: ").strip()

        if choice == "1":
            create_client()
        elif choice == "2":
            list_clients()
        elif choice == "3":
            client_name = input("Client name: ").strip()
            view_client(client_name)
        elif choice == "4":
            print("\n👋 Goodbye!")
            break
        else:
            print("❌ Invalid option")

if __name__ == "__main__":
    main()
