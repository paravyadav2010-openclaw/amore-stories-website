#!/usr/bin/env python3
"""
Constant Improvement System - Scan sites and generate suggestions

Runs twice daily to scan configured sites, analyze content, reference against
projects, and provide actionable improvement suggestions.
"""

import json
import sys
import os
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re

# Configuration
CONFIG_FILE = "/Users/ava/.openclaw/workspace/improvement-sites.json"
LOG_FILE = "/Users/ava/.openclaw/workspace/improvement-results.log"
TELEGRAM_CHAT_ID = "1875972778"

# Try to get Telegram token from environment, fallback to .zshrc
TELEGRAM_TOKEN = os.getenv("OPENCLAW_TELEGRAM_BOT_TOKEN", "")
if not TELEGRAM_TOKEN:
    # Read token from .zshrc
    try:
        with open(os.path.expanduser("~/.zshrc"), 'r') as f:
            for line in f:
                if line.startswith('export OPENCLAW_TELEGRAM_BOT_TOKEN='):
                    TELEGRAM_TOKEN = line.split('=')[1].strip().strip('"')
                    break
    except Exception as e:
        print(f"⚠️  Could not read token from .zshrc: {e}", file=sys.stderr)

# Load configuration
def load_config():
    """Load site and project configuration."""
    try:
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading config: {e}", file=sys.stderr)
        sys.exit(1)

# Fetch content from URL
def fetch_content(url):
    """Fetch HTML content from URL."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"⚠️  Error fetching {url}: {e}", file=sys.stderr)
        return None

# Analyze content for improvements
def analyze_content(content, categories, projects):
    """Analyze content and generate improvement suggestions."""
    suggestions = []

    if not content:
        return suggestions

    soup = BeautifulSoup(content, 'html.parser')

    # Extract text content
    text = soup.get_text(separator=' ', strip=True)

    # Sample analysis (in real implementation, use NLP/LLM)
    for category in categories:
        # Look for keywords related to category
        keywords = {
            'productivity': ['efficiency', 'workflow', 'automation', 'save time', 'productivity'],
            'technology': ['AI', 'automation', 'software', 'tool', 'technology'],
            'automation': ['script', 'automation', 'workflow', 'automate'],
            'software': ['code', 'programming', 'software', 'app', 'develop'],
            'urban planning': ['city', 'planning', 'transport', 'infrastructure']
        }

        if category in keywords:
            found_keywords = [kw for kw in keywords[category] if kw.lower() in text.lower()]
            if found_keywords:
                suggestions.append({
                    'category': category,
                    'keywords': found_keywords,
                    'confidence': 'medium'
                })

    # Project relevance analysis
    for project in projects:
        project_keywords = project['focus']
        found_keywords = [kw for kw in project_keywords if kw.lower() in text.lower()]

        if found_keywords:
            suggestions.append({
                'category': f'project: {project["name"]}',
                'keywords': found_keywords,
                'confidence': 'high' if len(found_keywords) >= 2 else 'medium'
            })

    return suggestions

# Generate suggestion message
def generate_suggestion(suggestion, index, total):
    """Generate formatted suggestion message."""
    priority = get_priority(suggestion['confidence'])

    message = f"""
**{index + 1}/{total} Suggestion Found: {suggestion['category']}**

📊 Confidence: {suggestion['confidence'].upper()}
🚩 Priority: {priority}

**Key Keywords Found:**
{', '.join(suggestion['keywords'][:5])}

💡 This content may relate to:
- Your projects and interests
- Areas for improvement
- New tools or techniques to explore

---
Suggested action: Research this topic further and consider applying it to your work.
"""

    return message.strip()

# Get priority based on confidence
def get_priority(confidence):
    """Map confidence to priority level."""
    if confidence == 'high':
        return '🔴 HIGH'
    elif confidence == 'medium':
        return '🟡 MEDIUM'
    else:
        return '🟢 LOW'

# Send to Telegram
def send_to_telegram(messages):
    """Send improvement suggestions to Telegram."""
    if not TELEGRAM_TOKEN:
        print("⚠️  No Telegram token configured", file=sys.stderr)
        return False

    # Format as single message
    full_message = "🚀 CONSTANT IMPROVEMENT SUGGESTIONS\n"
    full_message += f"📅 Scan Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S NZT')}\n"
    full_message += f"📍 Source: Multiple sites\n"
    full_message += f"📂 Categories: Moltbook, Moltcities, Reddit\n\n"
    full_message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

    for i, msg in enumerate(messages, 1):
        full_message += msg + "\n\n"
        full_message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

    full_message += "💡 Review these suggestions and take action as needed!"

    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        data = {
            'chat_id': TELEGRAM_CHAT_ID,
            'text': full_message,
            'parse_mode': 'Markdown',
            'disable_web_page_preview': True
        }

        response = requests.post(url, json=data, timeout=30)
        response.raise_for_status()

        print(f"✅ Sent {len(messages)} suggestions to Telegram", file=sys.stderr)
        return True
    except Exception as e:
        print(f"❌ Error sending to Telegram: {e}", file=sys.stderr)
        return False

# Main function
def main():
    """Main execution function."""
    print(f"🔍 Starting Constant Improvement Scan - {datetime.now().strftime('%Y-%m-%d %H:%M:%S NZT')}", file=sys.stderr)

    # Load configuration
    config = load_config()
    sites = config.get('sites', [])
    projects = config.get('projects', [])
    categories = []
    for site in sites:
        categories.extend(site.get('categories', []))
    categories = list(set(categories))  # Remove duplicates

    print(f"📊 Scanning {len(sites)} sites", file=sys.stderr)
    print(f"📂 Categories: {', '.join(categories)}", file=sys.stderr)
    print(f"🎯 Projects: {', '.join([p['name'] for p in projects])}", file=sys.stderr)

    all_suggestions = []
    scanned_sites = 0

    # Scan each site
    for site in sites:
        site_name = site['name']
        site_url = site['url']

        print(f"📡 Scanning {site_name}...", file=sys.stderr)

        content = fetch_content(site_url)
        if content:
            suggestions = analyze_content(content, categories, projects)
            if suggestions:
                for suggestion in suggestions:
                    suggestion['site'] = site_name
                    suggestion['url'] = site_url
                    all_suggestions.append(suggestion)
                print(f"   ✅ Found {len(suggestions)} suggestions", file=sys.stderr)
            else:
                print(f"   ℹ️  No suggestions found", file=sys.stderr)
            scanned_sites += 1
        else:
            print(f"   ❌ Failed to fetch content", file=sys.stderr)

    # Limit suggestions
    max_suggestions = config.get('suggestionFormat', {}).get('maxSuggestionsPerScan', 5)
    all_suggestions = all_suggestions[:max_suggestions]

    print(f"\n✅ Scan complete: {scanned_sites}/{len(sites)} sites scanned", file=sys.stderr)
    print(f"💡 Found {len(all_suggestions)} improvement suggestions", file=sys.stderr)

    # Generate message
    messages = []
    for i, suggestion in enumerate(all_suggestions):
        msg = generate_suggestion(suggestion, i, len(all_suggestions))
        messages.append(msg)

    # Log results
    with open(LOG_FILE, 'a') as f:
        f.write(f"\n=== Scan at {datetime.now().strftime('%Y-%m-%d %H:%M:%S NZT')} ===\n")
        f.write(f"Scanned sites: {scanned_sites}/{len(sites)}\n")
        f.write(f"Found suggestions: {len(all_suggestions)}\n")
        for suggestion in all_suggestions:
            f.write(f"  - {suggestion['site']}: {suggestion['category']}\n")

    # Send to Telegram
    if messages:
        success = send_to_telegram(messages)
        if success:
            print("✅ Improvement suggestions sent to Telegram", file=sys.stderr)
            return 0
        else:
            print("❌ Failed to send suggestions", file=sys.stderr)
            return 1
    else:
        print("ℹ️  No suggestions to send", file=sys.stderr)
        return 0

if __name__ == '__main__':
    sys.exit(main())
