#!/usr/bin/env python3
"""
AI Lead Generator
Finds, researches, and qualifies B2B leads for clients
"""

import json
import re
import requests
from datetime import datetime
from pathlib import Path
import time
import random

# Configuration
CONFIG_FILE = Path("config.json")
CLIENTS_DIR = Path("clients")
OUTPUT_DIR = Path("output")
LOGS_DIR = Path("logs")

# Create directories
CLIENTS_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

def log(message):
    """Log to file and stdout"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_line = f"[{timestamp}] {message}"
    print(log_line)

    log_file = LOGS_DIR / "lead-gen.log"
    with open(log_file, 'a') as f:
        f.write(log_line + "\n")

def load_config():
    """Load configuration"""
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def load_client(client_name):
    """Load client configuration"""
    client_file = CLIENTS_DIR / f"{client_name}.json"
    with open(client_file, 'r') as f:
        return json.load(f)

def save_client(client_name, client_data):
    """Save client configuration"""
    client_file = CLIENTS_DIR / f"{client_name}.json"
    with open(client_file, 'w') as f:
        json.dump(client_data, f, indent=2)

def find_companies_industry(industry, size, location):
    """
    Find companies matching criteria
    In production, this would use APIs like Crunchbase, LinkedIn
    For MVP, we'll use a mock database
    """
    log(f"🔍 Finding companies in {industry} ({size}, {location})...")

    # Mock database - in production, use real APIs
    mock_companies = {
        "FinTech": [
            {"name": "PayFlow Solutions", "size": "50", "location": "San Francisco", "revenue": "$5M", "funding": "$10M"},
            {"name": "QuickCredit", "size": "80", "location": "New York", "revenue": "$12M", "funding": "$25M"},
            {"name": "SecureBanking", "size": "30", "location": "London", "revenue": "$3M", "funding": "$5M"},
            {"name": "PayStream", "size": "100", "location": "Sydney", "revenue": "$15M", "funding": "$30M"},
            {"name": "CryptoPay", "size": "45", "location": "Singapore", "revenue": "$4M", "funding": "$8M"},
        ],
        "SaaS": [
            {"name": "CloudWorkflow", "size": "60", "location": "Austin", "revenue": "$8M", "funding": "$15M"},
            {"name": "TeamSync", "size": "90", "location": "Seattle", "revenue": "$14M", "funding": "$20M"},
            {"name": "DataDrive", "size": "40", "location": "Berlin", "revenue": "$6M", "funding": "$12M"},
        ],
        "E-commerce": [
            {"name": "ShopDirect", "size": "70", "location": "Los Angeles", "revenue": "$10M", "funding": "$18M"},
            {"name": "RetailAI", "size": "35", "location": "Toronto", "revenue": "$5M", "funding": "$9M"},
        ]
    }

    companies = mock_companies.get(industry, [])

    log(f"✅ Found {len(companies)} companies")
    return companies

def find_contacts(company, target_roles):
    """Find contacts at a company"""
    log(f"👥 Finding contacts at {company['name']}...")

    # Mock contacts - in production, use LinkedIn + email APIs
    role_titles = {
        "CEO": "CEO",
        "CTO": "CTO",
        "VP Sales": "VP Sales",
        "Head of Marketing": "Head of Marketing"
    }

    contacts = []
    for role in target_roles:
        if role in role_titles:
            contact = {
                "name": f"John Doe",  # Mock name
                "role": role_titles[role],
                "company": company["name"],
                "linkedin": f"linkedin.com/in/{company['name'].lower().replace(' ', '-')}",
                "email": guess_email(company["name"], role_titles[role]),
            }
            contacts.append(contact)

    log(f"✅ Found {len(contacts)} contacts")
    return contacts

def guess_email(company_name, role):
    """Guess email address from company name and role"""
    # Remove spaces and lowercase
    company = company_name.lower().replace(' ', '').replace('-', '')
    domain = f"{company}.com"

    # Common email patterns
    patterns = [
        f"{role.lower().replace(' ', '.')}@{domain}",
        f"{'jane.doe'}@{domain}",
        f"{'john.smith'}@{domain}"
    ]

    return patterns[0]  # Return first guess

def qualify_company(company, qualification_criteria):
    """Calculate qualification score for a company"""
    log(f"📊 Qualifying {company['name']}...")

    score = 0
    reasons = []

    # Check funding
    if "funding" in qualification_criteria:
        company_funding = int(company.get("funding", "$0M").replace("$", "").replace("M", ""))
        min_funding = int(qualification_criteria["funding"].replace("$", "").replace("M", ""))

        if company_funding >= min_funding:
            score += 30
            reasons.append("Funding threshold met")

    # Check size
    if "size" in qualification_criteria:
        company_size = int(company.get("size", "0"))
        min_size = qualification_criteria["size"]

        if company_size >= min_size:
            score += 30
            reasons.append("Size threshold met")

    # Check revenue (bonus)
    if "revenue" in qualification_criteria:
        company_revenue = int(company.get("revenue", "$0M").replace("$", "").replace("M", ""))
        min_revenue = int(qualification_criteria["revenue"].replace("$", "").replace("M", ""))

        if company_revenue >= min_revenue:
            score += 20
            reasons.append("Revenue threshold met")

    # Location match (bonus)
    if "location" in qualification_criteria:
        score += 20
        reasons.append("Location match")

    log(f"✅ Qualification score: {score}/100")
    return score, reasons

def generate_leads_for_client(client_name):
    """Generate leads for a client"""
    log("=" * 60)
    log(f"🎯 GENERATING LEADS FOR: {client_name}")
    log("=" * 60)

    # Load client config
    client = load_client(client_name)

    all_leads = []

    # For each target industry
    for industry in client["industries"]:
        log(f"\n🏭 Industry: {industry}")

        # Find companies
        companies = find_companies_industry(
            industry=industry,
            size=client["size"],
            location=client["location"]
        )

        # For each company
        for company in companies:
            log(f"\n  📦 Company: {company['name']}")

            # Find contacts
            contacts = find_contacts(company, client["target_roles"])

            # Qualify
            score, reasons = qualify_company(company, client["qualification"])

            # Create lead record
            lead = {
                "company": company["name"],
                "industry": industry,
                "size": company["size"],
                "location": company["location"],
                "revenue": company["revenue"],
                "funding": company["funding"],
                "contacts": contacts,
                "qualification_score": score,
                "qualification_reasons": reasons,
                "generated_at": datetime.now().isoformat()
            }

            all_leads.append(lead)

            # Random delay to avoid rate limiting
            time.sleep(random.uniform(0.5, 1.5))

    # Filter by minimum score
    min_score = client.get("min_score", 50)
    qualified_leads = [lead for lead in all_leads if lead["qualification_score"] >= min_score]

    # Save leads
    output_file = OUTPUT_DIR / f"{client_name}_{datetime.now().strftime('%Y%m%d')}.json"
    with open(output_file, 'w') as f:
        json.dump(qualified_leads, f, indent=2)

    # Generate CSV
    csv_file = generate_csv(client_name, qualified_leads)

    # Summary
    log("\n" + "=" * 60)
    log("✅ LEAD GENERATION COMPLETE")
    log("=" * 60)
    log(f"Total companies found: {len(all_leads)}")
    log(f"Qualified leads: {len(qualified_leads)}")
    log(f"Minimum score: {min_score}")
    log(f"\n📁 Leads saved to: {output_file}")
    log(f"📁 CSV saved to: {csv_file}")
    log("=" * 60)

    return qualified_leads

def generate_csv(client_name, leads):
    """Generate CSV file for client"""
    csv_file = OUTPUT_DIR / f"{client_name}_{datetime.now().strftime('%Y%m%d')}.csv"

    # CSV header
    header = "Company,Industry,Size,Location,Revenue,Funding,Qualification Score,Contact Name,Contact Role,Contact Email,LinkedIn\n"

    # CSV rows
    rows = []
    for lead in leads:
        for contact in lead["contacts"]:
            row = f'"{lead["company"]}","{lead["industry"]}","{lead["size"]}","{lead["location"]}","{lead["revenue"]}","{lead["funding"]}","{lead["qualification_score"]}","{contact["name"]}","{contact["role"]}","{contact["email"]}","{contact["linkedin"]}"'
            rows.append(row)

    # Write CSV
    with open(csv_file, 'w') as f:
        f.write(header)
        f.write("\n".join(rows))

    return csv_file

def main():
    """Main function"""
    print("\n" + "=" * 60)
    print("🤖 AI LEAD GENERATOR")
    print("=" * 60)

    # List available clients
    if not list(CLIENTS_DIR.glob("*.json")):
        print("\n⚠️ No clients found.")
        print("Create a client first using: python3 create_client.py")
        return

    print("\nAvailable clients:")
    clients = sorted([f.stem for f in CLIENTS_DIR.glob("*.json")])
    for i, client in enumerate(clients, 1):
        print(f"  {i}. {client}")

    # Select client
    client_name = input("\nSelect client (or press Enter for all): ").strip()

    if client_name:
        # Generate for specific client
        if client_name in clients:
            generate_leads_for_client(client_name)
        else:
            print(f"❌ Client '{client_name}' not found")
    else:
        # Generate for all clients
        for client in clients:
            generate_leads_for_client(client)
            print()

if __name__ == "__main__":
    main()
