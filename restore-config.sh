#!/bin/bash

# Restore OpenClaw Configuration from GitHub Backup
# Run this after cloning workspace on a new machine

set -e

BACKUP_DIR="/Users/ava/.openclaw/workspace/config-backup"

echo "🔓 Restoring OpenClaw configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup existing config (if exists)
if [ -f ~/.openclaw/openclaw.json ]; then
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    echo "📦 Backing up existing config to: ~/.openclaw/openclaw-backup-$BACKUP_DATE.json"
    cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw-backup-$BACKUP_DATE.json
fi

# Restore OpenClaw config
echo "📂 Restoring openclaw.json..."
cp "$BACKUP_DIR/openclaw.json" ~/.openclaw/

# Restore credentials
echo "📂 Restoring credentials..."
cp -r "$BACKUP_DIR/credentials/" ~/.openclaw/

# Restore cron jobs
echo "📂 Restoring cron jobs..."
cp -r "$BACKUP_DIR/cron/" ~/.openclaw/

# Restart OpenClaw gateway
echo ""
echo "🔄 Restarting OpenClaw gateway..."
openclaw gateway restart

echo ""
echo "✅ Configuration restored!"
echo ""
echo "📋 Next steps:"
echo "   1. Update API keys in ~/.zshrc (if needed)"
echo "   2. Run: source ~/.zshrc"
echo "   3. Run: openclaw gateway restart"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
