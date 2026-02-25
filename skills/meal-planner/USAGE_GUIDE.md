# Meal Planning & Grocery List - Usage Guide

## Quick Setup (One-Time)

```bash
# Add alias to ~/.zshrc
echo 'alias meals=~/.openclaw/workspace/skills/meal-planner/meal-planner.sh' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

---

## 🍽️ Meal Planning Commands

### Add Recipes to Database

```bash
# Add a simple recipe
meals add "Scrambled Eggs" --ingredients "eggs, butter, salt, pepper" --tags "breakfast,quick"

# Add a full recipe
meals add "Chicken Curry" \
  --ingredients "chicken, curry paste, coconut milk, rice, onion" \
  --tags "dinner,indian" \
  --prep-time "45 min" \
  --serves 4
```

### Plan Your Week

```bash
# Generate weekly meal plan
meals plan-week
```

Output:
```
🗓️  Generating weekly meal plan...

📅 Monday (2026-02-24):
   breakfast: Scrambled Eggs
   lunch: Not planned
   dinner: Chicken Curry

📅 Tuesday (2026-02-25):
   breakfast: Scrambled Eggs
   lunch: Not planned
   dinner: Chicken Curry
...
```

### View Current Meal Plan

```bash
meals plan
```

### See Meal History

```bash
# All recipes
meals history

# Last 7 days
meals history last-7
```

---

## 📦 Pantry Commands

### Add Items to Pantry

```bash
# Simple addition
meals pantry-add "chicken"

# With details
meals pantry-add "chicken" --quantity "500g" --expiry "2026-02-25" --category "meat"

# Add multiple items
meals pantry-add "rice" --quantity "2kg" --expiry "2027-01-01" --category "grains"
meals pantry-add "eggs" --quantity "12" --expiry "2026-02-28" --category "dairy"
```

### View Pantry Inventory

```bash
meals pantry
```

Output:
```
📦 Pantry Inventory:
─────────────────────────────────

⚠️  EXPIRING SOON: chicken (500g) — Expires: 2026-02-25
✅ rice (2kg) — Expires: 2027-01-01
✅ eggs (12) — Category: dairy
```

**Color Coding:**
- 🔴 **EXPIRED** — Past expiry date
- ⚠️ **EXPIRING SOON** — Expires within 3 days
- ✅ **Good** — Fresh and usable

---

## 🛒 Grocery List Commands

### Generate Shopping List

```bash
meals generate-list
```

This:
1. Checks your meal plan
2. Compares with pantry items
3. Creates list of missing ingredients

Output:
```
🛒 Generating grocery list...

✅ Grocery list generated: ~/.openclaw/workspace/skills/meal-planner/grocery-list.txt

📋 List contents:
# Grocery List
# Generated: 2026-02-22 15:00:00

- chicken
- curry paste
- coconut milk
- rice
- onion
...
```

---

## 💡 Recipe Suggestions

### Get Ideas Based on What You Have

```bash
meals suggest
```

Output:
```
💡 Recipe Suggestions (based on pantry):
─────────────────────────────────

📦 You have: chicken rice eggs

🍽️  Suggested recipes:

📌 Chicken Curry (matches 3 ingredient(s))
   Ingredients: chicken, curry paste, coconut milk, rice, onion

📌 Scrambled Eggs (matches 2 ingredient(s))
   Ingredients: eggs, butter, salt, pepper
```

---

## 💡 Example Workflows

### Weekly Meal Planning Routine

```bash
# 1. Add new recipes you want to try
meals add "Spaghetti Bolognese" \
  --ingredients "spaghetti, mince, tomato sauce, onion, garlic" \
  --tags "dinner,italian,pasta" \
  --prep-time "40 min" \
  --serves 4

# 2. Check what's in your pantry
meals pantry

# 3. Generate weekly meal plan
meals plan-week

# 4. Create shopping list
meals generate-list

# 5. Get suggestions based on what you have
meals suggest
```

### Before Grocery Shopping

```bash
# 1. Check pantry for expiring items
meals pantry

# 2. Generate grocery list
meals generate-list

# 3. Review list
cat ~/.openclaw/workspace/skills/meal-planner/grocery-list.txt
```

### "What Should I Cook Today?"

```bash
# Check today's meal plan
meals plan

# Or get suggestions based on pantry
meals suggest
```

---

## 📊 Understanding Categories

### Meal Tags

Use tags to categorize recipes:

- **Meal type:** `breakfast`, `lunch`, `dinner`
- **Cuisine:** `indian`, `italian`, `chinese`, `mexican`
- **Prep time:** `quick` (under 20 min), `medium` (20-40 min), `long` (40+ min)
- **Diet:** `vegetarian`, `vegan`, `gluten-free`

### Pantry Categories

Common categories:
- `meat`, `dairy`, `grains`, `vegetables`, `fruits`, `spices`, `canned`, `frozen`

---

## 🎯 Pro Tips

1. **Add recipes with ingredients** — Enables auto-grocery list
2. **Update pantry after shopping** — Keep inventory accurate
3. **Check expiry dates** — Use expiring items first
4. **Use suggestions** — Cook based on what you have
5. **Plan weekly** — Saves time and money on groceries

---

## 🔧 Troubleshooting

### "Command not found: meals"
```bash
# Add alias to ~/.zshrc (see Quick Setup above)
source ~/.zshrc
```

### "jq: command not found"
```bash
# Install jq (JSON processor)
brew install jq
```

### Pantry items not showing expiry alerts
- Make sure dates are in `YYYY-MM-DD` format
- Example: `meals pantry-add "milk" --expiry "2026-02-25"`

### Grocery list includes everything
- The pantry matching is basic (exact name match only)
- For now, review the list manually before shopping

---

## 📝 Common Scenarios

### "I want to plan meals for this week"
```bash
meals plan-week
```

### "What do I have that's expiring?"
```bash
meals pantry
# Look for 🔴 EXPIRED and ⚠️ EXPIRING SOON
```

### "What can I cook right now?"
```bash
meals suggest
```

### "I just went shopping, update pantry"
```bash
meals pantry-add "item1" --quantity "X" --expiry "YYYY-MM-DD"
meals pantry-add "item2" --quantity "Y" --expiry "YYYY-MM-DD"
# Repeat for all items
```

### "Create shopping list"
```bash
meals generate-list
```

---

## 🎨 Advanced Usage

### Custom Meal Plans

Edit `~/.openclaw/workspace/skills/meal-planner/meals.json`:

```json
{
  "meal_plan": {
    "2026-02-24": {
      "breakfast": "Scrambled Eggs",
      "lunch": "Sandwich",
      "dinner": "Chicken Curry"
    },
    "2026-02-25": {
      "breakfast": "Oatmeal",
      "lunch": "Salad",
      "dinner": "Spaghetti Bolognese"
    }
  }
}
```

### Share Grocery List

```bash
# Send to phone/email
cat ~/.openclaw/workspace/skills/meal-planner/grocery-list.txt | pbcopy
# Now paste into messages/email

# Or open in text editor
open ~/.openclaw/workspace/skills/meal-planner/grocery-list.txt
```

### Backup Your Data

```bash
# Copy to another location
cp ~/.openclaw/workspace/skills/meal-planner/meals.json ~/Desktop/meals-backup.json
cp ~/.openclaw/workspace/skills/meal-planner/pantry.json ~/Desktop/pantry-backup.json
```

---

## 📞 Getting Help

```bash
meals help
```

---

*Happy meal planning! 🍽️*
