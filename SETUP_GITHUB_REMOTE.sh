#!/bin/bash

# Setup GitHub Remote for OpenClaw Workspace
# This script will add your GitHub repository as the remote

echo "🔗 Setting up GitHub Remote"
echo "==========================="
echo ""

# Check if git remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Git remote 'origin' already exists"
    git remote -v
    echo ""
    read -p "Do you want to update it? (y/n): " update

    if [[ ! $update =~ ^[Yy]$ ]]; then
        echo "❌ No changes made"
        exit 0
    fi
fi

echo ""
echo "📌 Your repository URL: https://github.com/paravyadav2010-openclaw/Cloye"
echo ""
read -p "Press Enter to add this as the remote named 'origin'..."

# Add remote
git remote add origin https://github.com/paravyadav2010-openclaw/Cloye.git

# Verify remote was added
echo ""
echo "✅ Remote added:"
git remote -v

echo ""
echo "📝 Next steps:"
echo "   1. Push your code to GitHub:"
echo "      git push -u origin main"
echo ""
echo "   2. Enable GitHub Webhooks (optional):"
echo "      Go to: https://github.com/paravyadav2010-openclaw/Cloye/settings/webhooks"
echo "      Add webhook with your endpoint"
echo ""
echo "✨ Setup complete!"
