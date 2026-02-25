# Enhanced Meal Planning & Grocery List Manager

Full recipe management with Bharat's Kitchen dishes, weekly rotation, and toddler-friendly tips.

## Quick Setup

```bash
# Add alias to ~/.zshrc
echo 'alias meals-recipe=~/.openclaw/workspace/skills/meal-planner/meals-recipe.sh' >> ~/.zshrc
source ~/.zshrc
```

---

## 🚀 Getting Started

### Step 1: Add Bharat's Kitchen Recipes
```bash
meals-recipe add-bharat
```

This adds 10 authentic recipes:
- Scrambled Eggs, Poha, Aloo Paratha (breakfast)
- Rajma Chawal, Dal Makhani (lunch/dinner)
- Palak Paneer, Butter Chicken, Chicken Biryani, Paneer Do Pyaza (dinner)

### Step 2: Generate Weekly Meal Plan
```bash
meals-recipe generate-week
```

Features:
- ✅ No repeats within 7 days
- ✅ Tuesday fully vegetarian
- ✅ Balanced chicken/vegetarian meals
- ✅ Auto-rotates breakfasts

### Step 3: View Full Recipe
```bash
meals-recipe recipe "Aloo Paratha"
```

Shows:
- Full ingredient list
- Step-by-step cooking instructions
- Toddler-friendly tips
- Prep and cook times

### Step 4: Generate Grocery List
```bash
meals-recipe generate-list
```

Auto-generates from your weekly plan.

---

## 📖 Full Recipes Included

### Breakfast

**1. Scrambled Eggs**
- Bharat's style: Soft curds with coriander
- Prep: 5 min | Cook: 5 min
- **Toddler tip:** Mash slightly, skip green chilli

**2. Poha**
- Authentic: With peanuts, mustard seeds, turmeric
- Prep: 5 min | Cook: 10 min
- **Toddler tip:** Mash lightly, add extra peanuts

**3. Aloo Paratha**
- Flaky parathas with potato stuffing
- Prep: 20 min | Cook: 15 min
- **Toddler tip:** Serve with curd, cut into pieces

### Lunch/Dinner

**4. Rajma Chawal** ⭐ Bharat's Signature
- Kidney beans with rice (complete meal)
- Prep: 30 min | Cook: 45 min
- **Toddler tip:** Mash rajma well, reduce spice

**5. Dal Makhani** ⭐ Bharat's Signature
- Rich, creamy black lentils
- Prep: 20 min | Cook: 60 min
- **Toddler tip:** Serve with roti, skip extra cream

**6. Palak Paneer**
- Spinach with cottage cheese
- Prep: 15 min | Cook: 25 min
- **Toddler tip:** Cut paneer into small cubes

**7. Butter Chicken** ⭐ Bharat's Home-Style
- Authentic home-style (not restaurant)
- Prep: 30 min | Cook: 40 min
- **Toddler tip:** Reduce spice, serve with rice

**8. Chicken Biryani**
- Easy dum-style biryani
- Prep: 30 min | Cook: 45 min
- **Toddler tip:** Remove whole spices, add ghee

**9. Paneer Do Pyaza**
- Double-onion paneer curry
- Prep: 15 min | Cook: 25 min
- **Toddler tip:** Reduce onion pieces

---

## 🔄 Weekly Rotation System

### How It Works

1. **No Repeats:** Same meal never appears twice in a week
2. **Tuesday Vegetarian:** Automatically ensures Tuesday has no chicken/eggs
3. **Balanced Diet:** Mixes chicken and vegetarian meals
4. **Auto-Rotation:** Breakfasts cycle through available recipes
5. **Fresh Each Week:** Regenerate plan with new combinations

### Generate New Weekly Plan

```bash
meals-recipe generate-week
```

Each time you run it, you get a different combination!

---

## 🔍 Find Recipes

### Search by Name
```bash
meals-recipe find "paneer"
```

Returns:
- Palak Paneer
- Paneer Do Pyaza

### Search by Tag
```bash
meals-recipe find "vegetarian"
```

Returns all vegetarian recipes.

### Search by Type
```bash
meals-recipe find "breakfast"
```

Returns all breakfast options.

---

## 👶 Toddler-Friendly Features

Every recipe includes toddler tips:
- Spice reduction
- Texture modifications
- Serving suggestions
- Allergy notes

### View Toddler Tips

```bash
meals-recipe recipe "Butter Chicken"
```

Shows toddler-friendly version.

### Add Custom Toddler Tips

```bash
meals-recipe toddler "Recipe Name" "Your custom tips"
```

---

## 📋 View Current Plan

```bash
meals-recipe plan
```

Shows this week's meal plan.

---

## 🛒 Grocery List

### Generate from Plan

```bash
meals-recipe generate-list
```

Organizes by:
- 🥚 Breakfast items
- 🥦 Vegetables
- 🍖 Proteins
- 🧂 Spices & pantry

---

## 💡 Daily Workflow

### Morning
```bash
meals-recipe plan
# See what's for today

meals-recipe recipe "Meal Name"
# Get full recipe + steps
```

### Weekly Planning (Sunday)
```bash
meals-recipe generate-week
# New plan for the week

meals-recipe generate-list
# Get shopping list
```

### Adding New Recipes

```bash
meals-recipe add "New Dish" \
  "ingredient1, ingredient2, ingredient3" \
  "Step 1|Step 2|Step 3" \
  "breakfast, vegetarian, toddler-friendly" \
  "10 min" \
  "20 min" \
  "4" \
  "Bharat's Kitchen Hindi"
```

---

## 🎯 Example Commands

```bash
# Add Bharat's recipes
meals-recipe add-bharat

# Generate new weekly plan
meals-recipe generate-week

# View recipe
meals-recipe recipe "Aloo Paratha"

# Search for paneer recipes
meals-recipe find "paneer"

# Generate grocery list
meals-recipe generate-list

# List all recipes
meals-recipe list
```

---

## 🔧 Advanced Features

### Add Custom Recipe
```bash
meals-recipe add "Custom Dal" \
  "moong dal, onion, tomato, ghee, cumin" \
  "Wash dal|Pressure cook with water|Heat ghee, add cumin|Add onion, sauté|Add dal, mix|Garnish" \
  "lunch, vegetarian, toddler-friendly" \
  "5 min" \
  "20 min" \
  "4" \
  "Family recipe"
```

### Add Toddler Tips
```bash
meals-recipe toddler "Butter Chicken" "Reduce chilli powder by half, serve with extra rice for toddler"
```

---

## 📊 What Changed?

### Old System
- ❌ Meal names only
- ❌ No cooking steps
- ❌ No toddler tips
- ❌ Fixed meal plan

### New System
- ✅ Full recipes with steps
- ✅ Bharat's Kitchen authentic dishes
- ✅ Toddler-friendly tips for every recipe
- ✅ Weekly auto-rotation
- ✅ Search and filter
- ✅ Source attribution

---

*Cooking made easier for North Indian families! 🍽️*
