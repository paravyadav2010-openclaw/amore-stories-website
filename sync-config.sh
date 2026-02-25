#!/bin/bash

# Sync OpenClaw configuration to workspace for GitHub backup
# Run this after making changes to OpenClaw config

BACKUP_DIR="/Users/ava/.openclaw/workspace/config-backup"

echo "🔄 Syncing OpenClaw configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup OpenClaw config
echo "📦 Backing up openclaw.json..."
cp ~/.openclaw/openclaw.json "$BACKUP_DIR/"

# Backup credentials
echo "📦 Backing up credentials..."
rm -rf "$BACKUP_DIR/credentials/"
cp -r ~/.openclaw/credentials/ "$BACKUP_DIR/"

# Backup cron jobs
echo "📦 Backing up cron jobs..."
rm -rf "$BACKUP_DIR/cron/"
cp -r ~/.openclaw/cron/ "$BACKUP_DIR/"

# Commit and push to GitHub
echo ""
echo "📤 Committing to GitHub..."
cd /Users/ava/.openclaw/workspace
git add config-backup/
git commit -m "🔄 Config sync: $(date '+%Y-%m-%d %H:%M:%S NZT')" --quiet
git push origin main --quiet

echo ""
echo "✅ Configuration synced to GitHub!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
