#!/usr/bin/env python3
"""
Melbourne Moving Tracker — Progress & Timeline Manager

Usage:
    python3 moving-tracker.py                    # Show overall progress
    python3 moving-tracker.py --phase <name>      # Show specific phase tasks
    python3 moving-tracker.py --checklist        # Print full checklist
    python3 moving-tracker.py --timeline         # Print timeline overview
"""

import re
import argparse
from datetime import datetime
from pathlib import Path

# Configuration
MOVE_DATE_MONTH = 3  # March 2026
MOVE_DATE_YEAR = 2026

# Current date calculation
TODAY = datetime.now()

def parse_checklist():
    """Parse MOVING_CHECKLIST.md and extract tasks"""
    checklist_path = Path(__file__).parent / "MOVING_CHECKLIST.md"

    if not checklist_path.exists():
        print(f"❌ Error: MOVING_CHECKLIST.md not found at {checklist_path}")
        return None

    with open(checklist_path, 'r') as f:
        content = f.read()

    # Parse phases and tasks
    phases = {}
    current_phase = None
    total_tasks = 0
    completed_tasks = 0

    for line in content.split('\n'):
        # Phase headers
        if line.startswith('## '):
            current_phase = line[3:].strip()
            phases[current_phase] = {'tasks': [], 'completed': 0, 'total': 0}
        # Task items
        elif line.startswith('- [ ]') and current_phase:
            task = line[6:].strip()
            phases[current_phase]['tasks'].append({'text': task, 'done': False})
            phases[current_phase]['total'] += 1
            total_tasks += 1
        elif line.startswith('- [x]') and current_phase:
            task = line[6:].strip()
            phases[current_phase]['tasks'].append({'text': task, 'done': True})
            phases[current_phase]['completed'] += 1
            phases[current_phase]['total'] += 1
            completed_tasks += 1
            total_tasks += 1

    return phases, total_tasks, completed_tasks

def calculate_progress_bar(percent, width=20):
    """Generate ASCII progress bar"""
    filled = int(width * percent / 100)
    empty = width - filled
    return '█' * filled + '░' * empty

def print_overall_progress(phases, total_tasks, completed_tasks):
    """Print overall progress summary"""
    if total_tasks == 0:
        print("⚠️  No tasks found in checklist")
        return

    overall_percent = (completed_tasks / total_tasks) * 100

    print(f"\n{'='*60}")
    print(f"  🏠 MELBOURNE MOVE TRACKER — {MOVE_DATE_MONTH}/{MOVE_DATE_YEAR}")
    print(f"{'='*60}")
    print(f"\n📊 Overall Progress: {completed_tasks}/{total_tasks} tasks completed")
    print(f"   [{calculate_progress_bar(overall_percent)}] {overall_percent:.1f}%")

    # Time until move
    move_date = datetime(MOVE_DATE_YEAR, MOVE_DATE_MONTH, 1)
    days_until_move = (move_date - TODAY).days
    print(f"\n📅 Move Date: {move_date.strftime('%B %Y')} ({days_until_move} days away)")
    print(f"🗓️  Today: {TODAY.strftime('%d %B %Y')}")

    print(f"\n{'='*60}")
    print("  PHASE BREAKDOWN")
    print(f"{'='*60}\n")

    for phase_name, phase_data in phases.items():
        if phase_data['total'] > 0:
            phase_percent = (phase_data['completed'] / phase_data['total']) * 100
            print(f"📋 {phase_name}")
            print(f"   [{calculate_progress_bar(phase_percent)}] {phase_data['completed']}/{phase_data['total']} ({phase_percent:.0f}%)")

    print(f"\n{'='*60}\n")

def print_phase_tasks(phases, phase_name):
    """Print tasks for a specific phase"""
    # Find matching phase (fuzzy match)
    matching_phase = None
    for name in phases.keys():
        if phase_name.lower() in name.lower():
            matching_phase = name
            break

    if not matching_phase:
        print(f"❌ Phase '{phase_name}' not found")
        print(f"\nAvailable phases:")
        for name in phases.keys():
            print(f"  - {name}")
        return

    phase_data = phases[matching_phase]
    print(f"\n{'='*60}")
    print(f"  {matching_phase.upper()}")
    print(f"{'='*60}")
    print(f"\nProgress: {phase_data['completed']}/{phase_data['total']} tasks\n")

    for task in phase_data['tasks']:
        status = "✅" if task['done'] else "⬜"
        print(f"  {status} {task['text']}")

    print(f"\n{'='*60}\n")

def print_full_checklist(phases):
    """Print full checklist with status"""
    print(f"\n{'='*60}")
    print(f"  FULL MOVING CHECKLIST")
    print(f"{'='*60}\n")

    for phase_name, phase_data in phases.items():
        print(f"## {phase_name}")
        print(f"({phase_data['completed']}/{phase_data['total']} completed)\n")
        for task in phase_data['tasks']:
            checkbox = "- [x]" if task['done'] else "- [ ]"
            print(f"{checkbox} {task['text']}")
        print()

def print_timeline():
    """Print timeline overview"""
    print(f"\n{'='*60}")
    print(f"  TIMELINE OVERVIEW")
    print(f"{'='*60}\n")

    timeline = [
        ("Planning Phase", "Now - 2 months before", "Research, documentation, bookings"),
        ("Execution Phase", "2 months - 2 weeks before", "Visa, banking, property search"),
        ("Final Countdown", "2 weeks - move day", "Packing, utilities, final arrangements"),
        ("Settling In", "Move day - 1 month", "Enrollment, transport, getting settled"),
    ]

    print(f"{'Phase':<20} {'Timeframe':<30} {'Focus':<50}\n")
    print("-" * 100)
    for phase, timeframe, focus in timeline:
        print(f"{phase:<20} {timeframe:<30} {focus:<50}")

    print(f"\n{'='*60}\n")

def main():
    parser = argparse.ArgumentParser(description='Melbourne Moving Tracker')
    parser.add_argument('--phase', type=str, help='Show tasks for specific phase')
    parser.add_argument('--checklist', action='store_true', help='Print full checklist')
    parser.add_argument('--timeline', action='store_true', help='Print timeline overview')

    args = parser.parse_args()

    # Parse checklist
    result = parse_checklist()
    if result is None:
        return

    phases, total_tasks, completed_tasks = result

    # Handle command-line arguments
    if args.timeline:
        print_timeline()
    elif args.phase:
        print_phase_tasks(phases, args.phase)
    elif args.checklist:
        print_full_checklist(phases)
    else:
        # Default: show overall progress
        print_overall_progress(phases, total_tasks, completed_tasks)

if __name__ == '__main__':
    main()
