#!/bin/bash
# Auto-sync Obsidian Notes to GitHub
# Run every 30 minutes via cron

VAULT_PATH="$HOME/Documents/Obsidian Notes"
LOG_FILE="$HOME/.openclaw/workspace/logs/obsidian-sync.log"

mkdir -p "$(dirname "$LOG_FILE")"

echo "=== $(date '+%Y-%m-%d %H:%M:%S') === Starting Obsidian sync ===" >> "$LOG_FILE"

cd "$VAULT_PATH" || exit 1

# Check for changes
if git diff-index --quiet HEAD --; then
    echo "No changes to commit" >> "$LOG_FILE"
else
    echo "Changes detected, committing..." >> "$LOG_FILE"
    git add -A
    git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE" 2>&1
    git push origin main >> "$LOG_FILE" 2>&1
    echo "Changes pushed to GitHub" >> "$LOG_FILE"
fi

echo "=== Sync complete ===" >> "$LOG_FILE"
