#!/bin/bash
# Sync both Obsidian vaults to GitHub

echo "🔄 Syncing both Obsidian vaults..."

# Sync main vault
echo "📁 Syncing Obsidian Notes..."
cd ~/Documents/Obsidian\ Notes || exit 1
if ! git diff-index --quiet HEAD --; then
    git add -A
    git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "✅ Obsidian Notes synced"
else
    echo "✓ No changes in Obsidian Notes"
fi

# Sync OpenClaw vault
echo "📁 Syncing Obsidian-OpenClaw..."
cd ~/Documents/Obsidian-OpenClaw || exit 1
if ! git diff-index --quiet HEAD --; then
    git add -A
    git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "✅ Obsidian-OpenClaw synced"
else
    echo "✓ No changes in Obsidian-OpenClaw"
fi

echo "🎉 Both vaults synced!"
