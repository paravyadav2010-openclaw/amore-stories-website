#!/bin/bash
# Clean up duplicate folders in Obsidian-OpenClaw vault

VAULT_PATH="$HOME/Documents/Obsidian-OpenClaw"
cd "$VAULT_PATH" || exit 1

echo "=== Starting cleanup ==="
echo ""

# 1. Merge duplicate Dashboard folders
echo "📁 Merging duplicate Dashboard folders..."
if [ -d "00-Home (Dashboard)" ]; then
    cp "00-Home (Dashboard)/Home.md" "00-Dashboard/" 2>/dev/null
    rm -rf "00-Home (Dashboard)"
    echo "  ✓ Removed 00-Home (Dashboard) - content merged to 00-Dashboard"
fi

# 2. Move Books to 03-Sources/Books
echo "📁 Moving Books folder..."
if [ -d "Books" ]; then
    rm -rf "03-Sources/Books"
    mv Books "03-Sources/"
    echo "  ✓ Moved Books to 03-Sources/Books"
fi

# 3. Move Scripts to 09-Templates/Scripts
echo "📁 Moving Scripts folder..."
if [ -d "Scripts" ]; then
    rm -rf "09-Templates/Scripts"
    mv Scripts "09-Templates/"
    echo "  ✓ Moved Scripts to 09-Templates/Scripts"
fi

# 4. Move Zettelkasten to 04-Permanent Notes
echo "📁 Moving Zettelkasten folder..."
if [ -d "Zettelkasten" ]; then
    rm -rf "04-Permanent Notes/Zettelkasten"
    mv Zettelkasten "04-Permanent Notes/"
    echo "  ✓ Moved Zettelkasten to 04-Permanent Notes/Zettelkasten"
fi

# 5. Consolidate Business folders
echo "📁 Consolidating Business folders..."
if [ -d "Business Admin" ]; then
    rm -rf "06-Business/Business Admin"
    mv "Business Admin" "06-Business/"
    echo "  ✓ Moved Business Admin to 06-Business/Business Admin"
fi

if [ -d "Clients" ]; then
    rm -rf "06-Business/Clients"
    mv Clients "06-Business/"
    echo "  ✓ Moved Clients to 06-Business/Clients"
fi

if [ -d "Posing & Creative" ]; then
    rm -rf "06-Business/Posing & Creative"
    mv "Posing & Creative" "06-Business/"
    echo "  ✓ Moved Posing & Creative to 06-Business/Posing & Creative"
fi

if [ -d "Templates" ]; then
    rm -rf "06-Business/Templates"
    mv Templates "06-Business/"
    echo "  ✓ Moved Templates to 06-Business/Templates"
fi

# 6. Move Daily Notes to 01-Journal
echo "📁 Moving Daily Notes folder..."
if [ -d "Daily Notes" ]; then
    rm -rf "01-Journal/Daily Notes"
    mv "Daily Notes" "01-Journal/"
    echo "  ✓ Moved Daily Notes to 01-Journal/Daily Notes"
fi

# 7. Consolidate Sources
echo "📁 Consolidating Sources folders..."
if [ -d "Bookbase" ]; then
    rm -rf "03-Sources/Bookbase"
    mv Bookbase "03-Sources/"
    echo "  ✓ Moved Bookbase to 03-Sources/Bookbase"
fi

# 8. Remove loose files
echo "📁 Removing loose files..."
find "$VAULT_PATH" -maxdepth 1 -type f -name "*.md" | while read file; do
    filename=$(basename "$file")
    mv "$file" "02-Inbox/"
    echo "  ✓ Moved $filename to 02-Inbox"
done

# 9. Remove loose folders that should be in categories
echo "📁 Cleaning up loose folders..."
for folder in "Meetings & Notes" "Podcasts" "YouTube" "Project Board.canvas" "Photography Business Overview.md"; do
    if [ -e "$folder" ]; then
        mv "$folder" "02-Inbox/"
        echo "  ✓ Moved $folder to 02-Inbox"
    fi
done

echo ""
echo "=== Cleanup complete ==="
echo ""
echo "📊 Final structure:"
ls -d */ | sort
