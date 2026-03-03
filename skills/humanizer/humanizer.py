#!/usr/bin/env python3
"""
Humanizer - Transform AI-generated text to sound more human
"""

import re
import json
import argparse
from pathlib import Path
from typing import List, Dict
import random


class Humanizer:
    """Transform AI text to sound human and natural"""

    def __init__(self, config_path=None):
        self.config = self._load_config(config_path)
        self.style_profile = {
            "tone": "casual-professional",
            "directness": 0.8,
            "contractions": True,
            "common_phrases": [],
            "avg_sentence_length": 15
        }

    def _load_config(self, config_path=None) -> Dict:
        """Load configuration file"""
        if config_path is None:
            config_path = Path(__file__).parent / "config.json"

        if Path(config_path).exists():
            with open(config_path, 'r') as f:
                return json.load(f)

        # Default config
        return {
            "rules": {
                "max_exclamations_per_paragraph": 2,
                "avoid_words": [
                    "certainly", "indeed", "delve", "navigate",
                    "landscape", "furthermore", "moreover", "consequently",
                    "notwithstanding", "utilize", "leverage", "optimize",
                    "enhance", "streamline", "facilitate"
                ],
                "sentence_length_variety": True,
                "avoid_repetitive_starts": True,
                "formal_transitions": [
                    "furthermore", "moreover", "consequently",
                    "notwithstanding", "additionally", "moreover"
                ]
            },
            "style": {
                "tone": "casual-professional",
                "directness": 0.8,
                "contractions": True,
                "common_phrases": []
            }
        }

    def humanize(self, text: str) -> str:
        """Apply all humanization rules to text"""

        if not text:
            return text

        # Step 1: Fix em dashes
        text = self._fix_em_dashes(text)

        # Step 2: Remove AI giveaway words
        text = self._remove_ai_words(text)

        # Step 3: Limit exclamation marks
        text = self._limit_exclamations(text)

        # Step 4: Fix repetitive starts
        text = self._fix_repetitive_starts(text)

        # Step 5: Vary sentence length
        text = self._vary_sentence_length(text)

        # Step 6: Remove formal transitions
        text = self._remove_formal_transitions(text)

        # Step 7: Apply contractions
        text = self._apply_contractions(text)

        # Step 8: Match user style
        text = self._match_style(text)

        return text

    def _fix_em_dashes(self, text: str) -> str:
        """Replace em dashes with regular dashes or rewrite"""

        # Replace em dash with regular dash
        text = text.replace('—', '--')

        # Replace em dash with comma for parenthetical phrases
        text = re.sub(r'--(\w+?)--', r', \1,', text)

        # Replace standalone em dashes with commas or periods
        text = re.sub(r'\s--\s', ', ', text)

        return text

    def _remove_ai_words(self, text: str) -> str:
        """Remove or replace AI giveaway words"""

        avoid_words = self.config["rules"]["avoid_words"]
        replacements = {
            "delve into": "explore",
            "delve": "look at",
            "navigate through": "go through",
            "navigate": "use",
            "landscape": "area",
            "utilize": "use",
            "leverage": "use",
            "optimize": "improve",
            "enhance": "improve",
            "streamline": "simplify",
            "facilitate": "help"
        }

        # Replace phrases first
        for phrase, replacement in replacements.items():
            text = text.replace(phrase, replacement)

        # Remove standalone AI words (with surrounding context)
        for word in avoid_words:
            # Remove "indeed" at start of sentences
            text = re.sub(r'\b' + word + r'\b,', '', text)
            text = re.sub(r'\b' + word + r'\b\.', '', text)

        # Clean up double commas
        text = re.sub(r',\s*,', ',', text)

        return text

    def _limit_exclamations(self, text: str) -> str:
        """Limit exclamation marks to max per paragraph"""

        max_per_para = self.config["rules"]["max_exclamations_per_paragraph"]

        paragraphs = text.split('\n\n')

        for i, para in enumerate(paragraphs):
            exclam_count = para.count('!')

            if exclam_count > max_per_para:
                # Replace excess with periods
                excess = exclam_count - max_per_para
                # Replace from end (less emphasis)
                chars = list(para)
                replaced = 0
                for j in range(len(chars) - 1, -1, -1):
                    if chars[j] == '!' and replaced < excess:
                        chars[j] = '.'
                        replaced += 1
                paragraphs[i] = ''.join(chars)

        return '\n\n'.join(paragraphs)

    def _fix_repetitive_starts(self, text: str) -> str:
        """Avoid starting multiple sentences with same word"""

        sentences = re.split(r'(?<=[.!?])\s+', text)
        start_words = []

        for i, sentence in enumerate(sentences):
            # Get first word (skip bullets/numbers)
            words = sentence.strip().split()
            if not words:
                continue

            first_word = words[0].lower().strip('•-')
            start_words.append(first_word)

        # Find repetitive starts (same word used 3+ times)
        for word in set(start_words):
            count = start_words.count(word)
            if count >= 3:
                # Replace some instances
                replacements = 0
                for i in range(len(sentences)):
                    words = sentences[i].strip().split()
                    if words and words[0].lower().strip('•-') == word:
                        if replacements < count // 2:  # Replace half
                            # Add variety words
                            variety = ["plus", "also", "additionally", "then", "next"]
                            replacement = random.choice(variety)
                            if sentences[i][0].isupper():
                                replacement = replacement.capitalize()
                            sentences[i] = replacement + " " + ' '.join(words[1:])
                            replacements += 1

        return ' '.join(sentences)

    def _vary_sentence_length(self, text: str) -> str:
        """Mix short, medium, long sentences naturally"""

        if not self.config["rules"]["sentence_length_variety"]:
            return text

        sentences = re.split(r'(?<=[.!?])\s+', text)

        # Calculate current sentence lengths
        lengths = [len(s.split()) for s in sentences if s.strip()]
        if not lengths:
            return text

        avg_length = sum(lengths) / len(lengths)

        # If all sentences similar length, vary them
        if max(lengths) - min(lengths) < 5:
            for i, sentence in enumerate(sentences):
                words = sentence.split()
                current_len = len(words)

                if current_len > avg_length + 5:
                    # Split long sentences
                    mid = len(words) // 2
                    first = ' '.join(words[:mid])
                    second = ' '.join(words[mid:])
                    sentences[i] = first + ". " + second.capitalize()
                elif current_len < avg_length - 5 and i < len(sentences) - 1:
                    # Combine short sentences
                    next_words = sentences[i+1].split() if i+1 < len(sentences) else []
                    if next_words:
                        combined = ' '.join(words + next_words)
                        sentences[i] = combined
                        sentences[i+1] = ""

        return ' '.join([s for s in sentences if s.strip()])

    def _remove_formal_transitions(self, text: str) -> str:
        """Remove overly formal transition words"""

        formal = self.config["rules"]["formal_transitions"]

        for transition in formal:
            # Remove transition + comma
            pattern = r'\b' + transition + r',\s*'
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)

            # Remove transition at start of sentence
            pattern = r'^\s*' + transition + r'\s+'
            text = re.sub(pattern, '', text, flags=re.MULTILINE | re.IGNORECASE)

        return text

    def _apply_contractions(self, text: str) -> str:
        """Apply contractions for more natural tone"""

        if not self.config["style"]["contractions"]:
            return text

        contractions = {
            "do not": "don't",
            "does not": "doesn't",
            "did not": "didn't",
            "can not": "can't",
            "cannot": "can't",
            "will not": "won't",
            "would not": "wouldn't",
            "should not": "shouldn't",
            "could not": "couldn't",
            "I am": "I'm",
            "you are": "you're",
            "he is": "he's",
            "she is": "she's",
            "it is": "it's",
            "we are": "we're",
            "they are": "they're",
            "I have": "I've",
            "you have": "you've",
            "we have": "we've",
            "they have": "they've",
            "I will": "I'll",
            "you will": "you'll",
            "he will": "he'll",
            "she will": "she'll",
            "we will": "we'll",
            "they will": "they'll"
        }

        # Apply contractions (case-sensitive)
        for phrase, contraction in contractions.items():
            text = text.replace(phrase, contraction)

        return text

    def _match_style(self, text: str) -> str:
        """Apply learned user style patterns"""

        common_phrases = self.config["style"]["common_phrases"]

        # Add common user phrases occasionally
        if common_phrases and len(common_phrases) > 0:
            # Add phrase at start if appropriate
            phrase = random.choice(common_phrases)
            if not text.startswith(phrase) and len(text) > 100:
                text = phrase + ":\n\n" + text

        return text

    def learn_from(self, examples_path: str) -> None:
        """Learn user's writing style from examples"""

        path = Path(examples_path)
        if not path.exists():
            print(f"Error: {examples_path} not found")
            return

        # Read example files
        examples = []
        if path.is_file():
            with open(path, 'r') as f:
                examples.append(f.read())
        elif path.is_dir():
            for file in path.glob('*.md'):
                with open(file, 'r') as f:
                    examples.append(f.read())

        # Analyze style
        self._analyze_style(examples)

        print(f"Learned style from {len(examples)} examples")

    def _analyze_style(self, examples: List[str]) -> None:
        """Analyze writing style from examples"""

        all_sentences = []
        all_words = []

        for text in examples:
            sentences = re.split(r'(?<=[.!?])\s+', text)
            all_sentences.extend(sentences)

            words = text.split()
            all_words.extend(words)

        # Calculate stats
        sentence_lengths = [len(s.split()) for s in all_sentences if s.strip()]
        avg_length = sum(sentence_lengths) / len(sentence_lengths) if sentence_lengths else 15

        # Find common phrases (2-3 word sequences)
        phrases = {}
        for text in examples:
            words = text.lower().split()
            for i in range(len(words) - 1):
                phrase = ' '.join(words[i:i+2])
                phrases[phrase] = phrases.get(phrase, 0) + 1

        # Keep top 10 phrases
        top_phrases = sorted(phrases.items(), key=lambda x: x[1], reverse=True)[:10]
        common_phrases = [phrase for phrase, count in top_phrases if count >= 2]

        # Update profile
        self.style_profile.update({
            "avg_sentence_length": avg_length,
            "common_phrases": common_phrases,
            "total_examples": len(examples)
        })

        # Save profile
        profile_path = Path(__file__).parent / "style-profile.json"
        with open(profile_path, 'w') as f:
            json.dump(self.style_profile, f, indent=2)

        print(f"Style profile saved to {profile_path}")

    def show_profile(self) -> None:
        """Display current style profile"""

        profile_path = Path(__file__).parent / "style-profile.json"
        if not profile_path.exists():
            print("No style profile found. Learn from examples first.")
            return

        with open(profile_path, 'r') as f:
            profile = json.load(f)

        print("\n" + "="*50)
        print("STYLE PROFILE")
        print("="*50)
        print(f"Tone: {profile.get('tone', 'N/A')}")
        print(f"Directness: {profile.get('directness', 'N/A')}")
        print(f"Contractions: {profile.get('contractions', 'N/A')}")
        print(f"Avg sentence length: {profile.get('avg_sentence_length', 'N/A')} words")
        print(f"Common phrases ({len(profile.get('common_phrases', []))}):")
        for phrase in profile.get('common_phrases', [])[:5]:
            print(f"  - {phrase}")
        print("="*50 + "\n")


def main():
    parser = argparse.ArgumentParser(description='Humanize AI-generated text')
    parser.add_argument('input_file', nargs='?', help='Input file to humanize')
    parser.add_argument('--text', '-t', help='Text string to humanize')
    parser.add_argument('--learn', '-l', help='Learn style from example files/directory')
    parser.add_argument('--profile', '-p', action='store_true', help='Show current style profile')
    parser.add_argument('--test', action='store_true', help='Test with sample text')
    parser.add_argument('--compare', action='store_true', help='Show before/after comparison')

    args = parser.parse_args()

    humanizer = Humanizer()

    if args.profile:
        humanizer.show_profile()
    elif args.learn:
        humanizer.learn_from(args.learn)
    elif args.text:
        humanized = humanizer.humanize(args.text)
        print("\n" + "="*50)
        print("HUMANIZED OUTPUT:")
        print("="*50)
        print(humanized)
    elif args.test:
        test_text = """
Indeed, the solution—while complex—delves into navigating the
landscape of modern productivity. Furthermore, it certainly leverages
multiple strategies to optimize efficiency!

Furthermore, you can implement this easily! Additionally, it's
great for teams!
        """.strip()

        humanized = humanizer.humanize(test_text)

        print("\n" + "="*50)
        print("BEFORE (AI-generated):")
        print("="*50)
        print(test_text)

        print("\n" + "="*50)
        print("AFTER (Humanized):")
        print("="*50)
        print(humanized)
    elif args.compare:
        test_text = """
The project—while challenging—delves into various aspects of the
development landscape. Indeed, it certainly requires careful planning.
Furthermore, you should leverage modern tools to optimize the process!
        """.strip()

        humanized = humanizer.humanize(test_text)

        print("\n" + "="*50)
        print("BEFORE:")
        print("="*50)
        print(test_text)

        print("\n" + "="*50)
        print("AFTER:")
        print("="*50)
        print(humanized)
    elif args.input_file:
        with open(args.input_file, 'r') as f:
            text = f.read()

        humanized = humanizer.humanize(text)

        # Save to new file
        output_path = args.input_file.replace('.txt', '-humanized.txt')
        with open(output_path, 'w') as f:
            f.write(humanized)

        print(f"Humanized text saved to: {output_path}")
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
