#!/bin/bash
# Overnight Self-Maintenance - 4:00 AM Daily
# Tasks: 1) Update OpenClaw, 2) Restart Gateway, 3) Report to #monitoring

set -e

WORKSPACE="/Users/ava/.openclaw/workspace"
LOG_FILE="$WORKSPACE/maintenance-4am.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')
CHANNEL="monitoring"  # Telegram channel for monitoring

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "🌙 Overnight Maintenance - 4:00 AM Daily" | tee -a "$LOG_FILE"
echo "Started: $DATE" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"

# Track status
ERRORS=0
UPDATES=""
RESTART_STATUS=""

# Task 1: Update OpenClaw packages
echo "" | tee -a "$LOG_FILE"
echo "📦 TASK 1: Updating OpenClaw packages..." | tee -a "$LOG_FILE"

# Update global OpenClaw CLI
echo "  • Updating OpenClaw CLI..." | tee -a "$LOG_FILE"
if npm update -g @openclaw/cli 2>&1 | tee -a "$LOG_FILE"; then
    UPDATES="$UPDATES✅ OpenClaw CLI updated\n"
else
    UPDATES="$UPDATES⚠️ OpenClaw CLI update skipped (already latest or error)\n"
    ((ERRORS++))
fi

# Update workspace Python packages
echo "  • Updating Python packages..." | tee -a "$LOG_FILE"
cd "$WORKSPACE"
if [ -f "requirements.txt" ]; then
    if pip3 install -r requirements.txt --upgrade 2>&1 | tee -a "$LOG_FILE"; then
        UPDATES="$UPDATES✅ Python packages updated\n"
    else
        UPDATES="$UPDATES⚠️ Python packages update failed\n"
        ((ERRORS++))
    fi
else
    UPDATES="$UPDATES⚠️ No requirements.txt found\n"
fi

# Update skills (if they have requirements)
echo "  • Checking skills for updates..." | tee -a "$LOG_FILE"
SKILL_UPDATES=0
for skill_dir in ~/.openclaw/skills/*/; do
    if [ -f "$skill_dir/requirements.txt" ]; then
        skill_name=$(basename "$skill_dir")
        echo "  • Updating $skill_name..." | tee -a "$LOG_FILE"
        if pip3 install -r "$skill_dir/requirements.txt" --upgrade 2>&1 | tee -a "$LOG_FILE"; then
            ((SKILL_UPDATES++))
        else
            echo "  • ⚠️ Failed to update $skill_name" | tee -a "$LOG_FILE"
            ((ERRORS++))
        fi
    fi
done
UPDATES="$UPDATES✅ Updated $SKILL_UPDATES skills\n"

# Task 2: Restart Gateway
echo "" | tee -a "$LOG_FILE"
echo "🔄 TASK 2: Restarting OpenClaw Gateway..." | tee -a "$LOG_FILE"

# Check if gateway is running
if openclaw gateway status 2>&1 | grep -q "running"; then
    echo "  • Gateway is running, stopping..." | tee -a "$LOG_FILE"
    openclaw gateway stop
    sleep 5

    echo "  • Starting gateway..." | tee -a "$LOG_FILE"
    if openclaw gateway start 2>&1 | tee -a "$LOG_FILE"; then
        RESTART_STATUS="✅ Gateway restarted successfully\n"
    else
        RESTART_STATUS="❌ Gateway restart failed\n"
        ((ERRORS++))
    fi
else
    echo "  • Gateway not running, starting..." | tee -a "$LOG_FILE"
    if openclaw gateway start 2>&1 | tee -a "$LOG_FILE"; then
        RESTART_STATUS="✅ Gateway started successfully\n"
    else
        RESTART_STATUS="❌ Gateway start failed\n"
        ((ERRORS++))
    fi
fi

# Verify gateway status
sleep 5
if openclaw gateway status 2>&1 | grep -q "running"; then
    RESTART_STATUS="$RESTART_STATUS✅ Gateway verified running\n"
else
    RESTART_STATUS="$RESTART_STATUS❌ Gateway not running!\n"
    ((ERRORS++))
fi

# Task 3: Report results
echo "" | tee -a "$LOG_FILE"
echo "📊 TASK 3: Reporting results..." | tee -a "$LOG_FILE"

# Build report
REPORT="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 OVERNIGHT MAINTENANCE REPORT - $DATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 UPDATE SUMMARY:
$UPDATES

🔄 GATEWAY STATUS:
$RESTART_STATUS

⚠️ ERRORS: $ERRORS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

# Log report
echo "$REPORT" | tee -a "$LOG_FILE"

# Send to Telegram (if channel configured)
if [ "$ERRORS" -gt 0 ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "🚨 ALERT: Maintenance completed with $ERRORS errors!" | tee -a "$LOG_FILE"
    # Note: Telegram channel 'monitoring' needs to be configured
    # For now, just log to file
fi

echo "" | tee -a "$LOG_FILE"
echo "✅ Maintenance complete" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"

# Exit with error code if any errors
if [ "$ERRORS" -gt 0 ]; then
    exit 1
else
    exit 0
fi
