#!/bin/bash
# File watcher for Obsidian-OpenClaw vault - Auto-syncs to GitHub

VAULT_PATH="$HOME/Documents/Obsidian-OpenClaw"
LOG_FILE="$HOME/.openclaw/workspace/logs/watch-sync-obsidian.log"

mkdir -p "$(dirname "$LOG_FILE")"

echo "=== $(date '+%Y-%m-%d %H:%M:%S') === Starting file watcher for Obsidian-OpenClaw ===" >> "$LOG_FILE"
echo "Monitoring: $VAULT_PATH" >> "$LOG_FILE"

# Function to sync changes
sync_changes() {
    echo "=== $(date '+%Y-%m-%d %H:%M:%S') === Changes detected, syncing... ===" >> "$LOG_FILE"
    cd "$VAULT_PATH" || exit 1

    # Check for changes
    if git diff-index --quiet HEAD -- 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard)" ]; then
        echo "No changes to commit" >> "$LOG_FILE"
    else
        git add -A
        git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE" 2>&1
        git push origin main >> "$LOG_FILE" 2>&1
        echo "✅ Changes synced to GitHub" >> "$LOG_FILE"
    fi
}

# Install fswatch if not present
if ! command -v fswatch &> /dev/null; then
    echo "Installing fswatch..." >> "$LOG_FILE"
    brew install fswatch >> "$LOG_FILE" 2>&1
fi

# Watch for changes and sync
echo "Watching for changes..." >> "$LOG_FILE"
fswatch -o -r "$VAULT_PATH" | while read event; do
    # Debounce - wait 2 seconds after last change
    sleep 2
    sync_changes
done
