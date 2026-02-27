#!/bin/bash
# Setup cron job for daily scans

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRON_CMD="cd $SCRIPT_DIR && python3 scanner.py"
CRON_TIME="0 9 * * *"  # 9 AM daily

echo "======================================"
echo "⏰ Cron Job Setup"
echo "======================================"
echo ""

# Check if already exists
if crontab -l 2>/dev/null | grep -q "rental-scanner"; then
    echo "⚠️  Cron job already exists!"
    echo ""
    echo "Current cron entries:"
    crontab -l 2>/dev/null | grep "rental-scanner"
    echo ""
    read -p "Replace existing? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 0
    fi

    # Remove existing entries
    crontab -l 2>/dev/null | grep -v "rental-scanner" | crontab -
fi

# Add new cron job
echo "📅 Adding cron job: $CRON_TIME"
(crontab -l 2>/dev/null; echo "$CRON_TIME $CRON_CMD") | crontab -

echo "✅ Cron job added!"
echo ""
echo "Crontab entries:"
crontab -l | grep "rental-scanner"
echo ""
echo "======================================"
echo "✅ Cron Setup Complete!"
echo "======================================"
echo ""
echo "The scanner will run daily at 9 AM."
echo ""
echo "View cron jobs:    crontab -l"
echo "Edit cron jobs:    crontab -e"
echo "Remove cron job:   crontab -e (delete the line)"
echo ""
