# Humanizer Skill

## Description

Transform AI-generated text to sound more human and natural. Removes common AI patterns and makes content sound like the user, not a machine.

## How It Works

The humanizer applies these rules:

1. **Em dashes** — Convert em dashes (—) to regular dashes (--) or rewrite sentence
2. **AI giveaway words** — Remove: certainly, indeed, delve, navigate, landscape
3. **Exclamation marks** — Limit to 1-2 per paragraph max
4. **Repetitive starts** — Don't start multiple sentences/bullets with same word
5. **Sentence variety** — Mix short, medium, long sentences naturally
6. **Formal transitions** — Remove overly formal phrases (e.g., "Furthermore", "Additionally")
7. **Style matching** — Learn from user's writing examples

## Usage

### Command Line

```bash
cd ~/.openclaw/workspace/skills/humanizer

# Humanize a file
python3 humanize.py input.txt

# Humanize text string
python3 humanize.py --text "Your AI text here"

# Learn from user examples
python3 humanize.py --learn examples/

# View current style profile
python3 humanize.py --profile
```

### Python Module

```python
from humanizer import Humanizer

# Initialize with user's style
humanizer = Humanizer()

# Humanize text
humanized = humanizer.humanize("Your AI text here")
print(humanized)

# Learn from examples
humanizer.learn_from("user-writing-sample.txt")
```

### OpenClaw Integration

**Before sending AI content to user:**

```python
from humanizer import Humanizer

humanizer = Humanizer()

# Humanize emails, posts, scripts
email_content = humanizer.humanize(ai_generated_email)
social_post = humanizer.humanize(ai_generated_post)
script_content = humanizer.humanize(ai_generated_script)
```

## Rules Applied

### 1. Em Dashes
- **Before:** "The solution—while simple—works well"
- **After:** "The solution - while simple - works well"
- **Better:** "The solution, while simple, works well"

### 2. AI Giveaway Words
- **Remove:** certainly, indeed, delve, navigate, landscape, furthermore, moreover, utilize, leverage, optimize, enhance, streamline
- **Replace:** "delve into" → "explore" or "look at"
- **Replace:** "navigate through" → "go through" or "work with"

### 3. Exclamation Marks
- **Max:** 1-2 per paragraph
- **Before:** "Great!! This works!!!"
- **After:** "Great! This works."

### 4. Repetitive Starts
- **Before:** "I think... I believe... I suggest..."
- **After:** "I think... My belief is... Suggesting that..."
- **Check:** Vary first word of sentences/bullets

### 5. Sentence Length
- **Natural mix:** 5-15 words (short), 15-25 words (medium), 25-40 words (long)
- **Avoid:** All short or all long sentences
- **Target:** 40% short, 40% medium, 20% long

### 6. Formal Transitions
- **Remove:** "Furthermore," "Additionally," "Moreover," "Consequently," "Notwithstanding"
- **Replace with:** "Also," "Plus," "And," "So,"

### 7. Style Matching
- **Analyze:** User's writing from examples
- **Learn:** Common phrases, sentence patterns, tone
- **Apply:** Match voice, vocabulary, rhythm

## Examples

### Before (AI-generated)

```
Indeed, the solution—while complex—delves into navigating the
landscape of modern productivity. Furthermore, it certainly leverages
multiple strategies to optimize efficiency!

Furthermore, you can implement this easily! Additionally, it's
great for teams!
```

### After (Humanized)

```

The solution, while complex, explores modern productivity. It uses multiple
strategies to improve efficiency.

You can implement this easily. It's also great for teams.
```

## Learning Your Style

**From your examples:**

```bash
# Create style profile from user writing
python3 humanizer.py --learn ~/Documents/Obsidian-OpenClaw/01-Journal/

# View learned patterns
python3 humanize.py --profile
```

**Detected patterns:**
- Common phrases: "Here's what I found", "Let me break this down", "Check this out"
- Sentence length: Mixed, mostly 10-20 words
- Tone: Direct, casual but professional
- Transitions: Simple (and, also, but)
- Exclamation marks: Used sparingly for emphasis

## Configuration

**Edit `config.json` to customize:**

```json
{
  "rules": {
    "max_exclamations_per_paragraph": 2,
    "avoid_words": ["certainly", "indeed", "delve", "navigate", "landscape"],
    "sentence_length_variety": true,
    "avoid_repetitive_starts": true,
    "formal_transitions": ["furthermore", "moreover", "consequently"]
  },
  "style": {
    "tone": "casual-professional",
    "directness": 0.8,
    "contractions": true,
    "common_phrases": [
      "Here's what I found",
      "Let me break this down"
    ]
  }
}
```

## Testing

```bash
# Test with sample text
python3 humanize.py --test

# Compare before/after
python3 humanize.py --compare
```

## Automatic Application

**OpenClaw should apply humanizer before sending content:**

1. Generate content (email, post, script)
2. Run through `humanizer.humanize()`
3. Send humanized result to user
4. User sees natural, human-sounding text

---

**Goal:** Output should sound like YOU, not like AI.
