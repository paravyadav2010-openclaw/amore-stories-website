#!/bin/bash
# Stop file watcher for Obsidian-OpenClaw

PID_FILE="$HOME/.openclaw/workspace/logs/watcher.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "Watcher not running (no PID file found)"
    exit 1
fi

PID=$(cat "$PID_FILE")

if ps -p "$PID" > /dev/null 2>&1; then
    echo "Stopping watcher (PID: $PID)..."
    kill "$PID"
    rm "$PID_FILE"
    echo "Watcher stopped"
else
    echo "Watcher not running (stale PID file)"
    rm "$PID_FILE"
fi
