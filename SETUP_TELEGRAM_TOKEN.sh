#!/bin/bash

# Setup Telegram Token for Constant Improvement System
# This script will help you set up the Telegram bot token

echo "🔐 Setup Telegram Token for Constant Improvement System"
echo "========================================================="
echo ""

# Check if token is already set
if [ -n "$OPENCLAW_TELEGRAM_BOT_TOKEN" ]; then
    echo "✅ Telegram token already configured"
    echo "   Token: ${OPENCLAW_TELEGRAM_BOT_TOKEN:0:10}..."
    echo ""
    read -p "Do you want to update the token? (y/n): " update

    if [[ ! $update =~ ^[Yy]$ ]]; then
        echo "❌ No changes made"
        exit 0
    fi
fi

echo ""
echo "📝 To get a Telegram bot token:"
echo "   1. Open Telegram and search for @BotFather"
echo "   2. Send /newbot"
echo "   3. Choose a name for your bot"
echo "   4. Choose a unique username (must end in 'bot')"
echo "   5. Copy the API token provided"
echo ""

read -p "Paste your Telegram bot token: " token

if [ -z "$token" ]; then
    echo "❌ No token provided"
    exit 1
fi

# Validate token format
if [[ ! $token =~ ^[0-9]+:[A-Za-z0-9_-]+$ ]]; then
    echo "❌ Invalid token format"
    exit 1
fi

# Save to zshrc
echo ""
echo "💾 Saving token to ~/.zshrc..."

cat >> ~/.zshrc << EOF

# Telegram bot token for Constant Improvement System
export OPENCLAW_TELEGRAM_BOT_TOKEN="$token"
EOF

# Export for current session
export OPENCLAW_TELEGRAM_BOT_TOKEN="$token"

echo "✅ Token saved to ~/.zshrc"
echo "✅ Token exported for current session"
echo ""
echo "🔄 To apply changes:"
echo "   1. Close and reopen your terminal, OR"
echo "   2. Run: source ~/.zshrc"
echo ""
echo "✨ Setup complete!"
