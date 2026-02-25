# 🚀 Obsidian Knots - Dashboard

<div class="dashboard-wrapper"></div>

```dataviewjs
try {
// ==========================================
// 🚀 OBSIDIAN KNOTS DASHBOARD
// ==========================================

// 1. DATA SOURCES (OPTIMIZED - no full vault scans)
const inbox = dv.pages('"1. Inbox"').where(p => !p.file.name.includes(".wav")).limit(5);
const projects = dv.pages('"4. Goals & Projects"').where(p => p.status === "active").limit(3);
const reading = dv.pages('"2. Sources/Books"').where(p => p.status === "reading" || p.status === "to read").limit(2);
const permanent = dv.pages('"3. Permanent Notes/Zettelkasten/Concepts"').limit(3);

// OPTIMIZED: Only scan specific folders for recents
const recents = dv.pages('"3. Permanent Notes/Zettelkasten" or "1. Inbox" or "4. Goals & Projects"')
    .sort(p => p.file.mtime, 'desc')
    .limit(5);


// ===================================
// 🧠 UTILITY FUNCTIONS
// ===================================

const createNote = async (templateName, folder) => {
  const tpPlugin = app.plugins.plugins["templater-obsidian"];
  if (!tpPlugin) { new Notice("Templater not loaded"); return; }
  const tp = tpPlugin.templater;
  const templateFile = app.vault.getAbstractFileByPath(`Templates/${templateName}.md`);
  if (!templateFile) { new Notice("Template not found: " + templateName); return; }
  try { await tp.create_new_note_from_template(templateFile, folder); }
  catch (e) { new Notice("Error: " + e.message); }
}

const createOrOpenJournal = async () => {
  try {
    const today = moment().format("YYYY-MM-DD");
    const journalPath = `"4. Permanent Notes/Daily Notes/Journal ${today}.md"`;
    const existingJournal = app.vault.getAbstractFileByPath(journalPath);
    
    if (existingJournal) {
      await app.workspace.openLinkText(journalPath, "", false);
      new Notice("📔 Opened today's journal");
    } else {
      await createNote("Template - Daily Journal", "4. Permanent Notes/Daily Notes");
      new Notice("📔 Created today's journal!");
    }
  } catch (err) {
    new Notice("❌ Error: " + err.message);
  }
}

// Recording State for Note/Capture
const toggleRecording = () => {
    if (window.isThinkRecording) {
        window.isThinkRecording = false;
        app.commands.executeCommandById("audio-recorder:stop");
        new Notice("💾 Saving...");
        setTimeout(() => createNote("Template - Voice Transcription", "1. Inbox"), 1500);
    } else {
        window.isThinkRecording = true;
        app.commands.executeCommandById("audio-recorder:start");
        new Notice("🎙️ Recording...");
    }
}

const handleCaptureMenu = (e) => {
    e.stopPropagation();
    if (window.isThinkRecording) { toggleRecording(); return; }

    const existing = document.querySelector(".quick-capture-menu");
    if (existing) { existing.remove(); return; }

    const menu = document.body.createEl("div", { cls: "quick-capture-menu" });
    Object.assign(menu.style, {
        position: "fixed", top: (e.clientY + 10) + "px", left: (e.clientX - 50) + "px",
        background: "var(--background-primary)", border: "1px solid var(--background-modifier-border)",
        borderRadius: "8px", padding: "6px", zIndex: "9999", display: "flex", flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)", minWidth: "160px"
    });
    
    const opt = (label, action) => {
        const i = menu.createDiv();
        i.innerText = label;
        Object.assign(i.style, { padding: "10px", cursor: "pointer", borderRadius: "4px", fontSize: "0.9em" });
        i.onmouseenter = () => i.style.background = "var(--background-modifier-hover)";
        i.onmouseleave = () => i.style.background = "transparent";
        i.onclick = () => { action(); menu.remove(); document.removeEventListener("click", closeFn); };
    }
    
    opt("✍️ Type Note", () => createNote("Template - Smart Capture", "1. Inbox"));
    opt("🧠 Think Mode", () => toggleRecording());

    const closeFn = (ev) => { if (!menu.contains(ev.target)) menu.remove(); };
    document.addEventListener("click", closeFn, {once:true});
}


// 2. RENDER CONTAINER
const container = document.querySelector(".dashboard-wrapper");
if (container) {
    container.innerHTML = "";
    
    // 3. STYLES
    const style = document.createElement("style");
    style.textContent = `
    :root {
        --dashboard-bg: #F9FAFB;
        --dashboard-card: #FFFFFF;
        --dashboard-primary: #4F46E5;
        --dashboard-text: #111827;
        --dashboard-muted: #6B7280;
        --dashboard-radius: 16px;
        --dashboard-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .dashboard {
        font-family: 'Inter', sans-serif;
        background: var(--dashboard-bg);
        border-radius: 20px;
        padding: 32px;
        color: var(--dashboard-text);
    }
    
    .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .dash-title h1 { font-size: 2em; font-weight: 700; margin:0; }
    .dash-title p { font-size: 1em; color: var(--dashboard-muted); margin: 4px 0 0 0; }
    
    .dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .dash-col { display: flex; flex-direction: column; gap: 20px; }
    .dash-card { background: var(--dashboard-card); border-radius: var(--dashboard-radius); padding: 24px; box-shadow: var(--dashboard-shadow); }
    .dash-card h3 { font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.05em; color: var(--dashboard-muted); margin: 0 0 16px 0; font-weight: 600; }
    
    .dash-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 12px; font-size: 0.9em; font-weight: 500; cursor: pointer; transition: all 0.2s; background: #F3F4F6; color: #374151; border: none; }
    .dash-btn:hover { background: #E5E7EB; transform: translateY(-1px); }
    .dash-btn.primary { background: var(--dashboard-primary); color: white; }
    .dash-btn.primary:hover { background: #4338CA; }
    
    .dash-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
    .dash-item:last-child { border-bottom: none; }
    .dash-item-name { font-weight: 500; font-size: 0.95em; }
    .dash-item-meta { margin-left: auto; font-size: 0.75em; color: var(--dashboard-muted); }
    `;
    container.appendChild(style);

    // 4. STRUCTURE
    const html = `
    <div class="dashboard">
        <header class="dash-header">
            <div class="dash-title">
                <h1>👋 Welcome back, Praveen</h1>
                <p>${moment().format("dddd, MMMM Do, YYYY")}</p>
            </div>
            <div class="dash-links">
                <a href="#" class="dash-btn" onclick="app.workspace.openLinkText('00. Home (Dashboard)', '', false)">🏠 Home</a>
            </div>
        </header>

        <div class="dash-grid">
            <div class="dash-col">
                <div class="dash-card">
                    <h3>📥 Quick Capture</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <button class="dash-btn" onclick="window.promptCapture(event)">✍️ Type Note</button>
                        <button class="dash-btn" onclick="window.promptThink(event)">🧠 Think Mode</button>
                        <button class="dash-btn" onclick="createOrOpenJournal()">📔 Journal</button>
                        <button class="dash-btn" onclick="createNote('Template - Project', '4. Goals & Projects')">⚡ Project</button>
                        <button class="dash-btn" onclick="createNote('Template - Book Note', '2. Sources/Books')">📖 Book</button>
                    </div>
                </div>
            </div>
            <div class="dash-col">
                <div class="dash-card">
                    <h3>📊 Your Space</h3>
                    <div class="dash-item">
                        <span class="dash-item-name">📥 Inbox</span>
                        <span class="dash-item-meta">${inbox.length} items</span>
                    </div>
                    <div class="dash-item">
                        <span class="dash-item-name">🎯 Active Projects</span>
                        <span class="dash-item-meta">${projects.length} projects</span>
                    </div>
                    <div class="dash-item">
                        <span class="dash-item-name">📚 Reading</span>
                        <span class="dash-item-meta">${reading.length} books</span>
                    </div>
                    <div class="dash-item">
                        <span class="dash-item-name">💡 Concepts</span>
                        <span class="dash-item-meta">${permanent.length} zettels</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="dash-grid" style="margin-top: 24px;">
            <div class="dash-col">
                <div class="dash-card">
                    <h3>📬 Inbox Items</h3>
                    <div id="inbox-list"></div>
                </div>
            </div>
            <div class="dash-col">
                <div class="dash-card">
                    <h3>🎯 Active Projects</h3>
                    <div id="projects-list"></div>
                </div>
            </div>
            <div class="dash-col">
                <div class="dash-card">
                    <h3>💡 Recent Notes</h3>
                    <div id="recent-list"></div>
                </div>
            </div>
        </div>
    </div>
    `;
    container.innerHTML += html;

    // 5. BUTTON EVENT HANDLERS
    window.promptCapture = (e) => {
        e.stopPropagation();
        createNote("Template - Smart Capture", "1. Inbox");
    };
    window.promptThink = (e) => {
        e.stopPropagation();
        toggleRecording();
    };

    // 6. INJECT DATA ITEMS
    const inboxEl = container.querySelector("#inbox-list");
    inbox.forEach(p => {
        const item = document.createElement("div"); item.className = "dash-item";
        item.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
        item.innerHTML = `<div class="dash-item-name">${p.file.name}</div><div class="dash-item-meta">${p.file.ctime.toFormat("MMM d")}</div>`;
        inboxEl.appendChild(item);
    });

    const projEl = container.querySelector("#projects-list");
    projects.forEach(p => {
        const item = document.createElement("div"); item.className = "dash-item";
        item.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
        item.innerHTML = `<div class="dash-item-name">${p.file.name}</div><div class="dash-item-meta">${p.status || "Active"}</div>`;
        projEl.appendChild(item);
    });
    
    const permEl = container.querySelector("#recent-list");
    permanent.forEach(p => {
        const item = document.createElement("div"); item.className = "dash-item";
        item.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
        item.innerHTML = `<div class="dash-item-name">${p.file.name}</div><div class="dash-item-meta">Zettelkasten</div>`;
        permEl.appendChild(item);
    });

}
} catch(e) { dv.paragraph("❌ Error: " + e.message); }
```

---

## 📖 Quick Navigation

- 🏠 **Home** — `00. Home (Dashboard)`
- 📝 **Journal** — `01-Journal/`
- 📥 **Inbox** — `02-Inbox/`
- 📚 **Sources** — `03-Sources/`
- 💡 **Permanent Notes** — `04-Permanent Notes/Zettelkasten/`
- 🎯 **Goals & Projects** — `05-Goals & Projects/`
- 💼 **Business** — `06-Business/`
- 🏠 **Home Life** — `07-Home Life/`
- 📁 **Archive** — `08-Archive/`
- 📄 **Templates** — `09-Templates/`
- 📎 **Attachments** — `10-Attachments/`

---

## 🚀 How to Use This Dashboard

1. **Quick Capture** — Use the buttons to create notes, projects, or open your journal
2. **Think Mode** — Click "Think Mode" to start voice recording for AI-powered notes
3. **Navigation** — Use the quick links to jump to any folder

**Tip:** Click any item in the lists to open that note directly.
