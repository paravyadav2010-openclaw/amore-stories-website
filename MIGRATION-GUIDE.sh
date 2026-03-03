#!/bin/bash
# OpenClaw Migration Script
# Use this to migrate OpenClaw to a new computer

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 OpenClaw Migration Assistant"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Detect operation
case "$1" in
  "backup")
    echo "📦 Creating OpenClaw backup..."
    cd ~/.openclaw
    tar -czf openclaw-migration-$(date '+%Y%m%d-%H%M').tar.gz \
      --exclude='*.log' \
      --exclude='.DS_Store' \
      --exclude='cache/' \
      --exclude='tmp/' \
      workspace/ \
      agents/ \
      browser/ \
      cron/ \
      openclaw.json \
      *.md 2>/dev/null
    echo "✅ Backup created: openclaw-migration-*.tar.gz"
    ;;

  "obsidian")
    echo "📦 Creating Obsidian vault backup..."
    cd ~/Documents
    tar -czf Obsidian-OpenClaw-backup-$(date '+%Y%m%d').tar.gz \
      Obsidian-OpenClaw/
    echo "✅ Backup created: Obsidian-OpenClaw-backup-*.tar.gz"
    ;;

  "restore")
    if [ -z "$2" ]; then
      echo "❌ Error: Please provide backup file path"
      echo "Usage: ./MIGRATION-GUIDE.sh restore <path-to-backup>"
      exit 1
    fi
    echo "📥 Restoring OpenClaw from backup: $2"
    tar -xzf "$2" -C ~/.openclaw/
    echo "✅ OpenClaw restored"
    ;;

  "verify")
    echo "🔍 Verifying OpenClaw installation..."
    echo ""

    # Check core files
    echo "Checking core files..."
    [ -f ~/.openclaw/openclaw.json ] && echo "  ✅ openclaw.json" || echo "  ❌ openclaw.json"
    [ -f ~/.openclaw/workspace/SOUL.md ] && echo "  ✅ workspace/SOUL.md" || echo "  ❌ workspace/SOUL.md"
    [ -f ~/.openclaw/workspace/USER.md ] && echo "  ✅ workspace/USER.md" || echo "  ❌ workspace/USER.md"
    echo ""

    # Check directories
    echo "Checking directories..."
    [ -d ~/.openclaw/workspace ] && echo "  ✅ workspace/" || echo "  ❌ workspace/"
    [ -d ~/.openclaw/agents ] && echo "  ✅ agents/" || echo "  ❌ agents/"
    [ -d ~/.openclaw/browser ] && echo "  ✅ browser/" || echo "  ❌ browser/"
    echo ""

    # Check Obsidian
    echo "Checking Obsidian vault..."
    [ -d ~/Documents/Obsidian-OpenClaw ] && echo "  ✅ Obsidian-OpenClaw/" || echo "  ❌ Obsidian-OpenClaw/"
    echo ""

    # Check GitHub
    echo "Checking GitHub sync..."
    cd ~/.openclaw/workspace
    git remote -v | grep -q github && echo "  ✅ GitHub remote configured" || echo "  ⚠️ GitHub remote not configured"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Verification complete"
    ;;

  "status")
    echo "📊 Migration Status"
    echo ""
    echo "Available backups:"
    ls -lh ~/.openclaw/openclaw-migration*.tar.gz 2>/dev/null | tail -3
    ls -lh ~/Documents/Obsidian-OpenClaw-backup*.tar.gz 2>/dev/null | tail -3
    ;;

  "help"|*)
    cat << 'EOF'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 OpenClaw Migration Assistant
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE:
  ./MIGRATION-GUIDE.sh <command> [options]

COMMANDS:
  backup           Create OpenClaw backup
  obsidian         Create Obsidian vault backup
  restore <file>   Restore from backup file
  verify           Verify OpenClaw installation
  status           Show available backups
  help             Show this help message

EXAMPLES:
  # Create backups
  ./MIGRATION-GUIDE.sh backup
  ./MIGRATION-GUIDE.sh obsidian

  # Restore on new computer
  ./MIGRATION-GUIDE.sh restore ~/Downloads/openclaw-migration-20260303.tar.gz

  # Verify installation
  ./MIGRATION-GUIDE.sh verify

  # Check backup status
  ./MIGRATION-GUIDE.sh status

MIGRATION CHECKLIST:
  [ ] Run: ./MIGRATION-GUIDE.sh backup
  [ ] Run: ./MIGRATION-GUIDE.sh obsidian
  [ ] Transfer both .tar.gz files to new computer (USB/cloud)
  [ ] Install OpenClaw CLI on new computer
  [ ] Run: ./MIGRATION-GUIDE.sh restore <backup-file>
  [ ] Run: ./MIGRATION-GUIDE.sh verify
  [ ] Test: openclaw gateway start
  [ ] Test: Open Telegram chat with Cloye

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
    ;;
esac
