# Meal Planning & Grocery List Manager

Plan weekly meals, track pantry items, and auto-generate shopping lists.

## What It Does

1. **Weekly Meal Planner** — Plan 7 days of meals (breakfast, lunch, dinner)
2. **Pantry Tracker** — Track what's in your pantry/fridge
3. **Auto-Generate Grocery List** — Create shopping lists from meal plans
4. **Recipe Suggestions** — Get meal ideas based on ingredients you have
5. **Meal History** — See what you've cooked recently

## File Structure

```
~/.openclaw/workspace/skills/meal-planner/
├── SKILL.md                 # This file
├── meal-planner.sh          # Main script (CLI)
├── meals.json               # Meal database
├── pantry.json              # Pantry inventory
├── grocery-list.txt         # Auto-generated shopping list
└── USAGE_GUIDE.md           # Usage examples
```

## Setup

```bash
# Add to ~/.zshrc for easy access
alias meals='~/.openclaw/workspace/skills/meal-planner/meal-planner.sh'
```

## Usage

### Plan Meals for the Week

```bash
meals plan-week
```

### Add a Meal

```bash
meals add "Chicken Curry" --ingredients "chicken, curry paste, rice, coconut milk" --tags "dinner,indian"
```

### Add to Pantry

```bash
meals pantry-add "chicken" --quantity "500g" --expiry "2026-02-25"
```

### Generate Grocery List

```bash
meals generate-list
```

### Get Recipe Suggestions

```bash
meals suggest --from-pantry
```

### View Meal Plan

```bash
meals plan
```

### Check Pantry

```bash
meals pantry
```

## Data Storage

### Meals Database (`meals.json`)

```json
{
  "meals": [
    {
      "name": "Chicken Curry",
      "ingredients": ["chicken", "curry paste", "rice", "coconut milk"],
      "tags": ["dinner", "indian"],
      "prep_time": "45 min",
      "serves": 4,
      "last_cooked": "2026-02-20"
    }
  ],
  "meal_plan": {
    "2026-02-22": {
      "breakfast": "Scrambled Eggs",
      "lunch": "Sandwich",
      "dinner": "Chicken Curry"
    }
  }
}
```

### Pantry Database (`pantry.json`)

```json
{
  "pantry": [
    {
      "name": "chicken",
      "quantity": "500g",
      "expiry": "2026-02-25",
      "category": "meat"
    },
    {
      "name": "rice",
      "quantity": "2kg",
      "expiry": "2027-01-01",
      "category": "grains"
    }
  ]
}
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `meals add` | Add a new meal/recipe |
| `meals plan` | View current meal plan |
| `meals plan-week` | Generate weekly meal plan |
| `meals pantry` | View pantry inventory |
| `meals pantry-add` | Add item to pantry |
| `meals generate-list` | Create grocery list |
| `meals suggest` | Get recipe suggestions |
| `meals history` | View meal history |

## Examples

```bash
# Add a recipe
meals add "Spaghetti Bolognese" \
  --ingredients "spaghetti, mince, tomato sauce, onion, garlic" \
  --tags "dinner,italian,pasta" \
  --prep-time "40 min" \
  --serves 4

# Plan your week
meals plan-week

# Add items to pantry
meals pantry-add "mince" --quantity "1kg" --expiry "2026-02-28"
meals pantry-add "spaghetti" --quantity "500g" --expiry "2026-12-01"

# Generate shopping list
meals generate-list

# Get suggestions based on what you have
meals suggest --from-pantry

# View pantry (shows expiring items first)
meals pantry

# View meal plan for the week
meals plan

# See what you've cooked recently
meals history last-7
```

## Integration with OpenClaw

You can also use this skill through OpenClaw:

```
User: "Plan meals for this week"
→ Generates 7-day meal plan

User: "Add chicken to pantry, 500g, expires Friday"
→ Adds to pantry inventory

User: "Generate grocery list"
→ Creates shopping list from meal plan

User: "What can I cook with what I have?"
→ Returns recipe suggestions based on pantry
```

## Smart Features

### Auto-Expiry Alerts

When you view the pantry, items expiring in 3 days or less are highlighted:

```bash
meals pantry
# Output:
# ⚠️ EXPIRING SOON: chicken (expires: 2026-02-25)
# ✅ rice (expires: 2027-01-01)
```

### Ingredient Matching

The grocery list generator:
1. Checks pantry for each meal's ingredients
2. Compares ingredients you have vs. what you need
3. Only adds missing ingredients to shopping list

### Recipe Suggestions

When you ask for suggestions:
1. Finds recipes matching available pantry ingredients
2. Sorts by match percentage (most ingredients = higher)
3. Shows top 5 matches

---

*Meal planning made easy for busy families!*
