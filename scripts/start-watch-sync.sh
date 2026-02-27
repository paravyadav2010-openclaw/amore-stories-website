#!/bin/bash
# Start file watcher for Obsidian-OpenClaw in background

WATCHER_SCRIPT="$HOME/.openclaw/workspace/scripts/watch-sync-obsidian.sh"
PID_FILE="$HOME/.openclaw/workspace/logs/watcher.pid"
LOG_FILE="$HOME/.openclaw/workspace/logs/watcher-start.log"

mkdir -p "$(dirname "$PID_FILE")"
mkdir -p "$(dirname "$LOG_FILE")"

# Check if already running
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Watcher already running (PID: $PID)" >> "$LOG_FILE"
        exit 1
    else
        echo "Removing stale PID file" >> "$LOG_FILE"
        rm "$PID_FILE"
    fi
fi

# Start watcher in background
echo "=== $(date '+%Y-%m-%d %H:%M:%S') === Starting watcher ===" >> "$LOG_FILE"
nohup "$WATCHER_SCRIPT" >> "$HOME/.openclaw/workspace/logs/watcher-output.log" 2>&1 &
echo $! > "$PID_FILE"

echo "Watcher started (PID: $(cat $PID_FILE))" >> "$LOG_FILE"
echo "Logs: $HOME/.openclaw/workspace/logs/watcher-output.log"
