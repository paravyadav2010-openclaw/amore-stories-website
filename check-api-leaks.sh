#!/bin/bash
# Script to check for leaked API keys in repositories

echo "🔍 Scanning for API keys..."

# Patterns to search for
PATTERNS=(
  "AIzaSy[A-Za-z0-9_-]{35}"  # Google API key
  "xai-[A-Za-z0-9_-]{35}"  # xAI API key
  "sk-[a-zA-Z0-9]{48}"      # OpenAI API key
  "ghp_[a-zA-Z0-9]{36}"     # GitHub PAT
  "gho_[a-zA-Z0-9]{36}"     # GitHub OAuth
  "AKIA[0-9A-Z]{16}"       # AWS Access Key
  "Bearer [a-zA-Z0-9\-._~+/]+"  # Bearer token
)

REPO_ROOT="/Users/ava/.openclaw"

cd "$REPO_ROOT"

echo "📂 Scanning: $REPO_ROOT"
echo ""

# Check for .env files
find . -name ".env" -o -name "*.env" -o -name ".env.*" 2>/dev/null | while read env_file; do
  echo "⚠️  Found env file: $env_file"
done

# Check for backup files with API keys
find . -name "*BACKUP*" -o -name "*backup*" -o -name "*ASSESSMENT*" 2>/dev/null | while read backup_file; do
  echo "⚠️  Found backup file: $backup_file"
done

# Check for API keys in files
echo ""
echo "🔑 Checking for API key patterns..."

for pattern in "${PATTERNS[@]}"; do
  # Search in common file types
  grep -r -E "$pattern" . --include="*.md" --include="*.txt" --include="*.sh" --include="*.js" --include="*.jsx" --include="*.py" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist 2>/dev/null | head -5
done

echo ""
echo "✅ Scan complete"
echo ""
echo "💡 Next steps:"
echo "  1. Review any files found above"
echo "  2. Remove leaked keys immediately"
echo "  3. Regenerate compromised keys"
echo "  4. Update .gitignore to prevent future leaks"
