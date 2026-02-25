# Obsidian Git Sync - Simple Step-by-Step Guide

## Overview
This guide helps you sync your Obsidian vault across mobile and desktop devices using GitHub as a central hub.

---

## Step 1: Create GitHub Personal Access Token (One Time Only)

1. Go to: https://github.com/settings/tokens
2. Click: **Generate new token (classic)**
3. Name it: `Obsidian Sync` (or any name you prefer)
4. Expiration: Select **No expiration** (recommended for best experience)
5. Scopes: Select only these checkboxes:
   - ☑️ **repo** (Full control of private repositories)
   - ⬜ **workflow** (NOT needed)
   - ⬜ **gist** (NOT needed)
   - ⬜ **admin:org** (NOT needed)
6. Click: **Generate token**
7. 📋 **Copy the token** immediately (you won't see it again!)
8. Keep this tab open - you'll need it in Step 3

---

## Step 2: Set Up Desktop (Choose ONE Option)

### Option A: Clone to New Folder (Easier - Recommended)

1. Open **Terminal** on your Mac
2. Run this command:
   ```bash
   git clone git@github.com:paravyadav2010-openclaw/openclaw-workspace.git ~/Documents/Obsidian-Sync
   ```
3. Move your existing vault into the new folder:
   ```bash
   mv ~/Documents/"Obsidian Notes"/* ~/Documents/Obsidian-Sync/
   ```
4. Open **Obsidian** app
5. Go to: Settings → Open Folder
6. Select: `~/Documents/Obsidian-Sync`
7. Click: **Open**

✅ Done! Your desktop is now synced to GitHub.

---

### Option B: Initialize Git in Current Vault

1. Open **Terminal** on your Mac
2. Navigate to your vault:
   ```bash
   cd ~/Documents/"Obsidian Notes"
   ```
3. Initialize git repository:
   ```bash
   git init
   ```
4. Add remote repository:
   ```bash
   git remote add origin git@github.com:paravyadav2010-openclaw/openclaw-workspace.git
   ```
5. Add all files and commit:
   ```bash
   git add -A
   git commit -m "Initial commit: Obsidian vault"
   ```
6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

✅ Done! Your desktop is now synced to GitHub.

---

## Step 3: Set Up Mobile (iOS or Android)

### iOS (iPhone)

1. Open **App Store** on your iPhone
2. Search for: **Obsidian Git**
3. Install the app (by **Sylvia Gutschmidt**)
4. Open **Obsidian** app
5. Go to: Settings → Third-party plugin
6. Find: **Obsidian Git** → Enable it
7. Fill in these fields:
   - **Repository:** `git@github.com:paravyadav2010-openclaw/openclaw-workspace.git`
   - **Branch:** `main`
   - **Password:** Click "Generate Token" (do NOT paste token here)
8. In the popup:
   - Click: **Generate Token**
   - Go back to your GitHub Settings tab
   - 📋 Copy the token
   - Paste it into the password field
9. Tap: **Create Repository**
10. Tap: **Pull from GitHub** (to download your vault)

✅ Done! Your iPhone is now connected to GitHub.

---

### Android

1. Open **Obsidian** app
2. Go to: Settings → Third-party plugins
3. Tap: **Browse**
4. Search for: **Obsidian Git**
5. Install the plugin (by **Sylvia Gutschmidt**)
6. Go back to: Settings → Third-party plugin → Obsidian Git → Enable
7. Fill in same fields as iOS (see above)
8. Tap: **Pull from GitHub**

✅ Done! Your Android device is now connected to GitHub.

---

## Step 4: How It Works (Important!)

### Sync Flow:
```
Desktop → Push to GitHub ← ← Mobile: Pull from GitHub
```

### Editing Notes:
- **On Desktop:** Edit normally, Obsidian Git auto-syncs to GitHub
- **On Mobile:** Pull latest changes first, then edit
- ⚠️ **Don't edit same file on both devices simultaneously** - creates conflicts!

### What Gets Synced:
- ✅ All your notes (.md files)
- ✅ Plugins and settings
- ✅ Images and attachments
- ✅ All folders and subfolders

### What Does NOT Get Synced:
- ⚠️ Vault location (path in app settings)
- ⚠️ Theme settings
- ⚠️ Mobile app configuration (each device has its own)

---

## Step 5: Troubleshooting

### Problem: "No changes detected" on push
**Solution:** Run `git add -A` before committing

### Problem: Merge conflicts
**Solution:**
- On mobile: Pull first, then edit
- Resolve conflicts in Obsidian (they show as `<<<<<<<` and `>>>>>>>`)
- On desktop: Auto-sync after mobile pulls

### Problem: Can't push to GitHub
**Solution:**
1. Check GitHub token is not expired (regenerate if needed)
2. Verify repository URL is correct:
   `git@github.com:paravyadav2010-openclaw/openclaw-workspace.git`
3. Check internet connection

### Problem: Mobile not syncing
**Solution:**
1. Check Obsidian Git plugin is enabled
2. Tap the sync button manually
3. Check repository URL matches (exact copy-paste)
4. Verify token is pasted correctly

---

## Quick Reference Card

```
📋 GitHub Token: Generate at https://github.com/settings/tokens
🖥 Desktop: Choose Option A or B (see Step 2)
📱 Mobile: Install Obsidian Git plugin (iOS/Android)

Sync Flow:
Desktop edit → Auto-push → GitHub ← Mobile pull → Edit → Push → GitHub
```

---

## Need Help?

If something goes wrong, tell me:
- Which step you're on
- What error message you see
- Which device (Mac, iPhone, or Android)

I'll help you fix it! 🚀
