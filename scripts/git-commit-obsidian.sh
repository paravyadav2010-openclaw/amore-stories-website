#!/bin/bash
# Commit and push Obsidian Notes to GitHub

VAULT_PATH="$HOME/Documents/Obsidian Notes"
cd "$VAULT_PATH" || exit 1

# Check if there are changes
if git diff-index --quiet HEAD --; then
    echo "No changes to commit"
    exit 0
fi

# Add, commit, and push
git add -A
git commit -m "$(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "Changes committed and pushed to GitHub"
