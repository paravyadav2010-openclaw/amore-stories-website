#!/bin/bash

# 2-Hourly Git Backup Script for OpenClaw Workspace
# Runs every 2 hours via cron

WORKSPACE="/Users/ava/.openclaw/workspace"
LOG_FILE="$WORKSPACE/git-backup-hourly.log"
REMOTE_REPO="https://github.com/paravyadav2010-openclaw/openclaw-workspace"
OBSIDIAN_VAULT="$HOME/Documents/Obsidian Notes"
OBSIDIAN_GIT_REPO="git@github.com:paravyadav2010-openclaw/openclaw-workspace.git"

echo "🔄 2-Hourly Git Backup - $(date)" >> "$LOG_FILE"

# Sync Obsidian Vault first
if [ -d "$OBSIDIAN_VAULT" ]; then
    echo "📝 Syncing Obsidian Vault..." >> "$LOG_FILE"
    cd "$OBSIDIAN_VAULT" || exit 1
    if [ -n "$(git status --porcelain)" ]; then
        git add -A
        git commit -m "📝 Obsidian backup: $(date '+%Y-%m-%d %H:%M:%S NZT')" --quiet 2>> "$LOG_FILE"
        echo "✅ Obsidian synced" >> "$LOG_FILE"
    else
        echo "✅ No Obsidian changes" >> "$LOG_FILE"
    fi
fi

cd "$WORKSPACE" || exit 1

# Check if there are any changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Changes detected, committing..." >> "$LOG_FILE"

    # Add only tracked and untracked files (respects .gitignore)
    git add -A
    git commit -m "🤖 2-hourly backup: $(date '+%Y-%m-%d %H:%M:%S NZT')" --quiet 2>> "$LOG_FILE"

    # Push to remote
    if git remote | grep -q "origin"; then
        git push origin main --quiet 2>> "$LOG_FILE"
        echo "✅ Backup completed at $(date '+%Y-%m-%d %H:%M:%S NZT')" >> "$LOG_FILE"
    else
        echo "⚠️  No remote configured" >> "$LOG_FILE"
    fi
else
    echo "✅ No changes detected, skipping backup" >> "$LOG_FILE"
fi
