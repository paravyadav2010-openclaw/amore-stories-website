#!/bin/bash

# OpenClaw Restore Script
# Restores from backup created by backup-complete.sh
#
# Usage:
#   ./restore-complete.sh openclaw-complete-YYYYMMDD_HHMMSS.tar.gz
#
# For encrypted backups:
#   gpg --decrypt openclaw-complete-YYYYMMDD_HHMMSS.tar.gz.gpg | ./restore-complete.sh -
#
# IMPORTANT: This will overwrite existing files!

set -e

if [ -z "$1" ]; then
    echo "❌ Error: No backup file specified"
    echo ""
    echo "Usage: $0 <backup-file.tar.gz>"
    echo ""
    echo "Available backups:"
    ls -lht ~/.openclaw/backups/openclaw-complete-*.tar.gz 2>/dev/null | head -5
    echo ""
    echo "For encrypted backups:"
    echo "  gpg --decrypt backup.tar.gz.gpg | tar -xzf - -C /"
    exit 1
fi

BACKUP_FILE="$1"

# Handle stdin input (for piped decrypted data)
if [ "$BACKUP_FILE" = "-" ]; then
    echo "🔓 Restoring from stdin (decrypted data)..."
    # Backup current state
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    CURRENT_BACKUP="$HOME/openclaw-before-restore-$BACKUP_DATE.tar.gz"

    echo ""
    echo "📦 Backing up current state to: $CURRENT_BACKUP"
    tar -czf "$CURRENT_BACKUP" \
        ~/.openclaw \
        ~/.zshrc \
        ~/.openclaw/workspace \
        --exclude='node_modules' \
        --exclude='venv' \
        2>/dev/null

    echo "✅ Current state backed up"

    # Restore from stdin
    echo ""
    echo "📂 Extracting to root..."
    tar -xzf - -C /

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Restore complete!"
        echo ""
        echo "📋 Next steps:"
        echo "   1. Restart your shell: source ~/.zshrc"
        echo "   2. Restart OpenClaw: openclaw gateway restart"
        echo "   3. Verify everything works: openclaw status"
        echo ""
        echo "💾 Previous backup saved at: $CURRENT_BACKUP"
    else
        echo ""
        echo "❌ Restore failed!"
        echo "💾 Previous backup saved at: $CURRENT_BACKUP"
        echo "   You can restore from it if needed"
        exit 1
    fi
    exit 0
fi

# Regular file backup
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🔓 OpenClaw Restore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  WARNING: This will overwrite existing files!"
echo "   Existing files will be backed up first."
echo ""
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Backup current state
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
CURRENT_BACKUP="$HOME/openclaw-before-restore-$BACKUP_DATE.tar.gz"

echo ""
echo "📦 Backing up current state to: $CURRENT_BACKUP"
tar -czf "$CURRENT_BACKUP" \
    ~/.openclaw \
    ~/.zshrc \
    ~/.openclaw/workspace \
    --exclude='node_modules' \
    --exclude='venv' \
    2>/dev/null

echo "✅ Current state backed up"

# Restore from backup
echo ""
echo "📂 Extracting: $BACKUP_FILE"

tar -xzf "$BACKUP_FILE" -C /

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Restore complete!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Restart your shell: source ~/.zshrc"
    echo "   2. Restart OpenClaw: openclaw gateway restart"
    echo "   3. Verify everything works: openclaw status"
    echo ""
    echo "💾 Previous backup saved at: $CURRENT_BACKUP"
else
    echo ""
    echo "❌ Restore failed!"
    echo "💾 Previous backup saved at: $CURRENT_BACKUP"
    echo "   You can restore from it if needed"
    exit 1
fi
