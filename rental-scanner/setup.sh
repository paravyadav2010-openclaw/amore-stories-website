#!/bin/bash
# Rental Scanner Setup Script

set -e

echo "======================================"
echo "🏠 Rental Scanner Setup"
echo "======================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check Python 3
echo "📋 Checking Python 3..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install it first."
    exit 1
fi
echo "✅ Python 3 found"
echo ""

# Check Agent Browser CLI
echo "📋 Checking Agent Browser CLI..."
if ! command -v agent-browser &> /dev/null; then
    echo "❌ Agent Browser CLI not found."
    echo "Install it from: ~/.openclaw/skills/Agent-Browser-CLI/"
    exit 1
fi
echo "✅ Agent Browser CLI found"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p data output logs
echo "✅ Directories created"
echo ""

# Check config
echo "📋 Checking config..."
if [ ! -f "config.json" ]; then
    echo "❌ config.json not found. Please create it first."
    exit 1
fi
echo "✅ Config found"
echo ""

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x *.py
echo "✅ Scripts executable"
echo ""

# Test scanner
echo "🧪 Testing scanner..."
python3 analyzer.py
echo ""

echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Quick Start:"
echo "  1. Run scanner:    python3 scanner.py"
echo "  2. Analyze:       python3 analyzer.py"
echo "  3. Newsletter:    python3 newsletter.py"
echo ""
echo "To schedule daily scans:"
echo "  bash setup-cron.sh"
echo ""
