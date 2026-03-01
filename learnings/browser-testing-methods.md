# Browser Testing Methods - Learnings & Instructions

## 🎯 Golden Rule: Use the RIGHT Tool for the Task

### ✅ RECOMMENDED: agent-browser CLI (for most testing)

**Use for:**
- ✅ Taking screenshots
- ✅ Simple page testing
- ✅ Form validation
- ✅ Responsive design testing
- ✅ Navigation testing
- ✅ Checking interactive elements

**Why it works:**
- No Chrome extension required
- Headless automation (faster)
- Direct CLI control
- Works reliably every time

**Quick Start Commands:**
```bash
# Navigate to page
agent-browser open https://example.com

# Take full-page screenshot
agent-browser screenshot --full /path/to/screenshot.png

# Take partial screenshot (current view)
agent-browser screenshot /path/to/screenshot.png

# Get interactive elements (for reference)
agent-browser snapshot -i

# Test responsive views
agent-browser set viewport 768 1024  # Tablet
agent-browser set viewport 390 844   # Mobile

# Fill form fields
agent-browser fill @ref "text"
agent-browser select @ref "option"
agent-browser click @ref

# Scroll page
agent-browser scroll down 500
agent-browser scroll up 500

# Check for errors
agent-browser errors

# Close browser
agent-browser close
```

**Example Workflow:**
```bash
# 1. Open page
agent-browser open https://amore-studio.vercel.app

# 2. Take initial screenshot
agent-browser screenshot --full /path/initial.png

# 3. Scroll down and take another
agent-browser scroll down 800
agent-browser screenshot /path/scrolled.png

# 4. Test mobile view
agent-browser set viewport 390 844
agent-browser screenshot /path/mobile.png

# 5. Test form
agent-browser fill @e14 "Test Name"
agent-browser fill @e15 "test@example.com"
agent-browser click @e20

# 6. Check errors
agent-browser errors  # Should return (no output) if clean

# 7. Close
agent-browser close
```

---

### ❌ AVOID: browser tool (Chrome extension required)

**When it fails:**
- Error: "Chrome extension relay is running, but no tab is attached"
- Error: "Click the OpenClaw Chrome extension icon on a tab to attach it"

**Why it fails:**
- Requires Chrome browser extension installation
- Requires manual tab attachment (click extension icon)
- Only works when extension is active on the target tab
- Slower for simple tasks
- More complex setup

**When to use `browser` tool:**
- Only when you need Chrome extension relay features
- Only when working with complex web UIs that require extension
- Only when extension is already attached and working

**Example (only if extension is attached):**
```python
browser(action="open", targetUrl="https://example.com")
browser(action="snapshot", targetId="xxx")
browser(action="screenshot", targetId="xxx")
```

---

## 📋 Decision Matrix

| Task | Use This Tool | Why |
|------|---------------|-----|
| Take screenshots | `agent-browser` CLI | Faster, no extension needed |
| Test forms | `agent-browser` CLI | Direct control, reliable |
| Responsive testing | `agent-browser` CLI | Easy viewport switching |
| Navigation testing | `agent-browser` CLI | Simple commands |
| Complex web UI | `browser` tool | Extension features |
| Debugging live browser | `browser` tool | Visual control |

---

## 🚫 Common Mistakes to Avoid

### Mistake 1: Using `browser` tool for simple screenshots
```python
# ❌ WRONG - will fail without extension
browser(action="screenshot", targetId="xxx")

# ✅ CORRECT - works every time
agent-browser screenshot /path/to/image.png
```

### Mistake 2: Not checking for errors
```bash
# ❌ WRONG - missing error check
agent-browser click @ref

# ✅ CORRECT - check for errors
agent-browser click @ref
agent-browser errors  # Verify no issues
```

### Mistake 3: Not closing browser
```bash
# ❌ WRONG - leaves browser open
agent-browser open https://example.com

# ✅ CORRECT - clean up
agent-browser open https://example.com
agent-browser close
```

---

## 🔧 Complete Testing Script Template

Save this as `test-website.sh`:
```bash
#!/bin/bash

WEBSITE=$1
OUTPUT_DIR=$2

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Open website
agent-browser open "$WEBSITE"

# Wait for page to load
sleep 2

# Take full-page screenshot
agent-browser screenshot --full "$OUTPUT_DIR/desktop-full.png"

# Scroll and take screenshots
agent-browser scroll down 800
agent-browser screenshot "$OUTPUT_DIR/desktop-scroll-1.png"

agent-browser scroll down 800
agent-browser screenshot "$OUTPUT_DIR/desktop-scroll-2.png"

# Test tablet view
agent-browser set viewport 768 1024
agent-browser screenshot "$OUTPUT_DIR/tablet.png"

# Test mobile view
agent-browser set viewport 390 844
agent-browser screenshot "$OUTPUT_DIR/mobile.png"

# Check for errors
echo "Checking for errors..."
agent-browser errors

# Close browser
agent-browser close

echo "✅ Testing complete! Screenshots saved to $OUTPUT_DIR"
```

**Usage:**
```bash
chmod +x test-website.sh
./test-website.sh https://amore-studio.vercel.app ./screenshots
```

---

## 📚 Skill Reference

**Agent-Browser-CLI Skill Location:**
`~/.openclaw/skills/Agent-Browser-CLI/SKILL.md`

**Key Commands:**
```bash
agent-browser open <url>              # Navigate
agent-browser screenshot [path]        # Screenshot
agent-browser screenshot --full [path] # Full page
agent-browser snapshot -i              # Get interactive elements
agent-browser click @ref              # Click element
agent-browser fill @ref "text"         # Fill input
agent-browser scroll down 500         # Scroll
agent-browser set viewport W H        # Resize viewport
agent-browser errors                  # Check for errors
agent-browser close                    # Close browser
```

---

## 🎯 Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER TESTING - QUICK START                               │
├─────────────────────────────────────────────────────────────┤
│  agent-browser open <url>           → Open website           │
│  agent-browser screenshot path.png   → Take screenshot       │
│  agent-browser snapshot -i           → Get element refs      │
│  agent-browser fill @ref "text"      → Fill form field       │
│  agent-browser click @ref            → Click button/link     │
│  agent-browser scroll down 500       → Scroll page           │
│  agent-browser set viewport 390 844  → Mobile view            │
│  agent-browser errors                → Check for errors      │
│  agent-browser close                → Done!                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Summary

**Key Takeaways:**
1. ✅ **Always** use `agent-browser` CLI for screenshots and testing
2. ✅ **Never** use `browser` tool unless you have Chrome extension attached
3. ✅ **Always** check for errors with `agent-browser errors`
4. ✅ **Always** close browser with `agent-browser close`
5. ✅ **Always** save screenshots with descriptive filenames

**Why This Matters:**
- Faster testing (no extension setup)
- More reliable (no manual tab attachment)
- Easier to automate (direct CLI commands)
- Better for CI/CD (headless operation)

---

**Last Updated:** 2026-03-01  
**Method:** agent-browser CLI (successful)  
**Alternative:** browser tool (requires Chrome extension)
