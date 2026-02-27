# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd ~/.openclaw/workspace/rental-scanner
bash setup.sh
```

This will:
- ✅ Check Python 3
- ✅ Check Agent Browser CLI
- ✅ Create directories
- ✅ Make scripts executable

---

### Step 2: Configure Your Search

Edit `config.json` to match your needs:

```json
{
  "search": {
    "suburbs": ["Lalor", "Epping", "Reservoir", "Wollert"],
    "bedrooms": 2,
    "maxPrice": 600
  }
}
```

---

### Step 3: Run Your First Scan

```bash
python3 scanner.py
```

Output:
```
============================================================
🏠 RENTAL SCANNER STARTED
============================================================
Search URL: https://domain.com.au/rent/?...
[2026-02-27 10:00:00] Running: agent-browser open ...
💾 Saved 12 new properties (total: 45)
============================================================
✅ SCAN COMPLETE
============================================================
```

---

### Step 4: Analyze Properties

```bash
python3 analyzer.py
```

Output:
```
Analyzed 45 properties
Qualifying (score >= 50): 18

============================================================
TOP PROPERTIES
============================================================

1. Score: 92.5/100
   Price: $480/week
   Address: 123 Example Street, Lalor
   Beds: 2
```

---

### Step 5: Generate Newsletter

```bash
python3 newsletter.py
```

Output:
```
============================================================
📧 NEWSLETTER GENERATOR
============================================================

📝 Newsletter saved to: output/2026-02-27.md

============================================================
✅ NEWSLETTER GENERATED
============================================================
```

---

### Step 6: View Your Newsletter

```bash
cat output/2026-02-27.md
```

Or open in your editor:
```bash
code output/2026-02-27.md
```

---

## ⏰ Automate Daily Scans

```bash
bash setup-cron.sh
```

This will run the scanner every day at 9 AM.

---

## 📱 Send to Telegram (Manual for now)

1. Copy newsletter content
2. Paste to your Telegram channel
3. Done!

---

## 🔧 Advanced Options

### Change Scan Schedule

Edit the cron time in `setup-cron.sh`:
```bash
CRON_TIME="0 18 * * *"  # 6 PM daily
```

### Change Newsletter Format

Edit `config.json`:
```json
{
  "newsletter": {
    "maxPicks": 10,  # More properties
    "includeDetails": ["price", "address", "link"]
  }
}
```

### Filter by Score

Edit `config.json`:
```json
{
  "filters": {
    "minScore": 70  # Only show high-value properties
  }
}
```

---

## 🐛 Troubleshooting

### "Agent Browser CLI not found"
Make sure you have Agent Browser CLI installed from:
```
~/.openclaw/skills/Agent-Browser-CLI/
```

### "No properties found"
- Check your config.json criteria
- Try broader search (more suburbs, higher price)
- Check scanner.log for errors

### Cron job not running
```bash
# Check cron logs
tail -f logs/scanner.log

# Manually run cron
crontab -e  # Copy line and run in terminal
```

---

## 📊 What's Next?

1. ✅ **Test scanner** → Get real data
2. ✅ **Refine filters** → Improve quality
3. ✅ **Build audience** → Share newsletter
4. ✅ **Add premium tier** → Start monetizing
5. ✅ **Expand to other cities** → Scale up

---

**Need help?** Check the full README.md
