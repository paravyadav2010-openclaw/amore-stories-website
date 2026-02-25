# 🚀 Productivity Dashboard (Admin Prototype)

<div class="prod-dashboard-wrapper"></div>

```dataviewjs
try {
// ==========================================
// 🚀 PRODUCTIVITY DASHBOARD (Functional - Copied from Home Dashboard)
// ==========================================

// 1. DATA SOURCES (OPTIMIZED - no full vault scans)
const inbox = dv.pages('"1. Inbox"').limit(5);
const projects = dv.pages('"4. Goals & Projects"').where(p => p.status === "active").limit(3);
const reading = dv.pages('"2. Sources/Books"').where(p => p.status === "reading" || p.status === "to read").limit(2);

// OPTIMIZED: Only scan specific folders for recents instead of entire vault
const recents = dv.pages('"3. Permanent Notes" or "1. Inbox" or "4. Goals & Projects"')
    .sort(p => p.file.mtime, 'desc')
    .limit(5);


// ===================================
// 🧠 UTILITY FUNCTIONS (From Home Dashboard)
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
    const journalPath = `3. Permanent Notes/Daily Notes/Journal ${today}.md`;
    const existingJournal = app.vault.getAbstractFileByPath(journalPath);
    
    if (existingJournal) {
      await app.workspace.openLinkText(journalPath, "", false);
      new Notice("📔 Opened today's journal");
    } else {
      await createNote("Template - Hybrid Journal", "3. Permanent Notes/Daily Notes");
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
const container = document.querySelector(".prod-dashboard-wrapper");
if (container) {
    container.innerHTML = "";
    
    // 3. STYLES
    const style = document.createElement("style");
    style.textContent = `
    :root {
        --pd-bg-page: #F9FAFB;
        --pd-bg-card: #FFFFFF;
        --pd-primary: #FCD34D;
        --pd-text-main: #111827;
        --pd-text-muted: #6B7280;
        --pd-radius: 20px;
        --pd-shadow-soft: 0 10px 40px -10px rgba(0,0,0,0.05);
        --pd-shadow-hover: 0 20px 40px -10px rgba(0,0,0,0.08);
        --pd-border: 1px solid rgba(0,0,0,0.04);
    }

    .prod-dashboard {
        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        background: radial-gradient(circle at top right, #FEF3C7 0%, rgba(255,255,255,0) 30%), var(--pd-bg-page);
        border-radius: 24px;
        padding: 32px;
        color: var(--pd-text-main);
        width: 100%;
        max-width: 100%; 
        min-height: 80vh;
    }
    
    .pd-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; border-bottom: var(--pd-border); padding-bottom: 24px; }
    .pd-welcome h1 { font-size: 2.5em; font-weight: 800; letter-spacing: -0.03em; margin:0; line-height:1.1; color: #111827; }
    .pd-welcome p { font-size: 1.1em; color: var(--pd-text-muted); margin: 8px 0 0 0; font-weight: 500; }
    .pd-user-badge { display: flex; gap: 12px; align-items: center; background: #FFF; padding: 8px 16px 8px 8px; border-radius: 99px; box-shadow: var(--pd-shadow-soft); border: var(--pd-border); }
    .pd-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--pd-primary); overflow: hidden; }
    .pd-avatar img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; }

    .pd-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 40px; }
    .pd-btn {
        display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px;
        border-radius: 16px; font-size: 0.9em; font-weight: 600; 
        background: #FFF; border: var(--pd-border); color: #4B5563; 
        cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .pd-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px -4px rgba(0,0,0,0.08); color: #111827; }
    .pd-btn.accent { background: #111827; color: #FFF; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .pd-btn.accent:hover { background: #000; }

    .pd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 32px; }
    .pd-col { display: flex; flex-direction: column; gap: 24px; }
    .pd-card { background: var(--pd-bg-card); border-radius: var(--pd-radius); padding: 28px; box-shadow: var(--pd-shadow-soft); border: var(--pd-border); display: flex; flex-direction: column; }
    .pd-card-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .pd-card-t { font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9CA3AF; }
    .pd-pill { background: #F3F4F6; padding: 4px 10px; border-radius: 8px; font-size: 0.75em; font-weight: 700; color: #4B5563; }

    .pd-item { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; transition: background 0.1s; cursor: pointer; }
    .pd-item:hover { background: #F9FAFB; }
    .pd-icon-box { width: 40px; height: 40px; border-radius: 10px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 1.2em; flex-shrink: 0; }
    .pd-meta { margin-left: auto; font-size: 0.75em; color: #9CA3AF; font-weight: 500; }
    
    .pd-proj-item { border: 1px solid #F3F4F6; padding: 16px; border-radius: 16px; margin-bottom: 12px; transition:all 0.2s; cursor:pointer; }
    .pd-proj-item:hover { border-color: #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: scale(1.01); background:#FFF; }
    `;
    container.appendChild(style);

    // 4. STRUCTURE
    const html = `
    <div class="prod-dashboard">
        <header class="pd-header">
            <div class="pd-welcome"><h1>Ready to focus,<br><span style="color:#D1D5DB;">Praveen?</span></h1><p>${moment().format("dddd, MMMM Do")}</p></div>
            <div class="pd-user-badge">
                <div class="pd-avatar"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTNb_HdyL3fP5rbEb8XnBcwwN6tzEgiyLbk6ux4AQw_qWJet-gijbsjM-fr6_EeHNBKGxvVTpLWA1LuoNYsk5QrqOyUrg9CxSi53uF3HU-ybfiVXVVv3RndDNuncWk0mlAf94tKC8uGBz_-8BLO5w8bP3f0u_uoDY4Cfasx4M2GtUL4GzNqsu7_E-gD_F_PrdNIY9IPXqlJbRGxzyDslmZVU9frJF3NS__YC8Z0FgpSc1bzJztDP79ozIXtXL5h3CSx3e9Awtm-o8m"></div>
            </div>
        </header>

        <section class="pd-actions"></section>

        <div class="pd-grid">
            <div class="pd-col">
                <div class="pd-card"><div class="pd-card-h"><div class="pd-card-t">Inbox</div><div class="pd-pill">${inbox.length}</div></div><div class="pd-inbox-list"></div></div>
            </div>
            <div class="pd-col">
                <div class="pd-card" style="background:transparent; box-shadow:none; border:none; padding:0;"><div class="pd-card-h"><div class="pd-card-t">Active Projects</div></div><div class="pd-proj-list"></div></div>
            </div>
            <div class="pd-col">
                 <div class="pd-card"><div class="pd-card-h"><div class="pd-card-t">Reading</div><div class="pd-pill">${reading.length}</div></div><div class="pd-read-list"></div></div>
                 <div class="pd-card" style="margin-top:24px;"><div class="pd-card-h"><div class="pd-card-t">Recently Edited</div></div><div class="pd-recent-list"></div></div>
            </div>
        </div>
    </div>
    `;
    container.innerHTML += html;

    // 5. INJECT BUTTONS (Exact Copy from Home Dashboard)
    const actionEl = container.querySelector(".pd-actions");
    
    // ✎ Note (with Capture Menu)
    const btnNote = document.createElement("button");
    btnNote.className = "pd-btn";
    btnNote.innerHTML = "✎ Note";
    btnNote.onclick = (e) => handleCaptureMenu(e);
    actionEl.appendChild(btnNote);
    
    // ⚡ Project
    const btnProject = document.createElement("button");
    btnProject.className = "pd-btn accent";
    btnProject.innerHTML = "⚡ Project";
    btnProject.onclick = () => createNote("Template - Project", "4. Goals & Projects");
    actionEl.appendChild(btnProject);
    
    // 👤 Client
    const btnClient = document.createElement("button");
    btnClient.className = "pd-btn";
    btnClient.innerHTML = "👤 Client";
    btnClient.onclick = () => createNote("Template - Client", "5. Photography Business/Clients");
    actionEl.appendChild(btnClient);
    
    // 📖 Book
    const btnBook = document.createElement("button");
    btnBook.className = "pd-btn";
    btnBook.innerHTML = "📖 Book";
    btnBook.onclick = () => createNote("Template - Book Note", "2. Sources/Books");
    actionEl.appendChild(btnBook);
    
    // ⏯️ Watch/Listen
    const btnWatch = document.createElement("button");
    btnWatch.className = "pd-btn";
    btnWatch.innerHTML = "⏯️ Watch/Listen";
    btnWatch.onclick = () => createNote("Template - Media Capture", "1. Inbox");
    actionEl.appendChild(btnWatch);
    
    // 📔 Journal (Smart: Open if exists, Create if not)
    const btnJournal = document.createElement("button");
    btnJournal.className = "pd-btn";
    btnJournal.innerHTML = "📔 Journal";
    btnJournal.onclick = () => createOrOpenJournal();
    actionEl.appendChild(btnJournal);
    
    // 🧹 Cleanup (Janitor)
    const btnCleanup = document.createElement("button");
    btnCleanup.className = "pd-btn";
    btnCleanup.innerHTML = "🧹 Cleanup";
    btnCleanup.onclick = () => createNote("Template - Janitor (Tidy Vault)", "1. Inbox");
    actionEl.appendChild(btnCleanup);

    // 6. INJECT DATA ITEMS
    const inboxEl = container.querySelector(".pd-inbox-list");
    inbox.forEach(p => {
        const item = document.createElement("div"); item.className = "pd-item";
        item.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
        item.innerHTML = `<div class="pd-icon-box">📥</div><div style="font-weight:600; font-size:0.95em;">${p.file.name}</div><div class="pd-meta">${p.file.ctime.toFormat("MMM d")}</div>`;
        inboxEl.appendChild(item);
    });

    const projEl = container.querySelector(".pd-proj-list");
    projects.forEach(p => {
        const item = document.createElement("div"); item.className = "pd-proj-item";
        item.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
        item.innerHTML = `<div style="font-weight:700; font-size:1.1em; margin-bottom:4px;">${p.file.name}</div><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:0.75em; color:#9CA3AF;">Updates pending</span><span style="font-size:0.65em; background:#E0E7FF; color:#3730A3; padding:4px 10px; border-radius:99px; font-weight:700;">ACTIVE</span></div>`;
        projEl.appendChild(item);
    });
    
    const readEl = container.querySelector(".pd-read-list");
    reading.forEach(p => {
        const item = document.createElement("div"); item.className = "pd-item";
        let icon = "📚"; if(p.cover_url) icon = `<div style="width:100%; height:100%; background:url('${p.cover_url}') center/cover;"></div>`;
        item.innerHTML = `<div class="pd-icon-box" style="overflow:hidden;">${icon}</div><div><div style="font-weight:600; font-size:0.95em;">${p.file.name}</div><div style="font-size:0.75em; color:#9CA3AF;">${p.author || "Reading"}</div></div>`;
        readEl.appendChild(item);
    });

    const recentEl = container.querySelector(".pd-recent-list");
    recents.forEach(p => {
        const item = document.createElement("div"); item.className = "pd-item";
        item.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
        item.innerHTML = `<div style="width:6px; height:6px; background:#E5E7EB; border-radius:50%;"></div><div style="font-weight:500; font-size:0.9em; color:#4B5563;">${p.file.name}</div><div class="pd-meta">${p.file.mtime.toRelative()}</div>`;
        recentEl.appendChild(item);
    });

}
} catch(e) { dv.paragraph("❌ Error: " + e.message); }
```
