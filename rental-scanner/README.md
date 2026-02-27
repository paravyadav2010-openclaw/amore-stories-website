# Rental Property Scanner & Newsletter

**Status:** 🟢 Active Development
**Goal:** Automated rental property discovery → Newsletter → Monetization

---

## 🎯 The Idea

**Problem:** Finding good rental properties is tedious, time-consuming, and competitive.

**Solution:** Automated scanner that finds the best rental deals and delivers them via newsletter.

**Monetization:**
- Free: Top 5 picks per week
- Premium: All picks, custom alerts, early access ($5-10/month)

---

## 📋 What It Does

1. **Daily Scanning**
   - Scans rental sites (Domain.com.au, Trade Me)
   - Filters by your criteria (price, location, bedrooms)
   - Catches new listings first

2. **Smart Filtering**
   - Removes duplicates
   - Filters out low-quality listings
   - Calculates value scores (price/bedroom, location quality)

3. **Newsletter Generation**
   - Formats top picks into readable newsletter
   - Includes direct links (no click-through hell)
   - Highlights key details (price, address, features)

4. **Distribution**
   - Sends via Telegram (channel)
   - Option for email newsletter
   - Scheduled updates (daily/weekly)

---

## 🔧 Technical Stack

- **Scraping:** Agent Browser CLI (headless, bypasses protections)
- **Processing:** Python (requests, BeautifulSoup, data analysis)
- **Database:** JSON files (simple, no external DB needed)
- **Distribution:** Telegram channel initially, email later
- **Scheduling:** Cron jobs (daily automation)

---

## 📁 Project Structure

```
rental-scanner/
├── README.md                 # This file (full project overview)
├── SUMMARY.md               # Quick project summary & status
├── QUICKSTART.md            # 5-minute setup guide
├── BUSINESS_MODEL.md        # Revenue projections, monetization strategy
├── scanner.py               # Main scraping script
├── analyzer.py              # Property analysis & scoring
├── newsletter.py            # Newsletter generation
├── config.json              # Search criteria, filters
├── setup.sh                 # One-time setup script
├── setup-cron.sh            # Automated daily scans
├── data/                    # Storage
│   ├── properties.json      # All properties found
│   ├── processed.json       # Already sent
│   └── subscribers.json     # Premium subscribers (future)
├── output/                  # Generated newsletters
│   └── YYYY-MM-DD.md       # Daily/weekly issues
└── logs/                    # Scan logs
    └── scanner.log
```

---

## 🚀 Quick Start

```bash
# 1. Configure search criteria
cp config.example.json config.json
nano config.json  # Set your preferences

# 2. Run a scan
python3 scanner.py

# 3. Generate newsletter
python3 newsletter.py

# 4. Send to Telegram channel (manual initially)
# Paste output to channel

# 5. Schedule daily scans
crontab -e
# Add: 0 9 * * * cd ~/.openclaw/workspace/rental-scanner && python3 scanner.py
```

---

## 📊 Monetization Path

### Phase 1: Free (Current)
- Top 5 picks per week
- One city (Melbourne)
- Telegram distribution
- Build audience

### Phase 2: Premium Tiers
- **Basic ($5/month):** All picks, daily updates
- **Pro ($10/month):** Custom alerts, multiple suburbs, early access
- **Enterprise ($25/month):** API access, bulk alerts for agents

### Phase 3: Expansion
- Multiple cities (Sydney, Brisbane, Perth)
- NZ market (Auckland, Wellington)
- Partner with real estate agents

---

## 💰 Revenue Potential

**Conservative estimate:**
- 500 free subscribers
- 50 premium at $7/month = $350/month
- Scale to 5,000 subscribers → $3,500/month

**Optimistic estimate:**
- 5,000 free subscribers
- 500 premium at $10/month = $5,000/month
- Scale to 50,000 subscribers → $50,000/month

---

## 🛠️ Current Status

- [x] Project designed
- [ ] Scanner script (Domain.com.au)
- [ ] Scanner script (Trade Me)
- [ ] Property analyzer (scoring algorithm)
- [ ] Newsletter generator
- [ ] Telegram bot for distribution
- [ ] Free tier launch
- [ ] Premium tier (payment processing)
- [ ] Multi-city expansion

---

## 📝 Next Steps

1. **Build Domain.com.au scanner** → Test with real data
2. **Build property analyzer** → Score by value metrics
3. **Create first newsletter** → Test formatting
4. **Launch Telegram channel** → Start free tier
5. **Monitor engagement** → Improve quality
6. **Add premium features** → Monetize

---

**Why this will work:**
- Solves real problem (you need it for your move!)
- Low tech overhead (no external APIs or databases)
- Scalable (can add more cities)
- Clear monetization path

**Estimated time to first revenue:** 2-3 months (build audience)
**Estimated time to $1k/month:** 4-6 months (500 premium subscribers)
