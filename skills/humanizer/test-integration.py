#!/usr/bin/env python3
"""
Integration test for Humanizer skill
"""

import sys
sys.path.insert(0, '/Users/ava/.openclaw/workspace/skills/humanizer')
from humanizer import Humanizer

# Test humanization
humanizer = Humanizer()

ai_text = """
Indeed, the solution—while challenging—delves into navigating the
landscape of modern development. Furthermore, it certainly leverages
cutting-edge technologies to optimize efficiency! Furthermore, this
comprehensive approach ensures robust results!

Additionally, you can implement it easily! Moreover, it's great for teams!
"""

print("="*60)
print("AI-GENERATED TEXT:")
print("="*60)
print(ai_text)

humanized = humanizer.humanize(ai_text)

print("\n" + "="*60)
print("HUMANIZED OUTPUT:")
print("="*60)
print(humanized)
