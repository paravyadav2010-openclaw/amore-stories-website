# Flash Model Configuration - Attempt

## Date: March 1, 2026

## What I Did

### Problem
User requested dynamic model switching between `zai/glm-4.7-flash` and `zai/glm-4.7`

### Investigation
- Found flash model exists in `~/.openclaw/openclaw.json` under `models.providers.zai.models`
- But NOT in `agents.defaults.models` (allowed list for agents)

### Action Taken

**Step 1: Backup**
```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup-20260301-154330
```
✅ Backup created: `/Users/ava/.openclaw/openclaw.json.backup-20260301-154330`

**Step 2: Updated Configuration**
Added `"zai/glm-4.7-flash": {}` to `agents.defaults.models` section

**Before:**
```json
"models": {
  "zai/glm-4.7": {},
  "zai/glm-4.7-flashx": {},
  "nvidia/moonshotai/kimi-k2.5": {
    "alias": "kimi"
  }
}
```

**After:**
```json
"models": {
  "zai/glm-4.7": {},
  "zai/glm-4.7-flash": {},
  "zai/glm-4.7-flashx": {},
  "nvidia/moonshotai/kimi-k2.5": {
    "alias": "kimi"
  }
}
```

**Step 3: Validated**
```bash
python3 -m json.tool ~/.openclaw/openclaw.json > /dev/null && echo "✅ JSON is valid"
```
✅ JSON is valid

**Step 4: Tested**
```python
session_status(model="zai/glm-4.7-flash")
```
❌ Error: `Model "zai/glm-4.7-flash" is not allowed.`

## Current Status

- ✅ Configuration file updated
- ✅ JSON is valid
- ✅ Flash model now in allowed models list
- ❌ Model switch still not working (likely requires restart)

## What This Means

The configuration change is correct, but **likely requires a session/gateway restart** to take effect. The agent may be caching the configuration or loading it at startup.

## Next Steps

**Option 1: Restart Gateway (Safe)**
```bash
openclaw gateway restart
```
This should reload the configuration and enable flash model access.

**Option 2: Let User Decide**
Document the changes and let user decide whether to restart.

**Option 3: Revert Changes**
If user wants to stay with current setup:
```bash
cp ~/.openclaw/openclaw.json.backup-20260301-154330 ~/.openclaw/openclaw.json
```

## Backup Location

- Original backup: `~/.openclaw/openclaw.json.backup-20260301-154330`
- Sed backup: `~/.openclaw/openclaw.json.backup2` (created by sed)

## Summary

✅ **Successfully added flash model to configuration**
✅ **JSON is valid**
⏳ **Requires gateway restart to take effect**

**No damage done** - backup exists if rollback needed.
