#!/usr/bin/env python3
"""
xAI Whisper Audio Transcription CLI
Transcribes audio files using xAI's Grok Whisper API
"""

import os
import sys
import json
import argparse
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: requests library not installed. Run: pip3 install requests")
    sys.exit(1)

XAI_API_KEY = os.environ.get("XAI_API_KEY")
if not XAI_API_KEY:
    print("Error: XAI_API_KEY environment variable not set")
    print("Set it with: export XAI_API_KEY='your-key-here'")
    sys.exit(1)

API_URL = "https://api.x.ai/v1/audio/transcriptions"
MODEL = "grok-2-audio-preview"

def transcribe_audio(audio_path, timestamps=False, output=None):
    """Transcribe audio file using xAI Whisper API"""

    path = Path(audio_path)
    if not path.exists():
        print(f"Error: File not found: {audio_path}")
        sys.exit(1)

    if not path.suffix.lower().lstrip('.') in ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm']:
        print(f"Error: Unsupported audio format: {path.suffix}")
        print("Supported: MP3, MP4, MPEG, MPGA, M4A, WAV, WEBM")
        sys.exit(1)

    print(f"Transcribing: {audio_path}")
    print(f"Model: {MODEL}")

    headers = {
        "Authorization": f"Bearer {XAI_API_KEY}",
    }

    files = {
        'file': (path.name, open(audio_path, 'rb')),
        'model': (None, MODEL),
    }

    if timestamps:
        files['response_format'] = (None, 'verbose_json')
    else:
        files['response_format'] = (None, 'text')

    try:
        response = requests.post(API_URL, headers=headers, files=files, timeout=120)

        if response.status_code == 401:
            print("Error: Invalid API key")
            sys.exit(1)
        elif response.status_code == 413:
            print("Error: File too large (max 25MB)")
            sys.exit(1)
        elif response.status_code != 200:
            print(f"Error: API returned {response.status_code}")
            print(f"Details: {response.text}")
            sys.exit(1)

        result = response.json()

        if timestamps:
            transcript = result.get('text', '')
            segments = result.get('segments', [])
            print(f"\n{'='*60}")
            print("TRANSCRIPT")
            print(f"{'='*60}\n")
            print(transcript)
            print(f"\n{'-'*60}")
            print(f"Segments: {len(segments)}")
        else:
            transcript = result.get('text', '')
            print(f"\n{'='*60}")
            print("TRANSCRIPT")
            print(f"{'='*60}\n")
            print(transcript)

        if output:
            with open(output, 'w') as f:
                f.write(transcript)
            print(f"\nSaved to: {output}")

    except requests.exceptions.Timeout:
        print("Error: Request timed out (120s)")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Transcribe audio using xAI Whisper API')
    parser.add_argument('audio_file', help='Path to audio file')
    parser.add_argument('--timestamps', '-t', action='store_true',
                       help='Include timestamps in output')
    parser.add_argument('--output', '-o', help='Save transcript to file')
    args = parser.parse_args()

    transcribe_audio(args.audio_file, args.timestamps, args.output)

if __name__ == '__main__':
    main()
