#!/bin/bash

# OpenClaw Workspace Restore Script
# Restores workspace from git repository or backup files

WORKSPACE="/Users/ava/.openclaw/workspace"
BACKUP_DIR="/Users/ava/.openclaw/workspace/backups"

echo "🔧 OpenClaw Workspace Restore Utility"
echo "====================================="
echo ""

# Check if workspace directory exists
if [ ! -d "$WORKSPACE" ]; then
    echo "❌ ERROR: Workspace directory not found: $WORKSPACE"
    echo "Creating directory..."
    mkdir -p "$WORKSPACE"
else
    echo "✅ Workspace directory found: $WORKSPACE"
fi

# List available backups
echo ""
echo "📦 Available backups:"
echo "-------------------"
ls -lh "$BACKUP_DIR"/workspace-*.tar.gz 2>/dev/null || echo "No backup files found in: $BACKUP_DIR"
echo ""

# Ask user which restore method to use
echo "Select restore method:"
echo "1. Restore from latest backup file"
echo "2. Restore from git repository"
echo "3. Interactive restore (show all options)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        # Restore from latest backup file
        LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/workspace-*.tar.gz 2>/dev/null | head -1)

        if [ -z "$LATEST_BACKUP" ]; then
            echo "❌ ERROR: No backup files found"
            exit 1
        fi

        echo "📝 Restoring from: $LATEST_BACKUP"
        read -p "Continue? (y/n): " confirm

        if [[ $confirm =~ ^[Yy]$ ]]; then
            # Backup current workspace
            echo ""
            echo "📦 Creating backup of current workspace..."
            BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
            tar -czf "$BACKUP_DIR/workspace-before-restore-$BACKUP_DATE.tar.gz" \
                --exclude='.git' \
                --exclude='venv' \
                --exclude='credentials' \
                --exclude='logs' \
                --exclude='dashboard' \
                --exclude='.DS_Store' \
                --exclude='Thumbs.db' \
                . 2>/dev/null || true

            # Restore from backup
            echo "🔄 Restoring workspace..."
            cd "$WORKSPACE" || exit 1
            tar -xzf "$LATEST_BACKUP" --strip-components=1

            echo "✅ Restore completed successfully"
        else
            echo "❌ Restore cancelled"
        fi
        ;;

    2)
        # Restore from git
        cd "$WORKSPACE" || exit 1

        if [ -z "$(git status --porcelain)" ]; then
            echo "✅ Workspace is clean (no uncommitted changes)"
            read -p "Restore to latest commit? (y/n): " confirm

            if [[ $confirm =~ ^[Yy]$ ]]; then
                echo "🔄 Restoring from git..."
                git reset --hard HEAD
                echo "✅ Restore completed successfully"
            else
                echo "❌ Restore cancelled"
            fi
        else
            echo "⚠️  WARNING: Workspace has uncommitted changes"
            git status --short
            read -p "Reset to latest commit? (y/n): " confirm

            if [[ $confirm =~ ^[Yy]$ ]]; then
                echo "🔄 Restoring from git..."
                git reset --hard HEAD
                echo "✅ Restore completed successfully"
            else
                echo "❌ Restore cancelled"
            fi
        fi
        ;;

    3)
        # Interactive restore
        echo ""
        echo "RESTORE FROM BACKUP FILES:"
        ls -lh "$BACKUP_DIR"/workspace-*.tar.gz 2>/dev/null

        echo ""
        read -p "Enter backup filename (or press Enter to skip): " backup_file

        if [ -n "$backup_file" ]; then
            BACKUP_PATH="$BACKUP_DIR/$backup_file"

            if [ ! -f "$BACKUP_PATH" ]; then
                echo "❌ ERROR: Backup file not found: $BACKUP_PATH"
                exit 1
            fi

            echo "📝 Restoring from: $BACKUP_PATH"
            read -p "Continue? (y/n): " confirm

            if [[ $confirm =~ ^[Yy]$ ]]; then
                # Backup current workspace
                echo ""
                echo "📦 Creating backup of current workspace..."
                BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
                tar -czf "$BACKUP_DIR/workspace-before-restore-$BACKUP_DATE.tar.gz" \
                    --exclude='.git' \
                    --exclude='venv' \
                    --exclude='credentials' \
                    --exclude='logs' \
                    --exclude='dashboard' \
                    --exclude='.DS_Store' \
                    --exclude='Thumbs.db' \
                    . 2>/dev/null || true

                # Restore from backup
                echo "🔄 Restoring workspace..."
                cd "$WORKSPACE" || exit 1
                tar -xzf "$BACKUP_PATH" --strip-components=1

                echo "✅ Restore completed successfully"
            else
                echo "❌ Restore cancelled"
            fi
        fi

        echo ""
        echo "RESTORE FROM GIT:"
        echo "Current git status:"
        git status --short

        read -p "Reset to latest commit? (y/n): " confirm

        if [[ $confirm =~ ^[Yy]$ ]]; then
            echo "🔄 Restoring from git..."
            git reset --hard HEAD
            echo "✅ Restore completed successfully"
        else
            echo "❌ Restore cancelled"
        fi
        ;;

    *)
        echo "❌ ERROR: Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Restore process complete"
