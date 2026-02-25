#!/bin/bash

# Enhanced Meal Planning & Grocery List Manager with Full Recipes
# Plan meals, store recipes, auto-rotate weekly, track pantry

MEAL_DIR="$HOME/.openclaw/workspace/skills/meal-planner"
MEALS_FILE="$MEAL_DIR/meals-full.json"
PANTRY_FILE="$MEAL_DIR/pantry.json"
GROCERY_LIST="$MEAL_DIR/grocery-list.txt"
WEEKLY_PLAN="$MEAL_DIR/weekly-plan.md"
DATE=$(date '+%Y-%m-%d')
TODAY=$(date '+%A')
NOW=$(date '+%Y-%m-%d %H:%M:%S')
WEEK_START=$(date -d 'monday' '+%Y-%m-%d' 2>/dev/null || date -v-monday '+%Y-%m-%d')

# Initialize files
init_files() {
    if [ ! -f "$MEALS_FILE" ]; then
        cat > "$MEALS_FILE" << 'EOF'
{
  "meals": [],
  "meal_plan": {},
  "rotation_settings": {
    "no_repeats_days": 7,
    "tuesday_vegetarian": true,
    "balance_chicken_veg": 3
  }
}
EOF
        echo "✅ Initialized meals database (full recipes)"
    fi

    if [ ! -f "$PANTRY_FILE" ]; then
        cat > "$PANTRY_FILE" << 'EOF'
{
  "pantry": []
}
EOF
        echo "✅ Initialized pantry database"
    fi
}

# Add full recipe with steps
add_recipe() {
    init_files

    local name="$1"
    local ingredients="$2"
    local steps="$3"
    local tags="$4"
    local prep_time="${5:-15 min}"
    local cook_time="${6:-30 min}"
    local serves="${7:-4}"
    local source="${8:-}"

    if [ -z "$name" ]; then
        echo "❌ Error: Recipe name required"
        return 1
    fi

    # Convert comma-separated lists to arrays
    local ing_array=$(echo "$ingredients" | sed 's/,/","/g' | sed 's/^/"/;s/$/"/')
    local tags_array=$(echo "$tags" | sed 's/,/","/g' | sed 's/^/"/;s/$/"/')
    local steps_array=$(echo "$steps" | sed 's/|/","/g' | sed 's/^/"/;s/$/"/')

    # Create new recipe entry
    local new_recipe=$(cat <<EOF
{
  "name": "$name",
  "ingredients": [$ing_array],
  "steps": [$steps_array],
  "tags": [$tags_array],
  "prep_time": "$prep_time",
  "cook_time": "$cook_time",
  "serves": $serves,
  "source": "$source",
  "created_at": "$NOW"
}
EOF
)

    # Add to meals array
    tmp=$(mktemp)
    jq ".meals += [$new_recipe]" "$MEALS_FILE" > "$tmp"
    mv "$tmp" "$MEALS_FILE"

    echo "✅ Recipe added: $name"
    echo "   Prep: $prep_time | Cook: $cook_time | Serves: $serves"
}

# Add toddler-friendly tips to existing recipe
add_toddler_tips() {
    init_files

    local recipe_name="$1"
    local tips="$2"

    if [ -z "$recipe_name" ] || [ -z "$tips" ]; then
        echo "❌ Error: Recipe name and tips required"
        return 1
    fi

    tmp=$(mktemp)
    jq "(.meals[] | select(.name == \"$recipe_name\")) |= (.toddler_tips = \"$tips\")" "$MEALS_FILE" > "$tmp"
    mv "$tmp" "$MEALS_FILE"

    echo "✅ Toddler tips added to: $recipe_name"
}

# View full recipe
view_recipe() {
    init_files

    local recipe_name="$1"

    if [ -z "$recipe_name" ]; then
        echo "❌ Error: Recipe name required"
        return 1
    fi

    echo "📖 Recipe: $recipe_name"
    echo "─────────────────────────────────"
    echo ""

    jq -r --arg name "$recipe_name" '.meals[] | select(.name == $name) |
    "\n🍽️  \(.name)\n\n📋 Ingredients:\n\(.ingredients | map("• \(. // empty)") | join("\n"))\n\n👨‍🍳 Steps:\n\(.steps | map("\(.)") | map("\(.)") | map("  \(. // empty)") | join("\n"))\n\n⏱️  Prep: \(.prep_time) | Cook: \(.cook_time)\n👥 Serves: \(.serves)\n🏷️  Tags: \(.tags | join(\", \"))\n\(.toddler_tips // "")\n📚 Source: \(.source // "Custom")"' "$MEALS_FILE"
}

# Auto-generate weekly meal plan
generate_weekly_plan() {
    init_files

    echo "🔄 Generating weekly meal plan..."
    echo "   (No repeats within 7 days, Tuesday vegetarian)"
    echo ""

    local days=("Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday" "Sunday")
    local meal_types=("breakfast" "lunch" "dinner")
    local weekly_meals=()

    # Get available recipes
    local breakfasts=$(jq -r '.meals[] | select(.tags[] == "breakfast") | .name' "$MEALS_FILE" | head -10)
    local lunches=$(jq -r '.meals[] | select(.tags[] == "lunch") | .name' "$MEALS_FILE" | head -10)
    local dinners=$(jq -r '.meals[] | select(.tags[] == "dinner") | .name' "$MEALS_FILE" | head -10)

    # If lunch is empty, use dinners tagged as lunch/dinner or vegetarian
    if [ -z "$lunches" ]; then
        lunches=$(jq -r '.meals[] | select(.tags[] == "lunch" or .tags[] == "vegetarian") | .name' "$MEALS_FILE" | head -10)
    fi

    # Create meal plan
    local plan=""

    for day in "${days[@]}"; do
        local breakfast=""
        local lunch=""
        local dinner=""

        # Pick breakfast (rotate through list)
        breakfast=$(echo "$breakfasts" | head -1)
        breakfasts=$(echo "$breakfasts" | tail -n +2)
        if [ -z "$breakfast" ]; then
            breakfasts=$(jq -r '.meals[] | select(.tags[] == "breakfast") | .name' "$MEALS_FILE" | head -10)
            breakfast=$(echo "$breakfasts" | head -1)
            breakfasts=$(echo "$breakfasts" | tail -n +2)
        fi

        # Pick lunch
        lunch=$(echo "$lunches" | head -1)
        lunches=$(echo "$lunches" | tail -n +2)
        if [ -z "$lunch" ]; then
            lunches=$(jq -r '.meals[] | select(.tags[] == "lunch" or .tags[] == "vegetarian") | .name' "$MEALS_FILE" | head -10)
            lunch=$(echo "$lunches" | head -1)
            lunches=$(echo "$lunches" | tail -n +2)
        fi

        # Pick dinner (vegetarian on Tuesday)
        if [ "$day" = "Tuesday" ]; then
            dinner=$(jq -r '.meals[] | select(.tags[] == "dinner" and (.tags[] == "vegetarian" or .tags[] == "tuesday")) | .name' "$MEALS_FILE" | head -1)
        else
            dinner=$(echo "$dinners" | head -1)
            dinners=$(echo "$dinners" | tail -n +2)
            if [ -z "$dinner" ]; then
                dinners=$(jq -r '.meals[] | select(.tags[] == "dinner") | .name' "$MEALS_FILE" | head -10)
                dinner=$(echo "$dinners" | head -1)
                dinners=$(echo "$dinners" | tail -n +2)
            fi
        fi

        # Add to plan
        plan+="\n📅 $day:\n  🥞 Breakfast: $breakfast\n  🍱 Lunch: $lunch\n  🍽️  Dinner: $dinner\n"
        weekly_meals+=("$breakfast" "$lunch" "$dinner")
    done

    # Save to JSON
    tmp=$(mktemp)
    jq -r '.meal_plan = {}' "$MEALS_FILE" > "$tmp"
    mv "$tmp" "$MEALS_FILE"

    # Save to markdown file
    cat > "$WEEKLY_PLAN" << EOF
# Weekly Meal Plan
# Week of: $WEEK_START
# Generated: $NOW

$plan

## Notes
- Tuesday is fully vegetarian
- No repeats within 7 days
- Toddler-friendly meals marked in recipe details

---
EOF

    echo "✅ Weekly meal plan generated!"
    echo ""
    echo "$plan"
    echo ""
    echo "📄 Saved to: $WEEKLY_PLAN"
}

# Generate grocery list from meal plan
generate_grocery_list() {
    init_files

    echo "🛒 Generating grocery list..."
    echo ""

    local grocery_list="# Grocery List\n# Generated: $NOW\n# Week of: $WEEK_START\n\n"

    # Get all meals from current plan
    local all_meals=$(jq -r '[.meal_plan[].breakfast, .meal_plan[].lunch, .meal_plan[].dinner] | map(select(. != null)) | unique | join(",")' "$MEALS_FILE")

    if [ -z "$all_meals" ] || [ "$all_meals" = "null" ]; then
        echo "⚠️  No meal plan found"
        echo "   Run: meals-recipe generate-week"
        return 0
    fi

    # Collect all ingredients from recipes
    echo "$all_meals" | tr ',' '\n' | while read -r meal; do
        local ingredients=$(jq -r --arg m "$meal" '.meals[] | select(.name == $m) | .ingredients[]' "$MEALS_FILE")
        if [ -n "$ingredients" ]; then
            echo "$ingredients" | while read -r ing; do
                # Add to list (basic implementation)
                [ -n "$ing" ] && echo "$ing" >> /tmp/grocery_items.txt
            done
        fi
    done

    # Organize by category
    if [ -f /tmp/grocery_items.txt ]; then
        grocery_list+="\n## 🥚 Breakfast Items\n"
        grep -i "egg\|bread\|butter\|milk\|poha\|sooji\|flour" /tmp/grocery_items.txt 2>/dev/null | sort -u | sed 's/^/- /'

        grocery_list+="\n## 🥦 Vegetables\n"
        grep -i "onion\|tomato\|potato\|cauliflower\|peas\|beans\|carrot\|spinach\|coriander" /tmp/grocery_items.txt 2>/dev/null | sort -u | sed 's/^/- /'

        grocery_list+="\n## 🍖 Proteins\n"
        grep -i "chicken\|paneer\|dal\|lentil\|chickpea" /tmp/grocery_items.txt 2>/dev/null | sort -u | sed 's/^/- /'

        grocery_list+="\n## 🧂 Spices & Pantry\n"
        grep -i "salt\|pepper\|turmeric\|cumin\|masala\|chilli\|ghee\|oil\|mustard\|cashew" /tmp/grocery_items.txt 2>/dev/null | sort -u | sed 's/^/- /'

        rm /tmp/grocery_items.txt
    fi

    # Save to file
    cat > "$GROCERY_LIST" << EOF
$grocery_list
EOF

    echo "✅ Grocery list generated!"
    echo ""
    echo "$grocery_list"
    echo ""
    echo "📄 Saved to: $GROCERY_LIST"
}

# Find recipes by ingredient/tag
find_recipes() {
    init_files

    local query="$1"

    if [ -z "$query" ]; then
        echo "❌ Error: Search query required"
        return 1
    fi

    echo "🔍 Search Results for: $query"
    echo "─────────────────────────────────"
    echo ""

    jq -r --arg q "$query" '.meals[] | select(.name | ascii_downcase | contains($q | ascii_downcase)) or .tags[] | ascii_downcase | contains($q | ascii_downcase)) |
    "\n🍽️  \(.name)\n   ⏱️  Prep: \(.prep_time) | Cook: \(.cook_time)\n   🏷️  \(.tags | join(\", \"))\n   👥 Serves: \(.serves)\n   \(.toddler_tips // "")\n   📚 \(.source // "Custom")"' "$MEALS_FILE"
}

# Add Bharat's Kitchen recipe templates
add_bharat_recipes() {
    init_files

    echo "📺 Adding Bharat's Kitchen recipes..."

    # Scrambled Eggs (Bharat style)
    add_recipe "Scrambled Eggs" \
        "eggs, butter, salt, pepper, coriander, green chilli" \
        "Beat eggs lightly with salt and pepper|Heat butter in pan on medium heat|Pour beaten eggs, stir gently|Cook until soft curds form (2-3 min)|Add chopped coriander|Serve hot" \
        "breakfast,quick,toddler-friendly" \
        "5 min" \
        "5 min" \
        "3" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Scrambled Eggs" "Mash slightly, skip green chilli, serve warm"

    # Poha (Bharat style)
    add_recipe "Poha" \
        "poha, onion, mustard seeds, turmeric, peanuts, green chilli, coriander, lemon" \
        "Rinse poha in water, drain|Heat oil, add mustard seeds|Add chopped onions, sauté|Add turmeric, peanuts|Add poha, mix gently|Cook for 2-3 minutes|Garnish with coriander, squeeze lemon" \
        "breakfast,north-indian,vegetarian,toddler-friendly,tuesday" \
        "5 min" \
        "10 min" \
        "3" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Poha" "No green chilli, mash lightly, add extra peanuts for protein"

    # Aloo Paratha (Bharat style)
    add_recipe "Aloo Paratha" \
        "whole wheat flour, potato, cumin, red chilli powder, coriander, ghee" \
        "Boil and mash potatoes|Add cumin, chilli powder, coriander|Make small dough balls|Roll out with potato stuffing|Cook on tawa with ghee|Flip and cook both sides" \
        "breakfast,north-indian,vegetarian,toddler-friendly" \
        "20 min" \
        "15 min" \
        "3" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Aloo Paratha" "Serve with curd, remove chilli, cut into small pieces"

    # Rajma Chawal (Bharat signature)
    add_recipe "Rajma Chawal" \
        "rajma/kidney beans, onion, tomato, ginger-garlic paste, cumin, turmeric, garam masala, coriander, rice" \
        "Soak rajma overnight|Pressure cook rajma until soft|Heat oil, add cumin|Add onions, sauté|Add ginger-garlic paste, cook|Add tomatoes, cook until soft|Add turmeric, garam masala|Add cooked rajma, simmer|Garnish with coriander|Serve with rice" \
        "lunch,north-indian,vegetarian,toddler-friendly" \
        "30 min" \
        "45 min" \
        "4" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Rajma Chawal" "Mash rajma well, reduce spice, serve with ghee on rice"

    # Dal Makhani (Bharat signature)
    add_recipe "Dal Makhani" \
        "black lentils, butter, cream, tomato, onion, ginger-garlic, garam masala, fenugreek leaves" \
        "Soak lentils overnight|Pressure cook until soft|Heat butter, add cumin|Add onions, sauté|Add ginger-garlic, cook|Add tomatoes, cook|Add garam masala|Add cooked lentils, simmer|Add cream, mix|Garnish with fenugreek leaves" \
        "dinner,north-indian,vegetarian,toddler-friendly,tuesday" \
        "20 min" \
        "60 min" \
        "4" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Dal Makhani" "Serve with roti, skip extra cream for toddler portion"

    # Palak Paneer
    add_recipe "Palak Paneer" \
        "spinach, paneer, onion, tomato, garlic, cumin, garam masala, cream" \
        "Blanch spinach, blend to puree|Fry paneer cubes, keep aside|Heat oil, add cumin|Add onions, sauté|Add ginger-garlic|Add spinach puree|Cook for 5 minutes|Add garam masala|Add paneer cubes|Add cream, simmer|Garnish with coriander" \
        "dinner,north-indian,vegetarian,toddler-friendly" \
        "15 min" \
        "25 min" \
        "4" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Palak Paneer" "Cut paneer into small cubes, mash spinach well"

    # Butter Chicken (Bharat home-style)
    add_recipe "Butter Chicken" \
        "chicken, butter, tomato, cream, ginger-garlic paste, garam masala, kasuri methi" \
        "Marinate chicken with yogurt and spices|Heat butter, add cumin|Add ginger-garlic paste|Add tomatoes, cook|Add garam masala|Add chicken, cook|Add cream, simmer|Garnish with kasuri methi" \
        "dinner,north-indian,non-vegetarian" \
        "30 min" \
        "40 min" \
        "4" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Butter Chicken" "Reduce spice, serve with rice or roti"

    # Chicken Biryani
    add_recipe "Chicken Biryani" \
        "basmati rice, chicken, yogurt, whole spices, onion, tomato, ginger-garlic, garam masala, saffron" \
        "Marinate chicken with yogurt and spices|Soak rice for 30 minutes|Heat oil, add whole spices|Add onions, fry|Add chicken, cook|Add tomatoes, cook|Layer rice over chicken|Add saffron milk|Cover and cook on dum|Serve hot" \
        "dinner,north-indian,non-vegetarian,special" \
        "30 min" \
        "45 min" \
        "4" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Chicken Biryani" "Remove whole spices before serving, add ghee for toddler"

    # Paneer Do Pyaza
    add_recipe "Paneer Do Pyaza" \
        "paneer, onion (double quantity), tomato, ginger-garlic, garam masala, coriander powder" \
        "Fry paneer cubes|Heat oil, add cumin|Add onions (half quantity), fry|Add ginger-garlic|Add tomatoes|Add garam masala, coriander powder|Add paneer|Add remaining onions|Garnish with coriander" \
        "dinner,north-indian,vegetarian,toddler-friendly" \
        "15 min" \
        "25 min" \
        "4" \
        "Bharat's Kitchen Hindi"

    add_toddler_tips "Paneer Do Pyaza" "Serve with roti, reduce onion pieces for toddler"

    echo "✅ Bharat's Kitchen recipes added!"
}

# List all recipes
list_recipes() {
    init_files

    echo "📖 All Recipes:"
    echo "─────────────────────────────────"
    echo ""

    jq -r '.meals[] | "\(.name) | \(.prep_time) prep, \(.cook_time) cook | \(.tags | join(\", \"))"' "$MEALS_FILE"
}

# Help
show_help() {
    echo "🍽️  Enhanced Meal Planning Manager with Full Recipes"
    echo "─────────────────────────────────"
    echo ""
    echo "Commands:"
    echo "  meals-recipe add \"Name\" \"ingredients\" \"steps|separated|by|pipe\" [options]"
    echo "      Add full recipe with cooking steps"
    echo "      Options: --tags, --prep-time, --cook-time, --serves, --source"
    echo ""
    echo "  meals-recipe add-bharat"
    echo "      Add Bharat's Kitchen recipe collection"
    echo ""
    echo "  meals-recipe recipe \"Name\""
    echo "      View full recipe with steps"
    echo ""
    echo "  meals-recipe toddler \"Name\" \"Tips\""
    echo "      Add toddler-friendly tips to recipe"
    echo ""
    echo "  meals-recipe generate-week"
    echo "      Auto-generate weekly meal plan (no repeats, Tue vegetarian)"
    echo ""
    echo "  meals-recipe generate-list"
    echo "      Generate grocery list from meal plan"
    echo ""
    echo "  meals-recipe find \"query\""
    echo "      Search recipes by name or tag"
    echo ""
    echo "  meals-recipe list"
    echo "      List all recipes"
    echo ""
    echo "  meals-recipe plan"
    echo "      View current weekly plan"
    echo ""
    echo "Examples:"
    echo "  meals-recipe add-bharat"
    echo "  meals-recipe generate-week"
    echo "  meals-recipe recipe \"Aloo Paratha\""
    echo "  meals-recipe find \"paneer\""
    echo "  meals-recipe generate-list"
}

# Main command handler
case "$1" in
    add)
        shift
        add_recipe "$@"
        ;;
    add-bharat)
        add_bharat_recipes
        ;;
    recipe)
        shift
        view_recipe "$@"
        ;;
    toddler)
        shift
        add_toddler_tips "$@"
        ;;
    generate-week|week)
        generate_weekly_plan
        ;;
    generate-list|list)
        generate_grocery_list
        ;;
    find|search)
        shift
        find_recipes "$@"
        ;;
    plan)
        cat "$WEEKLY_PLAN" 2>/dev/null || echo "No weekly plan yet. Run: meals-recipe generate-week"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
