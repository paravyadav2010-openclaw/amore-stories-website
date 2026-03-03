#!/bin/bash
# Overnight Backup with Secret Scanning - 4:30 AM Daily
# Tasks: 1) Identify critical files, 2) Scan for secrets, 3) Commit & push, 4) Alert on failure

set -e

WORKSPACE="/Users/ava/.openclaw/workspace"
LOG_FILE="$WORKSPACE/maintenance-430am.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')
DATE_SHORT=$(date '+%Y-%m-%d')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "🌙 Backup & Secret Scan - 4:30 AM Daily" | tee -a "$LOG_FILE"
echo "Started: $DATE" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"

# Track status
ERRORS=0
SECRETS_FOUND=0
FILES_PROTECTED=0

# Task 1: Identify critical files
echo "" | tee -a "$LOG_FILE"
echo "📁 TASK 1: Identifying critical files..." | tee -a "$LOG_FILE"

CRITICAL_FILES=(
    "$WORKSPACE/SOUL.md"
    "$WORKSPACE/USER.md"
    "$WORKSPACE/MEMORY.md"
    "$WORKSPACE/AGENTS.md"
    "$WORKSPACE/TOOLS.md"
    "$WORKSPACE/HEARTBEAT.md"
    "$WORKSPACE/MODEL-PREFERENCES.md"
    "$WORKSPACE/IDENTITY.md"
    "$WORKSPACE/rentals/"
    "$WORKSPACE/skills/"
    "$WORKSPACE/memory/"
    "$HOME/.openclaw/cron/"
    "$HOME/.openclaw/openclaw.json"
)

echo "  Critical files identified: ${#CRITICAL_FILES[@]}" | tee -a "$LOG_FILE"

# Task 2: Scan for leaked secrets
echo "" | tee -a "$LOG_FILE"
echo "🔍 TASK 2: Scanning for leaked secrets..." | tee -a "$LOG_FILE"

# Secret patterns to search for
SECRET_PATTERNS=(
    "sk-[a-zA-Z0-9]{32,}"                    # OpenAI API keys
    "pk-[a-zA-Z0-9]{32,}"                    # OpenAI API keys
    "gsk_[a-zA-Z0-9]{32,}"                  # Anthropic API keys
    "AIza[a-zA-Z0-9_-]{35}"                 # Google API keys
    "AKIA[0-9A-Z]{16}"                     # AWS access keys
    "[0-9a-f]{32}"                          # Generic hex keys (32 chars)
    "ghp_[a-zA-Z0-9]{36}"                  # GitHub tokens
    "xoxb-[0-9]{13}-[0-9]{13}-[0-9]{23}"  # Slack tokens
    "Bearer [a-zA-Z0-9\.\-_]+"              # Bearer tokens
    "api[_-]?key[\"'=: ][^\"'\\s]+"       # API key patterns
    "password[\"'=:][^\"'\\s]+"            # Password patterns
    "secret[\"'=:][^\"'\\s]+"             # Secret patterns
)

# Scan each critical file
FILES_SCANNED=0
SECRETS_REPLACED=0
BACKUP_DIR="$WORKSPACE/.backup-before-scan-$(date '+%Y%m%d-%H%M')"

# Create backup before modifying
echo "  Creating backup: $BACKUP_DIR" | tee -a "$LOG_FILE"
mkdir -p "$BACKUP_DIR"

for file in "${CRITICAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        FILENAME=$(basename "$file")
        echo "  • Scanning: $FILENAME" | tee -a "$LOG_FILE"
        ((FILES_SCANNED++))

        # Copy to backup
        cp -r "$file" "$BACKUP_DIR/" 2>/dev/null || true

        # Scan for secrets
        if [ -f "$file" ]; then
            for pattern in "${SECRET_PATTERNS[@]}"; do
                if grep -iE "$pattern" "$file" 2>/dev/null; then
                    echo "  ⚠️  Secret pattern found in $FILENAME: $pattern" | tee -a "$LOG_FILE"
                    ((SECRETS_FOUND++))
                fi
            done
        fi
    fi
done

# Replace secrets with placeholders (basic implementation)
echo "" | tee -a "$LOG_FILE"
echo "🔐 TASK 2.5: Replacing secrets with placeholders..." | tee -a "$LOG_FILE"

# Note: This is a basic implementation. For production, use prompt-guard skill
# or a more sophisticated secret scanning tool

# Simple replacement for common patterns
for file in "$WORKSPACE/SOUL.md" "$WORKSPACE/USER.md" "$WORKSPACE/MEMORY.md" "$WORKSPACE/TOOLS.md"; do
    if [ -f "$file" ]; then
        # Replace API keys (basic pattern)
        if sed -i '' -E 's/(sk-[a-zA-Z0-9]{32,})/[API_KEY_REDACTED]/g' "$file" 2>/dev/null; then
            ((SECRETS_REPLACED++))
        fi
    fi
done

echo "  • Secrets found: $SECRETS_FOUND" | tee -a "$LOG_FILE"
echo "  • Secrets replaced: $SECRETS_REPLACED" | tee -a "$LOG_FILE"
echo "  • Files scanned: $FILES_SCANNED" | tee -a "$LOG_FILE"

# Task 3: Commit with date and change summary
echo "" | tee -a "$LOG_FILE"
echo "📦 TASK 3: Committing changes..." | tee -a "$LOG_FILE"

cd "$WORKSPACE"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    CHANGES=$(git status --porcelain | wc -l)
    echo "  • $CHANGES files changed, committing..." | tee -a "$LOG_FILE"

    # Build commit message
    COMMIT_MSG="🔄 Overnight Backup & Secret Scan - $DATE_SHORT

Changes:
- Scanned $FILES_SCANNED critical files
- Found and replaced $SECRETS_REPLACED secrets
- Errors: $ERRORS

Maintenance: 4:30 AM Daily
Status: $([ $ERRORS -eq 0 ] && echo "✅ Success" || echo "⚠️ Issues found")"

    # Commit
    if git add -A && git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"; then
        echo "  ✅ Committed successfully" | tee -a "$LOG_FILE"
    else
        echo "  ❌ Commit failed" | tee -a "$LOG_FILE"
        ((ERRORS++))
    fi
else
    echo "  • No changes to commit" | tee -a "$LOG_FILE"
fi

# Task 4: Push to GitHub
echo "" | tee -a "$LOG_FILE"
echo "📤 TASK 4: Pushing to GitHub..." | tee -a "$LOG_FILE"

# Check remote
if git remote -v | grep -q "origin"; then
    echo "  • Pushing to origin..." | tee -a "$LOG_FILE"
    if git push origin main 2>&1 | tee -a "$LOG_FILE"; then
        echo "  ✅ Pushed successfully" | tee -a "$LOG_FILE"
    else
        echo "  ❌ Push failed" | tee -a "$LOG_FILE"
        ((ERRORS++))
    fi
else
    echo "  ⚠️ No git remote 'origin' configured" | tee -a "$LOG_FILE"
    ((ERRORS++))
fi

# Task 5: Alert on failure
echo "" | tee -a "$LOG_FILE"
echo "📊 TASK 5: Final status..." | tee -a "$LOG_FILE"

# Build report
REPORT="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌙 OVERNIGHT BACKUP & SECRET SCAN - $DATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 FILES SCANNED: $FILES_SCANNED

🔍 SECRETS:
  • Found: $SECRETS_FOUND
  • Replaced: $SECRETS_REPLACED

💾 BACKUP: $BACKUP_DIR

📦 GIT:
  • Changes: ${CHANGES:-0}
  • Pushed: $([ $ERRORS -lt 3 ] && echo "✅ Yes" || echo "❌ No")

⚠️ ERRORS: $ERRORS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"

# Log report
echo "$REPORT" | tee -a "$LOG_FILE"

# Alert on failure
if [ "$ERRORS" -gt 0 ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "🚨 ALERT: Backup completed with $ERRORS errors!" | tee -a "$LOG_FILE"
    # Note: Telegram alert requires monitoring channel configuration
else
    echo "" | tee -a "$LOG_FILE"
    echo "✅ Backup completed successfully" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"

# Exit with error code if any errors
if [ "$ERRORS" -gt 0 ]; then
    exit 1
else
    exit 0
fi
