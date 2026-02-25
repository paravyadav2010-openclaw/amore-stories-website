---
name: xai-whisper
version: 1.0.0
description: Transcribe audio files using xAI's Grok Whisper API
homepage: https://docs.x.ai
metadata:
  category: audio
  api_base: https://api.x.ai/v1
  capabilities:
    - audio-transcription
  dependencies:
    - python3
  interface: REST
openclaw:
  emoji: "🎙️"
  install:
    env:
      - XAI_API_KEY
author:
  name: Custom Skill
---

# xAI Whisper Audio Transcription

Transcribe audio files using xAI's Grok Whisper API. Supports MP3, MP4, MPEG, MPGA, M4A, WAV, and WEBM formats.

## Installation

Set your xAI API key as an environment variable:

```bash
export XAI_API_KEY="your-api-key-here"
```

Add to your shell profile (~/.zshrc or ~/.bashrc) for persistence:

```bash
echo 'export XAI_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

## Usage

### Transcribe Audio File

```bash
xai_whisper transcribe /path/to/audio.mp3
```

### Transcribe with Timestamps

```bash
xai_whisper transcribe /path/to/audio.mp3 --timestamps
```

### Output to File

```bash
xai_whisper transcribe /path/to/audio.mp3 --output transcript.txt
```

### Supported Audio Formats

- MP3
- MP4
- MPEG
- MPGA
- M4A
- WAV
- WEBM

## Model

Uses `grok-2-audio-preview` model for transcription via xAI API.

## API Reference

- Base URL: `https://api.x.ai/v1`
- Endpoint: `/audio/transcriptions`
- Model: `grok-2-audio-preview`
- Max file size: 25MB
- Max duration: ~2 hours

## Error Handling

- Invalid API key: 401 Unauthorized
- Invalid audio format: 400 Bad Request
- File too large: 413 Payload Too Large
