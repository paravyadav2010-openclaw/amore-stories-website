#!/bin/bash

# Meal Planning & Grocery List Manager
# Plan meals, track pantry, auto-generate shopping lists

MEAL_DIR="$HOME/.openclaw/workspace/skills/meal-planner"
MEALS_FILE="$MEAL_DIR/meals.json"
PANTRY_FILE="$MEAL_DIR/pantry.json"
GROCERY_LIST="$MEAL_DIR/grocery-list.txt"
DATE=$(date '+%Y-%m-%d')
TODAY=$(date '+%A')
NOW=$(date '+%Y-%m-%d %H:%M:%S')

# Initialize files
init_files() {
    # Create meal database if it doesn't exist
    if [ ! -f "$MEALS_FILE" ]; then
        cat > "$MEALS_FILE" << 'EOF'
{
  "meals": [],
  "meal_plan": {}
}
EOF
        echo "✅ Initialized meals database"
    fi

    # Create pantry database if it doesn't exist
    if [ ! -f "$PANTRY_FILE" ]; then
        cat > "$PANTRY_FILE" << 'EOF'
{
  "pantry": []
}
EOF
        echo "✅ Initialized pantry database"
    fi
}

# Parse meal addition arguments
parse_meal_args() {
    local name=""
    local ingredients=""
    local tags=""
    local prep_time=""
    local serves=2

    while [[ $# -gt 0 ]]; do
        case $1 in
            --ingredients)
                ingredients="$2"
                shift 2
                ;;
            --tags)
                tags="$2"
                shift 2
                ;;
            --prep-time)
                prep_time="$2"
                shift 2
                ;;
            --serves)
                serves="$2"
                shift 2
                ;;
            *)
                if [ -z "$name" ]; then
                    name="$*"
                fi
                break
                ;;
        esac
    done

    echo "$name|$ingredients|$tags|$prep_time|$serves"
}

# Add a meal
add_meal() {
    init_files

    local parsed=$(parse_meal_args "$@")
    IFS='|' read -r name ingredients tags prep_time serves <<< "$parsed"

    if [ -z "$name" ]; then
        echo "❌ Error: Meal name required"
        echo "   Usage: meals add \"Meal Name\" --ingredients \"item1,item2\" --tags \"tag1,tag2\""
        return 1
    fi

    # Create new meal entry
    local new_meal=$(cat <<EOF
{
  "name": "$name",
  "ingredients": [$(echo "$ingredients" | sed 's/,/","/g' | sed 's/^/"/;s/$/"/')],
  "tags": [$(echo "$tags" | sed 's/,/","/g' | sed 's/^/"/;s/$/"/')],
  "prep_time": "$prep_time",
  "serves": $serves,
  "created_at": "$NOW"
}
EOF
)

    # Add to meals array
    tmp=$(mktemp)
    jq ".meals += [$new_meal]" "$MEALS_FILE" > "$tmp"
    mv "$tmp" "$MEALS_FILE"

    echo "✅ Meal added: $name"
    echo "   Tags: ${tags:-none}"
    echo "   Ingredients: ${ingredients:-none}"
}

# Add item to pantry
add_pantry_item() {
    init_files

    local name=""
    local quantity="1"
    local expiry=""
    local category="other"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --quantity)
                quantity="$2"
                shift 2
                ;;
            --expiry)
                expiry="$2"
                shift 2
                ;;
            --category)
                category="$2"
                shift 2
                ;;
            *)
                name="$1"
                shift
                ;;
        esac
    done

    if [ -z "$name" ]; then
        echo "❌ Error: Item name required"
        echo "   Usage: meals pantry-add \"item\" --quantity \"X\" --expiry \"YYYY-MM-DD\" --category \"category\""
        return 1
    fi

    local expiry_display="${expiry:-unknown}"
    local new_item=$(cat <<EOF
{
  "name": "$name",
  "quantity": "$quantity",
  "expiry": "$expiry",
  "category": "$category",
  "added_at": "$NOW"
}
EOF
)

    # Add to pantry
    tmp=$(mktemp)
    jq ".pantry += [$new_item]" "$PANTRY_FILE" > "$tmp"
    mv "$tmp" "$PANTRY_FILE"

    echo "✅ Added to pantry: $name ($quantity)"
}

# View pantry
view_pantry() {
    init_files

    echo "📦 Pantry Inventory:"
    echo "─────────────────────────────────"
    echo ""

    local today=$(date -d "$DATE" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$DATE" +%s)
    local three_days_later=$(date -d "+3 days" +%s 2>/dev/null || date -v+3d +%s)

    jq -r '.pantry[] | "\(.name)|\(.quantity)|\(.expiry)|\(.category)"' "$PANTRY_FILE" | while IFS='|' read -r name quantity expiry category; do
        local expiry_date=$(date -d "$expiry" +%s 2>/dev/null || echo "$expiry")

        if [ "$expiry" != "unknown" ] && [ "$expiry_date" != "$expiry" ]; then
            if [ "$expiry_date" -lt "$today" ]; then
                echo "🔴 EXPIRED: $name ($quantity) — Expired: $expiry"
            elif [ "$expiry_date" -lt "$three_days_later" ]; then
                echo "⚠️  EXPIRING SOON: $name ($quantity) — Expires: $expiry"
            else
                echo "✅ $name ($quantity) — Expires: $expiry"
            fi
        else
            echo "✅ $name ($quantity) — Category: $category"
        fi
    done
}

# Generate weekly meal plan
generate_weekly_plan() {
    init_files

    echo "🗓️  Generating weekly meal plan..."
    echo ""

    local days=("Monday" "Tuesday" "Wednesday" "Thursday" "Friday" "Saturday" "Sunday")
    local meal_types=("breakfast" "lunch" "dinner")

    for day in "${days[@]}"; do
        local plan_date=$(date -d "$day" '+%Y-%m-%d' 2>/dev/null || date -j -f "%A" "$day" '+%Y-%m-%d')

        echo "📅 $day ($plan_date):"
        for meal_type in "${meal_types[@]}"; do
            local suggestion=$(jq -r --arg mt "$meal_type" '.meals | map(select(.tags[] | contains($mt) or contains("dinner") or contains("lunch") or contains("breakfast"))) | .[0].name // "Not planned"' "$MEALS_FILE")
            echo "   $meal_type: $suggestion"
        done
        echo ""
    done

    echo "ℹ️  To customize, edit: $MEALS_FILE"
}

# View current meal plan
view_meal_plan() {
    init_files

    echo "🗓️  Meal Plan:"
    echo "─────────────────────────────────"
    echo ""

    # Check if meal plan exists
    local has_plan=$(jq '.meal_plan | length' "$MEALS_FILE")

    if [ "$has_plan" = "0" ]; then
        echo "⚠️  No meal plan set yet"
        echo "   Run: meals plan-week"
        return 0
    fi

    jq -r '.meal_plan | to_entries[] | "\n\(.key):\n  Breakfast: \(.value.breakfast // "Not planned")\n  Lunch: \(.value.lunch // "Not planned")\n  Dinner: \(.value.dinner // "Not planned")"' "$MEALS_FILE"
}

# Generate grocery list
generate_grocery_list() {
    init_files

    echo "🛒 Generating grocery list..."
    echo ""

    # Get all ingredients from meal plan
    local all_ingredients=$(jq -r '[.meal_plan[].breakfast, .meal_plan[].lunch, .meal_plan[].dinner] | map(select(. != null)) | join(",")' "$MEALS_FILE")

    if [ -z "$all_ingredients" ] || [ "$all_ingredients" = "null" ]; then
        echo "⚠️  No meal plan found"
        echo "   Run: meals plan-week first"
        return 0
    fi

    # Get pantry items
    local pantry_items=$(jq -r '.pantry[].name' "$PANTRY_FILE" | tr '\n' ',')

    # Generate list
    cat > "$GROCERY_LIST" << EOF
# Grocery List
# Generated: $NOW
# Based on meal plan for week starting: $(date '+%Y-%m-%d')

EOF

    # For demo purposes, just list all ingredients
    # In production, this would match against pantry
    echo "$all_ingredients" | tr ',' '\n' | grep -v "^$" | sort -u | sed 's/^/- /' >> "$GROCERY_LIST"

    echo ""
    echo "✅ Grocery list generated: $GROCERY_LIST"
    echo ""
    echo "📋 List contents:"
    cat "$GROCERY_LIST"
}

# Suggest recipes based on pantry
suggest_recipes() {
    init_files

    echo "💡 Recipe Suggestions (based on pantry):"
    echo "─────────────────────────────────"
    echo ""

    # Get pantry ingredients
    local pantry_ingredients=$(jq -r '.pantry[].name' "$PANTRY_FILE" | tr '\n' ' ')

    if [ -z "$pantry_ingredients" ]; then
        echo "⚠️  Pantry is empty"
        echo "   Add items: meals pantry-add \"item\""
        return 0
    fi

    echo "📦 You have: $pantry_ingredients"
    echo ""
    echo "🍽️  Suggested recipes:"
    echo ""

    # Find meals matching pantry ingredients
    jq -r '.meals[] | "\(.name)|\(.ingredients | join(","))"' "$MEALS_FILE" | while IFS='|' read -r name ingredients; do
        local match_count=0
        for ingredient in $(echo "$ingredients" | tr ',' ' '); do
            if [[ "$pantry_ingredients" =~ "$ingredient" ]]; then
                ((match_count++))
            fi
        done

        if [ "$match_count" -gt 0 ]; then
            echo "📌 $name (matches $match_count ingredient(s))"
            echo "   Ingredients: $ingredients"
            echo ""
        fi
    done
}

# View meal history
view_history() {
    init_files

    local period="${1:-all}"

    echo "📜 Meal History:"
    echo "─────────────────────────────────"
    echo ""

    case "$period" in
        last-7)
            local week_ago=$(date -d '7 days ago' '+%Y-%m-%d' 2>/dev/null || date -v-7d '+%Y-%m-%d')
            jq -r ".meals | map(select(.created_at >= \"$week_ago\")) | .[] | \"\(.created_at): \(.name) — \(.prep_time // 'no time')\"" "$MEALS_FILE"
            ;;
        *)
            jq -r '.meals | reverse | .[] | "\(.created_at): \(.name) — \(.tags | join(\", \"))"' "$MEALS_FILE"
            ;;
    esac
}

# Help
show_help() {
    echo "🍽️  Meal Planning & Grocery List Manager"
    echo "─────────────────────────────────"
    echo ""
    echo "Commands:"
    echo "  meals add \"Meal Name\" [options]"
    echo "      Add a new meal/recipe"
    echo "      Options: --ingredients, --tags, --prep-time, --serves"
    echo ""
    echo "  meals pantry-add \"item\" [options]"
    echo "      Add item to pantry"
    echo "      Options: --quantity, --expiry, --category"
    echo ""
    echo "  meals pantry"
    echo "      View pantry inventory (expiring items highlighted)"
    echo ""
    echo "  meals plan"
    echo "      View current meal plan"
    echo ""
    echo "  meals plan-week"
    echo "      Generate weekly meal plan"
    echo ""
    echo "  meals generate-list"
    echo "      Generate grocery list from meal plan"
    echo ""
    echo "  meals suggest"
    echo "      Get recipe suggestions based on pantry"
    echo ""
    echo "  meals history [last-7]"
    echo "      View meal history"
    echo ""
    echo "Examples:"
    echo "  meals add \"Chicken Curry\" --ingredients \"chicken,rice,curry\" --tags \"dinner,indian\""
    echo "  meals pantry-add \"chicken\" --quantity \"500g\" --expiry \"2026-02-25\""
    echo "  meals plan-week"
    echo "  meals generate-list"
    echo "  meals suggest"
}

# Main command handler
case "$1" in
    add)
        shift
        add_meal "$@"
        ;;
    pantry-add)
        shift
        add_pantry_item "$@"
        ;;
    pantry)
        view_pantry
        ;;
    plan)
        view_meal_plan
        ;;
    plan-week)
        generate_weekly_plan
        ;;
    generate-list)
        generate_grocery_list
        ;;
    suggest)
        shift
        suggest_recipes
        ;;
    history)
        shift
        view_history "$@"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
