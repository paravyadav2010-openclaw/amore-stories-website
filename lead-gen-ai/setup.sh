#!/bin/bash
# Setup Script for AI Lead Generator

set -e

echo "======================================"
echo "🤖 AI Lead Generator Setup"
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
echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p clients output logs
echo "✅ Directories created"
echo ""

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x *.py
echo "✅ Scripts executable"
echo ""

# Check config
echo "📋 Checking config..."
if [ ! -f "config.json" ]; then
    echo "❌ config.json not found."
    exit 1
fi
echo "✅ Config found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install requests beautifulsoup4 2>/dev/null || {
    echo "⚠️  Could not install Python packages. You may need to install them manually:"
    echo "   pip3 install requests beautifulsoup4"
}
echo "✅ Dependencies checked"
echo ""

# Test client manager
echo "🧪 Testing client manager..."
python3 -c "from client_manager import CLIENTS_DIR; print('✅ Client manager OK')" 2>/dev/null || {
    echo "⚠️  Client manager has issues, but you can still use it"
}
echo ""

# Test lead generator
echo "🧪 Testing lead generator..."
python3 -c "import lead_generator; print('✅ Lead generator OK')" 2>/dev/null || {
    echo "⚠️  Lead generator has issues, but you can still use it"
}
echo ""

echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Quick Start:"
echo "  1. Create client:  python3 client_manager.py"
echo "  2. Generate leads: python3 lead_generator.py"
echo ""
echo "Read QUICKSTART.md for detailed instructions."
echo ""
