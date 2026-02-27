# OpenClaw Update Summary - 2026.2.25

## 📦 Latest Version: 2026.2.25
**Published:** 17 hours ago
**Updated From:** 2026.2.23

---

## ✨ Key Changes in 2026.2.25

### 🤖 Android Chat Improvements
- Better streaming delivery handling
- Improved markdown rendering (GitHub-flavored)
- Enhanced native chat UI experience

### 🔧 Maintenance & Stability
- Delivery queue recovery with backoff prevention
- Google Chat lifecycle fixes (prevents restart loops)
- Nextcloud Talk shutdown improvements
- Queue drain reliability enhancements

### 💬 Messaging Channels
- **Microsoft Teams:** Fixed file upload completion flow
- **Telegram:** Retry backoff for unauthorized failures (prevents bot bans)
- **Telegram:** Group inline button handling improvements
- **Telegram:** Webhook startup guidance clarified

### 🌐 Browser & Relay
- Chrome extension handshake improvements
- Extension relay init deduplication
- WebSocket-first by default for OpenAI Codex
- Better relay CORS handling

### 🤖 Node & Canvas
- Android device capability support
- Default canvas node resolution improvements
- Device status/info commands

### 🔒 Security Enhancements
- Node exec approvals hardened
- Plugin channel HTTP auth improvements
- Gateway node pairing security
- Sandbox path alias guards
- Workspace FS boundary hardening
- Config includes safety

### 📊 Admin & Tools
- External Secrets Management (full workflow)
- ACP agent runtime improvements
- Agents routing CLI bindings
- Typing indicator safety nets

### 🛠️ Bug Fixes
- 50+ fixes across delivery, lifecycle, typing, sync
- Better error handling and edge cases
- Improved reliability and stability

---

## ⏳ Coming in 2026.2.26 (Unreleased)

### 🔒 Major Security Updates
- Node exec approvals (require structured approvals)
- Enhanced sandbox security
- Workspace boundary enforcement

### 🤖 New Features
- Android device management capabilities
- Improved agents integration
- Better multi-account support

### 🐛 More Fixes
- Gateway restart loop hardening (macOS)
- Typing cleanup improvements
- Better file upload handling

---

## 📝 Notes

- **Node.js compatibility:** Minor warnings with v25.5.0 (not blocking)
- **Deprecation notices:** Some old packages need updates (glob, node-domexception)
- **Recommendation:** Update glob package when possible

**Status:** ✅ OpenClaw updated and stable

---

*Last Updated: 2026-02-27*
